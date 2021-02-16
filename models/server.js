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

// const getUser = async (username, password) => {
// 	try {
// 		await connect();
// 		let result = await User.findOne({ username });
// 		console.log(result);
// 		if (!result) {
// 			return createError(400, "user doesn't exist");
// 		} else {
// 			let data = await bcrypt.compare(password, result.password);
// 			if (data) {
// 				return result;
// 			} else {
// 				createError(401, "password doesn't match");
// 			}
// 		}
// 	} catch (err) {
// 		createError(500, err);
// 	}
// };

const getUser = (username, password) => {
	return new Promise((res, rej) => {
		connect()
			.then(() => {
				User.findOne({ username })
					.then((result) => {
						console.log(result);
						if (!result) {
							rej("user is not exist");
						} else {
							bcrypt
								.compare(password, result.password)
								.then((data) => {
									if (data) res(result);
									else rej("the password doesn't match");
								})
								.catch((err) => {
									rej(err);
								});
						}
					})
					.catch((err) => {
						rej(err);
					});
			})
			.catch((err) => rej(err));
	});
};

module.exports = {
	addUser,
	getUser,
};
