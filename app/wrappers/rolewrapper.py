from functools import wraps
from flask import session, jsonify, redirect


# 权限拦截器
def role_required(role):
    def wrapper(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if not session.get("user", None):
                return redirect("/author/login")
            if session["user"]['role'] != role:
                return jsonify({'message': 'Permission denied!'}), 403

            return f(*args, **kwargs)

        return decorated

    return wrapper
