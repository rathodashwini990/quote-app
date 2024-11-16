import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import QuoteListPage from './components/QuoteListPage';
import CreateQuotePage from './components/CreateQuotePage';
import './App.scss';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/quotes" element={<QuoteListPage />} />
          <Route path="/create-quote" element={<CreateQuotePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;