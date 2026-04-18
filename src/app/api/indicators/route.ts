import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const supabase = createAdminClient();
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const mode = searchParams.get("mode"); // "pending" | "accepted" | "deleted" | undefined (public)

  let query = supabase
    .from("indicators")
    .select("*, indicator_likes(like_id, liker_account_id, liker_account_name)")
    .order("created_at", { ascending: false });

  if (mode === "pending") {
    query = query.eq("is_default", true).eq("is_accepted", false).eq("is_deleted", false);
  } else if (mode === "accepted") {
    query = query.eq("is_accepted", true).eq("is_deleted", false).eq("is_confirm_deleted", false);
  } else if (mode === "deleted") {
    query = query.eq("is_deleted", true);
  } else {
    // Public: show accepted, non-deleted
    query = query.eq("is_accepted", true).eq("is_deleted", false).eq("is_confirm_deleted", false);
  }

  if (category) {
    query = query.eq("related_process", category);
  }

  if (search) {
    query = query.or(
      `indicator_name.ilike.%${search}%,indicator_definition.ilike.%${search}%,indicator_tag.ilike.%${search}%`
    );
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from("indicators")
    .insert({
      indicator_name: body.indicator_name,
      indicator_definition: body.indicator_definition,
      direction: body.direction,
      measurement: body.measurement,
      related_process: body.related_process,
      related_other_process: body.related_other_process ?? "",
      indicator_tag: body.indicator_tag ?? "",
      indicator_related_management_system: body.indicator_related_management_system ?? "",
      constituent_name: body.constituent_name ?? "",
      organization_name: body.organization_name ?? "",
      is_default: false,
      is_accepted: false,
      is_deleted: false,
      is_confirm_deleted: false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
