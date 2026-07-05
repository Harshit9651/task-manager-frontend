import { useState, useRef, useEffect } from 'react';
import { Bell, Search, Menu, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import { useAuth } from '../../context/AuthContext';

const notifications = [
  { id: 1, title: 'New lead: Aiden Cross', desc: 'Vantage Robotics submitted an inbound form', time: '5m ago' },
  { id: 2, title: 'Campaign milestone', desc: 'Q3 Fintech Outreach passed 50% open rate', time: '1h ago' },
  { id: 3, title: 'Task overdue', desc: '"Send proposal to Orbit Finance" is due today', time: '3h ago' },
];

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-ink-100 bg-white/90 backdrop-blur-sm px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden rounded-lg p-2 text-ink-500 hover:bg-ink-100"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          type="text"
          placeholder="Search leads, tasks, emails..."
          className="w-full rounded-xl border border-ink-200 bg-ink-25 py-2.5 pl-10 pr-4 text-sm text-ink-700 placeholder:text-ink-400 outline-none transition-all focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative rounded-xl p-2.5 text-ink-500 hover:bg-ink-100 transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent-400 ring-2 ring-white" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-ink-100 bg-white shadow-pop overflow-hidden">
              <div className="border-b border-ink-100 px-4 py-3 text-sm font-semibold text-ink-800">
                Notifications
              </div>
              <div className="max-h-80 overflow-y-auto scrollbar-thin">
                {notifications.map((n) => (
                  <div key={n.id} className="flex gap-3 border-b border-ink-50 px-4 py-3 last:border-0 hover:bg-ink-25">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                    <div>
                      <p className="text-sm font-medium text-ink-800">{n.title}</p>
                      <p className="text-xs text-ink-500 mt-0.5">{n.desc}</p>
                      <p className="text-[11px] text-ink-400 mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-2.5 hover:bg-ink-100 transition-colors"
          >
            <Avatar name={user?.name || 'User'} src={user?.avatar} size={32} />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-ink-800 leading-tight">{user?.name}</p>
              <p className="text-xs text-ink-400 leading-tight">{user?.role}</p>
            </div>
            <ChevronDown className="hidden sm:block h-4 w-4 text-ink-400" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-ink-100 bg-white shadow-pop overflow-hidden py-1.5">
              <button
                onClick={() => { setProfileOpen(false); navigate('/app/settings'); }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50"
              >
                <User className="h-4 w-4 text-ink-400" /> Profile
              </button>
              <button
                onClick={() => { setProfileOpen(false); navigate('/app/settings'); }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50"
              >
                <Settings className="h-4 w-4 text-ink-400" /> Settings
              </button>
              <div className="my-1.5 border-t border-ink-100" />
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-danger-500 hover:bg-danger-50"
              >
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
