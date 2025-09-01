#!/usr/bin/env node
/**
 * Smart City Platform - GitHub Upload Helper
 * 
 * This script provides multiple ways to upload your project to GitHub
 * without manual file-by-file uploads.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class GitHubUploader {
    constructor() {
        this.projectRoot = path.join(__dirname);
        this.uploadDir = path.join(require('os').homedir(), 'Desktop', 'smart-city-platform-upload');
    }

    showOptions() {
        console.log('\n🚀 Smart City Platform - GitHub Upload Options');
        console.log('=============================================');
        console.log('');
        console.log('1. 📥 GitHub Desktop (Easiest - Recommended)');
        console.log('2. 📦 Create Clean ZIP Package');
        console.log('3. 🔧 Install Git CLI');
        console.log('4. ❌ Exit');
        console.log('');
    }

    async createCleanPackage() {
        console.log('📦 Creating clean upload package...');
        
        // Ensure upload directory exists
        if (fs.existsSync(this.uploadDir)) {
            fs.rmSync(this.uploadDir, { recursive: true, force: true });
        }
        fs.mkdirSync(this.uploadDir, { recursive: true });

        const exclude = ['node_modules', 'build', '.wrangler', '.git', '.DS_Store', '*.log'];
        
        // Copy directories
        const dirsToCopy = ['api', 'frontend', 'alert-processor'];
        dirsToCopy.forEach(dir => {
            const srcPath = path.join(this.projectRoot, dir);
            const destPath = path.join(this.uploadDir, dir);
            
            if (fs.existsSync(srcPath)) {
                this.copyDirectory(srcPath, destPath, exclude);
            }
        });

        // Copy root files
        const filesToCopy = [
            'README.md',
            'DEPLOYMENT_GUIDE.md', 
            'GITHUB_SETUP.md',
            '.gitignore'
        ];

        filesToCopy.forEach(file => {
            const srcPath = path.join(this.projectRoot, file);
            const destPath = path.join(this.uploadDir, file);
            
            if (fs.existsSync(srcPath)) {
                fs.copyFileSync(srcPath, destPath);
            }
        });

        console.log(`✅ Upload package created at: ${this.uploadDir}`);
        console.log('');
        console.log('Next steps:');
        console.log('1. Go to https://github.com/new');
        console.log('2. Create repository "smart-city-platform"');
        console.log('3. Drag the entire folder contents to GitHub');
        console.log('');
    }

    copyDirectory(src, dest, exclude) {
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

            if (fs.statSync(srcPath).isDirectory()) {
                this.copyDirectory(srcPath, destPath, exclude);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        });
    }

    openGitHubDesktop() {
        console.log('📥 GitHub Desktop - The Perfect Solution!');
        console.log('');
        console.log('GitHub Desktop handles everything automatically:');
        console.log('• No command line needed');
        console.log('• Drag & drop interface');
        console.log('• Automatic authentication');
        console.log('• Built-in Git functionality');
        console.log('');
        console.log('Steps:');
        console.log('1. Download: https://desktop.github.com/');
        console.log('2. Install and sign in');
        console.log('3. Click "Add" → "Add existing repository"');
        console.log(`4. Select: ${this.projectRoot}`);
        console.log('5. Click "Publish repository"');
        console.log('');
    }

    installGit() {
        console.log('🔧 Installing Git CLI...');
        console.log('');
        console.log('For Windows:');
        console.log('1. Download: https://git-scm.com/download/win');
        console.log('2. Run installer with default settings');
        console.log('3. Restart this terminal');
        console.log('4. Run: git --version (to verify installation)');
        console.log('');
    }

    async run() {
        console.log('🎯 Smart City Platform - Automated GitHub Upload');
        console.log('');
        
        // Check if Git is available
        try {
            execSync('git --version', { stdio: 'pipe' });
            console.log('✅ Git CLI is available!');
            console.log('');
            console.log('You can now use Git commands:');
            console.log('cd ' + this.projectRoot);
            console.log('git init');
            console.log('git add .');
            console.log('git commit -m "Initial commit: Smart City Platform"');
            console.log('git remote add origin [your-repo-url]');
            console.log('git push -u origin main');
            console.log('');
            return;
        } catch (error) {
            console.log('❌ Git CLI not available');
        }

        this.showOptions();
        
        // For Node.js environment, create package automatically
        console.log('Creating automated upload package...');
        await this.createCleanPackage();
        
        console.log('🚀 Ready to upload!');
        console.log('');
        console.log('Best option: GitHub Desktop');
        console.log('Download: https://desktop.github.com/');
        console.log('');
    }
}

// Run the uploader
const uploader = new GitHubUploader();
uploader.run().catch(console.error);