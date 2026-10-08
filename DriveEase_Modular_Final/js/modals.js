/* Shared modal forms and business actions */


/* =========================================================
   MODAL SYSTEM
   ========================================================= */

function openModal(content) {

    const modalRoot = document.getElementById("modal-root");

    if (!modalRoot) {
        console.error("modal-root was not found.");
        return;
    }

    modalRoot.innerHTML = `
        <div class="modal-backdrop" id="modal-backdrop">

            <div class="modal">

                <button
                    type="button"
                    class="modal-close"
                    data-close-modal>
                    ×
                </button>

                ${content}

            </div>

        </div>
    `;

    const closeButton = modalRoot.querySelector(
        "[data-close-modal]"
    );

    if (closeButton) {
        closeButton.addEventListener(
            "click",
            closeModal
        );
    }

    const backdrop = document.getElementById(
        "modal-backdrop"
    );

    if (backdrop) {

        backdrop.addEventListener(
            "click",
            event => {

                if (event.target === backdrop) {
                    closeModal();
                }

            }
        );

    }
}


function closeModal() {

    const modalRoot = document.getElementById(
        "modal-root"
    );

    if (modalRoot) {
        modalRoot.innerHTML = "";
    }
}


/* =========================================================
   VEHICLE
   ========================================================= */

function openVehicle(existingId = null) {

    const existing = existingId
        ? vehicle(existingId)
        : null;

    openModal(`
        <h2>
            ${existing ? "Edit Vehicle" : "Add Vehicle"}
        </h2>

        <p>
            Keep the company's fleet records up to date.
        </p>

        <form id="vehicle-form">

            <div class="form-grid">

                <div class="form-field">

                    <label>
                        Vehicle name
                    </label>

                    <input
                        name="name"
                        required
                        value="${existing?.name || ""}"
                        placeholder="Toyota Innova Crysta">

                </div>

                <div class="form-field">

                    <label>
                        Registration number
                    </label>

                    <input
                        name="plate"
                        required
                        value="${existing?.plate || ""}"
                        placeholder="KA 01 AB 1234">

                </div>

                <div class="form-field">

                    <label>
                        Vehicle type
                    </label>

                    <select name="type">

                        <option>SUV</option>
                        <option>Sedan</option>
                        <option>Hatchback</option>
                        <option>MPV</option>
                        <option>Luxury</option>

                    </select>

                </div>

                <div class="form-field">

                    <label>
                        Price per day
                    </label>

                    <input
                        name="price"
                        type="number"
                        min="0"
                        required
                        value="${existing?.price || ""}">

                </div>

                <div class="form-field">

                    <label>
                        Fuel
                    </label>

                    <select name="fuel">

                        <option>Petrol</option>
                        <option>Diesel</option>
                        <option>Electric</option>

                    </select>

                </div>

                <div class="form-field">

                    <label>
                        Transmission
                    </label>

                    <select name="transmission">

                        <option>Automatic</option>
                        <option>Manual</option>

                    </select>

                </div>

                <div class="form-field">

                    <label>
                        Seats
                    </label>

                    <input
                        name="seats"
                        type="number"
                        min="2"
                        value="${existing?.seats || 5}">

                </div>

                <div class="form-field">

                    <label>
                        Status
                    </label>

                    <select name="status">

                        <option>Available</option>
                        <option>Rented</option>
                        <option>Maintenance</option>

                    </select>

                </div>

            </div>

            <div class="form-actions">

                <button
                    type="button"
                    class="btn outline"
                    data-close-modal>
                    Cancel
                </button>

                <button
                    type="submit"
                    class="btn primary">
                    Save Vehicle
                </button>

            </div>

        </form>
    `);

    const form = document.getElementById(
        "vehicle-form"
    );

    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const values = Object.fromEntries(
                new FormData(event.currentTarget)
            );

            values.price = Number(values.price);
            values.seats = Number(values.seats);

            if (existing) {

                Object.assign(
                    existing,
                    values
                );

            } else {

                db.vehicles.push({
                    ...values,
                    id: `V${String(Date.now()).slice(-4)}`,
                    emoji: "🚗"
                });

            }

            saveData();

            closeModal();

            window.dispatchEvent(
                new CustomEvent("dataChanged")
            );

            showToast(
                existing
                    ? "Vehicle updated"
                    : "Vehicle added"
            );

        }
    );
}


