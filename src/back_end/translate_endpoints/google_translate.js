import express from 'express' 
import 'dotenv/config' 
import { GoogleGenerativeAI } from '@google/generative-ai';


class translate_router {
    constructor() {
        this.router = express.Router() 
        this.SetUpRoutes() 
    }

    async SetUpRoutes() {
        this.router.get('/', async (req, res) => {
            const { prompt } = req.query 
            if(prompt == null || prompt == "") {
                res.status(400).send("undefined")
                return 
            }
            const ai_prompt = "Translate this string into perfect english, word for word as best as possible. If it is english just repeat the string back. : string: " + prompt 
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(ai_prompt);
            const model_response = result.response.text()
            res.status(200).send(model_response)
        }); 
        
    }
}

export default translate_router 