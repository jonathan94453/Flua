import express from 'express' 
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config' 




class npcrouter {
    constructor(language) {
        this.router = express.Router() 
        this.language = language; 
        this.setUpRoutes(); 
    }


// Sets up Routes for class. 
setUpRoutes() {

// Villager Endpoint 
this.router.get('/villager', async (req, res) => {
    const { prompt } = req.query
    if(prompt == "init") {
        const response = await send_villager("You are acting as a villager in a pixel game where the user is interacting with you to learn a language. give a hello how are you in  " + this.language + " no emojis, and only a text response.") 
        res.status(200).send(response)
    }
    else { 
        const response = await send_villager(prompt); 
        res.status(200).send(response) 
    }
}); 
}

updateLanguage(newLanguage) {
    this.language = newLanguage;
    this.setUpRoutes();  // Re-setup routes with new language
  }



} 






// Functions for each character. 
async function send_villager(prompt) {
    const user_prompt = prompt; 
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
    const result = await model.generateContent(user_prompt) 
    const model_response = result.response.text(); 

    return model_response 
}








export default npcrouter  