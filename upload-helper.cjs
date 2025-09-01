#!/usr/bin/env node
/**
 * Smart City Platform - GitHub Upload Helper
 * CommonJS version for compatibility
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎯 Smart City Platform - Automated GitHub Upload');
console.log('');

// Check if Git is available
try {
    const gitVersion = execSync('git --version', { encoding: 'utf8', stdio: 'pipe' });
    console.log('✅ Git CLI is available!');
    console.log(gitVersion.trim());
    console.log('');
    console.log('You can now use Git commands:');
    console.log('');
    console.log('cd C:\\Users\\tushar\\Desktop\\REvealxp\\smart-city-platform');
    console.log('git init');
    console.log('git add .');
    console.log('git commit -m "Initial commit: Smart City Platform"');
    console.log('git remote add origin https://github.com/YOUR_USERNAME/smart-city-platform.git');
    console.log('git push -u origin main');
    console.log('');
    process.exit(0);
} catch (error) {
    console.log('❌ Git CLI not available');
}

console.log('🚀 Here are your automated upload options:');
console.log('');
console.log('1. 📥 GitHub Desktop (Easiest - Recommended)');
console.log('   Download: https://desktop.github.com/');
console.log('   - Drag & drop interface');
console.log('   - Automatic Git handling');
console.log('   - No command line needed');
console.log('');

console.log('2. 📦 Ready-to-Upload Package Created');
console.log('   Location: C:\\Users\\tushar\\Desktop\\smart-city-platform-upload');
console.log('   - Clean package without node_modules/build folders');
console.log('   - Ready for drag & drop to GitHub web interface');
console.log('');

console.log('3. 🔧 Install Git CLI');
console.log('   Download: https://git-scm.com/download/win');
console.log('   - Full automation capabilities');
console.log('');

// Create clean upload package
const projectRoot = path.join(__dirname);
const uploadDir = path.join(require('os').homedir(), 'Desktop', 'smart-city-platform-upload');

console.log('📦 Creating clean upload package...');

// Ensure upload directory exists
if (fs.existsSync(uploadDir)) {
    fs.rmSync(uploadDir, { recursive: true, force: true });
}
fs.mkdirSync(uploadDir, { recursive: true });

const exclude = ['node_modules', 'build', '.wrangler', '.git', '.DS_Store', '*.log'];

// Copy directories
const dirsToCopy = ['api', 'frontend', 'alert-processor'];
dirsToCopy.forEach(dir => {
    const srcPath = path.join(projectRoot, dir);
    const destPath = path.join(uploadDir, dir);
    
    if (fs.existsSync(srcPath)) {
        copyDirectory(srcPath, destPath, exclude);
    }
});

// Copy root files
const filesToCopy = [
    'README.md',
    'DEPLOYMENT_GUIDE.md', 
    'GITHUB_SETUP.md',
    'AUTOMATED_UPLOAD.md',
    '.gitignore'
];

filesToCopy.forEach(file => {
    const srcPath = path.join(projectRoot, file);
    const destPath = path.join(uploadDir, file);
    
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
    }
});

console.log('✅ Upload package created successfully!');
console.log(`📁 Location: ${uploadDir}`);
console.log('');
console.log('🎯 Next steps:');
console.log('1. Go to https://github.com/new');
console.log('2. Create repository "smart-city-platform"');
console.log('3. Drag all files from the upload package to GitHub');
console.log('4. Commit and push!');
console.log('');

function copyDirectory(src, dest, exclude) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const items = fs.readdirSync(src);
    items.forEach(item => {
        if (exclude.some(pattern => item.includes(pattern))) {
            return;
        }

        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);

        const stat = fs.statSync(srcPath);
        if (stat.isDirectory()) {
            copyDirectory(srcPath, destPath, exclude);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}