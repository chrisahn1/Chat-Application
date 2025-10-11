const UseVerifyActivity = () => {
  const verifyActivity = async () => {
    const response = await fetch('http://localhost:3001/users/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return response;
  };
  return verifyActivity;
};

export default UseVerifyActivity;
