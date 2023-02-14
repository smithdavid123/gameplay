
 ps -ef | grep main.py |awk '{print $2}' |xargs kill -9
 ps -ef | grep mTaskData.py |awk '{print $2}' |xargs kill -9
 ps -ef | grep wKCProducer.py |awk '{print $2}' |xargs kill -9
 ps -ef | grep wKCConsumer.py |awk '{print $2}' |xargs kill -9
 ps -ef | grep mTaskOpen.py |awk '{print $2}' |xargs kill -9
 
