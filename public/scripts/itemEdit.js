const addBtn = document.getElementById("addItemBtn")
const dialog = document.getElementById("itemDialog")
const form = document.getElementById("itemForm")
const nameInput = document.getElementById("itemNameInput")
const priceInput = document.getElementById("itemPriceInput")
const quantityInput = document.getElementById("itemQuantityInput")
const categoryChecklist = document.getElementById("categoryChecklist")
const errorContainer = document.getElementById("itemErrors")
const allCheckBoxes = document.querySelectorAll("input[type='checkbox']")

let currentId = null // null = add, number = edit

// dialog
addBtn.addEventListener("click", () => {
  errorContainer.innerHTML = ""
  currentId = null
  nameInput.value = ""
  priceInput.value = ""
  quantityInput.value = ""

  allCheckBoxes.forEach((cb) => (cb.checked = false))
  dialog.showModal()
})

// edit
document.querySelectorAll(".item").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    errorContainer.innerHTML = ""
    const li = e.target.closest("li")
    currentId = li.dataset.id

    try {
      const res = await fetch(`/api/items/${currentId}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const item = await res.json()

      nameInput.value = item.name
      priceInput.value = item.price
      quantityInput.value = item.quantity

      const resCats = await fetch(`/items/${currentId}/categories`)
      if (!resCats.ok) throw new Error(`HTTP ${resCats.status}`)
      const itemCategoryIds = (await resCats.json()).map((c) => c.id)

      // prefill checkboxes
      categoryChecklist
        .querySelectorAll("input[type=checkbox]")
        .forEach((cb) => {
          cb.checked = itemCategoryIds.includes(parseInt(cb.value))
        })

      dialog.showModal()
    } catch (err) {
      console.error("Failed to fetch item data or categories:", err)
      alert("Couldn't fetch data — please try again.")
    }
  })
})

// cancel
document.getElementById("cancelBtn").addEventListener("click", () => {
  dialog.close()
})

form.addEventListener("submit", async (e) => {
  e.preventDefault()
  errorContainer.innerHTML = ""

  const name = nameInput.value.trim()
  const price = priceInput.value.trim()
  const quantity = quantityInput.value.trim()

  const categoryIds = Array.from(
    categoryChecklist.querySelectorAll("input[type=checkbox]:checked")
  ).map((cb) => parseInt(cb.value))

  const method = currentId ? "PUT" : "POST"
  const url = currentId ? `/items/${currentId}` : "/items/new"

  try {
    //
    const resItem = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, quantity }),
    })

    const itemData = await resItem.json()

    if (!resItem.ok) {
      // Display server-side validation errors
      if (itemData.errors && Array.isArray(itemData.errors)) {
        errorContainer.innerHTML = itemData.errors
          .map((err) => `<p class="error">${err.msg}</p>`)
          .join("")
      } else if (itemData.error) {
        errorContainer.innerHTML = `<p class="error">${itemData.error}</p>`
      }
      return
    }

    // submit category updates (only for edits)
    if (currentId) {
      const resCats = await fetch(`/items/${currentId}/categories`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryIds }),
      })

      if (!resCats.ok) {
        const catData = await resCats.json()
        errorContainer.innerHTML = catData.error
          ? `<p class="error">${catData.error}</p>`
          : "<p class='error'>Failed to update categories</p>"
        return
      }
    }

    dialog.close()
    location.reload()
  } catch (err) {
    console.error("Error saving item or categories:", err)
    errorContainer.innerHTML = "<p class='error'>Failed to save item</p>"
  }
})

// delete
document.querySelectorAll(".deleteItemBtn").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.stopPropagation()

    if (!confirm("Delete this item?")) return
    const li = e.target.closest("li")
    const id = li.dataset.id
    try {
      const res = await fetch(`/items/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      location.reload()
    } catch (err) {
      console.error("Delete failed:", err)
      alert("Failed to delete item")
    }
  })
})
