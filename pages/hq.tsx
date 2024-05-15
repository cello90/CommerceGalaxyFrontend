import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

type Base = {
  id: string;
  name: string;
  size: number;
  planet: {
    _id: string;
    name: string;
  };
  user: {
    _id: string;
    username: string;
  };
};

const HQ: React.FC = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState<string | null>(null);
  const [bases, setBases] = useState<Base[]>([]);

  useEffect(() => {
    // Retrieve the auth token from the cookie
    const token = Cookies.get('authToken');
    if (token) {
      console.log('Auth token found:', token);
      setAuthToken(token);

      // Fetch bases data
      fetchBases(token);
    } else {
      console.log('No auth token found, redirecting to login...');
      setRequestMessage('No auth token found. Please login.');
    }
  }, []);

  const fetchBases = async (token: string) => {
    try {
      const response = await fetch('http://localhost:8081/bases', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Bases:", result);
        setBases(result);
      } else {
        const errorData = await response.json();
        setRequestMessage(errorData.message || 'Failed to fetch bases.');
      }
    } catch (error) {
      setRequestMessage('An error occurred. Please try again later.');
      console.error('Fetch bases error:', error);
    }
  };

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
        fetchBases(authToken); // Refresh the list of bases after creating a new one
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
          <p>Welcome! You are logged in!</p>
          <button
            type="button"
            className="mt-4 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={handleCreateBaseClick}
          >
            Create Base
          </button>
          <div className="mt-6">
            <h2 className="text-2xl mb-4">Bases</h2>
            <table className="min-w-full bg-gray-800 text-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-600">ID</th>
                  <th className="py-2 px-4 border-b border-gray-600">Name</th>
                  <th className="py-2 px-4 border-b border-gray-600">Size</th>
                  <th className="py-2 px-4 border-b border-gray-600">Planet</th>
                  <th className="py-2 px-4 border-b border-gray-600">User</th>
                </tr>
              </thead>
              <tbody>
                {bases.map((base) => (
                  base.user ? 
                  <tr key={base.id}>
                    <td className="py-2 px-4 border-b border-gray-600">{base._id}</td>
                    <td className="py-2 px-4 border-b border-gray-600">{base.name}</td>
                    <td className="py-2 px-4 border-b border-gray-600">{base.size}</td>
                    <td className="py-2 px-4 border-b border-gray-600">{base.planet.name}</td>
                    <td className="py-2 px-4 border-b border-gray-600">{base.user.username}</td>
                  </tr>
                  : null
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p>You are not logged in. Please login to access the HQ.</p>
      )}
      {requestMessage && <p className="mt-4 text-yellow-500 text-sm">{requestMessage}</p>}
    </div>
  );
};

export default HQ;
