// Enhanced Authentication functionality
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is already logged in and redirect appropriately
  checkAuthState()
})

// Utility functions
function showError(message, elementId = "errorMessage") {
  const errorElement = document.getElementById(elementId)
  if (errorElement) {
    errorElement.textContent = message
    errorElement.style.display = "block"
  }
}

function hideError(elementId = "errorMessage") {
  const errorElement = document.getElementById(elementId)
  if (errorElement) {
    errorElement.style.display = "none"
  }
}

function showSuccess(message, elementId = "successMessage") {
  const successElement = document.getElementById(elementId)
  if (successElement) {
    successElement.textContent = message
    successElement.style.display = "block"
  }
}

function setButtonLoading(button, isLoading) {
  if (isLoading) {
    button.classList.add("loading")
    button.disabled = true
    button.dataset.originalText = button.textContent
    button.textContent = "Loading..."
  } else {
    button.classList.remove("loading")
    button.disabled = false
    if (button.dataset.originalText) {
      button.textContent = button.dataset.originalText
    }
  }
}

// Declare variables before using them
const getCurrentUser = () => JSON.parse(localStorage.getItem("user"))
const apiCall = async (url, options) => {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

const CONFIG = {
  ENDPOINTS: {
    LOGIN: "/api/login",
    SIGNUP: "/api/signup",
    LOGOUT: "/api/logout",
  },
}

// Check authentication state
function checkAuthState() {
  const user = getCurrentUser()
  const currentPage = window.location.pathname.toLowerCase()

  // If on login/signup pages and user is logged in, redirect to dashboard
  if (
    user &&
    (currentPage.includes("login.html") || currentPage.includes("signup.html") || currentPage.includes("index.html"))
  ) {
    window.location.href = "pages/dashboard.html"
    return
  }

  // If on protected pages and user is not logged in, redirect to login
  const protectedPages = ["dashboard.html", "books.html", "groups.html", "profile.html", "book-details.html"]
  const isProtectedPage = protectedPages.some((page) => currentPage.includes(page))

  if (!user && isProtectedPage) {
    window.location.href = "../pages/login.html"
    return
  }
}

// Login functionality
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault()

    const submitButton = e.target.querySelector('button[type="submit"]')
    const username = document.getElementById("username").value.trim()
    const password = document.getElementById("password").value

    // Basic validation
    if (!username || !password) {
      showError("Please fill in all fields.")
      return
    }

    hideError()
    setButtonLoading(submitButton, true)

    try {
      const response = await apiCall(CONFIG.ENDPOINTS.LOGIN, {
        method: "POST",
        body: JSON.stringify({ username, password }),
      })

      // Your backend returns the user object directly
      if (response && (response.id || response.username)) {
        // Store user info in localStorage
        localStorage.setItem("user", JSON.stringify(response))

        // Show success message briefly
        showSuccess("Login successful! Redirecting...")

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = "dashboard.html"
        }, 1000)
      } else {
        showError("Invalid response from server. Please try again.")
      }
    } catch (error) {
      console.error("Login error:", error)
      showError(error.message || "Login failed. Please check your credentials and try again.")
    } finally {
      setButtonLoading(submitButton, false)
    }
  })
}

// Signup functionality
if (document.getElementById("signupForm")) {
  document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault()

    const submitButton = e.target.querySelector('button[type="submit"]')
    const formData = new FormData(e.target)

    const userData = {
      name: formData.get("name").trim(),
      username: formData.get("username").trim(),
      password: formData.get("password"),
      bio: formData.get("bio").trim() || "",
    }

    // Basic validation
    if (!userData.name || !userData.username || !userData.password) {
      showError("Please fill in all required fields.")
      return
    }

    if (userData.username.length < 3) {
      showError("Username must be at least 3 characters long.")
      return
    }

    if (userData.password.length < 6) {
      showError("Password must be at least 6 characters long.")
      return
    }

    hideError()
    setButtonLoading(submitButton, true)

    try {
      const response = await apiCall(CONFIG.ENDPOINTS.SIGNUP, {
        method: "POST",
        body: JSON.stringify(userData),
      })

      if (response) {
        showSuccess("Account created successfully! Redirecting to login...")

        // Clear form
        e.target.reset()

        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = "login.html"
        }, 2000)
      }
    } catch (error) {
      console.error("Signup error:", error)
      showError(error.message || "Signup failed. Please try again.")
    } finally {
      setButtonLoading(submitButton, false)
    }
  })
}

// Enhanced logout function
async function logout() {
  try {
    // Try to call logout endpoint if it exists
    try {
      await apiCall(CONFIG.ENDPOINTS.LOGOUT, {
        method: "POST",
      })
    } catch (error) {
      // If logout endpoint doesn't exist, just continue with local logout
      console.log("Logout endpoint not available, performing local logout")
    }

    // Clear local storage
    localStorage.removeItem("user")

    // Redirect to login page
    const currentPath = window.location.pathname
    if (currentPath.includes("/pages/")) {
      window.location.href = "login.html"
    } else {
      window.location.href = "pages/login.html"
    }
  } catch (error) {
    console.error("Logout error:", error)
    // Still redirect even if logout request fails
    localStorage.removeItem("user")
    window.location.href = "pages/login.html"
  }
}

// Make logout function globally available
window.logout = logout
