import React, { useState } from "react";
import BuildingsTable from "./building_table";
import BuildingForm from "./building_form";
import { Building } from "../types/building_type";
import { CatalogItem } from "../types/catalog_type";

interface BuildingSectionProps {
  authToken: string | null;
  userID: string | null;
  buildings: Building[];
  catalogs: CatalogItem[];
  onSelectBuilding: (buildingId: string) => void;
  fetchBuildings: (token: string) => Promise<void>;
  selectedBuildingId: string | null;
  selectedBaseId: string | null;
  selectedCatalogId: string | null;
}

const BuildingSection: React.FC<BuildingSectionProps> = ({
  authToken,
  userID,
  buildings,
  catalogs,
  fetchBuildings,
  selectedBaseId,
  onSelectBuilding,
  selectedBuildingId,
  selectedCatalogId,
}) => {
  const [requestMessage, setRequestMessage] = useState<string | null>(null);

  const handleCreateBuildingClick = async (selectedCatalogId: string) => {
    console.log(selectedCatalogId);
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
            catalog: selectedCatalogId,
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
    }
  };

  return (
    <section className="bg-gray-800 p-4 rounded">
      <h2 className="text-2xl mb-4">Buildings</h2>
      <BuildingForm
        handleCreateBuildingClick={handleCreateBuildingClick}
        catalogs={catalogs}
      />
      <div className="mt-6">
        <BuildingsTable
          buildings={buildings}
          handleDeleteBuilding={handleDeleteBuilding}
          onSelectBuilding={onSelectBuilding}
          selectedBuildingId={selectedBuildingId}
        />
      </div>
      {requestMessage && (
        <p className="mt-4 text-yellow-500 text-sm">{requestMessage}</p>
      )}
    </section>
  );
};

export default BuildingSection;
