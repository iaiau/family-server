import os

from flask import Flask, render_template, abort, Blueprint, jsonify
from flask_login import LoginManager,login_required
import click
import sys

from markupsafe import Markup
from sqlalchemy import text, literal_column

from app.models import db, User
from app.routes.author import author_bp
from app.routes.experiences import experience_bp
from app.routes.files import file_bp
from app.routes.memo import memo_bp
from app.routes.settings import settings_bp
from app.routes.tools import tools_bp

import logging

from app.services.users_service import getUserByName

logger = logging.getLogger(__name__)

family_bp = Blueprint("family", __name__,static_folder='app/static', template_folder='app/templates', url_prefix="/")
family_bp.register_blueprint(author_bp)
family_bp.register_blueprint(file_bp)
family_bp.register_blueprint(memo_bp)
family_bp.register_blueprint(experience_bp)
family_bp.register_blueprint(tools_bp)
family_bp.register_blueprint(settings_bp)

store_path = os.path.abspath(os.path.dirname(__file__))
family_app = Flask(__name__, instance_path=store_path,static_folder='app/static',template_folder='app/templates', instance_relative_config=True)

from flask_cors import CORS
CORS(family_app, resources={r"/*": {"origins": "*"}})

# family_app.secret_key = "a3f7e29b4c8d1065"
login_manager = LoginManager(family_app)
login_manager.login_view = "/author/login"

@family_app.route("/")
@login_required
def index():
	return render_template("index.html")

@family_app.route("/default_page")
@login_required
def default_page():
	return render_template("/components/default_frame.html")

@family_app.route("/move_to_trash/<string:table>/<int:_id>", methods = ['POST'])
@login_required
def move_to_trash(table,_id):
	update_sql = text(f"""
	       update {literal_column(table)}  set deleted = 1 where id=:id
	   """)
	db.session.execute(update_sql, {
		"table": table,
		"id": _id
	})
	return {"success":True}

def callBack(var):
	return User()

@login_manager.user_loader(callback=callBack)
def load_user(username):
    return getUserByName(username)



def config_app(app, config):
	"""
	应用程序配置
	"""
	logger.info('应用程序配置')
	app.config.from_pyfile(config)
	db.init_app(app)
	db.app = app

	@app.after_request
	def after_request(response):
		try:
			response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
			response.headers["Pragma"] = "no-cache"
			response.headers["Expires"] = "0"
			response.headers['Access-Control-Allow-Origin'] = 'http://192.168.1.12:5000'
			response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
			response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
			db.session.commit()
		except Exception as e:
			print(e)
			db.session.rollback()
			abort(500)
		return response

def dispatch_handlers(app):
	"""
	错误处理
	"""
	d = {'title':u'提示'}
	@app.errorhandler(403)
	def permission_error(error):
		logger.error(error)
		d['message'] = u'您无权执行当前操作！请登录或检查url是否错误。'
		return render_template('error.html', **d), 403

	@app.errorhandler(404)
	def page_not_found(error):
		logger.error(error)
		d['message'] = u'你访问的页面不存在！'
		return render_template('error.html', **d), 404

	@app.errorhandler(500)
	def internal_server_error(error):
		logger.error(error)
		d['message'] = u'你访问的页面出错了，请稍候再试！'
		return render_template('error.html', **d)

def dispatch_apps(app):
	app.register_blueprint(family_bp, url_prefix='/')

@family_app.template_filter('safe_html')
def safe_html(content):
    return Markup(content)

@click.command()
@click.option('-c', '--config',
              default='config.py',
              type=click.Path(exists=True, dir_okay=False),
              help='Configuration file name (default: config.py)')
def initdb(config='config.py'):
	config_app(family_app, config)

	logger.info("初始化数据库")
	try:
		db.drop_all()
		db.create_all()
		print('Create tables success')
	except Exception as e:
		print('Create tables failed:'), e
		sys.exit(0)

family_app.cli.add_command(initdb)

if __name__ == '__main__':
	config_app(family_app, "config.py")
	dispatch_handlers(family_app)
	dispatch_apps(family_app)
	family_app.run(host='0.0.0.0', debug=True)
