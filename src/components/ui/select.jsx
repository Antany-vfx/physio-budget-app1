import React from "react";

export function Select({ value, onValueChange, children }) {
  return (
    <select
      className="border rounded-lg px-2 py-1 text-sm w-full"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    >
      {children}
    </select>
  );
}

export function SelectTrigger({ children }) {
  return <>{children}</>;
}

export function SelectContent({ children }) {
  return <>{children}</>;
}

export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}