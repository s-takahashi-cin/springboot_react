import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import { ApiFetch } from './components/ApiFetch';
import { useLocation } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <h1>Todo List</h1>
          <Routes>
            <Route path="/" element={<ApiFetch />} />
            <Route path="/contents" element={<Contents />} />
          </Routes>
          <Link to="/">Home</Link>
        </header>
      </div>
    </Router>
  );
}

function Contents() {
  const location = useLocation();
  const contents = location.state?.contents || [];


  return (
    <div>
      <h2>Details Page</h2>
      {contents.length > 0 ? (
        <div>
          {contents.map((content, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <p>{content.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>詳細情報が見つかりません。</p>
      )}
    </div>
  );
}

export default App;
