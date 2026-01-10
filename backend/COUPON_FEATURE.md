# Coupon Code Feature - API Documentation

## Overview
The coupon code feature allows users to apply discount codes during checkout to get discounts on their orders.

## API Endpoints

### User Endpoints

#### 1. Apply Coupon (Validate)
**POST** `/api/coupons/apply`
- **Auth Required**: Yes
- **Description**: Validates a coupon code and returns discount details
- **Request Body**:
```json
{
  "code": "SAVE20"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Coupon applied successfully",
  "data": {
    "code": "SAVE20",
    "discount": 200,
    "discountType": "percentage",
    "discountValue": 20
  }
}
```

#### 2. Get Active Coupons
**GET** `/api/coupons/active`
- **Auth Required**: Yes
- **Description**: Get all currently active coupons
- **Response**:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "code": "SAVE20",
      "discountType": "percentage",
      "discountValue": 20,
      "minPurchase": 1000,
      "maxDiscount": 500,
      "validUntil": "2024-12-31T23:59:59.000Z"
    }
  ]
}
```

#### 3. Create Order with Coupon
**POST** `/api/orders/create`
- **Auth Required**: Yes
- **Description**: Create order with optional coupon code
- **Request Body**:
```json
{
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "9876543210",
    "addressLine1": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "paymentMethod": "cod",
  "couponCode": "SAVE20"
}
```

### Admin Endpoints

#### 1. Create Coupon
**POST** `/api/coupons/create`
- **Auth Required**: Yes (Admin only)
- **Description**: Create a new coupon code
- **Request Body**:
```json
{
  "code": "SAVE20",
  "discountType": "percentage",
  "discountValue": 20,
  "minPurchase": 1000,
  "maxDiscount": 500,
  "usageLimit": 100,
  "validFrom": "2024-01-01T00:00:00.000Z",
  "validUntil": "2024-12-31T23:59:59.000Z",
  "isActive": true
}
```

#### 2. Get All Coupons
**GET** `/api/coupons/all`
- **Auth Required**: Yes (Admin only)
- **Description**: Get all coupons (active and inactive)

#### 3. Delete Coupon
**DELETE** `/api/coupons/:id`
- **Auth Required**: Yes (Admin only)
- **Description**: Delete a coupon by ID

## Coupon Schema

| Field | Type | Description |
|-------|------|-------------|
| code | String | Unique coupon code (uppercase) |
| discountType | String | "percentage" or "fixed" |
| discountValue | Number | Discount amount or percentage |
| minPurchase | Number | Minimum cart value required |
| maxDiscount | Number | Maximum discount cap (for percentage) |
| usageLimit | Number | Total usage limit (null = unlimited) |
| usedCount | Number | Current usage count |
| validFrom | Date | Start date |
| validUntil | Date | End date |
| isActive | Boolean | Active status |

## Example Coupons

### Percentage Discount
```json
{
  "code": "SAVE20",
  "discountType": "percentage",
  "discountValue": 20,
  "minPurchase": 1000,
  "maxDiscount": 500,
  "usageLimit": 100,
  "validFrom": "2024-01-01",
  "validUntil": "2024-12-31",
  "isActive": true
}
```

### Fixed Discount
```json
{
  "code": "FLAT500",
  "discountType": "fixed",
  "discountValue": 500,
  "minPurchase": 2000,
  "usageLimit": 50,
  "validFrom": "2024-01-01",
  "validUntil": "2024-12-31",
  "isActive": true
}
```

## Validation Rules

1. Coupon must be active (`isActive: true`)
2. Current date must be between `validFrom` and `validUntil`
3. Usage count must be less than `usageLimit` (if set)
4. Cart total must be >= `minPurchase`
5. Coupon code is case-insensitive (stored as uppercase)

## Frontend Integration

### Step 1: Validate Coupon
```javascript
const applyCoupon = async (code) => {
  const response = await fetch('/api/coupons/apply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ code })
  });
  const data = await response.json();
  return data;
};
```

### Step 2: Create Order with Coupon
```javascript
const createOrder = async (orderData, couponCode) => {
  const response = await fetch('/api/orders/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      ...orderData,
      couponCode
    })
  });
  const data = await response.json();
  return data;
};
```

## Notes

- Coupon usage count is automatically incremented when an order is successfully created
- Discount is applied before calculating the final total
- Order calculation: `total = subtotal + tax + shippingCharge - discount`
- Applied coupon details are stored in the order for reference
