import express from 'express' 
import cors from 'cors'
const app = express() 
const port = 4000
app.use(cors()); 
app.use(express.json())

let language = null 


// base endpoint 
app.get('/', (req, res) => {
    res.send('express server reached')
})

// Sets the language that is to be used. 
app.post('/set_language', (req, res) => {
    const { value } = req.query
    if(typeof value == 'string') {
        language = value; 
        res.status(200).send('Variable updated successfully: ' + language)
        console.log(language); 
    } 
    else {
        res.status(400).send('Invalid value, must be a string'); 
    }
})
 



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

