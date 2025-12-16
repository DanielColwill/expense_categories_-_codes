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