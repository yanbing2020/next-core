import { matchPath, toPath } from "./matchPath";
import {
  MatchOptions,
  CompileOptions,
  MatchResult,
} from "@next-core/brick-types";

describe("matchPath", () => {
  it.each<[string, MatchOptions & CompileOptions, MatchResult]>([
    [
      "/",
      {
        path: "/",
      },
      {
        path: "/",
        url: "/",
        isExact: true,
        params: {},
      },
    ],
    [
      "/next",
      {
        path: "/:id",
        exact: true,
      },
      {
        path: "/:id",
        url: "/next",
        isExact: true,
        params: {
          id: "next",
        },
      },
    ],
    [
      "/next",
      {
        path: ["/:id", "/before"],
        exact: true,
      },
      {
        path: "/:id",
        url: "/next",
        isExact: true,
        params: {
          id: "next",
        },
      },
    ],
    [
      "/next",
      {
        path: "/",
        exact: true,
      },
      null,
    ],
    [
      "/next",
      {
        path: ["/"],
        exact: true,
      },
      null,
    ],
    [
      "/next",
      {
        path: [],
      },
      null,
    ],
  ])("matchPath('%s', %j) should return %j", (pathname, options, result) => {
    expect(matchPath(pathname, options)).toEqual(result);
  });
});

describe("toPath", () => {
  it.each<[string, Record<string, any>, string]>([
    ["/good", undefined, "/good"],
    [
      "/for/:quality",
      {
        quality: "good",
      },
      "/for/good",
    ],
  ])("toPath('%s', %j) should return '%s'", (path, pathParams, result) => {
    expect(toPath(path, pathParams)).toEqual(result);
  });
});
