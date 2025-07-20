"""
Revision ID: 20250708_create_product_likes_table
Revises: 
Create Date: 2025-07-08

"""
from alembic import op
import sqlalchemy as sa
import uuid

# revision identifiers, used by Alembic.
revision = '20250708_create_product_likes_table'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'product_likes',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column('user_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('product_id', sa.String(36), sa.ForeignKey('products.id', ondelete='CASCADE'), nullable=False),
    )
    op.create_unique_constraint('uq_product_like_user_product', 'product_likes', ['user_id', 'product_id'])

def downgrade():
    op.drop_constraint('uq_product_like_user_product', 'product_likes', type_='unique')
    op.drop_table('product_likes')
