'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { TrainingForm } from "@/components/trainings/training-form";
import { Training } from "@/lib/database.types";

export default function EditTrainingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [training, setTraining] = useState<Training | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        const response = await fetch(`/api/trainings/${id}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch training');
        }

        setTraining(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTraining();
  }, [id]);

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch(`/api/trainings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update training');
      }

      alert('Trening je bil uspešno posodobljen');
      router.push('/trainings/coach');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update training');
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 w-full flex items-center justify-center">
        <p>Nalaganje...</p>
      </div>
    );
  }

  if (error || !training) {
    return (
      <div className="flex-1 w-full flex flex-col gap-6 p-4">
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md">
          {error || 'Trening ni bil najden'}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-6 p-4 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Uredi trening</h1>
        <p className="text-muted-foreground mt-1">Posodobi podatke o treningu</p>
      </div>

      <TrainingForm
        initialData={{
          title: training.title,
          description: training.description || '',
          location: training.location,
          training_date: training.training_date,
          training_time: training.training_time,
        }}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/trainings/coach')}
        submitLabel="Posodobi trening"
      />
    </div>
  );
}
