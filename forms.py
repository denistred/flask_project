from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField
from wtforms.validators import DataRequired, Email, Length, EqualTo


class RegisterForm(FlaskForm):
    name = StringField('', validators=[
        Length(min=3, max=30, message='Ваше имя должно быть от 3 до 50 символов')],
                       render_kw={"placeholder": "Ник"})
    email = StringField('', validators=[Email('Некорректный email')],
                        render_kw={"placeholder": "Электронная почта"})
    password = PasswordField('', validators=[DataRequired(), Length(min=4, max=24,
                                                                    message='Пароль должен быть от 4 до 24 символов')],
                             render_kw={"placeholder": "Пароль"})
    password_confirm = PasswordField('',
                                     validators=[DataRequired(),
                                            EqualTo('password', message='Пароли не совпадают')],
                                     render_kw={"placeholder": "Повторите пароль"})
    submit = SubmitField('Создать аккаунт')


class LoginForm(FlaskForm):
    email = StringField('', validators=[Email('Некорректный email')], render_kw={"placeholder": "Электронная почта"})
    password = PasswordField('', validators=[DataRequired()], render_kw={"placeholder": "Пароль"})
    submit = SubmitField('Войти')
