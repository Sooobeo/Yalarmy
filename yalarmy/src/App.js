import Unfinished from './pages/Unfinished.js';
import Calendar from './pages/Calendarr.js';
import ChoosePage from './pages/ChoosePage.js';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path = "/choose" element = {<ChoosePage/>}></Route>
          <Route path = "/calendar" element = {<Calendar/>}></Route>
          <Route path = "/tasks" element = {<Unfinished/>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
