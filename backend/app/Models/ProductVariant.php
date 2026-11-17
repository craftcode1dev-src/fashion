<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'size',
        'color_name',
        'color_hex',
        'sku',
        'stock',
        'price_modifier',
    ];

    protected $casts = [
        'stock' => 'integer',
        'price_modifier' => 'float',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
