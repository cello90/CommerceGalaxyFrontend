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
  fetchBuildings: (token: string) => Promise<void>;
  selectedBaseId: string | null;
}

const BuildingSection: React.FC<BuildingSectionProps> = ({
  authToken,
  userID,
  buildings,
  catalogs,
  fetchBuildings,
  selectedBaseId,
}) => {
  const [editingBuilding, setEditingBuilding] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editSize, setEditSize] = useState<number>(0);
  const [editType, setEditType] = useState<string>("");
  const [requestMessage, setRequestMessage] = useState<string | null>(null);

  const handleCreateBuildingClick = async (
    name: string,
    size: number,
    type: string,
    catalogId: string
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
            catalog: catalogId,
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

  const handleEditBuildingClick = (building: Building) => {
    setEditingBuilding(building._id);
    setEditName(building.name);
    setEditSize(building.size);
    setEditType(building.type);
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
      {requestMessage && (
        <p className="mt-4 text-yellow-500 text-sm">{requestMessage}</p>
      )}
    </section>
  );
};

export default BuildingSection;
