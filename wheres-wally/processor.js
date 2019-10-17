const puppeteer = require('puppeteer');
const kue = require('kue');
const fs = require('fs');

const fakeFlags = fs.readFileSync('fakeflags.txt', 'utf8').split('\n').filter(e => e).slice(50);
const realFlags = fs.readFileSync('flag.txt', 'utf8').split('\n').filter(e => e);

const fakeOps = fakeFlags.flatMap(f => {
	const fOne = f.slice(0, f.length / 2);
	const fTwo = f.slice(f.length / 2);
	return [
		{ headers: { 'X-Flag': fOne }, viewport: { width: 800, height: 600 } },
		{ headers: { 'X-Flag': fTwo }, viewport: { width: 800, height: 600 } },
	];
});
const realOps = realFlags.flatMap(f => {
	const fOne = f.slice(0, f.length / 2);
	const fTwo = f.slice(f.length / 2);
	return [
		{ headers: { 'X-Flag': fOne }, viewport: { width: 800, height: 601 } },
		{ headers: { 'X-Flag': fTwo }, viewport: { width: 800, height: 601 } },
	];
});

const ops = fakeOps.concat(realOps);

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

async function setup(browser) {
	const incog = await browser.createIncognitoBrowserContext();
	const page = await incog.newPage();
	await page.setCacheEnabled(false);
	return page;
}

async function perform(page, url, op) {
	await Promise.all([
		page.setViewport(op.viewport),
		page.setExtraHTTPHeaders(op.headers),
	]);
	await page.goto(url, { timeout: 2000, waitUntil: 'domcontentloaded' });
}

async function processor(browser, queue, n) {
	const page = await setup(browser);
	queue.process('page', async (job, done) => {
		try {
			const url = job.data.url;
			const randOps = shuffle(ops);
			console.log(`New job for ${url}`);

			for (let i = 0; i < randOps.length; i++) {
				const op = randOps[i];
				job.progress(i, randOps.length);
				//console.log(n, url, op.headers['X-Flag']);
				await perform(page, url, op);
				await page._client.send('Network.clearBrowserCookies');
			}

			console.log(`Done job for ${url}`);
		} catch (e) {
			done(e);
		}
		done();
	});
}

async function main() {

	const browser = await puppeteer.launch({ headless: true });
	const queue = kue.createQueue({
		prefix: 'q',
		redis: {
			port: 6379,
			host: process.env.REDIS_HOST,
			options: {
			// see https://github.com/mranney/node_redis#rediscreateclient
			}
		}
	});

	processor(browser, queue, 1);
	processor(browser, queue, 2);
	processor(browser, queue, 3);
	processor(browser, queue, 4);

}

main();
