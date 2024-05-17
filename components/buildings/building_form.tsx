import React, { useState, useEffect } from "react";
import { CatalogItem } from "../types/catalog_type";

interface BuildingFormProps {
  handleCreateBuildingClick: (
    name: string,
    size: number,
    type: string,
    catalogId: string
  ) => void;
  catalogs: CatalogItem[];
}

const BuildingForm: React.FC<BuildingFormProps> = ({
  handleCreateBuildingClick,
  catalogs,
}) => {
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>("");

  useEffect(() => {
    if (catalogs.length > 0) {
      setSelectedCatalogId(catalogs[0]._id);
    }
  }, [catalogs]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const selectedCatalog = catalogs.find(
      (catalog) => catalog._id === selectedCatalogId
    );
    if (selectedCatalog) {
      handleCreateBuildingClick(
        selectedCatalog.name,
        selectedCatalog.size,
        selectedCatalog.type,
        selectedCatalogId
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300">
          Select Catalog Item
        </label>
        <select
          value={selectedCatalogId}
          onChange={(e) => setSelectedCatalogId(e.target.value)}
          className="mt-1 px-4 py-2 bg-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {catalogs.map((catalog) => (
            <option key={catalog._id} value={catalog._id}>
              {catalog.name} (Size: {catalog.size}, Type: {catalog.type})
            </option>
          ))}
        </select>
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
