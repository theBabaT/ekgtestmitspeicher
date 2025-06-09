import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import DebugPage from './pages/debugpage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/" element={<h2>Willkommen zum EKG-Quiz</h2>} />
        <Route path="/debug" element={<debugpage />} />
      </Routes>
    </Router>
  );
}
export default App;
