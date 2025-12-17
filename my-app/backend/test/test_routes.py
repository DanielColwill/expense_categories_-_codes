from fastapi.testclient import TestClient
import pytest
from src.app import app  
from src.database import Base, engine
from src.models import ExpenseCategory
from sqlalchemy.orm import Session  

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)



def test_read_main():
    response = client.get("/api/hello")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello from FastAPI!"}

def test_create_category():
    response = client.post(
        "/api/categories",
        json={"name": "categoryTest", "is_active": True}
    )
    assert response.json()["name"] == "categoryTest"
    assert response.json()["is_active"] == True

def test_get_categories():
    response = client.get(
        "/api/categories",
    )
    assert response.status_code == 200
    assert response.json() == []

def test_get_categories_with_dummy_data():
    db_session = Session(bind=engine)
    # add dummy data
    db_session.add_all([
        ExpenseCategory(name="One", is_active=True),
        ExpenseCategory(name="Two", is_active=False),
    ])
    db_session.commit()
    response = client.get(
        "/api/categories",
    )
    assert response.status_code == 200
    assert response.json() == [
        {
            "id": 1, "name": "One", "is_active": True
        },
        {
            "id": 2, "name": "Two", "is_active": False
        },
    ]

    
def test_put_categories_with_dummy_data():
    db_session = Session(bind=engine)
    category_one = ExpenseCategory(name="One", is_active=True)

    db_session.add_all([category_one])
    db_session.commit()
    db_session.refresh(category_one)

    id_one = category_one.id
    response = client.put(
        f"/api/categories/{id_one}",
        json={"name": "Updated One", "is_active": False}
    )
    assert response.status_code == 200
    assert response.json()["id"] == id_one
    assert response.json()["name"] == "Updated One"