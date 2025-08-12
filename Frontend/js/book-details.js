// Book Details and Comments functionality
document.addEventListener("DOMContentLoaded", () => {
  // Declare variables before using them
  const apiCall = window.apiCall // Assuming apiCall is a global function or imported
  const CONFIG = window.CONFIG // Assuming CONFIG is a global object or imported

  // Check authentication
  const user = JSON.parse(localStorage.getItem("user") || "null")
  if (!user) {
    window.location.href = "login.html"
    return
  }

  // Get book ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search)
  const bookId = urlParams.get("id")

  if (!bookId) {
    showErrorState()
    return
  }

  // DOM elements
  const loadingState = document.getElementById("loadingState")
  const bookDetailsSection = document.getElementById("bookDetailsSection")
  const commentsSection = document.getElementById("commentsSection")
  const errorState = document.getElementById("errorState")
  const commentForm = document.getElementById("commentForm")
  const commentsContainer = document.getElementById("commentsContainer")
  const emptyComments = document.getElementById("emptyComments")
  const editBookBtn = document.getElementById("editBookBtn")
  const deleteBookBtn = document.getElementById("deleteBookBtn")
  const bookModal = document.getElementById("bookModal")
  const closeModal = document.getElementById("closeModal")
  const cancelBtn = document.getElementById("cancelBtn")
  const bookForm = document.getElementById("bookForm")

  let currentBook = null
  let comments = []

  // Initialize page
  loadBookDetails()
  loadComments()

  // Event listeners
  commentForm.addEventListener("submit", handleCommentSubmit)
  editBookBtn.addEventListener("click", () => openEditModal())
  deleteBookBtn.addEventListener("click", handleDeleteBook)
  closeModal.addEventListener("click", () => closeModalHandler())
  cancelBtn.addEventListener("click", () => closeModalHandler())
  bookForm.addEventListener("submit", handleBookUpdate)

  // Close modal when clicking outside
  bookModal.addEventListener("click", (e) => {
    if (e.target === bookModal) closeModalHandler()
  })

  // Load book details
  async function loadBookDetails() {
    try {
      showLoading(true)
      const response = await apiCall(`${CONFIG.ENDPOINTS.BOOKS}/${bookId}`)
      currentBook = response
      displayBookDetails(currentBook)
      showBookDetails(true)
    } catch (error) {
      console.error("Error loading book details:", error)
      showErrorState()
    } finally {
      showLoading(false)
    }
  }

  // Load comments for the book
  async function loadComments() {
    try {
      // Note: Your backend doesn't have a specific comments endpoint for books
      // We'll need to create a mock or update your backend
      // For now, we'll simulate comments
      comments = await simulateComments()
      displayComments(comments)
      showComments(true)
    } catch (error) {
      console.error("Error loading comments:", error)
      comments = []
      displayComments([])
      showComments(true)
    }
  }

  // Simulate comments (replace with real API call when backend is updated)
  async function simulateComments() {
    // This is temporary - you'll need to add comments endpoints to your backend
    return [
      {
        id: 1,
        body: "This book completely changed my perspective on the genre. The character development is exceptional and the plot keeps you engaged throughout.",
        date: new Date("2024-01-15"),
        author: { name: "Sarah Johnson", id: 1 },
      },
      {
        id: 2,
        body: "I couldn't put this book down! The writing style is captivating and the themes are very relevant to today's world.",
        date: new Date("2024-01-10"),
        author: { name: "Mike Chen", id: 2 },
      },
    ]
  }

  // Display book details
  function displayBookDetails(book) {
    document.getElementById("bookTitle").textContent = book.name
    document.getElementById("bookGenre").textContent = book.genre
    document.getElementById("bookDescription").textContent = book.desc || "No description available."

    // Handle book cover
    const coverImg = document.getElementById("bookCoverImg")
    const coverContainer = coverImg.parentElement
    if (book.coverImg) {
      coverImg.src = book.coverImg
      coverImg.alt = book.name
      coverContainer.classList.remove("no-image")
    } else {
      coverContainer.classList.add("no-image")
    }

    // Handle rating
    const ratingContainer = document.getElementById("bookRating")
    if (book.review) {
      ratingContainer.innerHTML = `
        <span class="rating-stars">${"⭐".repeat(book.review)}</span>
        <span class="rating-text">${book.review}/5 stars</span>
      `
    } else {
      ratingContainer.innerHTML = `
        <span class="rating-text">No rating yet</span>
      `
    }

    // Update page title
    document.title = `${book.name} - BookTalk`
  }

  // Display comments
  function displayComments(commentsList) {
    if (commentsList.length === 0) {
      commentsContainer.style.display = "none"
      emptyComments.style.display = "block"
      return
    }

    commentsContainer.style.display = "block"
    emptyComments.style.display = "none"

    commentsContainer.innerHTML = commentsList
      .map(
        (comment) => `
        <div class="comment-item">
          <div class="comment-header">
            <div class="comment-author">
              <div class="author-avatar">
                ${comment.author.name.charAt(0).toUpperCase()}
              </div>
              <span class="author-name">${escapeHtml(comment.author.name)}</span>
            </div>
            <span class="comment-date">${formatDate(comment.date)}</span>
          </div>
          <p class="comment-body">${escapeHtml(comment.body)}</p>
        </div>
      `,
      )
      .join("")
  }

  // Handle comment submission
  async function handleCommentSubmit(e) {
    e.preventDefault()

    const submitButton = e.target.querySelector('button[type="submit"]')
    const formData = new FormData(e.target)
    const commentBody = formData.get("body").trim()

    if (!commentBody) {
      showCommentError("Please enter a comment.")
      return
    }

    hideCommentError()
    setButtonLoading(submitButton, true)

    try {
      // Create new comment object (simulate API call)
      const newComment = {
        id: Date.now(), // Temporary ID
        body: commentBody,
        date: new Date(),
        author: { name: user.name, id: user.id },
      }

      // Add to comments array (in real app, this would be an API call)
      comments.unshift(newComment)

      // Update display
      displayComments(comments)

      // Clear form
      e.target.reset()

      // Show success (optional)
      showCommentSuccess("Comment added successfully!")
    } catch (error) {
      console.error("Error adding comment:", error)
      showCommentError("Failed to add comment. Please try again.")
    } finally {
      setButtonLoading(submitButton, false)
    }
  }

  // Handle book deletion
  async function handleDeleteBook() {
    if (!confirm("Are you sure you want to delete this book? This action cannot be undone.")) {
      return
    }

    try {
      await apiCall(`${CONFIG.ENDPOINTS.DELETE_BOOK}/${bookId}`, {
        method: "DELETE",
      })

      // Redirect to books page after successful deletion
      window.location.href = "books.html"
    } catch (error) {
      console.error("Error deleting book:", error)
      alert("Failed to delete book. Please try again.")
    }
  }

  // Open edit modal
  function openEditModal() {
    if (!currentBook) return

    document.getElementById("bookId").value = currentBook.id
    document.getElementById("bookName").value = currentBook.name || ""
    document.getElementById("bookGenreEdit").value = currentBook.genre || ""
    document.getElementById("bookDesc").value = currentBook.desc || ""
    document.getElementById("bookReview").value = currentBook.review || ""
    document.getElementById("bookCover").value = currentBook.coverImg || ""

    bookModal.style.display = "flex"
    document.body.style.overflow = "hidden"
  }

  // Close modal
  function closeModalHandler() {
    bookModal.style.display = "none"
    document.body.style.overflow = "auto"
    hideModalError()
  }

  // Handle book update
  async function handleBookUpdate(e) {
    e.preventDefault()

    const submitButton = e.target.querySelector('button[type="submit"]')
    const formData = new FormData(e.target)

    const bookData = {
      name: formData.get("name"),
      genre: formData.get("genre"),
      desc: formData.get("desc") || "",
      review: formData.get("review") ? Number.parseInt(formData.get("review")) : null,
      coverImg: formData.get("coverImg") || "",
    }

    hideModalError()
    setButtonLoading(submitButton, true)

    try {
      await apiCall(`${CONFIG.ENDPOINTS.UPDATE_BOOK}/${bookId}`, {
        method: "PUT",
        body: JSON.stringify(bookData),
      })

      // Update current book data
      currentBook = { ...currentBook, ...bookData }

      // Refresh display
      displayBookDetails(currentBook)

      // Close modal
      closeModalHandler()
    } catch (error) {
      console.error("Error updating book:", error)
      showModalError(error.message || "Failed to update book. Please try again.")
    } finally {
      setButtonLoading(submitButton, false)
    }
  }

  // Utility functions
  function showLoading(show) {
    loadingState.style.display = show ? "block" : "none"
  }

  function showBookDetails(show) {
    bookDetailsSection.style.display = show ? "block" : "none"
  }

  function showComments(show) {
    commentsSection.style.display = show ? "block" : "none"
  }

  function showErrorState() {
    errorState.style.display = "block"
    bookDetailsSection.style.display = "none"
    commentsSection.style.display = "none"
  }

  function showCommentError(message) {
    const errorElement = document.getElementById("commentError")
    if (errorElement) {
      errorElement.textContent = message
      errorElement.style.display = "block"
    }
  }

  function hideCommentError() {
    const errorElement = document.getElementById("commentError")
    if (errorElement) {
      errorElement.style.display = "none"
    }
  }

  function showCommentSuccess(message) {
    // You can implement a success message display here
    console.log(message)
  }

  function showModalError(message) {
    const errorElement = document.getElementById("modalError")
    if (errorElement) {
      errorElement.textContent = message
      errorElement.style.display = "block"
    }
  }

  function hideModalError() {
    const errorElement = document.getElementById("modalError")
    if (errorElement) {
      errorElement.style.display = "none"
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

  function escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }

  function formatDate(date) {
    const now = new Date()
    const commentDate = new Date(date)
    const diffTime = Math.abs(now - commentDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return commentDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    }
  }
})
