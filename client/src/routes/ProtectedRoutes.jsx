import { useNavigate, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProtectRoute = () => {
  const { isAuth, isLoading } = useContext(AuthContext);

  const location = useLocation();

  // //STILL NEED TO DEAL WITH NOT NAVIGATING TO PROTECTED ROUTES
  // //STILL NEED TO DEAL WITH USER MANUALLY REMOVING COOKIE

  if (isLoading) {
    return (
      <div>
        <h2 style={{ color: 'white' }}>Loading...</h2>
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

export default ProtectRoute;
