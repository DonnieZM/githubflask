from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_assets import Environment, Bundle
from .util.assets import bundles
from flask_cors import CORS
from flaskext.mysql import MySQL


app = Flask(__name__)
CORS(app)
# ma = Marshmallow(app)

assets = Environment(app)
assets.register(bundles)

# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ezmarket.db'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://sepherot_danield:N8BQy5yiH6Zz@nemonico.com.mx/sepherot_danieldBD'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {"pool_pre_ping": True, "pool_recycle": 300,}
app.config['SECRET_KEY'] = '02d2adef8b09472abebf227ecef3514b'
app.config['IMAGE_UPLOADS'] = 'static/uploads/'

# app.config['MYSQL_DATABASE_USER']= 'sepherot_danield'
# app.config['MYSQL_DATABASE_PASSWORD']= 'N8BQy5yiH6Zz'
# app.config['MYSQL_DATABASE_DB']= 'sepherot_danieldBD'
# app.config['MYSQL_DATABASE_HOST']= 'nemonico.com.mx'


db = SQLAlchemy(app)
ma = Marshmallow(app)

from market import routes