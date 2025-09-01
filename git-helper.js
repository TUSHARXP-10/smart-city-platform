#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectPath = 'c:\\Users\\tushar\\Desktop\\REvealxp\\smart-city-platform';
const repoUrl = 'https://github.com/TUSHARXP-10/smart-city-platform.git';

console.log('🚀 Smart City Platform - GitHub Push Helper');
console.log('==========================================');

function checkGit() {
  try {
    execSync('git --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

function main() {
  if (!checkGit()) {
    console.log('\n❌ Git is not installed or not in PATH');
    console.log('\n📥 To install Git:');
    console.log('1. Visit: https://git-scm.com/download/win');
    console.log('2. Download and install Git for Windows');
    console.log('3. Restart your terminal');
    console.log('4. Run this script again');
    
    console.log('\n📱 Alternative: Use GitHub Desktop');
    console.log('1. Download: https://desktop.github.com/');
    console.log('2. Add existing repository: ' + projectPath);
    console.log('3. Publish to GitHub');
    
    console.log('\n📋 Manual commands after installing Git:');
    console.log('cd "' + projectPath + '"');
    console.log('git init');
    console.log('git branch -M main');
    console.log('git add .');
    console.log('git commit -m "Initial commit: Smart City Platform"');
    console.log('git remote add origin ' + repoUrl);
    console.log('git push -u origin main');
    
    return;
  }

  console.log('\n✅ Git is installed!');
  console.log('\n📋 Commands to run:');
  console.log('cd "' + projectPath + '"');
  console.log('git init');
  console.log('git branch -M main');
  console.log('git add .');
  console.log('git commit -m "Initial commit: Smart City Platform with real-time alerts, threshold monitoring, and multi-service architecture"');
  console.log('git remote add origin ' + repoUrl);
  console.log('git push -u origin main');
  
  console.log('\n🔄 Would you like me to run these commands? (y/n)');
  
  // Create batch file for easy execution
  const batchContent = `@echo off
cd "${projectPath}"
git init
git branch -M main
git add .
git commit -m "Initial commit: Smart City Platform with real-time alerts, threshold monitoring, and multi-service architecture"
git remote add origin ${repoUrl}
git push -u origin main
pause`;
  
  fs.writeFileSync('RUN_GIT_COMMANDS.bat', batchContent);
  console.log('\n📁 Created RUN_GIT_COMMANDS.bat - double-click to execute!');
}

main();