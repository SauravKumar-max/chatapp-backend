const express = require('express');
const router = express.Router();
const { Message } = require("../models/message.models");
const { Chat } = require("../models/chat.models");


router.route('/')
.post(async (req, res) => {
	try{
		const { userId } = req.user;
		const { text, chatId } = req.body;
		const newMessage = { sender: userId, text: text, chat: chatId };
		const AddMessage = new Message(newMessage);
		let saveMessage = await AddMessage.save();
		await Chat.findByIdAndUpdate({ _id: chatId }, { latestMessage: saveMessage._id  })
		saveMessage = await saveMessage.populate("sender", "name pic");
		saveMessage = await saveMessage.populate("chat", "users");
		res.json({ success: true, receiveMessage: saveMessage })
	}catch(error){
		console.log(error);
	}
})

router.route('/:chatId')
.get(async (req, res) => {
	try{
		const { chatId } = req.params;
		const userMessages = await Message.find({ chat: chatId })
		.populate("sender", "name pic")
		.populate("chat", "users");
		res.json({ success: true, messages: userMessages }) 
	}catch(error){
		console.log(error)
	}
})


module.exports = router;