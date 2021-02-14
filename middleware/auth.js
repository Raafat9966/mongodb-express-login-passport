const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

let CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

const checkAuthentication = (req, res, next) => {
	let token = req.cookies["session-token"];
	let user = {};
	async function verify() {
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: CLIENT_ID,
		});
		const payload = ticket.getPayload();
		user.name = payload.name;
		user.email = payload.email;
		user.picture = payload.picture;
	}
	verify()
		.then(() => {
			req.user = user;
			next();
		})
		.catch((err) => res.redirect("/"));
};
module.exports = checkAuthentication;
