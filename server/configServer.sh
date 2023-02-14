#!/bin/bash
echo 'create supervisord.conf'
echo_supervisord_conf > ./supervisord.conf
echo [include] >> ./supervisord.conf
echo "files = `pwd`/*.ini" >> ./supervisord.conf

echo 'copy supervisord.conf to /etc'
cp ./supervisord.conf /etc/

echo 'create supervisor.ini'
name=$(basename `pwd`)
echo -e "[program:$name]"> supervisor.ini
cat>>supervisor.ini<<EOF
command=gunicorn -b 0.0.0.0:8108 --chdir `pwd`/main main:app
directory=`pwd`
autostart=true
autorestart=true
priority=5
killasgroup=true
stopasgroup=true
EOF
