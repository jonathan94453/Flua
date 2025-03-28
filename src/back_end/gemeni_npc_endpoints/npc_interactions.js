import express from 'express' 
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config' 


class npcrouter {
    constructor(language) {
        this.router = express.Router() 
        this.setUpRoutes(); 

        this.language = language 
        this.first_flag = true;
        this.conversation_history_villager = []
        this.conversation_history_innkeeper = []
        this.conversation_history_shopkeeper = []
        this.conversation_history_farmer = []
        this.conversation_history_blacksmith = []
        this.initial_instruction = "Please do not respond with the prefix 'ai:'. Just provide the content of your response."
    }


// Sets up Routes for class. 
async setUpRoutes() {

// Villager Endpoint 
this.router.get('/villager', async (req, res) => {
    const { prompt } = req.query
    if(prompt == "init") {
        const init_prompt = this.generate_inital_prompt("villager")
        const response = await this.send_to_gemini(init_prompt, this.conversation_history_villager)
        res.status(200).send(response)
    }
    else { 
        const conversation_prompt = this.generate_prompt("villager", prompt)
        const response = await this.send_to_gemini(conversation_prompt, this.conversation_history_villager); 
        res.status(200).send(response) 
    }
}); 


// Innkeeper endpoint 
this.router.get('/innkeeper', async (req, res) => {
    const { prompt } = req.query
    if(prompt == "init") {
        const init_prompt = this.generate_inital_prompt("innkeeper")
        const response = await this.send_to_gemini(init_prompt, this.conversation_history_innkeeper)
        res.status(200).send(response)
    }
    else { 
        const conversation_prompt = this.generate_prompt("innkeeper", prompt)
        const response = await this.send_to_gemini(conversation_prompt, this.conversation_history_innkeeper); 
        res.status(200).send(response) 
    }
}); 


// Shopkeeper endpoint 
this.router.get('/shopkeeper', async (req, res) => {
    const { prompt } = req.query
    if(prompt == "init") {
        const init_prompt = this.generate_inital_prompt("shopkeeper")
        const response = await this.send_to_gemini(init_prompt, this.conversation_history_shopkeeper)
        res.status(200).send(response)
    }
    else { 
        const conversation_prompt = this.generate_prompt("shopkeeper", prompt)
         const response = await this.send_to_gemini(conversation_prompt, this.conversation_history_shopkeeper); 
        res.status(200).send(response) 
    }
}); 


//Farmer endpoint 
this.router.get('/farmer', async (req, res) => {
    const { prompt } = req.query
    if(prompt == "init") {
        const init_prompt = this.generate_inital_prompt("farmer")
        const response = await this.send_to_gemini(init_prompt, this.conversation_history_farmer)
        res.status(200).send(response)
    }
    else { 
        const conversation_prompt = this.generate_prompt("farmer", prompt)
        const response = await this.send_to_gemini(conversation_prompt, this.conversation_history_farmer); 
        res.status(200).send(response) 
    }
}); 


// blacksmith endpoint 
this.router.get('/blacksmith', async (req, res) => {
    const { prompt } = req.query
    if(prompt == "init") {
        const init_prompt = this.generate_inital_prompt("blacksmith") 
        const response = await this.send_to_gemini(init_prompt, this.conversation_history_blacksmith)
        res.status(200).send(response)
    }
    else { 
        const conversation_prompt = this.generate_prompt("blacksmith", prompt)
        const response = await this.send_to_gemini(conversation_prompt, this.conversation_history_blacksmith); 
        res.status(200).send(response) 
    }
}); 

// Final Boss: sherriff
this.router.get('/final-boss-sherriff', async (req, res) => {
    const { prompt } = req.query
    if(prompt == "init") {
        const init_prompt = "From now on no matter what you are acting as a strict sherrif in a pixel game. But you cannot move or interact with the user. give a hello how are you in  " + this.language + " to the user. no emojis, and only a text response. Also never reference the fact that you are AI ever." 
        const response = await this.send_to_gemini(init_prompt, this.conversation_history_blacksmith)
        res.status(200).send(response)
    }
    else { 
        let conversation_prompt = "never mention that you are google gemini ai. Deny it if the user asks. Rate the following user's " + this.language + " on a scale of 0 to 10. Place your rating as an integer value at the front of your response followed by a space, then give your 1 sentence response, directly answering the question of the user input, as if you were a " + this.language + " strict sherriff. Do not correct the user as if you were rating, do not comment on or mention the user's language skills. but have a conversation, respond to the previous question and ask questions to the user because you are suspicious and think that they are a criminal. But don't ever directly say that. Reply only in" + this.language + " USER INPUT: " + prompt;  
        const response = await this.send_to_gemini(conversation_prompt, this.conversation_history_blacksmith); 
        res.status(200).send(response) 
    }
}); 

}

nullify_conversations() {
    this.conversation_history_villager = null 
    this.conversation_history_innkeeper = null 
    this.conversation_history_shopkeeper = null 
    this.conversation_history_farmer = null 
    this.conversation_history_blacksmith = null 
}

updateLanguage(newLanguage) {
    this.language = newLanguage;
    this.setUpRoutes();  // Re-setup routes with new language
  }


    async send_to_gemini(prompt, conversation_history) {
    const user_prompt = prompt;

    // Append the conversation history to the prompt (This could be an array of messages)
    const full_prompt = [
        this.initial_instruction, 
        ...conversation_history.map(exchange => `${exchange.role}: ${exchange.content}`),
        `user: ${user_prompt}`,
    ].join('\n');  // You can join it with other delimiters if required

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const result = await model.generateContent(full_prompt);
        const model_response = result.response.text()  // Assuming this is the AI's response directly.

        // Optionally, you can add the new exchange to the conversation history here if needed:
        conversation_history.push({
            role: 'user',
            content: user_prompt,
        });

        conversation_history.push({
            role: 'ai',
            content: model_response,
        });

        return model_response
    } catch (error) {
        console.error("Error interacting with Gemini API:", error);
        return { model_response: "Error interacting with AI", updatedHistory: conversation_history };
    }

}

generate_prompt(role, prompt) {
    console.log("THIS.LANGUAGE: " + this.language)
    console.log("ROLE: " + role) 
    let conversation_prompt = "Rate the USER_INPUT on fluency of" + this.language + "on a scale of 0 to 10. Place your rating at the front of your response followed by a space. Then give a 1 sentence response without mentioning or commenting about fluency at all and. roleplay as a " + this.language + " speaking " + role + " only. Directly answer the USER_INPUT questions, and keep the conversation going. USER_INPUT: " + prompt
    return conversation_prompt 
}

// let conversation_prompt = "Do not act or mention that you are an AI assistant. Rate the USER_INPUT on fluency of" this.language + "on a scale of 0 to 5. Place your rating at the front of your response followed by a space. Then give a 1 sentence response without mentioning or commenting about fluency at all and roleplay as a " + this.language + role + ". Directly answer the USER_INPUT questions, and keep the conversation going. USER_INPUT: " + prompt


generate_inital_prompt(role) {
    return init_prompt 
}


} 

export default npcrouter  