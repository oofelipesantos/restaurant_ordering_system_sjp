-- Restaurant Ordering System
-- Estrutura exportada do PostgreSQL/Supabase.
-- Execute este arquivo no SQL Editor do Supabase para criar as tabelas.

create extension if not exists pgcrypto;

create table if not exists public.categories (
    id uuid not null default gen_random_uuid(),
    name character varying not null,
    description character varying,
    icon character varying,
    display_order integer not null,
    active boolean not null default true,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    constraint categories_pkey primary key (id)
);

create table if not exists public.products (
    id uuid not null default gen_random_uuid(),
    category_id uuid not null,
    title character varying not null,
    description character varying,
    price numeric not null,
    image character varying,
    available boolean not null default true,
    active boolean not null default true,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    constraint products_pkey primary key (id),
    constraint fk_products_category
        foreign key (category_id) references public.categories(id)
);

create table if not exists public.orders (
    id uuid not null default gen_random_uuid(),
    status text not null default 'pending'
        check (status in ('pending', 'preparing', 'ready', 'delivered', 'cancelled')),
    created_at timestamp with time zone default now(),
    constraint orders_pkey primary key (id)
);

create table if not exists public.order_items (
    id uuid not null default gen_random_uuid(),
    order_id uuid not null,
    product_id uuid not null,
    quantity integer not null check (quantity > 0),
    unit_price numeric not null check (unit_price >= 0),
    constraint order_items_pkey primary key (id),
    constraint order_items_order_id_fkey
        foreign key (order_id) references public.orders(id),
    constraint order_items_product_id_fkey
        foreign key (product_id) references public.products(id)
);

-- A chave secreta utilizada pela API deve permanecer somente no servidor.
-- RLS e suas policies devem ser configuradas no Supabase conforme o ambiente.
