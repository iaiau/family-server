# 一、核心功能模块
### ‌‌文件共享
  分享个人文件，图片，音频，视频，文档等
### 经验分享
  分享个人经验，类似于个人博客功能，支持在线编辑，保存
### 个人备忘录
### 常用小工具
### 用户管理
### 个人收藏
### 系统管理

技术栈： python flask boostrap jquery quill(在线夫文本编辑器)
# 二、初始化数据库
  执行initdb.sh
# 三、添加管理员用户
  > sqlite3 app.db
  sqlite> insert into users('username','name','deleted','password') values('admin','admin',0,'21232f297a57a5a743894a0e4a801fc3');
  > 21232f297a57a5a743894a0e4a801fc3 为 admin 的md5值
  


