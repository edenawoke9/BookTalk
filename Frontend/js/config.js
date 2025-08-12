// Global configuration
const CONFIG = {
  API_BASE_URL: "http://localhost:3003",
  ENDPOINTS: {
    // Authentication
    LOGIN: "/login",
    SIGNUP: "/signup",
    LOGOUT: "/logout",

    // Books
    BOOKS: "/getbooks",
    CREATE_BOOK: "/createBook",
    UPDATE_BOOK: "/update",
    DELETE_BOOK: "/delete",

    // Comments (we'll add these to your backend)
    COMMENTS: "/comments",
    CREATE_COMMENT: "/createComment",

    // Groups (we'll add these to your backend)
    GROUPS: "/groups",
    CREATE_GROUP: "/createGroup",
    JOIN_GROUP: "/joinGroup",
    LEAVE_GROUP: "/leaveGroup",
    GROUP_MESSAGES: "/groupMessages",
    SEND_MESSAGE: "/sendMessage",

    // User Profile (we'll add these to your backend)
    USER_PROFILE: "/profile",
    UPDATE_PROFILE: "/updateProfile",
    USER_BOOKS: "/userBooks",
    USER_ACTIVITY: "/userActivity",
  },
}

// Enhanced utility function for API calls with better error handling
async function apiCall(endpoint, options = {}) {
  const url = `${CONFIG.API_BASE_URL}${endpoint}`
  const defaultOptions = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  }

  const finalOptions = { ...defaultOptions, ...options }

  try {
    const response = await fetch(url, finalOptions)

    // Handle different content types
    const contentType = response.headers.get("content-type")
    let data

    if (contentType && contentType.includes("application/json")) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    if (!response.ok) {
      // Handle different error formats
      const errorMessage =
        typeof data === "object" && data.error
          ? data.error
          : typeof data === "string"
            ? data
            : `HTTP error! status: ${response.status}`

      throw new Error(errorMessage)
    }

    return data
  } catch (error) {
    console.error("API call failed:", error)

    // Handle network errors
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Network error. Please check your connection and ensure the server is running.")
    }

    throw error
  }
}

// Utility function to check if user is authenticated
function isAuthenticated() {
  const user = localStorage.getItem("user")
  return user !== null
}

// Utility function to get current user
function getCurrentUser() {
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

// Utility function to handle authentication redirects
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = "login.html"
    return false
  }
  return true
}

// Global error handler for API calls
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason)

  // Show user-friendly error message
  if (event.reason.message.includes("Network error")) {
    showGlobalError("Connection error. Please check if the server is running on http://localhost:3003")
  }
})

// Global error display function
function showGlobalError(message) {
  // Create or update global error banner
  let errorBanner = document.getElementById("global-error-banner")

  if (!errorBanner) {
    errorBanner = document.createElement("div")
    errorBanner.id = "global-error-banner"
    errorBanner.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #dc2626;
      color: white;
      padding: 1rem;
      text-align: center;
      z-index: 10000;
      font-family: Georgia, serif;
    `
    document.body.prepend(errorBanner)
  }

  errorBanner.textContent = message
  errorBanner.style.display = "block"

  // Auto-hide after 5 seconds
  setTimeout(() => {
    errorBanner.style.display = "none"
  }, 5000)
}

// Make functions globally available
window.CONFIG = CONFIG
window.apiCall = apiCall
window.isAuthenticated = isAuthenticated
window.getCurrentUser = getCurrentUser
window.requireAuth = requireAuth
window.showGlobalError = showGlobalError
