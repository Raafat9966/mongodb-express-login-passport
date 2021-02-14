const router = require("express").Router();
const db = require("../models/server");
const checkAuthentication = require("../middleware/auth");

// * google auth
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();
let CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

router.get("/", (req, res) => {
	res.status(200).render("index");
});

router.get("/login", (req, res) => {
	res.status(200).render("login");
});

router.get("/register", (req, res) => {
	res.status(200).render("register");
});

router.post("/register", async (req, res) => {
	try {
		let { username, email, password } = req.body;
		await db.addUser(username, email, password);
		res.status(200).redirect("/login");
	} catch (err) {
		res.status(400).send(err);
	}
});

router.post("/login", async (req, res) => {
	try {
		let { username, password } = req.body;
		await db.getUser(username, password);
		res.status(200).redirect("/user", { data });
	} catch (err) {
		res.status(400).send(err);
	}
});

// * google sign in

router.get("/sign-in", (req, res) => res.render("sign-in"));

router.post("/sign-in", (req, res) => {
	let token = req.body.token;

	async function verify() {
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: CLIENT_ID,
		});
		const payload = ticket.getPayload();
		// const userid = payload["sub"];
		//console.log(payload);
	}
	verify()
		.then(() => {
			res.cookie("session-token", token);
			res.send("done");
		})
		.catch(console.error);
});

router.get("/user", checkAuthentication, (req, res) => {
	let user = req.user;
	res.status(200).render("user", { user });
});

router.get("/logout", (req, res) => {
	res.clearCookie("session-token");
	res.redirect("/");
});

module.exports = router;
