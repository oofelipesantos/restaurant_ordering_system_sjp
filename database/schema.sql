-- Restaurant Ordering System
-- Execute este arquivo no SQL Editor do Supabase.

create extension if not exists pgcrypto;

create table if not exists public.categories (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text,
    icon text,
    display_order integer not null default 0 check (display_order >= 0),
    active boolean not null default true,
    created_at timestamptz not null default now(),
    constraint categories_name_unique unique (name)
);

create table if not exists public.products (
    id uuid primary key default gen_random_uuid(),
    category_id uuid not null references public.categories(id) on delete restrict,
    title text not null,
    description text,
    price numeric(10, 2) not null check (price >= 0),
    image text,
    available boolean not null default true,
    active boolean not null default true,
    created_at timestamptz not null default now()
);

create table if not exists public.orders (
    id uuid primary key default gen_random_uuid(),
    status text not null default 'pending'
        check (status in ('pending', 'preparing', 'ready', 'delivered', 'cancelled')),
    created_at timestamptz not null default now()
);

create table if not exists public.order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references public.orders(id) on delete cascade,
    product_id uuid not null references public.products(id) on delete restrict,
    quantity integer not null check (quantity > 0),
    unit_price numeric(10, 2) not null check (unit_price >= 0),
    created_at timestamptz not null default now(),
    constraint order_items_order_product_unique unique (order_id, product_id)
);

create index if not exists products_category_id_idx
    on public.products(category_id);
create index if not exists products_title_idx
    on public.products(title);
create index if not exists orders_status_idx
    on public.orders(status);
create index if not exists order_items_order_id_idx
    on public.order_items(order_id);
create index if not exists order_items_product_id_idx
    on public.order_items(product_id);

-- A API utiliza uma chave secreta do servidor, que ignora RLS.
-- Nenhuma chave secreta deve ser enviada ao navegador ou versionada no Git.
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
