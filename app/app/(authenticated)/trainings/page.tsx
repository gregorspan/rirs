'use client';

import { useEffect, useState } from "react";
import { Training } from "@/lib/database.types";
import { TrainingCard } from "@/components/trainings/training-card";

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [registrations, setRegistrations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch upcoming trainings
      const response = await fetch('/api/trainings?upcoming=true');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch trainings');
      }

      setTrainings(result.data || []);

      // Fetch user's registrations
      const profileResponse = await fetch('/api/profile');
      const profileResult = await profileResponse.json();

      if (profileResponse.ok && profileResult.data) {
        const userId = profileResult.data.id;
        
        // Get all registrations and filter by user
        const allRegistrations = await Promise.all(
          (result.data || []).map(async (training: Training) => {
            const regResponse = await fetch(`/api/trainings/${training.id}/registrations`);
            const regResult = await regResponse.json();
            
            if (regResponse.ok && regResult.data) {
              const isRegistered = regResult.data.some((reg: any) => reg.player_id === userId);
              return isRegistered ? training.id : null;
            }
            return null;
          })
        );

        setRegistrations(allRegistrations.filter(Boolean) as string[]);
      }

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

  const handleRegister = async (id: string) => {
    try {
      const response = await fetch(`/api/trainings/${id}/registrations`, {
        method: 'POST',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to register');
      }

      await fetchData();
      alert('Uspešno ste se prijavili na trening');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to register');
    }
  };

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
        <h1 className="text-3xl font-bold">Prihodnji treningi</h1>
        <p className="text-muted-foreground mt-1">Pregled in prijava na treninge</p>
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
            isRegistered={registrations.includes(training.id)}
            onRegister={handleRegister}
            onUnregister={handleUnregister}
          />
        ))}
      </div>

      {trainings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Ni prihodnjih treningov</p>
        </div>
      )}
    </div>
  );
}
