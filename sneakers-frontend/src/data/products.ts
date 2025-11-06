// import type { Product } from '../types';

// // DEFINITIVE FIX: All instances of 'id' have been changed to '_id' to match the
// // corrected type definitions that align with the MongoDB schema.
// export const products: Product[] = [
//   {
//     _id: '1',
//     name: 'Nike Air Max Pulse',
//     brand: 'Nike',
//     price: 150.0,
//     imageUrl: 'https://images.stockx.com/images/Nike-Air-Max-Pulse-Black-Pure-Platinum-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1679430919',
//     description:
//       'The Air Max Pulse pulls inspiration from the London music scene, bringing an underground touch to the iconic Air Max line. Its textile-wrapped midsole and vacuum-sealed accents keep ‘em looking fresh and clean, while colors inspired by the London music scene give your look the edge.',
//     variants: [
//       { _id: '1-s8-c-black', size: '8', color: 'Black', stock: 10 },
//       { _id: '1-s9-c-black', size: '9', color: 'Black', stock: 5 },
//       { _id: '1-s10-c-black', size: '10', color: 'Black', stock: 0 },
//       { _id: '1-s11-c-white', size: '11', color: 'White', stock: 8 },
//     ],
//   },
//   {
//     _id: '2',
//     name: 'Adidas Ultraboost 1.0',
//     brand: 'Adidas',
//     price: 180.0,
//     imageUrl: 'https://images.stockx.com/images/adidas-Ultra-Boost-1-0-Core-White-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1607042833',
//     description:
//       'From a walk in the park to a weekend run with friends, these adidas Ultraboaboost 1.0 shoes are designed for comfort. An adidas PRIMEKNIT upper gently hugs your feet, while BOOST on the midsole cushions from the first step to the last mile.',
//     variants: [
//       { _id: '2-s9-c-white', size: '9', color: 'Cloud White', stock: 12 },
//       { _id: '2-s10-c-white', size: '10', color: 'Cloud White', stock: 15 },
//       { _id: '2-s11-c-white', size: '11', color: 'Cloud White', stock: 3 },
//       { _id: '2-s10-c-black', size: '10', color: 'Core Black', stock: 7 },
//     ],
//   },
//   {
//     _id: '3',
//     name: 'New Balance 990v5',
//     brand: 'New Balance',
//     price: 185.0,
//     imageUrl: 'https://images.stockx.com/images/New-Balance-990v5-Grey-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1607042941',
//     description:
//       'The 990v5 is an American-made icon, built with a pigskin and mesh upper for a look that lasts. The ENCAP midsole technology provides support and maximum durability.',
//     variants: [
//       { _id: '3-s9-c-grey', size: '9', color: 'Grey', stock: 10 },
//       { _id: '3-s10-c-grey', size: '10', color: 'Grey', stock: 9 },
//       { _id: '3-s11-c-grey', size: '11', color: 'Grey', stock: 11 },
//     ],
//   },
//   {
//     _id: '4',
//     name: 'Puma Suede Classic',
//     brand: 'Puma',
//     price: 70.0,
//     imageUrl: 'https://images.stockx.com/images/Puma-Suede-Classic-XXI-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1611181190',
//     description:
//       'The Suede Classic XXI features a full suede upper and some modern touches for an improved overall quality and feel to an all-time great.',
//     variants: [
//       { _id: '4-s8-c-black', size: '8', color: 'Black', stock: 20 },
//       { _id: '4-s9-c-black', size: '9', color: 'Black', stock: 18 },
//       { _id: '4-s10-c-red', size: '10', color: 'Red', stock: 0 },
//     ],
//   },
//   {
//     _id: '5',
//     name: 'Nike Dunk Low Retro',
//     brand: 'Nike',
//     price: 110.0,
//     imageUrl: 'https://images.stockx.com/images/Nike-Dunk-Low-Retro-White-Black-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1633027409',
//     description:
//       "Created for the hardwood but taken to the streets, the '80s b-ball icon returns with perfectly shined overlays and original school colors. With its classic hoops design, the Nike Dunk Low Retro channels '80s vintage back onto the streets while its padded, low-cut collar lets you take your game anywhere—in comfort.",
//     variants: [
//       { _id: '5-s9-c-panda', size: '9', color: 'Panda', stock: 6 },
//       { _id: '5-s10-c-panda', size: '10', color: 'Panda', stock: 2 },
//       { _id: '5-s11-c-panda', size: '11', color: 'Panda', stock: 4 },
//     ],
//   },
//   {
//     _id: '6',
//     name: 'Adidas Samba OG',
//     brand: 'Adidas',
//     price: 100.0,
//     imageUrl: 'https://images.stockx.com/images/adidas-Samba-OG-White-Black-Gum-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1612213386',
//     description:
//       'An authentic Samba shoe, this sneaker stays true to its legacy with a tasteful, low-profile, soft leather upper, suede overlays and gum sole, making it a staple in everyone’s closet - on and off the pitch.',
//     variants: [
//       { _id: '6-s9-c-white', size: '9', color: 'White', stock: 10 },
//       { _id: '6-s10-c-white', size: '10', color: 'White', stock: 10 },
//       { _id: '6-s11-c-black', size: '11', color: 'Black', stock: 10 },
//     ],
//   },
//   {
//     _id: '7',
//     name: 'New Balance 550',
//     brand: 'New Balance',
//     price: 120.0,
//     imageUrl: 'https://images.stockx.com/images/New-Balance-550-White-Green-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1611181190',
//     description:
//       'The return of a legend. Originally worn by pros, the new 550 pays tribute to the 1989 original with classic details reminiscent of the era - simple, clean and true to its legacy.',
//     variants: [
//       { _id: '7-s9-c-green', size: '9', color: 'White/Green', stock: 15 },
//       { _id: '7-s10-c-green', size: '10', color: 'White/Green', stock: 13 },
//       { _id: '7-s11-c-green', size: '11', color: 'White/Green', stock: 0 },
//     ],
//   },
//   {
//     _id: '8',
//     name: 'Puma Clyde OG',
//     brand: 'Puma',
//     price: 85.0,
//     imageUrl: 'https://images.stockx.com/images/Puma-Clyde-OG-For-All-Time-Red-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1667547841',
//     description:
//       'The Clyde OG is a true icon from the PUMA archive. Just. Just like its namesake, Walt "Clyde" Frazier, the Clyde OG embodies fashion, culture, and basketball heritage with confidence and flair.',
//     variants: [
//       { _id: '8-s9-c-blue', size: '9', color: 'Blue', stock: 8 },
//       { _id: '8-s10-c-blue', size: '10', color: 'Blue', stock: 8 },
//       { _id: '8-s11-c-blue', size: '11', color: 'Blue', stock: 8 },
//     ],
//   },
// ];