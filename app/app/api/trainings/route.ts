import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/trainings - Get all trainings
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const upcoming = searchParams.get('upcoming');

    let query = supabase
      .from('trainings')
      .select(`
        *,
        coach:profiles!trainings_coach_id_fkey(id, full_name, email)
      `)
      .order('training_date', { ascending: true })
      .order('training_time', { ascending: true });

    // Filter for upcoming trainings only
    if (upcoming === 'true') {
      const today = new Date().toISOString().split('T')[0];
      query = query.gte('training_date', today);
    }

    const { data: trainings, error } = await query;

    if (error) {
      console.error('Error fetching trainings:', error);
      return NextResponse.json(
        { error: "Failed to fetch trainings" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: trainings });
  } catch (error) {
    console.error('Error in GET /api/trainings:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/trainings - Create a new training
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is a coach or admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || (profile.role !== 'coach' && profile.role !== 'admin')) {
      return NextResponse.json(
        { error: "Only coaches can create trainings" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, location, training_date, training_time } = body;

    // Validation
    if (!title || !location || !training_date || !training_time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: training, error } = await supabase
      .from('trainings')
      .insert({
        coach_id: user.id,
        title,
        description,
        location,
        training_date,
        training_time,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating training:', error);
      return NextResponse.json(
        { error: "Failed to create training" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: training }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/trainings:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

