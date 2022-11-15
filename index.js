const express = require('express');
const auth = require("./routes/auth")
const app = express();
app.use(express.json())
app.use("/auth", auth)
app.get("/", (req, res) => {
    res.send("Hello Node")
})
app.listen(8000,(req, res)=>{
    console.log(`Server is Running`);
})