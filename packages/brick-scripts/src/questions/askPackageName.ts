import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { TargetType } from "../interface";
import { targetMap } from "../constant";

export function askPackageName({
  targetType,
  appRoot
}: {
  targetType: TargetType;
  appRoot: string;
}): inquirer.DistinctQuestion<{ packageName: string }> {
  if (targetType === TargetType.A_NEW_BRICK) {
    // 读取当前的 `@bricks/*` 作为候选列表。
    const root = path.join(appRoot, "bricks");
    const pkgList =
    process.env.NODE_ENV !== "test"
      ? fs
        .readdirSync(root, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
      : [];

    return {
      type: "list",
      name: "packageName",
      message: "which package do you want to put the new brick in?",
      choices: pkgList
    };
  }

  if (targetType === TargetType.A_NEW_PACKAGE_OF_PROVIDERS) {
    // 读取所有的 `@sdk/*` 作为候选列表。
    const root = path.join(appRoot, "../next-sdk/sdk");
    const sdkList =
      process.env.NODE_ENV !== "test"
        ? fs
            .readdirSync(root, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => ({
              name: dirent.name,
              value: `providers-of-${dirent.name.replace(/-sdk$/, "")}`
            }))
        : [];

    return {
      type: "list",
      name: "packageName",
      message: "which sdk do you want to create providers for?",
      choices: sdkList
    };
  }

  if (targetType === TargetType.TRANSFORM_A_MICRO_APP) {
    // 读取所有的 `@micro-apps/*` 作为候选列表。
    const root = path.join(appRoot, "micro-apps");
    const microApps = fs
      .readdirSync(root, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    return {
      type: "list",
      name: "packageName",
      message: "which micro-app do you want to transform?",
      choices: microApps
    };
  }

  return {
    type: "input",
    name: "packageName",
    message: "What's the name of your new package (in lower-kebab-case)?",
    validate(value) {
      const pass = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(value);
      if (!pass) {
        return "Please enter a lower-kebab-case package name.";
      }

      if (targetType === TargetType.A_NEW_PACKAGE_OF_BRICKS) {
        const collision = value.startsWith("providers-of-");
        if (collision) {
          return "`providers-of-*` is reserved, please enter another name.";
        }
      }

      const relativePath = path.join(targetMap[targetType], value);
      const root = path.join(appRoot, relativePath);

      if (fs.existsSync(root)) {
        return `Package "${relativePath}" exists, please enter another name.`;
      }

      return true;
    }
  };
}