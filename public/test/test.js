document.addEventListener("DOMContentLoaded", async () => {
    const layerQuestion = document.getElementById("layer-question");
    const questionText = document.getElementById("question-text");
    const questionPicture = document.getElementById("question-picture");
    const optionsContainer = document.getElementById("options");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");
    const finishButton = document.getElementById("finish");

    let questions = [];
    let currentIndex = 0;
    let userAnswers = []; // Для збереження відповідей користувача

    try {
        const response = await fetch("/questions");
        questions = await response.json();
        renderQuestions();
        renderQuestion(currentIndex);
        loadFromLocalStorage(); // Завантаження збережених відповідей з LocalStorage
    } catch (error) {
        console.error("Failed to load questions", error);
    }

    function renderQuestions() {
        layerQuestion.innerHTML = "";
        questions.forEach((_, index) => {
            const btn = document.createElement("button");
            btn.textContent = index + 1;
            btn.addEventListener("click", () => renderQuestion(index));
            layerQuestion.appendChild(btn);
        });
    }

    function renderQuestion(index) {
        currentIndex = index;
        const question = questions[index];

        questionText.textContent = question.question;
        questionPicture.innerHTML = ""; 

        const imgElement = document.createElement("img");
        imgElement.src = `/photos/${question.svg}`;  // Шлях до фотографії
        imgElement.alt = "Question Image"; 
        questionPicture.appendChild(imgElement);

        optionsContainer.innerHTML = "";

        question.options.forEach((option, i) => {
            const optionLabel = document.createElement("label");
            const optionInput = document.createElement("input");
            optionInput.type = "radio";
            optionInput.name = `question-${index}`;
            optionInput.value = option;
            optionLabel.textContent = option;

            // Якщо відповідь була вибрана раніше, відзначити відповідний варіант
            if (userAnswers[index] === option) {
                optionInput.checked = true;
            }

            optionInput.addEventListener("change", () => handleOptionChange(optionInput, index));

            optionLabel.appendChild(optionInput);
            optionsContainer.appendChild(optionLabel);
        });

        prevButton.style.display = index > 0 ? "inline-block" : "none";
        nextButton.style.display = index < questions.length - 1 ? "inline-block" : "none";
        finishButton.style.display = index === questions.length - 1 ? "inline-block" : "none";
    }

    function handleOptionChange(selectedInput, questionIndex) {
        const allLabels = optionsContainer.querySelectorAll("label");
        allLabels.forEach(label => label.classList.remove("selected"));

        const selectedLabel = selectedInput.closest("label");
        selectedLabel.classList.add("selected");

        // Зберігаємо відповідь в масив userAnswers
        userAnswers[questionIndex] = selectedInput.value;

        // Збереження відповідей в LocalStorage
        localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
    }

    prevButton.addEventListener("click", () => renderQuestion(currentIndex - 1));
    nextButton.addEventListener("click", () => renderQuestion(currentIndex + 1));

    finishButton.addEventListener("click", () => {
        // Надсилання результатів на сервер
        sendAnswersToServer();
    });

    function loadFromLocalStorage() {
        const savedAnswers = localStorage.getItem('userAnswers');
        if (savedAnswers) {
            userAnswers = JSON.parse(savedAnswers); // Завантажуємо збережені відповіді
        }
    }

    async function sendAnswersToServer() {
        try {
            const userId = "someUserId"; // Можна отримати користувача з сесії або іншого джерела
            const response = await fetch(`/answers/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userAnswers)
            });

            if (response.ok) {
                alert('Ваші відповіді успішно надіслані!');
                // Можна додати редірект або іншу поведінку
            } else {
                alert('Сталася помилка при надсиланні відповідей.');
            }
        } catch (error) {
            console.error('Error sending answers:', error);
        }
    }
});
