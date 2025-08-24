#-*-coding:utf-8-*-

# 定时任务配置
SCHEDULER_API_ENABLED = True
JOBS = []

# debug
DEBUG=True
USE_DEBUGGER=True

# database settings
SQLALCHEMY_DATABASE_URI='sqlite:///app.db'
SQLALCHEMY_ECHO=True
SQLALCHEMY_TRACK_MODIFICATIONS=True

# LOGGING CONFIG
LOGGER_NAME='family-server'
