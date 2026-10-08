/* Local storage layer. */
const STORAGE_KEY = "driveease-business-data";

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : structuredClone(DEFAULT_DATA);
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
