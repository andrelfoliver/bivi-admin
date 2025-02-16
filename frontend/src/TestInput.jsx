import React from "react";

export default function TestInput() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <input
          type="text"
          name="teste"
          placeholder="Teste Tailwind"
          className="w-full p-4 bg-red-500 text-white rounded-md"
        />
      </div>
    </div>
  );
}
