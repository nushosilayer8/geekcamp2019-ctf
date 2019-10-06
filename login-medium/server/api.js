const Router = require('@koa/router');
const fs = require('fs');
const path = require('path');

const { verify } = require('../common/auth.js');

const flag = fs.readFileSync(path.join(__dirname, '..', 'flag.txt'));

const router = new Router({
	prefix: '/api',
});

router.post('/flag', async (ctx, next) => {
	const token = ctx.cookies.get('token');
	if (!token) {
		ctx.status = 401;
		ctx.body = "Missing Authorization header";
		return;
	}
	try {
		const data = verify(token);
		if (data && data.u === 'admin') {
			ctx.body = flag;
			return;
		} else {
			ctx.body = "You're logged in, but you're not admin so you can't see the flag";
			return
		}
	} catch (e) {
		ctx.status = 400;
		ctx.body = 'Token not valid';
		return
	}
});

module.exports = router;
