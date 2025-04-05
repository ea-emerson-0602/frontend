import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("access_token"); // Remove token
    router.push("/login"); // Redirect to login page
  };

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
      <h1>Expense Tracker</h1>
      <button onClick={handleLogout} className="bg-red-500 p-2">Logout</button>
    </nav>
  );
}
