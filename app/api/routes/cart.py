from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.cart import CartItem as CartItemModel
from app.models.product import Product
from app.models.user import User

router = APIRouter()

class AddToCartRequest(BaseModel):
    user_id: str
    product_id: str
    quantity: int = 1

class CartProductOut(BaseModel):
    id: str
    name: str
    price: float
    images: Optional[list] = []
    quantity: int

@router.post("/cart/add", response_model=List[CartProductOut])
def add_to_cart(item: AddToCartRequest, db: Session = Depends(get_db)):
    # Validate user
    user = db.query(User).filter(User.id == item.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # Validate product
    product = db.query(Product).filter(Product.id == item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    # Check if cart item exists
    cart_item = db.query(CartItemModel).filter(
        CartItemModel.user_id == item.user_id,
        CartItemModel.product_id == item.product_id
    ).first()
    if cart_item:
        cart_item.quantity += item.quantity
    else:
        cart_item = CartItemModel(
            user_id=item.user_id,
            product_id=item.product_id,
            quantity=item.quantity
        )
        db.add(cart_item)
    db.commit()
    # Return updated cart
    return get_cart_for_user(item.user_id, db)

@router.get("/cart", response_model=List[CartProductOut])
def get_cart(user_id: str, db: Session = Depends(get_db)):
    return get_cart_for_user(user_id, db)

def get_cart_for_user(user_id: str, db: Session):
    cart_items = db.query(CartItemModel).filter(CartItemModel.user_id == user_id).all()
    result = []
    for item in cart_items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            result.append(CartProductOut(
                id=product.id,
                name=product.name,
                price=product.price,
                images=product.images,
                quantity=item.quantity
            ))
    return result
