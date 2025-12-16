import { useState } from "react";
import "./App.css";
import { useEffect } from "react";

function App() {
  const [testMessage, setTestMessage] = useState();
  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => setTestMessage(data.message));
  }, []);
  return (
    <>
      <div>{testMessage}</div>

      <button className="btn">press here</button>
    </>
  );
}

export default App;
