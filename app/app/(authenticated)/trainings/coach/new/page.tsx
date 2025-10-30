'use client';

import { useRouter } from "next/navigation";
import { TrainingForm } from "@/components/trainings/training-form";

export default function NewTrainingPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/trainings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create training');
      }

      alert('Trening je bil uspešno ustvarjen');
      router.push('/trainings/coach');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create training');
      throw err;
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-6 p-4 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Nov trening</h1>
        <p className="text-muted-foreground mt-1">Ustvari nov trening za igralce</p>
      </div>

      <TrainingForm
        onSubmit={handleSubmit}
        onCancel={() => router.push('/trainings/coach')}
        submitLabel="Ustvari trening"
      />
    </div>
  );
}
