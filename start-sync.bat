@echo off
set PORT=8787
if "%SYNC_TOKEN%"=="" set SYNC_TOKEN=change-this-password
node server.js
