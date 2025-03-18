import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import { useLocation } from "react-router-dom";
import Contents from "./components/Contents/Contents";
import Navigation from "./components/Navigation/Navigation";

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          {/* <Route path="/" element={<Main />} /> */}
          <Route path="/contents" element={<Contents />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
