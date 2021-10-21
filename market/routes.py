from sys import path
from flask.helpers import make_response, url_for
from flask.wrappers import Request
from werkzeug.wrappers import request
from market import app
from flask import render_template, json, jsonify, request, redirect, g, Response
import requests
import bcrypt
import jwt
import os
import uuid
# import urllib.request
from market import db
from market.models import User, Product, Shop, Category, Event
from market.models import ProductSchema, ShopSchema
from market.middleware import checkUser, checkShop
import stripe

# SECRET_KEY = os.environ.get("SECRET_KEY")
stripe.api_key = 'sk_test_51JjPWsJkRyrBj4D7PLvp7YSXb2Li7e6FaTdOxRAt2xId9FdX66ZHaM81BBoaGdsmqhJmZrpBS8HLhJw8Plmy2Zlf00miIBpDc6'


# FUNCIÓN: mostrar página de home
# HTML: index.html
@app.route('/')
@checkUser
def index():
    # buscar categorias para msotrarlas en barra de categorias
    categoriesRequest = requests.get('https://fakestoreapi.com/products/categories')
    categories = json.loads(categoriesRequest.content)
    return render_template('index.html', categories=categories)


# FUNCIÓN: cargar todos los productos
# HTML: index.html
# JS: getProducts.js
@app.route('/products', methods=['GET'])
def getProducts():
    category = request.args.get('category')
    if not category:
        reqproducts = Product.query.all()
        product_schema = ProductSchema(many=True)
        products = product_schema.dump(reqproducts)
    else:
        productsRequest = requests.get('https://fakestoreapi.com/products/category/'+category)
        products = productsRequest.content
    return jsonify(products)


# FUNCIÓN: cargar productos segun barra de busqueda
# HTML: index.html
# JS: getProducts.js
@app.route('/products', methods=['POST'])
def searchProducts():
    data = request.json
    search = data.get('search')
    searchproducts = Product.query.filter(Product.name.contains(search)).all()
    product_schema = ProductSchema(many=True)
    products = product_schema.dump(searchproducts)
    return jsonify(products)


# FUNCIÓN: mostrar página de detalle del producto
# HTML: productDetail.html
# JS: getProductById.js
@app.route('/products/<id>')
def product_page(id):
    product = Product.query.filter_by(id=id).first()
    return render_template('productDetail.html', product=product)


# FUNCIÓN: mostrar página de login
# HTML: login.html
@app.route('/login', methods=['GET'])
def login():    
    return render_template('login.html')


# FUNCIÓN: proceso de login en cuenta
# HTML: login.html
# JS: login.js
@app.route('/login', methods=['POST'])
def login_submit():
    data = request.json
    email = data.get('email')
    type = data.get('loginType')
    password = data.get('password').encode()

    # Validar si ya existe uno
    if type == 'user':
        existingUser = User.query.filter_by(email=email).first()
    else:
        existingUser = Shop.query.filter_by(email=email).first()

    # Regresar un mensaje de error si no existe
    if not existingUser:
        message = 'No existe un usuario con ese correo'
        data = jsonify(message)
        return data
    
    # Redirección diferente para usuarios y tiendas
    if type == 'user':
        redirectTo = '/' 
    elif type == 'shop':
        redirectTo = f'shop/{existingUser.id}'
    
    # Comparación de contraseñas
    hashed = existingUser.password_hash.encode()
    if bcrypt.checkpw(password, hashed):
        id = existingUser.id
        token = jwt.encode({'id':id, 'type': type}, app.config['SECRET_KEY'], algorithm='HS256') #falta agregar expiresIn
        
        return jsonify({'token': token, 'status': 200, 'redirectTo': redirectTo})
    else:
        message = 'Usuario o contraseña incorrectos.'
        return jsonify({'message': message, 'status': 401})


# FUNCIÓN: permitir salir de la cuenta
# HTML: desde barra de navegación
# status: incompleto
@app.route('/logout', methods=['GET'])
def logout():
    # Response.delete_cookie('ezjwt', path='/')
    return 'bye'


# FUNCIÓN: mostrar página de Crear cuenta
# HTML: signup.html
@app.route('/signup', methods=['GET'])
def signup():
    return render_template('signup.html')


