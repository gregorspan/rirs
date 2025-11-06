'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TrainingSessionsList } from './training-sessions-list'

type User = {
  id: string
}

export type TrainingSession = {
  id: number
  created_by: string
  starts_at: string
  location: string
  description: string | null
  note: string | null
  cancelled_at: string | null
  created_at: string
}

export function TrainingSessionsManager() {
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [startsAt, setStartsAt] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [note, setNote] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser({ id: data.user.id })
    })
  }, [supabase])

  const onCreate = async () => {
    if (!user) return
    if (!startsAt || !location) return
    setSubmitting(true)
    try {
      const { error } = await supabase.from('training_sessions').insert({
        created_by: user.id,
        starts_at: new Date(startsAt).toISOString(),
        location,
        description: description || null,
        note: note || null,
      })
      if (!error) {
        setStartsAt('')
        setLocation('')
        setDescription('')
        setNote('')
        setRefreshKey((v) => v + 1)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Create a new training session</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="startsAt">Date & Time</Label>
              <Input
                id="startsAt"
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Gym Hall A"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-3">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Optional"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-3">
              <Label htmlFor="note">Note</Label>
              <Input
                id="note"
                placeholder="e.g. Bring water bottles and towels"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={onCreate} disabled={submitting || !user || !startsAt || !location}>
              Create session
            </Button>
          </div>
        </CardContent>
      </Card>

      <TrainingSessionsList key={refreshKey} currentUserId={user?.id ?? null} />
    </div>
  )
}


