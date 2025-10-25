import { resolve } from "node:path";
import database from "infra/database.js";
import migrationRunner from "node-pg-migrate";
import { MigratorError } from "infra/errors";

const defaultMigrationOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  log: () => {},
  migrationsTable: "pgmigrations",
};

async function listPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewclient();
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
    });
    return pendingMigrations;
  } catch (error) {
    const publicErrorObject = new MigratorError({
      statusCode: error.statusCode,
      cause: error,
    });
    console.error(publicErrorObject);
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewclient();
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
      dbClient,
    });
    return migratedMigrations;
  } catch (error) {
    const publicErrorObject = new MigratorError({
      statusCode: error.statusCode,
      cause: error,
    });
    console.error(publicErrorObject);
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
