import inquirer from "inquirer";
import { TargetType, TargetTypeDisplay } from "../interface";

export function askTargetType(): inquirer.ListQuestion<{
  targetType: TargetType;
}> {
  // istanbul ignore next (nothing logic)
  return {
    type: "list",
    name: "targetType",
    message: "What do you want?",
    choices: [
      TargetType.A_NEW_BRICK,
      TargetType.A_NEW_PACKAGE_OF_BRICKS,
      TargetType.A_NEW_PACKAGE_OF_LIBS,
      TargetType.A_NEW_PACKAGE_OF_MICRO_APPS,
      TargetType.A_NEW_PACKAGE_OF_PROVIDERS,
      TargetType.A_NEW_PACKAGE_OF_DLL,
      TargetType.TRANSFORM_A_MICRO_APP
    ].map(value => ({
      name: TargetTypeDisplay[value],
      value
    }))
  };
}