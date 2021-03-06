import { scanPermissionActionsInStoryboard } from "@next-core/brick-utils";
import { PermissionApi } from "@next-sdk/micro-app-sdk";
import {
  preCheckPermissions as _preCheckPermissions,
  checkPermissions as _checkPermissions,
  validatePermissions as _validatePermissions,
} from "./checkPermissions";

jest.mock("@next-core/brick-utils");
jest.mock("@next-sdk/micro-app-sdk");

const mockScanPermissionActionsInStoryboard = scanPermissionActionsInStoryboard as jest.MockedFunction<
  typeof scanPermissionActionsInStoryboard
>;
const mockValidatePermissions = PermissionApi.validatePermissions as jest.MockedFunction<
  typeof PermissionApi.validatePermissions
>;
const mockConsoleError = jest
  .spyOn(console, "error")
  .mockImplementation(() => void 0);

describe("checkPermissions", () => {
  let preCheckPermissions: typeof _preCheckPermissions;
  let checkPermissions: typeof _checkPermissions;
  let validatePermissions: typeof _validatePermissions;

  beforeEach(() => {
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const m = require("./checkPermissions");
      preCheckPermissions = m.preCheckPermissions;
      checkPermissions = m.checkPermissions;
      validatePermissions = m.validatePermissions;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should not request if action is empty", async () => {
    mockScanPermissionActionsInStoryboard.mockReturnValueOnce([]);
    await preCheckPermissions(null);
    expect(mockValidatePermissions).not.toBeCalled();
    expect(checkPermissions("my:action-a")).toBe(false);
    expect(mockConsoleError).toBeCalledWith(
      'Un-checked permission action: "my:action-a", please make sure the permission to check is defined in permissionsPreCheck.'
    );
  });

  it("should catch error if pre-check failed", async () => {
    mockScanPermissionActionsInStoryboard.mockReturnValueOnce(["my:action-a"]);
    mockValidatePermissions.mockRejectedValueOnce("oops");
    await preCheckPermissions(null);
    expect(mockConsoleError).toBeCalledWith(
      "Pre-check permissions failed",
      "oops"
    );
    expect(checkPermissions("my:action-a")).toBe(false);
    expect(mockConsoleError).toBeCalledWith(
      'Un-checked permission action: "my:action-a", please make sure the permission to check is defined in permissionsPreCheck.'
    );
  });

  it("should not check permissions repeatedly", async () => {
    mockValidatePermissions.mockResolvedValueOnce({
      actions: [
        {
          action: "my:action-a",
          authorizationStatus: "authorized",
        },
        {
          action: "my:action-b",
          authorizationStatus: "unauthorized",
        },
      ],
    });
    await validatePermissions(["my:action-a", "my:action-b"]);
    expect(mockValidatePermissions).toBeCalledWith({
      actions: ["my:action-a", "my:action-b"],
    });
    await validatePermissions(["my:action-a", "my:action-c"]);
    expect(mockValidatePermissions).toBeCalledWith({
      actions: ["my:action-c"],
    });
  });

  it("should validate permissions", async () => {
    mockScanPermissionActionsInStoryboard.mockReturnValueOnce([
      "my:action-a",
      "my:action-b",
      "my:action-c",
    ]);
    mockValidatePermissions.mockResolvedValueOnce({
      actions: [
        {
          action: "my:action-a",
          authorizationStatus: "authorized",
        },
        {
          action: "my:action-b",
          authorizationStatus: "unauthorized",
        },
        {
          action: "my:action-c",
          authorizationStatus: "undefined",
        },
      ],
    });
    await preCheckPermissions(null);
    expect(mockValidatePermissions).toBeCalledWith({
      actions: ["my:action-a", "my:action-b", "my:action-c"],
    });
    expect(mockConsoleError).toBeCalledWith(
      'Undefined permission action: "my:action-c"'
    );

    mockValidatePermissions.mockClear();
    mockConsoleError.mockClear();

    mockScanPermissionActionsInStoryboard.mockReturnValueOnce([
      "my:action-c",
      "my:action-d",
    ]);
    mockValidatePermissions.mockResolvedValueOnce({
      actions: [
        {
          action: "my:action-d",
          authorizationStatus: "authorized",
        },
      ],
    });
    await preCheckPermissions(null);
    expect(mockValidatePermissions).toBeCalledWith({
      actions: ["my:action-d"],
    });
    expect(mockConsoleError).not.toBeCalled();

    expect(checkPermissions("my:action-a")).toBe(true);
    expect(checkPermissions("my:action-b")).toBe(false);
    expect(checkPermissions("my:action-c")).toBe(false);
    expect(checkPermissions("my:action-d")).toBe(true);
    expect(checkPermissions("my:action-a", "my:action-b")).toBe(false);
    expect(checkPermissions("my:action-b", "my:action-c")).toBe(false);
    expect(checkPermissions("my:action-a", "my:action-d")).toBe(true);
    expect(mockConsoleError).not.toBeCalled();

    expect(checkPermissions("my:action-x")).toBe(false);
    expect(mockConsoleError).toBeCalledWith(
      'Un-checked permission action: "my:action-x", please make sure the permission to check is defined in permissionsPreCheck.'
    );
  });
});
