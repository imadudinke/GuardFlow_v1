"""Add google oauth fields to users

Revision ID: a9c4f5d2e7b1
Revises: 7b8f3a41c2d9
Create Date: 2026-05-02 22:45:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "a9c4f5d2e7b1"
down_revision: Union[str, Sequence[str], None] = "7b8f3a41c2d9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("google_sub", sa.String(), nullable=True))
    op.add_column(
        "users",
        sa.Column(
            "email_verified",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
    )
    op.create_index("ix_users_google_sub", "users", ["google_sub"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_users_google_sub", table_name="users")
    op.drop_column("users", "email_verified")
    op.drop_column("users", "google_sub")
