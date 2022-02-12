const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({

	groupName: { type: String, trim: true, required: true },

	isGroup: { type: Boolean, required: true },

	groupPic: { type:String, default: "https://help.it.ox.ac.uk/sites/default/files/help/images/media/users-icon.png" },

	users: [
		{ 
			type: mongoose.Schema.Types.ObjectId, 
			ref: "User"
		}
	],

	admin: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		default: null
	},

	latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },

}, {timestamps: true })

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = { Chat };