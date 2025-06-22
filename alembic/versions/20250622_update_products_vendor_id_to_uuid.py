"""update products.vendor_id to UUID

Revision ID: 20250622_update_products_vendor_id_to_uuid
Revises: 62d2553a23dc_merge_heads
Create Date: 2025-06-22

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '20250622_update_products_vendor_id_to_uuid'
down_revision = '62d2553a23dc_merge_heads'
branch_labels = None
depends_on = None

def upgrade():
    # Convert vendor_id to UUID
    op.alter_column('products', 'vendor_id',
        existing_type=sa.String(length=36),
        type_=postgresql.UUID(as_uuid=True),
        postgresql_using='vendor_id::uuid',
        nullable=True)

def downgrade():
    op.alter_column('products', 'vendor_id',
        existing_type=postgresql.UUID(as_uuid=True),
        type_=sa.String(length=36),
        postgresql_using='vendor_id::text',
        nullable=True)
