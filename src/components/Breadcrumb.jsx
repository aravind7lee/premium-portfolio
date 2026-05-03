import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiChevronRight } from 'react-icons/fi';
import { useTheme } from '../context/ThemeProvider';

const Breadcrumb = () => {
  const location = useLocation();
  const { isDark } = useTheme();
  
  const pathnames = location.pathname.split('/').filter(x => x);
  
  // Don't show breadcrumb on home page
  if (pathnames.length === 0) return null;

  const breadcrumbItems = [
    { name: 'Home', path: '/', icon: FiHome }
  ];

  pathnames.forEach((value, index) => {
    const path = `/${pathnames.slice(0, index + 1).join('/')}`;
    const name = value.charAt(0).toUpperCase() + value.slice(1);
    breadcrumbItems.push({ name, path });
  });

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="fixed top-20 sm:top-24 left-4 sm:left-6 z-40"
      aria-label="Breadcrumb"
    >
      <ol className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl backdrop-blur-xl border ${
        isDark 
          ? 'bg-gray-900/40 border-white/10' 
          : 'bg-white/60 border-gray-200/50'
      } shadow-lg`}>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const Icon = item.icon;
          
          return (
            <li key={item.path} className="flex items-center gap-2">
              {index > 0 && (
                <FiChevronRight 
                  className={`w-3 h-3 sm:w-4 sm:h-4 ${isDark ? 'text-white/30' : 'text-gray-400'}`} 
                />
              )}
              
              {isLast ? (
                <motion.span
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {Icon && <Icon className="w-3 h-3 sm:w-4 sm:h-4" />}
                  {item.name}
                </motion.span>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium transition-all duration-200 ${
                      isDark 
                        ? 'text-white/60 hover:text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {Icon && <Icon className="w-3 h-3 sm:w-4 sm:h-4" />}
                    {item.name}
                  </Link>
                </motion.div>
              )}
            </li>
          );
        })}
      </ol>
    </motion.nav>
  );
};

export default Breadcrumb;
