import React from "react";
import { Planet } from "../types/planet_type";

interface PlanetsTableProps {
  planets: Planet[];
  onSelectPlanet: (planetId: string) => void;
  selectedPlanetId: string | null;
}

const PlanetsTable: React.FC<PlanetsTableProps> = ({
  planets,
  onSelectPlanet,
  selectedPlanetId,
}) => {
  return (
    <table className="min-w-full bg-gray-800 text-white">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b border-gray-600">ID</th>
          <th className="py-2 px-4 border-b border-gray-600">Name</th>
        </tr>
      </thead>
      <tbody>
        {planets.map((planet) => (
          <tr
            key={planet._id}
            onClick={() => onSelectPlanet(planet._id)}
            className={`cursor-pointer ${
              selectedPlanetId === planet._id ? "bg-gray-700" : ""
            }`}
          >
            <td className="py-2 px-4 border-b border-gray-600">{planet._id}</td>
            <td className="py-2 px-4 border-b border-gray-600">
              {planet.name}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PlanetsTable;
