<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Admin User
        User::firstOrCreate(
            ['email' => 'admin@maisonvalere.com'],
            [
                'name' => 'Hélène de Valère',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );

        // 2. Create Categories
        $categories = [
            [
                'name' => "Women's Collection",
                'slug' => 'womens-collection',
                'gender' => 'women',
                'description' => 'Architectural silhouettes, sculpted outerwear, and fluid silk pieces designed with relentless precision.',
                'image_url' => 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'name' => "Men's Collection",
                'slug' => 'mens-collection',
                'gender' => 'men',
                'description' => 'Uncompromising tailoring, refined Italian wools, and minimalist contemporary silhouettes.',
                'image_url' => 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
                'is_featured' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Leather Goods & Bags',
                'slug' => 'leather-goods',
                'gender' => 'unisex',
                'description' => 'Architectural totes and supple nappa leather pieces handcrafted in our Florence workshop.',
                'image_url' => 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85',
                'is_featured' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'Fine Accessories',
                'slug' => 'fine-accessories',
                'gender' => 'accessories',
                'description' => 'Pure Mongolian cashmere scarves, brushed raw brass hardware, and hand-finished eyewear.',
                'image_url' => 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
                'is_featured' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'The Atelier Editions',
                'slug' => 'atelier-editions',
                'gender' => 'unisex',
                'description' => 'Limited numbered releases made with rare archive textiles and couture finishing.',
                'image_url' => 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85',
                'is_featured' => false,
                'sort_order' => 5,
            ],
        ];

        $createdCategories = [];
        foreach ($categories as $catData) {
            $createdCategories[$catData['slug']] = Category::updateOrCreate(
                ['slug' => $catData['slug']],
                $catData
            );
        }

        // 3. Products Definition
        $products = [
            // Women
            [
                'category_slug' => 'womens-collection',
                'name' => 'The Valère Cocoon Cashmere Coat',
                'slug' => 'the-valere-cocoon-cashmere-coat',
                'sku' => 'MV-W-CT-01',
                'subtitle' => 'Hand-finished Double-Faced Cashmere',
                'description' => 'A masterclass in modern proportion. Cut from 100% Loro Piana double-faced cashmere, this coat features an enveloping drop-shoulder silhouette, exaggerated peak lapels, and an unlined interior meticulously finished by hand in our Milan atelier.',
                'composition' => '100% Loro Piana Double-Faced Cashmere',
                'care_instructions' => 'Specialist luxury dry clean only. Store on wide cedar hanger in provided breathable cotton garment bag.',
                'fit_advice' => 'Designed for an effortless, oversized drape. We recommend taking your usual size.',
                'origin' => 'Crafted in Biella, Italy',
                'price' => 2850.00,
                'compare_at_price' => 3200.00,
                'gender' => 'women',
                'is_featured' => true,
                'is_new_arrival' => false,
                'is_bestseller' => true,
                'stock' => 18,
                'images' => [
                    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=85',
                    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
                    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85',
                ],
                'variants' => [
                    ['size' => 'XS', 'color_name' => 'Warm Camel', 'color_hex' => '#C49E74', 'stock' => 3],
                    ['size' => 'S', 'color_name' => 'Warm Camel', 'color_hex' => '#C49E74', 'stock' => 5],
                    ['size' => 'M', 'color_name' => 'Warm Camel', 'color_hex' => '#C49E74', 'stock' => 4],
                    ['size' => 'L', 'color_name' => 'Warm Camel', 'color_hex' => '#C49E74', 'stock' => 2],
                    ['size' => 'S', 'color_name' => 'Noir Deep Black', 'color_hex' => '#141414', 'stock' => 4],
                ],
            ],
            [
                'category_slug' => 'womens-collection',
                'name' => 'Sculpted Double-Breasted Wool Blazer',
                'slug' => 'sculpted-double-breasted-wool-blazer',
                'sku' => 'MV-W-BZ-02',
                'subtitle' => 'High-Twist Super 150s Virgin Wool',
                'description' => 'Precision engineering meets sensual drape. This blazer is structured with canvassed horsehair chest pieces for an architectural shoulder, cinching subtly at the natural waist before opening into a clean, vented hemline.',
                'composition' => '98% Super 150s Virgin Wool, 2% Elastane. Lining: 100% Cupro',
                'care_instructions' => 'Dry clean only. Steam softly to refresh fibers.',
                'fit_advice' => 'Tailored architectural fit. Fits true to size.',
                'origin' => 'Crafted in Paris, France',
                'price' => 1650.00,
                'compare_at_price' => null,
                'gender' => 'women',
                'is_featured' => true,
                'is_new_arrival' => true,
                'is_bestseller' => false,
                'stock' => 22,
                'images' => [
                    'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=1200&q=85',
                    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1200&q=85',
                    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
                ],
                'variants' => [
                    ['size' => 'XS', 'color_name' => 'Noir Deep Black', 'color_hex' => '#151515', 'stock' => 4],
                    ['size' => 'S', 'color_name' => 'Noir Deep Black', 'color_hex' => '#151515', 'stock' => 6],
                    ['size' => 'M', 'color_name' => 'Noir Deep Black', 'color_hex' => '#151515', 'stock' => 5],
                    ['size' => 'S', 'color_name' => 'Chalk Alabaster', 'color_hex' => '#F2ECE4', 'stock' => 4],
                    ['size' => 'M', 'color_name' => 'Chalk Alabaster', 'color_hex' => '#F2ECE4', 'stock' => 3],
                ],
            ],
            [
                'category_slug' => 'womens-collection',
                'name' => 'Pleated Fluid Silk Crepe Trousers',
                'slug' => 'pleated-fluid-silk-crepe-trousers',
                'sku' => 'MV-W-TR-03',
                'subtitle' => 'Heavyweight 32mm Silk Crepe',
                'description' => 'Crafted from substantial 32mm silk crepe de chine with deep double front knife pleats. Features a high waistline, extended tab closure, and an elongated wide leg that drapes dramatically over footwear.',
                'composition' => '100% Mulberry Silk Crepe de Chine',
                'care_instructions' => 'Dry clean gentle cycle. Low iron with pressing cloth.',
                'fit_advice' => 'High-rise with a fluid, wide-leg cut. Cut long to break elegantly over heels.',
                'origin' => 'Crafted in Lyon, France',
                'price' => 890.00,
                'compare_at_price' => 980.00,
                'gender' => 'women',
                'is_featured' => false,
                'is_new_arrival' => true,
                'is_bestseller' => true,
                'stock' => 25,
                'images' => [
                    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
                    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
                ],
                'variants' => [
                    ['size' => 'XS', 'color_name' => 'Warm Stone', 'color_hex' => '#D8D0C5', 'stock' => 5],
                    ['size' => 'S', 'color_name' => 'Warm Stone', 'color_hex' => '#D8D0C5', 'stock' => 8],
                    ['size' => 'M', 'color_name' => 'Warm Stone', 'color_hex' => '#D8D0C5', 'stock' => 6],
                    ['size' => 'L', 'color_name' => 'Warm Stone', 'color_hex' => '#D8D0C5', 'stock' => 4],
                    ['size' => 'S', 'color_name' => 'Noir Deep Black', 'color_hex' => '#181818', 'stock' => 2],
                ],
            ],
            [
                'category_slug' => 'womens-collection',
                'name' => 'Asymmetric Draped Merino Turtleneck',
                'slug' => 'asymmetric-draped-merino-turtleneck',
                'sku' => 'MV-W-KN-04',
                'subtitle' => 'Ultra-Fine 18.5 Micron Merino Wool',
                'description' => 'Spun from extrafine Australian merino wool with a seamless 3D knit construction. A fluid asymmetric cowl neckline drapes effortlessly across the collarbone, balanced by elongated ribbed cuffs.',
                'composition' => '100% Extrafine Merino Wool',
                'care_instructions' => 'Hand wash cold using specialist wool detergent. Dry flat.',
                'fit_advice' => 'Relaxed body with elongated slim sleeves. Take regular size.',
                'origin' => 'Crafted in Tuscany, Italy',
                'price' => 680.00,
                'compare_at_price' => null,
                'gender' => 'women',
                'is_featured' => false,
                'is_new_arrival' => false,
                'is_bestseller' => false,
                'stock' => 30,
                'images' => [
                    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85',
                    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=85',
                ],
                'variants' => [
                    ['size' => 'XS', 'color_name' => 'Oatmeal Melange', 'color_hex' => '#E3DDD3', 'stock' => 6],
                    ['size' => 'S', 'color_name' => 'Oatmeal Melange', 'color_hex' => '#E3DDD3', 'stock' => 10],
                    ['size' => 'M', 'color_name' => 'Oatmeal Melange', 'color_hex' => '#E3DDD3', 'stock' => 8],
                    ['size' => 'L', 'color_name' => 'Oatmeal Melange', 'color_hex' => '#E3DDD3', 'stock' => 6],
                ],
            ],
            [
                'category_slug' => 'womens-collection',
                'name' => 'Architectural Minimalist Column Dress',
                'slug' => 'architectural-minimalist-column-dress',
                'sku' => 'MV-W-DR-05',
                'subtitle' => 'Bonded Matte Satin & Silk Crepe',
                'description' => 'A sculptural statement piece for evening affairs. Features a geometric boat neck, subtle side slit, and an unbroken floor-skimming column silhouette that captures the essence of contemporary high fashion minimalism.',
                'composition' => '82% Viscose, 18% Mulberry Silk',
                'care_instructions' => 'Specialist luxury dry clean only.',
                'fit_advice' => 'Fitted through bust and hips. Falls straight to the floor.',
                'origin' => 'Crafted in Paris, France',
                'price' => 1950.00,
                'compare_at_price' => null,
                'gender' => 'women',
                'is_featured' => true,
                'is_new_arrival' => false,
                'is_bestseller' => true,
                'stock' => 14,
                'images' => [
                    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=85',
                    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
                ],
                'variants' => [
                    ['size' => 'XS', 'color_name' => 'Noir Deep Black', 'color_hex' => '#121212', 'stock' => 2],
                    ['size' => 'S', 'color_name' => 'Noir Deep Black', 'color_hex' => '#121212', 'stock' => 5],
                    ['size' => 'M', 'color_name' => 'Noir Deep Black', 'color_hex' => '#121212', 'stock' => 4],
                    ['size' => 'S', 'color_name' => 'Bordeaux Reserve', 'color_hex' => '#4A1C24', 'stock' => 3],
                ],
            ],

            // Men
            [
                'category_slug' => 'mens-collection',
                'name' => 'The Grand Atelier Chesterfield Overcoat',
                'slug' => 'the-grand-atelier-chesterfield-overcoat',
                'sku' => 'MV-M-CT-01',
                'subtitle' => 'Heavy Melton Wool & Silk Velvet Collar',
                'description' => 'Constructed from archival 800g Italian melton wool. Features a clean concealed horn-button placket, hand-stitched velvet undercollar, deep welt pockets, and an elongated mid-calf drape.',
                'composition' => '100% Virgin Melton Wool. Collar: 100% Cotton Velvet. Lining: 100% Cupro',
                'care_instructions' => 'Dry clean only by luxury outerwear specialist.',
                'fit_advice' => 'Generously cut over tailoring. Fits true to size.',
                'origin' => 'Crafted in Biella, Italy',
                'price' => 2600.00,
                'compare_at_price' => 2950.00,
                'gender' => 'men',
                'is_featured' => true,
                'is_new_arrival' => true,
                'is_bestseller' => true,
                'stock' => 15,
                'images' => [
                    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
                    'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1200&q=85',
                    'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1200&q=85',
                ],
                'variants' => [
                    ['size' => 'S', 'color_name' => 'Midnight Noir', 'color_hex' => '#131518', 'stock' => 3],
                    ['size' => 'M', 'color_name' => 'Midnight Noir', 'color_hex' => '#131518', 'stock' => 5],
                    ['size' => 'L', 'color_name' => 'Midnight Noir', 'color_hex' => '#131518', 'stock' => 4],
                    ['size' => 'XL', 'color_name' => 'Midnight Noir', 'color_hex' => '#131518', 'stock' => 3],
                ],
            ],
            [
                'category_slug' => 'mens-collection',
                'name' => 'Relaxed Tailored Virgin Wool Trousers',
                'slug' => 'relaxed-tailored-virgin-wool-trousers',
                'sku' => 'MV-M-TR-02',
                'subtitle' => 'High-Twist Tropical Wool with Forward Pleats',
                'description' => 'Cut with deep forward pleats and adjustable horn side-cinches, dispensing with belt loops for an unbroken minimalist waistline. Falls into an elegant tapered drape with turn-up cuffs.',
                'composition' => '100% Italian Virgin Wool',
                'care_instructions' => 'Dry clean only. Steam softly.',
                'fit_advice' => 'Mid-rise, relaxed taper. Hemmed at ankle length.',
                'origin' => 'Crafted in Naples, Italy',
                'price' => 740.00,
                'compare_at_price' => null,
                'gender' => 'men',
                'is_featured' => false,
                'is_new_arrival' => false,
                'is_bestseller' => true,
                'stock' => 28,
                'images' => [
                    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=85',
                    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
                ],
                'variants' => [
                    ['size' => 'S', 'color_name' => 'Charcoal Slate', 'color_hex' => '#2E3033', 'stock' => 6],
                    ['size' => 'M', 'color_name' => 'Charcoal Slate', 'color_hex' => '#2E3033', 'stock' => 10],
                    ['size' => 'L', 'color_name' => 'Charcoal Slate', 'color_hex' => '#2E3033', 'stock' => 8],
                    ['size' => 'XL', 'color_name' => 'Charcoal Slate', 'color_hex' => '#2E3033', 'stock' => 4],
                ],
            ],
            [
                'category_slug' => 'mens-collection',
                'name' => 'Brushed Mohair-Blend Oversized Knit',
                'slug' => 'brushed-mohair-blend-oversized-knit',
                'sku' => 'MV-M-KN-03',
                'subtitle' => 'South African Kid Mohair & Merino',
                'description' => 'Unbelievably soft and cloud-like. Hand-brushed in small batches to produce a distinctive fuzzy texture. Features dropped shoulder seams and chunky ribbed trims that hold their shape.',
                'composition' => '50% Kid Mohair, 32% Extrafine Merino, 18% Polyamide',
                'care_instructions' => 'Hand wash cold. Dry flat on clean towel. Store folded.',
                'fit_advice' => 'Intentionally relaxed, slouchy silhouette.',
                'origin' => 'Crafted in Biella, Italy',
                'price' => 720.00,
                'compare_at_price' => null,
                'gender' => 'men',
                'is_featured' => false,
                'is_new_arrival' => true,
                'is_bestseller' => false,
                'stock' => 20,
                'images' => [
                    'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1200&q=85',
                    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
                ],
                'variants' => [
                    ['size' => 'S', 'color_name' => 'Smoky Sage', 'color_hex' => '#7A847B', 'stock' => 4],
                    ['size' => 'M', 'color_name' => 'Smoky Sage', 'color_hex' => '#7A847B', 'stock' => 7],
                    ['size' => 'L', 'color_name' => 'Smoky Sage', 'color_hex' => '#7A847B', 'stock' => 5],
                    ['size' => 'M', 'color_name' => 'Warm Sand', 'color_hex' => '#D5CBBF', 'stock' => 4],
                ],
            ],
            [
                'category_slug' => 'mens-collection',
                'name' => 'Minimalist Boxy Nappa Leather Jacket',
                'slug' => 'minimalist-boxy-nappa-leather-jacket',
                'sku' => 'MV-M-JK-04',
                'subtitle' => 'Buttery Soft French Lambskin',
                'description' => 'An ultra-refined reduction of the classic Harrington silhouette. Stripped of superfluous seams, featuring custom palladium two-way Excella zippers and discreet seam pockets.',
                'composition' => '100% French Lamb Nappa Leather. Lining: 100% Cupro',
                'care_instructions' => 'Specialist leather clean only.',
                'fit_advice' => 'Boxy modern cut. Sits squarely on the hip line.',
                'origin' => 'Crafted in Millau, France',
                'price' => 2450.00,
                'compare_at_price' => 2750.00,
                'gender' => 'men',
                'is_featured' => true,
                'is_new_arrival' => false,
                'is_bestseller' => true,
                'stock' => 12,
                'images' => [
                    'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=1200&q=85',
                    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
                ],
                'variants' => [
                    ['size' => 'S', 'color_name' => 'Noir Deep Black', 'color_hex' => '#111111', 'stock' => 2],
                    ['size' => 'M', 'color_name' => 'Noir Deep Black', 'color_hex' => '#111111', 'stock' => 4],
                    ['size' => 'L', 'color_name' => 'Noir Deep Black', 'color_hex' => '#111111', 'stock' => 4],
                    ['size' => 'XL', 'color_name' => 'Noir Deep Black', 'color_hex' => '#111111', 'stock' => 2],
                ],
            ],

            // Leather Goods
            [
                'category_slug' => 'leather-goods',
                'name' => 'The Valère Signature Leather Tote',
                'slug' => 'the-valere-signature-leather-tote',
                'sku' => 'MV-U-BG-01',
                'subtitle' => 'Full-Grain Tuscan Calfskin & Suede Lining',
                'description' => 'Constructed from vegetable-tanned French calfskin that develops an exquisite natural patina over decades. Characterized by folded edge construction, magnetic hidden closure, and an interior zip compartment.',
                'composition' => '100% Tuscan Vegetable-Tanned Calfskin. Lining: 100% Suede Kidskin',
                'care_instructions' => 'Condition occasionally with natural beeswax leather balm.',
                'fit_advice' => 'Dimensions: 42cm x 34cm x 16cm. Accommodates a 16-inch laptop with room to spare.',
                'origin' => 'Handcrafted in Florence, Italy',
                'price' => 1650.00,
                'compare_at_price' => null,
                'gender' => 'unisex',
                'is_featured' => true,
                'is_new_arrival' => false,
                'is_bestseller' => true,
                'stock' => 16,
                'images' => [
                    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85',
                    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85',
                ],
                'variants' => [
                    ['size' => 'One Size', 'color_name' => 'Espresso Brown', 'color_hex' => '#3D281D', 'stock' => 7],
                    ['size' => 'One Size', 'color_name' => 'Noir Deep Black', 'color_hex' => '#171717', 'stock' => 6],
                    ['size' => 'One Size', 'color_name' => 'Warm Camel', 'color_hex' => '#C49E74', 'stock' => 3],
                ],
            ],
            [
                'category_slug' => 'leather-goods',
                'name' => 'Architectural Minimalist Crossbody Pouch',
                'slug' => 'architectural-minimalist-crossbody-pouch',
                'sku' => 'MV-U-BG-02',
                'subtitle' => 'Smooth Box-Calf with Hidden Magnetic Lock',
                'description' => 'A geometric sculpture in motion. Precision-beveled hand-painted edges and an adjustable tubular leather strap designed to sit flat against tailored coats.',
                'composition' => '100% Box Calf Leather',
                'care_instructions' => 'Wipe clean with a microfiber cloth.',
                'fit_advice' => 'Dimensions: 22cm x 16cm x 7cm.',
                'origin' => 'Handcrafted in Florence, Italy',
                'price' => 980.00,
                'compare_at_price' => 1100.00,
                'gender' => 'unisex',
                'is_featured' => false,
                'is_new_arrival' => true,
                'is_bestseller' => false,
                'stock' => 19,
                'images' => [
                    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85',
                    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85',
                ],
                'variants' => [
                    ['size' => 'One Size', 'color_name' => 'Noir Deep Black', 'color_hex' => '#121212', 'stock' => 10],
                    ['size' => 'One Size', 'color_name' => 'Bone Ivory', 'color_hex' => '#EAE6DD', 'stock' => 9],
                ],
            ],

            // Fine Accessories
            [
                'category_slug' => 'fine-accessories',
                'name' => 'Pure Mongolian Cashmere Fringe Scarf',
                'slug' => 'pure-mongolian-cashmere-fringe-scarf',
                'sku' => 'MV-A-SC-01',
                'subtitle' => 'Grown in Inner Mongolia, Woven on Wooden Looms',
                'description' => 'Woven from ethically harvested Grade-A cashmere fibers measuring 38mm in length. Finished with traditional water-ripple thistle teaseling and delicate eyelash fringes.',
                'composition' => '100% Grade-A Mongolian Cashmere',
                'care_instructions' => 'Dry clean or hand wash cold in cashmere wash.',
                'fit_advice' => '200cm x 75cm oversized generous dimensions.',
                'origin' => 'Crafted in Elgin, Scotland',
                'price' => 490.00,
                'compare_at_price' => null,
                'gender' => 'unisex',
                'is_featured' => true,
                'is_new_arrival' => false,
                'is_bestseller' => true,
                'stock' => 32,
                'images' => [
                    'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1200&q=85',
                    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
                ],
                'variants' => [
                    ['size' => 'One Size', 'color_name' => 'Warm Camel', 'color_hex' => '#C49E74', 'stock' => 12],
                    ['size' => 'One Size', 'color_name' => 'Charcoal Heather', 'color_hex' => '#424548', 'stock' => 10],
                    ['size' => 'One Size', 'color_name' => 'Ivory Cream', 'color_hex' => '#F4EFE6', 'stock' => 10],
                ],
            ],
            [
                'category_slug' => 'fine-accessories',
                'name' => 'Brushed Raw Brass Architectural Cuff',
                'slug' => 'brushed-raw-brass-architectural-cuff',
                'sku' => 'MV-A-JW-02',
                'subtitle' => 'Solid Hand-Turned Brass with Matte Satin Finish',
                'description' => 'A weighty, minimalist statement designed to complement tailored cuffs. Machined from solid brass and brushed by hand in Paris to an understated satin reflection.',
                'composition' => '100% Solid Brass with Anti-Tarnish Micro-Coat',
                'care_instructions' => 'Polish with dry lint-free cloth.',
                'fit_advice' => 'Slightly malleable to fit wrist circumference 16-19cm.',
                'origin' => 'Handcrafted in Paris, France',
                'price' => 360.00,
                'compare_at_price' => null,
                'gender' => 'unisex',
                'is_featured' => false,
                'is_new_arrival' => true,
                'is_bestseller' => false,
                'stock' => 20,
                'images' => [
                    'https://images.unsplash.com/photo-1611591475806-9284399e8840?auto=format&fit=crop&w=1200&q=85',
                    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
                ],
                'variants' => [
                    ['size' => 'S/M', 'color_name' => 'Brushed Brass', 'color_hex' => '#D4AF37', 'stock' => 10],
                    ['size' => 'M/L', 'color_name' => 'Brushed Brass', 'color_hex' => '#D4AF37', 'stock' => 10],
                ],
            ],
            [
                'category_slug' => 'fine-accessories',
                'name' => 'Architectural Acetate Sunglasses',
                'slug' => 'architectural-acetate-sunglasses',
                'sku' => 'MV-A-EY-03',
                'subtitle' => 'Mazzucchelli Bio-Acetate & Mineral Glass Lenses',
                'description' => 'Sculpted with bold beveling and 8mm thick Japanese titanium hinge pins. Barberini polarized green glass lenses with anti-reflective interior coating.',
                'composition' => '100% Mazzucchelli Italian Bio-Acetate',
                'care_instructions' => 'Clean with water and supplied silk microfiber pouch.',
                'fit_advice' => 'Universal bridge fit.',
                'origin' => 'Crafted in Belluno, Italy',
                'price' => 450.00,
                'compare_at_price' => null,
                'gender' => 'unisex',
                'is_featured' => false,
                'is_new_arrival' => true,
                'is_bestseller' => false,
                'stock' => 18,
                'images' => [
                    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=85',
                    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
                ],
                'variants' => [
                    ['size' => 'One Size', 'color_name' => 'Tokyo Tortoise', 'color_hex' => '#4A3525', 'stock' => 9],
                    ['size' => 'One Size', 'color_name' => 'Polished Noir', 'color_hex' => '#141414', 'stock' => 9],
                ],
            ],

            // Atelier Editions
            [
                'category_slug' => 'atelier-editions',
                'name' => 'Edition No. 04 Reversible Wool-Silk Cape',
                'slug' => 'edition-no-04-reversible-wool-silk-cape',
                'sku' => 'MV-AT-ED-04',
                'subtitle' => 'Limited Edition of 50 Numbered Pieces',
                'description' => 'A collector piece from our Autumn/Winter Runway. Reversible double-woven jacquard combining heavy wool and raw filament silk with hand-rolled leather toggle closures.',
                'composition' => '70% Virgin Wool, 30% Mulberry Silk',
                'care_instructions' => 'Dry clean only. Garment bag provided with archival provenance certificate.',
                'fit_advice' => 'One size fits all drapery.',
                'origin' => 'Handmade in Paris Atelier, France',
                'price' => 3400.00,
                'compare_at_price' => 3800.00,
                'gender' => 'unisex',
                'is_featured' => true,
                'is_new_arrival' => true,
                'is_bestseller' => false,
                'stock' => 7,
                'images' => [
                    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85',
                    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
                ],
                'variants' => [
                    ['size' => 'One Size', 'color_name' => 'Oatmeal & Noir', 'color_hex' => '#282828', 'stock' => 7],
                ],
            ],
        ];

        foreach ($products as $pData) {
            $cat = $createdCategories[$pData['category_slug']];
            $images = $pData['images'];
            $variants = $pData['variants'];
            unset($pData['category_slug'], $pData['images'], $pData['variants']);

            $pData['category_id'] = $cat->id;
            $product = Product::updateOrCreate(
                ['slug' => $pData['slug']],
                $pData
            );

            // Images
            $product->images()->delete();
            foreach ($images as $idx => $imgUrl) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url' => $imgUrl,
                    'alt_text' => $product->name . ' - Editorial View ' . ($idx + 1),
                    'is_primary' => $idx === 0,
                    'sort_order' => $idx,
                ]);
            }

            // Variants
            $product->variants()->delete();
            foreach ($variants as $v) {
                ProductVariant::create([
                    'product_id' => $product->id,
                    'size' => $v['size'],
                    'color_name' => $v['color_name'],
                    'color_hex' => $v['color_hex'],
                    'sku' => $product->sku . '-' . strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $v['size']), 0, 3)),
                    'stock' => $v['stock'],
                    'price_modifier' => 0.00,
                ]);
            }
        }

        // 4. Seed Customers & Realistic Orders
        $sampleCustomers = [
            [
                'name' => 'Camille Renard',
                'email' => 'camille.renard@paris-luxe.fr',
                'phone' => '+33 6 42 19 88 01',
                'city' => 'Paris',
                'country' => 'France',
                'postal_code' => '75008',
                'address' => '24 Place Vendôme',
            ],
            [
                'name' => 'Julian Montgomery',
                'email' => 'j.montgomery@mayfair-advisors.co.uk',
                'phone' => '+44 20 7946 0912',
                'city' => 'London',
                'country' => 'United Kingdom',
                'postal_code' => 'W1K 2HP',
                'address' => '12 Berkeley Square',
            ],
            [
                'name' => 'Chiara Morandi',
                'email' => 'chiara.morandi@studiodesign.it',
                'phone' => '+39 02 8739 1102',
                'city' => 'Milan',
                'country' => 'Italy',
                'postal_code' => '20121',
                'address' => 'Via Montenapoleone 8',
            ],
            [
                'name' => 'Astrid Lindqvist',
                'email' => 'astrid.l@stockholm-arch.se',
                'phone' => '+46 8 123 4567',
                'city' => 'Stockholm',
                'country' => 'Sweden',
                'postal_code' => '114 34',
                'address' => 'Stureplan 4',
            ],
        ];

        $allProducts = Product::with(['images', 'variants'])->get();

        foreach ($sampleCustomers as $cIndex => $cData) {
            $customer = Customer::updateOrCreate(
                ['email' => $cData['email']],
                [
                    'name' => $cData['name'],
                    'phone' => $cData['phone'],
                ]
            );

            // Create 1-2 realistic past orders for each customer
            $statuses = ['delivered', 'shipped', 'processing', 'pending'];
            $status = $statuses[$cIndex % count($statuses)];
            $shippingMethod = $cIndex % 2 === 0 ? 'concierge' : 'standard';
            $shippingCost = $shippingMethod === 'concierge' ? 75.00 : 0.00;

            $chosenProduct = $allProducts[$cIndex % $allProducts->count()];
            $secondProduct = $allProducts[($cIndex + 3) % $allProducts->count()];
            $firstVariant = $chosenProduct->variants->first();

            $subtotal = $chosenProduct->price + $secondProduct->price;
            $tax = round($subtotal * 0.08, 2);
            $total = $subtotal + $shippingCost + $tax;

            $orderNumber = 'MV-2026-0' . ($cIndex + 1) . '89' . rand(10, 99);

            $order = Order::updateOrCreate(
                ['order_number' => $orderNumber],
                [
                    'customer_id' => $customer->id,
                    'customer_name' => $customer->name,
                    'customer_email' => $customer->email,
                    'customer_phone' => $customer->phone,
                    'shipping_address' => $cData['address'],
                    'shipping_city' => $cData['city'],
                    'shipping_postal_code' => $cData['postal_code'],
                    'shipping_country' => $cData['country'],
                    'shipping_method' => $shippingMethod,
                    'shipping_cost' => $shippingCost,
                    'subtotal' => $subtotal,
                    'tax' => $tax,
                    'total' => $total,
                    'payment_method' => 'card',
                    'payment_status' => 'paid',
                    'order_status' => $status,
                    'tracking_number' => 'VAL-' . strtoupper(Str::random(9)),
                    'created_at' => now()->subDays(($cIndex + 1) * 3),
                ]
            );

            $order->items()->delete();
            $order->items()->create([
                'product_id' => $chosenProduct->id,
                'product_variant_id' => $firstVariant ? $firstVariant->id : null,
                'product_name' => $chosenProduct->name,
                'variant_label' => $firstVariant ? "{$firstVariant->size} / {$firstVariant->color_name}" : null,
                'price' => $chosenProduct->price,
                'quantity' => 1,
                'total' => $chosenProduct->price,
                'image_url' => $chosenProduct->images->first()?->image_url,
            ]);

            $order->items()->create([
                'product_id' => $secondProduct->id,
                'product_variant_id' => $secondProduct->variants->first()?->id,
                'product_name' => $secondProduct->name,
                'variant_label' => $secondProduct->variants->first() ? "{$secondProduct->variants->first()->size} / {$secondProduct->variants->first()->color_name}" : null,
                'price' => $secondProduct->price,
                'quantity' => 1,
                'total' => $secondProduct->price,
                'image_url' => $secondProduct->images->first()?->image_url,
            ]);

            $customer->total_orders = $customer->orders()->count();
            $customer->total_spent = $customer->orders()->sum('total');
            $customer->last_order_at = $order->created_at;
            $customer->save();
        }
    }
}
