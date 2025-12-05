// src/app/(dashboard)/page.tsx
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  let products: Array<any> = [];
  if (userId) {
    products = await prisma.product.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Olá, {session?.user?.name ?? "Usuário"} 👋</h1>
      <div className="p-4 rounded-md border border-neutral-300 dark:border-neutral-700">
        <p className="text-neutral-700 dark:text-neutral-300">
          Email: {session?.user?.email}
        </p>
      </div>

      <div>
        <a
          href="/dashboard/add-product"
          className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Novo produto
        </a>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Seus Produtos</h2>
        {products.length === 0 ? (
          <p className="text-neutral-400 text-sm">Nenhum produto cadastrado ainda.</p>
        ) : (
          <ul className="space-y-3">
            {products.map((prod: any) => (
              <li key={prod.id} className="p-3 border rounded-sm flex flex-col gap-1 bg-neutral-50 dark:bg-neutral-800">
                <div className="flex items-center gap-2 justify-between">
                  <span className="text-base font-bold">{prod.name}</span>
                  <span className="text-green-600">R$ {Number(prod.price).toFixed(2)}</span>
                </div>
                <p className="text-neutral-700 dark:text-neutral-300 text-sm">{prod.description}</p>
                <span className="text-xs text-neutral-500">Pagamento: {prod.paymentMethods.join(", ")}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <a
        href="/api/auth/signout"
        className="inline-block px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Sair
      </a>
    </div>
  );
}
