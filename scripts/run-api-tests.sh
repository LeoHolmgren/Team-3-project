#!/bin/bash -e

OLDDIR=$(pwd)
ROOTDIR=$(cd "$( dirname "$0" )"/../ && pwd)

# Go to api directory
cd $ROOTDIR/tests

# Run API
source .venv/bin/activate
set -a
source $ROOTDIR/config.env
set +a
export PYTHONPATH=$ROOTDIR
python3 ./test-api.py
deactivate
cd $OLDDIR
