import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/home";
import BMI from "../pages/bmi";
import GoalsPage from "../pages/goalsPage";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/home" element={<Home />} />
        <Route path="/bmi" element={<BMI />} />
        <Route path="/goals" element={<GoalsPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;