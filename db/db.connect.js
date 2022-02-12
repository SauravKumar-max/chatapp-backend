const mongoose  = require('mongoose')

async function initializeDBConnection(){
	
const mySecret = process.env['DB_SECRECT']

	try{
		const uri = `mongodb+srv://${mySecret}@cluster0.iha7u.mongodb.net/chat-app?retryWrites=true&w=majority`;

		await mongoose.connect(uri, {
				useNewUrlParser: true,
  			useUnifiedTopology: true
		})
		console.log("Connection Completed!");
	}catch(error){
		console.log(error);
	}
}

module.exports = { initializeDBConnection };