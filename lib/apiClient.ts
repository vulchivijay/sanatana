/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
// Client-side helper to call a remote API instead of local app routes.
// Configure the base URL via the environment variable `NEXT_PUBLIC_API_BASE`.

export const apiBase = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/$/, "");

function buildUrl(path: string) {
  if (!apiBase) return path.startsWith("/") ? path : `/${path}`;
  const p = path.startsWith("/") ? path.slice(1) : path;
  return `${apiBase}/${p}`;
}

export async function fetchItems() {
  const url = buildUrl('/api/items');
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error(`Failed to fetch items (${res.status})`);
  return res.json();
}

export async function createItem(body: Record<string, unknown>) {
  const url = buildUrl('/api/items');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Failed to create item (${res.status})`);
  return res.json();
}

export async function fetchItem(id: string) {
  const url = buildUrl(`/api/items/${id}`);
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error(`Failed to fetch item ${id} (${res.status})`);
  return res.json();
}

export async function updateItem(id: string, body: Record<string, unknown>) {
  const url = buildUrl(`/api/items/${id}`);
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Failed to update item ${id} (${res.status})`);
  return res.json();
}

export async function deleteItem(id: string) {
  const url = buildUrl(`/api/items/${id}`);
  const res = await fetch(url, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete item ${id} (${res.status})`);
  return res.json();
}
/* Copyright (c) 2025 sanatanadharmam.in Licensed under SEE LICENSE IN LICENSE. All rights reserved. */
