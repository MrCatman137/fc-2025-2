document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        alert("You are not autorized.");
        window.location.href = "/homepage";
        return;
    }

    try {
        console.log(`/answers/${userId}`)
        const response = await fetch(`/answers/${userId}`);
        const data = await response.json();
        console.log(data);
        if (data.error) {
            alert(data.error);
            window.location.href = "/homepage";
            return;
        }

        const { user_info, test_info } = data;

        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userAnswers");

        const userData = user_info[0];
        document.getElementById("userName").textContent = `Ім'я користувача: ${userData.userName}`;
        document.getElementById("score").textContent = `Оцінка: ${userData.score}`;

        const questionsContainer = document.getElementById("questions-container");
        test_info.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.classList.add("question");
            questionDiv.innerHTML = `
                <p><strong>Питання:</strong> ${question.question}</p>
                <ul>
                    ${question.options.map((option, optionIndex) => {
                        const userAnswer = userData.answers[index]; 
                        const isCorrect = userAnswer === optionIndex && userData.correctness[index]; 
                        const isSelected = userAnswer === optionIndex; 
                        let color = '';
                        
                        if (isSelected) {
                            color = isCorrect ? 'green' : 'red'; 
                        }

                        return `<li style="color: ${color};">${option}</li>`;
                    }).join('')}
                </ul>
            `;
            questionsContainer.appendChild(questionDiv);
        });

        document.getElementById("homeButton").addEventListener("click", () => {
            window.location.href = "/homepage";
        });

    } catch (error) {
        console.error(error);
        alert("Error, try again.");
    }
});
