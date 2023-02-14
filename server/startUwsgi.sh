uwsgi -d --emperor /root/server/main/uwsgi.ini --enable-threads
systemctl start nginx
