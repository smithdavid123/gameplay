#coding: utf8
import sys
sys.path.append('..')

import time
from libs.log import L
from common.key import KEY
from libs.redisEx2 import MyRedis as rs
from libs.database import Database
from games.setting import services as S, CREATE_GAMES
from crawler.b1cp import B1CP

Games = {}



def init():
    load_config()
    for item in S.values():
        game = item['class']()
        Games[item['name']] = game
    '''End For'''


def load_config():
    db = Database()
    rs.delete(KEY.ApiGamesEx)
    sql = "SELECT lottery, apiSrc, apiUrl FROM game_config where apiStatus=2"
    for (lottery, apiSrc, apiUrl) in db.select(sql, ()):
        rs.hset(KEY.ApiGamesEx, lottery, apiSrc)
        rs.hset(KEY.ApiGamesEx, lottery + "_url", apiUrl)
    
def request_data(name, seconds=4):
    init()
    L.log("Start Request Data Source For Game: {}".format(name))
    while True:
        apiUrl = rs.hget(KEY.ApiGamesEx, name + "_url", False)
        if not apiUrl: continue 
        data = B1CP(Games[name], apiUrl).request_api()
        Games[name].getDataEx(data)
        Games[name].updateData()
        time.sleep(seconds)
        


def request_qumin():
    request_data("qumin", 3)   # twssc 


if __name__ == '__main__':    
    request_qumin()
        
        