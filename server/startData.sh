export PYTHONPATH=`pwd`
echo $PYTHONPATH
python main/wKCProducer.py &
python main/wKCConsumer.py &
python main/wKCConsumer.py &
python main/wKCConsumer.py &
python main/mTaskData.py &
python main/mTaskOpen.py &
python main/mOPS.py &
