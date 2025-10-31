import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center w-full h-[70vh]">
      <div className="relative flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
        <span className="mt-3 text-blue-600 font-semibold text-sm tracking-wide">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default Loader;
