import express from 'express' 
import cors from 'cors'
const app = express()



const port = 4000

app.use(cors()); 

app.get('/test', (req, res) => {
    res.send('express server reached')
})




app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

