import express from 'express'

const app = express()
const port = 4000

app.get('/', (req, res) => {
    res.send('express server reached')
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

