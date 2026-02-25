import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/react-scrollytelling e2e/);
});

test("loads the app root", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#root")).toBeVisible();
});
