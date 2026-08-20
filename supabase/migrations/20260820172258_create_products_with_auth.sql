/*
# Create products table with user-owned listings

1. New Tables
- `products` — marketplace listings owned by authenticated users
  - `id` (uuid, primary key)
  - `user_id` (uuid, NOT NULL, defaults to auth.uid(), references auth.users with cascade delete)
  - `name` (text, not null) — product title
  - `description` (text, not null) — product description
  - `price` (integer, not null) — price in AED
  - `category` (text, not null) — one of: Tech, Toys, Collectibles
  - `photos` (text[], default '{}') — array of photo data URLs
  - `location` (text, not null) — seller location
  - `availability` (text, default 'available') — 'available' or 'coming-soon'
  - `expected_date` (date, nullable) — expected date for coming-soon items
  - `payment_link` (text, nullable) — optional payment link for QR code scan-to-pay
  - `trending` (boolean, default false)
  - `created_at` (timestamptz, default now())

2. Security (RLS)
- Enable RLS on `products`.
- SELECT is public: anyone (anon + authenticated) can browse listings.
- INSERT/UPDATE/DELETE: authenticated users can only modify their own listings.
- Owner column `user_id` defaults to `auth.uid()` so inserts that omit it still pass the WITH CHECK.

3. Important Notes
- This is a multi-user app with sign-in. The frontend must build the full auth flow.
- Photos are stored as base64 data URLs in a text array for prototype simplicity.
- The `payment_link` field powers the QR code scan-to-pay feature on the product page.
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  price integer NOT NULL,
  category text NOT NULL,
  photos text[] NOT NULL DEFAULT '{}',
  location text NOT NULL,
  availability text NOT NULL DEFAULT 'available',
  expected_date date,
  payment_link text,
  trending boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read: anyone can browse listings
DROP POLICY IF EXISTS "public_select_products" ON products;
CREATE POLICY "public_select_products"
ON products FOR SELECT
TO anon, authenticated USING (true);

-- Owner-only insert
DROP POLICY IF EXISTS "insert_own_products" ON products;
CREATE POLICY "insert_own_products"
ON products FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

-- Owner-only update
DROP POLICY IF EXISTS "update_own_products" ON products;
CREATE POLICY "update_own_products"
ON products FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Owner-only delete
DROP POLICY IF EXISTS "delete_own_products" ON products;
CREATE POLICY "delete_own_products"
ON products FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- Index for sorting by created_at
CREATE INDEX IF NOT EXISTS products_created_at_idx ON products (created_at DESC);

-- Index for filtering by user (My Listings page)
CREATE INDEX IF NOT EXISTS products_user_id_idx ON products (user_id);
