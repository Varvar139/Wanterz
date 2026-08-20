export type Category = 'Tech' | 'Toys' | 'Collectibles';

export type Availability = 'available' | 'coming-soon';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // AED
  category: Category;
  photos: string[]; // data URLs
  location: string;
  availability: Availability;
  expectedDate?: string; // ISO date for coming-soon
  paymentLink?: string; // optional payment link for QR scan-to-pay
  createdAt: number;
  trending?: boolean;
}

export const CATEGORIES: { name: Category; icon: string }[] = [
  { name: 'Tech', icon: 'Cpu' },
  { name: 'Toys', icon: 'ToyBrick' },
  { name: 'Collectibles', icon: 'Gem' },
];
