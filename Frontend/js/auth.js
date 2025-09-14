
document.addEventListener("DOMContentLoaded", function(){
    // Don't check auth on login/signup pages
    if (!window.location.pathname.includes('login.html') && 
        !window.location.pathname.includes('signup.html')) {
        checkAuth();
    }
    
    // Add logout listener if button exists
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function(){
            console.log("Logout button clicked");
            document.cookie = "isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = "login.html";
        });
    }
});
function login(event){
    // Prevent form submission from refreshing the page
    if (event) {
        event.preventDefault();
    }
    
    // Get values inside the function when it's called
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    
    console.log(username, password);
    console.log("login function called");
    
    // Hide any previous error messages
    const errorElement = document.getElementById("errorMessage");
    errorElement.style.display = "none";
    
    fetch("http://localhost:3003/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
    })
    .then(response => {
       
        if(response.ok){
            document.cookie = "isLoggedIn=true; path=/; max-age=86400";
           
            
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1500);
        } else {
            errorElement.textContent = "Invalid username or password";
            errorElement.style.display = "block";
        }
    })
    .catch(error => {
        console.error("Login error:", error);
        errorElement.textContent = "Login failed. Please check your connection and try again.";
        errorElement.style.display = "block";
    });
}

function signup(){
   
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    
    fetch("http://localhost:3003/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include", 
        body: JSON.stringify({ username, password }),
    })
    .then(response=>{
      if (response.status === 201){
        window.location.href = "pages/dashboard.html";
      }else{
        document.getElementById("errorMessage").textContent = "Invalid username or password";
      }
    })
}

function checkAuth(){
    console.log("checkAuth() running on:", window.location.pathname);
    console.log("All cookies:", document.cookie);
    
    const sessionCookie = getCookie('isLoggedIn');
    console.log("Session cookie:", sessionCookie);
    
    if (!sessionCookie) {
        console.log("No session cookie found, redirecting to login");
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = "login.html";
        }
    } else {
        console.log("Session cookie found, user is authenticated");
    }
}

// Helper function to get a specific cookie
function getCookie(name) {
    console.log("Looking for cookie:", name);
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    console.log("Cookie parts:", parts);
    if (parts.length === 2) {
        const cookieValue = parts.pop().split(';').shift();
        console.log("Found cookie value:", cookieValue);
        return cookieValue;
    }
    console.log("Cookie not found");
    return null;
}