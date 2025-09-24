#!/usr/bin/env node

import { spawn } from "node:child_process";
import { playNotificationSound } from "./utils";

async function run(): Promise<number> {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Usage: tawn <command> [args...]");
    return 1;
  }

  const [command, ...commandArgs] = args as [string, ...string[]];

  const exitCode: number = await new Promise((resolve) => {
    const child = spawn(command, commandArgs, {
      stdio: "inherit",
      shell: process.platform === "win32",
      cwd: process.cwd(),
    });
    child.on("close", (code) => resolve(typeof code === "number" ? code : 0));
    child.on("error", () => resolve(1));
  });

  await playNotificationSound();
  return exitCode;
}

run().then((code) => process.exit(code));
