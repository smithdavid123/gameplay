#coding: utf8
'''
-----------------------------------------------------------
User
Date:       2019年11月11日
-----------------------------------------------------------
'''

class Balance():
    
    '''先虚后实'''
    def __init__(self, virtual, deposit, blocked = 0):
        self.virtual_before = virtual
        self.deposit_before = deposit
        self.blocked_before = blocked
        self.balance_before = virtual + deposit
        
        self.virtual_after = virtual
        self.deposit_after = deposit
        self.blocked_after = blocked
        
    def init(self, virtual, deposit):
        self.__init__(virtual, deposit)
        self.update()
        
    def reload(self):
        self.__init__(self.virtual_after, self.deposit_after)
        self.update()
        
    def update(self):
        self.balance_after = self.virtual_after + self.deposit_after
    
    '''充值'''
    def deposit(self, value, additional = 0):
        self.deposit_after = self.deposit_before + value
        self.virtual_after = self.virtual_before + additional
        self.update()
    
    '''申请提现'''
    def apply_withdraw(self, amount):
        self.money_out(amount)
        self.blocked_after = self.blocked_before + amount
        self.update()
        
    '''管理员操作'''
    def withdraw(self, virtual_out, deposit_out):
        self.virtual_out = virtual_out
        self.deposit_out = deposit_out
        self.money_change = virtual_out + deposit_out
        self.blocked_after = self.blocked_before - self.money_change
    
    def withdraw_cancel(self):
        self.virtual_after = self.virtual_before + self.virtual_out
        self.deposit_after = self.deposit_before + self.deposit_out
        self.update()
    
    def withdraw_confirm(self):
        pass
    
    def order_cancel(self, virtual_out, deposit_out, winMoney=None):
        self.virtual_after = self.virtual_before + virtual_out
        self.deposit_after = self.deposit_before + deposit_out
        if winMoney: self.virtual_after -= winMoney 
        self.update()
        
    '''出账·通用'''
    def money_out(self, amount):
        '''优先从充值账户（balanceD）扣除'''
        if amount <= self.deposit_before:
            self.deposit_out, self.virtual_out = amount, 0
            self.deposit_after, self.virtual_after = self.deposit_before - amount, self.virtual_before
        else:
            self.deposit_out, self.virtual_out = self.deposit_before, amount - self.deposit_before
            self.deposit_after, self.virtual_after = 0, self.balance_before - amount
    
    def money_send(self, amount, transType):
        if transType == 0:
            if (self.deposit_before + self.virtual_before) < amount: return False
            self.money_out(amount)
            # if self.deposit_before < amount: return False
            # self.deposit_out, self.virtual_out = amount, 0
            # self.deposit_after, self.virtual_after = self.deposit_before - amount, self.virtual_before
        else:
            if self.virtual_before < amount: return False
            self.deposit_out, self.virtual_out = 0, amount
            self.deposit_after, self.virtual_after = self.deposit_before, self.virtual_before - amount
        self.update()
        return True

    '''转账接收方'''
    def money_receive(self, amount, transType):
        if transType == 0:
            self.deposit_after = self.deposit_before * 1.0 + amount
        else:
            self.virtual_after = self.virtual_before * 1.0 + amount
        self.update()
        
    def profit(self, amount):
        self.money_add(amount)
    
    def money_add(self, amount):
        self.virtual_after = self.virtual_before * 1.0 + amount
        self.update()
        
    '''消费'''
    def consume(self, amount):
        self.money_out(amount)
        self.update()
        
    
    def set_money_out(self, virtual_change = 0, deposit_change = 0):
        pass
    
    
    def info(self):
        return ",".join(str(k) for k in [self.virtual_before, self.virtual_after, self.deposit_before, self.deposit_after])
    
        
if __name__ == '__main__':
    pass