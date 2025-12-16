from attrs import define

@define
class ExpenseCategory:
    id: int
    name: str
    is_active: bool
