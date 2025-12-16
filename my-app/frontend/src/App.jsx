import { useState } from "react";
import "./App.css";

function App() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "", is_active: true });
  const [error, setError] = useState("");

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
              <input
                type="text"
                placeholder="e.g. Travel, Food, Equipment"
                className="input input-bordered w-full input-lg"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <button class="btn btn-primary">Add</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
