/* Local storage layer. */
const STORAGE_KEY = "driveease-business-data";

const SAMPLE_RESERVATION_MIGRATIONS = [
  { id: "RES-1004", oldPickup: "2026-10-09", oldReturnDate: "2026-10-12", pickup: "2026-10-07", bookedOn: "2026-10-06" },
  { id: "RES-1003", oldPickup: "2026-10-02", oldReturnDate: "2026-10-05", pickup: "2026-10-02", bookedOn: "2026-10-01" },
  { id: "RES-1002", oldPickup: "2026-10-07", oldReturnDate: "2026-10-10", pickup: "2026-10-03", returnDate: "2026-10-06", bookedOn: "2026-10-02" },
  { id: "RES-1001", oldPickup: "2026-10-08", oldReturnDate: "2026-10-11", pickup: "2026-10-08", bookedOn: "2026-10-07" },
  { id: "RES-1005", oldPickup: "2026-10-15", oldReturnDate: "2026-10-17", pickup: "2026-10-15", bookedOn: "2026-10-07" }
];

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(DEFAULT_DATA);

  const data = JSON.parse(saved);
  let migrated = false;

  SAMPLE_RESERVATION_MIGRATIONS.forEach(update => {
    const record = data.reservations.find(item => item.id === update.id);
    if (!record) return;

    if (!record.bookedOn) {
      record.bookedOn = update.bookedOn;
      migrated = true;
    }

    if (record.pickup === update.oldPickup && record.returnDate === update.oldReturnDate) {
      record.pickup = update.pickup;
      if (update.returnDate) record.returnDate = update.returnDate;
      migrated = true;
    }
  });

  if (migrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

let db = loadData();

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function resetData() {
  db = structuredClone(DEFAULT_DATA);
  saveData();
  window.location.reload();
}
