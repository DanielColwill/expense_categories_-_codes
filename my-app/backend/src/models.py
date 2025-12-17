from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class ExpenseCategory(Base):
    __tablename__ = "expense_categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    is_active = Column(Boolean, default=True)
    codes = relationship(
        "ExpenseCode",
        back_populates="category",
        cascade="all, delete-orphan"
    )

class ExpenseCode(Base):
    __tablename__ = "expense_codes"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(
        Integer,
        ForeignKey("expense_categories.id"),
        nullable=False
    )
    code = Column(String, nullable=False)
    description = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)

    category = relationship("ExpenseCategory", back_populates="codes")