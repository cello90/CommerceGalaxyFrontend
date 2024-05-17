import React from "react";
import { Base } from "../types/base_type";
import BaseRow from "./base_row";

interface BaseTableProps {
  bases: Base[];
  editingBase: string | null;
  editName: string;
  editSize: number;
  setEditName: (name: string) => void;
  setEditSize: (size: number) => void;
  handleEditClick: (base: Base) => void;
  handleUpdateBase: (id: string) => void;
  handleDeleteBase: (id: string) => void;
  onSelectBase: (baseId: string) => void;
  selectedBaseId: string | null;
}

const BaseTable: React.FC<BaseTableProps> = ({
  bases,
  editingBase,
  editName,
  editSize,
  setEditName,
  setEditSize,
  handleEditClick,
  handleUpdateBase,
  handleDeleteBase,
  onSelectBase,
  selectedBaseId,
}) => {
  return (
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
          <tr
            key={base._id}
            onClick={() => onSelectBase(base._id)}
            className={`cursor-pointer ${
              selectedBaseId === base._id ? "bg-gray-700" : ""
            }`}
          >
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
            <td className="py-2 px-4 border-b border-gray-600">
              {base.planet.name}
            </td>
            <td className="py-2 px-4 border-b border-gray-600">
              {base.user?.username}
            </td>
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
  );
};

export default BaseTable;
