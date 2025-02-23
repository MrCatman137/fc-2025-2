const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json())

app.get("/test", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "test", "test.html"))
})

app.get("/questions", (req, res) => {
    const questJSON = path.join(__dirname, "test.json")
    
    fs.readFile(questJSON, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Failed to write JSON file" });
        }
        
        const test = data? JSON.parse(data) : [];

        const filteredTest = test.map(({ correct, ...rest }) => rest);

        res.status(200).json(filteredTest)
    })
})

app.post("/answers/:id", (req, res) => {
    //відповідь сюди і перенаправлення на іншу сторінку 
})

app.get("/answers/:id", (req, res) => {
    //отримання відповідей
})

app.get("/answers", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "public", "answer", "answer.html"))
})

app.listen(5000, () => {
    console.log(`localhost:5000`);
})