import { Navigation } from "@/components/navigation";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <Navigation />
        <div className="flex-1 w-full max-w-7xl">
          {children}
        </div>
      </div>
    </main>
  );
}

