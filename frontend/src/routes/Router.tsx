import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/login";
import Signup from "../pages/signup"
import Home from "../pages/home";
import BMI from "../pages/bmi";
import Profile from "../pages/profile"
import EditProfile from '../pages/edit-profile';
import GoalsPage from "../pages/goalsPage";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/bmi" element={<BMI />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/goals" element={<GoalsPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;