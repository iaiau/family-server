#-*-coding:utf-8-*-

# 定时任务配置
SCHEDULER_API_ENABLED = True
JOBS = []

# debug
DEBUG=True
USE_DEBUGGER=True
SECRET_KEY='a3f7e29b4c8d1065'

# database settin
SQLALCHEMY_DATABASE_URI='sqlite:///app.db'
SQLALCHEMY_ECHO=True
SQLALCHEMY_TRACK_MODIFICATIONS=True

# LOGGING CONFIG
LOGGER_NAME='family-server'
