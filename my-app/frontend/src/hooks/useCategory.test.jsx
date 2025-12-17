import { renderHook, act } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { useCategory } from "./useCategory";

describe("useCategory Hook", () => {
  const mockCategory = { id: 1, name: "CategoryName", is_active: true };

  test("should update form data and trigger onUpdate on save", () => {
    const onUpdate = vi.fn();

    const { result } = renderHook(() => useCategory(mockCategory, onUpdate));

    expect(result.current.isEditing).toBe(false);
    expect(result.current.rowForm.name).toBe("CategoryName");

    act(() => {
      result.current.toggleEdit();
    });
    expect(result.current.isEditing).toBe(true);

    // Update the field
    act(() => {
      result.current.updateField("name", "CategoryNameUpdate");
    });
    expect(result.current.rowForm.name).toBe("CategoryNameUpdate");

    act(() => {
      result.current.toggleEdit();
    });

    expect(onUpdate).toHaveBeenCalledWith(1, {
      name: "CategoryNameUpdate",
      is_active: true,
    });
    expect(result.current.isEditing).toBe(false);
  });
});
