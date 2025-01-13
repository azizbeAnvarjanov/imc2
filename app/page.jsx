"use client";
import { useState } from "react";

const Home = () => {
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  // Geolocationni aniqlash funksiyasi
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          setMessage("Geolokatsiya topilmadi.");
        }
      );
    } else {
      setMessage("Geolokatsiya brauzeringizda qo'llab-quvvatlanmaydi.");
    }
  };

  // Kelganini yoki ketganini tekshirish
  const checkLocation = (isArrival) => {
    getLocation();

    if (location) {
      const predefinedLocation = {
        latitude: 40.930456171226965,
        longitude: 71.89344277911185,
      }; // Ish joyining lat/long 40.930456171226965, 71.89344277911185
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        predefinedLocation.latitude,
        predefinedLocation.longitude
      );

      if (distance <= 0.01) {
        // 10 metr masofa
        setStatus(isArrival ? "Siz keldingiz." : "Siz ketdingiz.");
        saveDataToFirebase(isArrival); // Firebasega ma'lumotni saqlash
      } else {
        setMessage("Siz ish joyidan uzoqda turibsiz.");
        setStatus("");
      }
    }
  };

  // Ikki nuqta orasidagi masofani hisoblash
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Yer radiusi (km)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // in km
    return distance;
  };

  // Firebasega ma'lumotlarni saqlash
  const saveDataToFirebase = (isArrival) => {
    // Firebasega xodimning kelgan yoki ketganligini saqlash
    // Bu yerda Firebase SDK kodlari bo'ladi
    console.log(`Firebasega saqlash: ${isArrival ? "Kelgan" : "Ketgan"}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Xodimlar Tizimi</h1>
      <div className="mb-4">
        <button
          onClick={() => checkLocation(true)}
          className="bg-green-500 text-white p-4 rounded-lg m-2"
        >
          Men Keldim
        </button>
        <button
          onClick={() => checkLocation(false)}
          className="bg-red-500 text-white p-4 rounded-lg m-2"
        >
          Men Ketdim
        </button>
      </div>
      <p className="text-xl text-gray-700">{status}</p>
      <p className="text-xl text-red-500">{message}</p>
    </div>
  );
};

export default Home;
