<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'order_number',
        'customer_name',
        'customer_email',
        'customer_phone',
        'shipping_address',
        'shipping_apartment',
        'shipping_city',
        'shipping_state',
        'shipping_postal_code',
        'shipping_country',
        'shipping_method',
        'shipping_cost',
        'subtotal',
        'tax',
        'total',
        'payment_method',
        'payment_status',
        'order_status',
        'tracking_number',
        'notes',
    ];

    protected $casts = [
        'shipping_cost' => 'float',
        'subtotal' => 'float',
        'tax' => 'float',
        'total' => 'float',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
