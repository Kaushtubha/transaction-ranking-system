import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import TransactionForm from './components/TransactionForm';
import Summary from './components/Summary';
import Ranking3D from './components/Ranking3D';

function Navigation() {
  const location = useLocation();
  
  return (
    <nav>
      <div className="logo">FinRank</div>
      <div className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Submit</Link>
        <Link to="/summary" className={location.pathname === '/summary' ? 'active' : ''}>Summary</Link>
        <Link to="/ranking" className={location.pathname === '/ranking' ? 'active' : ''}>3D Ranking</Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<TransactionForm />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/ranking" element={<Ranking3D />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
