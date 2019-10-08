import { askPackageName } from "./askPackageName";
import { TargetType } from "../interface";

describe("askPackageName", () => {
  it("should validate correctly for new package of bricks", () => {
    const { validate } = askPackageName({
      targetType: TargetType.A_NEW_PACKAGE_OF_BRICKS,
      appRoot: process.cwd()
    }) as any;
    expect(validate("good")).toBe(true);
    expect(validate("Bad")).not.toBe(true);
    expect(validate("providers-of-any")).not.toBe(true);
  });
  it("should validate correctly for new package of libs", () => {
    const { validate } = askPackageName({
      targetType: TargetType.A_NEW_PACKAGE_OF_LIBS,
      appRoot: process.cwd()
    }) as any;
    expect(validate("good")).toBe(true);
  });
  it("should return choices of package for new brick", () => {
    const { choices } = askPackageName({
      targetType: TargetType.A_NEW_BRICK,
      appRoot: process.cwd()
    }) as any;
    expect(Array.isArray(choices)).toBe(true);
  });
  it("should return choices of package for new providers", () => {
    const { choices } = askPackageName({
      targetType: TargetType.A_NEW_PACKAGE_OF_PROVIDERS,
      appRoot: process.cwd()
    }) as any;
    expect(Array.isArray(choices)).toBe(true);
  });
});