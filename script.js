document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('search-btn');
    const ipInput = document.getElementById('ip-input');

    function getIPInfo(ipAddress) {
        const apiKey = 'at_XB5jhpfXIA26ZvOA81aOd0RjQ3grt';
        const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${ipAddress}`;
        
        fetch(url)
            .then(response => {
                if (!response.ok) {untry,city?apiKey=at_XB5jhpfXIA26ZvOA81aOd0RjQ3grt&ipAddress
                    throw new Error('Erreur réseau ou API');
                }
                return response.json();
            })
            .then(data => {
                console.log('Informations de l\'adresse IP:', data);
                
                console.log('IP:', data.ip);
                console.log('Localisation:', `${data.location.city}, ${data.location.region} ${data.location.postalCode}`);
                console.log('Timezone:', `UTC ${data.location.timezone}`);
                console.log('ISP:', data.isp);
                console.log('Coordonnées:', `Lat: ${data.location.lat}, Lng: ${data.location.lng}`);
            })
            .catch(error => {
                console.error('Erreur:', error);
                console.log('Une erreur est survenue lors de la récupération des informations IP');
            });
    }

    searchBtn.addEventListener('click', function() {
        const ipAddress = ipInput.value.trim();
        if (ipAddress) {
            console.log('Recherche pour l\'adresse IP:', ipAddress);
            getIPInfo(ipAddress);
        } else {
            console.log('Veuillez entrer une adresse IP');
        }
    });

    ipInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const ipAddress = ipInput.value.trim();
            if (ipAddress) {
                console.log('Recherche pour l\'adresse IP:', ipAddress);
                getIPInfo(ipAddress);
            } else {
                console.log('Veuillez entrer une adresse IP');
            }
        }
    });
});