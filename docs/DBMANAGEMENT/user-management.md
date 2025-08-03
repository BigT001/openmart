# User Management Schema

## Table: users
| Column        | Type      | Description                        |
|--------------|-----------|------------------------------------|
| id           | UUID, PK  | Unique user ID                     |
| email        | string    | User email, unique                 |
| full_name    | string    | User's full name                   |
| avatar_url   | string    | Profile image URL                  |
| google_id    | string    | Social login ID (optional)         |
| created_at   | timestamp | Account creation time              |
| updated_at   | timestamp | Last update time                   |
| last_login   | timestamp | Last login time                    |

## Table: user_payment_methods
| Column         | Type      | Description                        |
|---------------|-----------|------------------------------------|
| id            | UUID, PK  | Unique payment method ID           |
| user_id       | UUID, FK  | Linked to users.id                 |
| type          | string    | 'bank' or 'card'                   |
| bank_name     | string    | For bank accounts                  |
| account_number| string    | For bank accounts                  |
| account_name  | string    | For bank accounts                  |
| card_number   | string    | For cards (encrypted, optional)    |
| card_expiry   | string    | For cards (MM/YY, optional)        |
| card_cvc      | string    | For cards (encrypted, optional)    |
| added_at      | timestamp | When added                         |

## Table: user_addresses
| Column         | Type      | Description                        |
|---------------|-----------|------------------------------------|
| id            | UUID, PK  | Unique address ID                  |
| user_id       | UUID, FK  | Linked to users.id                 |
| label         | string    | 'Home', 'Work', etc.               |
| address_line1 | string    | Main address                       |
| address_line2 | string    | Additional info                    |
| city          | string    | City                               |
| state         | string    | State/Region                       |
| country       | string    | Country                            |
| postal_code   | string    | Zip/Postal code                    |
| phone         | string    | Contact phone                      |
| is_default    | bool      | Default address flag               |
| added_at      | timestamp | When added                         |

## Table: user_likes
| Column         | Type      | Description                        |
|---------------|-----------|------------------------------------|
| id            | UUID, PK  | Unique like/dislike ID             |
| user_id       | UUID, FK  | Linked to users.id                 |
| target_type   | string    | 'product', 'vendor', 'profile'     |
| target_id     | string    | ID of liked/disliked item          |
| action        | string    | 'like' or 'dislike'                |
| created_at    | timestamp | When action occurred               |

## Table: user_shares
| Column         | Type      | Description                        |
|---------------|-----------|------------------------------------|
| id            | UUID, PK  | Unique share ID                    |
| user_id       | UUID, FK  | Linked to users.id                 |
| target_type   | string    | 'product', 'vendor', 'profile'     |
| target_id     | string    | ID of shared item                  |
| shared_to     | string    | Email, phone, or platform          |
| created_at    | timestamp | When shared                        |

## Table: user_settings
| Column         | Type      | Description                        |
|---------------|-----------|------------------------------------|
| id            | UUID, PK  | Unique settings ID                 |
| user_id       | UUID, FK  | Linked to users.id                 |
| notifications | JSON      | Notification preferences           |
| privacy       | JSON      | Privacy settings                   |
| theme         | string    | 'light', 'dark', etc.              |
| updated_at    | timestamp | Last update                        |

## Relationships
- users (1) — (M) user_payment_methods
- users (1) — (M) user_addresses
- users (1) — (M) user_likes
- users (1) — (M) user_shares
- users (1) — (1) user_settings
