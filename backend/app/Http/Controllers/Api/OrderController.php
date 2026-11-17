<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'nullable|string|max:50',
            'shipping_address' => 'required|string|max:255',
            'shipping_apartment' => 'nullable|string|max:100',
            'shipping_city' => 'required|string|max:100',
            'shipping_state' => 'nullable|string|max:100',
            'shipping_postal_code' => 'required|string|max:20',
            'shipping_country' => 'required|string|max:100',
            'shipping_method' => 'nullable|string|in:standard,express,concierge',
            'payment_method' => 'nullable|string|in:card,apple_pay,klarna',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.variant_id' => 'nullable|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            // Find or create customer
            $customer = Customer::firstOrCreate(
                ['email' => strtolower(trim($validated['customer_email']))],
                [
                    'name' => $validated['customer_name'],
                    'phone' => $validated['customer_phone'] ?? null,
                ]
            );

            $shippingMethod = $validated['shipping_method'] ?? 'standard';
            $shippingCost = 0.00;
            if ($shippingMethod === 'express') {
                $shippingCost = 35.00;
            } elseif ($shippingMethod === 'concierge') {
                $shippingCost = 75.00;
            }

            $subtotal = 0.00;
            $orderItemsData = [];

            foreach ($validated['items'] as $item) {
                $product = Product::with('primaryImage')->findOrFail($item['product_id']);
                $variant = !empty($item['variant_id']) ? ProductVariant::find($item['variant_id']) : null;

                $itemPrice = (float) $product->price + ($variant ? (float) $variant->price_modifier : 0.00);
                $qty = (int) $item['quantity'];
                $itemTotal = $itemPrice * $qty;
                $subtotal += $itemTotal;

                $variantLabel = $variant ? "{$variant->size} / {$variant->color_name}" : null;
                $imageUrl = $product->primaryImage ? $product->primaryImage->image_url : null;

                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'product_variant_id' => $variant ? $variant->id : null,
                    'product_name' => $product->name,
                    'variant_label' => $variantLabel,
                    'price' => $itemPrice,
                    'quantity' => $qty,
                    'total' => $itemTotal,
                    'image_url' => $imageUrl,
                ];

                // Decrement stock
                if ($variant) {
                    $variant->decrement('stock', min($qty, $variant->stock));
                }
                $product->decrement('stock', min($qty, $product->stock));
            }

            $tax = round($subtotal * 0.08, 2); // 8% luxury sales tax
            $total = $subtotal + $shippingCost + $tax;

            // Generate luxurious unique order number (e.g. MV-2026-9281)
            $orderNumber = 'MV-' . date('Y') . '-' . strtoupper(Str::random(4)) . rand(10, 99);

            $order = Order::create([
                'customer_id' => $customer->id,
                'order_number' => $orderNumber,
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'] ?? null,
                'shipping_address' => $validated['shipping_address'],
                'shipping_apartment' => $validated['shipping_apartment'] ?? null,
                'shipping_city' => $validated['shipping_city'],
                'shipping_state' => $validated['shipping_state'] ?? null,
                'shipping_postal_code' => $validated['shipping_postal_code'],
                'shipping_country' => $validated['shipping_country'],
                'shipping_method' => $shippingMethod,
                'shipping_cost' => $shippingCost,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total' => $total,
                'payment_method' => $validated['payment_method'] ?? 'card',
                'payment_status' => 'paid',
                'order_status' => 'processing',
                'tracking_number' => 'VAL-' . strtoupper(Str::random(8)),
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($orderItemsData as $itemData) {
                $order->items()->create($itemData);
            }

            // Update customer totals
            $customer->increment('total_orders');
            $customer->total_spent = (float) $customer->total_spent + $total;
            $customer->last_order_at = now();
            $customer->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Order placed successfully.',
                'data' => $order->load('items'),
            ], 201);
        });
    }

    public function show(string $orderNumber)
    {
        $order = Order::with('items')
            ->where('order_number', $orderNumber)
            ->firstOrFail();

        return response()->json([
            'status' => 'success',
            'data' => $order,
        ]);
    }
}
