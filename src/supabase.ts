import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://daemnhbpcgqtjyeiwmsg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZW1uaGJwY2dxdGp5ZWl3bXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzgyNzQ5MDEsImV4cCI6MTk5Mzg1MDkwMX0.WRV0hB6axa0Tdoo5injuhWSlxlUxjFXuDaD0ALN3pQ4"
);

export default supabase;
