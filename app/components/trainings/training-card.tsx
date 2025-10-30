'use client';

import { Training } from "@/lib/database.types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User } from "lucide-react";

interface TrainingCardProps {
  training: Training;
  isRegistered?: boolean;
  isOwner?: boolean;
  onRegister?: (id: string) => void;
  onUnregister?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewRegistrations?: (id: string) => void;
}

export function TrainingCard({
  training,
  isRegistered = false,
  isOwner = false,
  onRegister,
  onUnregister,
  onEdit,
  onDelete,
  onViewRegistrations,
}: TrainingCardProps) {
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

  const isPast = () => {
    const trainingDateTime = new Date(`${training.training_date}T${training.training_time}`);
    return trainingDateTime < new Date();
  };

  return (
    <Card className={isPast() ? 'opacity-60' : ''}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{training.title}</CardTitle>
            <CardDescription>
              {training.coach && (
                <div className="flex items-center gap-1 mt-1">
                  <User className="h-3 w-3" />
                  {training.coach.full_name}
                </div>
              )}
            </CardDescription>
          </div>
          {isPast() && <Badge variant="secondary">Preteklo</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {training.description && (
          <p className="text-sm text-muted-foreground">{training.description}</p>
        )}
        <div className="space-y-2 text-sm">
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
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 flex-wrap">
        {isOwner ? (
          <>
            {onViewRegistrations && (
              <Button onClick={() => onViewRegistrations(training.id)} variant="outline" size="sm">
                Prijavljeni igralci
              </Button>
            )}
            {onEdit && (
              <Button onClick={() => onEdit(training.id)} variant="outline" size="sm">
                Uredi
              </Button>
            )}
            {onDelete && (
              <Button onClick={() => onDelete(training.id)} variant="destructive" size="sm">
                Izbriši
              </Button>
            )}
          </>
        ) : (
          <>
            {isRegistered ? (
              onUnregister && !isPast() && (
                <Button onClick={() => onUnregister(training.id)} variant="outline" size="sm">
                  Odjavi se
                </Button>
              )
            ) : (
              onRegister && !isPast() && (
                <Button onClick={() => onRegister(training.id)} size="sm">
                  Prijavi se
                </Button>
              )
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}

