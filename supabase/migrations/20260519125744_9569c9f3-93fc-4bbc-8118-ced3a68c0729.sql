
-- Guestbook
create table public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  message text not null,
  created_at timestamptz not null default now(),
  constraint guestbook_name_len check (char_length(name) between 1 and 60),
  constraint guestbook_location_len check (location is null or char_length(location) <= 80),
  constraint guestbook_message_len check (char_length(message) between 1 and 800)
);

alter table public.guestbook_entries enable row level security;

create policy "Guestbook is public to read"
  on public.guestbook_entries for select
  using (true);

create policy "Anyone can sign the guestbook"
  on public.guestbook_entries for insert
  with check (true);

create index guestbook_created_at_idx on public.guestbook_entries (created_at desc);

-- Contact messages
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now(),
  constraint contact_name_len check (char_length(name) between 1 and 100),
  constraint contact_email_len check (char_length(email) between 3 and 255),
  constraint contact_message_len check (char_length(message) between 1 and 2000)
);

alter table public.contact_messages enable row level security;

-- No public select policy: messages are private.
create policy "Anyone can send a contact message"
  on public.contact_messages for insert
  with check (true);
