#coding:utf8
import os
import datetime
import random
from libs.database import Database
import mInit
import uuid

def checkFileType(filename):
    ALLOWED_EXTENSIONS = set(['png', 'jpg', 'JPG', 'PNG', 'gif', 'GIF'])
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

def createFileName(): 
    nowTime = datetime.datetime.now().strftime("%Y%m%d%H%M%S");  
    randomNum = random.randint(0, 100)
    if randomNum <= 10: randomNum = '0'+ str(randomNum);
    uniqueNum = str(nowTime) + str(randomNum);
    return uniqueNum

def saveFile(img):
    filename = img.filename
    if not checkFileType(filename): return None
    baseDir = os.path.abspath(os.path.dirname(__file__))
    path = baseDir + "/static/images/"
    fileName = createFileName() + os.path.splitext(filename)[1]
    filePath = path + fileName
    img.save(filePath)
    
    return fileName
    
def changePayStatus(user, _id, status):
    db = Database()
    sql = "update pay_method set status = %s where id = %s"
    keys = ['user', 'rfTable', 'rfField', 'content', 'tarValue']
    sqlO = ("insert into operation (" + ",".join(keys) + ") values (" + ','.join(['%s' for i in keys]) + ")")
    paramsO = (user, 'pay_method', 'status', _id, status)

    comands = [[sql, (status, _id)], [sqlO, paramsO]]
    rst = db.Transaction(comands)
    
    '''刷新缓存'''
    if rst[0]: mInit.loadPayMethods()
    return rst[0]

def changePayDefault(user, _id):
    db = Database()
    sqlC = "update pay_method set isDefault = 0"
    sqlS = "update pay_method set isDefault = 1 where id = %s"
    
    comands = [[sqlC, ()], [sqlS, (_id,)]]
    rst = db.Transaction(comands)
    
    '''刷新缓存'''
    if rst[0]: mInit.loadPayMethods()
    return rst[0]

def delPay(user, _id):
    db = Database()
    sql = "delete from pay_method where id = %s"
    
    '''操作日志'''
    keysO = ['user', 'rfTable', 'rfField', 'content', 'tarValue']
    sqlO = ("insert into operation (" + ",".join(keysO) + ") values (" + ','.join(['%s' for i in keysO]) + ")")
    paramsO = (user, 'pay_method', 'id', 'del', _id)
    
    comands = [[sql, (_id, )], [sqlO, paramsO]]
    rst = db.Transaction(comands)
    
    '''刷新缓存'''
    if rst[0]: mInit.loadPayMethods()
    return rst[0]


def upload(user, img, args, trans):
    db = Database()
    params, fileName = args[1:], ''
    keys= ['id', 'name', 'method', 'feeRate', 'minUnitRecharge', 'maxUnitRecharge', 'isDefault', 'type']
    keysT = ['id', 'bankName', 'bankBranch', 'bankCardName', 'bankCardId']
    comands, isUpdate = [], str(args[0]) != '-1'
    
    if img: 
        fileName = saveFile(img)
        keys.append('image')
        params.append(fileName)
    
    link_id = str(uuid.uuid1())
    keys.append('uuid')
    params.append(link_id)
    sql = "insert into pay_method (" + ",".join(keys[1:]) + ") values (" + ",".join(map(lambda x:'%s', keys[1:])) + ")"
    
    if isUpdate:
        sql = "update pay_method set " + ",".join([(k + " = %s") for k in keys[1:-1]]) + " where id = %s"
        params = params[:-1] + [args[0]]
        
    '''类型为2，修改三方转账配置表'''
    if int(args[-1]) != 1:
        keysT.append('uuid')
        sqlT = "insert into pay_transfer (" + ",".join(keysT[1:]) + ") values (" + \
            ",".join(map(lambda x:'%s', keysT[1:])) + ")"
        paramsT = [trans[k] for k in keysT[1:-1]] + [link_id]
        if isUpdate:
            sqlT = "update pay_transfer set " + ",".join([(k + " = %s") for k in keysT[1:-1]]) + " where id = %s"
            paramsT = paramsT[:-1] + [trans['id']]
        comands += [[sqlT, paramsT]]
        
    '''操作日志'''
    keysO = ['user', 'rfTable', 'rfField', 'content', 'tarValue']
    sqlO = ("insert into operation (" + ",".join(keysO) + ") values (" + ','.join(map(lambda x:'%s', keysO)) + ")")
    paramsO = (user, 'pay_method', 'all', str(params[0]) + ',' + fileName, params[0] + ',' + params[1])
    
    comands += [[sql, params], [sqlO, paramsO]]
    rst = db.Transaction(comands)
    print(comands)
    '''刷新缓存'''
    if rst[0]: mInit.loadPayMethods()
    
    return rst
    
    

if __name__ == '__main__':
    pass
    print(str(uuid.uuid1()))