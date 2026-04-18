import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createAdminClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from("indicators")
    .update(body)
    .eq("indicator_id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createAdminClient();
  const { searchParams } = new URL(req.url);
  const permanent = searchParams.get("permanent") === "true";

  const update = permanent
    ? { is_confirm_deleted: true }
    : { is_deleted: true };

  const { error } = await supabase
    .from("indicators")
    .update(update)
    .eq("indicator_id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
