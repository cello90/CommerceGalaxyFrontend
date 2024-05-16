import React, { useState } from "react";

interface BuildingFormProps {
  handleCreateBuildingClick: (name: string, size: number, type: string) => void;
}

const BuildingForm: React.FC<BuildingFormProps> = ({
  handleCreateBuildingClick,
}) => {
  const [name, setName] = useState("");
  const [size, setSize] = useState(0);
  const [type, setType] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleCreateBuildingClick(name, size, type);
    setName("");
    setSize(0);
    setType("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 px-4 py-2 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300">Size</label>
        <input
          type="number"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="mt-1 px-4 py-2 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300">Type</label>
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-1 px-4 py-2 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add Building
      </button>
    </form>
  );
};

export default BuildingForm;
