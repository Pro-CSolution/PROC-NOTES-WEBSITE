create table if not exists public.app_state (
  id text primary key,
  clients jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

drop policy if exists "Authenticated users can read tracker data" on public.app_state;
drop policy if exists "Authenticated users can create tracker data" on public.app_state;
drop policy if exists "Authenticated users can update tracker data" on public.app_state;

create policy "Authenticated users can read tracker data"
on public.app_state
for select
to authenticated
using (
  lower(auth.jwt() ->> 'email') in (
    'estebanc@procsolution.com',
    'melissaa@procsolution.com'
  )
);

create policy "Authenticated users can create tracker data"
on public.app_state
for insert
to authenticated
with check (
  lower(auth.jwt() ->> 'email') in (
    'estebanc@procsolution.com',
    'melissaa@procsolution.com'
  )
);

create policy "Authenticated users can update tracker data"
on public.app_state
for update
to authenticated
using (
  lower(auth.jwt() ->> 'email') in (
    'estebanc@procsolution.com',
    'melissaa@procsolution.com'
  )
)
with check (
  lower(auth.jwt() ->> 'email') in (
    'estebanc@procsolution.com',
    'melissaa@procsolution.com'
  )
);
