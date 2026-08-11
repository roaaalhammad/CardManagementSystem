import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import RequestsList from "./pages/comm-staff/RequestsList";
import RequestDetails from "./pages/comm-staff/RequestDetails";
import backgroundTop from "./assets/background.png";
import backgroundBottom from "./assets/background-bottom.png";
import CardDesign from "./pages/comm-staff/CardDesign";

export default function App() {
  return (
    <AuthProvider>
      <div className="relative min-h-screen overflow-hidden bg-white">
        <img
          src={backgroundTop}
          alt=""
          className="pointer-events-none absolute top-0 left-0 w-[600px] opacity-100"
        />
        <img
          src={backgroundBottom}
          alt=""
          className="pointer-events-none absolute bottom-0 right-0 w-[750px] opacity-100"
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-10">
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
            <Header />
            <Routes>
              <Route path="/" element={<RequestsList />} />
              <Route path="/requests/:id" element={<RequestDetails />} />
              <Route path="/requests/:id/card" element={<CardDesign />} />
            </Routes>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}