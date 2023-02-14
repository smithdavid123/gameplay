*	python version:	2.7
*	PIL lib:	pip install Pillow
切记： 数据库关闭自动提交


On Windows:

	Use Apache + mod_wsgi + Flask, Maybe need Python 32Bit
	Version: 
		Apache2.2 			_packages/
		Python2.7 			_packages/
		mod_wsgi-win32-ap22py27-3.3		_packages/
		# https://code.google.com/archive/p/modwsgi/downloads?page=1

Step1:
	rename file as mod_wsgi.so
	copy mod_wsgi.so to C:\Program Files (x86)\Apache Software Foundation\Apache2.2\modules
	
Setp2:
	Edit httpd.conf
	
'''	
	LoadModule wsgi_module modules/mod_wsgi.so
	
	Listen 9403
	<VirtualHost *:9403 >
	DocumentRoot C:\Users\Administrator.xunying2\workspace\yaanWebDemo\main
		<Directory "C:\Users\Administrator.xunying2\workspace\yaanWebDemo\main">
			Order allow,deny
			Allow from all 
		</Directory>
	ErrorLog logs/error_log_82
		
	WSGIScriptAlias / C:/Users/Administrator.xunying2/workspace/yaanWebDemo/main/server.wsgi
	</VirtualHost>
'''

Step3：
	Create server.wsgi (Exist in this project!)
	Edit it and put into main/
'''	
	import sys
	sys.path.insert(0, sys.path[0])
	from app import app
	application = app
'''	

# Ref:	 https://www.cnblogs.com/cxchanpin/p/6936880.html



On Linux:
	Install uWSGI: 
	http://projects.unbit.it/downloads/uwsgi-1.4.10.tar.gz
	
	Edit buildconf/core.ini 
'''	
	plugin_dir = /usr/lib/uwsgi
	bin_name = /usr/bin/uwsgi
'''

	python uwsgiconfig.py --build core
	
	python2.7 uwsgiconfig.py --plugin plugins/python core python27
	
Run:	
	uwsgi --ini /root/yaanServer/main/uwsgi.ini --plugin python27
	
	or
	
	uwsgi -d --emperor /data/www/uwsgi.ini --enable-threads
	
Stop：
	uwsgi --stop /root/yaanServer/main/uwsgi.pid
	
	or
		ps ax | grep uwsgi
		killall -s INT /root/yaanServer/main/uwsgi.ini

切记：uwsgi.ini中配置端口的字段名： 	http-socket=:8008
