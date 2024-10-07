:: Install the venv virtual environment
@echo off

echo Setting up aggregator environment...
cd ./aggregator
py -3 -m venv .venv
echo Installing aggregator dependencies...
.\.venv\Scripts\pip3.exe install -r ./requirements.txt
cd ..

echo Setting up API environment...
cd ./api
py -3 -m venv .venv
echo Installing API dependencies...
.\.venv\Scripts\pip3.exe install -r ./requirements.txt
cd ..

echo Installing app dependencies... 
cd ./app
npm install
cd ..
