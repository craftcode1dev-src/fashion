import { Category, Product, ProductImage, ProductVariant } from './types';

/**
 * Curated storefront catalogue.
 * A single art-directed source of truth for imagery, products and editorial,
 * used across the homepage, shop, collections and product pages.
 */

const u = (
  id: string,
  w: number,
  h?: number,
  crop: 'faces' | 'center' | 'entropy' | 'top' | 'bottom' = 'center'
) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${
    h ? `&h=${h}&crop=${crop}` : ''
  }&q=80`;

export const IMAGES = {
  /* Campaign imagery — reserved for editorial moments, never product cards. */
  hero: u('1548126032-079a0fb0099d', 2400, 1400, 'faces'),
  editorial: u('1539109136881-3be0616acf4b', 2200, 1600, 'faces'),
  story: u('1512436991641-6745cdb1723f', 1600, 1200, 'center'),
  storyDetail: u('1558769132-cb1aea458c5e', 1200, 1500, 'center'),
  aboutHero: u('1578932750294-f5075e85f44a', 2400, 1400, 'center'),
  aboutAtelier: u('1558769132-cb1aea458c5e', 1400, 1750, 'center'),
  craftsmanship: u('1516762689617-e1cffcef479d', 1600, 1200, 'center'),
  sustainability: u('1556905055-8f358a7a47b2', 1600, 1200, 'center'),
  newSeason: u('1550614000-4895a10e1bfd', 1000, 1250, 'faces'),
  megaNewSeason: u('1550614000-4895a10e1bfd', 700, 880, 'faces'),
  megaDenim: u('1542272604-787c3835535d', 700, 880, 'center'),
  megaOuterwear: u('1520975954732-35dd22299614', 700, 880, 'faces'),
} as const;

/* ── Categories ─────────────────────────────────────────── */

const CATEGORY_META = {
  women: { id: 1, name: 'Women', slug: 'women', gender: 'women' },
  men: { id: 2, name: 'Men', slug: 'men', gender: 'men' },
  accessories: { id: 3, name: 'Accessories', slug: 'accessories', gender: 'accessories' },
} as const;

type CategorySlug = keyof typeof CATEGORY_META;

export const CATEGORIES: Category[] = Object.values(CATEGORY_META).map((c) => ({
  ...c,
  description: null,
  image_url: null,
  is_featured: true,
  sort_order: c.id,
}));

/* ── Product factory ────────────────────────────────────── */

interface ProductSpec {
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  compareAt?: number;
  category: CategorySlug;
  subcategory: string;
  image: string;
  imageAlt: string;
  focus?: 'faces' | 'center' | 'entropy' | 'top' | 'bottom';
  colors: { name: string; hex: string }[];
  sizes: string[];
  soldOut?: string[];
  composition: string;
  care: string;
  origin: string;
  fit: string;
  isNew?: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
  popularity?: number;
}

let variantId = 1000;
let imageId = 100;

function galleryFor(
  spec: ProductSpec,
  productId: number
): ProductImage[] {
  const focus = spec.focus ?? 'center';
  const crops: { h: number; crop: typeof focus; suffix: string }[] = [
    { h: 1333, crop: focus, suffix: '' },
    { h: 1000, crop: 'entropy', suffix: ' — detail' },
    { h: 1333, crop: 'center', suffix: ' — alternate view' },
  ];

  return crops.map((entry, index) => ({
    id: imageId++,
    product_id: productId,
    image_url: u(spec.image, 1100, entry.h, entry.crop),
    alt_text: `${spec.imageAlt}${entry.suffix}`,
    is_primary: index === 0,
    sort_order: index,
  }));
}

function makeProduct(spec: ProductSpec, index: number): Product {
  const category = CATEGORY_META[spec.category];
  const id = index + 1;

  const variants: ProductVariant[] = [];
  spec.colors.forEach((color) => {
    spec.sizes.forEach((size) => {
      variants.push({
        id: ++variantId,
        product_id: id,
        size,
        color_name: color.name,
        color_hex: color.hex,
        sku: `MV-${String(id).padStart(2, '0')}-${color.name
          .slice(0, 2)
          .toUpperCase()}-${size.replace(/\s+/g, '')}`,
        stock: spec.soldOut?.includes(`${color.name}/${size}`) ? 0 : 8,
        price_modifier: 0,
      });
    });
  });

  return {
    id,
    category_id: category.id,
    name: spec.name,
    slug: spec.slug,
    sku: `MV-${String(id).padStart(4, '0')}`,
    subtitle: spec.subtitle,
    description: spec.description,
    composition: spec.composition,
    care_instructions: spec.care,
    fit_advice: spec.fit,
    origin: spec.origin,
    price: spec.price,
    compare_at_price: spec.compareAt ?? null,
    gender: category.gender,
    subcategory: spec.subcategory,
    is_featured: !!spec.isFeatured,
    is_new_arrival: !!spec.isNew,
    is_bestseller: !!spec.isBestseller,
    is_active: true,
    stock: 8,
    popularity:
      spec.popularity ??
      (spec.isBestseller ? 92 : spec.isFeatured ? 78 : spec.isNew ? 64 : 50),
    category: {
      ...category,
      description: null,
      image_url: null,
      is_featured: true,
      sort_order: category.id,
    },
    images: galleryFor(spec, id),
    variants,
  };
}

const SPECS: ProductSpec[] = [
  /* ── Women ─────────────────────────────────────────────── */
  {
    slug: 'field-utility-jacket',
    name: 'Field Utility Jacket',
    subtitle: 'Cotton twill, four-pocket build',
    description:
      'A workwear archetype cut with a little more room and a little more polish. Washed cotton twill, a stand collar and four bellows pockets — built to take a beating and look better for it.',
    price: 420,
    category: 'women',
    subcategory: 'Outerwear',
    image: '1544022613-e87ca75a784a',
    imageAlt: 'Woman in an olive field utility jacket and beanie',
    focus: 'faces',
    colors: [
      { name: 'Olive', hex: '#55603C' },
      { name: 'Black', hex: '#1D1D18' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    soldOut: ['Olive/XL'],
    composition: '100% garment-dyed cotton twill. Corozo buttons.',
    care: 'Machine wash cold, line dry. Warm iron if needed.',
    origin: 'Made in Portugal',
    fit: 'Relaxed fit with room for layering. Model is 178 cm and wears a size S.',
    isNew: true,
    isFeatured: true,
    popularity: 88,
  },
  {
    slug: 'cropped-bomber-jacket',
    name: 'Cropped Bomber Jacket',
    subtitle: 'Rust nylon, elasticated hem',
    description:
      'A short, sharp bomber in a dry-touch technical nylon. Ribbed collar and cuffs, a two-way zip and a hem that sits exactly at the waist. The easiest layer in the wardrobe.',
    price: 360,
    compareAt: 420,
    category: 'women',
    subcategory: 'Outerwear',
    image: '1591047139829-d91aecb6caea',
    imageAlt: 'Rust cropped bomber jacket held on a hanger',
    focus: 'center',
    colors: [
      { name: 'Rust', hex: '#A95233' },
      { name: 'Sand', hex: '#BFA98A' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    soldOut: ['Sand/L'],
    composition: '100% recycled nylon shell. Recycled polyester lining.',
    care: 'Machine wash cold, hang dry. Do not tumble dry.',
    origin: 'Made in Portugal',
    fit: 'Cropped, boxy fit. Size up for a more generous line.',
    isNew: true,
    popularity: 76,
  },
  {
    slug: 'longline-wool-coat',
    name: 'Longline Wool Coat',
    subtitle: 'Double-faced wool, belted waist',
    description:
      'A long, clean line in double-faced wool with a soft shoulder and a self belt. Deep enough to layer a hoodie underneath, sharp enough to wear over tailoring.',
    price: 690,
    category: 'women',
    subcategory: 'Outerwear',
    image: '1483985988355-763728e1935b',
    imageAlt: 'Woman in a burgundy longline wool coat and sunglasses',
    focus: 'faces',
    colors: [
      { name: 'Burgundy', hex: '#5B2530' },
      { name: 'Charcoal', hex: '#2A2A25' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    composition: '80% wool, 20% recycled polyamide. Cupro lining.',
    care: 'Dry clean only. Steam gently between wears.',
    origin: 'Made in Italy',
    fit: 'Oversized through the body. Belt to define the waist.',
    isFeatured: true,
    popularity: 74,
  },
  {
    slug: 'belted-camel-coat',
    name: 'Belted Camel Coat',
    subtitle: 'Wool-cashmere, unlined',
    description:
      'The coat that does the work of a whole outfit. A warm camel wool-cashmere blend, a relaxed shoulder and a long belt you can tie or leave loose.',
    price: 780,
    category: 'women',
    subcategory: 'Outerwear',
    image: '1539533018447-63fcce2678e3',
    imageAlt: 'Woman in a belted camel coat walking down stone steps',
    focus: 'faces',
    colors: [
      { name: 'Camel', hex: '#A9855D' },
      { name: 'Black', hex: '#1D1D18' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    soldOut: ['Camel/XS'],
    composition: '90% wool, 10% cashmere. Unlined.',
    care: 'Dry clean only. Rest on a broad hanger.',
    origin: 'Made in Italy',
    fit: 'Relaxed straight fit. Falls below the knee.',
    isBestseller: true,
    popularity: 96,
  },
  {
    slug: 'fleece-lined-trucker-jacket',
    name: 'Fleece-Lined Trucker Jacket',
    subtitle: 'Sherpa collar, corduroy trim',
    description:
      'A trucker jacket built for the cold: brushed cotton shell, a soft sherpa collar and a quilted lining. Worn open over a hoodie or closed against the wind.',
    price: 480,
    category: 'women',
    subcategory: 'Outerwear',
    image: '1608063615781-e2ef8c73d114',
    imageAlt: 'Woman in a fleece-lined trucker jacket and beanie',
    focus: 'faces',
    colors: [
      { name: 'Brown', hex: '#6B4A33' },
      { name: 'Ecru', hex: '#D8CBB4' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    composition: '100% cotton shell. Recycled polyester sherpa lining.',
    care: 'Machine wash cold, line dry. Brush the collar to revive.',
    origin: 'Made in Portugal',
    fit: 'Regular fit. Model is 175 cm and wears a size S.',
    isNew: true,
    popularity: 72,
  },
  {
    slug: 'sheer-mesh-long-sleeve',
    name: 'Sheer Mesh Long Sleeve',
    subtitle: 'Fine-gauge stretch mesh',
    description:
      'A close, lightweight layer in fine stretch mesh. Long sleeves, a high neck and a clean hem — designed to sit under a tee, a tank or a jacket.',
    price: 120,
    category: 'women',
    subcategory: 'Tops',
    image: '1524504388940-b1c1722653e1',
    imageAlt: 'Woman in a sheer black mesh long-sleeve top',
    focus: 'faces',
    colors: [{ name: 'Black', hex: '#1A1A17' }],
    sizes: ['XS', 'S', 'M', 'L'],
    composition: '92% recycled polyamide, 8% elastane.',
    care: 'Hand wash cold, dry flat. Do not iron.',
    origin: 'Made in Portugal',
    fit: 'Close fit with plenty of stretch. Size up for a looser line.',
    isNew: true,
    popularity: 61,
  },
  {
    slug: 'boxy-fleece-sweatshirt',
    name: 'Boxy Fleece Sweatshirt',
    subtitle: 'Heavyweight loopback, raw hem',
    description:
      'A heavyweight loopback sweatshirt with a wide body, dropped shoulder and a raw-cut hem. The kind of fleece that gets softer every wash.',
    price: 180,
    compareAt: 220,
    category: 'women',
    subcategory: 'Sweatshirts',
    image: '1578587018452-892bacefd3f2',
    imageAlt: 'Woman in a burnt orange boxy fleece sweatshirt',
    focus: 'faces',
    colors: [
      { name: 'Burnt Orange', hex: '#C65A2E' },
      { name: 'Cream', hex: '#E4DDCE' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    soldOut: ['Cream/M'],
    composition: '100% organic cotton loopback, 420 gsm.',
    care: 'Machine wash cold inside out. Dry flat.',
    origin: 'Made in Portugal',
    fit: 'Boxy, oversized fit. Size down for a closer line.',
    popularity: 84,
  },
  {
    slug: 'striped-poplin-shirt',
    name: 'Striped Poplin Shirt',
    subtitle: 'Yarn-dyed stripe, relaxed collar',
    description:
      'A crisp cotton poplin in a yarn-dyed stripe, cut with a relaxed collar and a curved hem. Tuck it, tie it or leave it open over a tee.',
    price: 150,
    category: 'women',
    subcategory: 'Shirts',
    image: '1584030373081-f37b7bb4fa8e',
    imageAlt: 'Striped cotton poplin shirt hanging against a wall',
    focus: 'center',
    colors: [
      { name: 'Blue Stripe', hex: '#7E93AA' },
      { name: 'Ecru Stripe', hex: '#D7CEC0' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    composition: '100% cotton poplin. Corozo buttons.',
    care: 'Machine wash cold, line dry. Iron while slightly damp.',
    origin: 'Made in Portugal',
    fit: 'Relaxed fit with a straight hem. Model is 177 cm and wears a size S.',
    popularity: 66,
  },
  {
    slug: 'utility-overshirt',
    name: 'Utility Overshirt',
    subtitle: 'Garment-dyed twill, patch pockets',
    description:
      'Half shirt, half jacket. A garment-dyed cotton twill overshirt with two chest pockets and a boxy cut that works as a light layer in every season.',
    price: 190,
    category: 'women',
    subcategory: 'Shirts',
    image: '1517445312882-bc9910d016b7',
    imageAlt: 'Woman in an olive utility overshirt and matching trousers',
    focus: 'faces',
    colors: [
      { name: 'Olive', hex: '#5A6341' },
      { name: 'Sand', hex: '#C3B291' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    composition: '100% garment-dyed cotton twill.',
    care: 'Machine wash cold, line dry. Colour will soften with wear.',
    origin: 'Made in Portugal',
    fit: 'Boxy fit. Model is 178 cm and wears a size S.',
    isBestseller: true,
    popularity: 90,
  },
  {
    slug: 'light-wash-straight-jean',
    name: 'Light Wash Straight Jean',
    subtitle: 'Rigid denim, mid-rise',
    description:
      'A straight-leg jean in a pale, sun-faded indigo. Rigid cotton denim with a mid-rise and a full length — the pair you reach for on the days you want to think less.',
    price: 190,
    category: 'women',
    subcategory: 'Denim',
    image: '1475178626620-a4d074967452',
    imageAlt: 'Woman in light wash straight-leg jeans',
    focus: 'faces',
    colors: [
      { name: 'Light Indigo', hex: '#8FA6BC' },
      { name: 'Mid Indigo', hex: '#4F637A' },
    ],
    sizes: ['24', '25', '26', '27', '28', '29', '30', '31', '32'],
    soldOut: ['Light Indigo/24'],
    composition: '100% cotton denim, 12 oz. Recycled metal hardware.',
    care: 'Machine wash cold inside out. Line dry.',
    origin: 'Made in Portugal',
    fit: 'Mid-rise, straight leg. True to size.',
    isBestseller: true,
    popularity: 94,
  },
  {
    slug: 'denim-cut-off-short',
    name: 'Denim Cut-Off Short',
    subtitle: 'Rigid denim, raw edge',
    description:
      'Cut from rigid denim and finished with a raw, frayed edge. A high rise, a relaxed leg and just enough distressing to look lived in.',
    price: 110,
    compareAt: 140,
    category: 'women',
    subcategory: 'Shorts',
    image: '1591195853828-11db59a44f6b',
    imageAlt: 'Light wash denim cut-off shorts',
    focus: 'center',
    colors: [{ name: 'Light Indigo', hex: '#8FA6BC' }],
    sizes: ['24', '25', '26', '27', '28', '29', '30'],
    composition: '100% cotton denim. Raw hem.',
    care: 'Machine wash cold, line dry. Trim loose threads only.',
    origin: 'Made in Portugal',
    fit: 'High rise, relaxed leg. Model is 175 cm and wears a size 26.',
    popularity: 69,
  },
  {
    slug: 'printed-boxy-tee',
    name: 'Printed Boxy Tee',
    subtitle: 'Heavy jersey, screen-printed graphic',
    description:
      'A boxy heavyweight tee with a soft-hand screen print across the chest. Cut wide through the body and short in the sleeve for an easy, thrown-on line.',
    price: 85,
    category: 'women',
    subcategory: 'T-shirts',
    image: '1582418702059-97ebafb35d09',
    imageAlt: 'Woman in a printed boxy cotton tee and wide-leg jeans',
    focus: 'faces',
    colors: [
      { name: 'Ecru', hex: '#E8E2D2' },
      { name: 'Black', hex: '#1A1A17' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    composition: '100% organic cotton jersey, 240 gsm.',
    care: 'Machine wash cold inside out. Do not iron the print.',
    origin: 'Made in Portugal',
    fit: 'Boxy, cropped fit. Size up for a longer body.',
    isNew: true,
    popularity: 79,
  },
  {
    slug: 'textured-knit-crew',
    name: 'Textured Knit Crew',
    subtitle: 'Cotton-linen, open stitch',
    description:
      'A textured crew-neck knit in a cotton-linen blend. The open stitch gives it air, while the ribbed trims keep the shape clean. Layer it or wear it alone.',
    price: 230,
    category: 'women',
    subcategory: 'Knitwear',
    image: '1556905055-8f358a7a47b2',
    imageAlt: 'Folded textured knitwear and denim flat lay',
    focus: 'center',
    colors: [
      { name: 'Oat', hex: '#C9BBA5' },
      { name: 'Olive', hex: '#5F6748' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    composition: '70% cotton, 30% linen. Open-stitch knit.',
    care: 'Hand wash cold, dry flat. Do not wring.',
    origin: 'Made in Portugal',
    fit: 'Relaxed fit with a dropped shoulder.',
    popularity: 58,
  },
  {
    slug: 'relaxed-cargo-pant',
    name: 'Relaxed Cargo Pant',
    subtitle: 'Cotton ripstop, six pockets',
    description:
      'A wide-leg cargo in dry cotton ripstop, with six pockets and an adjustable hem. Built with the utility of a work pant and the volume of a modern trouser.',
    price: 210,
    category: 'women',
    subcategory: 'Trousers',
    image: '1552902865-b72c031ac5ea',
    imageAlt: 'Woman in relaxed olive cargo pants and a black tee',
    focus: 'faces',
    colors: [
      { name: 'Olive', hex: '#545C3F' },
      { name: 'Black', hex: '#1E1E1A' },
    ],
    sizes: ['24', '25', '26', '27', '28', '29', '30', '31', '32'],
    composition: '100% cotton ripstop. Recycled metal hardware.',
    care: 'Machine wash cold, line dry. Warm iron if needed.',
    origin: 'Made in Portugal',
    fit: 'Wide, relaxed leg with a high rise.',
    isNew: true,
    popularity: 82,
  },

  /* ── Men ───────────────────────────────────────────────── */
  {
    slug: 'leather-moto-jacket',
    name: 'Leather Moto Jacket',
    subtitle: 'Lambskin, asymmetric zip',
    description:
      'A clean, asymmetric moto in supple lambskin. Notched lapels, a cropped body and a belt at the hem — the jacket that gets better with every year of wear.',
    price: 650,
    category: 'men',
    subcategory: 'Outerwear',
    image: '1488161628813-04466f872be2',
    imageAlt: 'Man in a black leather moto jacket sitting on a ledge',
    focus: 'faces',
    colors: [
      { name: 'Black', hex: '#1A1A17' },
      { name: 'Brown', hex: '#5A3B2A' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    soldOut: ['Black/S'],
    composition: '100% lambskin. Recycled polyester lining.',
    care: 'Leather specialist clean only. Condition once a year.',
    origin: 'Made in Italy',
    fit: 'Close fit through the body. Model is 186 cm and wears a size M.',
    isBestseller: true,
    popularity: 95,
  },
  {
    slug: 'denim-trucker-jacket',
    name: 'Denim Trucker Jacket',
    subtitle: 'Rigid selvedge, classic cut',
    description:
      'A Type III trucker in rigid selvedge denim. Two chest pockets, a straight hem and a fit that breaks in exactly where you want it to.',
    price: 320,
    category: 'men',
    subcategory: 'Outerwear',
    image: '1551537482-f2075a1d41f2',
    imageAlt: 'Man in a rigid indigo denim trucker jacket',
    focus: 'faces',
    colors: [
      { name: 'Indigo', hex: '#4E6276' },
      { name: 'Washed Black', hex: '#2E2E2A' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    composition: '100% cotton selvedge denim, 13.5 oz.',
    care: 'Wash sparingly, cold, inside out. Line dry.',
    origin: 'Made in Portugal',
    fit: 'Regular fit. Size up for a boxier line.',
    isNew: true,
    popularity: 87,
  },
  {
    slug: 'wool-two-piece-suit',
    name: 'Wool Two-Piece Suit',
    subtitle: 'Soft shoulder, drawstring trouser',
    description:
      'A suit with the formality turned down. Mid-weight wool, an unstructured shoulder and a drawstring trouser. Wear it together, or break it apart for everything else.',
    price: 890,
    category: 'men',
    subcategory: 'Tailoring',
    image: '1507679799987-c73779587ccf',
    imageAlt: 'Man in a navy wool two-piece suit',
    focus: 'faces',
    colors: [{ name: 'Navy', hex: '#26344A' }],
    sizes: ['S', 'M', 'L', 'XL'],
    composition: '98% wool, 2% elastane. Half-canvas construction.',
    care: 'Dry clean only. Rest on a broad hanger between wears.',
    origin: 'Made in Italy',
    fit: 'Relaxed tailoring. Jacket and trouser sold as a set.',
    isFeatured: true,
    popularity: 71,
  },
  {
    slug: 'indigo-chambray-shirt',
    name: 'Indigo Chambray Shirt',
    subtitle: 'Stone-washed cotton, patch pocket',
    description:
      'A cotton chambray woven in Portugal and stone-washed for a lived-in hand. Point collar, single patch pocket and corozo buttons. An everyday shirt with a bit of history.',
    price: 160,
    category: 'men',
    subcategory: 'Shirts',
    image: '1596755094514-f87e34085b2c',
    imageAlt: 'Washed indigo chambray shirt on a hanger',
    focus: 'center',
    colors: [{ name: 'Indigo', hex: '#52677C' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    soldOut: ['S'],
    composition: '100% cotton chambray. Corozo buttons.',
    care: 'Machine wash cold, line dry. Warm iron if needed.',
    origin: 'Made in Portugal',
    fit: 'Regular fit. Model is 186 cm and wears a size M.',
    isNew: true,
    popularity: 77,
  },
  {
    slug: 'blue-oxford-shirt',
    name: 'Blue Oxford Shirt',
    subtitle: 'Brushed oxford, button-down collar',
    description:
      'The Oxford, done properly: a dense brushed cotton, a soft button-down collar and a clean placket. Substantial enough to wear open over a tee.',
    price: 140,
    category: 'men',
    subcategory: 'Shirts',
    image: '1620012253295-c15cc3e65df4',
    imageAlt: 'Man in a blue Oxford shirt and tie',
    focus: 'faces',
    colors: [
      { name: 'Blue', hex: '#93A9BE' },
      { name: 'White', hex: '#E9E5DA' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    composition: '100% organic cotton oxford.',
    care: 'Machine wash cold, line dry. Iron while damp.',
    origin: 'Made in Portugal',
    fit: 'Regular fit. Size down for a closer silhouette.',
    popularity: 75,
  },
  {
    slug: 'heavyweight-pullover-hoodie',
    name: 'Heavyweight Pullover Hoodie',
    subtitle: 'Brushed fleece, double-layer hood',
    description:
      'A proper heavyweight hoodie: dense brushed fleece, a double-layer hood and a kangaroo pocket with reinforced corners. Built to be worn hard and washed often.',
    price: 210,
    category: 'men',
    subcategory: 'Sweatshirts',
    image: '1556821840-3a63f95609a7',
    imageAlt: 'Man in a heather grey heavyweight hoodie, seen from behind',
    focus: 'faces',
    colors: [
      { name: 'Heather Grey', hex: '#9B9B96' },
      { name: 'Black', hex: '#1C1C19' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    soldOut: ['Heather Grey/XXL'],
    composition: '80% organic cotton, 20% recycled polyester, 480 gsm.',
    care: 'Machine wash cold inside out. Tumble dry low.',
    origin: 'Made in Portugal',
    fit: 'Relaxed fit. Model is 188 cm and wears a size L.',
    isBestseller: true,
    popularity: 97,
  },
  {
    slug: 'loopback-crew-sweatshirt',
    name: 'Loopback Crew Sweatshirt',
    subtitle: 'Organic cotton, V-insert',
    description:
      'The plain crew, perfected. Heavy loopback cotton, a ribbed V-insert at the neck and a body that holds its shape. No logo, no noise.',
    price: 180,
    category: 'men',
    subcategory: 'Sweatshirts',
    image: '1620799140408-edc6dcb6d633',
    imageAlt: 'Plain white loopback cotton sweatshirt flat lay',
    focus: 'center',
    colors: [
      { name: 'Ecru', hex: '#E7E1D3' },
      { name: 'Grey', hex: '#A8A6A0' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    composition: '100% organic cotton loopback, 400 gsm.',
    care: 'Machine wash cold, dry flat. Do not bleach.',
    origin: 'Made in Portugal',
    fit: 'Regular fit with a straight hem.',
    popularity: 73,
  },
  {
    slug: 'merino-roll-neck',
    name: 'Merino Roll Neck',
    subtitle: 'Fine-gauge merino, ribbed trims',
    description:
      'A fine-gauge merino roll neck with a clean, close fit. Warm without bulk, it layers under a jacket and stands on its own after hours.',
    price: 220,
    category: 'men',
    subcategory: 'Knitwear',
    image: '1521119989659-a83eee488004',
    imageAlt: 'Man in a forest green merino roll neck',
    focus: 'faces',
    colors: [
      { name: 'Forest', hex: '#2F4A3B' },
      { name: 'Black', hex: '#1B1B18' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    composition: '100% extra-fine merino wool.',
    care: 'Hand wash cold or dry clean. Dry flat.',
    origin: 'Made in Italy',
    fit: 'Slim fit with a close roll neck.',
    isNew: true,
    popularity: 68,
  },
  {
    slug: 'heavyweight-pocket-tee',
    name: 'Heavyweight Pocket Tee',
    subtitle: 'Compact jersey, chest pocket',
    description:
      'A t-shirt with the weight of a good knit: compact organic cotton, a clean neckline and a single chest pocket. Cut straight enough to stand on its own.',
    price: 75,
    category: 'men',
    subcategory: 'T-shirts',
    image: '1583743814966-8936f5b7be1a',
    imageAlt: 'Black heavyweight cotton t-shirt hanging on a hanger',
    focus: 'center',
    colors: [
      { name: 'Black', hex: '#1A1A17' },
      { name: 'Ecru', hex: '#E5DFD1' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    composition: '100% organic cotton, 260 gsm.',
    care: 'Machine wash cold, tumble dry low.',
    origin: 'Made in Portugal',
    fit: 'Straight fit. Size up for a looser line.',
    isBestseller: true,
    popularity: 93,
  },
  {
    slug: 'classic-cotton-tee',
    name: 'Classic Cotton Tee',
    subtitle: 'Midweight jersey, ribbed neck',
    description:
      'The one you buy in threes. Midweight combed cotton, a ribbed neck that keeps its shape and a hem that sits just right. An honest, everyday tee.',
    price: 65,
    category: 'men',
    subcategory: 'T-shirts',
    image: '1581655353564-df123a1eb820',
    imageAlt: 'White classic cotton t-shirt hanging on a wall',
    focus: 'center',
    colors: [
      { name: 'White', hex: '#F0EDE5' },
      { name: 'Black', hex: '#1A1A17' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    composition: '100% combed organic cotton, 190 gsm.',
    care: 'Machine wash cold. Tumble dry low.',
    origin: 'Made in Portugal',
    fit: 'Regular fit. True to size.',
    popularity: 86,
  },
  {
    slug: 'slim-tapered-jean',
    name: 'Slim Tapered Jean',
    subtitle: 'Comfort denim, mid-rise',
    description:
      'A slim jean with a tapered leg and just enough stretch to move. Dark indigo with a clean finish — sharp with a jacket, easy with a hoodie.',
    price: 190,
    category: 'men',
    subcategory: 'Denim',
    image: '1602293589930-45aad59ba3ab',
    imageAlt: 'Back pocket detail of mid-wash slim jeans',
    focus: 'center',
    colors: [
      { name: 'Mid Indigo', hex: '#4F637A' },
      { name: 'Washed Black', hex: '#30302C' },
    ],
    sizes: ['28', '29', '30', '31', '32', '33', '34', '36'],
    composition: '98% cotton, 2% elastane comfort denim.',
    care: 'Machine wash cold inside out. Line dry.',
    origin: 'Made in Portugal',
    fit: 'Slim through the thigh, tapered from the knee.',
    popularity: 81,
  },
  {
    slug: 'pleated-wool-trouser',
    name: 'Pleated Wool Trouser',
    subtitle: 'Single pleat, wide leg',
    description:
      'A single-pleat trouser in a dry wool blend, cut wide and long. The kind of trouser that makes a plain tee look considered.',
    price: 230,
    category: 'men',
    subcategory: 'Trousers',
    image: '1584865288642-42078afe6942',
    imageAlt: 'Man in wide black pleated trousers and a white shirt',
    focus: 'faces',
    colors: [
      { name: 'Charcoal', hex: '#35352F' },
      { name: 'Navy', hex: '#2C3440' },
    ],
    sizes: ['28', '29', '30', '31', '32', '33', '34', '36'],
    composition: '70% wool, 30% recycled polyester.',
    care: 'Dry clean or cold hand wash. Hang to dry.',
    origin: 'Made in Portugal',
    fit: 'Wide leg with a high rise. Unfinished hem at 34".',
    popularity: 64,
  },
  {
    slug: 'cotton-chino',
    name: 'Cotton Chino',
    subtitle: 'Garment-dyed twill, straight leg',
    description:
      'A straight-leg chino in a substantial garment-dyed twill. Soft from the first wear, with enough structure to hold a crease when you want one.',
    price: 170,
    compareAt: 200,
    category: 'men',
    subcategory: 'Trousers',
    image: '1473966968600-fa801b869a1a',
    imageAlt: 'Man in sand cotton chino trousers',
    focus: 'faces',
    colors: [
      { name: 'Sand', hex: '#B8A887' },
      { name: 'Olive', hex: '#5C6247' },
    ],
    sizes: ['28', '29', '30', '31', '32', '33', '34', '36'],
    composition: '100% garment-dyed cotton twill.',
    care: 'Machine wash cold, line dry. Warm iron.',
    origin: 'Made in Portugal',
    fit: 'Straight fit with a mid rise.',
    popularity: 70,
  },
  {
    slug: 'graphic-back-tee',
    name: 'Graphic Back Tee',
    subtitle: 'Heavy jersey, back print',
    description:
      'A heavyweight tee with a large, soft-hand print across the back. Boxy through the body, clean at the front — the graphic does the talking.',
    price: 85,
    category: 'men',
    subcategory: 'T-shirts',
    image: '1564859228273-274232fdb516',
    imageAlt: 'Man in a white graphic back tee seen from behind',
    focus: 'faces',
    colors: [
      { name: 'White', hex: '#ECE8DD' },
      { name: 'Black', hex: '#1A1A17' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    composition: '100% organic cotton jersey, 250 gsm.',
    care: 'Machine wash cold inside out. Do not iron the print.',
    origin: 'Made in Portugal',
    fit: 'Boxy fit with a dropped shoulder.',
    isNew: true,
    popularity: 80,
  },

  /* ── Accessories ───────────────────────────────────────── */
  {
    slug: 'top-handle-leather-bag',
    name: 'Top-Handle Leather Bag',
    subtitle: 'Structured calfskin, palladium clasp',
    description:
      'A compact top-handle in polished calfskin, built around a rigid frame with a hand-set clasp. Interior in suede, sized for a phone, a card case and little else.',
    price: 420,
    category: 'accessories',
    subcategory: 'Bags',
    image: '1584917865442-de89df76afd3',
    imageAlt: 'Structured red top-handle leather bag',
    focus: 'center',
    colors: [
      { name: 'Tan', hex: '#8F5C3B' },
      { name: 'Black', hex: '#1D1D18' },
    ],
    sizes: ['One Size'],
    composition: '100% calfskin. Suede lining. Palladium hardware.',
    care: 'Wipe with a soft dry cloth. Store in the dust bag provided.',
    origin: 'Made in Italy',
    fit: '23 × 18 × 10 cm. Detachable shoulder strap.',
    isBestseller: true,
    popularity: 89,
  },
  {
    slug: 'canvas-daypack',
    name: 'Canvas Daypack',
    subtitle: 'Waxed cotton, leather base',
    description:
      'A pared-back daypack in waxed cotton canvas with a leather base and padded straps. One main compartment, one laptop sleeve, nothing you do not need.',
    price: 180,
    compareAt: 220,
    category: 'accessories',
    subcategory: 'Bags',
    image: '1553062407-98eeb64c6a62',
    imageAlt: 'Navy canvas daypack against a white wall',
    focus: 'center',
    colors: [
      { name: 'Navy', hex: '#2B3242' },
      { name: 'Olive', hex: '#4F573C' },
    ],
    sizes: ['One Size'],
    composition: 'Waxed cotton canvas. Leather base. Recycled nylon lining.',
    care: 'Spot clean with cold water. Re-wax annually.',
    origin: 'Made in Portugal',
    fit: '22 L. Fits a 15" laptop. Padded adjustable straps.',
    isNew: true,
    popularity: 67,
  },
  {
    slug: 'leather-belt',
    name: 'Leather Belt',
    subtitle: 'Vegetable-tanned, solid brass buckle',
    description:
      'A straightforward leather belt in vegetable-tanned cowhide, finished with a solid brass buckle. It will darken and soften with wear.',
    price: 110,
    category: 'accessories',
    subcategory: 'Belts',
    image: '1624222247344-550fb60583dc',
    imageAlt: 'Brown vegetable-tanned leather belt with brass buckle',
    focus: 'center',
    colors: [
      { name: 'Brown', hex: '#6B4A33' },
      { name: 'Black', hex: '#1D1D18' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    composition: '100% vegetable-tanned cowhide. Solid brass hardware.',
    care: 'Wipe clean. Condition with leather balm twice a year.',
    origin: 'Made in England',
    fit: '35 mm width. Size up one size from your trouser waist.',
    popularity: 62,
  },
  {
    slug: 'minimal-field-watch',
    name: 'Minimal Field Watch',
    subtitle: 'Sandblasted steel, sapphire crystal',
    description:
      'A quiet field watch with a sandblasted steel case, a clean white dial and a brushed leather strap. Water resistant to 100 m and built to be repaired, not replaced.',
    price: 320,
    category: 'accessories',
    subcategory: 'Watches',
    image: '1524592094714-0f0654e20314',
    imageAlt: 'Minimal steel field watch with white dial held in hand',
    focus: 'center',
    colors: [
      { name: 'Steel', hex: '#B9B8B2' },
      { name: 'Black', hex: '#1D1D18' },
    ],
    sizes: ['One Size'],
    composition: '316L stainless steel. Sapphire crystal. Leather strap.',
    care: 'Rinse with fresh water after salt exposure. Service every 5 years.',
    origin: 'Assembled in Switzerland',
    fit: '38 mm case. 20 mm strap. 100 m water resistance.',
    isBestseller: true,
    popularity: 85,
  },
  {
    slug: 'round-metal-sunglasses',
    name: 'Round Metal Sunglasses',
    subtitle: 'Gold frame, green lenses',
    description:
      'A slim round frame in gold-tone metal with green-tinted lenses. Light on the face, easy with everything, and small enough to carry in a jacket pocket.',
    price: 160,
    category: 'accessories',
    subcategory: 'Eyewear',
    image: '1511499767150-a48a237f0083',
    imageAlt: 'Round gold metal sunglasses with green lenses',
    focus: 'center',
    colors: [
      { name: 'Gold / Green', hex: '#B49A5E' },
      { name: 'Black / Grey', hex: '#1D1D18' },
    ],
    sizes: ['One Size'],
    composition: 'Stainless steel frame. Mineral glass lenses. 100% UV protection.',
    care: 'Clean with the microfibre cloth provided. Store in the case.',
    origin: 'Made in Italy',
    fit: '48 mm lens. Adjustable nose pads.',
    popularity: 60,
  },
  {
    slug: 'wool-baseball-cap',
    name: 'Wool Baseball Cap',
    subtitle: 'Six-panel, brushed wool',
    description:
      'A six-panel cap in brushed wool with a soft brim and an adjustable strap. No logo, just a clean shape and a warm, textured hand.',
    price: 65,
    category: 'accessories',
    subcategory: 'Caps',
    image: '1521369909029-2afed882baee',
    imageAlt: 'Grey wool six-panel baseball cap',
    focus: 'center',
    colors: [
      { name: 'Grey', hex: '#7E7E78' },
      { name: 'Olive', hex: '#5A6146' },
    ],
    sizes: ['One Size'],
    composition: '70% wool, 30% recycled polyester. Cotton twill tape.',
    care: 'Spot clean only. Air dry away from direct heat.',
    origin: 'Made in Portugal',
    fit: 'Adjustable strap. One size fits most.',
    isBestseller: true,
    popularity: 83,
  },
  {
    slug: 'cotton-twill-cap',
    name: 'Cotton Twill Cap',
    subtitle: 'Unstructured, low profile',
    description:
      'An unstructured cap in washed cotton twill, cut low and soft so it packs flat in a bag. The brim has just enough curve.',
    price: 55,
    category: 'accessories',
    subcategory: 'Caps',
    image: '1588850561407-ed78c282e89b',
    imageAlt: 'White unstructured cotton twill cap',
    focus: 'center',
    colors: [
      { name: 'Ecru', hex: '#E2DCCD' },
      { name: 'Black', hex: '#1D1D18' },
    ],
    sizes: ['One Size'],
    composition: '100% washed cotton twill.',
    care: 'Hand wash cold. Air dry with the brim shaped.',
    origin: 'Made in Portugal',
    fit: 'Unstructured low profile. Adjustable back strap.',
    isNew: true,
    popularity: 56,
  },
  {
    slug: 'pendant-necklace',
    name: 'Pendant Necklace',
    subtitle: '18k vermeil, hand-cut stone',
    description:
      'A single hand-cut stone suspended from a fine vermeil chain. Designed to sit at the collarbone — an accent, never an announcement.',
    price: 140,
    category: 'accessories',
    subcategory: 'Jewellery',
    image: '1599643478518-a784e5dc4c8f',
    imageAlt: 'Gold vermeil pendant necklace with blue stone',
    focus: 'center',
    colors: [{ name: 'Gold', hex: '#C9A227' }],
    sizes: ['One Size'],
    composition: '18k gold vermeil over recycled silver. Hand-cut stone.',
    care: 'Remove before swimming. Polish with the cloth provided.',
    origin: 'Made in France',
    fit: 'Chain length 45 cm, adjustable to 42 cm.',
    isNew: true,
    popularity: 59,
  },
  {
    slug: 'suede-mule',
    name: 'Suede Mule',
    subtitle: 'Soft suede, stacked heel',
    description:
      'A slip-on mule in soft suede with a pointed, softly squared toe and a stacked 45 mm heel. Polished enough for dinner, easy enough for the walk there.',
    price: 290,
    compareAt: 350,
    category: 'accessories',
    subcategory: 'Footwear',
    image: '1519415943484-9fa1873496d4',
    imageAlt: 'Nude suede mules arranged on a white surface',
    focus: 'center',
    colors: [
      { name: 'Nude', hex: '#C9A995' },
      { name: 'Black', hex: '#1D1D18' },
    ],
    sizes: ['36', '37', '38', '39', '40', '41'],
    soldOut: ['Nude/36', 'Nude/41'],
    composition: '100% suede upper and lining. Stacked leather heel.',
    care: 'Store with shoe trees. Protect with the felt bag provided.',
    origin: 'Made in Italy',
    fit: 'True to size. If between sizes, take the larger.',
    popularity: 63,
  },
];

export const PRODUCTS: Product[] = SPECS.map(makeProduct);

/* ── Query helpers ──────────────────────────────────────── */

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function isOnSale(product: Product): boolean {
  return (
    product.compare_at_price !== null && product.compare_at_price > product.price
  );
}

export function getNewArrivals(): Product[] {
  return PRODUCTS.filter((p) => p.is_new_arrival);
}

export function getBestsellers(): Product[] {
  return PRODUCTS.filter((p) => p.is_bestseller);
}

export function getSaleProducts(): Product[] {
  return PRODUCTS.filter(isOnSale);
}

export function getProductsByCategory(slug: CategorySlug): Product[] {
  return PRODUCTS.filter((p) => p.category?.slug === slug);
}

export function getProductsBySubcategory(subcategory: string): Product[] {
  return PRODUCTS.filter((p) => p.subcategory === subcategory);
}

export function getProductSubcategories(): string[] {
  return Array.from(
    new Set(PRODUCTS.map((p) => p.subcategory).filter(Boolean) as string[])
  ).sort();
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameSubcategory = PRODUCTS.filter(
    (p) => p.id !== product.id && p.subcategory === product.subcategory
  );
  const sameCategory = PRODUCTS.filter(
    (p) =>
      p.id !== product.id &&
      p.category?.slug === product.category?.slug &&
      p.subcategory !== product.subcategory
  );
  const rest = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category?.slug !== product.category?.slug
  );
  return [...sameSubcategory, ...sameCategory, ...rest].slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const term = query.trim().toLowerCase();
  if (!term) return [];
  return PRODUCTS.filter((product) => {
    const haystack = [
      product.name,
      product.subtitle ?? '',
      product.description,
      product.category?.name ?? '',
      product.subcategory ?? '',
      ...(product.variants?.map((v) => v.color_name) ?? []),
    ]
      .join(' ')
      .toLowerCase();
    return term.split(/\s+/).every((word) => haystack.includes(word));
  });
}

/* ── Collections ────────────────────────────────────────── */

export interface CollectionMeta {
  slug: string;
  title: string;
  eyebrow: string;
  statement: string;
  image: string;
  alt: string;
  kind: 'department' | 'edit' | 'service';
}

export const COLLECTIONS: Record<string, CollectionMeta> = {
  women: {
    slug: 'women',
    title: 'Women',
    eyebrow: 'The Women’s Collection',
    statement:
      'Utility silhouettes, softened. Workwear proportions and everyday layers, cut with a Parisian hand.',
    image: u('1539109136881-3be0616acf4b', 2200, 1400, 'faces'),
    alt: 'Woman in a pale blue coat in Milan — Maison Valère Women',
    kind: 'department',
  },
  men: {
    slug: 'men',
    title: 'Men',
    eyebrow: 'The Men’s Collection',
    statement:
      'Rigid denim, honest fleece and made-to-last outerwear. A wardrobe built to be worn in, not saved for later.',
    image: u('1487222477894-8943e31ef7b2', 2200, 1400, 'faces'),
    alt: 'Man in a leather jacket — Maison Valère Men',
    kind: 'department',
  },
  accessories: {
    slug: 'accessories',
    title: 'Accessories',
    eyebrow: 'The Accessories',
    statement:
      'Leather, brushed steel and washed cotton — the finishing pieces that do the quiet work.',
    image: u('1547949003-9792a18a2601', 2200, 1400, 'center'),
    alt: 'Leather bags and accessories — Maison Valère Accessories',
    kind: 'department',
  },
  'new-arrivals': {
    slug: 'new-arrivals',
    title: 'New Arrivals',
    eyebrow: 'Just Landed',
    statement:
      'The newest additions to the line — first access, before the rest of the world catches on.',
    image: u('1578932750294-f5075e85f44a', 2200, 1400, 'center'),
    alt: 'New season garments on a rail — Maison Valère new arrivals',
    kind: 'service',
  },
  'best-sellers': {
    slug: 'best-sellers',
    title: 'Best Sellers',
    eyebrow: 'The Icons',
    statement:
      'The pieces our customers return to, season after season. Tried, worn and still standing.',
    image: u('1551537482-f2075a1d41f2', 2200, 1400, 'faces'),
    alt: 'Man in a denim trucker jacket — Maison Valère best sellers',
    kind: 'service',
  },
  sale: {
    slug: 'sale',
    title: 'Sale',
    eyebrow: 'Last Call',
    statement:
      'End-of-season pieces at a better price. Same construction, same materials, fewer left.',
    image: u('1591047139829-d91aecb6caea', 2200, 1400, 'center'),
    alt: 'Bomber jacket on a hanger — Maison Valère sale',
    kind: 'service',
  },
  'new-season': {
    slug: 'new-season',
    title: 'New Season',
    eyebrow: 'Autumn / Winter 2026',
    statement:
      'The first drop of the season: heavier layers, deeper tones and the return of the everyday uniform.',
    image: u('1550614000-4895a10e1bfd', 2200, 1400, 'faces'),
    alt: 'Women in burgundy occasion wear — Maison Valère new season',
    kind: 'edit',
  },
  'essential-outerwear': {
    slug: 'essential-outerwear',
    title: 'Essential Outerwear',
    eyebrow: 'Layer One',
    statement:
      'Coats, truckers and bombers built for the weather and the long walk home. The first thing you put on, the last thing you take off.',
    image: u('1520975954732-35dd22299614', 2200, 1400, 'faces'),
    alt: 'Man in a black leather biker jacket — Maison Valère outerwear',
    kind: 'edit',
  },
  'everyday-uniform': {
    slug: 'everyday-uniform',
    title: 'Everyday Uniform',
    eyebrow: 'Worn Daily',
    statement:
      'Tees, sweats, shirts and trousers that work as hard as you do. A complete uniform, without the uniform.',
    image: u('1517841905240-472988babdf9', 2200, 1400, 'faces'),
    alt: 'Woman in a denim jacket and blue hoodie — Maison Valère everyday uniform',
    kind: 'edit',
  },
  'denim-trousers': {
    slug: 'denim-trousers',
    title: 'Denim & Trousers',
    eyebrow: 'The Foundation',
    statement:
      'Straight, wide, tapered and pleated. Rigid denim and dry wool, built around the way you actually move.',
    image: u('1542272604-787c3835535d', 2200, 1400, 'center'),
    alt: 'Close-up of indigo denim — Maison Valère denim and trousers',
    kind: 'edit',
  },
  'graphic-tees': {
    slug: 'graphic-tees',
    title: 'Graphic Tees',
    eyebrow: 'The Message',
    statement:
      'Heavy jersey, clean cuts and prints with something to say. The easiest layer in the wardrobe.',
    image: u('1529139574466-a303027c1d8b', 2200, 1400, 'faces'),
    alt: 'Woman in a red graphic tee — Maison Valère graphic tees',
    kind: 'edit',
  },
};

export const MAIN_COLLECTIONS = Object.values(COLLECTIONS).filter(
  (collection) => collection.kind !== 'edit'
);

export const EDITS = Object.values(COLLECTIONS).filter(
  (collection) => collection.kind === 'edit'
);

export const HOME_COLLECTIONS = [
  {
    index: '01',
    name: 'New Season',
    tagline: 'The first drop of AW26',
    href: '/collections/new-season',
    slug: 'new-season',
    image: u('1550614000-4895a10e1bfd', 1400, 1750, 'faces'),
    alt: 'The new season collection — Maison Valère',
  },
  {
    index: '02',
    name: 'Essential Outerwear',
    tagline: 'Built for the weather',
    href: '/collections/essential-outerwear',
    slug: 'essential-outerwear',
    image: u('1520975954732-35dd22299614', 1400, 1750, 'faces'),
    alt: 'Leather outerwear — Maison Valère',
  },
  {
    index: '03',
    name: 'Everyday Uniform',
    tagline: 'The pieces you live in',
    href: '/collections/everyday-uniform',
    slug: 'everyday-uniform',
    image: u('1517841905240-472988babdf9', 1400, 1750, 'faces'),
    alt: 'Denim and hoodie layering — Maison Valère',
  },
  {
    index: '04',
    name: 'Denim & Trousers',
    tagline: 'The foundation',
    href: '/collections/denim-trousers',
    slug: 'denim-trousers',
    image: u('1542272604-787c3835535d', 1400, 1750, 'center'),
    alt: 'Indigo denim detail — Maison Valère',
  },
  {
    index: '05',
    name: 'Graphic Tees',
    tagline: 'Say it quietly',
    href: '/collections/graphic-tees',
    slug: 'graphic-tees',
    image: u('1529139574466-a303027c1d8b', 1400, 1750, 'faces'),
    alt: 'Graphic tee campaign — Maison Valère',
  },
];

const EDIT_FILTERS: Record<string, (product: Product) => boolean> = {
  'new-season': (product) => product.is_new_arrival,
  'essential-outerwear': (product) => product.subcategory === 'Outerwear',
  'everyday-uniform': (product) =>
    ['T-shirts', 'Shirts', 'Sweatshirts', 'Knitwear', 'Trousers', 'Denim'].includes(
      product.subcategory ?? ''
    ),
  'denim-trousers': (product) =>
    ['Denim', 'Trousers', 'Shorts'].includes(product.subcategory ?? ''),
  'graphic-tees': (product) => product.subcategory === 'T-shirts',
};

export function getCollection(slug: string): CollectionMeta | undefined {
  return COLLECTIONS[slug];
}

export function getCollectionProducts(slug: string): Product[] {
  if (slug === 'new-arrivals') return getNewArrivals();
  if (slug === 'best-sellers') return getBestsellers();
  if (slug === 'sale') return getSaleProducts();
  if (slug === 'women' || slug === 'men' || slug === 'accessories') {
    return getProductsByCategory(slug);
  }
  const filter = EDIT_FILTERS[slug];
  return filter ? PRODUCTS.filter(filter) : [];
}
