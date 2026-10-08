/* Maintenance page rendering. */
function renderMaintenance() {
  const container = document.getElementById("maintenance-list");

  container.innerHTML = db.maintenance.length ? db.maintenance.map(item => {
    const selectedVehicle = vehicle(item.vehicleId);
    return `
      <article class="maintenance-card ${item.status === "Completed" ? "completed" : "in-progress"}">
        <div class="maintenance-icon">🔧</div>
        <h3>${selectedVehicle.name}</h3>
        <p>${item.reason}</p>
        <div class="maintenance-meta">
          <div><span>Start</span><strong>${formatDate(item.start)}</strong></div>
          <div><span>Expected End</span><strong>${formatDate(item.end)}</strong></div>
          <div><span>Estimated Cost</span><strong>${money(item.cost)}</strong></div>
          <div><span>Status</span><strong>${item.status}</strong></div>
        </div>
        ${item.status === "In Progress" ? `<button class="maintenance-button" data-complete="${item.id}">Mark Completed</button>` : `<span class="status returned">Completed</span>`}
      </article>
    `;
  }).join("") : `<article class="panel empty-state">No maintenance records found.</article>`;

  container.querySelectorAll("[data-complete]").forEach(button => button.addEventListener("click", () => completeMaintenance(button.dataset.complete)));
}

window.addEventListener("dataChanged", renderMaintenance);
renderMaintenance();
