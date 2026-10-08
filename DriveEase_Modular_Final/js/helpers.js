/* Shared helper functions. */
function vehicle(id) { return db.vehicles.find(item => item.id === id); }
function customer(id) { return db.customers.find(item => item.id === id); }
function reservation(id) { return db.reservations.find(item => item.id === id); }

function money(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function todayInputDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function statusClass(value) {
  return String(value).toLowerCase().replaceAll(" ", "-");
}

function showToast(message) {
  const root = document.getElementById("toast-root");
  if (!root) return;

  root.innerHTML = `<div class="toast">${message}</div>`;
  setTimeout(() => { root.innerHTML = ""; }, 2400);
}

function closeModal() {
  const root = document.getElementById("modal-root");
  if (root) root.innerHTML = "";
}

function openModal(content) {
  const root = document.getElementById("modal-root");
  root.innerHTML = `
    <div class="modal-backdrop" data-close-modal>
      <div class="modal" role="dialog" aria-modal="true">
        <button class="modal-close" type="button" data-close-modal>×</button>
        ${content}
      </div>
    </div>
  `;

  root.querySelector(".modal-backdrop").addEventListener("click", event => {
    if (event.target.matches("[data-close-modal]")) closeModal();
  });
}
