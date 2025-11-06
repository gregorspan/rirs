'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Row = {
  session_id: number
  starts_at: string
  location: string
  description: string | null
  present: boolean | null
}

export function TrainingHistory() {
  const supabase = useMemo(() => createClient(), [])
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUserId(data.user.id)
    })
  }, [supabase])

  useEffect(() => {
    const load = async () => {
      if (!userId) return
      setLoading(true)
      // Join signups with sessions, filtered by current user
      const { data } = await supabase
        .from('training_signups')
        .select('session_id,present,training_sessions(id,starts_at,location,description)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      const mapped: Row[] = (data ?? []).map((r: any) => ({
        session_id: r.session_id,
        starts_at: r.training_sessions.starts_at,
        location: r.training_sessions.location,
        description: r.training_sessions.description,
        present: r.present ?? null,
      }))
      setRows(mapped)
      setLoading(false)
    }
    load()
  }, [supabase, userId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>My training history</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <div className="text-sm text-muted-foreground">Loading…</div>}
        {!loading && rows.length === 0 && (
          <div className="text-sm text-muted-foreground">No sessions yet.</div>
        )}
        {!loading && rows.length > 0 && (
          <div className="flex flex-col gap-2">
            {rows.map((r) => (
              <div key={`${r.session_id}-${r.starts_at}`} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{new Date(r.starts_at).toLocaleString()} • {r.location}</div>
                  {r.description && <div className="text-sm text-muted-foreground">{r.description}</div>}
                </div>
                <div className="text-sm">
                  {r.present === true ? 'Present' : r.present === false ? 'Absent' : '—'}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}


