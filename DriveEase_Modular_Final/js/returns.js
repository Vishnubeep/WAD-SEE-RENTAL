/* Return desk rendering. */
function renderReturns() {
  const activeRentals = db.reservations.filter(item => item.status === "Active");
  const container = document.getElementById("return-list");

  if (!activeRentals.length) {
    container.innerHTML = `<article class="panel empty-state">No active rentals are waiting for return.</article>`;
    return;
  }

  container.innerHTML = activeRentals.map(item => `
    <article class="return-card">
      <div class="return-header"><div><h3>${customer(item.customerId).name}</h3><p>${vehicle(item.vehicleId).name} · ${item.id}</p></div><span class="status active">Active Rental</span></div>
      <div class="return-details">
        <div class="return-detail"><span>Pickup</span><strong>${formatDate(item.pickup)}</strong></div>
        <div class="return-detail"><span>Due Return</span><strong>${formatDate(item.returnDate)}</strong></div>
        <div class="return-detail"><span>Rental Amount</span><strong>${money(item.amount)}</strong></div>
      </div>
      <button class="return-button" data-return="${item.id}">Process Return</button>
    </article>
  `).join("");

  container.querySelectorAll("[data-return]").forEach(button => button.addEventListener("click", () => openReturn(button.dataset.return)));
}

window.addEventListener("dataChanged", renderReturns);
renderReturns();
