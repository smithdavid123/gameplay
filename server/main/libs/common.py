#coding:utf8



'''['ALL'] - 查所有, ['SELF', user] - 查自己, ['PARENT', user, username] - 查下线'''
def GetWhr(users, timeField = "createTime"):
    wheres = {'ALL': 1, 'SELF': 1}
    whr = " where" if users[0] in wheres else " join relation b on b.child=account and b.parent='{}' and "\
                            .format(users[1])  
    return whr + " " + timeField + " BETWEEN %s and %s"
    
def SqlUser(users, sql, params, timeField = "createTime"):    
    if users[0] == 'SELF':
        sql += " and account = %s"
        params.append(users[1])
    elif len(users) > 2:
        sql += " and account = %s"
        params.append(users[2])
    return sql + " order by " + timeField + " desc"

def SqlUser2(users, sql, params, key):    
    if users[0] == 'SELF':
        sql += " and account = %s"
        params.append(users[1])
    elif len(users) > 2:
        sql += " and account = %s"
        params.append(users[2])
    return sql + " group by " + key + ", type"


    
# def getIPList(user = "admin", purpose = "remove"):
#     db = database.Database()
#     tbName = {'remove':'ipFilter', 'add':'ipSpecial'}[purpose]
#     return db.selectEx("select ip from {} where username='{}'".format(tbName, user))
# 
# def getUserList():
#     db = database.Database()
#     return db.selectEx("select userId, userName, ip, updateTime from userInfo order by updateTime")
# 
# def addUser(item):
#     db = database.Database()
#     sql = '''insert into userInfo (userId, userName, createTime, ip, updateTime) values
#      ('{}', '{}', '{}', '{}', '{}')'''.format(item['userId'], item['userName'].encode('utf8'), 
#                                               item['time'], item['ip'], TM())
#     db.run(sql)
    
if __name__ == '__main__':
    pass
#     print getUserList()
#     print '{}112'.format(TM())
#     
#     print 1525625274.0 * 1000
    print TS(1525617894)
    
    
    