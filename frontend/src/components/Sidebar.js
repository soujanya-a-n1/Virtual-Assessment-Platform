import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  FiHome,
  FiBook,
  FiCheckSquare,
  FiUsers,
  FiBarChart2,
  FiMenu,
  FiX,
  FiAward,
  FiGrid,
  FiBookOpen,
  FiLayers,
  FiBriefcase,
  FiUserCheck,
} from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleSubmenu = (label) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  const getMenuItems = () => {
    const studentMenu = [
      { path: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
      { path: '/exams', icon: <FiBook />, label: 'Exams' },
      { path: '/results', icon: <FiAward />, label: 'Results' },
      { path: '/analytics', icon: <FiBarChart2 />, label: 'Analytics' },
    ];

    const examinerMenu = [
      { path: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
      { path: '/exams', icon: <FiBook />, label: 'Exams' },
      { path: '/submissions', icon: <FiCheckSquare />, label: 'Submissions' },
      { path: '/results', icon: <FiAward />, label: 'Results' },
      { path: '/analytics', icon: <FiBarChart2 />, label: 'Analytics' },
    ];

    const adminMenu = [
      { path: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
      { path: '/users', icon: <FiUsers />, label: 'Users' },
      { 
        label: 'Master Data',
        icon: <FiGrid />,
        submenu: [
          { path: '/departments', icon: <FiLayers />, label: 'Departments' },
          { path: '/courses', icon: <FiBookOpen />, label: 'Courses' },
          { path: '/classes', icon: <FiGrid />, label: 'Classes' },
          { path: '/lecturers', icon: <FiBriefcase />, label: 'Lecturers' },
          { path: '/students', icon: <FiUserCheck />, label: 'Students' },
        ]
      },
      { path: '/exams', icon: <FiBook />, label: 'Exams' },
      { path: '/submissions', icon: <FiCheckSquare />, label: 'Submissions' },
      { path: '/results', icon: <FiAward />, label: 'Results' },
      { path: '/analytics', icon: <FiBarChart2 />, label: 'Analytics' },
    ];

    if (user?.role === 'Student') return studentMenu;
    if (user?.role === 'Examiner') return examinerMenu;
    return adminMenu;
  };

  const menuItems = getMenuItems();

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? <FiX /> : <FiMenu />}
      </button>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Assessment</h2>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <div key={item.path || index}>
              {item.submenu ? (
                <>
                  <div
                    className="sidebar-link submenu-toggle"
                    onClick={() => toggleSubmenu(item.label)}
                  >
                    <span className="sidebar-icon">{item.icon}</span>
                    <span className="sidebar-label">{item.label}</span>
                    <span className={`submenu-arrow ${expandedMenu === item.label ? 'expanded' : ''}`}>
                      ▼
                    </span>
                  </div>
                  {expandedMenu === item.label && (
                    <div className="submenu">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={`sidebar-link submenu-item ${
                            location.pathname === subItem.path ? 'active' : ''
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          <span className="sidebar-icon">{subItem.icon}</span>
                          <span className="sidebar-label">{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`sidebar-link ${
                    location.pathname === item.path ? 'active' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-label">{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-badge">
            <div className="user-avatar">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </div>
            <div className="user-details">
              <p className="user-name">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="user-role">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar} />}
    </>
  );
};

export default Sidebar;
