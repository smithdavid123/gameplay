import sys

# Expand Python classes path with your app's path
# sys.path.insert(0, "c:/Users/Administrator.xunying2/workspace/yaanWebDemo/main")
sys.path.insert(0, "C:/source/server/game")
sys.path.insert(0, "C:/source/server/game/main")

# sys.path.insert(0, sys.path[0])

from app import app

# Put logging code (and imports) here ...

# Initialize WSGI app object
application = app