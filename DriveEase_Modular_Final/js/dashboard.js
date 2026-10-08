/* Dashboard rendering and actions */

function renderDashboard() {
    const totalVehicles = db.vehicles.length;

    const available = db.vehicles.filter(
        item => item.status === "Available"
    ).length;

    const active = db.reservations.filter(
        item => item.status === "Active"
    ).length;

    const returnedRevenue = db.reservations
        .filter(item => item.status === "Returned")
        .reduce(
            (total, item) =>
                total +
                item.amount +
                (item.lateFee || 0) +
                (item.damageFee || 0),
            0
        );

    const stats = [
        {
            icon: "🚗",
            label: "Total Vehicles",
            value: totalVehicles,
            note: "Fleet size"
        },
        {
            icon: "✓",
            label: "Available",
            value: available,
            note: "Ready to rent"
        },
        {
            icon: "↗",
            label: "Active Rentals",
            value: active,
            note: "Currently on rent"
        },
        {
            icon: "👥",
            label: "Customers",
            value: db.customers.length,
            note: "Registered customers"
        },
        {
            icon: "₹",
            label: "Revenue",
            value: money(returnedRevenue),
            note: "Completed rentals"
        }
    ];

    document.getElementById("dashboard-stats").innerHTML = stats
        .map(stat => `
            <article class="stat-card">

                <div class="stat-icon">
                    ${stat.icon}
                </div>

                <span class="stat-label">
                    ${stat.label}
                </span>

                <strong class="stat-value">
                    ${stat.value}
                </strong>

                <small class="stat-note">
                    ${stat.note}
                </small>

            </article>
        `)
        .join("");

    renderRevenueChart();
    renderAvailability();
    renderPendingApprovals();
    renderRecentReservations();
}


/* Revenue chart */

function renderRevenueChart() {
    const range = Number(document.getElementById("revenue-range").value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Array.from({ length: range }, (_, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() - range + index + 1);
        return date;
    });
    const getDateKey = date => [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0")
    ].join("-");
    const revenueByDate = new Map();

    db.reservations
        .filter(item => item.status === "Returned")
        .forEach(item => {
            const revenue = item.amount + (item.lateFee || 0) + (item.damageFee || 0);
            revenueByDate.set(item.returnDate, (revenueByDate.get(item.returnDate) || 0) + revenue);
        });

    const values = days.map(date => {
        return revenueByDate.get(getDateKey(date)) || 0;
    });
    const max = Math.max(...values, 1);
    const container = document.getElementById("revenue-chart");
    const total = values.reduce((sum, value) => sum + value, 0);
    const summary = document.getElementById("revenue-summary");
    summary.textContent = `Completed rental revenue · ${money(total)} in the last ${range} days`;
    container.style.setProperty("--bar-count", range);

    container.innerHTML = values
        .map((value, index) => {
            const date = days[index];
            const dateKey = getDateKey(date);
            const dateLabel = formatDate(dateKey);
            const label = range === 7
                ? date.toLocaleDateString("en-IN", { weekday: "short" })
                : index % 5 === 0 || index === range - 1
                    ? date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
                    : "";
            const height = value ? Math.max((value / max) * 100, 2) : 0;

            return `
                <div
                    class="revenue-bar"
                    style="--bar-height: ${height}%"
                    title="${dateLabel}: ${money(value)}"
                    aria-label="${dateLabel}: ${money(value)}">

                    ${range === 7 ? `<strong>${money(value)}</strong>` : ""}

                    <span>
                        ${label}
                    </span>

                </div>
            `;
        })
        .join("");
}


/* Fleet availability */

function renderAvailability() {
    const total = db.vehicles.length || 1;

    const statuses = [
        "Available",
        "Rented",
        "Maintenance"
    ];

    const container = document.getElementById(
        "fleet-availability"
    );

    container.innerHTML = statuses
        .map(status => {

            const count = db.vehicles.filter(
                item => item.status === status
            ).length;

            const percentage = (count / total) * 100;

            return `
                <div class="availability-item">

                    <div class="availability-label">

                        <span>
                            ${status}
                        </span>

                        <strong>
                            ${count}
                        </strong>

                    </div>

                    <div class="availability-track">

                        <div
                            class="availability-fill ${status.toLowerCase()}"
                            style="width: ${percentage}%">
                        </div>

                    </div>

                </div>
            `;
        })
        .join("");
}


/* Pending approvals */

function renderPendingApprovals() {
    const pending = db.reservations.filter(
        item => item.status === "Pending"
    );

    const container = document.getElementById(
        "pending-approvals"
    );

    if (!pending.length) {

        container.innerHTML = `
            <div class="empty-state">
                No reservations waiting for approval.
            </div>
        `;

        return;
    }

    container.innerHTML = pending
        .map(item => {

            const customerData = customer(
                item.customerId
            );

            const vehicleData = vehicle(
                item.vehicleId
            );

            return `
                <div class="pending-item">

                    <div>

                        <strong>
                            ${item.id} · ${customerData.name}
                        </strong>

                        <span>
                            ${vehicleData.name}
                            ·
                            ${formatDate(item.pickup)}
                        </span>

                    </div>

                    <div class="pending-actions">

                        <button
                            class="approve"
                            data-approve="${item.id}">
                            Approve
                        </button>

                        <button
                            class="reject"
                            data-reject="${item.id}">
                            Reject
                        </button>

                    </div>

                </div>
            `;
        })
        .join("");

    container
        .querySelectorAll("[data-approve]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => approveReservation(
                    button.dataset.approve
                )
            );

        });

    container
        .querySelectorAll("[data-reject]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => rejectReservation(
                    button.dataset.reject
                )
            );

        });
}


/* Recent reservations */

function renderRecentReservations() {
    const rows = db.reservations.slice(0, 5);

    const container = document.getElementById(
        "recent-reservations"
    );

    container.innerHTML = rows
        .map(item => {

            const customerData = customer(
                item.customerId
            );

            const vehicleData = vehicle(
                item.vehicleId
            );

            return `
                <tr>

                    <td>
                        <strong>
                            ${item.id}
                        </strong>
                    </td>

                    <td>
                        ${customerData.name}
                    </td>

                    <td>
                        ${vehicleData.name}
                    </td>

                    <td>
                        ${formatDate(item.pickup)}
                        →
                        ${formatDate(item.returnDate)}
                    </td>

                    <td>
                        <strong>
                            ${money(item.amount)}
                        </strong>
                    </td>

                    <td>
                        <span
                            class="status ${statusClass(item.status)}">
                            ${item.status}
                        </span>
                    </td>

                    <td>
                        <button
                            class="action-button"
                            data-receipt="${item.id}">
                            Receipt
                        </button>
                    </td>

                </tr>
            `;
        })
        .join("");

    container
        .querySelectorAll("[data-receipt]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => openReceipt(
                    button.dataset.receipt
                )
            );

        });
}


/* Dashboard actions */

document
    .querySelectorAll('[data-action="new-reservation"]')
    .forEach(button => {

        button.addEventListener(
            "click",
            openReservation
        );

    });

document
    .getElementById("revenue-range")
    .addEventListener("change", renderRevenueChart);

document
    .querySelectorAll('[data-action="new-vehicle"]')
    .forEach(button => {

        button.addEventListener(
            "click",
            () => openVehicle()
        );

    });

document
    .querySelectorAll('[data-action="new-customer"]')
    .forEach(button => {

        button.addEventListener(
            "click",
            () => openCustomer()
        );

    });


/* Re-render when application data changes */

window.addEventListener(
    "dataChanged",
    renderDashboard
);


/* Initial render */

renderDashboard();