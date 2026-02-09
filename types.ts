
export interface MenuItem {
  id: string;
  name: string;
  price: string;
  numericPrice: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  timestamp: number;
  status: 'pending' | 'completed';
}

export type AppView = 'customer' | 'admin-login' | 'admin-dashboard';
