'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { TrainingSession } from './training-sessions-manager'

type Signup = {
  session_id: number
  user_id: string
  present: boolean | null
}

export function TrainingSessionsList({ currentUserId }: { currentUserId: string | null }) {
  const supabase = useMemo(() => createClient(), [])
  const [sessions, setSessions] = useState<TrainingSession[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editStartsAt, setEditStartsAt] = useState('')
  const [editLocation, setEditLocation] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editNote, setEditNote] = useState('')
  const [signupsBySession, setSignupsBySession] = useState<Record<number, Signup[]>>({})

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('training_sessions')
        .select('*')
        .gte('starts_at', new Date().toISOString())
        .order('starts_at', { ascending: true })
      setSessions(data ?? [])
    } finally {
      setLoading(false)
    }
  }

  const loadSignups = async (sessionId: number) => {
    const { data } = await supabase
      .from('training_signups')
      .select('session_id,user_id,present')
      .eq('session_id', sessionId)
    setSignupsBySession((prev) => ({ ...prev, [sessionId]: data ?? [] }))
  }

  useEffect(() => {
    load()
  }, [])

  const isOwner = (s: TrainingSession) => currentUserId && s.created_by === currentUserId

  const beginEdit = (s: TrainingSession) => {
    setEditingId(s.id)
    // Convert ISO string to local input format yyyy-MM-ddTHH:mm
    const dt = new Date(s.starts_at)
    const local = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
    setEditStartsAt(local.toISOString().slice(0, 16))
    setEditLocation(s.location)
    setEditDescription(s.description ?? '')
    setEditNote(s.note ?? '')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditStartsAt('')
    setEditLocation('')
    setEditDescription('')
    setEditNote('')
  }

  const saveEdit = async (id: number) => {
    const { error } = await supabase
      .from('training_sessions')
      .update({
        starts_at: new Date(editStartsAt).toISOString(),
        location: editLocation,
        description: editDescription || null,
        note: editNote || null,
      })
      .eq('id', id)
    if (!error) {
      await load()
      cancelEdit()
    }
  }

  const deleteSession = async (id: number) => {
    const { error } = await supabase.from('training_sessions').delete().eq('id', id)
    if (!error) await load()
  }

  const signUp = async (sessionId: number) => {
    if (!currentUserId) return
    const { error } = await supabase
      .from('training_signups')
      .insert({ session_id: sessionId, user_id: currentUserId })
    if (!error) await loadSignups(sessionId)
  }

  const withdraw = async (sessionId: number) => {
    if (!currentUserId) return
    const { error } = await supabase
      .from('training_signups')
      .delete()
      .match({ session_id: sessionId, user_id: currentUserId })
    if (!error) await loadSignups(sessionId)
  }

  const hasSignedUp = (sessionId: number) => {
    const list = signupsBySession[sessionId] ?? []
    return !!list.find((s) => s.user_id === currentUserId)
  }

  const setAttendance = async (sessionId: number, userId: string, present: boolean | null) => {
    // Owner-only in RLS; UI only shows for owners
    const { error } = await supabase
      .from('training_signups')
      .update({ present })
      .match({ session_id: sessionId, user_id: userId })
    if (!error) await loadSignups(sessionId)
  }

  const cancelSession = async (id: number) => {
    const { error } = await supabase
      .from('training_sessions')
      .update({ cancelled_at: new Date().toISOString() })
      .eq('id', id)
    if (!error) await load()
  }

  const copySession = async (s: TrainingSession) => {
    const { error } = await supabase.from('training_sessions').insert({
      created_by: s.created_by,
      starts_at: s.starts_at,
      location: s.location,
      description: s.description,
      note: s.note,
    })
    if (!error) await load()
  }

  return (
    <div className="flex flex-col gap-3">
      {loading && <div className="text-sm text-muted-foreground">Loading sessions…</div>}
      {!loading && sessions.length === 0 && (
        <div className="text-sm text-muted-foreground">No upcoming sessions.</div>
      )}
      {!loading &&
        sessions.map((s) => (
          <Card key={s.id}>
            <CardContent className="p-4">
              {editingId === s.id ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm" htmlFor={`edit-dt-${s.id}`}>Date & Time</label>
                    <Input
                      id={`edit-dt-${s.id}`}
                      type="datetime-local"
                      value={editStartsAt}
                      onChange={(e) => setEditStartsAt(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm" htmlFor={`edit-loc-${s.id}`}>Location</label>
                    <Input
                      id={`edit-loc-${s.id}`}
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-3">
                    <label className="text-sm" htmlFor={`edit-desc-${s.id}`}>Description</label>
                    <Input
                      id={`edit-desc-${s.id}`}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-3">
                    <label className="text-sm" htmlFor={`edit-note-${s.id}`}>Note</label>
                    <Input
                      id={`edit-note-${s.id}`}
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 md:col-span-3">
                    <Button size="sm" onClick={() => saveEdit(s.id)}>Save</Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="flex flex-col">
                    <div className="font-medium">
                      {new Date(s.starts_at).toLocaleString()} • {s.location}
                    </div>
                    {s.description && (
                      <div className="text-sm text-muted-foreground">{s.description}</div>
                    )}
                    {s.note && (
                      <div className="text-xs text-muted-foreground">Note: {s.note}</div>
                    )}
                    {s.cancelled_at && (
                      <div className="text-xs text-destructive">Cancelled</div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {isOwner(s) && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => beginEdit(s)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => cancelSession(s.id)}>
                          Cancel
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => copySession(s)}>
                          Copy
                        </Button>
                      </>
                    )}
                    {!s.cancelled_at && hasSignedUp(s.id) ? (
                      <Button size="sm" variant="secondary" onClick={() => withdraw(s.id)}>
                        Withdraw
                      </Button>
                    ) : !s.cancelled_at ? (
                      <Button size="sm" onClick={() => signUp(s.id)}>Sign up</Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        Sign up
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => loadSignups(s.id)}
                    >
                      View attendees
                    </Button>
                  </div>
                </div>
              )}

              {(signupsBySession[s.id]?.length ?? 0) > 0 && (
                <div className="mt-3 text-sm">
                  <div className="font-medium mb-1">Attendees</div>
                  <ul className="list-disc ml-5">
                    {signupsBySession[s.id]!.map((a) => (
                      <li key={a.user_id} className="text-muted-foreground flex items-center gap-3">
                        <span className="min-w-0 break-all">{a.user_id}</span>
                        {isOwner(s) && (
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant={a.present === true ? 'default' : 'outline'} onClick={() => setAttendance(s.id, a.user_id, true)}>Present</Button>
                            <Button size="sm" variant={a.present === false ? 'destructive' : 'outline'} onClick={() => setAttendance(s.id, a.user_id, false)}>Absent</Button>
                            <Button size="sm" variant={a.present === null || a.present === undefined ? 'secondary' : 'outline'} onClick={() => setAttendance(s.id, a.user_id, null)}>Unset</Button>
                          </div>
                        )}
                        {!isOwner(s) && (
                          <span className="text-xs text-muted-foreground">{a.present === true ? 'Present' : a.present === false ? 'Absent' : '—'}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
    </div>
  )
}