/* =========================================================
   CUSTOMER
   ========================================================= */

function openCustomer() {

    openModal(`
        <h2>
            Add Customer
        </h2>

        <p>
            Register a customer for company rentals.
        </p>

        <form id="customer-form">

            <div class="form-grid">

                <div class="form-field">

                    <label>
                        Full name
                    </label>

                    <input
                        name="name"
                        required>

                </div>

                <div class="form-field">

                    <label>
                        Phone
                    </label>

                    <input
                        name="phone"
                        required>

                </div>

                <div class="form-field">

                    <label>
                        Email
                    </label>

                    <input
                        name="email"
                        type="email"
                        required>

                </div>

                <div class="form-field">

                    <label>
                        Driving licence
                    </label>

                    <input
                        name="licence"
                        required>

                </div>

            </div>

            <div class="form-actions">

                <button
                    type="button"
                    class="btn outline"
                    data-close-modal>
                    Cancel
                </button>

                <button
                    type="submit"
                    class="btn primary">
                    Add Customer
                </button>

            </div>

        </form>
    `);

    document
        .getElementById("customer-form")
        .addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const form = new FormData(
                    event.currentTarget
                );

                db.customers.push({
                    id: `C${String(Date.now()).slice(-4)}`,
                    name: form.get("name"),
                    phone: form.get("phone"),
                    email: form.get("email"),
                    licence: form.get("licence")
                });

                saveData();

                closeModal();

                window.dispatchEvent(
                    new CustomEvent("dataChanged")
                );

                showToast(
                    "Customer registered"
                );

            }
        );
}


/* =========================================================
   RESERVATION
   ========================================================= */

function openReservation() {

    const availableVehicles =
        db.vehicles.filter(
            item => item.status === "Available"
        );

    if (!availableVehicles.length) {

        showToast(
            "There are no available vehicles right now."
        );

        return;
    }

    openModal(`
        <h2>
            New Reservation
        </h2>

        <p>
            Create a rental booking for a customer.
        </p>

        <form id="reservation-form">

            <div class="form-grid">

                <div class="form-field">

                    <label>
                        Customer
                    </label>

                    <select name="customer">

                        ${db.customers
                            .map(
                                item => `
                                    <option value="${item.id}">
                                        ${item.name}
                                    </option>
                                `
                            )
                            .join("")}

                    </select>

                </div>

                <div class="form-field">

                    <label>
                        Vehicle
                    </label>

                    <select name="vehicle">

                        ${availableVehicles
                            .map(
                                item => `
                                    <option value="${item.id}">
                                        ${item.name} · ${item.plate}
                                    </option>
                                `
                            )
                            .join("")}

                    </select>

                </div>

                <div class="form-field">

                    <label>
                        Pickup date
                    </label>

                    <input
                        name="pickup"
                        type="date"
                        required
                        value="${todayInputDate()}">

                </div>

                <div class="form-field">

                    <label>
                        Return date
                    </label>

                    <input
                        name="returnDate"
                        type="date"
                        required>

                </div>

                <div class="form-field">

                    <label>
                        Payment status
                    </label>

                    <select name="payment">

                        <option>Pending</option>
                        <option>Paid</option>

                    </select>

                </div>

                <div class="form-field">

                    <label>
                        Payment method
                    </label>

                    <select name="method">

                        <option>UPI</option>
                        <option>Card</option>
                        <option>Cash</option>
                        <option>Net Banking</option>

                    </select>

                </div>

            </div>

            <div class="form-actions">

                <button
                    type="button"
                    class="btn outline"
                    data-close-modal>
                    Cancel
                </button>

                <button
                    type="submit"
                    class="btn primary">
                    Create Reservation
                </button>

            </div>

        </form>
    `);

    document
        .getElementById("reservation-form")
        .addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const form = new FormData(
                    event.currentTarget
                );

                const start = new Date(
                    `${form.get("pickup")}T00:00:00`
                );

                const end = new Date(
                    `${form.get("returnDate")}T00:00:00`
                );

                const selectedVehicle =
                    vehicle(
                        form.get("vehicle")
                    );

                const days = Math.max(
                    1,
                    Math.ceil(
                        (end - start) / 86400000
                    )
                );

                if (end <= start) {

                    showToast(
                        "Return date must be after pickup date."
                    );

                    return;
                }

                db.reservations.unshift({

                    id: `RES-${String(Date.now()).slice(-4)}`,

                    bookedOn:
                        todayInputDate(),

                    customerId:
                        form.get("customer"),

                    vehicleId:
                        form.get("vehicle"),

                    pickup:
                        form.get("pickup"),

                    returnDate:
                        form.get("returnDate"),

                    amount:
                        days * selectedVehicle.price,

                    payment:
                        form.get("payment"),

                    method:
                        form.get("method"),

                    status: "Pending",

                    lateFee: 0,

                    damageFee: 0

                });

                saveData();

                closeModal();

                window.dispatchEvent(
                    new CustomEvent("dataChanged")
                );

                showToast(
                    "Reservation created and sent for approval"
                );

            }
        );
}


