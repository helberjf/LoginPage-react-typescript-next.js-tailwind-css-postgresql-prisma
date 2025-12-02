// app/(dashboard)/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse text-xl font-semibold">Carregando dashboard...</div>
      </div>
    </div>
  );
}
