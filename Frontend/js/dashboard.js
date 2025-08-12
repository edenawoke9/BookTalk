// Enhanced Dashboard functionality with backend integration
document.addEventListener("DOMContentLoaded", () => {
  // Declare variables before using them
  const requireAuth = () => {
    // Placeholder for authentication check logic
    return true // Replace with actual logic
  }

  const getCurrentUser = () => {
    // Placeholder for getting current user logic
    return { name: "John Doe" } // Replace with actual logic
  }

  const logout = async () => {
    // Placeholder for logout logic
    return // Replace with actual logic
  }

  const showGlobalError = (message) => {
    // Placeholder for showing global error logic
    alert(message) // Replace with actual logic
  }

  const apiCall = async (endpoint) => {
    // Placeholder for API call logic
    return [] // Replace with actual logic
  }

  const CONFIG = {
    ENDPOINTS: {
      BOOKS: "books_endpoint",
      USER_PROFILE: "user_profile_endpoint",
    },
  }

  // Check authentication first
  if (!requireAuth()) return

  const user = getCurrentUser()

  // Display user name
  const userNameElement = document.getElementById("userName")
  if (userNameElement && user.name) {
    userNameElement.textContent = user.name
  }

  // Load dashboard data
  loadDashboardData()

  // Logout functionality
  const logoutBtn = document.getElementById("logoutBtn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault()

      // Confirm logout
      if (!confirm("Are you sure you want to logout?")) {
        return
      }

      // Disable button during logout
      logoutBtn.disabled = true
      logoutBtn.textContent = "Logging out..."

      try {
        await logout()
      } catch (error) {
        console.error("Logout error:", error)
        // Re-enable button if logout fails
        logoutBtn.disabled = false
        logoutBtn.textContent = "Logout"
        showGlobalError("Failed to logout properly, but you will be redirected.")

        // Force redirect after error
        setTimeout(() => {
          localStorage.removeItem("user")
          window.location.href = "login.html"
        }, 2000)
      }
    })
  }

  // Load dashboard statistics and recent activity
  async function loadDashboardData() {
    try {
      // Load recent books
      const books = await apiCall(CONFIG.ENDPOINTS.BOOKS)
      updateBookStats(books)

      // Load user profile data if available
      try {
        const profile = await apiCall(CONFIG.ENDPOINTS.USER_PROFILE)
        updateUserStats(profile)
      } catch (error) {
        console.log("Profile data not available:", error.message)
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      // Don't show error for dashboard data - it's not critical
    }
  }

  function updateBookStats(books) {
    // Update book count in dashboard cards if elements exist
    const bookCountElements = document.querySelectorAll("[data-book-count]")
    bookCountElements.forEach((element) => {
      element.textContent = Array.isArray(books) ? books.length : 0
    })
  }

  function updateUserStats(profile) {
    // Update user stats if profile data is available
    if (profile) {
      const statsElements = {
        booksRead: document.querySelector("[data-books-read]"),
        groupsJoined: document.querySelector("[data-groups-joined]"),
        reviewsWritten: document.querySelector("[data-reviews-written]"),
      }

      if (statsElements.booksRead) {
        statsElements.booksRead.textContent = profile.booksRead || 0
      }
      if (statsElements.groupsJoined) {
        statsElements.groupsJoined.textContent = profile.groupsJoined || 0
      }
      if (statsElements.reviewsWritten) {
        statsElements.reviewsWritten.textContent = profile.reviewsWritten || 0
      }
    }
  }
})
