# OpenMart Database Schema Overview

## User Management
- See `user-management.md` for full details.
- Tables: `users`, `user_payment_methods`, `user_addresses`, `user_likes`, `user_shares`, `user_settings`

## Vendor Management
- See `vendor-management.md` for full details.
- Tables: `vendors`, `vendor_addresses`, `vendor_bank_details`, `products`, `orders`, `order_items`, `vendor_reviews`, `vendor_likes_follows`, `vendor_views`, `vendor_settings`

## Product Catalog
- Table: `products` (linked to vendors)

## Cart System
- Table: `cart_items` (links users and products)

## Order Management
- Tables: `orders`, `order_items` (links users, vendors, products)

## Social/AI Features
- Tables: `user_likes`, `user_shares`, `vendor_likes_follows`, `vendor_views`
- Prompt logs, chat history, etc. (future expansion)

## Static Uploads
- Images stored in `/static/uploads/`, referenced by URLs in product/vendor/user tables.

## Entity Relationships
- See individual schema files for ER diagrams and relationships.

---
This schema supports all major features: user onboarding, vendor onboarding, product management, cart, orders, reviews, likes, follows, sharing, payments, addresses, and settings.

For migration scripts or visual ER diagrams, see the respective documentation or request generation.
