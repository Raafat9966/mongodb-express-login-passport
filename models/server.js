const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const createError = require("http-errors");
require("dotenv").config();

let uri = process.env.MONGODB_URI;
const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
});

const User = mongoose.model("users", userSchema);

const connect = async () => {
	try {
		if (mongoose.connection.readyState === 1) return;
		return await mongoose.connect(uri, {
			useUnifiedTopology: true,
			useCreateIndex: true,
			useNewUrlParser: true,
		});
	} catch (err) {
		createError(500, err);
	}
};

const addUser = async (username, email, password) => {
	try {
		await connect();
		bcrypt.hash(password, 10, async (err, hash) => {
			let newUser = await new User({
				username,
				email,
				password: hash,
			});
			await newUser.save();
		});
	} catch (err) {
		createError(500, err);
	}
};

const getUser = async (username, password) => {
	try {
		await connect();
		let result = await User.findOne(username);
		let data = await bcrypt.compare(password, result.password);
		if (data) return data;
		else return "password doesn't match";
	} catch (err) {
		createError(500, err);
	}
};

module.exports = {
	addUser,
	getUser,
};
