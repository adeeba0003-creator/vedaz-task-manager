'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  LayoutDashboard, 
  Users, 
  Settings, 
  Moon, 
  Sun,
  Plus, 
  Search, 
  Filter, 
  List, 
  Grid,
  Trash2,
  Edit2,
  MoreHorizontal,
  Calendar,
  Menu,
  X
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string;
  assignee: string;
  createdAt: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('All');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Theme state with localStorage persistence
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    status: 'In Progress',
    priority: 'Medium',
    dueDate: '',
    assignee: ''
  });

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle Theme
  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Fetch Tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://vedaz-task-manager.onrender.com/tasks');
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create Task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      const res = await fetch('https://vedaz-task-manager.onrender.com/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsCreateModalOpen(false);
        setFormData({ title: '', status: 'In Progress', priority: 'Medium', dueDate: '', assignee: '' });
        fetchTasks();
      }
    } catch (err) {
      console.error('Create Error:', err);
    }
  };

  // Update Task
  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !formData.title.trim()) return;

    try {
      const res = await fetch(`https://vedaz-task-manager.onrender.com/tasks/${editingTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setEditingTask(null);
        fetchTasks();
      }
    } catch (err) {
      console.error('Update Error:', err);
    }
  };

  // Delete Task
  const handleDeleteTask = async (id: string) => {
    try {
      const res = await fetch(`https://vedaz-task-manager.onrender.com/tasks/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        setActiveMenuId(null);
      }
    } catch (err) {
      console.error('Delete Error:', err);
    }
  };

  // Quick Status Toggle
  const handleStatusToggle = async (task: Task) => {
    const nextStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
    try {
      const res = await fetch(`https://vedaz-task-manager.onrender.com/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error('Status Toggle Error:', err);
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate || '',
      assignee: task.assignee || ''
    });
    setActiveMenuId(null);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatusFilter === 'All' || task.status === selectedStatusFilter;
    const matchesPriority = selectedPriorityFilter === 'All' || task.priority === selectedPriorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`} onClick={() => { setActiveMenuId(null); setIsFilterOpen(false); }}>
      
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0f172a] text-white">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center font-bold text-sm">V</div>
          <span className="font-bold text-lg">Vedaz</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1 text-slate-300">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0f172a] text-white flex flex-col justify-between p-4 transition-transform duration-200 md:relative md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          <div className="hidden md:flex items-center gap-3 px-3 py-4 mb-6">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-lg shadow">
              V
            </div>
            <span className="font-bold text-xl tracking-tight">Vedaz</span>
          </div>

          <nav className="space-y-1">
            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg bg-indigo-600/20 text-indigo-400 font-medium text-left">
              <CheckSquare className="w-5 h-5" /> Tasks
            </button>
            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800/60 transition text-left">
              <LayoutDashboard className="w-5 h-5" /> Dashboard
            </button>
            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800/60 transition text-left">
              <Users className="w-5 h-5" /> Team
            </button>
            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800/60 transition text-left">
              <Settings className="w-5 h-5" /> Settings
            </button>
          </nav>
        </div>

        {/* Bottom User / Theme Profile */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition w-full text-sm font-medium"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* Guest Login Section */}
          <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/40 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              G
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">Guest User</p>
              <p className="text-[10px] text-slate-400 truncate">Default Workspace</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Tasks</h1>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage and track all your team tasks here.</p>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsCreateModalOpen(true); }}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition active:scale-95"
          >
            <Plus className="w-5 h-5" /> Create Task
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input 
              type="text" 
              placeholder="Search tasks or assignees..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' 
                  : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
              }`}
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto relative">
            {/* Filter */}
            <button 
              onClick={(e) => { e.stopPropagation(); setIsFilterOpen(!isFilterOpen); }}
              className={`flex items-center gap-2 px-3.5 py-2.5 border rounded-lg text-sm font-medium transition shadow-sm ${
                selectedStatusFilter !== 'All' || selectedPriorityFilter !== 'All'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-4 h-4" /> Filter
            </button>

            {isFilterOpen && (
              <div 
                onClick={(e) => e.stopPropagation()} 
                className={`absolute right-12 top-12 border rounded-xl shadow-xl p-4 w-60 z-30 space-y-3 ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Status</label>
                  <select 
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value)}
                    className={`w-full px-2.5 py-1.5 border rounded-lg text-xs outline-none ${
                      isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'
                    }`}
                  >
                    <option value="All">All Statuses</option>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Priority</label>
                  <select 
                    value={selectedPriorityFilter}
                    onChange={(e) => setSelectedPriorityFilter(e.target.value)}
                    className={`w-full px-2.5 py-1.5 border rounded-lg text-xs outline-none ${
                      isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'
                    }`}
                  >
                    <option value="All">All Priorities</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                {(selectedStatusFilter !== 'All' || selectedPriorityFilter !== 'All') && (
                  <button 
                    onClick={() => { setSelectedStatusFilter('All'); setSelectedPriorityFilter('All'); }}
                    className="text-xs text-indigo-400 hover:underline font-medium w-full text-left"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            )}

            {/* View Switcher */}
            <div className={`flex border rounded-lg overflow-hidden shadow-sm ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2.5 border-r transition ${viewMode === 'list' ? (isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900') : 'text-slate-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition ${viewMode === 'grid' ? (isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900') : 'text-slate-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* View Rendering */}
        {viewMode === 'list' ? (
          <div className={`border rounded-xl overflow-x-auto shadow-sm ${isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'}`}>
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className={`border-b text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'border-slate-700 bg-slate-800/80 text-slate-400' : 'border-slate-100 bg-slate-50/60 text-slate-500'}`}>
                  <th className="py-3.5 px-6">Task Name</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Priority</th>
                  <th className="py-3.5 px-6">Due Date</th>
                  <th className="py-3.5 px-6">Assignee</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-sm ${isDarkMode ? 'divide-slate-700' : 'divide-slate-100'}`}>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">Loading tasks...</td>
                  </tr>
                ) : filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">
                      No tasks found. Click "+ Create Task" to add one!
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr key={task.id} className={`transition ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50/80'}`}>
                      <td className={`py-4 px-6 font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{task.title}</td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleStatusToggle(task)}
                          className={`text-xs font-medium px-3 py-1 rounded-full transition ${
                            task.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                            task.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                            'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                          }`}
                        >
                          {task.status}
                        </button>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          task.priority === 'High' ? 'bg-red-500/10 text-red-500' :
                          task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-500/10 text-slate-400'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-400">{task.dueDate || '—'}</td>
                      <td className={`py-4 px-6 font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{task.assignee || 'Unassigned'}</td>
                      <td className="py-4 px-6 text-right relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === task.id ? null : task.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg transition"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {activeMenuId === task.id && (
                          <div 
                            onClick={(e) => e.stopPropagation()}
                            className={`absolute right-6 top-10 border rounded-lg shadow-xl py-1.5 w-32 z-20 text-left ${
                              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                            }`}
                          >
                            <button
                              onClick={() => openEditModal(task)}
                              className={`flex items-center gap-2 px-3 py-1.5 text-xs w-full transition ${
                                isDarkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <Edit2 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="flex items-center gap-2 px-3 py-1.5 text-xs text-red-500 hover:bg-red-500/10 w-full transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className={`border p-5 rounded-xl shadow-sm hover:shadow transition ${
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    task.priority === 'High' ? 'bg-red-500/10 text-red-500' :
                    task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-500/10 text-slate-400'
                  }`}>
                    {task.priority}
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEditModal(task)} className="p-1 text-slate-400 hover:text-indigo-400">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteTask(task.id)} className="p-1 text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{task.title}</h3>
                
                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-700/50">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {task.dueDate || 'No date'}
                  </div>
                  <span className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{task.assignee || 'Unassigned'}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {(isCreateModalOpen || editingTask) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className={`rounded-2xl w-full max-w-md p-6 shadow-2xl ${
              isDarkMode ? 'bg-slate-800 border border-slate-700 text-white' : 'bg-white text-slate-900'
            }`} onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-4">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">TASK NAME</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter task name..."
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className={`w-full px-3.5 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none ${
                      isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">STATUS</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg text-sm outline-none ${
                        isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'
                      }`}
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">PRIORITY</label>
                    <select 
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg text-sm outline-none ${
                        isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'
                      }`}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">DUE DATE</label>
                  <input 
                    type="date" 
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg text-sm outline-none ${
                      isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">ASSIGNEE NAME</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Adeeba Bano"
                    value={formData.assignee}
                    onChange={(e) => setFormData({...formData, assignee: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg text-sm outline-none ${
                      isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200'
                    }`}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                  <button 
                    type="button" 
                    onClick={() => { setIsCreateModalOpen(false); setEditingTask(null); }}
                    className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm"
                  >
                    {editingTask ? 'Update Task' : 'Save Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}