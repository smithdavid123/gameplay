#coding: utf8
from heapq import heappush, heappop, nsmallest, nlargest
import datetime

class Heap():
    '''
    堆数据结构
    '''
    '''
    TODO: 是否在堆里加入字符串会出现性能或未知问题
    
    :
        k - key for heap to ensure only number in heap
        ck - child key to mark only one, while k could be repeat
    '''
    def __init__(self, k = None, ck = None, params = []):
        '''
        data: [k],
        cache: {
            k: {
                ck: e
            }
        }
        '''
        self.data = []
        self.cache = {}
        self.k = k
        self.ck = ck
        
        for e in params: self.push(e)
        
    def push(self, e):
        if e == None or len(self.cache) > 50000: return
        
        if self.k:
            k, ck = e[self.k], e[self.ck]
            if k not in self.cache:
                self.cache[k] = {ck: e}
                heappush(self.data, k)
            else:
                if ck not in self.cache[k]: 
                    self.cache[k][ck] = e
                else:
                    pass
                    # print 'exist:', k, ck
        else:
            if e not in self.cache:
                self.cache[e] = e
                heappush(self.data, e)
        
            
    def pop(self):
        if len(self.data) > 0: 
            k = heappop(self.data)
            rst = self.getV(k) 
            del self.cache[k] 
            return rst
        
        return None
    
    def getV(self, k):
        res = self.cache[k]
        return res.values() if self.k else res
    
    def min(self, n = 1):
        res = nsmallest(n, self.data)
        return self.getV(res[0]) if n == 1 else [self.getV(e) for e in res]
    
    def max(self, n = 1):
        res = nlargest(n, self.data)
        return self.getV(res[0]) if n == 1 else [self.getV(e) for e in res]
   
    def isEmpty(self):
        return len(self.data) == 0
    
    def length(self):
        return len(self.data)
    
    def first(self):
        if len(self.cache) == 0: return None
        return self.data[0]
    
    def firstValue(self):
        e = self.data[0]
        return self.getV(e)
    
if __name__ == '__main__':
    dt = [{'tm': 12, 'name': 'cqssc'}, {'tm': 120, 'name': 'cqssc'}]    
    c = Heap('tm', 'name', dt)
    c.push({'tm': 22, 'name': 'cqssc'})
    c.push({'tm': 22, 'name': 'cqssx'})
#     c.push(2)
    
    print c.min()
    
#     print c.pop()
#     print c.pop()
#     print c.pop()
    

