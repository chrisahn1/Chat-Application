import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import UserPage from './pages/UserPage';
import Settings from './pages/Settings';
import UserUpdate from './pages/UserUpdate';
import ProtectRoute from '../src/components/ProtectedRoutes';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<ProtectRoute />}>
            <Route path="/userpage" element={<UserPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/editpage" element={<UserUpdate />} />
          </Route>
          {/* <Route path="/userpage" element={<UserPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/editpage" element={<UserUpdate />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
