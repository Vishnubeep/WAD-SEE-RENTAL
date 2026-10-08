/* Payments page rendering. */
function renderPayments() {
  const paid = db.reservations.filter(item => item.payment === "Paid");
  const pending = db.reservations.filter(item => item.payment === "Pending");
  const collected = paid.reduce((sum, item) => sum + item.amount, 0);
  const outstanding = pending.reduce((sum, item) => sum + item.amount, 0);

  document.getElementById("payment-stats").innerHTML = [
    ["💳", "Collected", money(collected), "Paid rental amounts"],
    ["⏳", "Outstanding", money(outstanding), "Pending payments"],
    ["📄", "Transactions", db.reservations.length, "Reservation payments"]
  ].map(item => `<article class="stat-card"><div class="stat-icon">${item[0]}</div><span class="stat-label">${item[1]}</span><strong class="stat-value">${item[2]}</strong><small class="stat-note">${item[3]}</small></article>`).join("");

  document.getElementById("payment-table").innerHTML = db.reservations.map(item => `
    <tr>
      <td class="payment-id">PAY-${item.id.replace("RES-", "")}</td>
      <td>${item.id}</td>
      <td>${customer(item.customerId).name}</td>
      <td>${item.method}</td>
      <td class="payment-amount">${money(item.amount)}</td>
      <td>${formatDate(item.bookedOn || item.pickup)}</td>
      <td><span class="status ${item.payment === "Paid" ? "payment-paid" : "payment-pending"}">${item.payment}</span></td>
      <td>${item.payment === "Pending" ? `<button class="action-button" data-pay="${item.id}">Mark Paid</button>` : `<button class="action-button" data-receipt="${item.id}">Receipt</button>`}</td>
    </tr>
  `).join("");

  document.querySelectorAll("[data-pay]").forEach(button => button.addEventListener("click", () => markPaymentPaid(button.dataset.pay)));
  document.querySelectorAll("[data-receipt]").forEach(button => button.addEventListener("click", () => openReceipt(button.dataset.receipt)));
}

window.addEventListener("dataChanged", renderPayments);
renderPayments();
