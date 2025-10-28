const UseRefreshToken = () => {
  const refreshToken = async () => {
    const refresh = await fetch('http://localhost:8080/users/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return refresh;
  };
  return refreshToken;
};

export default UseRefreshToken;
