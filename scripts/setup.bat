@echo off

set OLDDIR=%CD%

:: Install aggregator environment
echo Setting up aggregator environment...
cd %~dp0..\aggregator
py -3 -m venv .venv
echo Installing aggregator dependencies...
.\.venv\Scripts\pip3.exe install -r ./requirements.txt

:: Install API environment
echo Setting up API environment...
cd %~dp0..\api
py -3 -m venv .venv
echo Installing API dependencies...
.\.venv\Scripts\pip3.exe install -r ./requirements.txt

:: Install app npm dependecies
echo Installing app dependencies... 
cd %~dp0..\app
npm install

cd %OLDDIR%
