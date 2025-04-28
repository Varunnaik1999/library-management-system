import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Menu from "./Components/Menu";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/menu/*" element={<Menu />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
