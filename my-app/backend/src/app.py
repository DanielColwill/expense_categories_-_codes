from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, get_db
from . import models, dataclasses

Base.metadata.create_all(bind=engine)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/hello")
def hello():
    return {"message": "Hello from FastAPI!"}

@app.post("/api/categories", response_model=dataclasses.ExpenseCategoryResponse)
def create_category(category: dataclasses.ExpenseCategory, db: Session = Depends(get_db)):
    # existing = db.query(models.ExpenseCategory).filter(models.ExpenseCategory.name == category.name).first()
    # if existing:
    #     raise HTTPException(status_code=400, detail="Category already exists")
    db_category = models.ExpenseCategory(name=category.name,is_active=category.is_active)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@app.get("/api/categories", response_model=list[dataclasses.ExpenseCategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.ExpenseCategory).all()

@app.put("/api/categories/{id}", response_model=dataclasses.ExpenseCategoryResponse)
def update_category(
    id: int, 
    category: dataclasses.ExpenseCategory, 
    db: Session = Depends(get_db)
):
    db_category = db.query(models.ExpenseCategory).filter(
        models.ExpenseCategory.id == id
    ).first()
    
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db_category.name = category.name
    db_category.is_active = category.is_active
    
    db.commit()
    db.refresh(db_category)
    
    return db_category


@app.get(
    "/api/categories/{id}/codes",
    response_model=list[dataclasses.ExpenseCodeResponse]
)
def get_codes_for_category(id: int, db: Session = Depends(get_db)):
    category = db.query(models.ExpenseCategory).filter(
        models.ExpenseCategory.id == id
    ).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    return category.codes


@app.post(
    "/api/categories/{id}/codes",
    response_model=dataclasses.ExpenseCodeResponse
)
def create_code_for_category(
    id: int,
    code: dataclasses.ExpenseCodeCreate,
    db: Session = Depends(get_db),
):
    category = db.query(models.ExpenseCategory).filter(
        models.ExpenseCategory.id == id
    ).first()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    db_code = models.ExpenseCode(
        category_id=id,
        code=code.code,
        description=code.description,
        is_active=code.is_active,
    )

    db.add(db_code)
    db.commit()
    db.refresh(db_code)

    return db_code

@app.put(
    "/api/codes/{id}",
    response_model=dataclasses.ExpenseCodeResponse
)
def update_code(
    id: int,
    code: dataclasses.ExpenseCodeUpdate,
    db: Session = Depends(get_db),
):
    db_code = db.query(models.ExpenseCode).filter(
        models.ExpenseCode.id == id
    ).first()

    if not db_code:
        raise HTTPException(status_code=404, detail="Code not found")

    db_code.description = code.description
    db_code.is_active = code.is_active

    db.commit()
    db.refresh(db_code)

    return db_code