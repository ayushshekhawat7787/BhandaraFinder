// --------- Storage Logic for Bhandara Submission and Retrieval ---------

// Key for localStorage
const STORAGE_KEY = "bhandaras";

// Generate a unique ID (timestamp + random)
function generateId() {
  return "bhandara_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
}

// 12 Delhi locations for geolocation assignment
const dummyCoords = [
  { lat: 28.6328, lng: 77.2197 }, // Hanuman Mandir, CP
  { lat: 28.5672, lng: 77.2507 }, // ISKCON Temple
  { lat: 28.5734, lng: 77.2430 }, // Lajpat Nagar
  { lat: 28.6139, lng: 77.2090 }, // India Gate
  { lat: 28.7041, lng: 77.1025 }, // North Delhi
  { lat: 28.5245, lng: 77.1855 }, // Qutub Minar
  { lat: 28.6692, lng: 77.4538 }, // Ghaziabad Border (Delhi side)
  { lat: 28.6505, lng: 77.2334 }, // Old Delhi Railway Station
  { lat: 28.5510, lng: 77.2577 }, // Lotus Temple
  { lat: 28.6448, lng: 77.2167 }, // Karol Bagh
  { lat: 28.6367, lng: 77.2796 }, // Anand Vihar
  { lat: 28.5670, lng: 77.2100 }  // Saket
];

// Save a new Bhandara to localStorage
async function saveBhandara(formData) {
  const bhandaras = getAllBhandaras();

  // Geolocation: Use one of 12 Delhi coordinates
  const coords = dummyCoords[Math.floor(Math.random() * dummyCoords.length)];

  // Handle optional image
  let imageURL = "";
  if (formData.get("photo") && formData.get("photo").size > 0) {
    imageURL = await toBase64(formData.get("photo"));
  }

  const newBhandara = {
    id: generateId(),
    title: formData.get("title"),
    organizer: formData.get("organizer"),
    time: formData.get("datetime"),
    address: formData.get("address"),
    menu: formData.get("menu"),
    mobile: formData.get("mobile") || "",
    image: imageURL || "", // base64 string or blank
    lat: coords.lat,
    lng: coords.lng
  };

  bhandaras.push(newBhandara);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bhandaras));
  return newBhandara;
}

// Read all Bhandaras from localStorage
function getAllBhandaras() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Find a Bhandara by ID
function getBhandaraById(id) {
  const bhandaras = getAllBhandaras();
  return bhandaras.find(b => b.id === id);
}

// Helper: Convert image File to base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => resolve(ev.target.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// Expose globally for integration
window.BhandaraStorage = {
  saveBhandara,
  getAllBhandaras,
  getBhandaraById
};

// Utility for Bhandara Storage
window.BhandaraStorage = {
  getAllBhandaras() {
    try {
      return JSON.parse(localStorage.getItem('bhandaras') || '[]');
    } catch (e) { return []; }
  },
  addBhandara(bhandara) {
    const all = this.getAllBhandaras();
    all.push(bhandara);
    localStorage.setItem('bhandaras', JSON.stringify(all));
  }
};