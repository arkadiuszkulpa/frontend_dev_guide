Feature: Form Validation
  As a potential customer
  I want clear validation feedback
  So that I can correct my inputs and submit successfully

  # NOTE: Detailed validation logic (email formats, phone formats, etc.)
  # is tested comprehensively in unit tests (validators.test.ts).
  # BDD tests here verify validation BLOCKS form progression.

  Background:
    Given I am on the enquiry form

  @validation
  Scenario: Cannot proceed from Step 1 without selection
    When I try to continue without making a selection
    Then I should remain on Step 1
    And I should still see the involvement options

  @validation
  Scenario: Selecting involvement enables continue
    When I select "Do it for me" involvement level
    And I select "You manage everything" for account management
    Then I should be able to continue to the next step

