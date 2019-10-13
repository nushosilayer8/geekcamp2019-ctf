const path = require('path');
const { PassThrough } = require('stream');

const Koa = require('koa');
const koaStatic = require('koa-static');
const koaBodyParser = require('koa-bodyparser');
const app = new Koa();

const jwt = require('jsonwebtoken');

const r = require('rethinkdb');
let conn = null;
r.connect({
	host: 'localhost',
	port: 28015,
	db: 'chatapp',
}).then(async c => {
	conn = c;
	try {
		await r.dbDrop('chatapp').run(conn);
	} catch(e) {}
	await r.dbCreate('chatapp').run(conn);
	try {
		await r.db('chatapp').tableDrop('messages').run(conn);
	} catch(e) {}
	await r.db('chatapp').tableCreate('messages').run(conn);
	// create indexes
	await r.db('chatapp').table('messages').indexCreate('when').run(conn);
	console.log('Database reset and ready');
}).catch(e => console.error(e));

app.use(koaBodyParser());
app.use(async (ctx, next) => {
	// CORS
	ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000');
	ctx.set('Access-Control-Allow-Methods', 'GET, PUT, PATCH, DELETE, POST, HEAD, OPTIONS');
	ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	await next();
});

const JWT_KEY = process.env.JWT_KEY;

app.use(async (ctx, next) => {
	// Validate and parse account argument
	const places = [ctx.query.account, ctx.get('Authorization').replace('Bearer ', '')];
	console.log(places);
	let account;
	for (const tok of places) {
		if (tok) {
			account = jwt.verify(tok, JWT_KEY);
		}
	}
	if (account) {
		ctx.accountID = account.id;
	}
	await next();
});

let lastAccountID = 1;
async function createAccount() {
	const accountID = `${lastAccountID++}`;
	const message = {
		to: accountID,
		from: "0",
		message: "Hey there! How can I help you?",
		when: r.now(),
	};
	await r.table('messages').insert([message]).run(conn);
	return jwt.sign({
		id: accountID,
	}, JWT_KEY);
}

async function subscribeNewMessages(accountID) {
	const messagesCursor = await r.table('messages').filter(
		r.row('from').eq(accountID)
		.or(r.row('to').eq(accountID))
	).changes().run(conn);

	const passThrough = new PassThrough();
	passThrough.on('close', () => {
		console.log('closesubscribe');
		messagesCursor.close();
	});
	messagesCursor.on('data', change => {
		const id = change.new_val ? change.new_val.id : change.old_val.id;
		passThrough.write(`event: change\ndata: ${id}\n\n`);
	});
	messagesCursor.on('error', e => {
		console.log('errorsubscribe', e);
	});
	return passThrough;
}

async function getMessages(accountID) {
	const messagesCursor = await r.table('messages').orderBy({
		index: 'when'
	}).filter(
		r.row('from').eq(accountID)
		.or(r.row('to').eq(accountID))
	).run(conn);
	return messagesCursor.toArray();
}

async function getMessage(messageID) {
	const message = await r.table('messages').get(messageID).run(conn);
	/*
	if (!message || !(message.from === accountID || message.to == accountID)) {
		throw new Error('Unauthorized');
	}
	*/
	return message;
}

async function createMessage(accountID, { to, message: text }) {
	const message = {
		from: accountID,
		to: to,
		message: text,
		when: r.now(),
	};
	await r.table('messages').insert([message]).run(conn);
}

const routes = [
	{
		path: '/api/messages',
		OPTIONS: async ctx => {
			return { status: 204 };
		},
		GET: async ctx => {
			if (!ctx.accountID) {
				return {
					status: 403,
					type: 'text/html',
					body: 'Please Login',
				};
			}
			if (ctx.accepts('text/event-stream')) {
				const messagesStream = await subscribeNewMessages(ctx.accountID);
				return {
					status: 200,
					type: 'text/event-stream',
					body: messagesStream,
				};
			} else {
				const messages = await getMessages(ctx.accountID);
				return {
					status: 200,
					type: 'application/json',
					data: messages,
				};
			}
		},
		POST: async ctx => {
			if (!ctx.accountID) {
				return {
					status: 403,
					type: 'text/html',
					body: 'Please Login',
				};
			}
			const message = ctx.request.body;
			if (!message.message || !message.to) {
				return {
					status: 400,
					type: 'text/html',
					body: 'Bad Request',
				};
			}
			await createMessage(ctx.accountID, message);
			return {
				status: 200,
				type: 'text/html',
				body: 'OK',
			};
		},
	},
	{
		path: '/api/messages/(.*)',
		OPTIONS: async ctx => {
			return { status: 204 };
		},
		GET: async (ctx, [messageID]) => {
			const message = await getMessage(messageID);
			if (!message) {
				return {
					status: 404,
					type: 'text/html',
					body: 'Message not found',
				}
			}
			return {
				status: 200,
				type: 'text/html',
				data: message,
			};
		},
	},
	{
		path: '/api/account',
		OPTIONS: async ctx => {
			return { status: 204 };
		},
		POST: async ctx => {
			return {
				status: 200,
				type: 'text/html',
				body: await createAccount(),
			};
		},
	},
];

// Compile routes
for (const index in routes) {
	routes[index].path = new RegExp(`^${routes[index].path}$`);
}

app.use(async (ctx, next) => {
	try {
		await next();
	} catch (e) {
		console.error(e);
		ctx.body = 'An error occurred';
		ctx.status = 500;
		ctx.type = 'text/plain';
	}
});

app.use(async ctx => {
	console.log(ctx.method, ctx.path);
	// Match route
	for (const route of routes) {
		const match = ctx.path.match(route.path);
		if (match) {
			const params = match.splice(1);
			const handle = route[ctx.method];
			if (!handle) {
				ctx.set('Allow', Object.keys(route).filter(k => k == k.toUpperCase()).join(', '));
				ctx.body = 'Method Not Allowed';
				ctx.type = 'text/html';
				ctx.status = 405;
				return;
			}
			const { body, data, status, type } = await handle(ctx, params);
			if (body) {
				ctx.body = body;
			} else if (data) {
				ctx.body = JSON.stringify(data);
			}
			// Here, instead of depending on the handle, we should force a certain content type to make it more secure
			ctx.type = type;
			ctx.status = status;
			return;
		}
	}
	ctx.body = 'Not Found';
	ctx.type = 'text/html';
	ctx.status = 404;
});

app.use(koaStatic(path.join(__dirname, 'public')));

app.listen(8080);
