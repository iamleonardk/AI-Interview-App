import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">
            AI Interview Prep
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/home" className="hover:text-blue-200 transition">
                  Home
                </Link>
                <Link to="/upload" className="hover:text-blue-200 transition">
                  Upload Docs
                </Link>
                <Link to="/chat" className="hover:text-blue-200 transition">
                  Chat
                </Link>
                <span className="text-blue-200">Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
