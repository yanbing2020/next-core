import chalk from "chalk";
import execa from "execa";

export function scriptYarnInstall(targetDir: string) {
  console.log(chalk.inverse("[create-next-repo] $ yarn"));
  return execa("yarn", [], {
    cwd: targetDir,
    stdio: "inherit",
    env: {
      // https://github.com/mbalabash/estimo/blob/master/scripts/findChrome.js#L1
      ESTIMO_DISABLE: "true"
    }
  });
}

export function scriptYarnSyncDll(targetDir: string) {
  console.log(chalk.inverse("[create-next-repo] $ yarn sync-dll"));
  return execa("yarn", ["sync-dll"], {
    cwd: targetDir,
    stdio: "inherit"
  });
}