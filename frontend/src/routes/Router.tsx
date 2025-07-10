import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import Signup from "../pages/signup"
import Logout from "../pages/logout";
import Home from "../pages/home";
import BMI from "../pages/bmi"

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/home" element={<Home />} />
        <Route path="/bmi" element={<BMI />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;