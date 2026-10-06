import React from "react";
import SvgGlobal from "./SvgGlobal ";

function Loader() {
  return (
    <div className="flex items-center fixed z-50 w-full h-full left-0 top-0 bg-white justify-center min-h-screen">
      <SvgGlobal />
    </div>
  );
}

export default Loader;
