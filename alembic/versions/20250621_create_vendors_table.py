"""
Alembic migration script to create the vendors table.
"""
revision = '20250621_create_vendors_table'
down_revision = '20250621_create_users_table'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa
import sqlalchemy.dialects.postgresql as pg
import uuid

def upgrade():
    op.create_table(
        'vendors',
        sa.Column('id', pg.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False),
        sa.Column('user_id', pg.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
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
        sa.Column('created_at', sa.TIMESTAMP, server_default=sa.func.now()),
        sa.Column('updated_at', sa.TIMESTAMP, server_default=sa.func.now(), onupdate=sa.func.now()),
    )

def downgrade():
    op.drop_table('vendors')
