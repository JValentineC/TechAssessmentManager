# SSH Key Setup for Passwordless Deployment

## Why Set Up SSH Keys?

- **No more password prompts** - Deploy without entering password multiple times
- **Faster deployments** - Connection reuse makes subsequent operations instant
- **More secure** - SSH keys are more secure than passwords

## Setup Instructions

### 1. Check for Existing SSH Key

```powershell
# Check if you already have an SSH key
type $env:USERPROFILE\.ssh\id_ed25519.pub
```

**If the key exists and has a passphrase you don't remember:** Create a new key specifically for NFSN (recommended):

```powershell
# Generate a new key for NFSN without a passphrase
ssh-keygen -t ed25519 -C "jramirez@icstars.org" -f $env:USERPROFILE\.ssh\id_ed25519_nfsn -N '""'
```

**If you get "cannot find the file":** Generate a new key:

```powershell
# Generate a new SSH key
ssh-keygen -t ed25519 -C "jramirez@icstars.org"

# Press Enter to accept default location (~/.ssh/id_ed25519)
# Press Enter twice to skip passphrase (easier for deployment automation)
```

### 2. Copy Public Key to NFSN Server

```powershell
# If you created id_ed25519_nfsn:
type $env:USERPROFILE\.ssh\id_ed25519_nfsn.pub

# Copy the output, then add it to the server:
ssh jvc_assessmentmanager@ssh.nyc1.nearlyfreespeech.net

# Once connected, add your key to authorized_keys
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
# Paste your public key on a new line
# Save and exit (Ctrl+X, Y, Enter)
chmod 600 ~/.ssh/authorized_keys
exit
```

**Alternative one-liner:**

```powershell
# For id_ed25519_nfsn:
type $env:USERPROFILE\.ssh\id_ed25519_nfsn.pub | ssh jvc_assessmentmanager@ssh.nyc1.nearlyfreespeech.net "cat >> ~/.ssh/authorized_keys"

# Or for default id_ed25519:
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh jvc_assessmentmanager@ssh.nyc1.nearlyfreespeech.net "cat >> ~/.ssh/authorized_keys"
```

### 3. Create SSH Config File

Create or edit `C:\Users\YourUsername\.ssh\config`:

```
Host nfsn ssh.nyc1.nearlyfreespeech.net
    HostName ssh.nyc1.nearlyfreespeech.net
    User jvc_assessmentmanager
    IdentityFile ~/.ssh/id_ed25519_nfsn
    IdentitiesOnly yes
    ServerAliveInterval 60
    ServerAliveCountMax 3
    Compression yes
```

**Note:** If you're using the default `id_ed25519` key, change the `IdentityFile` line to:

```
    IdentityFile ~/.ssh/id_ed25519
```

### 4. Test Connection

```powershell
# This should connect without asking for a password (or only once on first connection)
ssh jvc_assessmentmanager@ssh.nyc1.nearlyfreespeech.net
```

**Note for Windows:** The first connection after setup may still prompt for a password once, but subsequent connections should be passwordless.

### 5. Optional: Create SSH Config for Easier Access

You've already created the config file in step 3! This lets you use just:

```powershell
ssh nfsn
```

Instead of the full connection string.

## Installing rsync for Faster Uploads

The vendor directory has thousands of files. Using rsync instead of scp is **10x faster**:

### Using Chocolatey:

```powershell
choco install rsync
```

### Using Scoop:

```powershell
scoop install rsync
```

## Benefits After Setup

✅ **No password prompts** during deployment  
✅ **Connection reuse** - much faster transfers  
✅ **With rsync**: Only changed files are uploaded  
✅ **More reliable** - better handling of network interruptions

## Troubleshooting

### "Permission denied (publickey)"

- Make sure your public key is correctly added to `~/.ssh/authorized_keys` on the server
- Check that `~/.ssh` has permissions 700 and `~/.ssh/authorized_keys` has permissions 600

### Still asking for password

- Ensure you're using the correct key: `ssh -i ~/.ssh/id_ed25519 user@host`
- Check SSH agent is running: `ssh-add -l`
- Add key to agent: `ssh-add ~/.ssh/id_ed25519`

### Connection timeout

- The improved deploy.ps1 script now includes connection persistence
- Connections stay alive for 10 minutes, reused automatically
