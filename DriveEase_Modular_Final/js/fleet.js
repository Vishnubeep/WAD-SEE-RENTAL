/* Fleet page rendering and filters. */
function renderFleet() {
  const search = document.getElementById("fleet-search").value.toLowerCase();
  const status = document.getElementById("fleet-status").value;
  const list = db.vehicles.filter(item => {
    const matchesSearch = `${item.name} ${item.plate} ${item.type}`.toLowerCase().includes(search);
    const matchesStatus = status === "All Status" || item.status === status;
    return matchesSearch && matchesStatus;
  });

  const container = document.getElementById("fleet-list");
  container.innerHTML = list.length ? list.map(item => `
    <article class="vehicle-card">
      <div class="vehicle-image">${item.emoji}</div>
      <div class="vehicle-body">
        <div class="vehicle-title"><div><h3>${item.name}</h3><div class="vehicle-plate">${item.plate}</div></div><strong class="vehicle-price">${money(item.price)}/day</strong></div>
        <div class="vehicle-specs">
          <div class="vehicle-spec">Type<strong>${item.type}</strong></div>
          <div class="vehicle-spec">Fuel<strong>${item.fuel}</strong></div>
          <div class="vehicle-spec">Transmission<strong>${item.transmission}</strong></div>
          <div class="vehicle-spec">Seats<strong>${item.seats}</strong></div>
        </div>
        <span class="status ${statusClass(item.status)}">${item.status}</span>
        <div class="vehicle-actions">
          <button class="action-button" data-edit="${item.id}">Edit</button>
          <button class="action-button" data-service="${item.id}">Service</button>
        </div>
      </div>
    </article>
  `).join("") : `<article class="panel empty-state">No vehicles match your search.</article>`;

  container.querySelectorAll("[data-edit]").forEach(button => button.addEventListener("click", () => openVehicle(button.dataset.edit)));
  container.querySelectorAll("[data-service]").forEach(button => button.addEventListener("click", () => openMaintenance(button.dataset.service)));
}

document.getElementById("fleet-search").addEventListener("input", renderFleet);
document.getElementById("fleet-status").addEventListener("change", renderFleet);
window.addEventListener("dataChanged", renderFleet);
renderFleet();
