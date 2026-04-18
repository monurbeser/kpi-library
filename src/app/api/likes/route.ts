import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const supabase = createAdminClient();
  const { indicator_id, liker_account_id, liker_account_name } = await req.json();

  if (!indicator_id || !liker_account_id) {
    return NextResponse.json({ error: "Eksik parametre" }, { status: 400 });
  }

  // Toggle: var mı kontrol et
  const { data: existing } = await supabase
    .from("indicator_likes")
    .select("like_id")
    .eq("indicator_id", indicator_id)
    .eq("liker_account_id", liker_account_id)
    .single();

  if (existing) {
    // Unlike
    const { error } = await supabase
      .from("indicator_likes")
      .delete()
      .eq("like_id", existing.like_id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ action: "unliked" });
  } else {
    // Like
    const { error } = await supabase.from("indicator_likes").insert({
      indicator_id,
      liker_account_id,
      liker_account_name: liker_account_name ?? liker_account_id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ action: "liked" });
  }
}
