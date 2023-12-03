import { icon } from "leaflet";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import { AirportCard } from "./AirportCard";

export const Map = ({ airports, selectedAirports, onClickAirport }) => {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin=""
      ></script>
      <MapContainer
        center={[30, 0]}
        zoom={3}
        style={{ height: "90vh", width: "80vw" }}
        scrollWheelZoom
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {airports.map((airport) => {
          const airportSelection = selectedAirports?.find(
            ({ airportId }) => airportId === airport._id
          );
          return (
            <Marker
              riseOnHover
              eventHandlers={{
                click: (e) => {
                  e.originalEvent.stopPropagation();
                  onClickAirport?.(airport);
                },
              }}
              key={airport.iata}
              position={[airport.latitude, airport.longitude]}
              icon={icon({
                className: airportSelection?.status
                  ? `selected-${airportSelection.status}`
                  : undefined,
                iconUrl: "airport-marker.icon.png",
                iconSize: [50, 50],
                iconAnchor: [20, 50],
              })}
            >
              <Tooltip direction="top" opacity={1} offset={[5, -50]}>
                <AirportCard airport={airport} />
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </>
  );
};
