#!/bin/bash -e

OLDDIR=$(pwd)
ROOTDIR=$(cd "$( dirname "$0" )"/../ && pwd)

# Go to app directory
cd $ROOTDIR/app
source $ROOTDIR/scripts/set-env.sh
npm run dev
cd $OLDDIR
