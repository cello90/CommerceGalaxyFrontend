import React from "react";

interface BaseFormProps {
  handleCreateBaseClick: () => void;
}

const BaseForm: React.FC<BaseFormProps> = ({ handleCreateBaseClick }) => {
  return (
    <button
      type="button"
      className="mt-4 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
      onClick={handleCreateBaseClick}
    >
      Create Base
    </button>
  );
};

export default BaseForm;
