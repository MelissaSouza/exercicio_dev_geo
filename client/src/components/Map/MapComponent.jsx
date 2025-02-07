import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Papa from "papaparse";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { theme } from "../../theme"; 

const MapComponent = () => {
  const [markers, setMarkers] = useState([]);
  const [userMarkers, setUserMarkers] = useState([]);
  const [polygonCoords, setPolygonCoords] = useState(null);

  useEffect(() => {
    if (document.getElementById("map")._leaflet_id) return;

    const map = L.map("map").setView([-23.55052, -46.633308], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);

    const customIcon = L.divIcon({
      className: "custom-marker",
      html: `<div style="display: flex; justify-content: center; align-items: center; width: 30px; height: 30px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="red">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 3.89 3.59 7.93 6.02 10.19.55.54 1.42.54 1.96 0C15.41 16.93 19 12.89 19 9c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
    });

    const loadCSVData = async () => {
      const response = await fetch("/files/base_jales_separado_virgula.csv");
      const text = await response.text();
      const results = Papa.parse(text, { header: true });

      results.data.forEach((row) => {
        if (row.lat && row.lon) {
          const marker = L.marker([parseFloat(row.lat), parseFloat(row.lon)], { icon: customIcon })
            .addTo(map)
            .bindPopup(`Censo 2022: ${row.censo_2022_domicilio_particular_poi_counts}`);
          setMarkers((prev) => [...prev, marker]);
        }
      });
    };

    loadCSVData();

    const drawControl = new L.Control.Draw({
      draw: {
        polygon: true,
        marker: false,
        circle: false,
        polyline: false,
        rectangle: false,
      },
    });
    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (e) => {
      const layer = e.layer;
      const coords = layer.getLatLngs()[0].map((latLng) => [latLng.lat, latLng.lng]);
      handleDrawPolygon(coords);
      map.addLayer(layer);
    });

    map.on("click", async (e) => {
      const { lat, lng } = e.latlng;
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();

      const newMarker = L.marker([lat, lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(
          `<div>
             <strong>Endereço:</strong> ${data.display_name}<br>
             <strong>Coordenadas:</strong> ${lat.toFixed(4)}, ${lng.toFixed(4)}
           </div>`
        );

      setUserMarkers((prev) => [...prev, newMarker]);
      localStorage.setItem("userMarkers", JSON.stringify([...userMarkers, { lat, lng, data }]));
      console.log("Novo pino adicionado:", { lat, lng, data });
      alert("Pino adicionado com sucesso!");
    });

    const savedUserMarkers = JSON.parse(localStorage.getItem("userMarkers")) || [];
    savedUserMarkers.forEach((marker) => {
      L.marker([marker.lat, marker.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(
          `<div>
             <strong>Endereço:</strong> ${marker.data.display_name}<br>
             <strong>Coordenadas:</strong> ${marker.lat.toFixed(4)}, ${marker.lng.toFixed(4)}
           </div>`
        );
    });

    return () => {
      map.remove();
    };
  }, []);

  const handleDrawPolygon = (coords) => {
    setPolygonCoords(coords);
    console.log("Coordenadas do polígono desenhado:", coords);
    alert(`Polígono desenhado com sucesso!\nCoordenadas: ${JSON.stringify(coords)}`);

    const pointsInside = markers.filter((marker) => {
      const latLng = marker.getLatLng();
      return L.polygon(coords).getBounds().contains(latLng);
    });

    const values = pointsInside.map((marker) => {
      const popupContent = marker.getPopup().getContent();
      const match = popupContent.match(/Censo 2022: (\d+)/);
      return match ? parseFloat(match[1]) : 0;
    });

    const totalPoints = pointsInside.length;
    const sum = values.reduce((acc, val) => acc + val, 0);
    const average = sum / totalPoints;
    const median = values.sort((a, b) => a - b)[Math.floor(values.length / 2)];

    console.log("Estatísticas do polígono:", { totalPoints, sum, average, median });
    alert(`Estatísticas do polígono:\nTotal de pontos: ${totalPoints}\nSoma: ${sum}\nMédia: ${average}\nMediana: ${median}`);
  };

  return (
    <div
      id="map"
      style={{
        width: "100%",
        height: "500px",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    />
  );
};

export default MapComponent;