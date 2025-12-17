import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "", is_active: true });
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

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
      // crete new category
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
                    <tr key={category.id} className="hover">
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
                        {category.is_active ? (
                          <span className="badge badge-success badge-lg gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              className="inline-block w-4 h-4 stroke-current"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg>
                            Active
                          </span>
                        ) : (
                          <span className="badge badge-error badge-lg gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              className="inline-block w-4 h-4 stroke-current"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              ></path>
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
      </div>
    </>
  );
}

export default App;
