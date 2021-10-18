from market import app
from functools import wraps
import jwt
from market.models import User, Shop
from flask import request, g, redirect, url_for

def checkUser(func):
  @wraps(func)
  def checkToken():
    token = request.cookies.get('ezjwt')
    decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms='HS256')
    id = decoded.get('id')
    existingUser = User.query.filter_by(id=id).first()

    if existingUser:
      g.username = existingUser.username
      g.token = decoded
    else:
      g.username = ''
      g.token = ''

    return func()
  
  return checkToken

def checkShop(func):
  @wraps(func)
  def checkshopToken():
    token = request.cookies.get('ezjwt')
    decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms='HS256')
    id = decoded.get('id')
    existingUser = Shop.query.filter_by(id=id).first()

    if existingUser:
      g.name = existingUser.name
      g.token = decoded
      g.id = existingUser.id
    else:
      g.username = ''
      g.token = ''
      return redirect(url_for('login'))

    return func()
  
  return checkshopToken