import { useCategoryForm } from "../hooks/useCategoryForm";

export const ExpenseCategory = ({
  category,
  isSelected,
  onSelect,
  onUpdate,
}) => {
  const { isEditing, rowForm, toggleEdit, updateField } = useCategoryForm(
    category,
    onUpdate
  );

  const handleAction = (e) => {
    e.stopPropagation();
    toggleEdit();
  };

  return (
    <tr
      onClick={() => onSelect(category)}
      className={`transition-colors cursor-pointer ${
        isSelected ? "bg-gray-100" : "hover:bg-gray-50"
      }`}
    >
      <td className="py-4 px-6 text-gray-500 text-sm font-mono text-center">
        {category.id}
      </td>
      <td className="py-4 px-6 text-center">
        {isEditing ? (
          <input
            className="input input-bordered input-sm w-full"
            value={rowForm.name}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => updateField("name", e.target.value)}
          />
        ) : (
          <span className="font-bold text-gray-800">{category.name}</span>
        )}
      </td>
      <td className="py-4 px-6">
        <div className="flex justify-center">
          {isEditing ? (
            <label
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                className="toggle toggle-success"
                checked={rowForm.is_active}
                // Use the hook's updateField method
                onChange={(e) => updateField("is_active", e.target.checked)}
              />
              <span className="text-sm">
                {rowForm.is_active ? "Active" : "Inactive"}
              </span>
            </label>
          ) : (
            <div
              className={`badge border-none py-4 px-4 gap-2 font-medium ${
                category.is_active
                  ? "bg-[#00D394] text-white"
                  : "bg-[#F87171] text-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="w-3 h-3"
              >
                {category.is_active ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                )}
              </svg>
              {category.is_active ? "Active" : "Inactive"}
            </div>
          )}
        </div>
      </td>
      <td className="py-4 px-6 text-center">
        <button
          className="btn btn-sm btn-outline bg-white border-gray-300 text-gray-700 gap-2 capitalize"
          onClick={handleAction}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
          {isEditing ? "Save" : "Edit"}
        </button>
      </td>
    </tr>
  );
};
