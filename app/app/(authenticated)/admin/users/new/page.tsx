'use client';

import { useRouter } from "next/navigation";
import { UserForm } from "@/components/admin/user-form";

export default function NewUserPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create user');
      }

      alert('Uporabnik je bil uspešno ustvarjen');
      router.push('/admin/users');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create user');
      throw err;
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-6 p-4 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Nov uporabnik</h1>
        <p className="text-muted-foreground mt-1">Dodaj novega uporabnika v sistem</p>
      </div>

      <UserForm
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin/users')}
      />
    </div>
  );
}
