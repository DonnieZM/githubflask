from market import db
from market import ma


class User(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.String(length=30), nullable=False, unique=True)
    email = db.Column(db.String(length=50), nullable=False, unique=True)
    password_hash = db.Column(db.String(length=60), nullable=False)

class Usuarios(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    nombre = db.Column(db.String(length=30), nullable=False, unique=True)
    correo = db.Column(db.String(length=50), nullable=False, unique=True)
    contrasena = db.Column(db.String(length=60), nullable=False)
    _compradorID = db.Column(db.Integer())
    salt = db.Column(db.String(length=100), nullable=False)
    fechar = db.Column(db.DateTime())

class Product(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(length=30), nullable=False)
    price = db.Column(db.Integer(), nullable=False)
    description = db.Column(db.String(length=1024))
    image = db.Column(db.String(length=100))
    category_id = db.Column(db.Integer(), db.ForeignKey('category.id'))
    shop_id = db.Column(db.Integer(), db.ForeignKey('shop.id'))

class ProductSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Product

class Category(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(length=30), nullable=False, unique=True)
    products = db.relationship('Product')

class Shop(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(length=30), nullable=False, unique=True)
    email = db.Column(db.String(length=50), nullable=False, unique=True)
    password_hash = db.Column(db.String(length=60), nullable=False)
    products = db.relationship('Product')


class ShopSchema(ma.SQLAlchemySchema):
    class Meta: 
        model = Shop
    id = ma.auto_field()
    name = ma.auto_field()
    email = ma.auto_field()



db.create_all()