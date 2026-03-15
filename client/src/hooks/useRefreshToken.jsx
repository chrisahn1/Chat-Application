import { url } from '../configURL/configURL';

const UseRefreshToken = () => {
  const refreshToken = async () => {
    const refresh = await fetch(`${url}/users/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return refresh;
  };
  return refreshToken;
};

export default UseRefreshToken;
