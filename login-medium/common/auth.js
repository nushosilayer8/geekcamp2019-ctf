const jwt = require('jsonwebtoken');

const SECRET = 'S2gC4GERLAWxxpSXFMvE60KZhOCnHr78EoIVfXwSm2JLQdKMQ2QyTOf6lSzdnHKS';

function authorize(username) {
	if (username === 'admin') {
		throw new Error("Not allowed to log in as admin");
	}
	const token = jwt.sign({ u: username }, SECRET);
	return token;
}

function verify(token) {
	const data = jwt.verify(token, SECRET);
	return data;
}

module.exports.authorize = authorize;
module.exports.verify = verify;
