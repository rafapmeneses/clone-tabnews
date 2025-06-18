const { exec } = require("node:child_process");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    } else {
      process.stdout.write(
        error ? `\n🔴 Erro ao verificar Postgres: ${error}` : "\n",
      );
    }

    console.log("\n🟢 Postgres está pronto e aceitando conexões!\n");
  }
}

process.stdout.write("\n🟡 Aguardando Postgres aceitar conexões");
checkPostgres();
