#!/usr/bin/env node

/**
 * Deployment Update Script - Windows Compatible
 * Deploys Assessment Management System to NFSN
 *
 * Usage from frontend directory:
 *   npm run deploy              - Build + deploy everything
 *   npm run deploy:quick        - Deploy without rebuilding
 *   npm run deploy:backend      - Deploy backend only
 *   npm run deploy:frontend     - Deploy frontend only
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// NFSN Configuration
const NFSN_USER = "jvc_assessmentmanager";
const NFSN_HOST = "ssh.nyc1.nearlyfreespeech.net";
const NFSN_SERVER = `${NFSN_USER}@${NFSN_HOST}`;
const REMOTE_PATH = "/home/public";

// Parse arguments
const args = process.argv.slice(2);
const skipBuild = args.includes("--skip-build");
const backendOnly = args.includes("--backend-only");
const frontendOnly = args.includes("--frontend-only");

// Terminal colors
const c = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
};

function log(msg, color = c.cyan) {
  console.log(`${color}${msg}${c.reset}`);
}

function run(cmd, desc) {
  try {
    log(`\n[${desc}]`, c.yellow);
    console.log(`$ ${cmd}`);
    execSync(cmd, { stdio: "inherit" });
    log(`✓ ${desc} completed`, c.green);
    return true;
  } catch (err) {
    log(`✗ ${desc} failed`, c.red);
    return false;
  }
}

// Main deployment function
function deploy() {
  log("\n╔═══════════════════════════════════════════════╗", c.bright);
  log("║   Assessment Manager - Update Deployment     ║", c.bright);
  log("╚═══════════════════════════════════════════════╝", c.bright);

  const startTime = Date.now();

  // Ensure we're in project root
  const projectRoot = path.resolve(__dirname);
  process.chdir(projectRoot);
  log(`\n📁 Working from: ${projectRoot}`, c.cyan);

  // Step 1: Build frontend
  if (!backendOnly && !skipBuild) {
    log("\n📦 Building Frontend...", c.cyan);
    if (!run("cd frontend && npm run build", "Frontend Build")) {
      process.exit(1);
    }
  } else if (skipBuild) {
    log("\n⚡ Skipping build (using existing)", c.yellow);
  }

  // Step 2: Deploy backend
  if (!frontendOnly) {
    log("\n🚀 Deploying Backend...", c.cyan);

    // Use SCP to upload backend
    const backendSrc = path.join(projectRoot, "backend");
    if (!fs.existsSync(backendSrc)) {
      log("✗ Backend directory not found!", c.red);
      process.exit(1);
    }

    const cmd = `scp -r "${backendSrc}\\config" "${backendSrc}\\controllers" "${backendSrc}\\middleware" "${backendSrc}\\migrations" "${backendSrc}\\public" "${backendSrc}\\.env" "${backendSrc}\\composer.json" ${NFSN_SERVER}:/home/public/api/`;

    if (!run(cmd, "Backend Upload")) {
      log("\n💡 Make sure you can SSH to the server first:", c.yellow);
      log(`   ssh ${NFSN_SERVER}`, c.cyan);
      process.exit(1);
    }

    // Fix backend permissions
    log("\n🔧 Setting backend permissions...", c.cyan);
    run(
      `ssh ${NFSN_SERVER} "chmod 755 /home/public/api /home/public/api/config /home/public/api/controllers /home/public/api/middleware /home/public/api/migrations /home/public/api/public && chmod 644 /home/public/api/config/*.php /home/public/api/controllers/*.php /home/public/api/middleware/*.php /home/public/api/migrations/*.sql /home/public/api/public/index.php /home/public/api/.env"`,
      "Fix Backend Permissions"
    );

    // Create .htaccess files for PHP execution (NFSN requires PHP 8.3)
    log("\n🔧 Configuring PHP execution...", c.cyan);
    run(
      `ssh ${NFSN_SERVER} "echo 'AddType application/x-httpd-php .php' > /home/public/api/.htaccess && echo 'AddType application/x-httpd-php .php' > /home/public/api/public/.htaccess && chmod 644 /home/public/api/.htaccess /home/public/api/public/.htaccess"`,
      "Configure PHP"
    );
  }

  // Step 3: Deploy frontend
  if (!backendOnly) {
    log("\n🌐 Deploying Frontend...", c.cyan);

    const buildPath = path.join(projectRoot, "frontend", "build");
    if (!fs.existsSync(buildPath)) {
      log("✗ Frontend build not found! Run: npm run build", c.red);
      process.exit(1);
    }

    // Upload root files (index.html, manifest.json, etc.)
    const rootFiles = ["index.html", "manifest.json", "asset-manifest.json"]
      .map((f) => path.join(buildPath, f))
      .filter((f) => fs.existsSync(f));
    if (rootFiles.length > 0) {
      const filesStr = rootFiles.map((f) => `"${f}"`).join(" ");
      run(`scp ${filesStr} ${NFSN_SERVER}:/home/public/`, "Upload Root Files");
    }

    // Upload static folder (critical for CSS/JS)
    const staticPath = path.join(buildPath, "static");
    if (fs.existsSync(staticPath)) {
      run(
        `scp -r "${staticPath}" ${NFSN_SERVER}:/home/public/`,
        "Upload Static Folder"
      );
    }

    // Upload .htaccess
    const htaccess = path.join(projectRoot, ".htaccess");
    if (fs.existsSync(htaccess)) {
      run(`scp "${htaccess}" ${NFSN_SERVER}:/home/public/`, "Upload .htaccess");
    }

    // Fix permissions on server
    log("\n🔧 Setting correct permissions...", c.cyan);
    run(
      `ssh ${NFSN_SERVER} "chmod 755 /home/public; chmod 644 /home/public/*.html /home/public/*.json; chmod 755 /home/public/static /home/public/static/css /home/public/static/js; chmod 644 /home/public/static/css/* /home/public/static/js/*"`,
      "Fix Permissions"
    );
  }

  // Done!
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  log("\n╔═══════════════════════════════════════════════╗", c.green);
  log(`║   ✓ Deployment Complete! (${duration}s)           ║`, c.green);
  log("╚═══════════════════════════════════════════════╝", c.green);

  log("\n🧪 Test your deployment:", c.cyan);
  log("  https://assessmentmanager.nfshost.com", c.bright);

  log("\n💡 Commands:", c.cyan);
  log("  npm run deploy        - Full deployment with build", c.yellow);
  log("  npm run deploy:quick  - Fast deploy (no rebuild)", c.yellow);
  log("  npm run deploy:backend - Backend only", c.yellow);
  log("  npm run deploy:frontend - Frontend only", c.yellow);
}

// Run it
try {
  deploy();
} catch (err) {
  log(`\n✗ Deployment failed: ${err.message}`, c.red);
  console.error(err);
  process.exit(1);
}
