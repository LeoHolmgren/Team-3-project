@echo off
cd %~dp0..\

:: Install aggregator environment
echo Setting up aggregator environment...
cd ./aggregator
py -3 -m venv .venv
echo Installing aggregator dependencies...
.\.venv\Scripts\pip3.exe install -r ./requirements.txt
cd ..

:: Install API environment
echo Setting up API environment...
cd ./api
py -3 -m venv .venv
echo Installing API dependencies...
.\.venv\Scripts\pip3.exe install -r ./requirements.txt
cd ..

:: Install app npm dependecies
echo Installing app dependencies... 
cd ./app
npm install
cd ..
