import { Product, ProductCategory } from '@/types';

// Menu Images
import espressoImg from '@/assets/menu/espresso.jpg';
import cappuccinoImg from '@/assets/menu/cappuccino.jpg';
import latteImg from '@/assets/menu/latte.jpg';
import americanoImg from '@/assets/menu/americano.jpg';
import mochaImg from '@/assets/menu/mocha.jpg';
import coldBrewImg from '@/assets/menu/cold-brew.jpg';
import matchaImg from '@/assets/menu/matcha.jpg';
import chaiImg from '@/assets/menu/chai.jpg';
import croissantImg from '@/assets/menu/croissant.jpg';
import almondCroissantImg from '@/assets/menu/almond-croissant.jpg';
import painChocolatImg from '@/assets/menu/pain-chocolat.jpg';
import avocadoToastImg from '@/assets/menu/avocado-toast.jpg';
import clubSandwichImg from '@/assets/menu/club-sandwich.jpg';
import tiramisuImg from '@/assets/menu/tiramisu.jpg';
import cheesecakeImg from '@/assets/menu/cheesecake.jpg';

// Category Images
import coffeeCategory from '@/assets/categories/coffee.jpg';
import teaCategory from '@/assets/categories/tea.jpg';
import pastryCategory from '@/assets/categories/pastry.jpg';
import foodCategory from '@/assets/categories/food.jpg';
import dessertCategory from '@/assets/categories/dessert.jpg';

export const products: Product[] = [
  // Coffee
  {
    id: 'espresso',
    name: 'Espresso',
    description: 'Rich and bold single shot of pure coffee essence',
    price: 25000,
    image: espressoImg,
    category: 'coffee',
    isAvailable: true,
    sizes: [
      { id: 'single', name: 'Single', priceModifier: 0 },
      { id: 'double', name: 'Double', priceModifier: 10000 },
    ],
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    description: 'Espresso with steamed milk and velvety foam',
    price: 35000,
    image: cappuccinoImg,
    category: 'coffee',
    isAvailable: true,
    sizes: [
      { id: 'regular', name: 'Regular', priceModifier: 0 },
      { id: 'large', name: 'Large', priceModifier: 8000 },
    ],
    customizations: [
      { id: 'extra-shot', name: 'Extra Shot', price: 8000 },
      { id: 'oat-milk', name: 'Oat Milk', price: 5000 },
      { id: 'almond-milk', name: 'Almond Milk', price: 5000 },
    ],
  },
  {
    id: 'latte',
    name: 'Caffè Latte',
    description: 'Smooth espresso with creamy steamed milk',
    price: 38000,
    image: latteImg,
    category: 'coffee',
    isAvailable: true,
    sizes: [
      { id: 'regular', name: 'Regular', priceModifier: 0 },
      { id: 'large', name: 'Large', priceModifier: 8000 },
    ],
    customizations: [
      { id: 'extra-shot', name: 'Extra Shot', price: 8000 },
      { id: 'vanilla', name: 'Vanilla Syrup', price: 5000 },
      { id: 'caramel', name: 'Caramel Syrup', price: 5000 },
      { id: 'hazelnut', name: 'Hazelnut Syrup', price: 5000 },
    ],
  },
  {
    id: 'americano',
    name: 'Americano',
    description: 'Espresso diluted with hot water for a smooth taste',
    price: 28000,
    image: americanoImg,
    category: 'coffee',
    isAvailable: true,
    sizes: [
      { id: 'regular', name: 'Regular', priceModifier: 0 },
      { id: 'large', name: 'Large', priceModifier: 6000 },
    ],
  },
  {
    id: 'mocha',
    name: 'Caffè Mocha',
    description: 'Espresso, chocolate, steamed milk and whipped cream',
    price: 42000,
    image: mochaImg,
    category: 'coffee',
    isAvailable: true,
    sizes: [
      { id: 'regular', name: 'Regular', priceModifier: 0 },
      { id: 'large', name: 'Large', priceModifier: 10000 },
    ],
  },
  {
    id: 'cold-brew',
    name: 'Cold Brew',
    description: '24-hour steeped coffee, smooth and refreshing',
    price: 35000,
    image: coldBrewImg,
    category: 'coffee',
    isAvailable: true,
    sizes: [
      { id: 'regular', name: 'Regular', priceModifier: 0 },
      { id: 'large', name: 'Large', priceModifier: 8000 },
    ],
  },
  // Tea
  {
    id: 'matcha-latte',
    name: 'Matcha Latte',
    description: 'Premium Japanese matcha with creamy milk',
    price: 40000,
    image: matchaImg,
    category: 'tea',
    isAvailable: true,
    sizes: [
      { id: 'regular', name: 'Regular', priceModifier: 0 },
      { id: 'large', name: 'Large', priceModifier: 8000 },
    ],
  },
  {
    id: 'chai-latte',
    name: 'Chai Latte',
    description: 'Spiced tea blend with steamed milk',
    price: 38000,
    image: chaiImg,
    category: 'tea',
    isAvailable: true,
  },
  // Pastries
  {
    id: 'croissant',
    name: 'Butter Croissant',
    description: 'Flaky, buttery French pastry',
    price: 28000,
    image: croissantImg,
    category: 'pastry',
    isAvailable: true,
  },
  {
    id: 'almond-croissant',
    name: 'Almond Croissant',
    description: 'Croissant filled with almond cream',
    price: 35000,
    image: almondCroissantImg,
    category: 'pastry',
    isAvailable: true,
  },
  {
    id: 'pain-au-chocolat',
    name: 'Pain au Chocolat',
    description: 'Buttery pastry with dark chocolate',
    price: 32000,
    image: painChocolatImg,
    category: 'pastry',
    isAvailable: true,
  },
  // Sandwiches
  {
    id: 'avocado-toast',
    name: 'Avocado Toast',
    description: 'Sourdough with smashed avocado and poached egg',
    price: 55000,
    image: avocadoToastImg,
    category: 'sandwich',
    isAvailable: true,
  },
  {
    id: 'club-sandwich',
    name: 'Classic Club',
    description: 'Triple-decker with chicken, bacon, and fresh veggies',
    price: 65000,
    image: clubSandwichImg,
    category: 'sandwich',
    isAvailable: true,
  },
  // Desserts
  {
    id: 'tiramisu',
    name: 'Tiramisu',
    description: 'Classic Italian coffee-flavored dessert',
    price: 48000,
    image: tiramisuImg,
    category: 'dessert',
    isAvailable: true,
  },
  {
    id: 'cheesecake',
    name: 'New York Cheesecake',
    description: 'Creamy classic cheesecake with berry compote',
    price: 45000,
    image: cheesecakeImg,
    category: 'dessert',
    isAvailable: true,
  },
];

export const categories: { id: ProductCategory; name: string; icon: string; image: string }[] = [
  { id: 'coffee', name: 'Coffee', icon: '☕', image: coffeeCategory },
  { id: 'tea', name: 'Tea', icon: '🍵', image: teaCategory },
  { id: 'pastry', name: 'Pastry', icon: '🥐', image: pastryCategory },
  { id: 'sandwich', name: 'Food', icon: '🥪', image: foodCategory },
  { id: 'dessert', name: 'Dessert', icon: '🍰', image: dessertCategory },
];

export const getProductsByCategory = (category: ProductCategory): Product[] => {
  return products.filter((p) => p.category === category);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find((p) => p.id === id);
};
