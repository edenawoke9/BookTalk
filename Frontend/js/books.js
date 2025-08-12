// Enhanced Books page functionality with backend integration
document.addEventListener("DOMContentLoaded", () => {
  // Declare variables before using them
  const requireAuth = () => {
    // Implement authentication check logic here
    return true // Placeholder for actual authentication logic
  }

  const getCurrentUser = () => {
    // Implement get current user logic here
    return { id: 1, name: "John Doe" } // Placeholder for actual user data
  }

  const apiCall = async (url, options = {}) => {
    // Implement API call logic here
    const response = await fetch(url, options)
    return response.json() // Placeholder for actual API response handling
  }

  const CONFIG = {
    ENDPOINTS: {
      BOOKS: "/api/books",
      CREATE_BOOK: "/api/books",
      UPDATE_BOOK: "/api/books",
      DELETE_BOOK: "/api/books",
    },
  }

  const showGlobalError = (message) => {
    // Implement global error display logic here
    alert(message) // Placeholder for actual error display logic
  }

  // Check authentication first
  if (!requireAuth()) return

  const user = getCurrentUser()

  // DOM elements
  const booksGrid = document.getElementById("booksGrid")
  const loadingState = document.getElementById("loadingState")
  const emptyState = document.getElementById("emptyState")
  const addBookBtn = document.getElementById("addBookBtn")
  const bookModal = document.getElementById("bookModal")
  const closeModal = document.getElementById("closeModal")
  const cancelBtn = document.getElementById("cancelBtn")
  const bookForm = document.getElementById("bookForm")
  const searchInput = document.getElementById("searchInput")
  const searchBtn = document.getElementById("searchBtn")
  const genreFilter = document.getElementById("genreFilter")

  let allBooks = []
  let filteredBooks = []

  // Initialize page
  loadBooks()

  // Event listeners
  addBookBtn.addEventListener("click", () => openModal())
  closeModal.addEventListener("click", () => closeModalHandler())
  cancelBtn.addEventListener("click", () => closeModalHandler())
  bookForm.addEventListener("submit", handleBookSubmit)
  searchBtn.addEventListener("click", handleSearch)
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch()
  })
  genreFilter.addEventListener("change", handleFilter)

  // Close modal when clicking outside
  bookModal.addEventListener("click", (e) => {
    if (e.target === bookModal) closeModalHandler()
  })

  // Load books from backend
  async function loadBooks() {
    try {
      showLoading(true)

      const response = await apiCall(CONFIG.ENDPOINTS.BOOKS)

      // Handle different response formats from your backend
      if (Array.isArray(response)) {
        allBooks = response
      } else if (response && Array.isArray(response.books)) {
        allBooks = response.books
      } else if (response && response.data && Array.isArray(response.data)) {
        allBooks = response.data
      } else {
        console.warn("Unexpected response format:", response)
        allBooks = []
      }

      filteredBooks = [...allBooks]
      displayBooks(filteredBooks)
    } catch (error) {
      console.error("Error loading books:", error)
      showGlobalError("Failed to load books: " + error.message)
      allBooks = []
      filteredBooks = []
      displayBooks([])
    } finally {
      showLoading(false)
    }
  }

  // Display books in grid
  function displayBooks(books) {
    if (books.length === 0) {
      booksGrid.style.display = "none"
      emptyState.style.display = "block"
      return
    }

    booksGrid.style.display = "grid"
    emptyState.style.display = "none"

    booksGrid.innerHTML = books
      .map(
        (book) => `
        <div class="book-card" data-book-id="${book.id}">
            <div class="book-cover ${!book.coverImg ? "no-image" : ""}">
                ${
                  book.coverImg
                    ? `<img src="${book.coverImg}" alt="${escapeHtml(book.name)}" onerror="this.parentElement.classList.add('no-image'); this.style.display='none';">`
                    : ""
                }
            </div>
            <div class="book-info">
                <h3 class="book-title">${escapeHtml(book.name)}</h3>
                <span class="book-genre">${escapeHtml(book.genre)}</span>
                ${book.desc ? `<p class="book-description">${escapeHtml(book.desc)}</p>` : ""}
                ${
                  book.review
                    ? `
                    <div class="book-rating">
                        <span class="stars">${"⭐".repeat(Math.min(5, Math.max(1, book.review)))}</span>
                        <span class="rating-text">${book.review}/5</span>
                    </div>
                `
                    : ""
                }
                <div class="book-actions">
                    <a href="book-details.html?id=${book.id}" class="btn btn-small btn-primary">
                        👁️ View Details
                    </a>
                    <button class="btn btn-small btn-edit" onclick="editBook(${book.id})">
                        ✏️ Edit
                    </button>
                    <button class="btn btn-small btn-delete" onclick="deleteBook(${book.id})">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
    `,
      )
      .join("")
  }

  // Show/hide loading state
  function showLoading(show) {
    loadingState.style.display = show ? "block" : "none"
    booksGrid.style.display = show ? "none" : "grid"
  }

  // Open modal for add/edit
  function openModal(book = null) {
    const modalTitle = document.getElementById("modalTitle")
    const bookId = document.getElementById("bookId")

    if (book) {
      modalTitle.textContent = "Edit Book"
      bookId.value = book.id
      document.getElementById("bookName").value = book.name || ""
      document.getElementById("bookGenre").value = book.genre || ""
      document.getElementById("bookDesc").value = book.desc || ""
      document.getElementById("bookReview").value = book.review || ""
      document.getElementById("bookCover").value = book.coverImg || ""
    } else {
      modalTitle.textContent = "Add New Book"
      bookForm.reset()
      bookId.value = ""
    }

    bookModal.style.display = "flex"
    document.body.style.overflow = "hidden"
  }

  // Close modal
  function closeModalHandler() {
    bookModal.style.display = "none"
    document.body.style.overflow = "auto"
    hideModalError()
  }

  // Handle book form submission
  async function handleBookSubmit(e) {
    e.preventDefault()

    const submitButton = e.target.querySelector('button[type="submit"]')
    const formData = new FormData(e.target)
    const bookId = formData.get("bookId")

    const bookData = {
      name: formData.get("name").trim(),
      genre: formData.get("genre"),
      desc: formData.get("desc").trim() || "",
      review: formData.get("review") ? Number.parseInt(formData.get("review")) : null,
      coverImg: formData.get("coverImg").trim() || "",
    }

    // Validation
    if (!bookData.name || !bookData.genre) {
      showModalError("Please fill in all required fields.")
      return
    }

    hideModalError()
    setButtonLoading(submitButton, true)

    try {
      if (bookId) {
        // Update existing book
        await apiCall(`${CONFIG.ENDPOINTS.UPDATE_BOOK}/${bookId}`, {
          method: "PUT",
          body: JSON.stringify(bookData),
        })
      } else {
        // Create new book
        await apiCall(CONFIG.ENDPOINTS.CREATE_BOOK, {
          method: "POST",
          body: JSON.stringify(bookData),
        })
      }

      closeModalHandler()
      await loadBooks() // Reload books from backend
    } catch (error) {
      console.error("Error saving book:", error)
      showModalError(error.message || "Failed to save book. Please try again.")
    } finally {
      setButtonLoading(submitButton, false)
    }
  }

  // Handle search
  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim()
    filterBooks(searchTerm, genreFilter.value)
  }

  // Handle genre filter
  function handleFilter() {
    const searchTerm = searchInput.value.toLowerCase().trim()
    filterBooks(searchTerm, genreFilter.value)
  }

  // Filter books based on search and genre
  function filterBooks(searchTerm, genre) {
    filteredBooks = allBooks.filter((book) => {
      const matchesSearch =
        !searchTerm ||
        book.name.toLowerCase().includes(searchTerm) ||
        (book.desc && book.desc.toLowerCase().includes(searchTerm))

      const matchesGenre = !genre || book.genre === genre

      return matchesSearch && matchesGenre
    })

    displayBooks(filteredBooks)
  }

  // Global functions for edit/delete buttons
  window.editBook = (bookId) => {
    const book = allBooks.find((b) => b.id === bookId)
    if (book) {
      openModal(book)
    }
  }

  window.deleteBook = async (bookId) => {
    const book = allBooks.find((b) => b.id === bookId)
    const bookName = book ? book.name : "this book"

    if (!confirm(`Are you sure you want to delete "${bookName}"? This action cannot be undone.`)) {
      return
    }

    try {
      await apiCall(`${CONFIG.ENDPOINTS.DELETE_BOOK}/${bookId}`, {
        method: "DELETE",
      })

      await loadBooks() // Reload books from backend
    } catch (error) {
      console.error("Error deleting book:", error)
      showGlobalError("Failed to delete book: " + error.message)
    }
  }

  // Utility functions
  function escapeHtml(text) {
    if (!text) return ""
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
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
      button.dataset.originalText = button.textContent
      button.textContent = "Saving..."
    } else {
      button.classList.remove("loading")
      button.disabled = false
      if (button.dataset.originalText) {
        button.textContent = button.dataset.originalText
      }
    }
  }
})
