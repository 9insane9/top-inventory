document.addEventListener("DOMContentLoaded", () => {
  const dialog = document.getElementById("iconManagerDialog")
  const openBtn = document.getElementById("manageIconsBtn")
  const closeBtn = document.getElementById("closeIconManager")
  const iconList = document.getElementById("iconList")
  const addBtn = document.getElementById("addIconBtn")
  const newIconInput = document.getElementById("newIconInput")
  const errorContainer = document.querySelector(".iconErrors")

  // open dialog
  openBtn.addEventListener("click", () => {
    dialog.showModal()
    loadIcons()
  })

  // close dialog
  closeBtn.addEventListener("click", () => {
    dialog.close()
    location.reload()
  })

  // load icons in icon manager dialog
  async function loadIcons() {
    iconList.innerHTML = "<p>Loading icons...</p>"
    errorContainer.innerHTML = "" // clear previous errors

    try {
      const res = await fetch("/icons")
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const icons = await res.json()

      iconList.innerHTML = "" // clear previous content

      icons.forEach((icon) => {
        const wrapper = document.createElement("div")
        wrapper.classList.add("iconEntry")
        wrapper.innerHTML = `<div class="iconPreview">${icon.svg}</div>`

        // click handler for deletion
        wrapper.addEventListener("click", async () => {
          if (!confirm("Delete this icon?")) return
          try {
            const delRes = await fetch(`/icons/${icon.id}`, {
              method: "DELETE",
            })
            if (!delRes.ok) throw new Error(`HTTP ${delRes.status}`)
            await loadIcons()
          } catch (err) {
            console.error("Failed to delete icon:", err)
            const li = document.createElement("li")
            li.textContent = "Failed to delete icon"
            li.classList.add("error")
            errorContainer.appendChild(li)
          }
        })

        iconList.appendChild(wrapper)
      })
    } catch (err) {
      iconList.innerHTML = "<p>Failed to load icons.</p>"
      console.error(err)
    }
  }

  // error stuff

  addBtn.addEventListener("click", async () => {
    const svg = newIconInput.value.trim()
    errorContainer.innerHTML = "" // clear previous errors

    try {
      const res = await fetch("/icons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ svg }),
      })

      if (res.status === 400) {
        const data = await res.json()
        data.errors.forEach((err) => {
          const li = document.createElement("li")
          li.classList.add("error")
          li.textContent = err.msg
          errorContainer.appendChild(li)
        })
        return
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      newIconInput.value = ""
      await loadIcons()
    } catch (err) {
      console.error(err)
      const li = document.createElement("li")
      li.textContent = "Failed to add icon"
      errorContainer.appendChild(li)
    }
  })
})
