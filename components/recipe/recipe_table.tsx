import React from "react";
import { Recipe } from "../types/recipe_type";

interface RecipesTableProps {
  recipes: Recipe[];
}

const RecipesTable: React.FC<RecipesTableProps> = ({ recipes }) => {
  return (
    <table className="min-w-full bg-gray-800 text-white">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b border-gray-600">ID</th>
          <th className="py-2 px-4 border-b border-gray-600">Name</th>
          <th className="py-2 px-4 border-b border-gray-600">Symbol</th>
          <th className="py-2 px-4 border-b border-gray-600">Time</th>
          <th className="py-2 px-4 border-b border-gray-600">Amount</th>
          <th className="py-2 px-4 border-b border-gray-600">Type</th>
          <th className="py-2 px-4 border-b border-gray-600">Resource</th>
          <th className="py-2 px-4 border-b border-gray-600">Catalog</th>
        </tr>
      </thead>
      <tbody>
        {recipes.map((recipe) => (
          <tr key={recipe._id}>
            <td className="py-2 px-4 border-b border-gray-600">{recipe._id}</td>
            <td className="py-2 px-4 border-b border-gray-600">
              {recipe.name}
            </td>
            <td className="py-2 px-4 border-b border-gray-600">
              {recipe.symbol}
            </td>
            <td className="py-2 px-4 border-b border-gray-600">
              {recipe.time}
            </td>
            <td className="py-2 px-4 border-b border-gray-600">
              {recipe.amount}
            </td>
            <td className="py-2 px-4 border-b border-gray-600">
              {recipe.type}
            </td>
            <td className="py-2 px-4 border-b border-gray-600">
              {recipe.resource.name}
            </td>
            <td className="py-2 px-4 border-b border-gray-600">
              {recipe.catalog.name}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RecipesTable;
