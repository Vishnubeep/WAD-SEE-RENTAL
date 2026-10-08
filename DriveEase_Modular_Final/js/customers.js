/* Customer page rendering and search. */
function renderCustomers() {
  const search = document.getElementById("customer-search").value.toLowerCase();
  const list = db.customers.filter(item => `${item.name} ${item.phone} ${item.email} ${item.licence}`.toLowerCase().includes(search));

  document.getElementById("customer-table").innerHTML = list.map(item => {
    const history = db.reservations.filter(record => record.customerId === item.id);
    const spent = history.filter(record => record.status === "Returned").reduce((sum, record) => sum + record.amount, 0);
    const active = history.some(record => record.status === "Active");

    return `
      <tr>
        <td><span class="customer-name">${item.name}</span></td>
        <td class="customer-contact"><span>${item.phone}</span><span>${item.email}</span></td>
        <td>${item.licence}</td>
        <td>${history.length}</td>
        <td class="customer-total">${money(spent)}</td>
        <td><span class="status ${active ? "active" : "returned"}">${active ? "Active" : "No active rental"}</span></td>
        <td><button class="action-button" data-profile="${item.id}">View Profile</button></td>
      </tr>
    `;
  }).join("");
}

document.querySelectorAll('[data-action="new-customer"]').forEach(button => {
  button.addEventListener("click", openCustomer);
});

document.getElementById("customer-table").addEventListener("click", event => {
  const profileButton = event.target.closest("[data-profile]");
  if (profileButton) openCustomerProfile(profileButton.dataset.profile);
});

document.getElementById("customer-search").addEventListener("input", renderCustomers);
window.addEventListener("dataChanged", renderCustomers);
renderCustomers();
