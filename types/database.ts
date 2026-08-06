export interface Shop {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  currency: string;
  created_at: string;
}

export interface Preset {
  id: string;
  shop_id: string;
  name: string;
  category: 'document' | 'id_card' | 'merchandise' | 'large_format';
  paper_type: string | null;
  width_inches: number | null;
  height_inches: number | null;
  default_side_option: 'one_sided' | 'two_sided';
  is_active: boolean;
}

export interface PricingMatrix {
  id: string;
  preset_id: string;
  name: string;
  unit: 'per_page' | 'per_sqft' | 'per_sqin' | 'flat_rate' | 'per_unit';
  color_mode: 'grayscale' | 'colored_light' | 'colored_heavy' | 'any';
  min_quantity: number;
  max_quantity: number | null;
  unit_price: number;
  rush_multiplier: number;
}

export interface PresetWithMatrix extends Preset {
  pricing_matrices?: PricingMatrix[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  preset_id: string;
  quantity: number;
  file_url: string | null;
  file_name: string | null;
  unit_price: number;
  subtotal: number;
  presets?: Preset;
}

export interface Order {
  id: string;
  shop_id: string;
  order_number: string;
  status: 'pending' | 'approved' | 'printing' | 'finishing' | 'ready' | 'completed' | 'cancelled';
  payment_status: 'unpaid' | 'partial' | 'paid';
  total_amount: number;
  customer_name: string;
  customer_contact: string | null;
  is_rush: boolean;
  created_at: string;
  order_items?: OrderItem[];
}
