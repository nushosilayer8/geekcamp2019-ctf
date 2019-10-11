const kue = require('kue');
const path = require('path');
const fs = require('fs');

const queue = kue.createQueue({
	prefix: 'q',
	redis: {
		port: 6379,
		host: process.env.REDIS_HOST,
		auth: process.env.REDIS_AUTH,
		options: {
		// see https://github.com/mranney/node_redis#rediscreateclient
		}
	}
});

const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
	try {
		await next();
	} catch (e) {
		ctx.status = 500;
		ctx.body = "Internal Server Error";
		console.error(e);
	}
});

const active = {};

queue.on('job enqueue', (id, type) => {
	active[id] = { progress: 0, done: false };
	console.log(`job ${id} added`);
});
queue.on('job progress', (id, progress, data) => {
	if (!active[id]) {
		active[id] = { progress: 0, done: false };
	}
	active[id].progress = progress;
});
queue.on('job complete', (id, result) => {
	if (!active[id]) {
		active[id] = { progress: 0, done: false };
	}
	active[id].done = true;
	console.log(`job ${id} done`);
});

app.use(async ctx => {
	console.log(ctx.method, ctx.path);
	if (ctx.method === 'POST' && ctx.path === '/add') {
		const url = ctx.query.url;
		if (!url || !url.match(/^https?:\/\/.*$/)) {
			ctx.status = 400;
			ctx.body = "Bad Request";
			return;
		}
		const id = await new Promise((resolve, reject) => {
			const job = queue.create('page', {
				url,
			}).save((err) => {
				if (err) {
					return reject(err);
				}
				return resolve(job.id);
			});
		});
		ctx.body = id;
		return;
	}
	if (ctx.method === 'GET' && ctx.path === '/status') {
		const id = ctx.query.id;
		if (!id) {
			ctx.status = 400;
			ctx.body = "Bad Request";
			return;
		}
		ctx.type = "application/json";
		ctx.body = JSON.stringify(active[id]);
		return;
	}
	if (ctx.method === 'GET' && ctx.path === '/') {
		const fpath = path.join(__dirname, 'index.html');
		ctx.type = path.extname(fpath);
		ctx.body = fs.createReadStream(fpath);
	}
});

app.listen(3000);
