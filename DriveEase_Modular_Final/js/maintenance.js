/* Maintenance page rendering and actions */

function renderMaintenance() {

    const container = document.getElementById("maintenance-list");

    if (!container) {
        return;
    }

    if (!db.maintenance.length) {

        container.innerHTML = `
            <article class="panel empty-state">
                No maintenance records found.
            </article>
        `;

        return;
    }

    container.innerHTML = db.maintenance
        .map(item => {

            const selectedVehicle = vehicle(item.vehicleId);

            const cardClass =
                item.status === "Completed"
                    ? "completed"
                    : "in-progress";

            return `
                <article class="maintenance-card ${cardClass}">

                    <div class="maintenance-icon">
                        🔧
                    </div>

                    <h3>
                        ${selectedVehicle.name}
                    </h3>

                    <p>
                        ${item.reason}
                    </p>

                    <div class="maintenance-details">

                        <div class="maintenance-detail">

                            <span>
                                Start
                            </span>

                            <strong>
                                ${formatDate(item.start)}
                            </strong>

                        </div>

                        <div class="maintenance-detail">

                            <span>
                                Expected End
                            </span>

                            <strong>
                                ${formatDate(item.end)}
                            </strong>

                        </div>

                        <div class="maintenance-detail">

                            <span>
                                Estimated Cost
                            </span>

                            <strong>
                                ${money(item.cost)}
                            </strong>

                        </div>

                        <div class="maintenance-detail">

                            <span>
                                Status
                            </span>

                            <strong>
                                ${item.status}
                            </strong>

                        </div>

                    </div>

                    ${
                        item.status === "In Progress"
                            ? `
                                <button
                                    type="button"
                                    class="maintenance-button"
                                    data-complete="${item.id}">
                                    Mark Completed
                                </button>
                            `
                            : `
                                <span class="maintenance-status completed">
                                    Completed
                                </span>
                            `
                    }

                </article>
            `;
        })
        .join("");

    container
        .querySelectorAll("[data-complete]")
        .forEach(button => {

            button.addEventListener("click", () => {

                completeMaintenance(
                    button.dataset.complete
                );

            });

        });
}


/*
 * Schedule Service button
 */

const scheduleButton = document.querySelector(
    '[data-action="new-maintenance"]'
);

if (scheduleButton) {

    scheduleButton.addEventListener(
        "click",
        () => {

            if (typeof window.openMaintenance === "function") {

                window.openMaintenance();

            } else {

                console.error(
                    "openMaintenance() is not available."
                );

            }

        }
    );
}


/*
 * Refresh maintenance when data changes
 */

window.addEventListener(
    "dataChanged",
    renderMaintenance
);


renderMaintenance();