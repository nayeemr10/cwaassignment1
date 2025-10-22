import { test, expect } from "@playwright/test";

test("add & solve stage", async ({ page }) => {
  await page.goto("http://localhost:3000/escape-room");
  await page.getByPlaceholder("New stage title…").fill("Find hidden key");
  await page.getByRole("button", { name: "Add stage" }).click();
  await page.getByLabel("Mark Find hidden key as solved").check();
  await expect(page.getByText("You escaped!")).not.toBeVisible();
});

test("download output", async ({ page }) => {
  await page.goto("http://localhost:3000/escape-room");
  await page.getByRole("button", { name: "Download output" }).click();
  const heading = page.getByRole("heading", { name: "Escape Room" });
  await expect(heading).toBeVisible();
});

