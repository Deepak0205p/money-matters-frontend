export default function Loading() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-3">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="absolute h-full w-full rounded-full border-2 border-blue-100 animate-ping opacity-40" />
          <div className="h-10 w-10 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin" />
        </div>
        <p className="text-xs font-semibold text-slate-500 tracking-wide">Loading...</p>
      </div>
    </div>
  );
}
