import Unfinished from './pages/Unfinished.js';
import Calendar from './pages/Calendarr.js';
import ChoosePage from './pages/ChoosePage.js';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path = "/" element = {<ChoosePage/>}></Route>
          <Route path = "/calendar" element = {<Calendar/>}></Route>
          <Route path = "/tasks" element = {<Unfinished/>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
