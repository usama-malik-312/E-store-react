import { CartItem, CartTotals } from "../types";

/**
 * Calculate cart totals including subtotal, tax, discount, and total
 */
export function calculateCartTotals(
  items: CartItem[],
  globalDiscount: number = 0,
  amountPaid: number = 0
): CartTotals {
  // Calculate item-level subtotals
  let subtotal = 0;
  let totalTax = 0;
  let totalDiscount = 0;

  items.forEach((item) => {
    const itemSubtotal = item.unit_price * item.quantity;
    subtotal += itemSubtotal;

    // Calculate item-level discount
    if (item.discount_percentage && item.discount_percentage > 0) {
      const itemDiscount = (itemSubtotal * item.discount_percentage) / 100;
      totalDiscount += itemDiscount;
    }

    // Calculate item-level tax (on discounted amount if discount exists)
    if (item.tax_percentage && item.tax_percentage > 0) {
      const itemSubtotalAfterDiscount =
        itemSubtotal - (item.discount_percentage ? (itemSubtotal * item.discount_percentage) / 100 : 0);
      const itemTax = (itemSubtotalAfterDiscount * item.tax_percentage) / 100;
      totalTax += itemTax;
    }
  });

  // Apply global discount
  const subtotalAfterDiscount = subtotal - totalDiscount - globalDiscount;
  const finalTotal = subtotalAfterDiscount + totalTax;
  const changeDue = Math.max(0, amountPaid - finalTotal);

  return {
    subtotal,
    tax: totalTax,
    discount: totalDiscount + globalDiscount,
    total: finalTotal,
    changeDue,
  };
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

