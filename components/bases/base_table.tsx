import React from "react";
import { Base } from "./base_type";
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
          <BaseRow
            key={base._id}
            base={base}
            editingBase={editingBase}
            editName={editName}
            editSize={editSize}
            setEditName={setEditName}
            setEditSize={setEditSize}
            handleEditClick={handleEditClick}
            handleUpdateBase={handleUpdateBase}
            handleDeleteBase={handleDeleteBase}
          />
        ))}
      </tbody>
    </table>
  );
};

export default BaseTable;
