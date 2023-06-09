import datetime
import sqlite3
from forms import RegisterForm, LoginForm
from flask import Flask, render_template, redirect, url_for, request, jsonify, make_response, flash
from flask_login import login_user, LoginManager, current_user, login_required, logout_user
from data import db_session
from data.users import User
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SECRET_KEY'] = 'yandexlyceum_secret_key'

login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'success'


def main():
    db_session.global_init('db/logs.db')
    app.run()


@login_manager.user_loader
def load_user(user_id):
    db_sess = db_session.create_session()
    return db_sess.query(User).get(user_id)


@app.route('/')
def index():
    if current_user.is_authenticated:
        return render_template('index.html', title='Black Jack', user=current_user)
    else:
        return render_template('index.html', title='Black Jack')


@app.route('/register', methods=['POST', 'GET'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        hash = generate_password_hash(form.password.data)
        user = User()
        user.name = form.name.data
        user.email = form.email.data
        user.hashed_password = hash
        db_sess = db_session.create_session()
        db_sess.add(user)
        db_sess.commit()
        return redirect(url_for('index'))
    return render_template('register.html', title='Регистрация', form=form)


@app.route('/login', methods=['POST', 'GET'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        db_sess = db_session.create_session()
        user = db_sess.query(User).filter(User.email == form.email.data).first()
        if user and check_password_hash(user.hashed_password, form.password.data):
            login_user(user)
            return redirect('/')
        return render_template('login.html', message='Неправильный логин или пароль', form=form)
    return render_template('login.html', title='Авторизация', form=form)


@app.route('/profile', methods=['POST', 'GET'])
@login_required
def profile():
    db_sess = db_session.create_session()
    return render_template('profile.html', title='Профиль', user=current_user)


@app.route('/game')
def game():
    return render_template('game.html', title='Блек-Джек', user=current_user)


@app.route('/rules')
def rules():
    if current_user.is_authenticated:
        return render_template('rules.html', title='Правила', user=current_user)
    else:
        return render_template('rules.html', title='Правила')


@app.route('/logout')
def logout():
    logout_user()
    return redirect('/')


@app.route('/change_money_count', methods=['POST'])
def db_change():
    db_sess = db_session.create_session()
    json_responce = request.get_json()
    money_count = json_responce['money']
    add_money = json_responce['code']
    curr_user = db_sess.query(User).filter(User.id == current_user.id).first()
    if add_money == 0 or add_money == '0':
        curr_user.money -= int(money_count)
    else:
        curr_user.money += int(money_count)
    db_sess.commit()
    return "Success", 200


@app.route('/check_bonus_ready', methods=['GET'])
def check_bonus_ready():
    db_sess = db_session.create_session()
    user = db_sess.query(User).filter(User.id == current_user.id).first()
    json_responce = {}
    bonus_amount = 500
    if user.bonus_picked is False:
        user.money += bonus_amount
        user.bonus_picked = True
        json_responce['message'] = 'Вы получили 500 очков'
        json_responce['getting'] = True
    elif user.bonus_picked and (
            datetime.datetime.now() - user.last_bonus_pickup_time > datetime.timedelta(0, 10800)):
        user.last_bonus_pickup_time = datetime.datetime.now()
        user.money += bonus_amount
        user.bonus_picked = True
        json_responce['message'] = 'Вы получили 500 очков'
        json_responce['getting'] = True
    else:
        json_responce['message'] = 'Бонус ещё не готов, Вы можете забирать бонус раз в 3 часа'
        json_responce['getting'] = False
    json_responce['status'] = 200
    db_sess.commit()
    return jsonify(json_responce)


@app.route('/get_money_count', methods=['GET'])
def get_money_count():
    db_sess = db_session.create_session()
    json_responce = {'money': db_sess.query(User).filter(User.id == current_user.id).first().money}
    return jsonify(json_responce)


@app.route('/upload_user_avatar', methods=['POST'])
@login_required
def upload_user_avatar():
    if request.method == 'POST':
        file = request.files['file']
        if file and (file.filename.rsplit('.', 1)[1] in ['png', 'PNG', 'jpg']):
            try:
                img = file.read()
                db_sess = db_session.create_session()
                user = db_sess.query(User).filter(User.id == current_user.id).first()
                user.avatar = sqlite3.Binary(img)
                db_sess.add(user)
                db_sess.commit()
            except FileNotFoundError as e:
                flash('Ошибка чтения файла', 'error')
        else:
            flash('Ошибка установки аватара', 'error')
    return redirect(url_for('profile'))


@app.route('/get_user_avatar', methods=['GET'])
@login_required
def get_user_avatar():
    if not current_user.avatar:
        with app.open_resource(
                app.root_path + url_for('static', filename='images/missing_avatar.png'), 'rb') as f:
            img = f.read()
    else:
        img = current_user.avatar

    response = make_response(img)
    response.headers['Content-Type'] = 'image/png'
    return response


if __name__ == '__main__':
    main()
