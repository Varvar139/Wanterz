import { Cpu, Gem, ToyBrick, type LucideIcon } from 'lucide-react';
import type { Category } from '@/types';

const MAP: Record<Category, LucideIcon> = {
  Tech: Cpu,
  Toys: ToyBrick,
  Collectibles: Gem,
};

export function categoryIcon(name: Category): LucideIcon {
  return MAP[name];
}
