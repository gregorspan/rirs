'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TrainingFormProps {
  initialData?: {
    title: string;
    description: string;
    location: string;
    training_date: string;
    training_time: string;
  };
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function TrainingForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  submitLabel = "Ustvari trening" 
}: TrainingFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    location: initialData?.location || '',
    training_date: initialData?.training_date || '',
    training_time: initialData?.training_time || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Uredi trening' : 'Nov trening'}</CardTitle>
        <CardDescription>
          Izpolni podatke o treningu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Naslov *</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Opis</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lokacija *</Label>
            <Input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="training_date">Datum *</Label>
              <Input
                id="training_date"
                type="date"
                value={formData.training_date}
                onChange={(e) => setFormData({ ...formData, training_date: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="training_time">Čas *</Label>
              <Input
                id="training_time"
                type="time"
                value={formData.training_time}
                onChange={(e) => setFormData({ ...formData, training_time: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Prekliči
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Shranjujem...' : submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

