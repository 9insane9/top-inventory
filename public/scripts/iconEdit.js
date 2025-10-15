document.addEventListener("DOMContentLoaded", () => {
  const dialog = document.getElementById("iconManagerDialog")
  const openBtn = document.getElementById("manageIconsBtn")
  const closeBtn = document.getElementById("closeIconManager")
  const iconList = document.getElementById("iconList")
  const addBtn = document.getElementById("addIconBtn")
  const newIconInput = document.getElementById("newIconInput")

  // Open dialog
  openBtn.addEventListener("click", () => {
    dialog.showModal()
    loadIcons()
  })

  // Close dialog
  closeBtn.addEventListener("click", () => {
    dialog.close()
    location.reload()
  })

  // Load icons
  async function loadIcons() {
    iconList.innerHTML = "<p>Loading icons...</p>"
    try {
      const res = await fetch("/icons")
      const icons = await res.json()

      iconList.innerHTML = ""

      icons.forEach((icon) => {
        const wrapper = document.createElement("div")
        wrapper.classList.add("iconEntry")
        wrapper.innerHTML = `
          <div class="iconPreview">${icon.svg}</div>
          <button data-id="${icon.id}" class="deleteIconBtn" type="button">Delete</button>
        `
        iconList.appendChild(wrapper)
      })

      // Attach delete handlers
      document.querySelectorAll(".deleteIconBtn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const id = e.target.dataset.id
          await fetch(`/icons/${id}`, { method: "DELETE" })
          loadIcons()
        })
      })
    } catch (err) {
      iconList.innerHTML = "<p>Failed to load icons.</p>"
      console.error(err)
    }
  }

  // add icon
  addBtn.addEventListener("click", async () => {
    const svg = newIconInput.value.trim()
    if (!svg) return alert("Please paste SVG code first.")

    await fetch("/icons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ svg }),
    })

    newIconInput.value = ""
    loadIcons()
  })
})
