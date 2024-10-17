@echo off

:: Go to app directory
set OLDDIR=%CD%
cd %~dp0..\app
call %~dp0\set-env
npm run dev
cd %OLDDIR%
