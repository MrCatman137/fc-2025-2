document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        alert("You are not autorized.");
        window.location.href = "/homepage";
        return;
    }

    const layerQuestion = document.getElementById("layer-question");
    const questionText = document.getElementById("question-text");
    const questionPicture = document.getElementById("question-picture");
    const optionsContainer = document.getElementById("options");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");
    const finishButton = document.getElementById("finish");

    let questions = [];
    let currentIndex = 0;
    let userAnswers = []; 


    try {
        const response = await fetch("/questions");
        questions = await response.json();
        renderQuestions();
        renderQuestion(currentIndex);
        loadFromLocalStorage(); 
    } catch (error) {
        console.error("Failed to load questions", error);
    }

    function renderQuestions() {
        layerQuestion.innerHTML = "";
        questions.forEach((_, index) => {
            const btn = document.createElement("button");
            btn.textContent = index + 1;
            btn.addEventListener("click", () => renderQuestion(index));
            
            if (index === currentIndex) {
                btn.classList.add("active");
            }

            layerQuestion.appendChild(btn);
        });
    }

    function renderQuestion(index) {
        currentIndex = index;
        const question = questions[index];
    
        const buttons = layerQuestion.querySelectorAll("button");
        buttons.forEach((btn, i) => {
            if (i === currentIndex) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        questionText.textContent = question.question;
        questionPicture.innerHTML = ""; 
    
        const imgElement = document.createElement("img");
        imgElement.src = `/photos/${question.svg}`;  
        imgElement.alt = "Question Image"; 
        questionPicture.appendChild(imgElement);
    
        optionsContainer.innerHTML = "";
    
        question.options.forEach((option, i) => {
            const optionLabel = document.createElement("label");
            const optionInput = document.createElement("input");
            optionInput.type = "radio";
            optionInput.name = `question-${index}`;
            optionInput.value = i; 
    
            if (userAnswers[index] === i) {
                optionInput.checked = true;
            }
    
            optionInput.addEventListener("change", () => handleOptionChange(i, index));
    
            optionLabel.appendChild(optionInput);
            optionLabel.appendChild(document.createTextNode(option)); // Додаємо текст після input
            optionsContainer.appendChild(optionLabel);
        });
    
        prevButton.style.display = index > 0 ? "inline-block" : "none";
        nextButton.style.display = index < questions.length - 1 ? "inline-block" : "none";
        finishButton.style.display = index === questions.length - 1 ? "inline-block" : "none";
    }
    
    function handleOptionChange(selectedIndex, questionIndex) {
        const allLabels = optionsContainer.querySelectorAll("label");
        allLabels.forEach(label => label.classList.remove("selected"));
    
        const selectedInput = optionsContainer.querySelector(`input[value="${selectedIndex}"]`);
        if (selectedInput) {
            selectedInput.closest("label").classList.add("selected");
        }
    
        userAnswers[questionIndex] = selectedIndex;
    
        localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
    }
    

    prevButton.addEventListener("click", () => renderQuestion(currentIndex - 1));
    nextButton.addEventListener("click", () => renderQuestion(currentIndex + 1));

    finishButton.addEventListener("click", () => {
        sendAnswersToServer();
    });

    function loadFromLocalStorage() {
        const savedAnswers = localStorage.getItem('userAnswers');
        if (savedAnswers) {
            userAnswers = JSON.parse(savedAnswers); 
        }
    }

    async function sendAnswersToServer() {
        try {
            const userName = localStorage.getItem('userName'); 
            const userId = localStorage.getItem('userId');
            const response = await fetch(`/answers/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({userAnswers, userName})
            });

            if (response.ok) {
                window.location.href = "/answers";
            } else {
                alert('Error while sending answers.');
            }
        } catch (error) {
            console.error('Error sending answers:', error);
        }
    }
});
