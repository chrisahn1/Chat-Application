import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectRoute = () => {
  const { isAuth, accessToken } = useAuth();

  const location = useLocation();

  if (!isAuth) {
    return (
      <div>
        <h2 style={{ color: 'white' }}>403 Unauthorized</h2>
      </div>
    );
  }

  if (accessToken) {
    return <Outlet />;
  }

  return <Navigate to="/" state={{ from: location }} replace />;
};

export default ProtectRoute;
