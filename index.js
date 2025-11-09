const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World! How are you')
})
app.get('/challenges', (req, res)=>{
    res.send('challenges data')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
