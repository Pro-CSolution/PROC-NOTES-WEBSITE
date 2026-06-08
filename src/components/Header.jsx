import { BriefcaseBusiness, LogOut } from "lucide-react";

export default function Header({ userEmail, onSignOut }) {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-blue-300/25 bg-blue-500/10 text-blue-200 shadow-[0_0_24px_rgba(59,130,246,0.14)] sm:h-14 sm:w-14">
          <BriefcaseBusiness size={24} />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-black tracking-tight text-white sm:text-3xl">
            Client Work Tracker
          </h1>
          <p className="mt-1 text-xs text-slate-400 sm:text-sm">
            Simple client status and job notes
          </p>
        </div>
      </div>

      {onSignOut && (
        <button
          type="button"
          onClick={onSignOut}
          title={userEmail ? `Signed in as ${userEmail}` : "Sign out"}
          className="secondary-button flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      )}
    </header>
  );
}
