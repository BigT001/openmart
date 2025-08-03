"""
Initial migration for OpenMart schema: users, vendors, products, cart_items, orders, order_items, admin tables, vendor/user extras
"""
from alembic import op
import sqlalchemy as sa
import uuid

revision = '20250802_init_schema'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Users
    op.create_table(
        'users',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False),
        sa.Column('email', sa.String(255), unique=True, nullable=False),
        sa.Column('full_name', sa.String(255), nullable=False),
        sa.Column('avatar_url', sa.String(255), nullable=True),
        sa.Column('google_id', sa.String(255), unique=True, nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('last_login', sa.TIMESTAMP(), server_default=sa.func.now()),
    )
    # Vendors
    op.create_table(
        'vendors',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False),
        sa.Column('user_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('business_name', sa.String(255), nullable=False),
        sa.Column('business_description', sa.Text),
        sa.Column('logo_url', sa.String(255)),
        sa.Column('cover_image_url', sa.String(255)),
        sa.Column('business_email', sa.String(255)),
        sa.Column('business_phone', sa.String(20)),
        sa.Column('business_address', sa.Text),
        sa.Column('registration_number', sa.String(100)),
        sa.Column('verification_status', sa.String(20), server_default='pending'),
        sa.Column('rating', sa.DECIMAL(3,2), server_default='0'),
        sa.Column('total_reviews', sa.Integer, server_default='0'),
        sa.Column('bank_name', sa.String(255)),
        sa.Column('bank_account_number', sa.String(50)),
        sa.Column('bank_account_name', sa.String(255)),
        sa.Column('category', sa.String(255)),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    # Products
    op.create_table(
        'products',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('price', sa.Float, nullable=False),
        sa.Column('stock', sa.Integer, nullable=False, default=0),
        sa.Column('category', sa.String(100), nullable=False),
        sa.Column('status', sa.String(32), nullable=False, default='active'),
        sa.Column('images', sa.JSON, nullable=False),
        sa.Column('sku', sa.String(100), nullable=True),
        sa.Column('vendor_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('vendors.id'), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    # Cart Items
    op.create_table(
        'cart_items',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False),
        sa.Column('user_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('product_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('products.id', ondelete='CASCADE'), nullable=False),
        sa.Column('quantity', sa.Integer, nullable=False, default=1),
        sa.Column('added_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    # Orders
    op.create_table(
        'orders',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False),
        sa.Column('vendor_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('vendors.id', ondelete='CASCADE'), nullable=False),
        sa.Column('user_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('total', sa.Float, nullable=False),
        sa.Column('status', sa.String(20), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.func.now()),
    )
    op.create_table(
        'order_items',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False),
        sa.Column('order_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('orders.id', ondelete='CASCADE'), nullable=False),
        sa.Column('product_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('products.id', ondelete='CASCADE'), nullable=False),
        sa.Column('quantity', sa.Integer, nullable=False),
        sa.Column('price', sa.Float, nullable=False),
    )
    # Admin tables
    op.create_table(
        'admins',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False),
        sa.Column('email', sa.String(255), unique=True, nullable=False),
        sa.Column('full_name', sa.String(255), nullable=False),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('avatar_url', sa.String(255)),
        sa.Column('role', sa.String(50), nullable=False),
        sa.Column('status', sa.String(20), nullable=False, default='active'),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.func.now()),
        sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.func.now()),
        sa.Column('last_login', sa.TIMESTAMP(), server_default=sa.func.now()),
    )
    op.create_table(
        'admin_activity_logs',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False),
        sa.Column('admin_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('admins.id', ondelete='CASCADE'), nullable=False),
        sa.Column('action', sa.String(255), nullable=False),
        sa.Column('target_type', sa.String(50), nullable=False),
        sa.Column('target_id', sa.String(255), nullable=False),
        sa.Column('details', sa.JSON()),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.func.now()),
    )
    op.create_table(
        'admin_permissions',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False),
        sa.Column('admin_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('admins.id', ondelete='CASCADE'), nullable=False),
        sa.Column('permission', sa.String(100), nullable=False),
        sa.Column('granted_at', sa.TIMESTAMP(), server_default=sa.func.now()),
    )
    op.create_table(
        'admin_notifications',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False),
        sa.Column('admin_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('admins.id', ondelete='CASCADE'), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('read', sa.Boolean(), default=False),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.func.now()),
    )
    op.create_table(
        'admin_settings',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False),
        sa.Column('admin_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('admins.id', ondelete='CASCADE'), nullable=False, unique=True),
        sa.Column('dashboard_prefs', sa.JSON()),
        sa.Column('notifications', sa.JSON()),
        sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.func.now()),
    )
    # Vendor extras
    op.create_table(
        'vendor_addresses',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False),
        sa.Column('vendor_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('vendors.id', ondelete='CASCADE'), nullable=False),
        sa.Column('label', sa.String(50)),
        sa.Column('address_line1', sa.String(255)),
        sa.Column('address_line2', sa.String(255)),
        sa.Column('city', sa.String(100)),
        sa.Column('state', sa.String(100)),
        sa.Column('country', sa.String(100)),
        sa.Column('postal_code', sa.String(20)),
        sa.Column('phone', sa.String(20)),
        sa.Column('is_default', sa.Boolean(), default=False),
        sa.Column('added_at', sa.TIMESTAMP(), server_default=sa.func.now()),
    )
    op.create_table(
        'vendor_bank_details',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False),
        sa.Column('vendor_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('vendors.id', ondelete='CASCADE'), nullable=False),
        sa.Column('bank_name', sa.String(255)),
        sa.Column('account_number', sa.String(50)),
        sa.Column('account_name', sa.String(255)),
        sa.Column('added_at', sa.TIMESTAMP(), server_default=sa.func.now()),
    )
    op.create_table(
        'vendor_reviews',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False),
        sa.Column('vendor_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('vendors.id', ondelete='CASCADE'), nullable=False),
        sa.Column('user_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('rating', sa.Integer, nullable=False),
        sa.Column('comment', sa.Text),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.func.now()),
    )
    op.create_table(
        'vendor_likes_follows',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False),
        sa.Column('vendor_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('vendors.id', ondelete='CASCADE'), nullable=False),
        sa.Column('user_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('action', sa.String(20)),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.func.now()),
    )
    op.create_table(
        'vendor_views',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False),
        sa.Column('vendor_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('vendors.id', ondelete='CASCADE'), nullable=False),
        sa.Column('user_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=True),
        sa.Column('viewed_at', sa.TIMESTAMP(), server_default=sa.func.now()),
    )
    op.create_table(
        'vendor_settings',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False),
        sa.Column('vendor_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('vendors.id', ondelete='CASCADE'), nullable=False, unique=True),
        sa.Column('notifications', sa.JSON()),
        sa.Column('privacy', sa.JSON()),
        sa.Column('dashboard_prefs', sa.JSON()),
        sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.func.now(), onupdate=sa.func.now()),
    )
    # User extras
    op.create_table(
        'user_addresses',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False),
        sa.Column('user_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('label', sa.String(50)),
        sa.Column('address_line1', sa.String(255)),
        sa.Column('address_line2', sa.String(255)),
        sa.Column('city', sa.String(100)),
        sa.Column('state', sa.String(100)),
        sa.Column('country', sa.String(100)),
        sa.Column('postal_code', sa.String(20)),
        sa.Column('phone', sa.String(20)),
        sa.Column('is_default', sa.Boolean(), default=False),
        sa.Column('added_at', sa.TIMESTAMP(), server_default=sa.func.now()),
    )
    op.create_table(
        'user_payments',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False),
        sa.Column('user_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('payment_method', sa.String(50)),
        sa.Column('provider', sa.String(50)),
        sa.Column('account_number', sa.String(50)),
        sa.Column('expiry', sa.String(10)),
        sa.Column('added_at', sa.TIMESTAMP(), server_default=sa.func.now()),
    )
    op.create_table(
        'user_likes_shares',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False),
        sa.Column('user_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('target_type', sa.String(50)),
        sa.Column('target_id', sa.String(255)),
        sa.Column('action', sa.String(20)),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.func.now()),
    )
    op.create_table(
        'user_settings',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False),
        sa.Column('user_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, unique=True),
        sa.Column('notifications', sa.JSON()),
        sa.Column('privacy', sa.JSON()),
        sa.Column('dashboard_prefs', sa.JSON()),
        sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.func.now(), onupdate=sa.func.now()),
    )

def downgrade():
    op.drop_table('user_settings')
    op.drop_table('user_likes_shares')
    op.drop_table('user_payments')
    op.drop_table('user_addresses')
    op.drop_table('vendor_settings')
    op.drop_table('vendor_views')
    op.drop_table('vendor_likes_follows')
    op.drop_table('vendor_reviews')
    op.drop_table('vendor_bank_details')
    op.drop_table('vendor_addresses')
    op.drop_table('admin_settings')
    op.drop_table('admin_notifications')
    op.drop_table('admin_permissions')
    op.drop_table('admin_activity_logs')
    op.drop_table('admins')
    op.drop_table('order_items')
    op.drop_table('orders')
    op.drop_table('cart_items')
    op.drop_table('products')
    op.drop_table('vendors')
    op.drop_table('users')
