@echo off

:: Go to app directory
set OLDDIR=%CD%
cd %~dp0..\app
<<<<<<< HEAD
=======
call %~dp0\set-env
>>>>>>> notification
npm run dev
cd %OLDDIR%
