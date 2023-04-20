const express = require('express');
const router = express.Router();
const authVerify = require('../middlewares/authVerify');
const { User } = require('../models/user.models');
const { Chat } = require('../models/chat.models');
const bcrypt = require('bcrypt');
const mySecret = process.env['TOKEN_SECRET'];
const jwt = require('jsonwebtoken');

router.route('/')
.get(authVerify, async (req, res) => {
	try{
	const { userId } = req.user;
		const user = await User.findById({_id: userId});
		res.json({ success: true, user });
	}catch (error){
		res.json({ message: error.message });
	}
})

.post(async (req, res) => {
	try{
		let { newUser } = req.body;
		const AddUser = new User(newUser);
		const saveUser = await AddUser.save();
		const defaultChat = { groupName: "Developer", isGroup: false, users: ["6202ab099964d055c036b36c", saveUser._id ], groupAdmin: saveUser._id };
		const AddChat = new Chat(defaultChat);
		await AddChat.save();
		res.json({ success: true, saveUser });
	}catch (error) {
		res.json({ message: error.message });
	}
})


router.route('/login')
.post(async (req, res) => {
	try{
		const { email, password } = req.body.user;
		const users = await User.find();
		const userInfo = users.find(user => user.email === email);
		if(userInfo){
			bcrypt.compare(password, userInfo.password, function(err, result){
				if(result){
					const token = jwt.sign({ userId: userInfo._id}, mySecret, {expiresIn: "72h" })
					return res.json({ email, token });
				} return res.status(403).json({ success: false, message: "incorrect password", err})
			})
		}else{
			return res.status(404).json({success: false, message: "user not found please SignUp!"})
		}
	}catch(error){
		res.json({ message: error.message });
	}
})

router.route('/updateProfile')
.post(authVerify, async (req, res) => {
	try{
		const { userId } = req.user;
		const { updatedData } = req.body;
		
		await User.findByIdAndUpdate({ _id: userId }, {...updatedData });
		res.json({ success: true, updatedData });
	}catch(error){
		res.status(400).json({success: false, message: "something went wrong!"})
	}
})

router.route('/all')
.get(authVerify, async (req, res) => {
	try{
		const { userId } = req.user;
		const users = await User.find({});
		const removeLoginUser = users.filter(user => user._id != userId);
		res.json({ success: true, users: removeLoginUser });	
	}catch(error){
		console.log(error)
	}
})


module.exports = router;
