#coding:utf8
'''
Created on 2018年5月9日

@author: liuna
'''
import database

dbName = 'lottery'
sql1 = "CREATE DATABASE IF NOT EXISTS {} default charset utf8 COLLATE utf8_general_ci".format(dbName)

sql2 = '''CREATE TABLE 'userInfo' (
    'id' int(4) PRIMARY KEY AUTO_INCREMENT,
    'userId' varchar(32) NOT NULL,
    'userName' varchar(32) NOT NULL,
    'ip' varchar(32) NOT NULL,
    'updateTime' datetime,
    'createTime' datetime,
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;'''

db = database.Database()
db.run(sql2)

print sql1

if __name__ == '__main__':
    pass