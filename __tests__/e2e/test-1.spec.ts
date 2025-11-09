import { test, expect } from "@playwright/test";
const email = "henryabayomi12@gmail.com";
const password = "Test@1234567890";

test.describe("Creationary E2E Tests", () => {
  // test.slow();
  test.describe("Homepage and Navigation", () => {
    test("should display homepage elements correctly", async ({ page }) => {
      await page.goto("/");
      await expect(page.locator("h1")).toContainText("Monetize Your Creative Content");
      await expect(page.getByRole("link", { name: "Start Creating" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Browse Content" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Featured Creators" })).toBeVisible();
      // await expect(page.locator('body')).toMatchAriaSnapshot(`
      //   - heading "Featured Creators" [level=2]
      //   - paragraph: Discover amazing creators who are building successful businesses on our platform
      //   - link /SC Sarah Chen Photography Professional landscape and portrait photography tutorials \\d+,\\d+ Subscribers \\$\\d+,\\d+ Monthly/:
      //     - /url: /user/sarah-chen
      //     - paragraph: Professional landscape and portrait photography tutorials
      //     - paragraph: /\\d+,\\d+/
      //     - paragraph: Subscribers
      //     - paragraph: /\\$\\d+,\\d+/
      //     - paragraph: Monthly
      //   - link /MJ Marcus Johnson Music Production Beat making and music production masterclasses \\d+,\\d+ Subscribers \\$\\d+,\\d+ Monthly/:
      //     - /url: /user/marcus-johnson
      //     - paragraph: Beat making and music production masterclasses
      //     - paragraph: /\\d+,\\d+/
      //     - paragraph: Subscribers
      //     - paragraph: /\\$\\d+,\\d+/
      //     - paragraph: Monthly
      //   - link /ER Elena Rodriguez Fitness Home workout routines and nutrition gu_idance \\d+,\\d+ Subscribers \\$\\d+,\\d+ Monthly/:
      //     - /url: /user/elena-rodriguez
      //     - paragraph: Home workout routines and nutrition gu_idance
      //     - paragraph: /\\d+,\\d+/
      //     - paragraph: Subscribers
      //     - paragraph: /\\$\\d+,\\d+/
      //     - paragraph: Monthly
      //   `); arrggh I'm not sure this would last since we still have some dummy here.
      await expect(page.locator("body")).toContainText("Trending Content");
      await expect(page.getByRole("link", { name: "Become a Creator" })).toBeVisible();
    });

    test("should display navigation elements correctly", async ({ page }) => {
      await page.goto("/");
      await expect(
        page
          .getByRole("banner")
          .locator("div")
          .filter({ hasText: /^Creationary$/ })
      ).toBeVisible();
      await expect(page.getByRole("banner")).toContainText("Creationary");
      await expect(
        page.getByRole("navigation").getByRole("link", { name: "Explore" })
      ).toBeVisible();
      await expect(page.getByRole("link", { name: "About" })).toBeVisible();
    });
  });

  test.describe("Authentication Flow", () => {
    test("should navigate to login page and display login elements", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("link", { name: "Sign In" }).click();
      await expect(page.getByRole("heading", { name: "Sign in to your account" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Forgot Password?" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Don't have an account yet?" })).toBeVisible();
      await expect(page.getByRole("textbox", { name: "Email address" })).toBeVisible();
      await expect(page.getByRole("textbox", { name: "Password" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
    });

    test("should login successfully with valid credentials", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("link", { name: "Sign In" }).click();
      await page.getByRole("textbox", { name: "Email address" }).fill(email);
      await page.getByRole("textbox", { name: "Password" }).fill(password);
      await page.getByRole("button", { name: "Sign in" }).click();
      await expect(page.getByText("Discover amazing content from talented creators")).toBeVisible();
    });
  });

  test.describe("Explore Page Functionality", () => {
    test("should navigate content and use search functionality", async ({ page }) => {
      // Login first
      await page.goto("/");
      await page.getByRole("link", { name: "Sign In" }).click();
      await page.getByRole("textbox", { name: "Email address" }).fill(email);
      await page.getByRole("textbox", { name: "Password" }).fill(password);
      await page.getByRole("button", { name: "Sign in" }).click();

      await page.waitForURL("**/explore");

      await expect(
        page.getByRole("textbox", { name: "Search content or creators..." })
      ).toBeVisible();

      // Search functionality
      await page.goto("/explore?page=1");
      await page.getByRole("textbox", { name: "Search content or creators..." }).fill("random");
    });

    test("should filter content by category and use pagination", async ({ page }) => {
      // Login first
      await page.goto("/");
      await page.getByRole("link", { name: "Sign In" }).click();
      await page.getByRole("textbox", { name: "Email address" }).fill(email);
      await page.getByRole("textbox", { name: "Password" }).fill(password);
      await page.getByRole("button", { name: "Sign in" }).click();

      // Navigate to explore page
      await page.goto("/explore");
      await expect(page.getByRole("navigation", { name: "pagination" })).toBeVisible();

      // Category filtering
      await page.getByRole("button", { name: "Art" }).click();
      await expect(page.getByRole("listitem").filter({ hasText: "Previous" })).toBeVisible();
      await expect(page.getByLabel("Go to next page")).toBeVisible();
      await page.getByRole("button", { name: "Technology" }).click();
      await expect(page.locator("body")).toMatchAriaSnapshot(`- button "All"`);
    });
  });

  test.describe("Content Upload Flow", () => {
    test("should navigate to upload page and display content types", async ({ page }) => {
      // Login first
      await page.goto("/");
      await page.getByRole("link", { name: "Sign In" }).click();
      await page.getByRole("textbox", { name: "Email address" }).fill("henryabayomi12@gmail.com");
      await page.getByRole("textbox", { name: "Password" }).fill("Test@1234567890");
      await page.getByRole("button", { name: "Sign in" }).click();

      // Navigate to upload
      await page.getByRole("link", { name: "Upload Post" }).click();

      // Verify eBook/Guide content type is visible - using semantic selector
      await expect(page.getByRole("heading", { name: "eBook/Guide" })).toBeVisible();
      await expect(page.getByText("Written content")).toBeVisible();
      await expect(page.locator("form")).toMatchAriaSnapshot(`
        - heading "Video Course" [level=3]
        - paragraph: Upload video lessons
        - heading "Live Session" [level=3]
        - paragraph: Schedule live streaming
        - heading "Podcast/Audio" [level=3]
        - paragraph: Audio content only
        - heading "Tutorial Series" [level=3]
        - paragraph: Step-by-step guides
        - heading "eBook/Guide" [level=3]
        - paragraph: Written content
        `);

      // Upload page elements
      await expect(page.locator("h1")).toContainText("Upload Content");
      await expect(page.getByRole("button", { name: "Back to Dashboard" })).toBeVisible();
      await expect(page.getByText("Content Type", { exact: true })).toBeVisible();
      await expect(page.getByText("Content Details")).toBeVisible();
      await expect(page.getByText("Pricing & Settings")).toBeVisible();
      await expect(page.getByText("Review & Publish")).toBeVisible();
      await expect(page.getByRole("progressbar")).toBeVisible();
      await expect(page.locator("form")).toContainText(
        "Select the type of content you want to create"
      );
    });

    test("should complete content details step", async ({ page }) => {
      // Login and navigate to upload
      await page.goto("/");
      await page.getByRole("link", { name: "Sign In" }).click();
      await page.getByRole("textbox", { name: "Email address" }).fill(email);
      await page.getByRole("textbox", { name: "Password" }).fill(password);
      await page.getByRole("button", { name: "Sign in" }).click();
      await page.getByRole("link", { name: "Upload Post" }).click();

      // Select content type and proceed
      await page.getByRole("heading", { name: "eBook/Guide" }).click();
      await page.getByRole("button", { name: "Next", exact: true }).click();

      // Fill content details
      await page
        .getByRole("textbox", { name: "Enter a compelling title for" })
        .fill("This is a simple title");
      await page
        .locator('textarea[name="description"]')
        .fill("This is a random description used to test playwright codegen");
      await page
        .locator('textarea[name="content"]')
        .fill("There isn't meant to be any content to here to be fair. Just testing purpose.");
      await page.getByRole("combobox").click();
      await page.getByRole("option", { name: "Technology" }).click();
      await page.getByRole("textbox", { name: "e.g., 2h 30m, 45 minutes" }).fill("4h 40m");

      // Add tags
      await page.getByRole("textbox", { name: "Add tags (press Enter)" }).fill("Testing");
      await page.getByRole("textbox", { name: "Add tags (press Enter)" }).press("Enter");
      await page.getByRole("textbox", { name: "Add tags (press Enter)" }).fill("Playwright"); // You might consider it risky that I didn't test the case of using the add button to add a tag.
      await page.getByRole("textbox", { name: "Add tags (press Enter)" }).press("Enter");
      await page.getByRole("textbox", { name: "Add tags (press Enter)" }).fill("Vitest");
      await page.getByRole("textbox", { name: "Add tags (press Enter)" }).press("Enter");
      await page.getByRole("textbox", { name: "Add tags (press Enter)" }).fill("Jest");
      await page.getByRole("textbox", { name: "Add tags (press Enter)" }).press("Enter");
      await page.getByRole("textbox", { name: "Add tags (press Enter)" }).fill("Jsdom");
      await page.getByRole("textbox", { name: "Add tags (press Enter)" }).press("Enter");
      await page
        .getByRole("textbox", { name: "Add tags (press Enter)" })
        .fill("React Testing Library");
      await page.getByRole("textbox", { name: "Add tags (press Enter)" }).press("Enter");
    });

    test("should verify content details form elements", async ({ page }) => {
      // Login and navigate to content details step
      await page.goto("/");
      await page.getByRole("link", { name: "Sign In" }).click();
      await page.getByRole("textbox", { name: "Email address" }).fill(email);
      await page.getByRole("textbox", { name: "Password" }).fill(password);
      await page.getByRole("button", { name: "Sign in" }).click();
      await page.getByRole("link", { name: "Upload Post" }).click();
      await page.getByRole("heading", { name: "eBook/Guide" }).click();
      await page.getByRole("button", { name: "Next", exact: true }).click();

      // Verify form elements
      await expect(
        page.getByRole("textbox", { name: "Enter a compelling title for" })
      ).toBeVisible();
      await expect(page.getByText("Title *")).toBeVisible();
      await expect(page.locator("form")).toContainText("Description *");
      await expect(page.locator("form")).toContainText("Content *");
      await expect(page.getByRole("combobox")).toBeVisible();
      await expect(page.locator("form")).toContainText("Category *");
      await expect(page.locator("form")).toContainText("Estimated Duration");
      await expect(page.locator("form")).toContainText("Tags");
      await expect(page.getByRole("textbox", { name: "Add tags (press Enter)" })).toBeVisible();
      await expect(
        page.locator("form").getByRole("button").filter({ hasText: /^$/ })
      ).toBeVisible();

      // Fill and verify form interaction
      await page
        .getByRole("textbox", { name: "Enter a compelling title for" })
        .fill("This is a simple title");
      await page
        .locator('textarea[name="description"]')
        .fill("This is a random description used to test playwright codegen");
      await page.getByText("This is a random description").click();
      await expect(page.locator('textarea[name="description"]')).toBeVisible();
      await expect(page.getByText("This is a random description")).toBeVisible();
      await page
        .locator('textarea[name="content"]')
        .fill("There isn't meant to be any content to here to be fair. Just testing purpose.");
      await expect(page.locator('textarea[name="content"]')).toBeVisible();
      await expect(page.getByText("There isn't meant to be any")).toBeVisible();
      await expect(page.getByRole("textbox", { name: "e.g., 2h 30m, 45 minutes" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Next", exact: true })).toBeVisible();
    });

    test("should complete pricing and settings step", async ({ page }) => {
      // Complete previous steps
      await page.goto("/");
      await page.getByRole("link", { name: "Sign In" }).click();
      await page.getByRole("textbox", { name: "Email address" }).fill(email);
      await page.getByRole("textbox", { name: "Password" }).fill(password);
      await page.getByRole("button", { name: "Sign in" }).click();
      await page.getByRole("link", { name: "Upload Post" }).click();
      await page.getByRole("heading", { name: "eBook/Guide" }).click();
      await page.getByRole("button", { name: "Next", exact: true }).click();
      await page
        .getByRole("textbox", { name: "Enter a compelling title for" })
        .fill("This is a simple title");
      await page
        .locator('textarea[name="description"]')
        .fill("This is a random description used to test playwright codegen");
      await page
        .locator('textarea[name="content"]')
        .fill("There isn't meant to be any content to here to be fair. Just testing purpose.");
      await page.getByRole("combobox").click();
      await page.getByRole("option", { name: "Technology" }).click();
      await page.getByRole("textbox", { name: "e.g., 2h 30m, 45 minutes" }).fill("4h 40m");
      await page.getByRole("button", { name: "Next", exact: true }).click();

      // Pricing step
      await expect(page.locator("form")).toContainText("Pricing & Settings");
      await expect(page.locator("form")).toContainText("Original Price (NGN)");
      await expect(page.locator('input[name="originalPrice"]')).toBeVisible();
      await expect(page.locator("form")).toContainText("Price (NGN)");
      await expect(page.locator('input[name="price"]')).toBeVisible();
      await page.locator('input[name="originalPrice"]').fill("400");
      await page.locator('input[name="price"]').fill("600");
      await expect(page.locator("form")).toContainText(
        "Platform takes 10% commission on paid content. You keep 90% of all sales."
      );
      await expect(page.getByRole("button", { name: "Previous" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Next", exact: true })).toBeVisible();
    });

    test("should complete review and publish step", async ({ page }) => {
      // Complete all previous steps
      await page.goto("/");
      await page.getByRole("link", { name: "Sign In" }).click();
      await page.getByRole("textbox", { name: "Email address" }).fill(email);
      await page.getByRole("textbox", { name: "Password" }).fill(password);
      await page.getByRole("button", { name: "Sign in" }).click();
      await page.getByRole("link", { name: "Upload Post" }).click();
      await page.getByRole("heading", { name: "eBook/Guide" }).click();
      await page.getByRole("button", { name: "Next", exact: true }).click();
      await page
        .getByRole("textbox", { name: "Enter a compelling title for" })
        .fill("This is a simple title");
      await page
        .locator('textarea[name="description"]')
        .fill("This is a random description used to test playwright codegen");
      await page
        .locator('textarea[name="content"]')
        .fill("There isn't meant to be any content to here to be fair. Just testing purpose.");
      await page.getByRole("combobox").click();
      await page.getByRole("option", { name: "Technology" }).click();
      await page.getByRole("textbox", { name: "e.g., 2h 30m, 45 minutes" }).fill("4h 40m");
      await page.getByRole("button", { name: "Next", exact: true }).click();
      await page.locator('input[name="originalPrice"]').fill("400");
      await page.locator('input[name="price"]').fill("600");
      await page.getByRole("button", { name: "Next", exact: true }).click();

      // Review step
      await expect(page.locator("form")).toContainText("Review & Publish");
      await expect(page.locator("form")).toContainText("Review your content before publishing");
      await expect(page.locator("h4")).toContainText("Publishing Checklist");
      // I need to be assert here that the items I selected are shown in the checklist
      await page.getByRole("button", { name: "Next", exact: true }).click();
    });
  });

  test.describe("User Session Management", () => {
    test("should logout successfully", async ({ page }) => {
      // Login first
      await page.goto("/");
      await page.getByRole("link", { name: "Sign In" }).click();
      await page.getByRole("textbox", { name: "Email address" }).fill(email);
      await page.getByRole("textbox", { name: "Password" }).fill(password);
      await page.getByRole("button", { name: "Sign in" }).click();

      // Logout
      await page.getByRole("button", { name: "Log Out" }).click();
    });
  });
});
