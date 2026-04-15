const fs = require("fs");
const path = require("path");

const root = process.cwd();
const rulesDir = path.join(root, "AI_RULES");
const githubDir = path.join(root, ".github");
const instructionsDir = path.join(githubDir, "instructions");
const metadataPath = path.join(root, ".repo-ai.json");

const supportedProfiles = ["enterprise-default", "frontend", "backend", "fullstack", "docs-heavy", "microservice"];

const profileDefinitions = {
  "enterprise-default": { pathRules: ["frontend", "backend", "docs"] },
  frontend: { pathRules: ["frontend", "docs"] },
  backend: { pathRules: ["backend", "docs"] },
  fullstack: { pathRules: ["frontend", "backend", "docs"] },
  "docs-heavy": { pathRules: ["docs"] },
  microservice: { pathRules: ["backend", "docs"] }
};

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function requireFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`Missing required rules file: ${path.relative(root, filePath)}`);
    process.exit(1);
  }
  return fs.readFileSync(filePath, "utf8").trimEnd();
}

function section(title, content) {
  return `## ${title}\n\n${content.trimEnd()}\n`;
}

function profileFromArgsOrMetadata() {
  const args = process.argv.slice(2);
  let profile;
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === "--profile") profile = args[i + 1];
  }

  if (!profile && fs.existsSync(metadataPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
      profile = data.profile;
    } catch {
      profile = undefined;
    }
  }

  profile = profile || "enterprise-default";
  if (!supportedProfiles.includes(profile)) {
    console.error(`Invalid profile: ${profile}`);
    process.exit(1);
  }
  return profile;
}

const profile = profileFromArgsOrMetadata();
const profileDef = profileDefinitions[profile];

const files = {
  copilot: path.join(rulesDir, "copilot-core.md"),
  claude: path.join(rulesDir, "claude-core.md"),
  frontend: path.join(rulesDir, "frontend.md"),
  backend: path.join(rulesDir, "backend.md"),
  docs: path.join(rulesDir, "docs.md")
};

const copilot = requireFile(files.copilot);
const claude = requireFile(files.claude);
const frontend = requireFile(files.frontend);
const backend = requireFile(files.backend);
const docs = requireFile(files.docs);
const claudeGovernance = requireFile(path.join(rulesDir, "claude-governance.md"));

ensureDir(githubDir);
ensureDir(instructionsDir);

const claudeOut = [
  "# Claude Project Instructions",
  "",
  "Generated from AI_RULES.",
  "",
  section("Claude Core", claude),
  section("Claude Governance Directive", claudeGovernance)
].join("\n");

const agentsOut = [
  "# Agent Instructions",
  "",
  "Generated from AI_RULES.",
  "",
  "All coding agents in this repository must operate under the enterprise governance directive.",
  "",
  section("Governance Directive", claudeGovernance)
].join("\n");

const copilotOut = [
  "# Copilot Repository Instructions",
  "",
  "Generated from AI_RULES.",
  "",
  section("Copilot Core", copilot)
].join("\n");

fs.writeFileSync(path.join(root, "CLAUDE.md"), `${claudeOut}\n`, "utf8");
fs.writeFileSync(path.join(root, "AGENTS.md"), `${agentsOut}\n`, "utf8");
fs.writeFileSync(path.join(githubDir, "copilot-instructions.md"), `${copilotOut}\n`, "utf8");

if (profileDef.pathRules.includes("frontend")) {
  const frontendOut = [
    "# Frontend Instructions",
    "",
    `Generated from AI_RULES (profile: ${profile}).`,
    "",
    section("Copilot Core", copilot),
    section("Frontend Rules", frontend)
  ].join("\n");
  fs.writeFileSync(path.join(instructionsDir, "frontend.instructions.md"), `${frontendOut}\n`, "utf8");
}

if (profileDef.pathRules.includes("backend")) {
  const backendOut = [
    "# Backend Instructions",
    "",
    `Generated from AI_RULES (profile: ${profile}).`,
    "",
    section("Copilot Core", copilot),
    section("Backend Rules", backend)
  ].join("\n");
  fs.writeFileSync(path.join(instructionsDir, "backend.instructions.md"), `${backendOut}\n`, "utf8");
}

if (profileDef.pathRules.includes("docs")) {
  const docsOut = [
    "# Documentation Instructions",
    "",
    `Generated from AI_RULES (profile: ${profile}).`,
    "",
    section("Copilot Core", copilot),
    section("Documentation Rules", docs)
  ].join("\n");
  fs.writeFileSync(path.join(instructionsDir, "docs.instructions.md"), `${docsOut}\n`, "utf8");
}

const metadata = {
  templateVersion: "1.2.0",
  profile,
  pathRules: true
};
fs.writeFileSync(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`, "utf8");

console.log("AI rules synced successfully from AI_RULES");
