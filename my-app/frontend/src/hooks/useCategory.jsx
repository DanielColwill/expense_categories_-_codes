import { useState } from "react";

export const useCategory = (initialCategory, onUpdate) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rowForm, setRowForm] = useState({
    name: initialCategory.name,
    is_active: initialCategory.is_active,
  });

  const toggleEdit = () => {
    if (isEditing) {
      onUpdate(initialCategory.id, rowForm);
    }
    setIsEditing(!isEditing);
  };

  const updateField = (field, value) => {
    setRowForm((prev) => ({ ...prev, [field]: value }));
  };

  return { isEditing, rowForm, toggleEdit, updateField };
};
