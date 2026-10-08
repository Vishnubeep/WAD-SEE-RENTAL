/* Demo data used by the prototype. */
const DEFAULT_DATA = {
  vehicles: [
    { id: "V001", name: "Toyota Fortuner", plate: "KA 01 AB 4521", type: "SUV", fuel: "Diesel", transmission: "Automatic", seats: 7, price: 4200, status: "Available", emoji: "🚙" },
    { id: "V002", name: "Hyundai Creta", plate: "KA 05 CD 7821", type: "SUV", fuel: "Petrol", transmission: "Automatic", seats: 5, price: 2200, status: "Rented", emoji: "🚘" },
    { id: "V003", name: "Honda City", plate: "KA 03 EF 3312", type: "Sedan", fuel: "Petrol", transmission: "Manual", seats: 5, price: 1800, status: "Available", emoji: "🚗" },
    { id: "V004", name: "Maruti Swift", plate: "KA 04 GH 9090", type: "Hatchback", fuel: "Petrol", transmission: "Manual", seats: 5, price: 1300, status: "Available", emoji: "🚗" },
    { id: "V005", name: "Kia Seltos", plate: "KA 02 JK 6123", type: "SUV", fuel: "Diesel", transmission: "Automatic", seats: 5, price: 2300, status: "Maintenance", emoji: "🚙" },
    { id: "V006", name: "Toyota Innova Crysta", plate: "KA 01 LM 7777", type: "MPV", fuel: "Diesel", transmission: "Manual", seats: 7, price: 2800, status: "Available", emoji: "🚐" },
    { id: "V007", name: "Skoda Slavia", plate: "KA 51 NP 1842", type: "Sedan", fuel: "Petrol", transmission: "Automatic", seats: 5, price: 2100, status: "Available", emoji: "🚘" },
    { id: "V008", name: "BMW 3 Series", plate: "KA 03 QR 9001", type: "Luxury", fuel: "Petrol", transmission: "Automatic", seats: 5, price: 6500, status: "Available", emoji: "🏎️" }
  ],
  customers: [
    { id: "C001", name: "Aditya Kumar", phone: "+91 98765 43210", email: "aditya@gmail.com", licence: "KA05 665544" },
    { id: "C002", name: "Ananya Nair", phone: "+91 98470 11223", email: "ananya@gmail.com", licence: "KL13 778899" },
    { id: "C003", name: "Rahul Sharma", phone: "+91 99887 66554", email: "rahul@gmail.com", licence: "DL04 882211" },
    { id: "C004", name: "Arjun Menon", phone: "+91 98765 11223", email: "arjun@gmail.com", licence: "KA01 20251234" }
  ],
  reservations: [
    { id: "RES-1004", customerId: "C001", vehicleId: "V001", bookedOn: "2026-10-06", pickup: "2026-10-07", returnDate: "2026-10-12", amount: 12600, payment: "Paid", method: "UPI", status: "Active", lateFee: 0, damageFee: 0 },
    { id: "RES-1003", customerId: "C002", vehicleId: "V003", bookedOn: "2026-10-01", pickup: "2026-10-02", returnDate: "2026-10-05", amount: 5400, payment: "Paid", method: "Card", status: "Returned", lateFee: 0, damageFee: 0 },
    { id: "RES-1002", customerId: "C003", vehicleId: "V002", bookedOn: "2026-10-02", pickup: "2026-10-03", returnDate: "2026-10-06", amount: 6600, payment: "Paid", method: "UPI", status: "Returned", lateFee: 0, damageFee: 0 },
    { id: "RES-1001", customerId: "C004", vehicleId: "V006", bookedOn: "2026-10-07", pickup: "2026-10-08", returnDate: "2026-10-11", amount: 8400, payment: "Pending", method: "Cash", status: "Confirmed", lateFee: 0, damageFee: 0 },
    { id: "RES-1005", customerId: "C001", vehicleId: "V007", bookedOn: "2026-10-07", pickup: "2026-10-15", returnDate: "2026-10-17", amount: 4200, payment: "Pending", method: "UPI", status: "Pending", lateFee: 0, damageFee: 0 }
  ],
  maintenance: [
    { id: "M001", vehicleId: "V005", reason: "Regular service and brake inspection", start: "2026-10-07", end: "2026-10-09", cost: 4500, status: "In Progress" }
  ]
};
