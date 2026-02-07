-- Events Table
create table events (
  id text primary key,
  created_at timestamptz default now(),
  status text check (status in ('review', 'pending', 'resolved')),
  vendor text,
  location text,
  type text,
  price numeric,
  satisfaction text check (satisfaction in ('good', 'bad')),
  notes text,
  review_notes text 
);

-- Vendors Table
create table vendors (
  id text primary key,
  name text,
  location text,
  rating numeric,
  status text check (status in ('ok', 'warn', 'crit')),
  reliability int,
  joined_date text,
  address text,
  phone text,
  services text[]
);

-- Notifications Table
create table notifications (
  id text primary key,
  title text,
  message text,
  type text check (type in ('info', 'success', 'warning', 'error')),
  read boolean default false,
  timestamp text
);

-- Row Level Security (RLS) - Optional: Enable public access for demo
alter table events enable row level security;
alter table vendors enable row level security;
alter table notifications enable row level security;

create policy "Public Access" on events for all using (true);
create policy "Public Access" on vendors for all using (true);
create policy "Public Access" on notifications for all using (true);
