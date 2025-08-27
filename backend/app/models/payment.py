# backend/app/models/payment.py
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    tx_id = Column(Text, unique=True, nullable=False)
    amount = Column(Integer, nullable=False)
    status = Column(String(50), nullable=False, default='pending')
    created_at = Column(DateTime, server_default=func.now())
    
    # Связь с пользователем
    user = relationship("User", back_populates="payments")
