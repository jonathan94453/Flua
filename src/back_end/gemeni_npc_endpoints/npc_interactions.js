import express from 'express' 
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config' 





class npcrouter {
    constructor(language) {
        this.router = express.Router() 
        this.setUpRoutes(); 


        this.language = language;
        this.first_flag = true;
        this.conversation_history_villager = []
        this.initial_instruction = "Please do not respond with the prefix 'ai:'. Just provide the content of your response."
    }


// Sets up Routes for class. 
async setUpRoutes() {

// Villager Endpoint 
this.router.get('/villager', async (req, res) => {
    const { prompt } = req.query
    if(prompt == "init") {
        const init_prompt = "From now on no matter what you are acting as a poor villager in a pixel game where the user is interacting with you to learn a language. give a hello how are you in  " + this.language + " no emojis, and only a text response. Also never reference the fact that you are AI ever." 
        const response = await this.send_to_gemini(init_prompt, this.conversation_history_villager)
        res.status(200).send(response)
    }
    else { 
        let conversation_prompt = "Rate the following user's " + this.language + " on a scale of 1 to 5. Place your rating as an integer value at the front of your response followed by a space, then give your 1 sentence response, as if you were a " + this.language + " Villager, and someone said this to you. Reply only in" + this.language + " USER INPUT: " + prompt;  
        const response = await this.send_to_gemini(conversation_prompt, this.conversation_history_villager); 
        res.status(200).send(response) 
    }
}); 
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


} 







    




export default npcrouter  