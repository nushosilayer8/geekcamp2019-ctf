const path = require('path');
const fs = require('fs');

const puppeteer = require('puppeteer');

const flag = fs.readFileSync('flag.txt', 'utf8');

const r = require('rethinkdb');
let conn = null;
r.connect({
	host: '::1',
	port: 28015,
	db: 'chatapp',
	password: 'JrpmrGMqwsZ9NAvYHoOS5VC8',
}).then(async c => {
	const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] }); 
	const accountID = "0";

	const messagesCursor = await r.table('messages').filter(
		r.row('from').eq(accountID)
		.or(r.row('to').eq(accountID))
	).changes().run(c);

	messagesCursor.on('data', async change => {
		const message  = change.new_val ? change.new_val.message : change.old_val.message;

		// Open message links

		const incog = await browser.createIncognitoBrowserContext();
		const page = await incog.newPage();
		page.on("pageerror", err => console.log(err));
		await page.setCacheEnabled(false);
		await page.goto('https://chat-app.ctf.makerforce.io:8443/pagemissing', { timeout: 5000, waitUntil: 'domcontentloaded' });
		await page.evaluate(flag => {
			localStorage.setItem('account', flag);
			return localStorage.getItem('account');
		}, flag);

		const sites = message.match(/https?:\/\/[^\s]+/g);
		if (sites) {
			for (const s of sites) {
				console.log('opening ' + s);
				try {
					await page.goto(s, { timeout: 10000, waitUntil: 'networkidle0' });
				} catch (e) {
					console.log(e);
				}
			}
		}

		await new Promise(resolve => {
			setTimeout(resolve, 1000);
		});
		await incog.close();
	});

	messagesCursor.on('error', e => {
		console.log('errorsubscribe', e);
	});

}).catch(e => console.error(e));

