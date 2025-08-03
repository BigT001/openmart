# Vendor Management Schema

## Table: vendors
| Column                | Type      | Description                        |
|-----------------------|-----------|------------------------------------|
| id                    | UUID, PK  | Unique vendor ID                   |
| user_id               | UUID, FK  | Linked to users.id                 |
| business_name         | string    | Store/business name                |
| business_description  | text      | Description                        |
| logo_url              | string    | Logo image URL                     |
| cover_image_url       | string    | Cover/banner image URL             |
| business_email        | string    | Contact email                      |
| business_phone        | string    | Contact phone                      |
| business_address      | text      | Address                            |
| registration_number   | string    | Business registration              |
| verification_status   | string    | 'pending', 'verified', etc.        |
| rating                | decimal   | Average rating                     |
| total_reviews         | int       | Number of reviews                  |
| bank_name             | string    | Bank info for payouts              |
| bank_account_number   | string    | Bank info for payouts              |
| bank_account_name     | string    | Bank info for payouts              |
| category              | string    | Business category                  |
| created_at            | timestamp | Onboarding date                    |
| updated_at            | timestamp | Last update                        |

## Table: vendor_addresses
| Column                | Type      | Description                        |
|-----------------------|-----------|------------------------------------|
| id                    | UUID, PK  | Unique address ID                  |
| vendor_id             | UUID, FK  | Linked to vendors.id               |
| label                 | string    | 'HQ', 'Warehouse', etc.            |
| address_line1         | string    | Main address                       |
| address_line2         | string    | Additional info                    |
| city                  | string    | City                               |
| state                 | string    | State/Region                       |
| country               | string    | Country                            |
| postal_code           | string    | Zip/Postal code                    |
| phone                 | string    | Contact phone                      |
| is_default            | bool      | Default address flag               |
| added_at              | timestamp | When added                         |

## Table: vendor_bank_details
| Column                | Type      | Description                        |
|-----------------------|-----------|------------------------------------|
| id                    | UUID, PK  | Unique bank detail ID              |
| vendor_id             | UUID, FK  | Linked to vendors.id               |
| bank_name             | string    | Bank name                          |
| account_number        | string    | Account number                     |
| account_name          | string    | Account holder name                |
| added_at              | timestamp | When added                         |

## Table: products
| Column                | Type      | Description                        |
|-----------------------|-----------|------------------------------------|
| id                    | string, PK| Unique product ID                  |
| name                  | string    | Product name                       |
| description           | text      | Product description                |
| price                 | float     | Product price                      |
| stock                 | int       | Product stock                      |
| category              | string    | Product category                   |
| status                | string    | Product status                     |
| images                | JSON      | Product images                     |
| sku                   | string    | SKU                                |
| vendor_id             | UUID, FK  | Linked to vendors.id               |
| created_at            | timestamp | Created date                       |

## Table: orders
| Column                | Type      | Description                        |
|-----------------------|-----------|------------------------------------|
| id                    | UUID, PK  | Unique order ID                    |
| vendor_id             | UUID, FK  | Linked to vendors.id               |
| user_id               | UUID, FK  | Buyer                              |
| total                 | float     | Order total                        |
| status                | string    | 'pending', 'shipped', etc.         |
| created_at            | timestamp | Order date                         |

## Table: order_items
| Column                | Type      | Description                        |
|-----------------------|-----------|------------------------------------|
| id                    | UUID, PK  | Unique item ID                     |
| order_id              | UUID, FK  | Linked to orders.id                |
| product_id            | UUID, FK  | Linked to products.id              |
| quantity              | int       | Quantity                           |
| price                 | float     | Price per item                     |

## Table: vendor_reviews
| Column                | Type      | Description                        |
|-----------------------|-----------|------------------------------------|
| id                    | UUID, PK  | Unique review ID                   |
| vendor_id             | UUID, FK  | Linked to vendors.id               |
| user_id               | UUID, FK  | Reviewer                           |
| rating                | int       | 1-5 stars                          |
| comment               | text      | Review text                        |
| created_at            | timestamp | Review date                        |

## Table: vendor_likes_follows
| Column                | Type      | Description                        |
|-----------------------|-----------|------------------------------------|
| id                    | UUID, PK  | Unique action ID                   |
| vendor_id             | UUID, FK  | Linked to vendors.id               |
| user_id               | UUID, FK  | Who liked/followed                 |
| action                | string    | 'like', 'follow', 'unfollow'       |
| created_at            | timestamp | When action occurred               |

## Table: vendor_views
| Column                | Type      | Description                        |
|-----------------------|-----------|------------------------------------|
| id                    | UUID, PK  | Unique view ID                     |
| vendor_id             | UUID, FK  | Linked to vendors.id               |
| user_id               | UUID, FK  | Viewer (optional)                  |
| viewed_at             | timestamp | When viewed                        |

## Table: vendor_settings
| Column                | Type      | Description                        |
|-----------------------|-----------|------------------------------------|
| id                    | UUID, PK  | Unique settings ID                 |
| vendor_id             | UUID, FK  | Linked to vendors.id               |
| notifications         | JSON      | Notification preferences           |
| privacy               | JSON      | Privacy settings                   |
| dashboard_prefs       | JSON      | Dashboard layout/settings          |
| updated_at            | timestamp | Last update                        |

## Relationships
- vendors (1) — (M) vendor_addresses
- vendors (1) — (M) vendor_bank_details
- vendors (1) — (M) products
- vendors (1) — (M) orders
- vendors (1) — (M) vendor_reviews
- vendors (1) — (M) vendor_likes_follows
- vendors (1) — (M) vendor_views
- vendors (1) — (1) vendor_settings