/* =========================================================
   MAINTENANCE
   ========================================================= */

function openMaintenance(vehicleId = null) {

    const vehicles = db.vehicles.filter(
        item => item.status !== "Rented"
    );

    if (!vehicles.length) {

        showToast(
            "There are no vehicles available for maintenance."
        );

        return;
    }

    openModal(`
        <h2>
            Schedule Maintenance
        </h2>

        <p>
            Take a vehicle out of service and record the work.
        </p>

        <form id="maintenance-form">

            <div class="form-grid">

                <div class="form-field">

                    <label>
                        Vehicle
                    </label>

                    <select name="vehicle">

                        ${vehicles
                            .map(
                                item => `
                                    <option
                                        value="${item.id}"
                                        ${item.id === vehicleId
                                            ? "selected"
                                            : ""}>

                                        ${item.name} · ${item.plate}

                                    </option>
                                `
                            )
                            .join("")}

                    </select>

                </div>

                <div class="form-field">

                    <label>
                        Estimated cost
                    </label>

                    <input
                        name="cost"
                        type="number"
                        min="0"
                        required
                        value="2500">

                </div>

                <div class="form-field">

                    <label>
                        Start date
                    </label>

                    <input
                        name="start"
                        type="date"
                        required
                        value="${todayInputDate()}">

                </div>

                <div class="form-field">

                    <label>
                        Expected completion
                    </label>

                    <input
                        name="end"
                        type="date"
                        required>

                </div>

                <div class="form-field full">

                    <label>
                        Reason
                    </label>

                    <textarea
                        name="reason"
                        required
                        placeholder="Oil service, brake inspection..."></textarea>

                </div>

            </div>

            <div class="form-actions">

                <button
                    type="button"
                    class="btn outline"
                    data-close-modal>
                    Cancel
                </button>

                <button
                    type="submit"
                    class="btn primary">
                    Schedule Service
                </button>

            </div>

        </form>
    `);

    document
        .getElementById("maintenance-form")
        .addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const form = new FormData(
                    event.currentTarget
                );

                const selectedVehicle =
                    vehicle(
                        form.get("vehicle")
                    );

                if (!selectedVehicle) {

                    showToast(
                        "Please select a valid vehicle."
                    );

                    return;
                }

                const start = form.get("start");
                const end = form.get("end");

                if (end < start) {

                    showToast(
                        "Expected completion cannot be before the start date."
                    );

                    return;
                }

                db.maintenance.push({

                    id:
                        `M${String(Date.now()).slice(-5)}`,

                    vehicleId:
                        selectedVehicle.id,

                    reason:
                        form.get("reason"),

                    start:
                        start,

                    end:
                        end,

                    cost:
                        Number(form.get("cost")),

                    status:
                        "In Progress"

                });

                selectedVehicle.status =
                    "Maintenance";

                saveData();

                closeModal();

                window.dispatchEvent(
                    new CustomEvent("dataChanged")
                );

                showToast(
                    "Maintenance scheduled"
                );

            }
        );
}


/* =========================================================
   RETURN
   ========================================================= */

