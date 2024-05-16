import React from "react";
import { Building } from "./building_type";

interface BuildingsTableProps {
  buildings: Building[];
  editingBuilding: string | null;
  editName: string;
  editSize: number;
  editType: string;
  setEditName: (name: string) => void;
  setEditSize: (size: number) => void;
  setEditType: (type: string) => void;
  handleEditClick: (building: Building) => void;
  handleUpdateBuilding: (id: string) => void;
  handleDeleteBuilding: (id: string) => void;
}

const BuildingsTable: React.FC<BuildingsTableProps> = ({
  buildings,
  editingBuilding,
  editName,
  editSize,
  editType,
  setEditName,
  setEditSize,
  setEditType,
  handleEditClick,
  handleUpdateBuilding,
  handleDeleteBuilding,
}) => {
  return (
    <table className="min-w-full bg-gray-800 text-white">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b border-gray-600">ID</th>
          <th className="py-2 px-4 border-b border-gray-600">Name</th>
          <th className="py-2 px-4 border-b border-gray-600">Size</th>
          <th className="py-2 px-4 border-b border-gray-600">Type</th>
          <th className="py-2 px-4 border-b border-gray-600">Base</th>
          <th className="py-2 px-4 border-b border-gray-600">Actions</th>
        </tr>
      </thead>
      <tbody>
        {buildings.map((building) => (
          <tr key={building._id}>
            <td className="py-2 px-4 border-b border-gray-600">
              {building._id}
            </td>
            <td className="py-2 px-4 border-b border-gray-600">
              {editingBuilding === building._id ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="px-2 py-1 bg-gray-700 rounded"
                />
              ) : (
                building.name
              )}
            </td>
            <td className="py-2 px-4 border-b border-gray-600">
              {editingBuilding === building._id ? (
                <input
                  type="number"
                  value={editSize}
                  onChange={(e) => setEditSize(Number(e.target.value))}
                  className="px-2 py-1 bg-gray-700 rounded"
                />
              ) : (
                building.size
              )}
            </td>
            <td className="py-2 px-4 border-b border-gray-600">
              {editingBuilding === building._id ? (
                <input
                  type="text"
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  className="px-2 py-1 bg-gray-700 rounded"
                />
              ) : (
                building.type
              )}
            </td>
            <td className="py-2 px-4 border-b border-gray-600">
              {building.base.name}
            </td>
            <td className="py-2 px-4 border-b border-gray-600">
              {editingBuilding === building._id ? (
                <button
                  onClick={() => handleUpdateBuilding(building._id)}
                  className="px-2 py-1 bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  ✓
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleEditClick(building)}
                    className="px-2 py-1 bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBuilding(building._id)}
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
  );
};

export default BuildingsTable;
