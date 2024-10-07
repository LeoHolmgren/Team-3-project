@echo off

:: Go to app directory
set OLDDIR=%CD%
cd %~dp0..\app
npm run dev
cd %OLDDIR%
