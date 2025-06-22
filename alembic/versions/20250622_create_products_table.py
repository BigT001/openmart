"""create products table with uuid vendor_id

Revision ID: 20250622_create_products_table
Revises: 20250621_create_vendors_table
Create Date: 2025-06-22

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '20250622_create_products_table'
down_revision = '20250621_create_vendors_table'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'products',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('price', sa.Float, nullable=False),
        sa.Column('stock', sa.Integer, nullable=False, default=0),
        sa.Column('category', sa.String(100), nullable=False),
        sa.Column('status', sa.String(32), nullable=False, default='active'),
        sa.Column('images', sa.JSON, nullable=False),
        sa.Column('sku', sa.String(100), nullable=True),
        sa.Column('vendor_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('vendors.id'), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

def downgrade():
    op.drop_table('products')
