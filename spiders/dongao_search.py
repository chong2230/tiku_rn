# coding=utf-8
#导入pandas库
# import pandas as pd
import sys
import hashlib
import urllib, urllib2
import  requests
from  bs4 import BeautifulSoup
import json
import xlwt
import threading, time
import datetime

_cookies = urllib2.HTTPCookieProcessor()
_opener = urllib2.build_opener(_cookies)
_opener.addheaders = [('User-agent', 'Mojo/IOS/ioekmgjyhj&88@307'), ('X-Requested-With', 'XMLHttpRequest')]
urllib2.install_opener(_opener)

login_url = 'https://passport.dongao.com/login'
params={
    "dest": "13471171545",
    "password": "a1191639386",
    "validateCode": "W3F2"
}

urlstart='http://es.dongao.com/paper/print/'#为了方便翻页将网址代码分成两部分
urlend='1686834'+'?type=paper'
all_info_list=[]
# headers = {'user-agent':'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.74 Safari/537.36'}         #请求头

def login(username, passwd):
    # urllib2.urlopen(login_url, urllib.urlencode({'loginForm[dest]' : username, 'loginForm[password]' : passwd}))
    html=requests.post(login_url,data=params)
    print(html.text)

def search():
    for i in range(1,2):#从网站上直接获取页面个数
        print '正在打印第'+str(i)
        url=urlstart+urlend#整理网站地址
        request=urllib2.urlopen(url)#用urllib2打开网站
        html=request.read()#读取网站代码
        bs=BeautifulSoup(html,'html.parser',from_encoding='utf-8')#BeautifulSoup整理网站代码
        #提取标题
        print_title=bs.find_all('div',attrs={'class':'print_title'})
        print print_title
        tt=[]
        for d in print_title:
            t=d.get_text()
            tt.append(t)
        #大题
        sys_ti=bs.find_all('div',attrs={'class':'sys_ti'})
        ti=[]
        for a in sys_ti:
            ti.append(a.get_text())
            # print a.get_text()
            # print ti
        #小题
        first_p=bs.find_all('div',attrs={'class':'first_p'})
        fp=[]
        for b in first_p:
            fp.append(b.get_text())
        print_ti=bs.find_all('div',attrs={'class':'print_ti'})
        pt=[]
        for c in print_ti:
            print c
            pt.append(c.p.string)
        workbook = xlwt.Workbook()
        worksheet = workbook.add_sheet('My Sheet')
        today=datetime.datetime.now().strftime('%Y-%m-%d')
        sqlstr=''
        for index in range(len(fp)):
            worksheet.write(index, 0, ti[index])    #标题
            worksheet.write(index, 1, fp[index])    #房源地址
            worksheet.write(index, 2, pt[index])    #房源信息
            worksheet.write(index, 3, pt[index+1])    #房源关注度
            worksheet.write(index, 4, pt[index+2])    #房源总价
            worksheet.write(index, 5, pt[index+3])    #房源单价
            # worksheet.write(index, 6, today)        #创建时间
        # workbook.save('Excel_Workbook'+str(i)+'.xls')
        print sqlstr
        workbook.save('1.xls')
        time.sleep(5)

if __name__ == '__main__':
    username = sys.argv[1]
    passwd = sys.argv[2]
    login(username, passwd)
    print "login with %s" %(username)
    search()
    
 
