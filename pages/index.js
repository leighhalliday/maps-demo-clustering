import { useState, useCallback } from "react";
import { GoogleMapProvider } from "@ubilabs/google-maps-react-hooks";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import SuperClusterAlgorithm from "../utils/superClusterAlgorithm";
import trees from "../data/trees";

const mapOptions = {
  zoom: 12,
  center: {
    lat: 43.68,
    lng: -79.43,
  },
};

export default function Index() {
  const [mapContainer, setMapContainer] = useState(null);
  const onLoad = useCallback((map) => addMarkers(map), []);

  return (
    <GoogleMapProvider
      googleMapsAPIKey={process.env.NEXT_PUBLIC_MAP_API_KEY}
      options={mapOptions}
      mapContainer={mapContainer}
      onLoad={onLoad}
    >
      <div ref={(node) => setMapContainer(node)} style={{ height: "100vh" }} />
    </GoogleMapProvider>
  );
}

function addMarkers(map) {
  const infoWindow = new google.maps.InfoWindow();

  const markers = trees.map(([name, lat, lng]) => {
    const marker = new google.maps.Marker({ position: { lat, lng } });

    marker.addListener("click", () => {
      infoWindow.setPosition({ lat, lng });
      infoWindow.setContent(`
        <div class="info-window">
          <h2>${name}</h2>
        </div>
      `);
      infoWindow.open({ map });
    });

    return marker;
  });

  new MarkerClusterer({
    markers,
    map,
    algorithm: new SuperClusterAlgorithm({ radius: 200 }),
  });
}
