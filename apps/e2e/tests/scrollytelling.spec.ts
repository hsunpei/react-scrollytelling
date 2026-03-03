import { test, expect, type Page } from "@playwright/test";

const SECTIONS = [
  "RED",
  "ORANGE",
  "YELLOW",
  "GREEN",
  "BLUE",
  "PURPLE",
] as const;

/**
 * Scroll so the target section's top edge is near the viewport bottom.
 *
 * The scrollytelling library determines the active section by finding the one
 * whose `sectionTop` is closest to—but not below—the viewport bottom
 * (`scrollBottom - sectionTop >= 0, minimize distance`). Positioning the
 * target's top ~100 px above the viewport bottom guarantees it wins.
 */
async function scrollToSectionAndWait(page: Page, sectionId: string) {
  await page.evaluate((id) => {
    const el = document.querySelector(`[data-testid="section-${id}"]`);
    if (!el) throw new Error(`Section ${id} not found`);
    const rect = el.getBoundingClientRect();
    const sectionTop = rect.top + window.scrollY;
    // Place the section top 100 px above the viewport bottom.
    const target = sectionTop - window.innerHeight + 100;
    window.scrollTo({ top: Math.max(0, target), behavior: "instant" });
  }, sectionId);

  // Give the IntersectionObserver and React state time to settle.
  await expect(page.locator('[data-testid="active-section-id"]')).toHaveText(
    sectionId,
    { timeout: 5_000 }
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe("Scrollytelling grouped sections", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("page loads and all sections are visible", async ({ page }) => {
    await expect(page).toHaveTitle(/react-scrollytelling e2e/);
    await expect(page.locator("#root")).toBeVisible();

    for (const id of SECTIONS) {
      await expect(page.locator(`[data-testid="section-${id}"]`)).toBeVisible();
    }
  });

  test("initial active section is RED", async ({ page }) => {
    // RED is the first section and starts with padding-top: 50vh, so it
    // should be the active section when the page first loads.
    await expect(page.locator('[data-testid="active-section-id"]')).toHaveText(
      "RED"
    );
    await expect(
      page.locator('[data-testid="active-section-label"]')
    ).toHaveText("RED");
  });

  test("scrolling through each section updates the active indicator", async ({
    page,
  }) => {
    for (const id of SECTIONS) {
      await scrollToSectionAndWait(page, id);

      // The label should display the section name.
      await expect(
        page.locator('[data-testid="active-section-label"]')
      ).toHaveText(id);
    }
  });

  test("scroll ratio is reported between 0 and 1", async ({ page }) => {
    // Scroll to a middle section so we have room to verify the ratio.
    await scrollToSectionAndWait(page, "GREEN");

    const ratioText = await page
      .locator('[data-testid="active-section-ratio"]')
      .textContent();
    const ratio = Number(ratioText);

    expect(ratio).toBeGreaterThanOrEqual(0);
    expect(ratio).toBeLessThanOrEqual(1);
  });

  test("active section label has the correct color CSS class", async ({
    page,
  }) => {
    const expectedClasses: Record<string, string> = {
      RED: "text-red",
      ORANGE: "text-orange",
      YELLOW: "text-yellow",
      GREEN: "text-green",
      BLUE: "text-blue",
      PURPLE: "text-purple",
    };

    for (const id of SECTIONS) {
      await scrollToSectionAndWait(page, id);

      const label = page.locator('[data-testid="active-section-label"]');
      await expect(label).toHaveClass(new RegExp(expectedClasses[id]));
    }
  });

  test("scrolling back up reverts the active section", async ({ page }) => {
    // Scroll down to BLUE then back up to ORANGE.
    await scrollToSectionAndWait(page, "BLUE");
    await expect(page.locator('[data-testid="active-section-id"]')).toHaveText(
      "BLUE"
    );

    await scrollToSectionAndWait(page, "ORANGE");
    await expect(page.locator('[data-testid="active-section-id"]')).toHaveText(
      "ORANGE"
    );
    await expect(
      page.locator('[data-testid="active-section-label"]')
    ).toHaveText("ORANGE");
  });
});
