import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { ThemeSwitcher } from "./theme-switcher";
import { UserRole } from "@/lib/database.types";

export async function Navigation() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  const getNavLinks = (role: UserRole | null) => {
    if (!role) return [];

    const baseLinks = [
      { href: '/trainings', label: 'Treningi' },
    ];

    switch (role) {
      case 'admin':
        return [
          ...baseLinks,
          { href: '/admin/users', label: 'Uporabniki' },
          { href: '/trainings/coach', label: 'Moji treningi' },
        ];
      case 'coach':
        return [
          ...baseLinks,
          { href: '/trainings/coach', label: 'Moji treningi' },
          { href: '/trainings/my-registrations', label: 'Moje prijave' },
        ];
      case 'player':
        return [
          ...baseLinks,
          { href: '/trainings/my-registrations', label: 'Moje prijave' },
        ];
      default:
        return baseLinks;
    }
  };

  const navLinks = getNavLinks(profile?.role as UserRole | null);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'coach': return 'Trener';
      case 'player': return 'Igralec';
      default: return role;
    }
  };

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center">
          <Link href={user ? "/trainings" : "/"} className="font-semibold text-lg">
            Športni IS
          </Link>
          {user && navLinks.length > 0 && (
            <div className="flex gap-4 ml-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          {user && profile ? (
            <>
              <div className="flex flex-col items-end">
                <span className="font-medium">{profile.full_name}</span>
                <span className="text-xs text-muted-foreground">
                  {getRoleLabel(profile.role)}
                </span>
              </div>
              <LogoutButton />
            </>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-medium hover:underline"
              >
                Prijava
              </Link>
            </div>
          )}
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}

