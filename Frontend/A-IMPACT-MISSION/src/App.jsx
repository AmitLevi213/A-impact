import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:4000/")
      .then((res) => setMessage(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div dir="rtl">
      {" "}
      <h1>📋 בודק רישוי עסקים</h1>
      <p>השרת אומר: {message}</p>
    </div>
  );
}

export default App;
