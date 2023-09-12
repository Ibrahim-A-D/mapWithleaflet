/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useRef, useEffect, useState } from "react";
import L, { LatLng, LayerGroup, Map } from "leaflet";
import data from "./geoJsonData.json";
import newIconPos from "./assets/location.png";
import { features } from "process";

function App() {
  const initialPos: any = [9.934886500000001, -11.283844999999985];
  const mapRef = useRef(null);
  const [coordinates, setCoordinates] = useState<any>();

  useEffect(() => {
    setCoordinates(data);
    const { current = {} } = mapRef;
    const map: Map | LayerGroup<any> | any = current;
    // const coordinates: any = data;
    if (!map) return;

    // const marker: any = L.marker([9.934886500000001, -11.283844999999985]);
    // marker.bindPopup("Hello this is my initial position");

    const markerFromData = L.geoJSON(coordinates, {
      /// custom marker
      pointToLayer: (features, LatLng) => {
        return L.marker(LatLng, {
          /// for custom icon without using an image but by using a html
          // icon: L.divIcon({
          //   html: `<div>🍔</div>`,
          // }),

          icon: new L.Icon({
            iconUrl: newIconPos,
            iconSize: [26, 26],
          }),
        });
      },

      onEachFeature: (feature, layer) => {
        const { properties = {}, geometry = {} } = feature;
        const { name, delivery, deliveryDistance } = properties;
        const { coordinates }: any = geometry;
        let delimitationDelivery: L.Circle<any>;
        console.log("object", delivery, deliveryDistance, coordinates);
        if (delivery) {
          delimitationDelivery = L.circle(coordinates.reverse(), {
            radius: deliveryDistance,
          });
        }
        const popup = L.popup();
        popup.setContent(name);
        layer.bindPopup(popup);

        layer.on("mouseover", () => {
          if (deliveryDistance) {
            delimitationDelivery.addTo(map);
          }
        });

        layer.on("mouseout", () => {
          delimitationDelivery.removeFrom(map);
        });
      },
    });

    markerFromData.openPopup();
    markerFromData.addTo(map);
  }, [mapRef, coordinates]);

  return (
    <>
      <MapContainer
        ref={mapRef}
        center={initialPos}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-screen"
      >
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/iad12/cllqprtp9008e01pfcsrs5jci/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiaWFkMTIiLCJhIjoiY2xscXB6Z2l5MG1lbDNxcGVvd3Z3ZnI2bCJ9.z7AnOepv3rjcZSpOyK8sqA`}
          attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
        />
        {/* <Marker position={initialPos}>
          <Popup>Hello this is my initial position</Popup>
        </Marker> */}
      </MapContainer>
    </>
  );
}

export default App;
