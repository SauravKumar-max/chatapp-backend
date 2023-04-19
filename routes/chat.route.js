const express = require('express');
const router = express.Router();
const { Chat } = require("../models/chat.models");

router.route('/')
.get(async (req, res) => {
	try{
		const { userId } = req.user; 
		const userChats = await Chat.find({
			users: { $elemMatch: { $eq: userId }}
		})
		.populate("users", "-password")
		.populate("latestMessage", "text sender")
		res.json({ success: true, userChats })
	}catch(error){
		console.log(error)
	}
})

.post(async (req, res) => {
	try{
		const { chat } = req.body;
		const AddChat = new Chat(chat);
		let saveChat = await AddChat.save();
		saveChat = await saveChat.populate("users", "-password");
		saveChat = await saveChat.populate("latestMessage", "text sender");
		res.json({ success: true, chat: saveChat })
	}catch(error){
		console.log(error)
	}
})

router.route('/:chatId')
.get(async (req, res) => {
	try{
		const { chatId } = req.params;
		const userChats = await Chat.findById({_id: chatId })
		.populate("users", "-password")
		.populate("latestMessage", "text sender")
		res.json({ success: true, userChats })
	}catch(error){
		console.log(error)
	}
})

.delete(async(req, res) => {
	try{
		const { chatId } = req.params;
		await Chat.deleteOne({ _id: chatId });
		res.json({ success: true, message: "chat deleted"})
	}catch(error){
		console.log(error)
	}
})

router.route('/changeGroupName')
.post(async (req, res) => {
	try{
		const { userId } = req.user;
		const { groupId, updateGroupName } = req.body;
		const groupChat = await Chat.findById({ _id: groupId });
		if(groupChat.admin == userId){
			await Chat.findByIdAndUpdate({ _id: groupId }, { groupName: updateGroupName });
			return res.json({ success: true, updateGroupName });
		} return res.json({ success: false, message: "Only Admin is allowed to add members"})
	}catch(error){
		console.log(error)
	}
})

router.route('/changeGroupPic')
.post(async (req, res) => {
	try{
		const { userId } = req.user;
		const { groupId, updateGroupPic } = req.body;
		const groupChat = await Chat.findById({ _id: groupId });
		if(groupChat.admin == userId){
			await Chat.findByIdAndUpdate({ _id: groupId }, { groupPic: updateGroupPic });
			return res.json({ success: true, updateGroupPic });
		} return res.json({ success: false, message: "Only Admin is allowed to add members"})
	}catch(error){
		console.log(error)
	}
})

router.route('/leave-group')
.post(async (req, res) => {
	try{
		const { userId } = req.user;
		const { groupId } = req.body;
		const groupChat = await Chat.findById({ _id: groupId });
		const updateUsers = groupChat.users.filter(id => id != userId);
		if(groupChat.admin == userId){
			const newAdmin = updateUsers[0]
			await Chat.findByIdAndUpdate({ _id: groupId }, { users: updateUsers, admin: newAdmin });
			return res.json({ success: true, users: updateUsers });
		}else{
			await Chat.findByIdAndUpdate({ _id: groupId }, { users: updateUsers });
			return res.json({ success: true, users: updateUsers });
		}
		
	}catch(error){
		console.log(error);
	}
})

module.exports = router;