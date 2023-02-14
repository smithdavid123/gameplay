#coding:utf8
import random
from libs.utils import TM, DT
from libs.database import Database

sql = "SELECT lottery, issue, count(*) FROM `game_order` where status = 0 group by lottery, issue"

games = {
    # "cqssc": ["20190508-023"],
    "qqmin": ["20190603-1014", "20190603-1218"],
    # "t1s180a": [""],
    # "t1s300": [""],
    # "t1s300a": ["20190603-0203", "20190603-0239"],
    # "t1s600": [""],
    "t1s60a": ["20190603-1014", "20190603-1218"], 
    # "tjssc": [""]
}

def run():
    db = Database()
    command = []
    for g in games:
        ms = [games[g][0].replace('-', ''), games[g][1].replace('-', '')]
        for d in range(int(ms[0]), int(ms[1]) + 1):
            codes = [str(random.randint(0, 9)) for i in range(5)]
            line = {'name': g, 'issue': str(d)[0:-4] + '-' + str(d)[-4:], 'oldCode': 'create', 'openCode': ','.join(codes),
                    'dayTime': DT(), 'openTime': TM(), 'stopTime': TM()}
            keys = line.keys()
            sql = "insert into open_code (" + ','.join(keys) + ") values (" + ','.join(['%s' for k in keys]) + ")"
            command.append([sql, [line[k] for k in keys]])
            print sql
    print db.Transaction(command)
#     print command
    
    
if __name__ == '__main__':
    run()