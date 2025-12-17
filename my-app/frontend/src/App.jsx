import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "", is_active: true });
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [codes, setCodes] = useState([]);
  const [codeForm, setCodeForm] = useState({
    code: "",
    description: "",
    is_active: true,
  });

  const [editingCodeId, setEditingCodeId] = useState(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data));
  }, []);

  const handleEdit = async (category) => {
    if (editingId !== category.id) {
      setFormData({ name: category.name, is_active: category.is_active });
      setEditingId(category.id);
      return;
    }
    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const updatedCategory = await response.json();

      setCategories(
        categories.map((cat) =>
          cat.id === category.id ? updatedCategory : cat
        )
      );

      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed");
      }

      const newCategory = await response.json();
      setCategories([...categories, newCategory]);

      setFormData({ name: "", is_active: true });
    } catch (err) {
      setError(err.message);
    }
  };

  const selectCategory = async (category) => {
    setSelectedCategory(category);
    setCodes([]);

    try {
      const res = await fetch(`/api/categories/${category.id}/codes`);
      const data = await res.json();
      setCodes(data);
    } catch (err) {
      setError("Failed to load expense codes");
    }
  };

  const addCode = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/categories/${selectedCategory.id}/codes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(codeForm),
      });

      const newCode = await res.json();
      setCodes([...codes, newCode]);

      setCodeForm({ code: "", description: "", is_active: true });
    } catch {
      setError("Failed to add code");
    }
  };

  const saveCode = async (code) => {
    try {
      const res = await fetch(`/api/codes/${code.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: code.description,
          is_active: code.is_active,
        }),
      });

      const updated = await res.json();

      setCodes(codes.map((c) => (c.id === code.id ? updated : c)));

      setEditingCodeId(null);
    } catch {
      setError("Failed to update code");
    }
  };

  return (
    <>
      {/* Form Card */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title">Add or Update Category</h2>

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-control w-full m-3">
              <label className="label">
                <span className="label-text text-base font-semibold">
                  Category Name
                </span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="add a category"
                  className="input input-bordered flex-1 input-lg"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <button className="btn btn-primary btn-lg">Add</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* Categories List */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-8">
          <h2 className="card-title text-2xl mb-6">Category List</h2>

          {categories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No categories.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="text-base text-center w-1/4">ID</th>
                    <th className="text-base text-center w-1/4">Name</th>
                    <th className="text-base text-center w-1/4">Status</th>
                    <th className="text-base text-center w-1/4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr
                      key={category.id}
                      className={`hover cursor-pointer ${
                        selectedCategory?.id === category.id
                          ? "bg-base-200"
                          : ""
                      }`}
                      onClick={() => selectCategory(category)}
                    >
                      {" "}
                      <td className="font-mono text-center align-middle">
                        {category.id}
                      </td>
                      <td className="font-semibold text-center align-middle">
                        {editingId === category.id ? (
                          <input
                            type="text"
                            className="input input-bordered input-sm w-full"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                          />
                        ) : (
                          category.name
                        )}
                      </td>
                      <td className="text-center align-middle">
                        {editingId === category.id ? (
                          <label className="flex justify-center items-center gap-2">
                            <input
                              type="checkbox"
                              className="toggle toggle-success"
                              checked={formData.is_active}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  is_active: e.target.checked,
                                })
                              }
                            />
                            <span className="text-sm font-medium">
                              {formData.is_active ? "Active" : "Inactive"}
                            </span>
                          </label>
                        ) : category.is_active ? (
                          <span className="badge badge-success gap-2 py-3 px-4 text-white border-none">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="3"
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12.75l6 6 9-13.5"
                              />
                            </svg>
                            Active
                          </span>
                        ) : (
                          <span className="badge badge-error gap-2 inline-flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              className="inline-block w-3 h-3 stroke-current"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="text-center align-middle">
                        <button
                          onClick={() => handleEdit(category)}
                          className="btn btn-outline btn-sm inline-flex items-center gap-2"
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
                          {editingId === category.id ? "Save" : "Edit"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {selectedCategory && (
          <div className="card bg-base-100 shadow-xl mt-8">
            <div className="card-body">
              <h2 className="card-title text-xl">
                Expense Codes – {selectedCategory.name}
              </h2>
              {/* Add Code */}
              <form onSubmit={addCode} className="flex gap-2 mb-4">
                <input
                  className="input input-bordered"
                  placeholder="Code"
                  value={codeForm.code}
                  onChange={(e) =>
                    setCodeForm({ ...codeForm, code: e.target.value })
                  }
                  required
                />
                <input
                  className="input input-bordered flex-1"
                  placeholder="Description"
                  value={codeForm.description}
                  onChange={(e) =>
                    setCodeForm({
                      ...codeForm,
                      description: e.target.value,
                    })
                  }
                />
                <button className="btn btn-primary">Add</button>
              </form>
              {/* Codes Table */}
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {codes.map((code) => (
                      <tr key={code.id}>
                        <td className="font-mono">{code.code}</td>

                        <td>
                          {editingCodeId === code.id ? (
                            <input
                              className="input input-sm input-bordered w-full"
                              value={code.description || ""}
                              onChange={(e) =>
                                setCodes(
                                  codes.map((c) =>
                                    c.id === code.id
                                      ? { ...c, description: e.target.value }
                                      : c
                                  )
                                )
                              }
                            />
                          ) : (
                            code.description || "—"
                          )}
                        </td>
                        <td>
                          {editingCodeId === code.id ? (
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                className="toggle toggle-success"
                                checked={code.is_active}
                                onChange={(e) =>
                                  setCodes(
                                    codes.map((c) =>
                                      c.id === code.id
                                        ? { ...c, is_active: e.target.checked }
                                        : c
                                    )
                                  )
                                }
                              />
                              <span className="text-sm font-medium">
                                {code.is_active ? "Active" : "Inactive"}
                              </span>
                            </label>
                          ) : code.is_active ? (
                            <span className="badge badge-success gap-2 py-3 px-4 text-white border-none">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="3"
                                stroke="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M4.5 12.75l6 6 9-13.5"
                                />
                              </svg>
                              Active
                            </span>
                          ) : (
                            <span className="badge badge-error gap-2 inline-flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block w-3 h-3 stroke-current"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Inactive
                            </span>
                          )}
                        </td>

                        <td>
                          {editingCodeId === code.id ? (
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => saveCode(code)}
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              className="btn btn-sm btn-outline"
                              onClick={() => setEditingCodeId(code.id)}
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
