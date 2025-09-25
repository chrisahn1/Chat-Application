import { useNavigate, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProtectRoute = () => {
  const { isAuth, setIsAuth } = useContext(AuthContext);
  // const [ isAuth, setIsAuth ] = useState(false);
  const location = useLocation();

  //VERIFY HERE - CHECKING IF USER MANUALLY REMOVED COOKIE. IF SO THEN REDIRECT TO HOME PAGE

  const checkAuth = async () => {
    const response = await fetch('http://localhost:3001/users/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    console.log('check auth response status: ', response.status);
    if (response.status === 401) {
      console.log('cookie is gone');
      setIsAuth(false);
      return <Navigate to="/" state={{ from: location }} replace />;
    } else {
      console.log('cookie is still here');
      setIsAuth(true);
      // return <Navigate to="/userpage" state={{ from: location }} replace/>;
      return <Outlet />;
    }
  };

  checkAuth();

  //STILL NEED TO DEAL WITH NOT NAVIGATING TO PROTECTED ROUTES
  //STILL NEED TO DEAL WITH USER MANUALLY REMOVING COOKIE

  // if (!isAuth) {
  //   return <Navigate to="/" state={{ from: location }} replace />;

  // }

  return <Outlet />;
};

export default ProtectRoute;
