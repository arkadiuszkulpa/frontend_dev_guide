Feature: Form UI and Navigation
  As a potential customer
  I want to navigate through the form smoothly
  So that I can complete my enquiry without issues

  # NOTE: These are UI/UX tests - they verify the form WORKS mechanically.
  # The CORE test (data actually saves) is in enquiry-submission.feature.
  # These are lower priority than submission tests.

  Background:
    Given I am on the enquiry form

  @ui @smoke
  Scenario: Simple website with full management (Golden Path UI)
    # Tests the SIMPLEST path through all 7 steps - most common user journey
    When I select "Do it for me" involvement level
    And I select "You manage everything" for account management
    And I continue to the next step

    # Step 2: Complexity
    And I select "Simple & static" complexity
    And I continue to the next step

    # Step 2b: Features - just basics for simple site
    And I select "Home page" and "Contact page" as my pages
    And I continue to the next step

    # Step 3: AI Features
    And I select "No AI features needed"
    And I continue to the next step

    # Step 4: Business Info
    And I fill in my business details:
      | description | A local bakery selling fresh bread |
      | competitor  | https://example-bakery.com         |
    And I continue to the next step

    # Step 5: Design Assets
    And I indicate I have a logo and brand colours
    And I continue to the next step

    # Step 6: Contact Info
    And I fill in my contact details:
      | name   | John Smith           |
      | email  | john@example.com     |
      | phone  | +44 7911 123456      |
      | method | Email                |
    And I continue to the next step

    # Step 7: Pricing Summary
    Then I should see the pricing summary
    And the base price should be in the "Simple & static" range

  @ui
  Scenario: Guide me path reaches pricing summary
    # Tests the "Guide me" path - different conditional flow (no account mgmt)
    When I select "Guide me through it" involvement level
    # Note: Account management should NOT appear for "Guide me"
    And I continue to the next step

    # Step 2: Complexity - use simple for faster test
    And I select "Simple & static" complexity
    And I continue to the next step

    # Step 2b: Features - just basics
    And I select "Home page" and "Contact page" as my pages
    And I continue to the next step

    # Step 3: AI Features
    And I select "No AI features needed"
    And I continue to the next step

    # Step 4: Business Info
    And I fill in my business details:
      | description | Online fashion retailer with great products |
      | competitor  | https://competitor-fashion.com              |
    And I continue to the next step

    # Step 5: Design Assets
    And I indicate I have a logo and brand colours
    And I continue to the next step

    # Step 6: Contact Info
    And I fill in my contact details:
      | name   | Jane Doe             |
      | email  | jane@fashion.com     |
      | phone  | +44 20 7946 0958     |
      | method | Phone                |
    And I continue to the next step

    # Step 7: Pricing Summary
    Then I should see the pricing summary
    And the base price should be in the "Simple & static" range

  @ui @conditional
  Scenario: Guide me option skips account management
    # Tests the key conditional branch - "Guide me" doesn't need account mgmt
    When I select "Guide me through it" involvement level
    Then I should NOT see account management options
    And I can continue to the next step

  @ui @conditional
  Scenario: Do it for me requires account management selection
    When I select "Do it for me" involvement level
    Then I should see account management options
    And I must select an account management option to continue

  @ui @mobile
  Scenario: Form is usable on mobile devices
    Given I am viewing on a mobile device
    Then I should see the involvement level options
    And the continue button should be visible and tappable

