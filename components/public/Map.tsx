"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// fix default marker icon broken in Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Brainstorm Academy exact coordinates
// Radio Station, Berhampur, Ganjam
const ACADEMY_POSITION: [number, number] = [19.318436, 84.795513];

export default function AcademyMap() {
  return (
    <MapContainer
      center={ACADEMY_POSITION}
      zoom={16}
      style={{ height: "400px", width: "100%", borderRadius: "16px" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={ACADEMY_POSITION} icon={icon}>
        <Popup>
          <div style={{ fontFamily: "sans-serif", minWidth: "180px" }}>
            <strong style={{ fontSize: "14px" }}>Brainstorm Academy</strong>
            <br />
            <span style={{ fontSize: "12px", color: "#666" }}>
              Radio Station, Berhampur
            </span>
            <br />
            <span style={{ fontSize: "12px", color: "#666" }}>
              Ganjam, Odisha
            </span>
            <br />
            <br />
            <span style={{ fontSize: "12px" }}>📞 9938828835</span>
            <br />
            <span style={{ fontSize: "12px" }}>📞 7008546156</span>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
