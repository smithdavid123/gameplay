#coding: utf8
import sys
sys.path.append('..')
from libs.utils import S2TS

ISSUE_DATE_LENGTH = 8

class Code():
    
    def __init__(self, game, issue, open_code, open_time, next_time = None):
        self.game = game
        self.issue = str(issue)
        self.open_code = open_code
        self.open_time = open_time
        self.next_time = next_time
        # self.output()
    
    def output(self):
        item = {'issue': self.issue, 'code': self.open_code, 'open_time': self.open_time, 
                'next_time': self.next_time, 'lottery': self.game}
        print(item)
    
    def output_base(self):
        item = {'issue': self.issue, 'number': self.open_code, 'dateline': self.open_time, 
                'time': S2TS(self.open_time)}
        return item 

if __name__ == '__main__':
    pass