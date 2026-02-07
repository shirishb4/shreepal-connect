
-- Enable RLS on pre-existing tables
ALTER TABLE public.document_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Allow public read access to documents (they are public society documents)
CREATE POLICY "Anyone can view document metadata"
  ON public.document_metadata FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view document rows"
  ON public.document_rows FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view documents"
  ON public.documents FOR SELECT
  USING (true);
