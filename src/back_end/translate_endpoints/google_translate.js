import express from 'express' 
import 'dotenv/config' 
import { GoogleGenerativeAI } from '@google/generative-ai';


class translate_router {
    constructor(hint_language) {
        this.router = express.Router() 
        this.SetUpRoutes() 
        this.hint_language = hint_language
    }

    async SetUpRoutes() {
        this.router.get('/', async (req, res) => {
            const { prompt } = req.query 
            if(prompt == null || prompt == "") {
                res.status(400).send("undefined")
                return 
            }
            const ai_prompt = "Translate this string into perfect," + this.hint_language + "word for word as best as possible. If it is the same language just repeat the string back. : string: " + prompt 
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(ai_prompt);
            const model_response = result.response.text()
            res.status(200).send(model_response)
        }); 
        
    }
    updateLanguage(hint_language) {
        this.hint_language= hint_language
        this.SetUpRoutes(); 
      }
}

export default translate_router 