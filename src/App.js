import React, { useState } from "react";
import "./FetchApi.css";

export default function FetchApi() {
  const [serverUrl, setServerUrl] = useState("");
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const url = `${serverUrl}/admin/user?id=${userId}&token=${token}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const userData = await response.json();
      console.log("API Response:", userData); // Debug line
      setUserData(userData);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    }
  };

  const renderAttributes = (data) => {
    if (!data) return null;

    let nullAttributes = [];

    const rows = Object.entries(data).map(([key, value]) => {
      console.log("Processing key:", key, "value:", value); // Debug line

      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        return (
          <React.Fragment key={key}>
            <tr>
              <td colSpan="2" style={{ fontWeight: 'bold', backgroundColor: '#f1f1f1', padding: '10px' }}>{key.toUpperCase()}</td>
            </tr>
            {renderAttributes(value)}
          </React.Fragment>
        );
      } else {
        if (value === null) {
          nullAttributes.push(key);
        }
        return (
          <tr key={key}>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{key}</td>
            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{value === null ? "null" : JSON.stringify(value)}</td>
          </tr>
        );
      }
    });

    console.log("Attributes with null values:", nullAttributes);

    return rows;
  };

  return (
    <div className="container center-table">
      <h1 style={{ textAlign: "center", fontWeight: 'bold', marginBottom: '20px' }}>INTERNSHIP PROJECT</h1>
      <form className="input-form">
        <div className="input-group">
          <label>
            Server URL:
            <input
              type="text"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              style={{ padding: '10px', margin: '10px', width: '100%' }}
            />
          </label>
        </div>
        <div className="input-group">
          <label>
            Token:
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              style={{ padding: '10px', margin: '10px', width: '100%' }}
            />
          </label>
        </div>
        <div className="input-group">
          <label>
            User ID:
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              style={{ padding: '10px', margin: '10px', width: '100%' }}
            />
          </label>
        </div>
      </form>
      <div className="fetch-button">
        <button
          onClick={fetchData}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#009879', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          FETCH
        </button>
      </div>
      <br />
      {error && <p style={{ color: 'red' }}>{`Error: ${error}`}</p>}
      {userData && (
        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0', fontSize: '1em', minWidth: '400px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.15)' }}>
          <tbody>
            {Object.keys(userData).map((category) => (
              <React.Fragment key={category}>
                <tr>
                  <td colSpan="2" style={{ fontWeight: 'bold', backgroundColor: '#f1f1f1', padding: '10px' }}>{category.toUpperCase()}</td>
                </tr>
                {renderAttributes(userData[category])}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
      <footer className="footer">
        <p>For <a href="https://ente.io" target="_blank" rel="noopener noreferrer">Ente.io</a></p>
      </footer>
    </div>
  );
}
