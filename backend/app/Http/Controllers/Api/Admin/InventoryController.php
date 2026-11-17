<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $query = ProductVariant::with(['product' => function ($q) {
            $q->with('primaryImage', 'category');
        }])->orderBy('stock', 'asc');

        if ($request->boolean('low_stock')) {
            $query->where('stock', '<=', 5);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('product', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        $items = $query->paginate(25);

        return response()->json([
            'status' => 'success',
            'data' => $items->items(),
            'meta' => [
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
                'total' => $items->total(),
            ],
        ]);
    }

    public function updateStock(Request $request, $variantId)
    {
        $variant = ProductVariant::with('product')->findOrFail($variantId);

        $validated = $request->validate([
            'stock' => 'required|integer|min:0',
        ]);

        $variant->update(['stock' => $validated['stock']]);

        // Recalculate parent product total stock
        $totalStock = $variant->product->variants()->sum('stock');
        $variant->product->update(['stock' => $totalStock]);

        return response()->json([
            'status' => 'success',
            'message' => 'Variant stock updated.',
            'data' => $variant->fresh(),
        ]);
    }
}
