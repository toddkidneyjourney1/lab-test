
// auth.js
(function() {
    const password = "YourSecretPassword123"; // Set your password here
    const input = prompt("Please enter the cast password to continue:");
    
    if (input !== password) {
        alert("Incorrect password. Returning to home.");
        window.location.href = "index.html";
    }
})();
