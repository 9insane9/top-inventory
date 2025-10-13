const dialog = document.getElementById("categoryDialog")
const form = document.getElementById("categoryForm")
const nameInput = document.getElementById("categoryName")
const addBtn = document.getElementById("addCategoryBtn")

let currentId = null // null = add, number = edit

// dialog
addBtn.addEventListener("click", () => {
  currentId = null
  nameInput.value = ""
  dialog.showModal()
})

document.querySelectorAll(".editBtn").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    const li = e.target.closest("li")
    currentId = li.dataset.id

    try {
      const res = await fetch(`/api/categories/${currentId}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const category = await res.json()
      nameInput.value = category.name

      dialog.showModal()
    } catch (err) {
      console.error("Failed to fetch category data:", err)
      alert("Couldn't fetch category data — please try again.")
    }
  })
})

// cancel
document.getElementById("cancelBtn").addEventListener("click", () => {
  dialog.close()
})

// submission
form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const name = nameInput.value.trim()
  if (!name) return

  const method = currentId ? "PUT" : "POST"
  const url = currentId ? `/categories/${currentId}` : "/categories/new"

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    dialog.close()
    location.reload()
  } catch (err) {
    console.error("Error saving category:", err)
    alert("Failed to save category")
  }
})

// deletes
document.querySelectorAll(".deleteBtn").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    if (!confirm("Delete this category?")) return

    const li = e.target.closest("li")
    const id = li.dataset.id

    try {
      const res = await fetch(`/categories/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      location.reload()
    } catch (err) {
      console.error("Delete failed:", err)
      alert("Failed to delete category")
    }
  })
})
