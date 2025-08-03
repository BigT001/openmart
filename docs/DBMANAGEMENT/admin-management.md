# Admin Management Schema

## Table: admins
| Column        | Type      | Description                        |
|--------------|-----------|------------------------------------|
| id           | UUID, PK  | Unique admin ID                    |
| email        | string    | Admin email, unique                |
| full_name    | string    | Admin's full name                  |
| password_hash| string    | Hashed password                    |
| avatar_url   | string    | Profile image URL                  |
| role         | string    | 'superadmin', 'manager', etc.      |
| status       | string    | 'active', 'disabled', etc.         |
| created_at   | timestamp | Account creation time              |
| updated_at   | timestamp | Last update time                   |
| last_login   | timestamp | Last login time                    |

## Table: admin_activity_logs
| Column        | Type      | Description                        |
|--------------|-----------|------------------------------------|
| id           | UUID, PK  | Unique log ID                      |
| admin_id     | UUID, FK  | Linked to admins.id                |
| action       | string    | Action performed                   |
| target_type  | string    | 'user', 'vendor', 'product', etc.  |
| target_id    | string    | ID of affected item                |
| details      | JSON      | Additional details                 |
| created_at   | timestamp | When action occurred               |

## Table: admin_permissions
| Column        | Type      | Description                        |
|--------------|-----------|------------------------------------|
| id           | UUID, PK  | Unique permission ID               |
| admin_id     | UUID, FK  | Linked to admins.id                |
| permission   | string    | 'manage_users', 'manage_vendors', 'view_reports', etc. |
| granted_at   | timestamp | When granted                       |

## Table: admin_notifications
| Column        | Type      | Description                        |
|--------------|-----------|------------------------------------|
| id           | UUID, PK  | Unique notification ID             |
| admin_id     | UUID, FK  | Linked to admins.id                |
| message      | string    | Notification message               |
| read         | bool      | Read status                        |
| created_at   | timestamp | When sent                          |

## Table: admin_settings
| Column        | Type      | Description                        |
|--------------|-----------|------------------------------------|
| id           | UUID, PK  | Unique settings ID                 |
| admin_id     | UUID, FK  | Linked to admins.id                |
| dashboard_prefs| JSON    | Dashboard layout/settings          |
| notifications| JSON      | Notification preferences           |
| updated_at   | timestamp | Last update                        |

## Relationships
- admins (1) — (M) admin_activity_logs
- admins (1) — (M) admin_permissions
- admins (1) — (M) admin_notifications
- admins (1) — (1) admin_settings

---

## Admin Capabilities
 Manage users, vendors, products, orders, reviews, payments
 Assign roles and permissions
 View and filter activity logs (across all entities: users, vendors, products, etc.)
 Track and audit all admin actions with detailed logs
 Customize dashboard and settings
 Oversee platform health, analytics, and reports
 This schema supports a robust, secure, and scalable admin management system for OpenMart, enabling full visibility and control over platform activities.
This schema supports a robust, secure, and scalable admin management system for OpenMart.
