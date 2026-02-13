Feature: Form Navigation
  As a potential customer
  I want to navigate back and forth in the form
  So that I can review and modify my previous selections

  # Test navigation mechanics ONCE - applies to all steps

  @navigation
  Scenario: Back button preserves selections
    Given I am on the enquiry form
    When I complete steps 1 through 3 with selections
    And I navigate back to step 1
    Then my previous selections should be preserved
    When I navigate forward again
    Then I should return to where I was

  @navigation
  Scenario: Progress indicator shows current step
    Given I am on the enquiry form
    Then I should see "Step 1 of 7" in the progress indicator
    When I complete step 1 and continue
    Then I should see "Step 2 of 7" in the progress indicator

