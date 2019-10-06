function secure_hash(stringdata, hexkey) {
	// Such strong hash
	const key = aesjs.utils.hex.toBytes(hexkey);
	const data = aesjs.utils.utf8.toBytes(stringdata);
	const aesCtr = new aesjs.ModeOfOperation.ctr(key);
	const encrypted = aesCtr.encrypt(data);
	return aesjs.utils.hex.fromBytes(encrypted);
	// Much secure
}

const vue = new Vue({
	el: '#app',
	data: {
		username: '',
		password: '',
		error: '',
	},
	methods: {
		signin() {
			// Wow
			if (
				this.username == 'admin'
				&& secure_hash(this.password, '51c66d105d38c5fd9ebe42f79204b6e9ee34dc90f74b1620f0741d8cf72bc529') == 'de05e9157c62298ca96fba9106f8a29bdc2f87'
			) {
				window.location = 'success.html';
			} else {
				this.error = 'Incorrect username or password';
			}
		},
	},
});
