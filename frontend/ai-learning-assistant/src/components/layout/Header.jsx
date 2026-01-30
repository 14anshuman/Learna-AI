import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, User, Menu } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
    const { user } = useAuth();

    return (
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                {/* Left */}
                <div className="flex items-center gap-3">
                    <button
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        <Menu size={22} />
                    </button>

                    
                </div>

                {/* Right */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    

                    {/* User Profile */}
                    <div className="flex items-center gap-3 bg-gray-100 px-3 py-1.5 rounded-xl">
                        <div className="flex items-center justify-center h-9 w-9 rounded-full bg-green-700 text-white">
                            <User size={18} strokeWidth={2.5} />
                        </div>

                        <div className="hidden sm:block leading-tight">
                            <p className="text-sm font-medium text-gray-800">
                                {user?.username || 'User'}
                            </p>
                            <p className="text-xs text-gray-500">
                                {user?.email || 'user@example.com'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
