const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const UserSchema = mongoose.Schema({
	name: { type: String, required: true },

	email: { type: String, unique: true, required: true },

	password: { type: String, required: true },

	pic: {
		type: String,
		required: true,
		default:
			"https://t3.ftcdn.net/jpg/01/09/00/64/360_F_109006426_388PagqielgjFTAMgW59jRaDmPJvSBUL.jpg",
	},

	about: {
		type: String,
		required: true,
		default: "Hey there! I am using BlendChat"
	}

}, { timestaps: true });

UserSchema.pre('save', function(next){
	const user = this;
	if (!user.isModified('password')) return next();
	bcrypt.genSalt(saltRounds, function(err, salt) {
		if(err) return next(err);
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);
			user.password = hash;
			return next();
		});
	});
});

const User = mongoose.model("User", UserSchema);

module.exports = { User };