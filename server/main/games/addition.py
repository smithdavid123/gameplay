#coding:utf8

import sys
sys.path.append('..')

from mChase import cancelChase

'''billno为表game_order中某记录的订单号'''
def stopAfterWin(account, billno, db = None):
    # if not db: db = Database()
    sql = "select c.billno from game_order o join game_chase c on o.chaseId=c.billno where o.billno = %s \
        and c.account=%s and c.status=0 and o.status=2 and c.isWinStop=1"
    res = db.selectEx(sql, (billno, account))
    if len(res) == 0: return False
    
    cBillno = res[0][0]
    
    cancelChase(account, cBillno, db)
    
    
if __name__ == '__main__':
    stopAfterWin("system", "20190701005649224131919188977")
    
    