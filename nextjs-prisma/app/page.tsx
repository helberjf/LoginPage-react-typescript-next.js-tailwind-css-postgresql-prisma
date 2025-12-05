// src/app/page.tsx
"use client";
import ThemeSwitcher from "../components/ThemeSwitcher";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 text-center text-neutral-500 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-700 rounded-md p-6">
      <h1 className="text-3xl font-bold">Bem-vindo ao sistema de produtos</h1>

      <p className="text-neutral-500 dark:text-neutral-400 text-center max-w-md">
        Autenticação com Next.js 16, Auth.js, Prisma e PostgreSQL.
      </p>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm"
        >
          Entrar
        </Link>

        <Link
          href="/register"
          className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 text-sm"
        >
          Registrar
        </Link>
      </div>

      <div className="mt-4">
        <ThemeSwitcher />
      </div>
    </main>
  );
}
