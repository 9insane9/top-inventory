const dialog = document.getElementById("categoryDialog")
const form = document.getElementById("categoryForm")
const nameInput = document.getElementById("categoryName")
const addBtn = document.getElementById("addCategoryBtn")
const iconContainer = document.getElementById("iconSelector")
const errorContainer = document.getElementById("categoryErrors")

let currentId = null // null = add, number = edit

// dialog
addBtn.addEventListener("click", async () => {
  errorContainer.innerHTML = ""
  currentId = null
  nameInput.value = ""

  await loadIcons()
  dialog.showModal()
})

// edit
document.querySelectorAll(".categoryEditItem").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    errorContainer.innerHTML = ""
    const li = e.target.closest("li")
    currentId = li.dataset.id

    try {
      const res = await fetch(`/api/categories/${currentId}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const category = await res.json()
      nameInput.value = category.name

      await loadIcons(category.icon_id)
      dialog.showModal()
    } catch (err) {
      console.error("Failed to fetch category data:", err)
      alert("Couldn't fetch category data — please try again.")
    }
  })
})

// icon helper
async function loadIcons(preselectedIconId = null) {
  try {
    const res = await fetch("/icons")
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const icons = await res.json()

    iconContainer.innerHTML = icons
      .map(
        (icon) => `
        <label class="iconOption">
          <input
            type="radio"
            name="icon"
            value="${icon.id}"
            ${icon.id === preselectedIconId ? "checked" : ""}
          />
          <span class="iconPreview">${icon.svg}</span>
        </label>
      `
      )
      .join("")
  } catch (err) {
    console.error("Failed to load icons:", err)
  }

  iconContainer.insertAdjacentHTML(
    "afterbegin",
    '<p class="tooltip">Select icon:</p>'
  )
}

// cancel
document.getElementById("cancelBtn").addEventListener("click", () => {
  dialog.close()
})

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const name = nameInput.value.trim()

  const selectedIconRadio = iconContainer.querySelector(
    "input[name='icon']:checked"
  )
  const icon_id = selectedIconRadio ? Number(selectedIconRadio.value) : null

  const method = currentId ? "PUT" : "POST"
  const url = currentId ? `/categories/${currentId}` : "/categories/new"

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, icon_id }),
    })

    errorContainer.innerHTML = "" // clear previous errors

    if (!res.ok) {
      if (res.status === 400) {
        const data = await res.json()
        errorContainer.innerHTML = data.errors
          .map((err) => `<li class="error">${err.msg}</li>`)
          .join("")
        return
      }
      throw new Error(`HTTP ${res.status}`)
    }

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
    e.stopImmediatePropagation()
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
