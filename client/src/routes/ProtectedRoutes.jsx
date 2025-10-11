import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProtectRoute = () => {
  const { isAuth, isLoading } = useContext(AuthContext);

  const location = useLocation();

  // const [access, setAccess] = useState({});

  // useEffect(() => {
  //   const refreshToken = async () => {
  //     try {
  //       const response = await fetch('http://localhost:3001/users/refresh', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         credentials: 'include',
  //       });

  //       // if (!response.ok) {
  //       //     console.log('Refresh token failed');
  //       // }
  //       if (response.status === 401) {
  //         console.log('response access: ', response.status);
  //         setAccess({});
  //       } else if (response.status === 403) {
  //         console.log('response access: ', response.status);
  //         setAccess({});
  //       } else {
  //         console.log('response access: ', response.status);
  //         const data = await response.json();
  //         setAccess({});
  //         setAccess(data.access_token);
  //       }
  //     } catch (err) {
  //       console.error(err.message);
  //     }
  //   };

  //   refreshToken();
  // }, [access]);

  // //STILL NEED TO DEAL WITH NOT NAVIGATING TO PROTECTED ROUTES
  // //STILL NEED TO DEAL WITH USER MANUALLY REMOVING COOKIE

  // if (isLoading) {
  //   return (
  //     <div>
  //       <h2 style={{ color: 'white' }}>Loading...</h2>
  //     </div>
  //   );
  // }

  // if (!isAuth) {
  //   return <Navigate to="/" state={{ from: location }} replace />;
  // }

  if (!isAuth) {
    return <Navigate to="/" />;
  }

  // if (!access) {
  //   // return <Navigate to="/" />;
  //   return <Navigate to="/" state={{ from: location }} replace />;
  // }

  return <Outlet />;
};

export default ProtectRoute;
