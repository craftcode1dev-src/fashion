<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::withCount(['products' => function ($q) {
            $q->where('is_active', true);
        }])->orderBy('sort_order', 'asc');

        if ($request->filled('gender') && $request->gender !== 'all') {
            $query->where(function ($q) use ($request) {
                $q->where('gender', $request->gender)
                  ->orWhere('gender', 'unisex');
            });
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        return response()->json([
            'status' => 'success',
            'data' => $query->get(),
        ]);
    }

    public function show(string $slug)
    {
        $category = Category::where('slug', $slug)
            ->orWhere('id', $slug)
            ->with(['products' => function ($q) {
                $q->where('is_active', true)->with(['images', 'variants']);
            }])
            ->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data' => $category,
        ]);
    }
}
