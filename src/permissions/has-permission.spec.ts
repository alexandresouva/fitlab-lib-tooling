import { describe, it, expect } from "vitest";
import { hasPermission } from "./has-permission";

describe("hasPermission", () => {
  it("should return false if userPermissions is undefined", () => {
    expect(hasPermission(undefined, "workout:read")).toBe(false);
  });

  it("should return false if userPermissions is empty", () => {
    expect(hasPermission([], "workout:read")).toBe(false);
  });

  it("should return true for exact match", () => {
    expect(hasPermission(["workout:read", "timer:start"], "workout:read")).toBe(true);
  });

  it("should return false if permission is not in the list", () => {
    expect(hasPermission(["workout:read"], "workout:write")).toBe(false);
  });

  it("should return true if user has superuser wildcard '*'", () => {
    expect(hasPermission(["*"], "workout:delete")).toBe(true);
    expect(hasPermission(["*"], "timer:start")).toBe(true);
  });

  it("should return true if user has scoped wildcard 'resource:*'", () => {
    expect(hasPermission(["workout:*"], "workout:read")).toBe(true);
    expect(hasPermission(["workout:*"], "workout:delete")).toBe(true);
  });

  it("should return false if scoped wildcard is for a different resource", () => {
    expect(hasPermission(["workout:*"], "timer:start")).toBe(false);
  });
});
