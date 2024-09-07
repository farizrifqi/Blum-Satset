@echo off

REM Check if npm is installed and in the PATH
where npm >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo npm is not installed or not in the PATH.
    exit /b 1
)
REM Check if bun is installed and in the PATH
where bun >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo bun is not installed or not in the PATH.
    powershell -c "irm bun.sh/install.ps1 | iex"
)
REM Check if node_modules folder exists
IF EXIST "node_modules" (
    echo node_modules directory exists.

    @REM REM Check if dependencies are up-to-date
    @REM npm ls --depth=0 >nul 2>&1
    @REM IF %ERRORLEVEL% EQU 0 (
    @REM     echo Dependencies are already installed and up-to-date.
    @REM ) ELSE (
    @REM     echo Dependencies are outdated or missing. Running npm install...
    @REM     npm install
    @REM )
) ELSE (
    echo node_modules directory does not exist. Running npm install...
    npm install
)
REM running...
bun run index.ts