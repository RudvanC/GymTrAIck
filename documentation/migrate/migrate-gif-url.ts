import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const bucketBaseUrl =
  "https://uyohcowxpzfslhirbdre.supabase.co/storage/v1/object/public/exercise-gifs/exercise-gifs/";

async function updateGifUrls() {
  // Trae todos los ejercicios (o por lotes)
  const { data: exercises, error } = await supabase
    .from("exercises")
    .select("id, gif_url");

  if (error) {
    console.error("Error fetching exercises:", error);
    return;
  }

  for (const exercise of exercises) {
    if (!exercise.gif_url) continue;

    // Extrae el nombre del archivo del gif_url actual
    // Esto asume que gif_url tiene un string con un nombre de archivo al final
    const parts = exercise.gif_url.split("/");
    const fileName = parts[parts.length - 1]; // ejemplo: '0003-air-bike.gif'

    const newUrl = bucketBaseUrl + fileName;

    // Actualiza la fila en la DB
    const { error: updateError } = await supabase
      .from("exercises")
      .update({ gif_url: newUrl })
      .eq("id", exercise.id);

    if (updateError) {
      console.error(`Error updating exercise ID ${exercise.id}:`, updateError);
    } else {
      console.log(`Updated exercise ID ${exercise.id} gif_url.`);
    }
  }

  console.log("Update finished.");
}

updateGifUrls();
