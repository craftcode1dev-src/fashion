'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { Product, ProductVariant } from '@/lib/types';

interface AddToCartButtonProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  quantity?: number;
  disabled?: boolean;
}

export default function AddToCartButton({
  product,
  selectedVariant,
  quantity = 1,
  disabled = false,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const isDisabled =
    disabled || (!selectedVariant && (product.variants?.length ?? 0) > 0);

  function handleClick() {
    if (isDisabled || added) return;

    addItem(product, selectedVariant, quantity);

    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`h-14 w-full text-[10px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 ${
        added
          ? 'bg-brand-accent text-white'
          : isDisabled
            ? 'cursor-not-allowed bg-brand-fg/30 text-white'
            : 'bg-brand-fg text-brand-bg hover:bg-brand-accent hover:text-white active:scale-[0.995]'
      }`}
    >
      {added ? 'Added to bag' : isDisabled ? 'Select a size' : 'Add to bag'}
    </button>
  );
}