# FUNCIÓN: proceso de creación de cuenta
# HTML: signup.html
# JS: signup.js
@app.route('/signup', methods=['POST'])
def signup_submit():
    data = request.json
    email = data.get('email')
    username = data.get('username')
    type = data.get('loginType')

    # Validar si ya existe uno y regresar un mensaje de error
    if type == 'user':
        exists = User.query.filter_by(email=email).first()
    else:
        exists = Shop.query.filter_by(email=email).first()

    if exists:
        message = 'Ese correo ya se encuentra registrado'
        data = jsonify(message)
        return data
    
    # Password hash
    password = data.get('password').encode()
    hashed = bcrypt.hashpw(password, bcrypt.gensalt())

    # Guardar en DB
    if type == 'user':
        newUser = User(username=username, email=email, password_hash=hashed)
        db.session.add(newUser)
        db.session.commit()
        created = User.query.filter_by(email=email).first()
        redirectTo = '/'
        type = 'user'
    else:
        newShop = Shop(name=username, email=email, password_hash=hashed)
        db.session.add(newShop)
        db.session.commit()
        created = Shop.query.filter_by(email=email).first()
        print('created: ', created)
        redirectTo = f'/shop/{created.id}'
        type = 'shop'

    # Generar JWT
    id = created.id
    token = jwt.encode({id: id, type: type}, app.config['SECRET_KEY'], algorithm='HS256') #falta agregar expiresIn

    # Regresar token y donde redireccionar
    return jsonify({'token': token, 'redirectTo': redirectTo})


# FUNCIÓN: mostrar página de carrito
# HTML: cart.html
@app.route('/cart', methods=['GET'])
def cart():
    return render_template('cart.html')


@app.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
  session = stripe.checkout.Session.create(
    payment_method_types=['card'],
    line_items=[{
      'price_data': {
        'currency': 'usd',
        'product_data': {
          'name': 'T-shirt',
        },
        'unit_amount': 2000,
      },
      'quantity': 1,
    }],
    mode='payment',

    success_url='http://localhost:5000/success',
    cancel_url='http://localhost:5000/cancel',
  )
  return jsonify(session)


# FUNCIÓN: mostrar página de pago fallido
# HTML: cancel.html
@app.route('/success', methods=['GET'])
def success():
    return render_template('success.html')


# FUNCIÓN: mostrar página de pago exitoso
# HTML: success.html
@app.route('/cancel', methods=['GET'])
def cancel():
    return render_template('cancel.html')


# FUNCIÓN: mostrar página de perfil de Tienda
# HTML: shop.html
@app.route('/shop/<id>', methods=['GET'])
# @checkShop
def shopProfile(id):
    # buscar tienda para usar el id en los links
    shop = Shop.query.filter_by(id=id).first()
    return render_template('shop.html', shop=shop)


# FUNCIÓN: modificar datos del perfil de Tienda
# HTML: shop.html
# JS: updateShopInfo.js
@app.route('/shop/<id>', methods=['PUT'])
def updateShop(id):
    # tomar datos del objeto request
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    # buscar la tienda relevante
    shop = Shop.query.filter_by(id=id).first()
    
    #solo modificar datos si el input no estaba vacío
    if len(name) > 0:
        shop.name = name
    if len(email) > 0:
        shop.email = email
    if len(password) > 0:
        password.encode()
        hashed = bcrypt.hashpw(password, bcrypt.gensalt())
        shop.password_hash = hashed

    # guardar cambios en base de datos
    db.session.commit()
    return jsonify({'message': 'ok'})


# FUNCIÓN: mostrar página de "Mis productos" de una tienda
# HTML: shopProducts.html
@app.route('/shop/<id>/products', methods=['GET'])
def shopProducts(id):
    shop = Shop.query.filter_by(id=id).first()
    return render_template('shopProducts.html', shop=shop) 


# FUNCIÓN: cargar datos de Tienda y sus Productos
# HTML: shopProducts.html
# JS: shopProducts.js > getProducts()
@app.route('/shop/<id>/getproducts', methods=['GET'])
def getShopProducts(id):
    shop = Shop.query.filter_by(id=id).first()
    products = Product.query.filter_by(shop_id=id).all()
    # serializar resultados con Marshmallow para poder enviarlos como json al frontend
    product_schema = ProductSchema(many=True)
    shop_schema = ShopSchema()
    maProducts = product_schema.dump(products)
    maShop = shop_schema.dump(shop)
    return jsonify({'products': maProducts, 'shop': maShop})


# FUNCIÓN: mostrar página de creación de producto
# HTML: shopCreateProduct.html
@app.route('/shop/<id>/product', methods=['GET'])
def createProductPage(id):
    shop = Shop.query.filter_by(id=id).first()
    return render_template('shopCreateProduct.html', shop=shop)


