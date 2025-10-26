import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <motion.nav
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white backdrop-blur-lg bg-opacity-90 sticky top-0 z-30"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="group z-20" onClick={closeMobileMenu}>
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-white/10 px-2 sm:px-3 py-1 rounded-lg backdrop-blur-sm">
                AI Interview Prep
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
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
                  className="text-white/90 bg-white/10 px-3 xl:px-4 py-2 rounded-lg backdrop-blur-sm font-medium text-sm xl:text-base"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Hi, {user.name}
                </motion.span>
                <motion.button
                  onClick={handleLogout}
                  className="bg-white/20 hover:bg-white/30 px-4 xl:px-6 py-2 rounded-xl font-semibold backdrop-blur-sm transition-all text-sm xl:text-base"
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
                    className="bg-white/20 hover:bg-white/30 px-4 xl:px-6 py-2 rounded-xl font-semibold backdrop-blur-sm transition-all inline-block text-sm xl:text-base"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden z-20 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </motion.button>
        </div>
      </div>
      </motion.nav>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="lg:hidden fixed left-0 right-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 border-t border-white/20 shadow-2xl z-50 max-h-[80vh] overflow-y-auto"
            style={{ top: '72px' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-6 space-y-4">
              {user ? (
                <>
                  <motion.div
                    className="text-white/90 bg-white/10 px-4 py-3 rounded-lg backdrop-blur-sm font-medium text-center mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Hi, {user.name}
                  </motion.div>
                  <MobileNavLink to="/home" isActive={isActive('/home')} onClick={closeMobileMenu} delay={0.15}>
                    Home
                  </MobileNavLink>
                  <MobileNavLink to="/upload" isActive={isActive('/upload')} onClick={closeMobileMenu} delay={0.2}>
                    Upload Docs
                  </MobileNavLink>
                  <MobileNavLink to="/chat" isActive={isActive('/chat')} onClick={closeMobileMenu} delay={0.25}>
                    Chat
                  </MobileNavLink>
                  <motion.button
                    onClick={handleLogout}
                    className="w-full bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-semibold backdrop-blur-sm transition-all text-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <MobileNavLink to="/login" isActive={isActive('/login')} onClick={closeMobileMenu} delay={0.1}>
                    Login
                  </MobileNavLink>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <Link
                      to="/signup"
                      onClick={closeMobileMenu}
                      className="block w-full bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-semibold backdrop-blur-sm transition-all text-center"
                    >
                      Sign Up
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const NavLink = ({ to, isActive, children }) => (
  <Link to={to} className="relative">
    <motion.span
      className={`hover:text-white transition-colors font-medium px-3 py-2 rounded-lg text-sm xl:text-base ${
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

const MobileNavLink = ({ to, isActive, onClick, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
  >
    <Link
      to={to}
      onClick={onClick}
      className={`block w-full px-6 py-3 rounded-xl font-semibold backdrop-blur-sm transition-all text-center ${
        isActive
          ? 'bg-white/30 text-white'
          : 'bg-white/10 hover:bg-white/20 text-white/90'
      }`}
    >
      {children}
    </Link>
  </motion.div>
);

export default Navbar;
