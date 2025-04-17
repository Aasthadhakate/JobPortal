import React, { useState } from "react";

const SearchBar = ({ setSearchCriteria }) => {
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    setSearchCriteria({ role, location });
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 p-6">
      <input
        type="text"
        placeholder="Job Role"
        className="p-2 border rounded w-full md:w-1/3"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <input
        type="text"
        placeholder="Location"
        className="p-2 border rounded w-full md:w-1/3"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button className="bg-blue-800 text-white px-6 py-2 rounded" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
