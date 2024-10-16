#!/bin/bash -e

OLDDIR=$(pwd)
ROOTDIR=$(cd "$( dirname "$0" )"/../ && pwd)

# Go to app directory
cd $ROOTDIR/app
yes | \cp -rf $ROOTDIR/config.env $ROOTDIR/app/.env.local
npm run dev
cd $OLDDIR
