import {
  BillsIcon,
  BriefcaseIcon,
  CoinsIcon,
  EntertainmentIcon,
  FoodIcon,
  GiftIcon,
  HealthIcon,
  ShoppingIcon,
  TagIcon,
  TransportIcon,
  TrendsIcon,
  WalletIcon
} from '../components/icons';

// Keyed by the app's default category names, lower-cased. A household can
// rename or add its own categories, so anything not in this map — including
// every custom one — falls back to a plain tag glyph rather than guessing.
const MAP = {
  food: FoodIcon,
  transport: TransportIcon,
  bills: BillsIcon,
  entertainment: EntertainmentIcon,
  shopping: ShoppingIcon,
  health: HealthIcon,
  salary: WalletIcon,
  freelance: BriefcaseIcon,
  business: BriefcaseIcon,
  investment: TrendsIcon,
  gift: GiftIcon,
  saving: CoinsIcon,
  savings: CoinsIcon
};

/** The icon component for a category name, or a generic tag as a fallback. */
export function getCategoryIcon(category) {
  return MAP[(category || '').trim().toLowerCase()] || TagIcon;
}
