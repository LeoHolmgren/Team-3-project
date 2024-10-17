#!/bin/bash -e

OLDDIR=$(pwd)
ROOTDIR=$(cd "$( dirname "$0" )"/../ && pwd)

set -a
source $ROOTDIR/config.env
set +a

cd $OLDDIR
