import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const HQ: React.FC = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve the auth token from the cookie
    const token = Cookies.get('authToken');
    if (token) {
      console.log('Auth token found:', token);
      setAuthToken(token);
      // Fetch user data or perform any authenticated actions here using the token
    } else {
      // Handle case where token is not available (e.g., redirect to login)
      console.log('No auth token found, redirecting to login...');
      setRequestMessage('No auth token found. Please login.');
    }
  }, []);

  const handleCreateBaseClick = async () => {
    if (!authToken) {
      setRequestMessage('No auth token found. Please log in first.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/bases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: 'test from website',
          size: 25,
          planet: '6641803bb803c40a1eb88bed',
          user: '6643f1ced46931726dc0272a',
        }),
      });

      if (response.ok) {
        setRequestMessage('Base created successfully.');
      } else {
        const errorData = await response.json();
        setRequestMessage(errorData.message || 'Failed to create base.');
      }
    } catch (error) {
      setRequestMessage('An error occurred. Please try again later.');
      console.error('Create base error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-2">HQ</h1>
      {authToken ? (
        <>
          <p>Welcome! You are logged in with token: {authToken}</p>
          <button
            type="button"
            className="mt-4 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={handleCreateBaseClick}
          >
            Create Base
          </button>
        </>
      ) : (
        <p>You are not logged in. Please login to access the dashboard.</p>
      )}
      {requestMessage && <p className="mt-4 text-yellow-500 text-sm">{requestMessage}</p>}
    </div>
  );
};

export default HQ;
