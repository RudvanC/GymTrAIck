import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uyohcowxpzfslhirbdre.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5b2hjb3d4cHpmc2xoaXJiZHJlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODkzOTE4NCwiZXhwIjoyMDY0NTE1MTg0fQ.wkwUlvqnVDRU2phgFEMv9rpA0KNkxMZWrAcesBiz3Yc'; // no lo subas al repo
const supabase = createClient(supabaseUrl, supabaseKey);

const bucketBaseUrl = 'https://uyohcowxpzfslhirbdre.supabase.co/storage/v1/object/public/exercise-gifs/exercise-gifs/';

async function updateGifUrls() {
  // Trae todos los ejercicios (o por lotes)
  const { data: exercises, error } = await supabase
    .from('exercises')
    .select('id, gif_url');

  if (error) {
    console.error('Error fetching exercises:', error);
    return;
  }

  for (const exercise of exercises) {
    if (!exercise.gif_url) continue;

    // Extrae el nombre del archivo del gif_url actual
    // Esto asume que gif_url tiene un string con un nombre de archivo al final
    const parts = exercise.gif_url.split('/');
    const fileName = parts[parts.length - 1]; // ejemplo: '0003-air-bike.gif'

    const newUrl = bucketBaseUrl + fileName;

    // Actualiza la fila en la DB
    const { error: updateError } = await supabase
      .from('exercises')
      .update({ gif_url: newUrl })
      .eq('id', exercise.id);

    if (updateError) {
      console.error(`Error updating exercise ID ${exercise.id}:`, updateError);
    } else {
      console.log(`Updated exercise ID ${exercise.id} gif_url.`);
    }
  }

  console.log('Update finished.');
}

updateGifUrls();
