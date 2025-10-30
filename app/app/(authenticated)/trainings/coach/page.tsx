'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Training } from "@/lib/database.types";
import { TrainingCard } from "@/components/trainings/training-card";
import { Button } from "@/components/ui/button";

export default function CoachTrainingsPage() {
  const router = useRouter();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/trainings');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch trainings');
      }

      // Get current user's trainings
      const profileResponse = await fetch('/api/profile');
      const profileResult = await profileResponse.json();
      
      if (profileResponse.ok && profileResult.data) {
        const userId = profileResult.data.id;
        const myTrainings = (result.data || []).filter((t: Training) => t.coach_id === userId);
        setTrainings(myTrainings);
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Ali ste prepričani, da želite izbrisati ta trening?')) {
      return;
    }

    try {
      const response = await fetch(`/api/trainings/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete training');
      }

      await fetchTrainings();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete training');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 w-full flex items-center justify-center">
        <p>Nalaganje...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-6 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Moji treningi</h1>
          <p className="text-muted-foreground mt-1">Upravljaj svoje treninge</p>
        </div>
        <Button onClick={() => router.push('/trainings/coach/new')}>
          Nov trening
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trainings.map((training) => (
          <TrainingCard
            key={training.id}
            training={training}
            isOwner={true}
            onEdit={(id) => router.push(`/trainings/coach/${id}/edit`)}
            onDelete={handleDelete}
            onViewRegistrations={(id) => router.push(`/trainings/coach/${id}/registrations`)}
          />
        ))}
      </div>

      {trainings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Še nimate ustvarjenih treningov</p>
          <Button onClick={() => router.push('/trainings/coach/new')}>
            Ustvari prvi trening
          </Button>
        </div>
      )}
    </div>
  );
}
