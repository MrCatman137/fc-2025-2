document.addEventListener("DOMContentLoaded", () => {
    const nameInput = document.getElementById("name");
    const startButton = document.getElementById("start-test");

    const storedName = localStorage.getItem("userName");
    if (storedName) {
        nameInput.value = storedName;
    }

    startButton.addEventListener("click", async () => {
        const userName = nameInput.value.trim();

        if (!userName) {
            alert("Будь ласка, введіть ім'я перед початком тесту!");
            return;
        }

        try {
            const response = await fetch("/user");
            const data = await response.json();
            const userId = data.user_id;

            localStorage.setItem("userName", userName);
            localStorage.setItem("userId", userId);

            window.location.href = "/test";
        } catch (error) {
            console.error(error);
            alert("Error, try again.");
        }
    });
});
