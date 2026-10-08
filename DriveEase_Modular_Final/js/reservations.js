/* Reservation page rendering and workflow. */
function renderReservations() {
  const search = document.getElementById("reservation-search").value.toLowerCase();
  const status = document.getElementById("reservation-status").value;
  const list = db.reservations.filter(item => {
    const c = customer(item.customerId);
    const v = vehicle(item.vehicleId);
    const matchesSearch = `${item.id} ${c.name} ${v.name}`.toLowerCase().includes(search);
    const matchesStatus = status === "All Status" || item.status === status;
    return matchesSearch && matchesStatus;
  });

  document.getElementById("reservation-table").innerHTML = list.map(item => {
    const actions = [];
    if (item.status === "Pending") actions.push(`<button class="action-button approve" data-approve="${item.id}">Approve</button>`);
    if (item.status === "Confirmed") actions.push(`<button class="action-button start" data-start="${item.id}">Start Rental</button>`);
    if (item.status === "Active") actions.push(`<button class="action-button" data-return="${item.id}">Return</button>`);
    if (item.payment === "Pending") actions.push(`<button class="action-button" data-pay="${item.id}">Mark Paid</button>`);
    actions.push(`<button class="action-button" data-receipt="${item.id}">Receipt</button>`);

    return `
      <tr>
        <td class="reservation-id">${item.id}</td>
        <td>${customer(item.customerId).name}</td>
        <td>${vehicle(item.vehicleId).name}</td>
        <td>${formatDate(item.pickup)}</td>
        <td>${formatDate(item.returnDate)}</td>
        <td><strong>${money(item.amount)}</strong></td>
        <td><span class="status ${item.payment === "Paid" ? "payment-paid" : "payment-pending"}">${item.payment}</span></td>
        <td><span class="status ${statusClass(item.status)}">${item.status}</span></td>
        <td><div class="reservation-actions">${actions.join("")}</div></td>
      </tr>
    `;
  }).join("");

  document.querySelectorAll("[data-approve]").forEach(button => button.addEventListener("click", () => approveReservation(button.dataset.approve)));
  document.querySelectorAll("[data-start]").forEach(button => button.addEventListener("click", () => startRental(button.dataset.start)));
  document.querySelectorAll("[data-return]").forEach(button => button.addEventListener("click", () => openReturn(button.dataset.return)));
  document.querySelectorAll("[data-pay]").forEach(button => button.addEventListener("click", () => markPaymentPaid(button.dataset.pay)));
  document.querySelectorAll("[data-receipt]").forEach(button => button.addEventListener("click", () => openReceipt(button.dataset.receipt)));
}

document.getElementById("reservation-search").addEventListener("input", renderReservations);
document.getElementById("reservation-status").addEventListener("change", renderReservations);
window.addEventListener("dataChanged", renderReservations);
renderReservations();
