import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/trainings/[id] - Get a single training
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

    const { data: training, error } = await supabase
      .from('trainings')
      .select(`
        *,
        coach:profiles!trainings_coach_id_fkey(id, full_name, email)
      `)
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Training not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: training });
  } catch (error) {
    console.error('Error in GET /api/trainings/[id]:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/trainings/[id] - Update a training
export async function PUT(
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

    // Check if user owns this training
    const { data: existingTraining } = await supabase
      .from('trainings')
      .select('coach_id')
      .eq('id', id)
      .single();

    if (!existingTraining || existingTraining.coach_id !== user.id) {
      return NextResponse.json(
        { error: "Forbidden - You can only edit your own trainings" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, location, training_date, training_time } = body;

    const { data: training, error } = await supabase
      .from('trainings')
      .update({
        title,
        description,
        location,
        training_date,
        training_time,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating training:', error);
      return NextResponse.json(
        { error: "Failed to update training" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: training });
  } catch (error) {
    console.error('Error in PUT /api/trainings/[id]:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/trainings/[id] - Delete a training
export async function DELETE(
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

    // Check if user owns this training
    const { data: existingTraining } = await supabase
      .from('trainings')
      .select('coach_id')
      .eq('id', id)
      .single();

    if (!existingTraining || existingTraining.coach_id !== user.id) {
      return NextResponse.json(
        { error: "Forbidden - You can only delete your own trainings" },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from('trainings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting training:', error);
      return NextResponse.json(
        { error: "Failed to delete training" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Training deleted successfully" });
  } catch (error) {
    console.error('Error in DELETE /api/trainings/[id]:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

