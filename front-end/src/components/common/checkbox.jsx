import React from "react";

const CheckBox = (props) => {
  let classes = "fa fa-square";
  if (!props.checked) classes += "-o";
  return (
    <i
      onClick={props.onClick}
      style={{ cursor: "pointer" }}
      className={classes}
      aria-hidden="true"
    />
  );
};

export default CheckBox;
