import { UserCircle } from "lucide-react";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold">🚀 Tracking</span>
      </div>

      <ul className="hidden md:flex space-x-8 text-sm">
        <li>
          <a href="#" className="hover:text-gray-300 transition">Home</a>
        </li>
        <li>
          <a href="#" className="hover:text-gray-300 transition">About</a>
        </li>
        <li>
          <a href="#" className="hover:text-gray-300 transition">Contact</a>
        </li>
        <li>
          <a href="#" className="hover:text-gray-300 transition">Cameras</a>
        </li>
      </ul>

      <div className="flex items-center">
        <UserCircle className="h-6 w-6 text-white cursor-pointer hover:text-gray-300" />
      </div>
    </nav>
  );
};

export default Navbar;
