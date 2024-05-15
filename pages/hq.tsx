import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

type Base = {
  _id: string;
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
  const [editingBase, setEditingBase] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editSize, setEditSize] = useState<number>(0);

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      console.log('Auth token found:', token);
      setAuthToken(token);
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
        const filteredBases = result.filter((base: Base) => base.user !== null);
        setBases(filteredBases);
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
        fetchBases(authToken);
      } else {
        const errorData = await response.json();
        setRequestMessage(errorData.message || 'Failed to create base.');
      }
    } catch (error) {
      setRequestMessage('An error occurred. Please try again later.');
      console.error('Create base error:', error);
    }
  };

  const handleEditClick = (base: Base) => {
    setEditingBase(base._id);
    setEditName(base.name);
    setEditSize(base.size);
  };

  const handleUpdateBase = async (id: string) => {
    if (!authToken) {
      setRequestMessage('No auth token found. Please log in first.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/bases/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: editName,
          size: editSize,
        }),
      });

      if (response.ok) {
        setRequestMessage('Base updated successfully.');
        fetchBases(authToken);
        setEditingBase(null);
      } else {
        const errorData = await response.json();
        setRequestMessage(errorData.message || 'Failed to update base.');
      }
    } catch (error) {
      setRequestMessage('An error occurred. Please try again later.');
      console.error('Update base error:', error);
    }
  };

  const handleDeleteBase = async (id: string) => {
    if (!authToken) {
      setRequestMessage('No auth token found. Please log in first.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/bases/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        setRequestMessage('Base deleted successfully.');
        fetchBases(authToken);
      } else {
        const errorData = await response.json();
        setRequestMessage(errorData.message || 'Failed to delete base.');
      }
    } catch (error) {
      setRequestMessage('An error occurred. Please try again later.');
      console.error('Delete base error:', error);
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
                  <th className="py-2 px-4 border-b border-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bases.map((base) => (
                  <tr key={base._id}>
                    <td className="py-2 px-4 border-b border-gray-600">{base._id}</td>
                    <td className="py-2 px-4 border-b border-gray-600">
                      {editingBase === base._id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="px-2 py-1 bg-gray-700 rounded"
                        />
                      ) : (
                        base.name
                      )}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-600">
                      {editingBase === base._id ? (
                        <input
                          type="number"
                          value={editSize}
                          onChange={(e) => setEditSize(Number(e.target.value))}
                          className="px-2 py-1 bg-gray-700 rounded"
                        />
                      ) : (
                        base.size
                      )}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-600">{base.planet.name}</td>
                    <td className="py-2 px-4 border-b border-gray-600">{base.user.username}</td>
                    <td className="py-2 px-4 border-b border-gray-600">
                      {editingBase === base._id ? (
                        <button
                          onClick={() => handleUpdateBase(base._id)}
                          className="px-2 py-1 bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          ✓
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(base)}
                            className="px-2 py-1 bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBase(base._id)}
                            className="ml-2 px-2 py-1 bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
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
