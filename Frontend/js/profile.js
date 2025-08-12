// Profile page functionality
document.addEventListener("DOMContentLoaded", () => {
  // Check authentication
  const user = JSON.parse(localStorage.getItem("user") || "null")
  if (!user) {
    window.location.href = "login.html"
    return
  }

  // DOM elements
  const tabBtns = document.querySelectorAll(".tab-btn")
  const tabPanes = document.querySelectorAll(".tab-pane")
  const editProfileBtn = document.getElementById("editProfileBtn")
  const settingsBtn = document.getElementById("settingsBtn")
  const changeAvatarBtn = document.getElementById("changeAvatarBtn")
  const addToReadingListBtn = document.getElementById("addToReadingListBtn")

  // Modal elements
  const editProfileModal = document.getElementById("editProfileModal")
  const settingsModal = document.getElementById("settingsModal")
  const addBookModal = document.getElementById("addBookModal")

  // Close buttons
  const closeEditModal = document.getElementById("closeEditModal")
  const closeSettingsModal = document.getElementById("closeSettingsModal")
  const closeAddBookModal = document.getElementById("closeAddBookModal")

  // Forms
  const editProfileForm = document.getElementById("editProfileForm")
  const addBookForm = document.getElementById("addBookForm")

  // Filter buttons
  const filterBtns = document.querySelectorAll(".filter-btn")

  let currentReadingListFilter = "all"
  let userProfile = null
  let readingList = []
  let userReviews = []
  let userGroups = []
  let userActivity = []

  // Initialize page
  loadUserProfile()
  loadUserData()
  setupEventListeners()

  function setupEventListeners() {
    // Tab switching
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const tab = e.target.dataset.tab
        switchTab(tab)
      })
    })

    // Modal events
    editProfileBtn.addEventListener("click", () => openEditProfileModal())
    settingsBtn.addEventListener("click", () => openSettingsModal())
    changeAvatarBtn.addEventListener("click", () => handleAvatarChange())
    addToReadingListBtn.addEventListener("click", () => openAddBookModal())

    // Close modal events
    closeEditModal.addEventListener("click", () => closeModal(editProfileModal))
    closeSettingsModal.addEventListener("click", () => closeModal(settingsModal))
    closeAddBookModal.addEventListener("click", () => closeModal(addBookModal))

    // Form submissions
    editProfileForm.addEventListener("submit", handleProfileUpdate)
    addBookForm.addEventListener("submit", handleAddBook)

    // Filter events
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const status = e.target.dataset.status
        if (status) {
          filterReadingList(status)
        }
      })
    })

    // Settings buttons
    document.getElementById("saveSettingsBtn")?.addEventListener("click", handleSaveSettings)
    document.getElementById("cancelSettingsBtn")?.addEventListener("click", () => closeModal(settingsModal))

    // Cancel buttons
    document.getElementById("cancelEditBtn")?.addEventListener("click", () => closeModal(editProfileModal))
    document.getElementById("cancelAddBookBtn")?.addEventListener("click", () => closeModal(addBookModal))

    // Book search
    document.getElementById("bookSearch")?.addEventListener("input", handleBookSearch)

    // Activity period filter
    document.getElementById("activityPeriod")?.addEventListener("change", handleActivityFilter)

    // Close modals when clicking outside
    editProfileModal.addEventListener("click", (e) => {
      if (e.target === editProfileModal) closeModal(editProfileModal)
    })
    settingsModal.addEventListener("click", (e) => {
      if (e.target === settingsModal) closeModal(settingsModal)
    })
    addBookModal.addEventListener("click", (e) => {
      if (e.target === addBookModal) closeModal(addBookModal)
    })
  }

  // Load user profile data
  async function loadUserProfile() {
    try {
      // In a real app, this would be an API call
      userProfile = {
        ...user,
        bio: user.bio || "Book lover and avid reader. Always looking for the next great story to dive into!",
        profileImg: user.profileImg || "",
        booksRead: 24,
        groupsJoined: 3,
        reviewsWritten: 12,
        readingGoal: 50,
        currentlyReading: 2,
        thisMonth: 3,
        thisYear: 24,
      }

      displayUserProfile(userProfile)
    } catch (error) {
      console.error("Error loading user profile:", error)
    }
  }

  // Load additional user data
  async function loadUserData() {
    try {
      // Simulate loading user's reading list, reviews, groups, and activity
      readingList = await simulateReadingList()
      userReviews = await simulateUserReviews()
      userGroups = await simulateUserGroups()
      userActivity = await simulateUserActivity()

      // Display data in respective tabs
      displayReadingList(readingList)
      displayUserReviews(userReviews)
      displayUserGroups(userGroups)
      displayUserActivity(userActivity)
      displayOverviewData()
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  // Display user profile information
  function displayUserProfile(profile) {
    document.getElementById("profileName").textContent = profile.name || "Unknown User"
    document.getElementById("profileUsername").textContent = `@${profile.username || "username"}`
    document.getElementById("profileBio").textContent = profile.bio || "No bio available"

    // Handle profile image
    const profileImage = document.getElementById("profileImage")
    const avatarPlaceholder = document.getElementById("avatarPlaceholder")

    if (profile.profileImg) {
      profileImage.src = profile.profileImg
      profileImage.style.display = "block"
      avatarPlaceholder.style.display = "none"
    } else {
      profileImage.style.display = "none"
      avatarPlaceholder.style.display = "block"
      avatarPlaceholder.textContent = profile.name ? profile.name.charAt(0).toUpperCase() : "👤"
    }

    // Update stats
    document.getElementById("booksReadCount").textContent = profile.booksRead || 0
    document.getElementById("groupsJoinedCount").textContent = profile.groupsJoined || 0
    document.getElementById("reviewsWrittenCount").textContent = profile.reviewsWritten || 0
  }

  // Display overview data
  function displayOverviewData() {
    // Update reading progress
    document.getElementById("currentlyReading").textContent = `${userProfile.currentlyReading} books`
    document.getElementById("thisMonth").textContent = `${userProfile.thisMonth} books`
    document.getElementById("thisYear").textContent = `${userProfile.thisYear} books`

    // Display favorite genres
    displayGenreChart()

    // Display recent activity
    displayRecentActivity()
  }

  // Display genre chart
  function displayGenreChart() {
    const genreData = [
      { name: "Fiction", count: 8, percentage: 40 },
      { name: "Mystery", count: 5, percentage: 25 },
      { name: "Romance", count: 4, percentage: 20 },
      { name: "Sci-Fi", count: 3, percentage: 15 },
    ]

    const genreChart = document.getElementById("genreChart")
    genreChart.innerHTML = genreData
      .map(
        (genre) => `
        <div class="genre-item">
            <span class="genre-name">${genre.name}</span>
            <div class="genre-bar">
                <div class="genre-fill" style="width: ${genre.percentage}%"></div>
            </div>
            <span class="genre-count">${genre.count}</span>
        </div>
    `,
      )
      .join("")
  }

  // Display recent activity
  function displayRecentActivity() {
    const recentActivities = userActivity.slice(0, 5)
    const activityFeed = document.getElementById("recentActivity")

    activityFeed.innerHTML = recentActivities
      .map(
        (activity) => `
        <div class="activity-item">
            <div class="activity-icon">${getActivityIcon(activity.type)}</div>
            <div class="activity-content">
                <div class="activity-text">${activity.text}</div>
                <div class="activity-time">${formatDate(activity.date)}</div>
            </div>
        </div>
    `,
      )
      .join("")
  }

  // Switch between tabs
  function switchTab(tabName) {
    // Update tab buttons
    tabBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tabName)
    })

    // Update tab panes
    tabPanes.forEach((pane) => {
      pane.classList.toggle("active", pane.id === `${tabName}-tab`)
    })
  }

  // Filter reading list
  function filterReadingList(status) {
    currentReadingListFilter = status

    // Update filter buttons
    filterBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.status === status)
    })

    // Filter and display books
    let filteredBooks = readingList
    if (status !== "all") {
      filteredBooks = readingList.filter((book) => book.status === status)
    }

    displayReadingList(filteredBooks)
  }

  // Display reading list
  function displayReadingList(books) {
    const grid = document.getElementById("readingListGrid")

    if (books.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #8b7355;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">📚</div>
            <h3>No books in this list</h3>
            <p>Add some books to get started!</p>
        </div>
      `
      return
    }

    grid.innerHTML = books
      .map(
        (book) => `
        <div class="reading-list-item">
            <span class="book-status status-${book.status}">${getStatusLabel(book.status)}</span>
            <h4 style="color: #2c1810; font-family: Georgia, serif; margin-bottom: 0.5rem;">${escapeHtml(
              book.title,
            )}</h4>
            <p style="color: #5d4037; font-size: 0.9rem; margin-bottom: 1rem;">${escapeHtml(book.author)}</p>
            ${book.rating ? `<div style="color: #ffd700; margin-bottom: 0.5rem;">${"⭐".repeat(book.rating)}</div>` : ""}
            ${book.notes ? `<p style="color: #5d4037; font-size: 0.9rem; font-style: italic;">"${escapeHtml(book.notes)}"</p>` : ""}
        </div>
    `,
      )
      .join("")
  }

  // Display user reviews
  function displayUserReviews(reviews) {
    const grid = document.getElementById("reviewsGrid")
    document.getElementById("totalReviews").textContent = reviews.length

    if (reviews.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #8b7355;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⭐</div>
            <h3>No reviews yet</h3>
            <p>Start reviewing books you've read!</p>
        </div>
      `
      return
    }

    grid.innerHTML = reviews
      .map(
        (review) => `
        <div class="review-item">
            <h4 class="review-book-title">${escapeHtml(review.bookTitle)}</h4>
            <div class="review-rating">${"⭐".repeat(review.rating)}</div>
            <p class="review-text">${escapeHtml(review.text)}</p>
            <div style="margin-top: 1rem; color: #8b7355; font-size: 0.85rem; font-style: italic;">
                Reviewed on ${formatDate(review.date)}
            </div>
        </div>
    `,
      )
      .join("")
  }

  // Display user groups
  function displayUserGroups(groups) {
    const grid = document.getElementById("userGroupsGrid")

    if (groups.length === 0) {
      grid.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: #8b7355;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">👥</div>
            <h3>No groups joined yet</h3>
            <p>Join reading groups to connect with other book lovers!</p>
            <a href="groups.html" class="btn btn-primary" style="margin-top: 1rem;">Browse Groups</a>
        </div>
      `
      return
    }

    grid.innerHTML = groups
      .map(
        (group) => `
        <div class="overview-card" style="cursor: pointer;" onclick="window.location.href='groups.html'">
            <h4 style="color: #2c1810; font-family: Georgia, serif; margin-bottom: 0.5rem;">${escapeHtml(group.name)}</h4>
            <span style="display: inline-block; background: linear-gradient(135deg, #8b4513, #a0522d); color: #f7f5f3; padding: 0.2rem 0.6rem; border-radius: 15px; font-size: 0.8rem; margin-bottom: 1rem;">${escapeHtml(group.category)}</span>
            <p style="color: #5d4037; font-size: 0.9rem; line-height: 1.5;">${escapeHtml(group.description)}</p>
            <div style="margin-top: 1rem; display: flex; justify-content: space-between; color: #8b7355; font-size: 0.85rem;">
                <span>${group.memberCount} members</span>
                <span>${group.messageCount} messages</span>
            </div>
        </div>
    `,
      )
      .join("")
  }

  // Display user activity
  function displayUserActivity(activities) {
    const timeline = document.getElementById("activityTimeline")

    if (activities.length === 0) {
      timeline.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: #8b7355;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">📈</div>
            <h3>No activity yet</h3>
            <p>Start reading and reviewing books to see your activity!</p>
        </div>
      `
      return
    }

    timeline.innerHTML = activities
      .map(
        (activity) => `
        <div class="timeline-item">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                <span style="font-size: 1.5rem;">${getActivityIcon(activity.type)}</span>
                <div>
                    <div style="color: #2c1810; font-family: Georgia, serif; font-weight: 500;">${activity.text}</div>
                    <div style="color: #8b7355; font-size: 0.85rem; font-style: italic;">${formatDate(activity.date)}</div>
                </div>
            </div>
        </div>
    `,
      )
      .join("")
  }

  // Handle profile update
  async function handleProfileUpdate(e) {
    e.preventDefault()

    const submitButton = e.target.querySelector('button[type="submit"]')
    const formData = new FormData(e.target)

    const profileData = {
      name: formData.get("name"),
      username: formData.get("username"),
      bio: formData.get("bio"),
      profileImg: formData.get("profileImg"),
    }

    setButtonLoading(submitButton, true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update user profile
      userProfile = { ...userProfile, ...profileData }
      const updatedUser = { ...user, ...profileData }

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser))

      // Update display
      displayUserProfile(userProfile)

      // Close modal
      closeModal(editProfileModal)
    } catch (error) {
      console.error("Error updating profile:", error)
      showModalError("editModalError", "Failed to update profile. Please try again.")
    } finally {
      setButtonLoading(submitButton, false)
    }
  }

  // Handle add book to reading list
  async function handleAddBook(e) {
    e.preventDefault()

    const submitButton = e.target.querySelector('button[type="submit"]')
    const formData = new FormData(e.target)

    const bookData = {
      id: Date.now(),
      title: document.getElementById("bookSearch").value,
      author: "Unknown Author", // In real app, this would come from search results
      status: formData.get("status"),
      dateAdded: new Date(),
    }

    setButtonLoading(submitButton, true)

    try {
      // Add to reading list
      readingList.unshift(bookData)

      // Update display
      displayReadingList(readingList)

      // Close modal and reset form
      closeModal(addBookModal)
      e.target.reset()
    } catch (error) {
      console.error("Error adding book:", error)
      alert("Failed to add book. Please try again.")
    } finally {
      setButtonLoading(submitButton, false)
    }
  }

  // Handle book search
  function handleBookSearch(e) {
    const query = e.target.value.trim()
    const resultsContainer = document.getElementById("bookSearchResults")

    if (query.length < 2) {
      resultsContainer.style.display = "none"
      return
    }

    // Simulate book search results
    const mockResults = [
      { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
      { title: "To Kill a Mockingbird", author: "Harper Lee" },
      { title: "1984", author: "George Orwell" },
    ].filter((book) => book.title.toLowerCase().includes(query.toLowerCase()))

    if (mockResults.length > 0) {
      resultsContainer.innerHTML = mockResults
        .map(
          (book) => `
          <div class="search-result-item" onclick="selectBook('${book.title}', '${book.author}')">
              <strong>${book.title}</strong><br>
              <small>by ${book.author}</small>
          </div>
      `,
        )
        .join("")
      resultsContainer.style.display = "block"
    } else {
      resultsContainer.style.display = "none"
    }
  }

  // Select book from search results
  window.selectBook = (title, author) => {
    document.getElementById("bookSearch").value = title
    document.getElementById("bookSearchResults").style.display = "none"
  }

  // Handle avatar change
  function handleAvatarChange() {
    const newImageUrl = prompt("Enter the URL of your new profile image:")
    if (newImageUrl) {
      userProfile.profileImg = newImageUrl
      displayUserProfile(userProfile)
    }
  }

  // Handle settings save
  function handleSaveSettings() {
    // Get settings values
    const readingGoal = document.getElementById("readingGoal").value
    const publicProfile = document.getElementById("publicProfile").checked
    const emailNotifications = document.getElementById("emailNotifications").checked
    const showReadingList = document.getElementById("showReadingList").checked
    const showActivity = document.getElementById("showActivity").checked

    // Save settings (in real app, this would be an API call)
    console.log("Settings saved:", {
      readingGoal,
      publicProfile,
      emailNotifications,
      showReadingList,
      showActivity,
    })

    closeModal(settingsModal)
  }

  // Handle activity filter
  function handleActivityFilter(e) {
    const period = e.target.value
    // In real app, this would filter activities by the selected period
    console.log("Filter activity by:", period)
  }

  // Open modals
  function openEditProfileModal() {
    // Populate form with current data
    document.getElementById("editName").value = userProfile.name || ""
    document.getElementById("editUsername").value = userProfile.username || ""
    document.getElementById("editBio").value = userProfile.bio || ""
    document.getElementById("editProfileImg").value = userProfile.profileImg || ""

    editProfileModal.style.display = "flex"
    document.body.style.overflow = "hidden"
  }

  function openSettingsModal() {
    settingsModal.style.display = "flex"
    document.body.style.overflow = "hidden"
  }

  function openAddBookModal() {
    addBookModal.style.display = "flex"
    document.body.style.overflow = "hidden"
  }

  // Close modal
  function closeModal(modal) {
    modal.style.display = "none"
    document.body.style.overflow = "auto"
  }

  // Utility functions
  function getStatusLabel(status) {
    const labels = {
      "want-to-read": "Want to Read",
      "currently-reading": "Currently Reading",
      completed: "Completed",
    }
    return labels[status] || status
  }

  function getActivityIcon(type) {
    const icons = {
      book_added: "📚",
      book_completed: "✅",
      review_written: "⭐",
      group_joined: "👥",
      comment_posted: "💬",
    }
    return icons[type] || "📖"
  }

  function formatDate(date) {
    const now = new Date()
    const activityDate = new Date(date)
    const diffTime = Math.abs(now - activityDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return activityDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    }
  }

  function setButtonLoading(button, isLoading) {
    if (isLoading) {
      button.classList.add("loading")
      button.disabled = true
    } else {
      button.classList.remove("loading")
      button.disabled = false
    }
  }

  function showModalError(elementId, message) {
    const errorElement = document.getElementById(elementId)
    if (errorElement) {
      errorElement.textContent = message
      errorElement.style.display = "block"
    }
  }

  function escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }

  // Simulate data functions
  async function simulateReadingList() {
    return [
      {
        id: 1,
        title: "The Seven Husbands of Evelyn Hugo",
        author: "Taylor Jenkins Reid",
        status: "currently-reading",
        rating: null,
        notes: "Loving the storytelling so far!",
        dateAdded: new Date("2024-01-15"),
      },
      {
        id: 2,
        title: "Atomic Habits",
        author: "James Clear",
        status: "completed",
        rating: 5,
        notes: "Life-changing book about building good habits.",
        dateAdded: new Date("2024-01-10"),
      },
      {
        id: 3,
        title: "The Silent Patient",
        author: "Alex Michaelides",
        status: "want-to-read",
        rating: null,
        notes: "Heard great things about this thriller!",
        dateAdded: new Date("2024-01-08"),
      },
    ]
  }

  async function simulateUserReviews() {
    return [
      {
        id: 1,
        bookTitle: "The Great Gatsby",
        rating: 4,
        text: "A beautiful exploration of the American Dream and its disillusionment. Fitzgerald's prose is absolutely stunning.",
        date: new Date("2024-01-12"),
      },
      {
        id: 2,
        bookTitle: "To Kill a Mockingbird",
        rating: 5,
        text: "A timeless classic that deals with important themes of justice and morality. Harper Lee's storytelling is masterful.",
        date: new Date("2024-01-05"),
      },
    ]
  }

  async function simulateUserGroups() {
    return [
      {
        id: 1,
        name: "Mystery Book Club",
        category: "Mystery",
        description: "Monthly discussions about the best mystery novels and thrillers.",
        memberCount: 24,
        messageCount: 156,
      },
      {
        id: 2,
        name: "Classic Literature Society",
        category: "Fiction",
        description: "Diving deep into the classics with fellow literature enthusiasts.",
        memberCount: 15,
        messageCount: 67,
      },
    ]
  }

  async function simulateUserActivity() {
    return [
      {
        id: 1,
        type: "book_completed",
        text: "Finished reading 'Atomic Habits' by James Clear",
        date: new Date("2024-01-14"),
      },
      {
        id: 2,
        type: "review_written",
        text: "Wrote a review for 'The Great Gatsby'",
        date: new Date("2024-01-12"),
      },
      {
        id: 3,
        type: "group_joined",
        text: "Joined the Mystery Book Club",
        date: new Date("2024-01-10"),
      },
      {
        id: 4,
        type: "book_added",
        text: "Added 'The Silent Patient' to reading list",
        date: new Date("2024-01-08"),
      },
      {
        id: 5,
        type: "comment_posted",
        text: "Posted a comment in Classic Literature Society",
        date: new Date("2024-01-06"),
      },
    ]
  }
})
