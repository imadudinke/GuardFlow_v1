"""Add project controls and user profile fields

Revision ID: 7b8f3a41c2d9
Revises: 6d21a2ef6a77
Create Date: 2026-04-29 10:34:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "7b8f3a41c2d9"
down_revision: Union[str, Sequence[str], None] = "6d21a2ef6a77"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "projects",
        sa.Column("hard_ban_enabled", sa.Boolean(), nullable=False, server_default=sa.text("true")),
    )
    op.add_column("users", sa.Column("full_name", sa.String(), nullable=True))
    op.add_column(
        "users",
        sa.Column("plan_tier", sa.String(), nullable=False, server_default="Free"),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("users", "plan_tier")
    op.drop_column("users", "full_name")
    op.drop_column("projects", "hard_ban_enabled")
