import React, { useState } from "react";
import BaseTable from "./base_table";
import BaseForm from "./base_form";
import { Base } from "../types/base_type";

interface BaseSectionProps {
  authToken: string | null;
  userID: string | null;
  bases: Base[];
  onSelectBase: (baseId: string) => void;
  selectedBaseId: string | null;
  fetchBases: (token: string) => Promise<void>;
}

const BaseSection: React.FC<BaseSectionProps> = ({
  authToken,
  userID,
  bases,
  onSelectBase,
  selectedBaseId,
  fetchBases,
}) => {
  const [editingBase, setEditingBase] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editSize, setEditSize] = useState<number>(0);
  const [requestMessage, setRequestMessage] = useState<string | null>(null);

  const handleCreateBaseClick = async (name: string, size: number) => {
    if (!authToken) {
      setRequestMessage("No auth token found. Please log in first.");
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
          name,
          size,
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
    }
  };

  return (
    <section className="bg-gray-800 p-4 rounded">
      <BaseForm
        handleCreateBaseClick={() =>
          handleCreateBaseClick("Base created from the web", 25)
        }
      />
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
          onSelectBase={onSelectBase}
          selectedBaseId={selectedBaseId}
        />
      </div>
    </section>
  );
};

export default BaseSection;
