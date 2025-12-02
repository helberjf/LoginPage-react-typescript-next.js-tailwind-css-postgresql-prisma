// app/(dashboard)/error.tsx
"use client";

import { useEffect } from "react";

export default function DashboardError({ error }: { error: Error }) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Ops — Algo deu errado</h2>
        <p className="mb-4">Estamos trabalhando nisso. Atualize a página ou volte ao início.</p>
        <div className="flex gap-2 justify-center">
          <a href="/" className="px-4 py-2 border rounded">Voltar</a>
          <button onClick={() => location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded">Recarregar</button>
        </div>
      </div>
    </div>
  );
}
