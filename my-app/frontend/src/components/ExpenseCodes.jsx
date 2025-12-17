import { useEffect, useState } from "react";

export const ExpenseCodes = ({ selectedCategory }) => {
  const [error, setError] = useState("");
  const [codes, setCodes] = useState([]);
  const [editingCodeId, setEditingCodeId] = useState(null);
  const [codeForm, setCodeForm] = useState({
    code: "",
    description: "",
    is_active: true,
  });

  useEffect(() => {
    if (selectedCategory) {
      fetch(`/api/categories/${selectedCategory.id}/codes`)
        .then((res) => res.json())
        .then((data) => setCodes(data));
    }
  }, [selectedCategory]);

  const addCode = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/categories/${selectedCategory.id}/codes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(codeForm),
    });
    const newCode = await res.json();
    setCodes([...codes, newCode]);
    setCodeForm({ code: "", description: "", is_active: true });
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
    <div className="card bg-base-100 shadow-xl mt-8">
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}
      <div className="card-body">
        <h2 className="card-title text-xl">
          Expense Codes – {selectedCategory.name}
        </h2>
        <form onSubmit={addCode} className="flex gap-2 mb-4">
          <input
            className="input input-bordered"
            placeholder="Code"
            value={codeForm.code}
            onChange={(e) => setCodeForm({ ...codeForm, code: e.target.value })}
          />
          <input
            className="input input-bordered flex-1"
            placeholder="Description"
            value={codeForm.description}
            onChange={(e) =>
              setCodeForm({ ...codeForm, description: e.target.value })
            }
          />
          <button className="btn btn-primary">Add</button>
        </form>
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
                <td>{code.code}</td>
                <td>{code.description}</td>
                <td className="text-center align-middle">
                  {editingCodeId === code.id ? (
                    <label
                      className="flex justify-center items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
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
                  ) : (
                    <span
                      className={`badge ${
                        code.is_active ? "bg-[#00D394]" : "bg-[#F87171]"
                      } gap-2 py-3 px-4 text-white border-none`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="3"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        {code.is_active ? (
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
                      {code.is_active ? "Active" : "Inactive"}
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
  );
};
