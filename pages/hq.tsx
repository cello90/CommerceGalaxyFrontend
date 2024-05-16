import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Import useRouter from next/router
import BaseTable from "../components/bases/base_table";
import BaseForm from "../components/bases/base_form";
import { Base } from "../components/bases/base_type";

const HQ: React.FC = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState<string | null>(null);
  const [bases, setBases] = useState<Base[]>([]);
  const [editingBase, setEditingBase] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editSize, setEditSize] = useState<number>(0);

  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    const user = sessionStorage.getItem("userID");
    if (token && user) {
      console.log("Auth token found:", token);
      setAuthToken(token);
      setUserID(user);
      fetchBases(token);
    } else {
      console.log("No auth token found, redirecting to login...");
      setRequestMessage("No auth token found. Please login.");
      router.push("/login"); // Redirect to login page
    }
  }, []);

  const fetchBases = async (token: string) => {
    try {
      const response = await fetch("http://localhost:8081/bases", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        const filteredBases = result.filter((base: Base) => base.user !== null);
        setBases(filteredBases);
      } else {
        const errorData = await response.json();
        setRequestMessage(errorData.message || "Failed to fetch bases.");
      }
    } catch (error) {
      setRequestMessage("An error occurred. Please try again later.");
      console.error("Fetch bases error:", error);
    }
  };

  const handleCreateBaseClick = async () => {
    if (!authToken) {
      setRequestMessage("No auth token found. Please log in first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/bases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: "test from website",
          size: 25,
          planet: "6641803bb803c40a1eb88bed",
          user: userID,
        }),
      });

      if (response.ok) {
        setRequestMessage("Base created successfully.");
        fetchBases(authToken);
      } else {
        const errorData = await response.json();
        setRequestMessage(errorData.message || "Failed to create base.");
      }
    } catch (error) {
      setRequestMessage("An error occurred. Please try again later.");
      console.error("Create base error:", error);
    }
  };

  const handleEditClick = (base: Base) => {
    setEditingBase(base._id);
    setEditName(base.name);
    setEditSize(base.size);
  };

  const handleUpdateBase = async (id: string) => {
    if (!authToken) {
      setRequestMessage("No auth token found. Please log in first.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/bases/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: editName,
          size: editSize,
        }),
      });

      if (response.ok) {
        setRequestMessage("Base updated successfully.");
        fetchBases(authToken);
        setEditingBase(null);
      } else {
        const errorData = await response.json();
        setRequestMessage(errorData.message || "Failed to update base.");
      }
    } catch (error) {
      setRequestMessage("An error occurred. Please try again later.");
      console.error("Update base error:", error);
    }
  };

  const handleDeleteBase = async (id: string) => {
    if (!authToken) {
      setRequestMessage("No auth token found. Please log in first.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/bases/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        setRequestMessage("Base deleted successfully.");
        fetchBases(authToken);
      } else {
        const errorData = await response.json();
        setRequestMessage(errorData.message || "Failed to delete base.");
      }
    } catch (error) {
      setRequestMessage("An error occurred. Please try again later.");
      console.error("Delete base error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-2">HQ</h1>
      {authToken ? (
        <>
          <p>Welcome! You are logged in!</p>
          <BaseForm handleCreateBaseClick={handleCreateBaseClick} />
          <div className="mt-6">
            <h2 className="text-2xl mb-4">Bases</h2>
            <BaseTable
              bases={bases}
              editingBase={editingBase}
              editName={editName}
              editSize={editSize}
              setEditName={setEditName}
              setEditSize={setEditSize}
              handleEditClick={handleEditClick}
              handleUpdateBase={handleUpdateBase}
              handleDeleteBase={handleDeleteBase}
            />
          </div>
        </>
      ) : (
        <p>You are not logged in. Please login to access the HQ.</p>
      )}
      {requestMessage && (
        <p className="mt-4 text-yellow-500 text-sm">{requestMessage}</p>
      )}
    </div>
  );
};

export default HQ;
