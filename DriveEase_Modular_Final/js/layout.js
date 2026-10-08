/* Shared navigation and header. */
const navigation = [
  ["dashboard", "▦", "Dashboard", "dashboard.html"],
  ["fleet", "🚗", "Fleet", "fleet.html"],
  ["customers", "👥", "Customers", "customers.html"],
  ["reservations", "📅", "Reservations", "reservations.html"],
  ["returns", "↩", "Returns", "returns.html"],
  ["maintenance", "🔧", "Maintenance", "maintenance.html"],
  ["payments", "₹", "Payments", "payments.html"]
];

function renderLayout() {
  const currentPage = document.body.dataset.page;
  const header = document.getElementById("app-header");
  const sidebar = document.getElementById("app-sidebar");

  header.innerHTML = `
    <header class="topbar">
      <a class="brand" href="dashboard.html">
        <span class="brand-logo">D</span>
        <span><strong>DriveEase</strong><small>Rental Management</small></span>
      </a>
      <div class="top-right">
        <span id="today"></span>
        <span class="user-chip">VH <strong>Fleet Manager</strong></span>
        <button class="btn outline" type="button" data-reset-data>Reset Demo</button>
      </div>
    </header>
  `;

  sidebar.innerHTML = `
    <aside class="sidebar">
      <div class="company-block"><span>BUSINESS PORTAL</span><strong>Operations</strong></div>
      ${navigation.map(([id, icon, label, href]) => `
        <a class="nav-link ${currentPage === id ? "active" : ""}" href="${href}">
          <span>${icon}</span><span>${label}</span>
        </a>
      `).join("")}
      <div class="side-note"><strong>Business data</strong><small>Demo records are stored in your browser.</small></div>
    </aside>
  `;

  document.getElementById("today").textContent = new Date().toLocaleDateString("en-IN", {
    weekday: "short", day: "2-digit", month: "short", year: "numeric"
  });

  document.querySelectorAll("[data-reset-data]").forEach(button => {
    button.addEventListener("click", () => {
      if (confirm("Reset all demo data to the original sample records?")) resetData();
    });
  });
}

renderLayout();
