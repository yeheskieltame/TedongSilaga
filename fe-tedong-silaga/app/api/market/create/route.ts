import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Ekstrak data dari request Frontend
    const {
      market_address,
      event_name,
      buffalo_a_name,
      buffalo_b_name,
      arena_name,
      embed_poster,
      url_embed_buffalo_a,
      url_embed_buffalo_b,
    } = body;

    // Validasi dasar (pastikan data yang wajib tidak kosong)
    if (!market_address || !event_name || !buffalo_a_name || !buffalo_b_name || !arena_name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert data ke tabel 'markets' di Supabase
    const { data, error } = await supabase
      .from("markets")
      .insert([
        {
          market_address,
          event_name,
          buffalo_a_name,
          buffalo_b_name,
          arena_name,
          embed_poster,
          url_embed_buffalo_a,
          url_embed_buffalo_b,
        },
      ])
      .select(); // Mengembalikan data yang berhasil di-insert

    // Cek jika ada error dari Supabase (misal market_address duplikat)
    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save market to database", details: error.message },
        { status: 500 }
      );
    }

    // Respon sukses
    return NextResponse.json(
      { message: "Market saved successfully!", data },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
