import type { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Nike Air Max Pulse',
    brand: 'Nike',
    price: 150.0,
    // Corrected URL
    imageUrl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/950337b8-c990-4395-a24f-ea6d82f3060b/air-max-pulse-shoes-SQhX2h.png',
    description:
      'The Air Max Pulse pulls inspiration from the London music scene, bringing an underground touch to the iconic Air Max line. Its textile-wrapped midsole and vacuum-sealed accents keep ‘em looking fresh and clean, while colors inspired by the London music scene give your look the edge.',
    variants: [
      { id: '1-s8-c-black', size: '8', color: 'Black', stock: 10 },
      { id: '1-s9-c-black', size: '9', color: 'Black', stock: 5 },
      { id: '1-s10-c-black', size: '10', color: 'Black', stock: 0 },
      { id: '1-s11-c-white', size: '11', color: 'White', stock: 8 },
    ],
  },
  {
    id: '2',
    name: 'Adidas Ultraboost 1.0',
    brand: 'Adidas',
    price: 180.0,
    imageUrl: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/c608f554cb3b4d12b396af000188d385_9366/Ultraboost_1.0_Shoes_White_HQ4199_01_standard.jpg',
    description:
      'From a walk in the park to a weekend run with friends, these adidas Ultraboost 1.0 shoes are designed for comfort. An adidas PRIMEKNIT upper gently hugs your feet, while BOOST on the midsole cushions from the first step to the last mile.',
    variants: [
      { id: '2-s9-c-white', size: '9', color: 'Cloud White', stock: 12 },
      { id: '2-s10-c-white', size: '10', color: 'Cloud White', stock: 15 },
      { id: '2-s11-c-white', size: '11', color: 'Cloud White', stock: 3 },
      { id: '2-s10-c-black', size: '10', color: 'Core Black', stock: 7 },
    ],
  },
  {
    id: '3',
    name: 'New Balance 990v5',
    brand: 'New Balance',
    price: 185.0,
    imageUrl: 'https://nb.scene7.com/is/image/NB/m990gl5_nb_02_i?$pdpflexf2$&qlt=80&fmt=webp&wid=440&hei=440',
    description:
      'The 990v5 is an American-made icon, built with a pigskin and mesh upper for a look that lasts. The ENCAP midsole technology provides support and maximum durability.',
    variants: [
      { id: '3-s9-c-grey', size: '9', color: 'Grey', stock: 10 },
      { id: '3-s10-c-grey', size: '10', color: 'Grey', stock: 9 },
      { id: '3-s11-c-grey', size: '11', color: 'Grey', stock: 11 },
    ],
  },
  {
    id: '4',
    name: 'Puma Suede Classic',
    brand: 'Puma',
    price: 70.0,
    imageUrl: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/374915/01/sv01/fnd/PNA/fmt/png/Suede-Classic-XXI-Sneakers',
    description:
      'The Suede Classic XXI features a full suede upper and some modern touches for an improved overall quality and feel to an all-time great.',
    variants: [
      { id: '4-s8-c-black', size: '8', color: 'Black', stock: 20 },
      { id: '4-s9-c-black', size: '9', color: 'Black', stock: 18 },
      { id: '4-s10-c-red', size: '10', color: 'Red', stock: 0 },
    ],
  },
  {
    id: '5',
    name: 'Nike Dunk Low Retro',
    brand: 'Nike',
    price: 110.0,
    imageUrl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/4f37fca8-6bce-43e7-8786-45d055458d0d/dunk-low-retro-shoe-66RGqF.png',
    description:
      "Created for the hardwood but taken to the streets, the '80s b-ball icon returns with perfectly shined overlays and original school colors. With its classic hoops design, the Nike Dunk Low Retro channels '80s vintage back onto the streets while its padded, low-cut collar lets you take your game anywhere—in comfort.",
    variants: [
      { id: '5-s9-c-panda', size: '9', color: 'Panda', stock: 6 },
      { id: '5-s10-c-panda', size: '10', color: 'Panda', stock: 2 },
      { id: '5-s11-c-panda', size: '11', color: 'Panda', stock: 4 },
    ],
  },
  {
    id: '6',
    name: 'Adidas Samba OG',
    brand: 'Adidas',
    price: 100.0,
    // Corrected URL
    imageUrl: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/73347052ce434f6397d4af620124399d_9366/Samba_OG_Shoes_White_B75806_01_standard.jpg',
    description:
      'An authentic Samba shoe, this sneaker stays true to its legacy with a tasteful, low-profile, soft leather upper, suede overlays and gum sole, making it a staple in everyone’s closet - on and off the pitch.',
    variants: [
      { id: '6-s9-c-white', size: '9', color: 'White', stock: 10 },
      { id: '6-s10-c-white', size: '10', color: 'White', stock: 10 },
      { id: '6-s11-c-black', size: '11', color: 'Black', stock: 10 },
    ],
  },
  {
    id: '7',
    name: 'New Balance 550',
    brand: 'New Balance',
    price: 120.0,
    imageUrl: 'https://nb.scene7.com/is/image/NB/bb550wt1_nb_02_i?$pdpflexf2$&qlt=80&fmt=webp&wid=440&hei=440',
    description:
      'The return of a legend. Originally worn by pros, the new 550 pays tribute to the 1989 original with classic details reminiscent of the era - simple, clean and true to its legacy.',
    variants: [
      { id: '7-s9-c-green', size: '9', color: 'White/Green', stock: 15 },
      { id: '7-s10-c-green', size: '10', color: 'White/Green', stock: 13 },
      { id: '7-s11-c-green', size: '11', color: 'White/Green', stock: 0 },
    ],
  },
  {
    id: '8',
    name: 'Puma Clyde OG',
    brand: 'Puma',
    price: 85.0,
    imageUrl: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/391962/01/sv01/fnd/PNA/fmt/png/Clyde-OG-Sneakers',
    description:
      'The Clyde OG is a true icon from the PUMA archive. Just like its namesake, Walt "Clyde" Frazier, the Clyde OG embodies fashion, culture, and basketball heritage with confidence and flair.',
    variants: [
      { id: '8-s9-c-blue', size: '9', color: 'Blue', stock: 8 },
      { id: '8-s10-c-blue', size: '10', color: 'Blue', stock: 8 },
      { id: '8-s11-c-blue', size: '11', color: 'Blue', stock: 8 },
    ],
  },
];