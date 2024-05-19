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
  updateBuilding: (
    buildingId: string,
    data: {
      queue?: string[];
      producing?: string | null;
      startTime?: string | null;
    }
  ) => Promise<void>;
}

const RecipeSection: React.FC<RecipeSectionProps> = ({
  authToken,
  selectedBuildingId,
  fetchRecipes,
  recipes,
  createFabrication,
  buildings,
  updateBuilding,
}) => {
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState<string | null>(null);
  const [productionQueue, setProductionQueue] = useState<Recipe[]>([]);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [currentSelectedBuilding, setCurrentSelectedBuilding] =
    useState<Building | null>(null);
  const [remainingTime, setRemainingTime] = useState<string | null>(null);

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
        setProductionQueue(selectedBuilding.queue || []);
        setCurrentRecipe(selectedBuilding.producing || null);
        setCurrentSelectedBuilding(selectedBuilding);

        // Set up the countdown timer
        const updateRemainingTime = () => {
          if (selectedBuilding.producing && selectedBuilding.startTime) {
            const startTime = new Date(selectedBuilding.startTime).getTime();
            const endTime = startTime + selectedBuilding.producing.time * 1000;
            const currentTime = Date.now();
            const timeLeft = Math.max(endTime - currentTime, 0);

            let timeString;
            if (timeLeft >= 86400000) {
              // More than a day
              timeString = (timeLeft / 86400000).toFixed(1) + " days";
            } else if (timeLeft >= 3600000) {
              // More than an hour
              timeString = (timeLeft / 3600000).toFixed(1) + " hours";
            } else {
              // Less than an hour
              timeString = (timeLeft / 60000).toFixed(1) + " minutes";
            }

            setRemainingTime(timeString);
          } else {
            setRemainingTime(null);
          }
        };

        updateRemainingTime();
        const interval = setInterval(updateRemainingTime, 1000);
        return () => clearInterval(interval);
      }
    } else {
      setFilteredRecipes([]);
      setProductionQueue([]);
      setCurrentRecipe(null);
      setCurrentSelectedBuilding(null);
      setRemainingTime(null);
    }
  }, [selectedBuildingId, recipes, buildings]);

  const handleAddRecipe = async () => {
    if (!selectedBuildingId || !selectedRecipeId) return;

    const selectedRecipe = recipes.find(
      (recipe) => recipe._id === selectedRecipeId
    );
    if (selectedRecipe) {
      const updatedQueue = [...productionQueue, selectedRecipe];
      setProductionQueue(updatedQueue);
      await updateBuilding(selectedBuildingId, {
        queue: updatedQueue.map((r) => r._id),
      });
    }
  };

  const handleDeleteCurrentRecipe = async () => {
    if (!selectedBuildingId) return;

    await updateBuilding(selectedBuildingId, {
      producing: null,
      startTime: null,
    });
    setCurrentRecipe(null);
    setRemainingTime(null);
  };

  const moveQueueItem = async (index: number, direction: "up" | "down") => {
    if (!selectedBuildingId) return;
    const updatedQueue = [...productionQueue];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex >= 0 && swapIndex < updatedQueue.length) {
      [updatedQueue[index], updatedQueue[swapIndex]] = [
        updatedQueue[swapIndex],
        updatedQueue[index],
      ];
      setProductionQueue(updatedQueue);
      await updateBuilding(selectedBuildingId, {
        queue: updatedQueue.map((r) => r._id),
      });
    }
  };

  const handleRemoveQueueItem = async (index: number) => {
    if (!selectedBuildingId) return;
    const updatedQueue = productionQueue.filter((_, i) => i !== index);
    setProductionQueue(updatedQueue);
    await updateBuilding(selectedBuildingId, {
      queue: updatedQueue.map((r) => r._id),
    });
  };

  const selectedRecipe = filteredRecipes.find(
    (recipe) => recipe._id === selectedRecipeId
  );

  return (
    <section className="bg-gray-800 p-4 rounded">
      <h2 className="text-2xl mb-4">Recipes</h2>

      <div className="mb-4">
        <label htmlFor="recipeDropdown" className="block mb-2">
          Select Recipe to Add:
        </label>
        <select
          id="recipeDropdown"
          value={selectedRecipeId || ""}
          onChange={(e) => setSelectedRecipeId(e.target.value)}
          className="px-4 py-2 bg-gray-700 text-white rounded"
        >
          <option value="" disabled>
            Select a recipe
          </option>
          {filteredRecipes.map((recipe) => (
            <option key={recipe._id} value={recipe._id}>
              {recipe.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddRecipe}
          className="ml-4 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
        >
          Add Recipe
        </button>
      </div>

      {selectedRecipe && <RecipesTable recipes={[selectedRecipe]} />}
      <br />

      <h3 className="text-xl mb-2">Currently Producing:</h3>
      {currentRecipe ? (
        <div className="mb-4 flex items-center">
          <p className="mr-4">{currentRecipe.name}</p>
          <p className="mr-4">
            Time Remaining: {remainingTime !== null ? remainingTime : "N/A"}
          </p>
          <button
            onClick={handleDeleteCurrentRecipe}
            className="px-2 py-1 bg-red-600 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      ) : (
        <p className="mb-4">None</p>
      )}

      <h3 className="text-xl mb-2">Production Queue:</h3>
      {productionQueue.length > 0 ? (
        <ul className="mb-4">
          {productionQueue.map((recipe, index) => (
            <li
              key={`${recipe._id}-${index}`}
              className="flex items-center mb-2"
            >
              <p className="mr-4">{recipe.name}</p>
              <button
                onClick={() => moveQueueItem(index, "up")}
                className="px-2 py-1 bg-blue-600 rounded hover:bg-blue-700 mr-2"
              >
                Up
              </button>
              <button
                onClick={() => moveQueueItem(index, "down")}
                className="px-2 py-1 bg-blue-600 rounded hover:bg-blue-700 mr-2"
              >
                Down
              </button>
              <button
                onClick={() => handleRemoveQueueItem(index)}
                className="px-2 py-1 bg-red-600 rounded hover:bg-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-4">No items in queue</p>
      )}
      {requestMessage && (
        <p className="mt-4 text-yellow-500 text-sm">{requestMessage}</p>
      )}
    </section>
  );
};

export default RecipeSection;
