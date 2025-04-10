// Configuration
const API_KEY = "VOTRE_CLE_API_ICI"; // Remplacez par votre clé API Ipify

// Éléments DOM
const ipInput = document.getElementById("ip-input");
const searchBtn = document.getElementById("search-btn");
const ipDisplay = document.getElementById("ip");
const locationDisplay = document.getElementById("location");
const timezoneDisplay = document.getElementById("timezone");
const ispDisplay = document.getElementById("isp");

// Initialiser la carte avec une position par défaut (celle de l'exemple)
let map = L.map("map");

map.setView([40.65, -73.95], 13);

// Ajouter la couche de tuiles OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
	attribution:
		'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Créer une icône personnalisée pour le marqueur
const customIcon = L.icon({
	iconUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
	shadowSize: [41, 41],
});


// Fonction pour valider une adresse IP
function isValidIP(ip) {
	const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
	return ipPattern.test(ip);
}

// Fonction pour valider un nom de domaine
function isValidDomain(domain) {
	const domainPattern =
		/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
	return domainPattern.test(domain);
}

// Fonction pour mettre à jour les informations et la carte
async function updateIPInfo(query) {
	try {

		// Déterminer le type de requête (IP ou domaine)
		let apiUrl = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}`;

		if (isValidIP(query)) {
			apiUrl += `&ipAddress=${query}`;
		} else if (isValidDomain(query)) {
			apiUrl += `&domain=${query}`;
		} else {
			throw new Error("Format d'adresse IP ou de domaine invalide");
		}

		// Effectuer la requête à l'API
		const response = await fetch(apiUrl);

		if (!response.ok) {
			throw new Error(`Erreur API: ${response.status}`);
		}

		const data = await response.json();

		// Mettre à jour les informations affichées
		ipDisplay.textContent = data.ip;

		// Construire l'affichage de l'emplacement
		const city = data.location.city || "";
		const region = data.location.region || "";
		const postalCode = data.location.postalCode || "";
		const locationText = `${city}${city && region ? ", " : ""}${region}${
			(city || region) && postalCode ? " " : ""
		}${postalCode}`;
		locationDisplay.textContent = locationText || "Information non disponible";

		// Mettre à jour le fuseau horaire
		timezoneDisplay.textContent = `UTC ${data.location.timezone || "?"}`;

		// Mettre à jour le FAI
		ispDisplay.textContent = data.isp || "Information non disponible";

		// Mettre à jour la carte si les coordonnées sont disponibles
		if (data.location.lat && data.location.lng) {
			const lat = data.location.lat;
			const lng = data.location.lng;

			// Mettre à jour le centre de la carte et le zoom
			map.setView([lat, lng], 13);

			// Déplacer le marqueur
			marker.setLatLng([lat, lng]);

			// Ajouter un popup avec les informations de localisation
			marker.bindPopup(`<b>${locationText}</b><br>${data.ip}`).openPopup();
		}
	} catch (error) {
		console.error("Erreur:", error);
		alert(`Une erreur s'est produite: ${error.message}`);
	} finally {
		toggleLoading(false);
	}
}

// Gestionnaire d'événement pour le bouton de recherche
searchBtn.addEventListener("click", () => {
	const query = ipInput.value.trim();
	if (query) {
		updateIPInfo(query);
	}
});

// Gestionnaire d'événement pour la touche Entrée dans le champ de saisie
ipInput.addEventListener("keypress", (e) => {
	if (e.key === "Enter") {
		const query = ipInput.value.trim();
		if (query) {
			updateIPInfo(query);
		}
	}
});

// Fonction pour obtenir l'adresse IP du visiteur
async function getVisitorIP() {
	try {
		const response = await fetch(`https://api.ipify.org?format=json`);
		const data = await response.json();
		return data.ip;
	} catch (error) {
		console.error("Erreur lors de la récupération de l'IP du visiteur:", error);
		return null;
	}
}

// Initialiser l'application au chargement
window.addEventListener("load", async () => {
	// Option 1: Utiliser l'exemple de la maquette
	// Pas besoin d'appeler API, les données sont déjà affichées
	// Option 2: Charger les données de l'IP de l'utilisateur
	// Décommenter les lignes ci-dessous pour activer cette option
	/*
            const visitorIP = await getVisitorIP();
            if (visitorIP) {
                updateIPInfo(visitorIP);
            }
            */
	// Option 3: Utiliser une IP spécifique comme exemple
	// Si vous voulez charger une IP spécifique comme exemple, décommentez la ligne ci-dessous
	// updateIPInfo('64.233.160.1'); // Exemple avec Google
});
