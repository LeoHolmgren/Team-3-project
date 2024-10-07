#!/bin/bash -e

# Long procedure to get the proper location of the running script.
# Most other alternatives such as using $0 will yield the incorrect
# result depending upon how the script is executed.
#
# This is not portable to most operating systems that don't use
# bash/GNU. If you use something other than that then remove this
# section and make sure you are calling the script from the root
# directory of the git repository.
#
# Code snippet taken from: https://stackoverflow.com/a/179231
pushd . > '/dev/null';
SCRIPT_PATH="${BASH_SOURCE[0]:-$0}";

while [ -h "$SCRIPT_PATH" ];
do
    cd "$( dirname -- "$SCRIPT_PATH"; )";
    SCRIPT_PATH="$( readlink -f -- "$SCRIPT_PATH"; )";
done

cd "$( dirname -- "$SCRIPT_PATH"; )" > '/dev/null';
SCRIPT_PATH="$( pwd; )";
popd  > '/dev/null';

cd $SCRIPT_PATH

#############################################################

# If file does not exist
if [ ! -f ./.DATABASE_URL_SECRET_DO_NOT_SHARE ]; then
	[ -z $1 ] && echo "[ERROR] Provide the database url as the first argument" && exit 1
fi

# Allow it to be overwritten if a new token is provided
[ -z $1 ] || echo $1 > ./.DATABASE_URL_SECRET_DO_NOT_SHARE

echo "Setting up aggregator environment"
cd ./aggregator
python3 -m venv venv
./venv/bin/pip3 install -r ./requirements.txt
cd ..

echo "Setting up API environment"
cd ./api
python3 -m venv venv
./venv/bin/pip3 install -r ./requirements.txt
cd ..

echo "Installing NPM dependencies"
cd ./app
npm install
cd ..

echo "Setup complete"
