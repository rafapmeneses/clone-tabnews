// "dev": "npm run services:up && npm run services:wait:database && npm run migrations:up && next dev",
const { spawn } = require("child_process");

const run = (script) =>
  new Promise((resolve, reject) => {
    const proc = spawn("npm", ["run", script], {
      stdio: "inherit",
      shell: true,
    });

    proc.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`Erro em: ${script}`)),
    );
  });

let cleanupCalled = false;

const cleanup = async () => {
  if (cleanupCalled) return;
  cleanupCalled = true;

  console.log("\nFinalizando serviços...");
  await run("postdev");
  process.exit();
};

const start = async () => {
  try {
    await run("services:up");
    await run("services:wait:database");
    await run("migrations:up");

    const dev = spawn("npx", ["next", "dev"], {
      stdio: "inherit",
      shell: true,
    });

    process.on("SIGINT", () => {
      console.log("\nCtrl+C detectado.");
      dev.kill("SIGINT");
    });

    process.on("SIGTERM", () => dev.kill("SIGTERM"));
    dev.on("exit", cleanup);
  } catch (err) {
    console.error(err.message);
    await cleanup();
  }
};

start();
