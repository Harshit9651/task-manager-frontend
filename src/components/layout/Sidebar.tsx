import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ListChecks, UserPlus, Users, Mail, Rocket, Settings,
  Sparkles, MessageCircle, Linkedin, Building2, ChevronsLeft, ChevronsRight, Waves, Lock,
} from 'lucide-react';
import { primaryNav, comingSoonNav } from '../../config/navigation';
import { motion } from 'framer-motion';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, ListChecks, UserPlus, Users, Mail, Rocket, Settings,
  Sparkles, MessageCircle, Linkedin, Building2,
};

export default function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onCloseMobile,
}: {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const content = (
    <div className="flex h-full flex-col bg-ink-950 text-ink-200">
      {/* Brand */}
      <div className={`flex items-center gap-2.5 px-4 pt-5 pb-4 ${collapsed ? 'justify-center' : ''}`}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white shadow-pop">
          <Waves className="h-5 w-5" />
        </div>
        {!collapsed && (
          <span className="font-display text-lg font-semibold text-white tracking-tight">Flowdesk</span>
        )}
      </div>

      {/* Primary nav */}
      <nav className="mt-2 flex-1 space-y-1 overflow-y-auto scrollbar-thin px-3">
        {primaryNav.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-ink-300 hover:bg-white/5 hover:text-white'
                } ${collapsed ? 'justify-center' : ''}`
              }
              title={collapsed ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="active-pill"
                      className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-accent-400"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </>
              )}
            </NavLink>
          );
        })}

        {!collapsed && (
          <div className="pt-5 pb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
            Coming soon
          </div>
        )}
        {comingSoonNav.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <div
              key={item.label}
              title={collapsed ? `${item.label} — coming soon` : undefined}
              className={`flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-500 ${
                collapsed ? 'justify-center' : ''
              }`}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && (
                <span className="flex flex-1 items-center justify-between truncate">
                  {item.label}
                  <Lock className="h-3 w-3 text-ink-600" />
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle (desktop) */}
      <div className="hidden lg:block border-t border-white/5 p-3">
        <button
          onClick={onToggle}
          className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-300 hover:bg-white/5 hover:text-white transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          {collapsed ? <ChevronsRight className="h-[18px] w-[18px]" /> : <ChevronsLeft className="h-[18px] w-[18px]" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex shrink-0 transition-all duration-200 ease-out ${
          collapsed ? 'w-[76px]' : 'w-64'
        }`}
      >
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-ink-950/60" onClick={onCloseMobile} />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'tween', duration: 0.22 }}
            className="relative z-10 w-64"
          >
            {content}
          </motion.div>
        </div>
      )}
    </>
  );
}
