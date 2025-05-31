# GitHub Pages Setup Guide

Follow these steps to host your Company Data API on GitHub Pages:

## Step 1: Prepare Your Repository

1. Make sure all your files are committed to your local Git repository:
   ```bash
   git add .
   git commit -m "Initial commit"
   ```

## Step 2: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in to your account
2. Click on the "+" icon in the top right corner and select "New repository"
3. Name your repository (e.g., "company-data-api")
4. Choose "Public" visibility
5. Click "Create repository"

## Step 3: Push Your Code to GitHub

1. Connect your local repository to GitHub:
   ```bash
   git remote add origin https://github.com/yourusername/company-data-api.git
   git branch -M main
   git push -u origin main
   ```

## Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings"
3. Scroll down to the "GitHub Pages" section
4. Under "Source", select "main" branch
5. Click "Save"
6. Wait a few minutes for your site to be published

## Step 5: Access Your Website

Your website will be available at:
```
https://yourusername.github.io/company-data-api/
```

## Troubleshooting

- If your site doesn't appear, check the GitHub Pages section in Settings for any error messages
- Make sure your repository is public
- Verify that your index.html file is in the root directory
- Check that all file paths in your HTML, CSS, and JavaScript are correct

## Updating Your Website

After making changes to your code:
1. Commit the changes:
   ```bash
   git add .
   git commit -m "Update website"
   ```

2. Push to GitHub:
   ```bash
   git push origin main
   ```

3. GitHub Pages will automatically rebuild and deploy your site 