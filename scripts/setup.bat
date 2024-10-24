@echo off

set OLDDIR=%CD%

:: Setup configuration file
echo Setting up configuration file...
echo No|copy /-Y %~dp0\TEMPLATE.env %~dp0..\config.env

:: Install aggregator environment
echo Setting up aggregator environment...
cd %~dp0..\aggregator
python -m venv .venv
echo Installing aggregator dependencies...
.\.venv\Scripts\pip3.exe install -r ./requirements.txt

:: Install API environment
echo Setting up API environment...
cd %~dp0..\api
python -m venv .venv
echo Installing API dependencies...
.\.venv\Scripts\pip3.exe install -r ./requirements.txt

:: Install test environment
echo Setting up the testing environment...
cd %~dp0..\tests
python -m venv .venv
echo Installing test dependencies...
.\.venv\Scripts\pip3.exe install -r ./requirements.txt

:: Install app npm dependecies
echo Installing app dependencies... 
cd %~dp0..\app
npm install

cd %OLDDIR%


