'use client';

import { useEffect, useState } from "react";
import { Training } from "@/lib/database.types";
import { TrainingCard } from "@/components/trainings/training-card";

export default function MyRegistrationsPage() {
  const [registeredTrainings, setRegisteredTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Get current user profile
      const profileResponse = await fetch('/api/profile');
      const profileResult = await profileResponse.json();

      if (!profileResponse.ok || !profileResult.data) {
        throw new Error('Failed to fetch profile');
      }

      const userId = profileResult.data.id;

      // Fetch all trainings
      const response = await fetch('/api/trainings?upcoming=true');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch trainings');
      }

      // Filter trainings where user is registered
      const trainingsWithRegistration = await Promise.all(
        (result.data || []).map(async (training: Training) => {
          const regResponse = await fetch(`/api/trainings/${training.id}/registrations`);
          const regResult = await regResponse.json();

          if (regResponse.ok && regResult.data) {
            const isRegistered = regResult.data.some((reg: any) => reg.player_id === userId);
            return isRegistered ? training : null;
          }
          return null;
        })
      );

      setRegisteredTrainings(trainingsWithRegistration.filter(Boolean) as Training[]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUnregister = async (id: string) => {
    try {
      const response = await fetch(`/api/trainings/${id}/registrations`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to unregister');
      }

      await fetchData();
      alert('Uspešno ste se odjavili s treninga');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to unregister');
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
      <div>
        <h1 className="text-3xl font-bold">Moje prijave</h1>
        <p className="text-muted-foreground mt-1">Treningi, na katere ste prijavljeni</p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {registeredTrainings.map((training) => (
          <TrainingCard
            key={training.id}
            training={training}
            isRegistered={true}
            onUnregister={handleUnregister}
          />
        ))}
      </div>

      {registeredTrainings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Niste prijavljeni na noben trening</p>
        </div>
      )}
    </div>
  );
}
