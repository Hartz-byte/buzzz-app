import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SplashScreen from "../pages/SplashScreen";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import InfoCollection from "../pages/InfoCollection";

const Navigation = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/information" element={<InfoCollection />} /> */}
        <Route path="/Home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default Navigation;
