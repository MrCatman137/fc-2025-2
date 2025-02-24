document.addEventListener("DOMContentLoaded", () => {
    const nameInput = document.getElementById("name");
    const startButton = document.getElementById("start-test");

    const storedName = localStorage.getItem("userName");
    if (storedName) {
        nameInput.value = storedName; 
    }

    startButton.addEventListener("click", () => {
        const userName = nameInput.value.trim();
        
        if (userName) {
            localStorage.setItem("userName", userName); 
            window.location.href = "/test"; 
        } else {
            alert("Будь ласка, введіть ім'я перед початком тесту!");
        }
    });
});
