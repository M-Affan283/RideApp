import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PassengerDashboard from "./pages/ride/passenger/dashboard";
import RequestRide from "./pages/ride/passenger/request";
import RideHistory from "./pages/ride/passenger/history";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import DriverDashboard from "./pages/ride/driver/dashboard";
import AvailableRides from "./pages/ride/driver/available";

import useUserStore from "./context/store";

// Navigation based on auth status
function AuthRedirect() 
{
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const user = useUserStore((state) => state.user);

  console.log("AuthRedirect - isLoggedIn:", isLoggedIn);
  console.log("AuthRedirect - user:", user);

  if (isLoggedIn) {
    return <Navigate to={`/${user.type}/dashboard`} />;
  } else {
    return <Navigate to="/login" />;
  }
}

function App() 
{
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const user = useUserStore((state) => state.user);

  return (
    <BrowserRouter>
    
      <Routes>
        <Route path="/" element={<AuthRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Passenger routes */}
        <Route path="/passenger/dashboard" element={isLoggedIn && user.type === "passenger" ? <PassengerDashboard /> : <Navigate to="/login" />} />
        <Route path="/passenger/request" element={isLoggedIn && user.type === "passenger" ? <RequestRide /> : <Navigate to="/login" />} />
        <Route path="/passenger/history" element={isLoggedIn && user.type === "passenger" ? <RideHistory /> : <Navigate to="/login" />} />
        
        {/* Driver routes */}
        <Route path="/driver/dashboard" element={isLoggedIn && user.type === "driver" ? <DriverDashboard /> : <Navigate to="/login" />} />
        <Route path="/driver/available" element={isLoggedIn && user.type === "driver" ? <AvailableRides /> : <Navigate to="/login" />} />
        <Route path="/driver/history" element={isLoggedIn && user.type === "driver" ? <RideHistory /> : <Navigate to="/login" />} />

        
        {/* 404 */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    
    </BrowserRouter>
  )
}

export default App;
