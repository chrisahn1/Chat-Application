import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectRoute = () => {
  const { isAuth, accessToken, setTimeInterval, setTokenExp, isLoading } =
    useAuth();

  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // ✅ WAIT for auth check
  }

  if (!isAuth) {
    setTokenExp(null);
    setTimeInterval(false);
    return (
      <div>
        <h2 style={{ color: 'white' }}>403 Unauthorized</h2>
      </div>
    );
  }

  if (accessToken) {
    return <Outlet />;
  } else {
    setTokenExp(null);
    setTimeInterval(false);
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // return <Navigate to="/" state={{ from: location }} replace />;
};

export default ProtectRoute;
