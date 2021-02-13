const router = require("express").Router();
const db = require("../models/server");

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

module.exports = router;
