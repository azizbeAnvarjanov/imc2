"use client";
import { useState, useEffect } from "react";
import saveDataToFirebase from "./firebase";

const Home = () => {
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isArrival, setIsArrival] = useState(null);
  const [loading, setLoading] = useState(false);

  // Geolocationni aniqlash funksiyasi
  const getLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setLoading(false);
        },
        (error) => {
          setMessage("Geolokatsiya topilmadi.");
          setLoading(false);
        }
      );
    } else {
      setMessage("Geolokatsiya brauzeringizda qo'llab-quvvatlanmaydi.");
    }
  };

  useEffect(() => {
    if (location && isArrival !== null) {
      const predefinedLocation = {
        latitude: 40.930202,
        longitude: 71.8937198,
      };
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        predefinedLocation.latitude,
        predefinedLocation.longitude
      );

      if (distance <= 0.01) {
        setStatus(isArrival ? "Siz keldingiz." : "Siz ketdingiz.");
        saveDataToFirebase(isArrival);
      } else {
        setMessage("Siz ish joyidan uzoqda turibsiz.");
        setStatus("");
      }
    }
  }, [location, isArrival]);

  // Ikki nuqta orasidagi masofani hisoblash
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Xodimlar Tizimi</h1>
      <div className="mb-4">
        <button
          onClick={() => {
            setIsArrival(true);
            getLocation();
          }}
          className="bg-green-500 text-white p-4 rounded-lg m-2"
        >
          Men Keldim
        </button>
        <button
          onClick={() => {
            setIsArrival(false);
            getLocation();
          }}
          className="bg-red-500 text-white p-4 rounded-lg m-2"
        >
          Men Ketdim
        </button>
      </div>
      {loading && <p className="text-xl text-blue-500">Lokatsiyani aniqlayapman...</p>}
      <p className="text-xl text-gray-700">{status}</p>
      <p className="text-xl text-red-500">{message}</p>
    </div>
  );
};

export default Home;
