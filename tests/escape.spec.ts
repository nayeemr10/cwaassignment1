import { test, expect } from "@playwright/test";

// Helper: flexible locators that tolerate "stage"/"puzzle" + case
const newTitleInput = (page: any) =>
  page.getByPlaceholder(/New (stage|puzzle) title/i);

const addButton = (page: any) =>
  page.getByRole("button", { name: /Add (stage|puzzle)/i });

test("add & solve stage/puzzle", async ({ page }) => {
  await page.goto("/escape-room");

  // Make sure the input is there before interacting
  await expect(newTitleInput(page)).toBeVisible();

  await newTitleInput(page).fill("Find hidden key");
  await addButton(page).click();

  // Checkbox label uses the stage/puzzle title in aria-label:
  // aria-label="Mark Find hidden key as solved"
  await page.getByLabel("Mark Find hidden key as solved").check();

  // Confirm the new item appears in the list
  await expect(page.getByText("Find hidden key")).toBeVisible();

  // Not asserting “You escaped!” because it depends on all puzzles solved
});

test("download output", async ({ page }) => {
  await page.goto("/escape-room");
  await page.getByRole("button", { name: /Download/i }).click();
  await expect(page.getByRole("heading", { name: "Escape Room" })).toBeVisible();
});
