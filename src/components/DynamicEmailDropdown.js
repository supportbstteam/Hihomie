import React, { useState, useEffect } from "react";

const DynamicEmailDropdown = ({ setEmail }) => {
  const [query, setQuery] = useState(""); // what user types
  const [results, setResults] = useState([]); // dropdown options
  const [selected, setSelected] = useState(""); // chosen email
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Debounce effect — waits 400ms after typing
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.length > 1) fetchResults(query);
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  const fetchResults = async (searchText) => {
    setLoading(true);
    try {
      // Example: Replace with your real API endpoint
      const res = await fetch(
        `/api/customer?email_like=${searchText}`
      );
      const data = await res.json();
      const emails = data.map((user) => user.email);

      setResults(data);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (email) => {
    setEmail(email);
    setSelected(email);
    setQuery(email);
    setShowDropdown(false);
  };

  return (
    <div className="relative mx-auto">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Email Address
      </label>

      {/* Input Field */}
      <input
        type="text"
        placeholder="Type an email..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelected("");
        }}
        onFocus={() => setShowDropdown(true)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Dropdown */}
      {showDropdown && query.length > 1 && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
          {loading ? (
            <div className="p-3 text-gray-500 text-sm">Loading...</div>
          ) : results.length > 0 ? (
            results.map((res, idx) => (
              <div
                key={idx}
                onClick={() => handleSelect(res.email)}
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-gray-700 text-sm"
              >
                <span className="font-medium">{res.name}</span>
                <span className="text-gray-500 ml-2">{res.email}</span>
              </div>
            ))
          ) : (
            <div className="p-3 text-gray-500 text-sm">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default DynamicEmailDropdown;
