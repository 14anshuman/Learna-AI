import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    FileText,
    BookOpen,
    BrainCircuit,
    LogOut,
    X,
    User
} from 'lucide-react';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
    const { logout } = useAuth();


    const handleLogout = () => {
        const confirmLogout=window.confirm("Are you sure you want to Sign Out?");
        if(!confirmLogout) return;
        logout();
        
    };

    const navItems = [
        {
            label: 'Dashboard',
            path: '/dashboard',
            icon: LayoutDashboard
        },
        {
            label: 'Documents',
            path: '/documents',
            icon: FileText
        },
        {
            label: 'Flashcards',
            path: '/flashcards',
            icon: BookOpen
        },
         {
            label: 'Quizzes',
            path: '/quizzes',
            icon: BrainCircuit
        },
        {
            label: 'Profile',
            path: '/profile',
            icon: User
        }
       

    ];

    return (
        <>
            {/* Overlay (mobile) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0`}
            >
                {/* Header */}
                <div className="flex items-center justify-between h-16 px-4 ">
                    <Link
  to="/"
  className="
    flex items-center gap-2
    font-bold text-lg
    text-green-700
    hover:text-green-700
    transition-colors
    select-none
  "
>
  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-100">
    <BrainCircuit className="w-5 h-5 text-green-700" />
  </div>

  <span className="tracking-tight">
    <span className="text-green-700">Learna AI</span>
  </span>
</Link>

                    <button
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                        onClick={toggleSidebar}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {navItems.map(({ label, path, icon: Icon }) => (
                        <NavLink
                            key={path}
                            to={path}
                            onClick={() => toggleSidebar(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                                ${
                                    isActive
                                        ? 'bg-green-700 text-white shadow'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`
                            }
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div className="absolute bottom-4 w-full px-4">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
