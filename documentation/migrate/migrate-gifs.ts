import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import path from "path";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SERVICE_ROLE_KEY;

// Cliente de Supabase
const supabase = createClient(supabaseUrl!, supabaseKey!);

async function migrateGifs() {
  try {
    const { data: exercises, error } = await supabase
      .from("exercises")
      .select("id, name, gif_url")
      .limit(1400); // Cambialo o agregá filtros si ya migraste algunos

    if (error) throw error;

    for (const exercise of exercises) {
      const response = await axios.get(exercise.gif_url, {
        responseType: "arraybuffer",
      });

      const buffer = Buffer.from(response.data, "binary");
      const fileExt = path.extname(exercise.gif_url).split("?")[0] || ".gif";
      const fileName = `${exercise.id}-${exercise.name
        .replace(/\s+/g, "-")
        .toLowerCase()}${fileExt}`;
      const filePath = `exercise-gifs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("exercise-gifs")
        .upload(filePath, buffer, {
          contentType: "image/gif",
          upsert: true,
        });

      if (uploadError) {
        console.error(`❌ Upload failed for ${fileName}:`, uploadError);
        continue;
      }

      const { data } = supabase.storage
        .from("exercise-gifs")
        .getPublicUrl(filePath);

      await supabase
        .from("exercises")
        .update({ gif_url: data.publicUrl })
        .eq("id", exercise.id);

      console.log(`✅ Migrated: ${exercise.name}`);
    }

    console.log("🎉 Migration finished.");
  } catch (err) {
    console.error("❌ Migration error:", err);
  }
}

migrateGifs();
