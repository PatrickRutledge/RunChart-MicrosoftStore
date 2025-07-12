# Working with Multiple Git Remotes

This repository is now configured with multiple Git remotes for learning and backup purposes.

## Current Remote Configuration

- **origin** → GitHub: https://github.com/PatrickRutledge/RunChart-MicrosoftStore.git
- **gitlab** → GitLab: https://gitlab.com/PatrickRutledge/RunChart-MicrosoftStore.git

## Common Commands

### Check Remote Configuration
```bash
git remote -v
```

### Push to Specific Remote
```bash
# Push to GitHub (default)
git push origin main

# Push to GitLab
git push gitlab main

# Push to both remotes
git push origin main && git push gitlab main
```

### Pull from Specific Remote
```bash
# Pull from GitHub (default)
git pull origin main

# Pull from GitLab
git pull gitlab main
```

### Fetch from All Remotes
```bash
git fetch --all
```

## Branch Tracking

- The `main` branch is configured to track `origin/main` (GitHub) by default
- Regular `git push` and `git pull` commands will work with GitHub
- To push to GitLab, explicitly use: `git push gitlab main`

## Best Practices

1. **Primary Development**: Use GitHub (`origin`) as your primary remote
2. **Backup**: Use GitLab (`gitlab`) as a backup/mirror
3. **Synchronization**: Keep both remotes in sync by pushing to both after commits
4. **Clear Naming**: Use descriptive remote names (`origin`, `gitlab`, `upstream`, etc.)

## Workflow Example

```bash
# Make changes and commit
git add .
git commit -m "Your commit message"

# Push to primary remote (GitHub)
git push origin main

# Also push to backup remote (GitLab)
git push gitlab main
```

## Repository Links

- **GitHub**: https://github.com/PatrickRutledge/RunChart-MicrosoftStore
- **GitLab**: https://gitlab.com/PatrickRutledge/RunChart-MicrosoftStore

## Notes

- Both repositories contain the complete RunChart Microsoft Store project
- This setup provides redundancy and learning opportunities with different Git hosting platforms
- The project structure and build process remain identical on both platforms
