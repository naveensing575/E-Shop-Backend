export interface User {
  userId: number;
  email: string;
}

export interface Order {
  orderId: number;
  userId: number;
  status: string;
}

export interface OrderDetail {
  orderDetailId: number;
  orderId: number;
  productId: number;
  quantity: number;
  subtotal: number;
}

export interface PurchaseHistory {
  purchaseHistoryId: number;
  userId: number;
  active: boolean;
}

export interface PurchasedProduct {
  purchasedProductId: number;
  productId: number;
  purchaseHistoryId: number;
  quantity: number;
  active: boolean;
}
