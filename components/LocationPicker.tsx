'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue with webpack/Next.js
const icon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Location {
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  onAddressChange: (address: string) => void;
  onLocationChange: (location: Location) => void;
  initialLocation?: Location;
  initialAddress?: string;
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapCenterUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function LocationPicker({
  onAddressChange,
  onLocationChange,
  initialLocation,
  initialAddress,
}: LocationPickerProps) {
  const defaultLocation: Location = initialLocation || { lat: 20.5937, lng: 78.9629 };
  const [position, setPosition] = useState<Location>(defaultLocation);
  const [address, setAddress] = useState(initialAddress || '');
  const [searchQuery, setSearchQuery] = useState(initialAddress || '');
  const [geocoding, setGeocoding] = useState(false);

  const handleMapClick = async (lat: number, lng: number) => {
    setPosition({ lat, lng });
    onLocationChange({ lat, lng });
    setGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      if (data.display_name) {
        setAddress(data.display_name);
        onAddressChange(data.display_name);
      }
    } catch {
      // ignore geocoding errors
    }
    setGeocoding(false);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const results = await res.json();
      if (results.length > 0) {
        const { lat, lon, display_name } = results[0];
        const loc = { lat: parseFloat(lat), lng: parseFloat(lon) };
        setPosition(loc);
        onLocationChange(loc);
        setAddress(display_name);
        onAddressChange(display_name);
      }
    } catch {
      // ignore search errors
    }
    setGeocoding(false);
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a location..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={geocoding}
          className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {geocoding ? '...' : 'Search'}
        </button>
      </form>

      <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={5}
          className="h-full w-full"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onMapClick={handleMapClick} />
          <MapCenterUpdater center={[position.lat, position.lng]} />
          <Marker position={[position.lat, position.lng]} icon={icon} />
        </MapContainer>
      </div>

      {address && (
        <p className="text-xs text-gray-500">
          📍 {address}
        </p>
      )}
      <p className="text-xs text-gray-400">
        Coordinates: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
      </p>
    </div>
  );
}
