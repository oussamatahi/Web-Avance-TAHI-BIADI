import React from "react";

const SearchBox = ({ value, onChange, holder = " By Name" }) => {
  return (
    <input
      type="text"
      name="query"
      className="form-control my-3"
      placeholder={"Search" + holder + "..."}
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  );
};

export default SearchBox;
