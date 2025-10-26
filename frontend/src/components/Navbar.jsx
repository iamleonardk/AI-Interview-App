import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white backdrop-blur-lg bg-opacity-90"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="group">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
                AI Interview Prep
              </span>
            </motion.div>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <NavLink to="/home" isActive={isActive('/home')}>
                  Home
                </NavLink>
                <NavLink to="/upload" isActive={isActive('/upload')}>
                  Upload Docs
                </NavLink>
                <NavLink to="/chat" isActive={isActive('/chat')}>
                  Chat
                </NavLink>
                <motion.span
                  className="text-white/90 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm font-medium"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Hi, {user.name}
                </motion.span>
                <motion.button
                  onClick={handleLogout}
                  className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-xl font-semibold backdrop-blur-sm transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <NavLink to="/login" isActive={isActive('/login')}>
                  Login
                </NavLink>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/signup"
                    className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-xl font-semibold backdrop-blur-sm transition-all inline-block"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const NavLink = ({ to, isActive, children }) => (
  <Link to={to} className="relative">
    <motion.span
      className={`hover:text-white transition-colors font-medium px-3 py-2 rounded-lg ${
        isActive ? 'text-white' : 'text-white/80'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
          layoutId="navbar-indicator"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.span>
  </Link>
);

export default Navbar;
