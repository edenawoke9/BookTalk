
document.addEventListener("DOMContentLoaded", function(){
    // Don't check auth on login/signup pages
    if (!window.location.pathname.includes('login.html') && 
        !window.location.pathname.includes('signup.html')) {
        checkAuth();
    }
    
   
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function(){
           
            document.cookie = "isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = "login.html";
        });
    }
});
function login(event){
  
    if (event) {
        event.preventDefault();
    }
    
    // Get values inside the function when it's called
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    
   
    
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
 
    
    const sessionCookie = getCookie('isLoggedIn');
   
    
    if (!sessionCookie) {
        
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = "login.html";
        }
    } 
}


function getCookie(name) {
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
  
    if (parts.length === 2) {
        const cookieValue = parts.pop().split(';').shift();
       
        return cookieValue;
    }
   
    return null;
}