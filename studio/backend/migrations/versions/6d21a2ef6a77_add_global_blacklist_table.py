"""Add global blacklist table

Revision ID: 6d21a2ef6a77
Revises: 5c4fd9e5a6b1
Create Date: 2026-04-29 10:20:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "6d21a2ef6a77"
down_revision: Union[str, Sequence[str], None] = "5c4fd9e5a6b1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "global_blacklist",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("dna_id", sa.String(), nullable=False),
        sa.Column("source_project_id", sa.UUID(), nullable=True),
        sa.Column("source_threat_log_id", sa.UUID(), nullable=True),
        sa.Column("reason", sa.String(), nullable=False),
        sa.Column(
            "risk_factors",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
            server_default=sa.text("'[]'::jsonb"),
        ),
        sa.Column("hit_count", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
        sa.Column("last_seen_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("NOW()")),
        sa.ForeignKeyConstraint(["source_project_id"], ["projects.id"]),
        sa.ForeignKeyConstraint(["source_threat_log_id"], ["threat_logs.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_global_blacklist_dna_id"), "global_blacklist", ["dna_id"], unique=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f("ix_global_blacklist_dna_id"), table_name="global_blacklist")
    op.drop_table("global_blacklist")
