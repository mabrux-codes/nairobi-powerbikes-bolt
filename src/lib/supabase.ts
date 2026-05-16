import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Brand = {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  description: string;
  country_of_origin: string;
  website_url: string;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
};

export type Bike = {
  id: string;
  brand_id: string | null;
  name: string;
  slug: string;
  model_year: number;
  price: number;
  original_price: number | null;
  engine_size: string;
  bike_type: 'sports' | 'naked' | 'adventure' | 'cruiser' | 'touring' | 'supermoto' | 'scooter' | 'other';
  condition: 'new' | 'used' | 'demo';
  mileage: number;
  transmission: 'manual' | 'automatic' | 'semi-automatic';
  color: string;
  fuel_type: string;
  power: string;
  torque: string;
  weight: string;
  seat_height: string;
  fuel_capacity: string;
  top_speed: string;
  description: string;
  seller_notes: string;
  status: 'available' | 'reserved' | 'sold';
  is_featured: boolean;
  financing_available: boolean;
  views: number;
  cover_image_url: string;
  created_at: string;
  updated_at: string;
  brand?: Brand;
  bike_images?: BikeImage[];
};

export type BikeImage = {
  id: string;
  bike_id: string;
  image_url: string;
  sort_order: number;
  is_cover: boolean;
  created_at: string;
};

export type Booking = {
  id: string;
  bike_id: string | null;
  user_id: string | null;
  full_name: string;
  phone: string;
  email: string;
  preferred_date: string;
  preferred_time: string;
  license_url: string;
  notes: string;
  status: 'pending' | 'approved' | 'rescheduled' | 'cancelled' | 'completed';
  admin_notes: string;
  created_at: string;
  updated_at: string;
  bike?: Bike;
};

export type Inquiry = {
  id: string;
  bike_id: string | null;
  user_id: string | null;
  full_name: string;
  phone: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  admin_reply: string;
  created_at: string;
  bike?: Bike;
};

export type Testimonial = {
  id: string;
  user_name: string;
  user_avatar_url: string;
  bike_purchased: string;
  rating: number;
  review: string;
  is_featured: boolean;
  is_approved: boolean;
  created_at: string;
};

export type WishlistItem = {
  id: string;
  user_id: string;
  bike_id: string;
  created_at: string;
  bike?: Bike;
};

export type Profile = {
  id: string;
  full_name: string;
  phone: string;
  avatar_url: string;
  address: string;
  created_at: string;
  updated_at: string;
};
