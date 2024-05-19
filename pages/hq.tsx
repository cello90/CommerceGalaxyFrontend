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
import { Base } from "../components/types/base_type";
import PlanetsTable from "../components/planets/planet_table";
import BaseSection from "@/components/bases/base_section";
import BuildingSection from "@/components/buildings/building_section";
import RecipeSection from "@/components/recipe/recipe_section";

// types
import { Planet } from "../components/types/planet_type";
import { Building } from "@/components/types/building_type";
import { CatalogItem } from "@/components/types/catalog_type";
import { Recipe } from "@/components/types/recipe_type";

const HQ: React.FC = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState<string | null>(null);
  const [bases, setBases] = useState<Base[]>([]);
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [catalogs, setCatalogs] = useState<CatalogItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);
  const [selectedBaseId, setSelectedBaseId] = useState<string | null>(null);
  const [selectedCatalogId, setselectedCatalogId] = useState<string | null>(
    null
  );
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  );

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
      fetchCatalogs(token);
      fetchRecipes(token);
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

  const fetchCatalogs = async (token: string) => {
    try {
      const response = await fetch(
        "https://api.commercegalaxy.online/catalogs",
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
        setCatalogs(result);
      } else {
        const errorData = await response.json();
        setRequestMessage(errorData.message || "Failed to fetch catalogs.");
      }
    } catch (error) {
      setRequestMessage("An error occurred. Please try again later.");
      console.error("Fetch catalogs error:", error);
    }
  };

  const fetchRecipes = async (token: string) => {
    try {
      const response = await fetch(
        "https://api.commercegalaxy.online/recipes",
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
        setRecipes(result);
      } else {
        const errorData = await response.json();
        setRequestMessage(errorData.message || "Failed to fetch recipes.");
      }
    } catch (error) {
      setRequestMessage("An error occurred. Please try again later.");
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

  const handleSelectBuilding = (buildingId: string) => {
    setSelectedBuildingId((prev) => (prev === buildingId ? null : buildingId));
  };

  const startFabricating = async (recipeId: string) => {
    console.log("Creating fabrication...", recipeId, selectedBuildingId);
    if (!authToken || !selectedBuildingId) {
      setRequestMessage("No auth token found. Please log in first.");
      return;
    }

    try {
      const response = await fetch(
        `https://api.commercegalaxy.online/buildings/${selectedBuildingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            producing: recipeId,
            startTime: new Date().toISOString(),
          }),
        }
      );

      if (response.ok) {
        setRequestMessage("Fabrication created successfully.");
        console.log("Fabrication created successfully.");
      } else {
        const errorData = await response.json();
        setRequestMessage(errorData.message || "Failed to create fabrication.");
        console.log(errorData.message || "Failed to create fabrication.");
      }
    } catch (error) {
      setRequestMessage("An error occurred. Please try again later.");
      console.log("An error occurred. Please try again later.");
    }
  };

  const updateBuilding = async (
    buildingId: string,
    data: Partial<Building>
  ) => {
    if (!authToken || !data.queue) {
      setRequestMessage("No auth token found. Please log in first.");
      return;
    }

    console.log("data", data);
    try {
      const response = await fetch(
        `https://api.commercegalaxy.online/buildings/${buildingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            queue: data.queue.map((r) => r._id),
          }),
        }
      );

      if (response.ok) {
        setRequestMessage("Building updated successfully.");
        console.log("Building updated successfully.");
      } else {
        const errorData = await response.json();
        setRequestMessage(errorData.message || "Failed to update building.");
        console.log(errorData.message || "Failed to update building.");
      }
    } catch (error) {
      setRequestMessage("An error occurred. Please try again later.");
      console.log("An error occurred. Please try again later.");
    }
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
          <BaseSection
            authToken={authToken}
            userID={userID}
            bases={filteredBases}
            onSelectBase={handleSelectBase}
            selectedBaseId={selectedBaseId}
            fetchBases={fetchBases}
            selectedPlanetId={selectedPlanetId}
          />
          <BuildingSection
            authToken={authToken}
            userID={userID}
            buildings={filteredBuildings}
            catalogs={catalogs}
            onSelectBuilding={handleSelectBuilding}
            fetchBuildings={fetchBuildings}
            selectedBaseId={selectedBaseId}
            selectedBuildingId={selectedBuildingId}
            selectedCatalogId={selectedCatalogId}
          />
          <RecipeSection
            authToken={authToken}
            selectedBuildingId={selectedBuildingId}
            fetchRecipes={fetchRecipes}
            recipes={recipes}
            createFabrication={startFabricating}
            buildings={buildings}
            updateBuilding={updateBuilding}
          />
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
