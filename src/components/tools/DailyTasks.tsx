import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { Plus, Check, Trash2, Calendar } from 'lucide-react';

interface Props {
  language: Language;
}

interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  createdAt: number;
}

export const DailyTasks: React.FC<Props> = ({ language }) => {
  const isSo = language === 'so';

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem('somali_toolkit_tasks');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return [
      { id: '1', title: isSo ? 'Dhammee warbixinta maaliyadda bishan' : 'Complete monthly financial report', completed: false, priority: 'high', createdAt: Date.now() },
      { id: '2', title: isSo ? 'Wac macaamiisha qaansheegyadu ka daaheen' : 'Follow up with overdue invoices', completed: true, priority: 'medium', createdAt: Date.now() - 3600000 },
      { id: '3', title: isSo ? 'Qorshee casharrada toddobaadka cusub' : 'Prepare lecture notes for next week', completed: false, priority: 'low', createdAt: Date.now() - 7200000 },
    ];
  });

  const [inputTitle, setInputTitle] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    try {
      localStorage.setItem('somali_toolkit_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }, [tasks]);

  const addTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputTitle.trim()) return;

    const newTask: TaskItem = {
      id: Date.now().toString(),
      title: inputTitle.trim(),
      completed: false,
      priority,
      createdAt: Date.now(),
    };
    setTasks([newTask, ...tasks]);
    setInputTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((t) => !t.completed));
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="space-y-5">
      {/* Input bar */}
      <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
          placeholder={isSo ? 'Qor hawl cusub oo maanta ah...' : 'What needs to get done today?...'}
          className="flex-1 px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5] focus:ring-1 focus:ring-[#1E88E5]"
        />

        <div className="flex gap-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="text-xs px-2.5 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#1E88E5]"
          >
            <option value="high">{isSo ? 'Degdeg (High)' : 'High Priority'}</option>
            <option value="medium">{isSo ? 'Dhexe (Medium)' : 'Medium Priority'}</option>
            <option value="low">{isSo ? 'Caadi (Low)' : 'Low Priority'}</option>
          </select>

          <button
            type="submit"
            className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white bg-[#1E88E5] hover:bg-[#1976D2] rounded-md transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            {isSo ? 'Kudar' : 'Add Task'}
          </button>
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`text-xs font-medium px-2.5 py-1 rounded transition-colors ${
              filter === 'all' ? 'bg-slate-200 text-[#0A2342]' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isSo ? 'Dhammaan' : 'All'} ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`text-xs font-medium px-2.5 py-1 rounded transition-colors ${
              filter === 'pending' ? 'bg-slate-200 text-[#0A2342]' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isSo ? 'Qabyo' : 'Pending'} ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`text-xs font-medium px-2.5 py-1 rounded transition-colors ${
              filter === 'completed' ? 'bg-slate-200 text-[#0A2342]' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isSo ? 'Dhameystiran' : 'Completed'} ({tasks.length - pendingCount})
          </button>
        </div>

        {tasks.some((t) => t.completed) && (
          <button
            onClick={clearCompleted}
            className="text-xs text-rose-600 hover:underline"
          >
            {isSo ? 'Tir kuwa dhammaaday' : 'Clear completed'}
          </button>
        )}
      </div>

      {/* Task items list */}
      <div className="space-y-1.5 max-h-80 overflow-y-auto">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            {isSo ? 'Wax hawlo ah kuma jiraan qaybtan.' : 'No tasks in this category.'}
          </div>
        ) : (
          filteredTasks.map((t) => (
            <div
              key={t.id}
              className={`flex items-center justify-between p-2.5 rounded border transition-colors ${
                t.completed ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                <button
                  type="button"
                  onClick={() => toggleTask(t.id)}
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    t.completed
                      ? 'bg-[#1E88E5] border-[#1E88E5] text-white'
                      : 'border-slate-300 hover:border-[#1E88E5]'
                  }`}
                >
                  {t.completed && <Check className="w-3 h-3 stroke-[3]" />}
                </button>

                <span
                  className={`text-xs truncate ${
                    t.completed ? 'line-through text-slate-400' : 'font-medium text-slate-800'
                  }`}
                >
                  {t.title}
                </span>

                <span
                  className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                    t.priority === 'high'
                      ? 'bg-rose-50 text-rose-700'
                      : t.priority === 'medium'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {t.priority}
                </span>
              </div>

              <button
                onClick={() => deleteTask(t.id)}
                className="text-slate-400 hover:text-rose-600 p-1"
                title={isSo ? 'Tir hawsha' : 'Delete task'}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="text-xs text-slate-500 pt-1">
        {isSo
          ? `Waxaa ku dhiman ${pendingCount} hawlood. Waxay si toos ah ugu kaydsan yihiin qalabkaaga.`
          : `${pendingCount} tasks remaining. Auto-saved locally on your device.`}
      </div>
    </div>
  );
};
