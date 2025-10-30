import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/auth/login");
  }

  // Get user profile to check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // Redirect based on role
  if (profile?.role === 'admin') {
    redirect('/admin/users');
  } else if (profile?.role === 'coach') {
    redirect('/trainings/coach');
  } else {
    redirect('/trainings');
  }
}