# FUNCIÓN: crear producto de Tienda
# HTML: shopCreateProduct.html
# JS: createProduct.js
@app.route('/shop/<id>/product', methods=['POST'])
def createProduct(id):
    # sacar datos del objeto request
    data = request.json
    name = data.get('name')
    price = data.get('price')
    description = data.get('description')
    category = data.get('category')
    image = data.get('image')
    print('image:', image)

    # guardar en base de datos
    product = Product(name=name, price=price, description=description, category_id=category, shop_id=id, image=image) # crea una instancia del VO
    db.session.add(product)
    db.session.commit()
    return jsonify({'message': 'Tu producto ha sido creado.'})


# FUNCIÓN: subir foto de producto de tienda
# HTML: shopCreateProduct.html
# JS: createProduct.js
@app.route('/upload-image', methods=['POST'])
def uploadImg():
    print('upload image start')
    if request.files:
        image = request.files['image']
        extension = image.filename.split('.')[1]
        # crear nombre unico para la imagen
        newFilename = uuid.uuid4().hex + '.'+ extension
        image.filename = newFilename
        # guardar archivo
        basedir = os.path.abspath(os.path.dirname(__file__))
        image.save(os.path.join(basedir, app.config['IMAGE_UPLOADS'], image.filename))
    return jsonify(newFilename)

# FUNCIÓN: eliminar producto de Tienda
# HTML: shopProducts.html
# JS: shopProducts.js > deleteItem()
@app.route('/shop/product', methods=['DELETE'])
def deleteProduct():
    data = request.json
    id = data.get('id')
    product = Product.query.filter_by(id=id).first()
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Producto eliminado'})


# FUNCIÓN: crear categoria de producto
# HTML: ninguna, desde postman
@app.route('/cat', methods=['POST'])
def createCat():
    data = request.json
    name = data.get('name')
    category = Category(name=name)
    db.session.add(category)
    db.session.commit()
    return 'ok'


# FUNCIÓN: crear todas las tablas establecidas en models
# HTML: ninguna, desde postman
@app.route('/create_all')
def createAll():
    db.create_all()
    return 'ok'


# FUNCIÓN: subir foto de producto para cognitivo
# HTML: index.html
# JS: getProducts.js
@app.route('/upload-cogImage', methods=['POST'])
def uploadCogImg():
    print('upload image start')
    if request.files:
        image = request.files['image']
        extension = image.filename.split('.')[1]
        # crear nombre unico para la imagen
        newFilename = 'cogImage' + '.'+ extension
        image.filename = newFilename
        # guardar archivo
        basedir = os.path.abspath(os.path.dirname(__file__))
        image.save(os.path.join(basedir, app.config['IMAGE_UPLOADS'], image.filename))
    return jsonify(newFilename)


# FUNCIÓN: COGNITIVO
# HTML: index.html
@app.route('/cognitivo')
def cognitivo():
    skey = '9019154e7a1b4d8db3a847658beb3f6c'
    endpoint = 'https://southcentralus.api.cognitive.microsoft.com/'
    cognitivo_url = endpoint + "/vision/v3.2/analyze?visualFeatures=Objects"
    documents = {"url":"https://localhost:5000/static/cogImage.jpg"}

    _headers = {"Ocp-Apim-Subscription-Key": skey, 'Content-Type': 'application/octet-stream'}
    imageName = 'cogImage.jpg'

    basedir = os.path.abspath(os.path.dirname(__file__))
    imgFile = os.path.join(basedir, app.config['IMAGE_UPLOADS'], imageName)
    with open(imgFile, 'rb') as f:
        data = f.read()
    _response=requests.post(cognitivo_url, headers=_headers, data=data)
    objects = _response.json()
    results = []

    print('objects: ', objects)

    for object in objects['objects']:
         results.append(object['object'])
         finalproducts = []
    for result in results:
         queriedProducts = Product.query.filter(Product.name.contains(result)).all()
         print('queried products: ', queriedProducts)
         if len(queriedProducts) < 1:
             print('empty')
         else:
             for queriedProduct in queriedProducts:
                 finalproducts.append(queriedProduct)

    product_schema = ProductSchema(many=True)
    products = product_schema.dump(finalproducts)
    
    return jsonify(products)
    return 'ok'


# FUNCIÓN: Guardar bitácora de eventos de usuario
# HTML: cualquiera
# JS: cualquiera que integre función logEvent()
@app.route('/event', methods=['POST'])
def logEvent():
    data = request.json
    event = data.get('eventName')
    token = request.cookies.get('ezjwt')
    decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms='HS256')
    id = decoded.get('id')
    type = decoded.get('type')
    newEvent = Event(name=event, user_type=type, user_id=id)
    db.session.add(newEvent)
    db.session.commit()
    return jsonify(id, type)