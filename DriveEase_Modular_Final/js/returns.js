/* Return desk rendering and actions */

function renderReturns() {

    const activeRentals = db.reservations.filter(
        item => item.status === "Active"
    );

    const container = document.getElementById("return-list");

    if (!container) {
        return;
    }

    if (!activeRentals.length) {

        container.innerHTML = `
            <article class="panel empty-state">
                No active rentals are waiting for return.
            </article>
        `;

        return;
    }

    container.innerHTML = activeRentals
        .map(item => {

            const selectedCustomer = customer(
                item.customerId
            );

            const selectedVehicle = vehicle(
                item.vehicleId
            );

            return `
                <article class="return-card">

                    <div class="return-header">

                        <div>

                            <h3>
                                ${selectedCustomer.name}
                            </h3>

                            <p>
                                ${selectedVehicle.name}
                                ·
                                ${item.id}
                            </p>

                        </div>

                        <span class="status active">
                            Active Rental
                        </span>

                    </div>

                    <div class="return-details">

                        <div class="return-detail">

                            <span>
                                Pickup
                            </span>

                            <strong>
                                ${formatDate(item.pickup)}
                            </strong>

                        </div>

                        <div class="return-detail">

                            <span>
                                Due Return
                            </span>

                            <strong>
                                ${formatDate(item.returnDate)}
                            </strong>

                        </div>

                        <div class="return-detail">

                            <span>
                                Rental Amount
                            </span>

                            <strong>
                                ${money(item.amount)}
                            </strong>

                        </div>

                    </div>

                    <button
                        type="button"
                        class="return-button"
                        data-return="${item.id}">

                        Process Return

                    </button>

                </article>
            `;
        })
        .join("");


    /*
     * Process Return buttons
     */

    container
        .querySelectorAll("[data-return]")
        .forEach(button => {

            button.addEventListener("click", () => {

                const reservationId =
                    button.dataset.return;

                console.log(
                    "Process Return clicked:",
                    reservationId
                );

                if (typeof window.openReturn === "function") {

                    window.openReturn(
                        reservationId
                    );

                } else {

                    console.error(
                        "window.openReturn is not available."
                    );

                    alert(
                        "Return form could not be opened."
                    );

                }

            });

        });
}


window.addEventListener(
    "dataChanged",
    renderReturns
);


renderReturns();