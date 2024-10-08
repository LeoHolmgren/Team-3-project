#!/bin/bash -e

OLDDIR=$(pwd)
ROOTDIR=$(cd "$( dirname "$0" )"/../ && pwd)

# Install aggregator environment
echo Setting up aggregator environment...
cd $ROOTDIR/aggregator
virtualenv .venv
echo Installing aggregator dependencies...
.venv/bin/pip3 install -r ./requirements.txt

# Install API environment
echo Setting up API environment...
cd $ROOTDIR/api
virtualenv .venv
echo Installing API dependencies...
.venv/bin/pip3 install -r ./requirements.txt

# Install app npm dependecies
echo Installing app dependencies... 
cd $ROOTDIR/app
npm install

cd $OLDDIR