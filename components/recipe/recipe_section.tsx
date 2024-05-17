import React, { useState, useEffect } from "react";
import RecipesTable from "./recipe_table";
import { Recipe } from "../types/recipe_type";
import { Building } from "../types/building_type";

interface RecipeSectionProps {
  authToken: string | null;
  selectedBuildingId: string | null;
  fetchRecipes: (token: string) => Promise<void>;
  recipes: Recipe[];
  createFabrication: (recipeId: string) => void;
  buildings: Building[];
}

const RecipeSection: React.FC<RecipeSectionProps> = ({
  authToken,
  selectedBuildingId,
  fetchRecipes,
  recipes,
  createFabrication,
  buildings,
}) => {
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [requestMessage, setRequestMessage] = useState<string | null>(null);

  useEffect(() => {
    if (authToken) {
      fetchRecipes(authToken);
    }
  }, [authToken]);

  useEffect(() => {
    if (selectedBuildingId) {
      const selectedBuilding = buildings.find(
        (building) => building._id === selectedBuildingId
      );
      if (selectedBuilding) {
        setFilteredRecipes(
          recipes.filter(
            (recipe) => recipe.catalog._id === selectedBuilding.catalog._id
          )
        );
      }
    } else {
      setFilteredRecipes([]);
    }
  }, [selectedBuildingId, recipes, buildings]);

  return (
    <section className="bg-gray-800 p-4 rounded">
      <h2 className="text-2xl mb-4">Recipes</h2>
      <RecipesTable
        recipes={filteredRecipes}
        createFabrication={createFabrication}
      />
      {requestMessage && (
        <p className="mt-4 text-yellow-500 text-sm">{requestMessage}</p>
      )}
    </section>
  );
};

export default RecipeSection;
