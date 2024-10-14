#!/bin/bash -e

OLDDIR=$(pwd)
ROOTDIR=$(cd "$( dirname "$0" )"/../ && pwd)

# Go to api directory
cd $ROOTDIR/api

# Run API
source .venv/bin/activate
export PYTHONPATH=$ROOTDIR
fastapi dev main.py
deactivate
cd $OLDDIR
