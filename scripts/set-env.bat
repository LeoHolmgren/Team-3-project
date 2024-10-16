@echo off

set OLDDIR=%CD%

:: Change to root directory
cd %~dp0..\
for /F "eol=# tokens=1* delims==" %%i in (config.env) do set %%i=%%j

cd %OLDDIR%