const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json())
app.use(express.static(path.join(__dirname, "public")));

app.get("/homepage", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "homepage", "homepage.html"))
})

app.get("/test", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "test", "test.html"))
})

app.get("/questions", (req, res) => {
    const questJSON = path.join(__dirname, "test.json")
    
    fs.readFile(questJSON, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Failed to read JSON file" });
        }
        
        const test = data? JSON.parse(data) : [];

        const filteredTest = test.map(({ correct, ...rest }) => rest);

        res.status(200).json(filteredTest)
    })
})

app.post("/answers/:id", (req, res) => {
    const user_id = req.params.id;

    const new_answers = req.body;
    const answerJSON = path.join(__dirname, "user_answers.json")
    const questJSON = path.join(__dirname, "test.json")

    fs.readFile(answerJSON, "utf-8", (err, data) => {
        let user_answers = []
        const today = new Date();
        if (err) {
            return res.status(500).json({ error: "Failed to read JSON file" });
        } else {
            try {
                user_answers = data? JSON.parse(data) : [];
            } catch (error) {
                return res.status(500).json({ error: "Failed to parse JSON file"});
            }
        }
       
        fs.readFile(questJSON, "utf-8", (err, test_data) => {
            let test_answers = []

            if (err) {
                return res.status(500).json({ error: "Failed to read JSON file" });
            } else {
                try {
                    test_answers = test_data? JSON.parse(test_data) : [];
                } catch (error) {
                    return res.status(500).json({ error: "Failed to parse JSON file"});
                }
            }

            const correct_answers = test_answers.map(q => q.correct);

            const correctness = new_answers.map((answer, index) => answer === correct_answers[index]);

            const user_answers_data = { user_id, date: today, answers: new_answers, correctness };
            
            user_answers.push(user_answers_data);

            fs.writeFile(answerJSON, JSON.stringify(user_answers, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ error: "Failed to write JSON file" });
                }

                res.status(201).json({ message: "Answers saved"});
            })
        })
        
    })
    
})

app.get("/answers/:id", (req, res) => {
    const user_id = req.params.id;

    const answerJSON = path.join(__dirname, "user_answers.json")
    const questJSON = path.join(__dirname, "test.json")
    
    fs.readFile(answerJSON, "utf-8", (err, answer_data) => {
        let user_answers = []

        if (err) {
            return res.status(500).json({ error: "Failed to read JSON file" });
        } else {
            try {
                user_answers = answer_data? JSON.parse(answer_data) : [];
            } catch (error) {
                return res.status(500).json({ error: "Failed to parse JSON file"});
            }
        }

        const user_data = user_answers.filter((item) => item.user_id === user_id);

        if (!user_data) {
            return res.status(404).json({ error: "User not found or no answers provided" });
        }

        fs.readFile(questJSON, "utf-8", (err, test_data) => {
            let test_answers = []

            if (err) {
                return res.status(500).json({ error: "Failed to read JSON file" });
            } else {
                try {
                    test_answers = test_data? JSON.parse(test_data) : [];
                } catch (error) {
                    return res.status(500).json({ error: "Failed to parse JSON file"});
                }
            }

            const correct_answer = test_answers.map(q => q.correct);

            const correctness = user_data.answers.map((answer, index) => correct_answer[index] === answer)
        
            res.status(200).json({
                user_id,
                answers: user_data.answers,
                correctness
            })
        })
    })
})

app.get("/answers", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "public", "answer", "answer.html"))
})

app.listen(5000, () => {
    console.log(`localhost:5000`);
})