ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS edad INTEGER,
  ADD COLUMN IF NOT EXISTS sexo TEXT,
  ADD COLUMN IF NOT EXISTS comuna TEXT;

CREATE INDEX IF NOT EXISTS activity_logs_user_fecha_idx
  ON public.activity_logs (user_id, fecha_ejecucion DESC);