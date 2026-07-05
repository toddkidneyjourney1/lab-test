// auth.js
(function() {
    const password = "Lab123";
    
    // Check if the user has already entered the password in this session
    if (sessionStorage.getItem("isLoggedIn") === "true") {
        return; // Already logged in, let the page load
    }
    
    const input = prompt("Please enter the cast password to continue:");
    
    if (input === password) {
        // Save the login state
        sessionStorage.setItem("isLoggedIn", "true");
    } else {
        alert("Incorrect password. Returning to home.");
        window.location.href = "cast-portal.htmll";
    }
})();
