import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Import useRouter from next/router
import {
  FaSpaceShuttle,
  FaUserTie,
  FaCog,
  FaComments,
  FaEnvelope,
  FaBuilding,
} from "react-icons/fa";
import BaseTable from "../components/bases/base_table";
import BaseForm from "../components/bases/base_form";
import { Base } from "../components/bases/base_type";
import PlanetsTable from "../components/planets/planet_table";
import { Planet } from "../components/planets/planet_type";
import BuildingsTable from "@/components/buildings/building_table";
import BuildingForm from "@/components/buildings/building_form";
import { Building } from "@/components/buildings/building_type";

const HQ: React.FC = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState<string | null>(null);
  const [bases, setBases] = useState<Base[]>([]);
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);
  const [selectedBaseId, setSelectedBaseId] = useState<string | null>(null);
  const [editingBase, setEditingBase] = useState<string | null>(null);
  const [editingBuilding, setEditingBuilding] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editSize, setEditSize] = useState<number>(0);
  const [editType, setEditType] = useState<string>("");

  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    const user = sessionStorage.getItem("userID");
    if (token && user) {
      console.log("Auth token found:", token);
      setAuthToken(token);
      setUserID(user);
      fetchBases(token);
      fetchPlanets(token);
      fetchBuildings(token);
    } else {
      console.log("No auth token found, redirecting to login...");
      setRequestMessage("No auth token found. Please login.");
      router.push("/login"); // Redirect to login page
    }
  }, []);

  const fetchPlanets = async (token: string) => {
    try {
      const response = await fetch(
        "https://api.commercegalaxy.online/planets",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setPlanets(result);
      } else {
        const errorData = await response.json();
        setRequestMessage(errorData.message || "Failed to fetch planets.");
      }
    } catch (error) {
      setRequestMessage("An error occurred. Please try again later.");
      console.error("Fetch planets error:", error);
    }
  };

  const fetchBases = async (token: string) => {
    try {
      const response = await fetch("https://api.commercegalaxy.online/bases", {
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

  const fetchBuildings = async (token: string) => {
    try {
      const response = await fetch(
        "https://api.commercegalaxy.online/buildings",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setBuildings(result);
      } else {
        const errorData = await response.json();
        setRequestMessage(errorData.message || "Failed to fetch buildings.");
      }
    } catch (error) {
      setRequestMessage("An error occurred. Please try again later.");
      console.error("Fetch buildings error:", error);
    }
  };

  const handleCreateBaseClick = async () => {
    if (!authToken || !selectedPlanetId) {
      setRequestMessage(
        "No auth token found or selected ID was null. Please log in first or select a planet."
      );
      return;
    }

    try {
      const response = await fetch("https://api.commercegalaxy.online/bases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: "test from website",
          size: 25,
          planet: selectedPlanetId,
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

  const handleCreateBuildingClick = async (
    name: string,
    size: number,
    type: string
  ) => {
    if (!authToken || !selectedBaseId) {
      setRequestMessage(
        "No auth token found or no base selected. Please log in and select a base first."
      );
      return;
    }

    try {
      const response = await fetch(
        "https://api.commercegalaxy.online/buildings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            name,
            size,
            type,
            base: selectedBaseId,
          }),
        }
      );

      if (response.ok) {
        setRequestMessage("Building created successfully.");
        fetchBuildings(authToken);
      } else {
        const errorData = await response.json();
        setRequestMessage(errorData.message || "Failed to create building.");
      }
    } catch (error) {
      setRequestMessage("An error occurred. Please try again later.");
      console.error("Create building error:", error);
    }
  };

  const handleEditBaseClick = (base: Base) => {
    setEditingBase(base._id);
    setEditName(base.name);
    setEditSize(base.size);
  };

  const handleEditBuildingClick = (building: Building) => {
    setEditingBuilding(building._id);
    setEditName(building.name);
    setEditSize(building.size);
    setEditType(building.type);
  };

  const handleUpdateBase = async (id: string) => {
    if (!authToken) {
      setRequestMessage("No auth token found. Please log in first.");
      return;
    }

    try {
      const response = await fetch(
        `https://api.commercegalaxy.online/bases/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            name: editName,
            size: editSize,
          }),
        }
      );

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

  const handleUpdateBuilding = async (id: string) => {
    if (!authToken) {
      setRequestMessage("No auth token found. Please log in first.");
      return;
    }

    try {
      const response = await fetch(
        `https://api.commercegalaxy.online/buildings/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            name: editName,
            size: editSize,
            type: editType,
          }),
        }
      );

      if (response.ok) {
        setRequestMessage("Building updated successfully.");
        fetchBuildings(authToken);
        setEditingBuilding(null);
      } else {
        const errorData = await response.json();
        setRequestMessage(errorData.message || "Failed to update building.");
      }
    } catch (error) {
      setRequestMessage("An error occurred. Please try again later.");
      console.error("Update building error:", error);
    }
  };

  const handleDeleteBase = async (id: string) => {
    if (!authToken) {
      setRequestMessage("No auth token found. Please log in first.");
      return;
    }

    try {
      const response = await fetch(
        `https://api.commercegalaxy.online/bases/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

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

  const handleDeleteBuilding = async (id: string) => {
    if (!authToken) {
      setRequestMessage("No auth token found. Please log in first.");
      return;
    }

    try {
      const response = await fetch(
        `https://api.commercegalaxy.online/buildings/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.ok) {
        setRequestMessage("Building deleted successfully.");
        fetchBuildings(authToken);
      } else {
        const errorData = await response.json();
        setRequestMessage(errorData.message || "Failed to delete building.");
      }
    } catch (error) {
      setRequestMessage("An error occurred. Please try again later.");
      console.error("Delete building error:", error);
    }
  };

  const handleSelectPlanet = (planetId: string) => {
    setSelectedPlanetId((prevSelectedPlanetId) =>
      prevSelectedPlanetId === planetId ? null : planetId
    );
  };

  const handleSelectBase = (baseId: string) => {
    setSelectedBaseId((prevSelectedBaseId) =>
      prevSelectedBaseId === baseId ? null : baseId
    );
  };

  const filteredBases = selectedPlanetId
    ? bases.filter((base) => base.planet._id === selectedPlanetId)
    : bases;

  const filteredBuildings = selectedBaseId
    ? buildings.filter((building) => building.base._id === selectedBaseId)
    : buildings;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <FaSpaceShuttle className="text-3xl text-white mr-2" />
          <h1 className="text-3xl font-bold">Commerce Galaxy</h1>
        </div>
        <div className="flex items-center">
          <FaCog className="text-2xl text-white" />
        </div>
      </header>

      <div className="flex-grow flex">
        <main className="container mx-auto px-4 py-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
          <section className="bg-gray-800 p-4 rounded">
            <h2 className="text-2xl mb-4">Planets</h2>
            <PlanetsTable
              planets={planets}
              onSelectPlanet={handleSelectPlanet}
              selectedPlanetId={selectedPlanetId}
            />
          </section>
          <section className="bg-gray-800 p-4 rounded">
            {authToken ? (
              <>
                <BaseForm handleCreateBaseClick={handleCreateBaseClick} />
                <div className="mt-6">
                  <h2 className="text-2xl mb-4">Bases</h2>
                  <BaseTable
                    bases={filteredBases}
                    editingBase={editingBase}
                    editName={editName}
                    editSize={editSize}
                    setEditName={setEditName}
                    setEditSize={setEditSize}
                    handleEditClick={handleEditBaseClick}
                    handleUpdateBase={handleUpdateBase}
                    handleDeleteBase={handleDeleteBase}
                    onSelectBase={handleSelectBase} // Add onSelectBase prop
                    selectedBaseId={selectedBaseId} // Add selectedBaseId prop
                  />
                </div>
              </>
            ) : (
              <p>You are not logged in. Please login to access the HQ.</p>
            )}
            {requestMessage && (
              <p className="mt-4 text-yellow-500 text-sm">{requestMessage}</p>
            )}
          </section>
          <section className="bg-gray-800 p-4 rounded">
            <h2 className="text-2xl mb-4">Buildings</h2>
            <BuildingForm
              handleCreateBuildingClick={handleCreateBuildingClick}
            />
            <div className="mt-6">
              <BuildingsTable
                buildings={filteredBuildings}
                editingBuilding={editingBuilding}
                editName={editName}
                editSize={editSize}
                editType={editType}
                setEditName={setEditName}
                setEditSize={setEditSize}
                setEditType={setEditType}
                handleEditClick={handleEditBuildingClick}
                handleUpdateBuilding={handleUpdateBuilding}
                handleDeleteBuilding={handleDeleteBuilding}
              />
            </div>
          </section>
          <section className="bg-gray-800 p-4 rounded">Section 4</section>
        </main>

        <div className="w-16 bg-gray-700 flex flex-col items-center py-4">
          <FaUserTie className="text-4xl text-white mb-4" />
          <FaEnvelope className="text-4xl text-white mb-4" />
          <FaComments className="text-4xl text-white mb-4" />
          <FaBuilding className="text-4xl text-white mb-4" />
        </div>
      </div>
    </div>
  );
};

export default HQ;
