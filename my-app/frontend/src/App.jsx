import { useEffect, useState } from "react";
import "./App.css";
import { ExpenseCategory } from "./components/ExpenseCategory";
import { ExpenseCodes } from "./components/ExpenseCodes";

function App() {
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", is_active: true });
  useEffect(() => {
    fetch("/api/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data));
  }, []);

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };
  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const newCat = await response.json();
      setCategories([...categories, newCat]);
      setFormData({ name: "", is_active: true });
    } catch (err) {
      handleError(err);
    }
  };

  const handleUpdateCategory = async (id, updatedData) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const result = await response.json();
      setCategories(categories.map((c) => (c.id === id ? result : c)));
      if (selectedCategory?.id === id) setSelectedCategory(result);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <>
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Add a Category</h2>
          <form onSubmit={handleAddCategory}>
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
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Category List</h2>

          <table className="table w-full">
            <tbody>
              {categories.map((cat) => (
                <ExpenseCategory
                  key={cat.id}
                  category={cat}
                  isSelected={selectedCategory?.id === cat.id}
                  onSelect={setSelectedCategory}
                  onUpdate={handleUpdateCategory}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCategory && (
        <ExpenseCodes
          selectedCategory={selectedCategory}
          onError={handleError}
        />
      )}
    </>
  );
}

export default App;
