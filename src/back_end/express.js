import express from 'express' 
import cors from 'cors'
import npcrouter from './gemeni_npc_endpoints/npc_interactions.js'
import 'dotenv/config' 

import gemenirouter from './gemeni_npc_endpoints/npc_interactions.js'



const app = express() 
const port = 4000
app.use(cors()); 
app.use(express.json())
const npc_router = new npcrouter("english") 
app.use('/npc', npc_router.router);


let language = "english" 


// base endpoint 
app.get('/test', (req, res) => {
    res.send('express server reached')
})

// Sets the language that is to be used. 
app.post('/set_language', (req, res) => {
    const { value } = req.query
    if(typeof value == 'string') {
        language = value; 
        npc_router.updateLanguage(language) 
        res.status(200).send('Variable updated successfully: ' + language)
    } 
    else {  
        res.status(400).send('Invalid value, must be a string'); 
    }
}) 


 



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

