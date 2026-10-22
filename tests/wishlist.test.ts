import { test, expect } from "bun:test";
import { memberSchema, buildWishlistDocument } from "../src/lib/wishlist";

const member = { name: "Test Member", unit: "A / 101", contact: "9876543210", area: "600", priorities: ["", "", "", "", ""], other: "" };
test("member identity must be complete before generating a response", () => {
  expect(memberSchema.safeParse(member).success).toBe(true);
  expect(memberSchema.safeParse({ ...member, name: "" }).success).toBe(false);
  expect(memberSchema.safeParse({ ...member, unit: "" }).success).toBe(false);
  expect(memberSchema.safeParse({ ...member, contact: "abc" }).success).toBe(false);
});
test("downloaded responses cannot execute member-provided HTML", () => {
  const document = buildWishlistDocument({ ...member, other: '<script>alert("test")</script>' }, {});
  expect(document.includes('<script>')).toBe(false);
  expect(document.includes("&lt;script&gt;")).toBe(true);
});