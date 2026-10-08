/* Dashboard rendering and actions. */
function renderDashboard() {
  const totalVehicles = db.vehicles.length;
  const available = db.vehicles.filter(item => item.status === "Available").length;
  const active = db.reservations.filter(item => item.status === "Active").length;
  const returnedRevenue = db.reservations.filter(item => item.status === "Returned")
    .reduce((total, item) => total + item.amount + (item.lateFee || 0) + (item.damageFee || 0), 0);

  document.getElementById("dashboard-stats").innerHTML = [
    ["🚗", "Total Vehicles", totalVehicles, "Fleet size"],
    ["✓", "Available", available, "Ready to rent"],
    ["↗", "Active Rentals", active, "Currently on rent"],
    ["👥", "Customers", db.customers.length, "Registered customers"],
    ["₹", "Revenue", money(returnedRevenue), "Completed rentals"]
  ].map(item => `
    <article class="stat-card"><div class="stat-icon">${item[0]}</div><span class="stat-label">${item[1]}</span><strong class="stat-value">${item[2]}</strong><small class="stat-note">${item[3]}</small></article>
  `).join("");

  renderRevenueChart();
  renderAvailability();
  renderPendingApprovals();
  renderRecentReservations();
}

function renderRevenueChart() {
  const values = [4200, 3600, 5400, 4100, 6900, 5100, 7600];
  const max = Math.max(...values);
  const days = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"];

  document.getElementById("revenue-chart").innerHTML = values.map((value, index) => `
    <div class="revenue-bar" style="height:${(value / max) * 90}%" title="${money(value)}">
      <span>${days[index]}</span>
    </div>
  `).join("");
}

function renderAvailability() {
  const total = db.vehicles.length || 1;
  const statuses = ["Available", "Rented", "Maintenance"];
  const container = document.getElementById("fleet-availability");

  container.innerHTML = statuses.map(status => {
    const count = db.vehicles.filter(item => item.status === status).length;
    const percentage = (count / total) * 100;
    return `
      <div class="availability-item">
        <div class="availability-label"><span>${status}</span><strong>${count}</strong></div>
        <div class="availability-track"><div class="availability-fill ${status.toLowerCase()}" style="width:${percentage}%"></div></div>
      </div>
    `;
  }).join("");
}

function renderPendingApprovals() {
  const pending = db.reservations.filter(item => item.status === "Pending");
  const container = document.getElementById("pending-approvals");

  if (!pending.length) {
    container.innerHTML = `<div class="empty-state">No reservations waiting for approval.</div>`;
    return;
  }

  container.innerHTML = pending.map(item => `
    <div class="pending-item">
      <div><strong>${item.id} · ${customer(item.customerId).name}</strong><span>${vehicle(item.vehicleId).name} · ${formatDate(item.pickup)}</span></div>
      <div class="pending-actions"><button class="approve" data-approve="${item.id}">Approve</button><button class="reject" data-reject="${item.id}">Reject</button></div>
    </div>
  `).join("");

  container.querySelectorAll("[data-approve]").forEach(button => button.addEventListener("click", () => approveReservation(button.dataset.approve)));
  container.querySelectorAll("[data-reject]").forEach(button => button.addEventListener("click", () => rejectReservation(button.dataset.reject)));
}

function renderRecentReservations() {
  const rows = db.reservations.slice(0, 5);
  document.getElementById("recent-reservations").innerHTML = rows.map(item => `
    <tr>
      <td><strong>${item.id}</strong></td>
      <td>${customer(item.customerId).name}</td>
      <td>${vehicle(item.vehicleId).name}</td>
      <td>${formatDate(item.pickup)} → ${formatDate(item.returnDate)}</td>
      <td><strong>${money(item.amount)}</strong></td>
      <td><span class="status ${statusClass(item.status)}">${item.status}</span></td>
      <td><button class="action-button" data-receipt="${item.id}">Receipt</button></td>
    </tr>
  `).join("");

  document.querySelectorAll("[data-receipt]").forEach(button => button.addEventListener("click", () => openReceipt(button.dataset.receipt)));
}

document.querySelectorAll('[data-action="new-reservation"]').forEach(button => button.addEventListener("click", openReservation));
document.querySelectorAll('[data-action="new-vehicle"]').forEach(button => button.addEventListener("click", () => openVehicle()));
document.querySelectorAll('[data-action="new-customer"]').forEach(button => button.addEventListener("click", openCustomer));
window.addEventListener("dataChanged", renderDashboard);
renderDashboard();
