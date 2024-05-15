import React, { useState } from "react";
import "./FetchApi.css"; // Import the CSS file for styling

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
        setData(json.record); // Accessing nested "record" key
        setError(null); // Reset error state on successful fetch
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
      });
  };

  const renderAttributes = (object, prefix = "") => {
    const attributes = [];

    // Check if the object is not null or undefined
    if (object && typeof object === "object") {
      // Iterate over each key-value pair in the object
      Object.entries(object).forEach(([key, value]) => {
        if (typeof value === "object" && !Array.isArray(value)) {
          // If the value is another object (nested), recursively render its attributes
          attributes.push(...renderAttributes(value, `${prefix}${key}.`));
        } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object") {
          // If the value is an array of objects, render each object as a separate row
          value.forEach((item, index) => {
            attributes.push(
              <tr key={`${prefix}${key}.${index}`}>
                <td>{getFormattedAttributeName(`${prefix}${key}[${index}]`)}</td>
                <td>{renderObjectValue(item)}</td>
              </tr>
            );
          });
        } else {
          // Render the attribute and its value
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
      // If the value is another object (nested), convert it to a string
      return JSON.stringify(value);
    } else if (Array.isArray(value)) {
      // If the value is an array, convert it to a string
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
    // Split the attribute name by '.' and extract the last part
    let attributeName = name.split('.').pop();
    
    // Remove any trailing numbers from the attribute name
    attributeName = attributeName.replace(/\d+$/, '');

    // Convert camelCase to Title Case
    return attributeName.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <div className="container">
      <div className="fetch-button">
        <button onClick={apiGet}>FETCH</button>
      </div>
      <br />
      {error && <p>Error: {error}</p>}
      {data && (
        <table border="1">
          <thead>
            <tr>
              <th>Attribute</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {/* Render top-level attributes */}
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
