import React, { useState } from "react";
import "./FetchApi.css";

export default function FetchApi() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const apiGet = () => {
    fetch("https://api.jsonbin.io/v3/b/6641df17acd3cb34a8473873")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((json) => {
        console.log(json);
        setData(json.record);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
      });
  };

  const renderAttributes = (object, prefix = "") => {
    const attributes = [];

    if (object && typeof object === "object") {
      Object.entries(object).forEach(([key, value]) => {
        if (typeof value === "object" && !Array.isArray(value)) {
          attributes.push(...renderAttributes(value, `${prefix}${key}.`));
        } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object") {
          value.forEach((item, index) => {
            attributes.push(
              <tr key={`${prefix}${key}.${index}`}>
                <td>{getFormattedAttributeName(`${prefix}${key}[${index}]`)}</td>
                <td>{renderObjectValue(item)}</td>
              </tr>
            );
          });
        } else {
          attributes.push(
            <tr key={prefix + key}>
              <td>{getFormattedAttributeName(prefix + key)}</td>
              <td>{renderValue(value)}</td>
            </tr>
          );
        }
      });
    }

    return attributes;
  };

  const renderValue = (value) => {
    if (value === null || value === undefined) {
      return "null";
    } else if (typeof value === "boolean") {
      return value ? "true" : "false";
    } else if (typeof value === "object" && !Array.isArray(value)) {
      return JSON.stringify(value);
    } else if (Array.isArray(value)) {
      return value.join(", ");
    } else {
      return value.toString();
    }
  };

  const renderObjectValue = (obj) => {
    return Object.entries(obj).map(([key, value]) => (
      <p key={key}>
        <strong>{getFormattedAttributeName(key)}:</strong> {renderValue(value)}
      </p>
    ));
  };

  const getFormattedAttributeName = (name) => {
    let attributeName = name.split('.').pop();
    attributeName = attributeName.replace(/\d+$/, '');
    return attributeName.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <div className="container center-table">
    <h1 style={{ textAlign: "center" }}>INTERNSHIP PROJECT</h1>
      <div className="fetch-button">
        <button onClick={apiGet}>FETCH</button>
      </div>
      <br />
      {error && <p>Error: {error}</p>}
      {data && (
        <table border="1" className="table">
          <thead>
            <tr>
              <th>Attribute</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {renderAttributes(data)}
          </tbody>
        </table>
      )}
      <footer className="footer">
        <p>For <a href="https://ente.io" target="_blank" rel="noopener noreferrer">Ente.io</a></p>
      </footer>
    </div>
  );
}
