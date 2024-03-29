const puppeteer = require('puppeteer');
const kue = require('kue');
const fs = require('fs');

const fakeFlags = fs.readFileSync('fakeflags.txt', 'utf8').split('\n').filter(e => e).slice(0, 60);
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

async function setup(incog) {
	const page = await incog.newPage();
	await page.setCacheEnabled(false);
	return page;
}

async function perform(page, url, op) {
	await Promise.all([
		page.setViewport(op.viewport),
		page.setExtraHTTPHeaders(op.headers),
	]);
	await page.goto(url, { timeout: 10000, waitUntil: 'networkidle0' });
	await page._client.send('Network.clearBrowserCookies');
}

async function processor(browser, queue, n, count=2) {
	const incog = await browser.createIncognitoBrowserContext();
	const pages = [];
	for (let i = 0; i < count; i++) {
		pages.push(await setup(incog));
	}
	queue.process('page', async (job, done) => {
		try {
			const url = job.data.url;
			const randOps = shuffle(ops);
			console.log(`New job for ${url}`);

			let progress = 0;

			for (let i = 0; i < randOps.length; i += count) {
				const parallelOps = randOps.slice(i, i + count);
				const all = Promise.all(
					parallelOps.map(async (op, j) => {
						if (!op) {
							return;
						}
						//console.log(n, url, op.headers['X-Flag']);
						console.log(`Op ${i+j} of ${randOps.length}`);
						await perform(pages[j], url, op);
						job.progress(++progress, randOps.length);
					})
				);
				await all;
			}

			console.log(`Done job for ${url}`);
		} catch (e) {
			console.log(`Error: ${e}`);
			done(e);
		}
		done();
	});
}

async function main() {

	const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] }); 
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
