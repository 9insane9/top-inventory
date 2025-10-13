const addBtn = document.getElementById("addItemBtn")
const dialog = document.getElementById("itemDialog")
const form = document.getElementById("itemForm")
const nameInput = document.getElementById("itemNameInput")
const priceInput = document.getElementById("itemPriceInput")
const quantityInput = document.getElementById("itemQuantityInput")
const categoryChecklist = document.getElementById("categoryChecklist")

let currentId = null // null = add, number = edit

// dialog
addBtn.addEventListener("click", () => {
  currentId = null
  nameInput.value = ""
  dialog.showModal()
})

// edit
document.querySelectorAll(".editItemBtn").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
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

// submit
form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const name = nameInput.value.trim()
  const price = document.getElementById("itemPriceInput").value.trim()
  const quantity = document.getElementById("itemQuantityInput").value.trim()

  if (!name || !price || !quantity) return alert("Please fill all fields")

  const categoryIds = Array.from(
    categoryChecklist.querySelectorAll("input[type=checkbox]:checked")
  ).map((cb) => parseInt(cb.value))

  const method = currentId ? "PUT" : "POST"
  const url = currentId ? `/items/${currentId}` : "/items/new"

  try {
    // update main item data
    const resItem = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, quantity }),
    })

    if (!resItem.ok) throw new Error(`HTTP ${resItem.status}`)

    // update categories for item
    if (currentId) {
      const resCats = await fetch(`/items/${currentId}/categories`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryIds }),
      })
      if (!resCats.ok) throw new Error(`HTTP ${resCats.status}`)
    }

    dialog.close()
    location.reload()
  } catch (err) {
    console.error("Error saving item or categories:", err)
    alert("Failed to save item")
  }
})

// delete
document.querySelectorAll(".deleteItemBtn").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
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
