import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
// import LoginPage from './pages/LoginPage';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
