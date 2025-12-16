from pydantic import BaseModel

class ExpenseCategory(BaseModel):
    name: str
    is_active: bool = True


class ExpenseCategoryCreate(ExpenseCategory):
    pass

class ExpenseCategoryResponse(ExpenseCategory):
    id: int
