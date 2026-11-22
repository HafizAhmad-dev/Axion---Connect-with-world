
import { LoaderCircle, LockKeyhole, ShieldCheck } from "lucide-react";

export default function AuthLoading() {
  return (
    <main
      className="min-h-dvh flex flex-col items-center justify-center
      bg-slate-950 text-white px-6"
      role="status"
      aria-live="polite"
      aria-label="Checking authentication"
    >
      {/* Branding */}
      <div className="absolute top-8 left-6 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center
          rounded-xl bg-indigo-600">
          <ShieldCheck size={23} />
        </div>

        <span className="text-xl font-bold tracking-tight">
          Axion
        </span>
      </div>

      {/* Main content */}
      <div className="flex w-full max-w-sm flex-col items-center
        text-center">

        <div className="mb-6 flex h-20 w-20 items-center
          justify-center rounded-3xl bg-indigo-500/10
          ring-1 ring-indigo-400/20">
          <ShieldCheck
            size={38}
            className="text-indigo-400"
          />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">
          Securing your session
        </h1>

        <p className="mt-3 max-w-xs text-sm leading-6
          text-slate-400">
          We're checking your authentication and getting
          everything ready.
        </p>

        <div className="mt-8 flex items-center gap-3
          rounded-full border border-slate-800
          bg-slate-900 px-5 py-3">

          <LoaderCircle
            size={18}
            className="animate-spin text-indigo-400"
          />

          <span className="text-sm font-medium text-slate-300">
            Verifying authentication...
          </span>
        </div>
      </div>

      {/* Security footer */}
      <div className="absolute bottom-8 flex items-center
        gap-2 text-xs text-slate-500">
        <LockKeyhole size={13} />
        <span>Your session is protected</span>
      </div>
    </main>
  );
}
