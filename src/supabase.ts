import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://icdaesacokskotjodojf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljZGFlc2Fjb2tza290am9kb2pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjY0Mjg2MDMsImV4cCI6MTk4MjAwNDYwM30.tpvafDkBKS7ZBNH43NergCIBBeHExbolMOkzjo2kxDE"
);

export interface InsertBudgetData {
  title: string;
  is_pinned: boolean;
}

export default supabase;
