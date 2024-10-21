import { FaUniversity } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <div className="flex items-center space-x-2">
          <FaUniversity className="h-8 w-8 text-blue-600" />
          <span className="ml-4 text-blue-600 text-lg font-bold">
            PrestaSalones
          </span>
        </div>
      </div>
    </nav>
  );
}
