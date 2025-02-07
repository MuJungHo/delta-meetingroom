import * as React from "react";
function SvgEventAvailable(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={24}
      viewBox="0 -960 960 960"
      width={24}
      fill="currentColor"
      {...props}
    >
      <path d="M438-226L296-368l58-58 84 84 168-168 58 58-226 226zM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200zm0-80h560v-400H200v400zm0-480h560v-80H200v80zm0 0v-80 80z" />
    </svg>
  );
}
export default SvgEventAvailable;
