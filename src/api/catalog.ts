import { api } from './client';

/** GET /api/v1/categories item — mirrors the backend CategoryResponse. */
export type Category = {
  id: number;
  name: string;
  /** predefined icon drawn by the app (e.g. "grill"); may be null when an image is uploaded */
  iconKey: string | null;
  /** uploaded icon image, relative path (use fileUrl()) */
  iconUrl: string | null;
  /** #RRGGBB */
  color: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
};

/** Active categories, already in the admin's order (sortOrder). Any logged-in account. */
export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/api/v1/categories');
  return data;
}
