#coding: utf8
import sys
reload(sys)
sys.path.append('..')
sys.path.append('../..')
sys.setdefaultencoding('utf-8')

# from games.gChongqing import ChongQing
# from games.gTencent import Tencent
from games.gTaiwan import TaiWan
from games.gBeijing import BeiJing
from games.gSSC import ChongQing, XinJiang, TianJin, Tencent, \
    T1S90, T1S90A, T1S90B, T1S90C, T1S90D, T1S60, T1S180, T1S30, Singapore, \
    Lucky10, HeNei1, HeNei5, \
    QiQu, QiQu5, QiQu10, Lucky5, Happy2, Lucky1, Lucky3
from games.g11X5 import GuangDong115, JiangXi115, ShangHai115, AnHui115, \
    ShanDong115, LiaoNing115, JiaNaDa115, NiuYue115
from games.gK3 import AnHuiK3, JiangSuK3, HuBeiK3, JiLinK3, T3S90, T3S120
from games.gK8 import TaiWanK8, HanGuoK8, DongJingK8, BeiJingK8, SingaporeK8
from games.gOther import FC3D, PL3, BeiJingPK10, England120, England180, Lucky300, PCDD
from gameList import GameInfoList


GameClassList = [ChongQing, XinJiang, TianJin, Tencent, 
    T1S90, T1S90A, T1S90B, T1S90C, T1S90D, T1S60, T1S180, T1S30, Singapore,
    TaiWan, BeiJing, Lucky10, HeNei1, HeNei5, QiQu, QiQu5, QiQu10, Lucky5, Happy2, Lucky1, Lucky3,
    GuangDong115, JiangXi115, ShangHai115, AnHui115, ShanDong115, LiaoNing115, 
    JiaNaDa115, NiuYue115,
    AnHuiK3, JiangSuK3, HuBeiK3, JiLinK3, T3S90, T3S120,
    TaiWanK8, HanGuoK8, DongJingK8, BeiJingK8, SingaporeK8,
    FC3D, PL3, BeiJingPK10, England120, England180, Lucky300, PCDD
]


        
services = {}
GAME_INSTANCE = {}
for C in GameClassList:
    g = C() 
    line = GameInfoList[g.name]
    line['class'] = C
    services[g.name] = line
    GAME_INSTANCE[g.name] = g
    

'''以下彩种只生成·不请求'''
CREATE_GAMES = set(['t1s180a', 't1s30', 't1s60', 't1s90', 't1s90a', 'qqmin', 
                    't1s90b', 't1s90c', 't1s90d', 't1s180', 'sgssc', 't2s30', 't2s90',
                    'sgkl8', 't3s90', 't3s120', 'hgkl8', 't6s180', 't6s120', 'jpkl8', 'twkl8'
            ])


if __name__ == '__main__':
    pass