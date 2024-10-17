#!/bin/bash -e

OLDDIR=$(pwd)
ROOTDIR=$(cd "$( dirname "$0" )"/../ && pwd)

# Go to aggregator directory
cd $ROOTDIR/aggregator

# Run aggregator
source .venv/bin/activate
source $ROOTDIR/scripts/set-env.sh
export PYTHONPATH=$ROOTDIR
python3 api.py
deactivate
cd $OLDDIR
