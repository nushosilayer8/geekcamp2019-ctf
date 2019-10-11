const crypto = require('crypto');

const fmt = (d) => `miniCTF{${d}}`;
const nflags = 1000;

async function main() {
	for (let i = 0; i < nflags; i++) {
		const bytes = await new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if (err) {
					return reject(err);
				}
				return resolve(buf);
			});
		});
		const hex = bytes.toString('hex');
		console.log(fmt(hex));
	}
}

main();
