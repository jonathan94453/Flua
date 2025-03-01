import express from 'express' 

const router = express.Router() 


router.get('/villager', (req, res) => {

const {prompt} = req.query 

if(prompt == "init") {
    // Sending the inital message to gemeni and asks for response. prompt is going to be 
    // giving AI context. 
}
else { 

// add to conversation history, the user has inputted response 
// rate this response on a scale to 1-5. 

}




}); 

export default router