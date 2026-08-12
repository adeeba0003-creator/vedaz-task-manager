'use client';

import React from 'react';
import { LayoutDashboard, CheckSquare, Users, Settings, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col justify-between">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6">
          <div className="bg-indigo-600 text-white font-bold rounded-lg w-8 h-8 flex items-center justify-center">
            V
          </div>
          <span className="text-xl font-bold tracking-wide">Vedaz</span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-indigo-600/20 text-indigo-400"
          >
            <CheckSquare size={18} />
            <span>Tasks</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <Users size={18} />
            <span>Team</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <Settings size={18} />
            <span>Settings</span>
          </a>
        </nav>
      </div>

      {/* Bottom Profile & Theme Toggle */}
      <div className="border-t border-slate-800 pt-4 space-y-4">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition"
        >
          <span className="flex items-center gap-2">
            {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-400" />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </span>
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs">
            G
          </div>
          <div className="text-xs">
            <p className="font-medium text-white">Guest User</p>
            <p className="text-slate-400">Guest Workspace</p>
          </div>
        </div>
      </div>
    </aside>
  );
}