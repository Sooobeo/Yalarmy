import Unfinished from './pages/Unfinished.js';
import Calendar from './components/Calendar.js';
import ChoosePage from './pages/ChoosePage.js';
import './App.css';

function App() {
  return (
    <div className="App">
      <ChoosePage></ChoosePage>
      <Unfinished></Unfinished>
      <Calendar></Calendar>
    </div>
  );
}

export default App;
