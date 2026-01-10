export type CropOption = 'rice' | 'wheat' | 'corn' | 'tomato' | 'potato' | 'cotton';

export interface BuyerRequirement {
  id: string;
  buyerUserId: string;
  buyerName: string;
  crop: CropOption;
  quantityTons: number;
  priceRange: string;
  location: string;
  deliveryDateISO: string;
  contactPhone: string;
  email?: string;
  description?: string;
  status: 'Active' | 'Completed';
  postedDateISO: string;
}

const STORAGE_KEY = 'marketplace:requirements:v1';
import { buyerNeedsApi } from './api';

export async function getAllRequirements(): Promise<BuyerRequirement[]> {
  try {
    const resp = await buyerNeedsApi.getAll();
    if (resp.error || !resp.data) return [];
    return resp.data.map((r: any) => ({
      id: r.id.toString(),
      buyerUserId: r.buyer_id ? r.buyer_id.toString() : (r.buyer_email || 'unknown'),
      buyerName: r.buyer_email || 'Buyer',
      crop: (r.crop_name || '') as any,
      quantityTons: parseFloat(r.quantity) || 0,
      priceRange: r.expected_price || '',
      location: r.location || '',
      deliveryDateISO: r.delivery_date ? new Date(r.delivery_date).toISOString() : new Date(r.created_at).toISOString(),
      contactPhone: r.contact_phone || '',
      email: r.buyer_email || undefined,
      description: r.description || undefined,
      status: 'Active',
      postedDateISO: r.created_at
    }));
  } catch (err) {
    console.error('getAllRequirements error', err);
    return [];
  }
}

export async function addRequirement(item: BuyerRequirement) {
  try {
    const payload = {
      crop_name: item.crop,
      quantity: item.quantityTons,
      location: item.location,
      expected_price: item.priceRange,
      delivery_date: item.deliveryDateISO ? new Date(item.deliveryDateISO).toISOString().slice(0,10) : null,
      contact_phone: item.contactPhone,
      description: item.description,
    };
    const resp = await buyerNeedsApi.create(payload);
    if (resp.error || !resp.data) throw new Error(resp.error?.message || 'Failed to create requirement');
    return resp.data;
  } catch (err) {
    console.error('addRequirement error', err);
    // Fallback to local storage for offline/demo
    const raw = localStorage.getItem(STORAGE_KEY);
    const all = raw ? JSON.parse(raw) as BuyerRequirement[] : [];
    all.unshift(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return item;
  }
}

export async function getRequirementsByUser(userId: string): Promise<BuyerRequirement[]> {
  try {
    const resp = await buyerNeedsApi.getMine();
    if (resp.error || !resp.data) return [];
    return resp.data.map((r: any) => ({
      id: r.id.toString(),
      buyerUserId: r.buyer_id ? r.buyer_id.toString() : (r.buyer_email || 'unknown'),
      buyerName: r.buyer_email || 'Buyer',
      crop: (r.crop_name || '') as any,
      quantityTons: parseFloat(r.quantity) || 0,
      priceRange: r.expected_price || '',
      location: r.location || '',
      deliveryDateISO: r.delivery_date ? new Date(r.delivery_date).toISOString() : new Date(r.created_at).toISOString(),
      contactPhone: r.contact_phone || '',
      email: r.buyer_email || undefined,
      description: r.description || undefined,
      status: 'Active',
      postedDateISO: r.created_at
    }));
  } catch (err) {
    console.error('getRequirementsByUser error', err);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const data = JSON.parse(raw) as BuyerRequirement[];
      return Array.isArray(data) ? data.filter(r => r.buyerUserId === userId) : [];
    } catch {
      return [];
    }
  }
}

export function seedIfEmpty(seed: BuyerRequirement[]) {
  const all = (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) as BuyerRequirement[] : [];
    } catch { return []; }
  })();
  if (all.length === 0) localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
}
