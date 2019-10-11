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
	console.log('Database reset and ready');
}).catch(e => console.error(e));

app.use(koaBodyParser());
app.use(async (ctx, next) => {
	// CORS
	ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000');
	return await next();
});
app.use(async (ctx, next) => {
	// Validate and parse account argument
	ctx.accountID = 1;
	return await next();
});

let lastMessageID = 1;
let lastAccountID = 1;
async function createAccount() {
	return // jwt.sign
}

async function subscribeNewMessages(accountID) {
	const passThrough = new PassThrough();
	passThrough.on('close', () => {
		// Cancel subscription
		
	});
	return passThrough;
}

async function getMessages(accountID) {
	const messagesCursor = await r.table('messages').filter(
		r.row("from").eq(accountID)
		.or(r.row("to").eq(accountID))
	).run(conn);
	return messagesCursor.toArray();
}

async function createMessage(accountID, { to, message: text }) {
	const message = {
		from: accountID,
		to: to,
		message: text,
		id: lastMessageID++,
	};
	await r.table('messages').insert([message]).run(conn);
}

const routes = [
	{
		path: '/api/messages',
		GET: async ctx => {
			if (!ctx.accountID) {
				return {
					status: 403,
					type: 'text/plain',
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
					type: 'text/plain',
					body: 'Please Login',
				};
			}
			const message = ctx.request.body;
			if (!message.message || !message.to) {
				return {
					status: 400,
					type: 'text/plain',
					body: 'Bad Request',
				};
			}
			await createMessage(ctx.accountID, message);
			return {
				status: 200,
				type: 'text/plain',
				body: 'OK',
			};
		},
	},
	{
		path: '/api/account',
		POST: async ctx => {
			return {
				status: 200,
				type: 'text/plain',
				body: 'token-for-1',
			};
		},
	},
];

// Compile routes
for (const index in routes) {
	routes[index].path = new RegExp(`^${routes[index].path}$`);
}

app.use(async ctx => {
	console.log(ctx.path);
	// Match route
	for (const route of routes) {
		if (ctx.path.match(route.path)) {
			const handle = route[ctx.method];
			if (!handle) {
				ctx.set('Allow', route.keys.filter(k => k == k.toUpperCase()).join(', '));
				ctx.body = 'Method Not Allowed';
				ctx.type = 'text/plain';
				ctx.status = 405;
				return;
			}
			const { body, data, status, type } = await handle(ctx);
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
	ctx.type = 'text/plain';
	ctx.status = 404;
});

app.use(koaStatic(path.join(__dirname, 'public')));

app.listen(8080);
