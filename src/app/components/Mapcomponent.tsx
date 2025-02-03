import { useEffect, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // ใช้ API Key ของคุณ

const MapComponent = ({ address }: { address: string }) => {
  const { isLoaded } = useLoadScript({ googleMapsApiKey: API_KEY || "" });

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (address) {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "OK") {
            const { lat, lng } = data.results[0].geometry.location;
            setLocation({ lat, lng }); // อัปเดตพิกัดจาก API
          } else {
            console.error("Geocode error:", data.status);
          }
        })
        .catch((err) => console.error("Error fetching location:", err));
    }
  }, [address]);

  if (!isLoaded) return <p>Loading map...</p>;
  if (!location) return <p>Loading location...</p>;

  return (
    <GoogleMap mapContainerStyle={{ width: "100%", height: "300px" }} center={location} zoom={14}>
      <Marker position={location} />
    </GoogleMap>
  );
};

export default MapComponent;
