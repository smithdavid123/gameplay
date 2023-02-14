#coding:utf8


limit = 15

class URL():
    '''重庆时时彩'''
    cqssc = "http://api.b1api.com/api?p=json&t=cqssc&token=20360F81A63793DD"
    '''新疆时时彩'''
    xjssc = "http://api.b1api.com/api?p=json&t=xjssc&token=20360F81A63793DD"
    '''天津时时彩'''
    tjssc = "http://api.b1api.com/api?p=json&t=tjssc&token=20360F81A63793DD"
    '''腾讯分分彩'''
    qqmin = "http://api.b1api.com/api?p=json&t=txffc&token=20360F81A63793DD"
    '''韩国1.5分彩'''
    t1s90 = ""
    '''新德里1.5分彩'''
    t1s90a = "" 
    '''俄罗斯1.5分彩'''
    t1s90b = ""
    '''印度1.5分彩'''
    t1s90c = ""
    '''东京1.5分彩'''
    t1s90d = "http://api.b1api.com/api?p=json&t=djydwfc&token=20360F81A63793DD"
    '''河内分分彩'''
    t1s60h = "http://api.b1api.com/api?p=json&t=hn5fc&token=20360F81A63793DD"
    '''河内5分彩'''
    t1s300 = "http://api.b1api.com/api?p=json&t=hn5fc&token=20360F81A63793DD"
    '''幸运十分彩'''
    t1s600 = ""
    '''奇趣三彩'''
    qumin = ""
    qu5fen = ""
    qu10fen = ""
    '''北京时时彩'''
    bjssc = "http://api.b1api.com/api?p=json&t=bjssc&token=20360F81A63793DD"
    '''台湾时时彩'''
    twssc = ""
    '''新加坡30秒彩'''
    t1s30 = ""
    '''美国一分彩'''
    t1s60 = ""
    '''缅甸三分彩'''
    t1s180 = ""
    '''新加坡2分彩'''
    sgssc = ""
    '''广东11选5'''
    gd11x5 = "http://api.b1api.com/api?p=json&t=gd115&token=20360F81A63793DD"
    jx11x5 = "http://api.b1api.com/api?p=json&t=jx115&token=20360F81A63793DD"
    ah11x5 = "http://api.b1api.com/api?p=json&t=ah115&token=20360F81A63793DD"
    sh11x5 = "http://api.b1api.com/api?p=json&t=sh115&token=20360F81A63793DD"
    sd11x5 = "http://api.b1api.com/api?p=json&t=sd115&token=20360F81A63793DD"
    ln11x5 = "http://api.b1api.com/api?p=json&t=ln115&token=20360F81A63793DD"
    '''纽约11选5'''
    t2s30 = ""
    '''加拿大11选5'''
    t2s90 = ""
    '''江苏快3'''
    jsk3 = "http://api.b1api.com/api?p=json&t=jsk3&token=20360F81A63793DD"
    ahk3 = "http://api.b1api.com/api?p=json&t=ahk3&token=20360F81A63793DD"
    hbk3 = "http://api.b1api.com/api?p=json&t=hbk3&token=20360F81A63793DD"
    jlk3 = "http://api.b1api.com/api?p=json&t=jlk3&token=20360F81A63793DD"
    '''吉隆坡快3'''
    t3s90 = ""
    '''新西兰快3'''
    t3s120 = ""
    fc3d = "http://api.b1api.com/api?p=json&t=fc3d&token=20360F81A63793DD"
    pl3 = "http://api.b1api.com/api?p=json&t=pl3&token=20360F81A63793DD"
    bjkl8 = "http://api.b1api.com/api?p=json&t=bjkl8&token=20360F81A63793DD"
    hgkl8 = ""
    twkl8 = ""
    jpkl8 = ""
    sgkl8 = ""
    t6s120 = ""
    t6s180 = ""
    bjpk10 = "http://api.b1api.com/api?p=json&t=bjpk10&token=20360F81A63793DD"
    t6s300 = ""
    t1s300a = ""
    t1s120 = ""
    t1s60a = ""
    t1s180a = ""
    pcdd = ""
    
    '''用于按名城查找'''
    Lotterys = {
        "cqssc": cqssc, 
        "xjssc": xjssc, 
        "tjssc": tjssc, 
        "qqmin": qqmin, 
        "t1s90": t1s90, 
        "t1s90a": t1s90a, 
        "t1s90b": t1s90b, 
        "t1s90c": t1s90c, 
        "t1s90d": t1s90d, 
        "bjssc": bjssc, 
        "twssc": twssc, 
        "t1s30": t1s30, 
        "t1s60": t1s60, 
        "t1s180": t1s180, 
        "sgssc": sgssc, 
        "gd11x5": gd11x5, 
        "jx11x5": jx11x5, 
        "ah11x5": ah11x5, 
        "sh11x5": sh11x5, 
        "sd11x5": sd11x5, 
        "ln11x5": ln11x5, 
        "t2s30": t2s30, 
        "t2s90": t2s90, 
        "jsk3": jsk3, 
        "ahk3": ahk3, 
        "hbk3": hbk3, 
        "jlk3": jlk3, 
        "t3s90": t3s90, 
        "t3s120": t3s120, 
        "fc3d": fc3d, 
        "pl3": pl3, 
        "bjkl8": bjkl8, 
        "hgkl8": hgkl8, 
        "twkl8": twkl8, 
        "jpkl8": jpkl8, 
        "sgkl8": sgkl8, 
        "t6s120": t6s120, 
        "t6s180": t6s180, 
        "bjpk10": bjpk10,
        "t1s300": t1s300,
        't1s60h': t1s60h,
        "t1s600": t1s600,
        "qumin": qumin,
        "qu5fen": qu5fen,
        "qu10fen": qu10fen,
        "t6s300": t6s300,
        "t1s300a": t1s300a,
        "t1s120": t1s120,
        "t1s60a": t1s60a,
        "t1s180a": t1s180a,
        "pcdd": pcdd
    }
    
    for k in Lotterys: 
        if Lotterys[k] != "": Lotterys[k] += '&limit=' + str(limit)

'''注: https://www.b1cp.com, username: fanshilin01, password: fanshilin'''        


if __name__ == '__main__':
    print URL.Lotterys
    pass