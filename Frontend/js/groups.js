// Groups page functionality
document.addEventListener("DOMContentLoaded", () => {
  // Check authentication
  const user = JSON.parse(localStorage.getItem("user") || "null")
  if (!user) {
    window.location.href = "login.html"
    return
  }

  // DOM elements
  const groupsGrid = document.getElementById("groupsGrid")
  const loadingState = document.getElementById("loadingState")
  const emptyState = document.getElementById("emptyState")
  const createGroupBtn = document.getElementById("createGroupBtn")
  const groupModal = document.getElementById("groupModal")
  const groupDetailsModal = document.getElementById("groupDetailsModal")
  const closeModal = document.getElementById("closeModal")
  const closeDetailsModal = document.getElementById("closeDetailsModal")
  const cancelBtn = document.getElementById("cancelBtn")
  const groupForm = document.getElementById("groupForm")
  const messageForm = document.getElementById("messageForm")
  const searchInput = document.getElementById("searchInput")
  const searchBtn = document.getElementById("searchBtn")
  const categoryFilter = document.getElementById("categoryFilter")
  const tabBtns = document.querySelectorAll(".tab-btn")

  let allGroups = []
  let filteredGroups = []
  let currentTab = "all"
  const userGroups = new Set() // Track which groups user has joined
  let currentGroupDetails = null

  // Initialize page
  loadGroups()
  setupEventListeners()

  function setupEventListeners() {
    // Modal events
    createGroupBtn.addEventListener("click", () => openModal())
    closeModal.addEventListener("click", () => closeModalHandler())
    closeDetailsModal.addEventListener("click", () => closeDetailsModalHandler())
    cancelBtn.addEventListener("click", () => closeModalHandler())
    groupForm.addEventListener("submit", handleGroupSubmit)
    messageForm.addEventListener("submit", handleMessageSubmit)

    // Search and filter events
    searchBtn.addEventListener("click", handleSearch)
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSearch()
    })
    categoryFilter.addEventListener("change", handleFilter)

    // Tab events
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const tab = e.target.dataset.tab
        switchTab(tab)
      })
    })

    // Close modals when clicking outside
    groupModal.addEventListener("click", (e) => {
      if (e.target === groupModal) closeModalHandler()
    })
    groupDetailsModal.addEventListener("click", (e) => {
      if (e.target === groupDetailsModal) closeDetailsModalHandler()
    })
  }

  // Load groups (simulated data for now)
  async function loadGroups() {
    try {
      showLoading(true)
      // Simulate API call - replace with real backend integration
      allGroups = await simulateGroupsData()
      filteredGroups = [...allGroups]
      displayGroups(filteredGroups)
    } catch (error) {
      console.error("Error loading groups:", error)
      allGroups = []
      filteredGroups = []
      displayGroups([])
    } finally {
      showLoading(false)
    }
  }

  // Simulate groups data (replace with real API)
  async function simulateGroupsData() {
    return [
      {
        id: 1,
        name: "Mystery Book Club",
        category: "Mystery",
        description:
          "Join us for thrilling discussions about mystery novels, crime fiction, and detective stories. We read one book per month and meet virtually every two weeks.",
        img: "",
        memberCount: 24,
        messageCount: 156,
        isPrivate: false,
        createdBy: 1,
        members: [1, 2, 3],
      },
      {
        id: 2,
        name: "Sci-Fi Enthusiasts",
        category: "Sci-Fi",
        description:
          "Explore the future through science fiction literature. From classic Asimov to modern Liu Cixin, we discuss all things sci-fi.",
        img: "",
        memberCount: 18,
        messageCount: 89,
        isPrivate: false,
        createdBy: 2,
        members: [2, 4, 5],
      },
      {
        id: 3,
        name: "Romance Readers United",
        category: "Romance",
        description:
          "A welcoming community for romance novel lovers. Contemporary, historical, paranormal - all subgenres welcome!",
        img: "",
        memberCount: 31,
        messageCount: 203,
        isPrivate: false,
        createdBy: 3,
        members: [1, 3, 6],
      },
      {
        id: 4,
        name: "Classic Literature Society",
        category: "Fiction",
        description:
          "Dive deep into the classics with fellow literature enthusiasts. Currently reading through the works of Jane Austen.",
        img: "",
        memberCount: 15,
        messageCount: 67,
        isPrivate: true,
        createdBy: 4,
        members: [4, 7, 8],
      },
    ]
  }

  // Display groups in grid
  function displayGroups(groups) {
    if (groups.length === 0) {
      groupsGrid.style.display = "none"
      emptyState.style.display = "block"
      return
    }

    groupsGrid.style.display = "grid"
    emptyState.style.display = "none"

    groupsGrid.innerHTML = groups
      .map(
        (group) => `
        <div class="group-card" onclick="openGroupDetails(${group.id})">
            <div class="group-image ${!group.img ? "no-image" : ""}">
                ${
                  group.img
                    ? `<img src="${group.img}" alt="${group.name}" onerror="this.parentElement.classList.add('no-image'); this.style.display='none';">`
                    : ""
                }
            </div>
            <div class="group-info">
                <h3 class="group-name">${escapeHtml(group.name)}</h3>
                <span class="group-category">${escapeHtml(group.category)}</span>
                <p class="group-description">${escapeHtml(group.description)}</p>
                <div class="group-stats">
                    <span class="group-stat">
                        <strong>${group.memberCount}</strong> members
                    </span>
                    <span class="group-stat">
                        <strong>${group.messageCount}</strong> messages
                    </span>
                    ${
                      group.isPrivate
                        ? '<span class="group-privacy">🔒 Private</span>'
                        : '<span class="group-privacy">🌐 Public</span>'
                    }
                </div>
            </div>
        </div>
    `,
      )
      .join("")
  }

  // Switch between tabs
  function switchTab(tab) {
    currentTab = tab

    // Update active tab button
    tabBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tab)
    })

    // Filter groups based on tab
    let groupsToShow = [...allGroups]

    switch (tab) {
      case "my-groups":
        groupsToShow = allGroups.filter((group) => userGroups.has(group.id) || group.createdBy === user.id)
        break
      case "popular":
        groupsToShow = allGroups.sort((a, b) => b.memberCount - a.memberCount)
        break
      case "all":
      default:
        groupsToShow = [...allGroups]
        break
    }

    filteredGroups = groupsToShow
    displayGroups(filteredGroups)
  }

  // Handle search
  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim()
    filterGroups(searchTerm, categoryFilter.value)
  }

  // Handle category filter
  function handleFilter() {
    const searchTerm = searchInput.value.toLowerCase().trim()
    filterGroups(searchTerm, categoryFilter.value)
  }

  // Filter groups based on search and category
  function filterGroups(searchTerm, category) {
    let baseGroups = [...allGroups]

    // Apply tab filter first
    switch (currentTab) {
      case "my-groups":
        baseGroups = allGroups.filter((group) => userGroups.has(group.id) || group.createdBy === user.id)
        break
      case "popular":
        baseGroups = allGroups.sort((a, b) => b.memberCount - a.memberCount)
        break
    }

    filteredGroups = baseGroups.filter((group) => {
      const matchesSearch =
        !searchTerm ||
        group.name.toLowerCase().includes(searchTerm) ||
        group.description.toLowerCase().includes(searchTerm)

      const matchesCategory = !category || group.category === category

      return matchesSearch && matchesCategory
    })

    displayGroups(filteredGroups)
  }

  // Open group details modal
  window.openGroupDetails = async (groupId) => {
    const group = allGroups.find((g) => g.id === groupId)
    if (!group) return

    currentGroupDetails = group

    // Populate group details
    document.getElementById("groupDetailsTitle").textContent = group.name
    document.getElementById("groupDetailsName").textContent = group.name
    document.getElementById("groupDetailsCategory").textContent = group.category
    document.getElementById("groupDetailsDescription").textContent = group.description
    document.getElementById("memberCount").textContent = group.memberCount
    document.getElementById("messageCount").textContent = group.messageCount
    document.getElementById("currentGroupId").value = group.id

    // Handle group image
    const imageElement = document.getElementById("groupDetailsImage")
    const imageContainer = imageElement.parentElement
    if (group.img) {
      imageElement.src = group.img
      imageElement.alt = group.name
      imageContainer.classList.remove("no-image")
    } else {
      imageContainer.classList.add("no-image")
    }

    // Show/hide action buttons based on membership
    const joinBtn = document.getElementById("joinGroupBtn")
    const leaveBtn = document.getElementById("leaveGroupBtn")
    const editBtn = document.getElementById("editGroupBtn")

    const isMember = userGroups.has(group.id)
    const isOwner = group.createdBy === user.id

    joinBtn.style.display = !isMember ? "block" : "none"
    leaveBtn.style.display = isMember && !isOwner ? "block" : "none"
    editBtn.style.display = isOwner ? "block" : "none"

    // Set up button events
    joinBtn.onclick = () => joinGroup(group.id)
    leaveBtn.onclick = () => leaveGroup(group.id)
    editBtn.onclick = () => editGroup(group)

    // Load group messages
    await loadGroupMessages(group.id)

    // Show modal
    groupDetailsModal.style.display = "flex"
    document.body.style.overflow = "hidden"
  }

  // Load group messages (simulated)
  async function loadGroupMessages(groupId) {
    const messages = [
      {
        id: 1,
        body: "Welcome to our group! Looking forward to great discussions.",
        author: { name: "Sarah Johnson", id: 1 },
        date: new Date("2024-01-15"),
      },
      {
        id: 2,
        body: "Just finished reading 'The Silent Patient' - what did everyone think?",
        author: { name: "Mike Chen", id: 2 },
        date: new Date("2024-01-14"),
      },
    ]

    displayGroupMessages(messages)
  }

  // Display group messages
  function displayGroupMessages(messages) {
    const container = document.getElementById("messagesContainer")

    if (messages.length === 0) {
      container.innerHTML =
        '<p style="text-align: center; color: #8b7355; font-style: italic;">No messages yet. Start the conversation!</p>'
      return
    }

    container.innerHTML = messages
      .map(
        (message) => `
        <div class="message-item">
            <div class="message-header">
                <span class="message-author">${escapeHtml(message.author.name)}</span>
                <span class="message-date">${formatDate(message.date)}</span>
            </div>
            <div class="message-body">${escapeHtml(message.body)}</div>
        </div>
    `,
      )
      .join("")

    // Scroll to bottom
    container.scrollTop = container.scrollHeight
  }

  // Handle message submission
  async function handleMessageSubmit(e) {
    e.preventDefault()

    const submitButton = e.target.querySelector('button[type="submit"]')
    const formData = new FormData(e.target)
    const messageBody = formData.get("body").trim()
    const groupId = formData.get("groupId") || document.getElementById("currentGroupId").value

    if (!messageBody) return

    setButtonLoading(submitButton, true)

    try {
      // Simulate sending message
      const newMessage = {
        id: Date.now(),
        body: messageBody,
        author: { name: user.name, id: user.id },
        date: new Date(),
      }

      // Add message to display (in real app, reload messages from API)
      const container = document.getElementById("messagesContainer")
      const messageHtml = `
        <div class="message-item">
            <div class="message-header">
                <span class="message-author">${escapeHtml(newMessage.author.name)}</span>
                <span class="message-date">Just now</span>
            </div>
            <div class="message-body">${escapeHtml(newMessage.body)}</div>
        </div>
      `
      container.insertAdjacentHTML("beforeend", messageHtml)
      container.scrollTop = container.scrollHeight

      // Clear form
      e.target.reset()
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Failed to send message. Please try again.")
    } finally {
      setButtonLoading(submitButton, false)
    }
  }

  // Join group
  async function joinGroup(groupId) {
    try {
      // Simulate API call
      userGroups.add(groupId)

      // Update group member count
      const group = allGroups.find((g) => g.id === groupId)
      if (group) {
        group.memberCount++
        document.getElementById("memberCount").textContent = group.memberCount
      }

      // Update buttons
      document.getElementById("joinGroupBtn").style.display = "none"
      document.getElementById("leaveGroupBtn").style.display = "block"

      // Refresh display if on "my-groups" tab
      if (currentTab === "my-groups") {
        switchTab("my-groups")
      }
    } catch (error) {
      console.error("Error joining group:", error)
      alert("Failed to join group. Please try again.")
    }
  }

  // Leave group
  async function leaveGroup(groupId) {
    if (!confirm("Are you sure you want to leave this group?")) return

    try {
      // Simulate API call
      userGroups.delete(groupId)

      // Update group member count
      const group = allGroups.find((g) => g.id === groupId)
      if (group) {
        group.memberCount--
        document.getElementById("memberCount").textContent = group.memberCount
      }

      // Update buttons
      document.getElementById("joinGroupBtn").style.display = "block"
      document.getElementById("leaveGroupBtn").style.display = "none"

      // Refresh display if on "my-groups" tab
      if (currentTab === "my-groups") {
        switchTab("my-groups")
      }
    } catch (error) {
      console.error("Error leaving group:", error)
      alert("Failed to leave group. Please try again.")
    }
  }

  // Edit group
  function editGroup(group) {
    closeDetailsModalHandler()
    openModal(group)
  }

  // Open modal for create/edit
  function openModal(group = null) {
    const modalTitle = document.getElementById("modalTitle")
    const groupId = document.getElementById("groupId")
    const submitBtn = groupForm.querySelector('button[type="submit"]')

    if (group) {
      modalTitle.textContent = "Edit Group"
      submitBtn.textContent = "Save Changes"
      groupId.value = group.id
      document.getElementById("groupName").value = group.name || ""
      document.getElementById("groupCategory").value = group.category || ""
      document.getElementById("groupDescription").value = group.description || ""
      document.getElementById("groupImage").value = group.img || ""
      document.getElementById("isPrivate").checked = group.isPrivate || false
    } else {
      modalTitle.textContent = "Create New Group"
      submitBtn.textContent = "Create Group"
      groupForm.reset()
      groupId.value = ""
    }

    groupModal.style.display = "flex"
    document.body.style.overflow = "hidden"
  }

  // Close create/edit modal
  function closeModalHandler() {
    groupModal.style.display = "none"
    document.body.style.overflow = "auto"
    hideModalError()
  }

  // Close details modal
  function closeDetailsModalHandler() {
    groupDetailsModal.style.display = "none"
    document.body.style.overflow = "auto"
    currentGroupDetails = null
  }

  // Handle group form submission
  async function handleGroupSubmit(e) {
    e.preventDefault()

    const submitButton = e.target.querySelector('button[type="submit"]')
    const formData = new FormData(e.target)
    const groupId = formData.get("groupId")

    const groupData = {
      name: formData.get("name"),
      category: formData.get("category"),
      description: formData.get("description"),
      img: formData.get("img") || "",
      isPrivate: formData.has("isPrivate"),
    }

    hideModalError()
    setButtonLoading(submitButton, true)

    try {
      if (groupId) {
        // Update existing group
        const groupIndex = allGroups.findIndex((g) => g.id === Number.parseInt(groupId))
        if (groupIndex !== -1) {
          allGroups[groupIndex] = { ...allGroups[groupIndex], ...groupData }
        }
      } else {
        // Create new group
        const newGroup = {
          id: Date.now(),
          ...groupData,
          memberCount: 1,
          messageCount: 0,
          createdBy: user.id,
          members: [user.id],
        }
        allGroups.unshift(newGroup)
        userGroups.add(newGroup.id)
      }

      closeModalHandler()
      switchTab(currentTab) // Refresh current view
    } catch (error) {
      console.error("Error saving group:", error)
      showModalError(error.message || "Failed to save group. Please try again.")
    } finally {
      setButtonLoading(submitButton, false)
    }
  }

  // Utility functions
  function showLoading(show) {
    loadingState.style.display = show ? "block" : "none"
    groupsGrid.style.display = show ? "none" : "grid"
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
    const messageDate = new Date(date)
    const diffTime = Math.abs(now - messageDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return messageDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    }
  }
})