function openReturn(reservationId) {

    const record =
        reservation(reservationId);

    if (!record) {

        showToast(
            "Reservation could not be found."
        );

        return;
    }

    if (record.status !== "Active") {

        showToast(
            "This reservation is not currently active."
        );

        return;
    }

    openModal(`
        <h2>
            Process Return
        </h2>

        <p>
            Close the rental and calculate any additional charges.
        </p>

        <form id="return-form">

            <div class="form-grid">

                <div class="form-field">

                    <label>
                        Actual return date
                    </label>

                    <input
                        name="actual"
                        type="date"
                        required
                        value="${todayInputDate()}">

                </div>

                <div class="form-field">

                    <label>
                        Vehicle condition
                    </label>

                    <select name="condition">

                        <option>
                            Good
                        </option>

                        <option>
                            Minor Damage
                        </option>

                        <option>
                            Major Damage
                        </option>

                    </select>

                </div>

                <div class="form-field">

                    <label>
                        Late fee
                    </label>

                    <input
                        name="lateFee"
                        type="number"
                        min="0"
                        value="0">

                </div>

                <div class="form-field">

                    <label>
                        Damage fee
                    </label>

                    <input
                        name="damageFee"
                        type="number"
                        min="0"
                        value="0">

                </div>

                <div class="form-field full">

                    <label>
                        Return notes
                    </label>

                    <textarea
                        name="notes"
                        placeholder="Optional notes..."></textarea>

                </div>

            </div>

            <div class="form-actions">

                <button
                    type="button"
                    class="btn outline"
                    data-close-modal>
                    Cancel
                </button>

                <button
                    type="submit"
                    class="btn primary">
                    Complete Return
                </button>

            </div>

        </form>
    `);

    document
        .getElementById("return-form")
        .addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const form = new FormData(
                    event.currentTarget
                );

                const selectedVehicle =
                    vehicle(record.vehicleId);

                if (!selectedVehicle) {

                    showToast(
                        "Vehicle could not be found."
                    );

                    return;
                }

                record.status =
                    "Returned";

                record.returnedOn =
                    form.get("actual");

                record.condition =
                    form.get("condition");

                record.lateFee =
                    Number(form.get("lateFee")) || 0;

                record.damageFee =
                    Number(form.get("damageFee")) || 0;

                record.notes =
                    form.get("notes");

                selectedVehicle.status =
                    "Available";

                saveData();

                closeModal();

                window.dispatchEvent(
                    new CustomEvent("dataChanged")
                );

                showToast(
                    "Return completed and vehicle is available"
                );

            }
        );
}


/* =========================================================
   CUSTOMER PROFILE
   ========================================================= */

function openCustomerProfile(customerId) {

    const selectedCustomer =
        customer(customerId);

    if (!selectedCustomer) {

        showToast(
            "Customer could not be found."
        );

        return;
    }

    const history =
        db.reservations.filter(
            item =>
                item.customerId === customerId
        );

    const spent =
        history
            .filter(
                item =>
                    item.status === "Returned"
            )
            .reduce(
                (total, item) =>
                    total +
                    item.amount +
                    (item.lateFee || 0) +
                    (item.damageFee || 0),
                0
            );

    openModal(`
        <div class="profile-avatar">
            ${selectedCustomer.name.charAt(0)}
        </div>

        <h2>
            ${selectedCustomer.name}
        </h2>

        <p>
            ${selectedCustomer.phone}
            ·
            ${selectedCustomer.email}
        </p>

        <div class="detail-grid">

            <div class="detail-item">

                <span>
                    Driving Licence
                </span>

                <strong>
                    ${selectedCustomer.licence}
                </strong>

            </div>

            <div class="detail-item">

                <span>
                    Bookings
                </span>

                <strong>
                    ${history.length}
                </strong>

            </div>

            <div class="detail-item">

                <span>
                    Total Spent
                </span>

                <strong>
                    ${money(spent)}
                </strong>

            </div>

            <div class="detail-item">

                <span>
                    Active Rental
                </span>

                <strong>
                    ${
                        history.some(
                            item =>
                                item.status === "Active"
                        )
                            ? "Yes"
                            : "No"
                    }
                </strong>

            </div>

        </div>

        <h3>
            Reservation History
        </h3>

        ${
            history
                .map(
                    item => `
                        <div class="history-row">

                            <span>

                                <strong>
                                    ${item.id}
                                </strong>

                                ·

                                ${vehicle(item.vehicleId)?.name}

                            </span>

                            <span
                                class="status ${statusClass(item.status)}">

                                ${item.status}

                            </span>

                        </div>
                    `
                )
                .join("")
            ||
            `
                <p>
                    No reservations yet.
                </p>
            `
        }
    `);
}


/* =========================================================
   RECEIPT
   ========================================================= */

