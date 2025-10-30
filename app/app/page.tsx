import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If user is logged in, redirect to dashboard
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col items-center">
        <Navigation />
        <div className="flex-1 flex flex-col items-center justify-center max-w-5xl p-5 gap-8">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold">Športni informacijski sistem</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Enostavno upravljanje športnih treningov - ustvarjanje in prijava na treninge, 
              pregled urnikov, evidenca prisotnosti ter osnovna administracija uporabnikov.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button asChild size="lg">
                <Link href="/auth/login">Prijava</Link>
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl">
            <div className="p-6 border rounded-lg">
              <h3 className="font-bold text-lg mb-2">Za igralce</h3>
              <p className="text-sm text-muted-foreground">
                Pregledujte prihodnje treninge in se prijavite na treninge z enim klikom.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-bold text-lg mb-2">Za trenerje</h3>
              <p className="text-sm text-muted-foreground">
                Ustvarjajte treninge, urejajte urnik in vidite, kdo je prijavljen.
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-bold text-lg mb-2">Za administratorje</h3>
              <p className="text-sm text-muted-foreground">
                Upravljajte uporabnike in dodeljujte vloge v sistemu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
