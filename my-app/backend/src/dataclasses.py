from pydantic import BaseModel, Field
from typing import Optional

class ExpenseCategory(BaseModel):
    name: str
    is_active: bool = True


class ExpenseCategoryCreate(ExpenseCategory):
    pass

class ExpenseCategoryResponse(ExpenseCategory):
    id: int

class ExpenseCodeBase(BaseModel):
    code: str = Field(..., min_length=1)
    description: Optional[str] = None
    is_active: bool = True


class ExpenseCodeCreate(ExpenseCodeBase):
    pass


class ExpenseCodeUpdate(BaseModel):
    description: Optional[str] = None
    is_active: bool = True


class ExpenseCodeResponse(ExpenseCodeBase):
    id: int
    category_id: int
