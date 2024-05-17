import React from "react";
import { Building } from "../types/building_type";

interface BuildingsTableProps {
  buildings: Building[];
  handleDeleteBuilding: (id: string) => void;
}

const BuildingsTable: React.FC<BuildingsTableProps> = ({
  buildings,
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
              {building.catalog.name}
            </td>
            <td className="py-2 px-4 border-b border-gray-600">
              {building.catalog.size}
            </td>
            <td className="py-2 px-4 border-b border-gray-600">
              {building.catalog.type}
            </td>
            <td className="py-2 px-4 border-b border-gray-600">
              {building.base.name}
            </td>
            <td className="py-2 px-4 border-b border-gray-600">
              <button
                onClick={() => handleDeleteBuilding(building._id)}
                className="px-2 py-1 bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BuildingsTable;
