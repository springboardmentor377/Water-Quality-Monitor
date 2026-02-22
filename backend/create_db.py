import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.core.database import Base, engine
from backend.models import *

def run():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    run()
