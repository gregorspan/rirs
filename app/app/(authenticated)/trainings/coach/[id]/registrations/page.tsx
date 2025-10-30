'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { TrainingRegistration, Training } from "@/lib/database.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User } from "lucide-react";

export default function TrainingRegistrationsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [training, setTraining] = useState<Training | null>(null);
  const [registrations, setRegistrations] = useState<TrainingRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch training details
        const trainingResponse = await fetch(`/api/trainings/${id}`);
        const trainingResult = await trainingResponse.json();

        if (!trainingResponse.ok) {
          throw new Error(trainingResult.error || 'Failed to fetch training');
        }

        setTraining(trainingResult.data);

        // Fetch registrations
        const registrationsResponse = await fetch(`/api/trainings/${id}/registrations`);
        const registrationsResult = await registrationsResponse.json();

        if (!registrationsResponse.ok) {
          throw new Error(registrationsResult.error || 'Failed to fetch registrations');
        }

        setRegistrations(registrationsResult.data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('sl-SI', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    return timeStr.slice(0, 5); // HH:MM
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
    <div className="flex-1 w-full flex flex-col gap-6 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Prijavljeni igralci</h1>
          <p className="text-muted-foreground mt-1">{training.title}</p>
        </div>
        <Button variant="outline" onClick={() => router.push('/trainings/coach')}>
          Nazaj
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Podrobnosti treninga</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(training.training_date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{formatTime(training.training_time)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{training.location}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Prijavljeni igralci</CardTitle>
            <Badge variant="secondary">{registrations.length}</Badge>
          </div>
          <CardDescription>Seznam igralcev, ki so se prijavili na ta trening</CardDescription>
        </CardHeader>
        <CardContent>
          {registrations.length > 0 ? (
            <div className="space-y-2">
              {registrations.map((registration) => (
                <div
                  key={registration.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{registration.player?.full_name}</p>
                      <p className="text-sm text-muted-foreground">{registration.player?.email}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Prijavljen: {new Date(registration.registered_at).toLocaleDateString('sl-SI')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Še ni prijavljenih igralcev
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