function openReceipt(reservationId) {

    const record =
        reservation(reservationId);

    if (!record) {

        showToast(
            "Reservation could not be found."
        );

        return;
    }

    const selectedCustomer =
        customer(record.customerId);

    const selectedVehicle =
        vehicle(record.vehicleId);

    const total =
        record.amount +
        (record.lateFee || 0) +
        (record.damageFee || 0);

    openModal(`
        <div class="receipt">

            <h2>
                DriveEase Rental Receipt
            </h2>

            <p>
                ${record.id}
            </p>

            <div class="receipt-row">

                <span>
                    Customer
                </span>

                <strong>
                    ${selectedCustomer.name}
                </strong>

            </div>

            <div class="receipt-row">

                <span>
                    Vehicle
                </span>

                <strong>
                    ${selectedVehicle.name}
                </strong>

            </div>

            <div class="receipt-row">

                <span>
                    Rental period
                </span>

                <strong>
                    ${formatDate(record.pickup)}
                    →
                    ${formatDate(record.returnDate)}
                </strong>

            </div>

            <div class="receipt-row">

                <span>
                    Rental
                </span>

                <strong>
                    ${money(record.amount)}
                </strong>

            </div>

            <div class="receipt-row">

                <span>
                    Late fee
                </span>

                <strong>
                    ${money(record.lateFee || 0)}
                </strong>

            </div>

            <div class="receipt-row">

                <span>
                    Damage fee
                </span>

                <strong>
                    ${money(record.damageFee || 0)}
                </strong>

            </div>

            <div class="receipt-total">

                <span>
                    Total
                </span>

                <span>
                    ${money(total)}
                </span>

            </div>

            <p>
                Payment:
                <strong>
                    ${record.payment}
                </strong>

                ·

                ${record.method}
            </p>

            <button
                class="btn primary"
                type="button"
                onclick="window.print()">

                Print / Save PDF

            </button>

        </div>
    `);
}


/* =========================================================
   RESERVATION ACTIONS
   ========================================================= */

function approveReservation(id) {

    const record =
        reservation(id);

    if (!record) {
        return;
    }

    record.status =
        "Confirmed";

    saveData();

    window.dispatchEvent(
        new CustomEvent("dataChanged")
    );

    showToast(
        "Reservation approved"
    );
}


function rejectReservation(id) {

    const record =
        reservation(id);

    if (!record) {
        return;
    }

    record.status =
        "Cancelled";

    saveData();

    window.dispatchEvent(
        new CustomEvent("dataChanged")
    );

    showToast(
        "Reservation cancelled"
    );
}


function startRental(id) {

    const record =
        reservation(id);

    if (!record) {
        return;
    }

    record.status =
        "Active";

    const selectedVehicle =
        vehicle(record.vehicleId);

    if (selectedVehicle) {

        selectedVehicle.status =
            "Rented";

    }

    saveData();

    window.dispatchEvent(
        new CustomEvent("dataChanged")
    );

    showToast(
        "Rental started"
    );
}


/* =========================================================
   MAINTENANCE ACTIONS
   ========================================================= */

function completeMaintenance(id) {

    const record =
        db.maintenance.find(
            item => item.id === id
        );

    if (!record) {
        return;
    }

    record.status =
        "Completed";

    const selectedVehicle =
        vehicle(record.vehicleId);

    if (selectedVehicle) {

        selectedVehicle.status =
            "Available";

    }

    saveData();

    window.dispatchEvent(
        new CustomEvent("dataChanged")
    );

    showToast(
        "Maintenance completed"
    );
}


/* =========================================================
   PAYMENT ACTIONS
   ========================================================= */

function markPaymentPaid(id) {

    const record =
        reservation(id);

    if (!record) {
        return;
    }

    record.payment =
        "Paid";

    saveData();

    window.dispatchEvent(
        new CustomEvent("dataChanged")
    );

    showToast(
        "Payment marked as paid"
    );
}


/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.openVehicle =
    openVehicle;

window.openCustomer =
    openCustomer;

window.openReservation =
    openReservation;

window.openMaintenance =
    openMaintenance;

window.openReturn =
    openReturn;

window.openCustomerProfile =
    openCustomerProfile;

window.openReceipt =
    openReceipt;

window.approveReservation =
    approveReservation;

window.rejectReservation =
    rejectReservation;

window.startRental =
    startRental;

window.completeMaintenance =
    completeMaintenance;

window.markPaymentPaid =
    markPaymentPaid;