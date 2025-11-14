# Deployment Checklist

Follow this checklist to deploy Market Agent to GitHub Pages.

## Prerequisites

- [ ] GitHub account created
- [ ] Git installed locally
- [ ] Repository created on GitHub

## Initial Setup

### 1. Repository Configuration

- [ ] Update `frontend/vite.config.ts` with your repo name:
  ```typescript
  base: '/YOUR-REPO-NAME/',  // e.g., '/market-agent/'
  ```

- [ ] Update `package.json` with your details:
  - `repository.url`
  - `bugs.url`
  - `homepage`
  - `author`

### 2. Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Market Agent dashboard"

# Add remote (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/market-agent.git

# Push to master
git push -u origin master
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** > **Pages**
3. Under **Source**, select: **GitHub Actions**
4. Click **Save**

### 4. Configure GitHub Actions Permissions

1. Go to **Settings** > **Actions** > **General**
2. Under **Workflow permissions**:
   - Select "**Read and write permissions**"
   - Enable "**Allow GitHub Actions to create and approve pull requests**"
3. Click **Save**

### 5. Trigger First Deployment

```bash
# Trigger deployment workflow manually or push a change
git commit --allow-empty -m "Trigger deployment"
git push
```

## Verify Deployment

- [ ] Check **Actions** tab for workflow status
- [ ] Both workflows should complete successfully:
  - ✅ Fetch Market Data
  - ✅ Deploy to GitHub Pages
  
- [ ] Visit your site: `https://YOUR_USERNAME.github.io/YOUR-REPO-NAME/`

## Post-Deployment

### Test Functionality

- [ ] Dashboard page loads
- [ ] Can select different stocks
- [ ] Charts render correctly
- [ ] Metrics display properly
- [ ] Portfolio page works
- [ ] Can add/delete holdings
- [ ] About page displays

### Configure Automation

The data fetcher workflow is set to run every 6 hours:
- 00:00 UTC
- 06:00 UTC
- 12:00 UTC
- 18:00 UTC

To adjust schedule, edit `.github/workflows/fetch_market_data.yml`:

```yaml
on:
  schedule:
    - cron: '0 */6 * * *'  # Change this line
```

## Custom Domain (Optional)

### Add Custom Domain

1. Go to **Settings** > **Pages**
2. Under **Custom domain**, enter your domain
3. Click **Save**
4. Add DNS records at your domain provider:
   ```
   Type: CNAME
   Name: www (or @)
   Value: YOUR_USERNAME.github.io
   ```

5. Wait for DNS propagation (can take up to 24 hours)

6. Enable **Enforce HTTPS** once DNS is configured

## Troubleshooting

### Deployment Failed

**Check Actions logs:**
1. Go to **Actions** tab
2. Click on failed workflow
3. Review error messages

**Common issues:**
- Missing permissions → Check step 4 above
- Build errors → Test build locally: `cd frontend && npm run build`
- Data files missing → Run `python scripts/fetch_data.py` first

### Site Not Loading

**Check these:**
- [ ] Correct `base` in `vite.config.ts`
- [ ] GitHub Pages enabled with "GitHub Actions" source
- [ ] Wait 2-3 minutes after deployment completes
- [ ] Clear browser cache and try again

### Charts Not Displaying

**Common causes:**
- Data files not copied to build
- Check `.github/workflows/deploy.yml` includes data copy step
- Verify JSON files exist in repository

### 404 on Navigation

**Fix:**
Add a `404.html` redirect (GitHub Pages SPA workaround):

1. Create `frontend/public/404.html`:
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <meta charset="utf-8">
     <script>
       sessionStorage.redirect = location.href;
     </script>
     <meta http-equiv="refresh" content="0;URL='/market-agent'"></meta>
   </head>
   </html>
   ```

2. Update `frontend/public/index.html` to handle redirect

## Updating Content

### Update Stock List

1. Edit `config/stocks.json`
2. Commit and push:
   ```bash
   git add config/stocks.json
   git commit -m "Update stock list"
   git push
   ```
3. Wait for workflow to fetch new data

### Update Frontend

1. Make changes in `frontend/src/`
2. Test locally: `npm run dev`
3. Commit and push
4. Deployment happens automatically

### Manual Data Refresh

Trigger data fetch manually:
1. Go to **Actions** tab
2. Select "Fetch Market Data" workflow
3. Click **Run workflow** > **Run workflow**

## Monitoring

### Check Data Freshness

View last update time in any stock summary:
```json
{
  "last_updated": "2025-11-13T10:30:00.000000"
}
```

### Monitor Workflow Runs

Set up notifications:
1. Go to **Settings** > **Notifications**
2. Enable notifications for workflow failures

## Security

### Environment Variables

If you add API keys in the future:

1. Go to **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret**
3. Add secret name and value
4. Reference in workflow: `${{ secrets.SECRET_NAME }}`

**Never commit secrets to repository!**

## Maintenance

### Weekly

- [ ] Check that workflows are running successfully
- [ ] Verify data is updating (check `last_updated` field)
- [ ] Review GitHub Actions usage (free tier: 2000 minutes/month)

### Monthly

- [ ] Update dependencies:
  ```bash
  pip list --outdated
  cd frontend && npm outdated
  ```
- [ ] Review and update `config/thresholds.json` based on performance
- [ ] Check for yfinance library updates

## Rollback

If deployment breaks:

```bash
# Revert to previous commit
git revert HEAD
git push

# Or reset to specific commit
git reset --hard COMMIT_HASH
git push --force
```

## Support

Need help? Check:
- [ ] [README.md](README.md) - Full documentation
- [ ] [QUICKSTART.md](QUICKSTART.md) - Local setup
- [ ] GitHub Issues - Report bugs
- [ ] GitHub Actions logs - Debug deployments

---

**Deployment Complete! 🚀**

Your Market Agent dashboard is now live!
