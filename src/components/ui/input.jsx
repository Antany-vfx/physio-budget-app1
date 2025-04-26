export function Input({ className = "", ...props }) {
  return (
    <input
      className={`border rounded-lg px-2 py-1 w-full text-sm ${className}`}
      {...props}
    />
  );
}