const dialog = document.getElementById("itemDialog")
const form = document.getElementById("itemForm")
const nameInput = document.getElementById("itemNameInput")
const addBtn = document.getElementById("addItemBtn")

let currentId = null // null = add, number = edit

// dialog
addBtn.addEventListener("click", () => {
  currentId = null
  nameInput.value = ""
  dialog.showModal()
})

// edit
document.querySelectorAll(".editItemBtn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const li = e.target.closest("li")
    currentId = li.dataset.id

    // prefill all fields
    nameInput.value = li.querySelector(".itemName").textContent
    document.getElementById("itemPriceInput").value =
      li.querySelector(".itemPrice").textContent
    document.getElementById("itemQuantityInput").value =
      li.querySelector(".itemQuantity").textContent

    dialog.showModal()
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
  const price = document.getElementById("itemPriceInput").value.trim()
  const quantity = document.getElementById("itemQuantityInput").value.trim()

  if (!name || !price || !quantity) return alert("Please fill all fields")

  const method = currentId ? "PUT" : "POST"
  const url = currentId ? `/items/${currentId}` : "/items/new"

  console.log(`Sending ${method} request to ${url}`)

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, quantity }),
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    dialog.close()
    location.reload()
  } catch (err) {
    console.error("Error saving item:", err)
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
