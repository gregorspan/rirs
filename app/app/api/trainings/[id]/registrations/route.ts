import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/trainings/[id]/registrations - Get all registrations for a training
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: registrations, error } = await supabase
      .from('training_registrations')
      .select(`
        *,
        player:profiles!training_registrations_player_id_fkey(id, full_name, email)
      `)
      .eq('training_id', id)
      .order('registered_at', { ascending: true });

    if (error) {
      console.error('Error fetching registrations:', error);
      return NextResponse.json(
        { error: "Failed to fetch registrations" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: registrations });
  } catch (error) {
    console.error('Error in GET /api/trainings/[id]/registrations:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/trainings/[id]/registrations - Register for a training
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id: trainingId } = await params;
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if training exists
    const { data: training, error: trainingError } = await supabase
      .from('trainings')
      .select('id')
      .eq('id', trainingId)
      .single();

    if (trainingError || !training) {
      return NextResponse.json(
        { error: "Training not found" },
        { status: 404 }
      );
    }

    // Check if already registered
    const { data: existingRegistration } = await supabase
      .from('training_registrations')
      .select('id')
      .eq('training_id', trainingId)
      .eq('player_id', user.id)
      .single();

    if (existingRegistration) {
      return NextResponse.json(
        { error: "Already registered for this training" },
        { status: 400 }
      );
    }

    // Register
    const { data: registration, error } = await supabase
      .from('training_registrations')
      .insert({
        training_id: trainingId,
        player_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating registration:', error);
      return NextResponse.json(
        { error: "Failed to register for training" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: registration }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/trainings/[id]/registrations:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/trainings/[id]/registrations - Unregister from a training
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id: trainingId } = await params;
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { error } = await supabase
      .from('training_registrations')
      .delete()
      .eq('training_id', trainingId)
      .eq('player_id', user.id);

    if (error) {
      console.error('Error deleting registration:', error);
      return NextResponse.json(
        { error: "Failed to unregister from training" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Unregistered successfully" });
  } catch (error) {
    console.error('Error in DELETE /api/trainings/[id]/registrations:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

