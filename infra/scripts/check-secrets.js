const fs = require("fs");
const { execSync } = require("child_process");

const blacklist = ["API_KEY", "SECRET", "TOKEN", "PASSWORD", "PRIVATE_KEY"];

const ignoredFiles = ["infra/scripts/check-secrets.js"];

const stagedFiles = execSync("git diff --cached --name-only", {
  encoding: "utf-8",
})
  .split("\n")
  .filter(
    (file) =>
      file &&
      fs.existsSync(file) &&
      !file.includes("node_modules") &&
      !ignoredFiles.includes(file),
  );

let hasSecret = false;

for (const file of stagedFiles) {
  const content = fs.readFileSync(file, "utf8");
  for (const keyword of blacklist) {
    const regex = new RegExp(`${keyword}\\s*=\\s*['"\`]?.+['"\`]?`, "i");
    if (regex.test(content)) {
      console.error(
        `🚨 Atenção: variável sensível "${keyword}" detectada no arquivo ${file}`,
      );
      hasSecret = true;
    }
  }
}

if (hasSecret) {
  console.error("\n❌ Commit cancelado para proteger variáveis sensíveis.");
  process.exit(1);
} else {
  process.exit(0);
}
