<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'images', 'variants'])->orderBy('created_at', 'desc');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('gender')) {
            $query->where('gender', $request->gender);
        }

        $products = $query->paginate(20);

        return response()->json([
            'status' => 'success',
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'total' => $products->total(),
            ],
        ]);
    }

    public function show($id)
    {
        $product = Product::with(['category', 'images', 'variants'])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $product,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products,sku',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'required|string',
            'composition' => 'nullable|string',
            'care_instructions' => 'nullable|string',
            'fit_advice' => 'nullable|string',
            'origin' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'compare_at_price' => 'nullable|numeric|min:0',
            'gender' => 'required|in:women,men,unisex',
            'is_featured' => 'boolean',
            'is_new_arrival' => 'boolean',
            'is_bestseller' => 'boolean',
            'is_active' => 'boolean',
            'stock' => 'integer|min:0',
            'images' => 'nullable|array',
            'images.*.image_url' => 'required_with:images|string',
            'images.*.is_primary' => 'boolean',
            'variants' => 'nullable|array',
            'variants.*.size' => 'required_with:variants|string',
            'variants.*.color_name' => 'required_with:variants|string',
            'variants.*.color_hex' => 'nullable|string',
            'variants.*.stock' => 'required_with:variants|integer|min:0',
            'variants.*.price_modifier' => 'nullable|numeric',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $slug = Str::slug($validated['name']);
            // Ensure unique slug
            $existingCount = Product::where('slug', 'like', "{$slug}%")->count();
            if ($existingCount > 0) {
                $slug .= '-' . ($existingCount + 1);
            }

            $product = Product::create([
                'category_id' => $validated['category_id'],
                'name' => $validated['name'],
                'slug' => $slug,
                'sku' => $validated['sku'],
                'subtitle' => $validated['subtitle'] ?? null,
                'description' => $validated['description'],
                'composition' => $validated['composition'] ?? null,
                'care_instructions' => $validated['care_instructions'] ?? null,
                'fit_advice' => $validated['fit_advice'] ?? null,
                'origin' => $validated['origin'] ?? 'Crafted in Italy',
                'price' => $validated['price'],
                'compare_at_price' => $validated['compare_at_price'] ?? null,
                'gender' => $validated['gender'],
                'is_featured' => $validated['is_featured'] ?? false,
                'is_new_arrival' => $validated['is_new_arrival'] ?? true,
                'is_bestseller' => $validated['is_bestseller'] ?? false,
                'is_active' => $validated['is_active'] ?? true,
                'stock' => $validated['stock'] ?? 50,
            ]);

            // Save images
            if (!empty($validated['images'])) {
                foreach ($validated['images'] as $idx => $img) {
                    $product->images()->create([
                        'image_url' => $img['image_url'],
                        'alt_text' => $product->name,
                        'is_primary' => !empty($img['is_primary']) || $idx === 0,
                        'sort_order' => $idx,
                    ]);
                }
            }

            // Save variants
            if (!empty($validated['variants'])) {
                foreach ($validated['variants'] as $v) {
                    $product->variants()->create([
                        'size' => $v['size'],
                        'color_name' => $v['color_name'],
                        'color_hex' => $v['color_hex'] ?? '#1A1A1A',
                        'sku' => $product->sku . '-' . strtoupper(substr($v['size'], 0, 2)),
                        'stock' => $v['stock'] ?? 10,
                        'price_modifier' => $v['price_modifier'] ?? 0.00,
                    ]);
                }
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Product created successfully.',
                'data' => $product->load(['category', 'images', 'variants']),
            ], 201);
        });
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products,sku,' . $product->id,
            'subtitle' => 'nullable|string|max:255',
            'description' => 'required|string',
            'composition' => 'nullable|string',
            'care_instructions' => 'nullable|string',
            'fit_advice' => 'nullable|string',
            'origin' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'compare_at_price' => 'nullable|numeric|min:0',
            'gender' => 'required|in:women,men,unisex',
            'is_featured' => 'boolean',
            'is_new_arrival' => 'boolean',
            'is_bestseller' => 'boolean',
            'is_active' => 'boolean',
            'stock' => 'integer|min:0',
        ]);

        $product->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Product updated successfully.',
            'data' => $product->fresh(['category', 'images', 'variants']),
        ]);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Product deleted successfully.',
        ]);
    }
}
