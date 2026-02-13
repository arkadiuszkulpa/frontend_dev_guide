Feature: Enquiry Form Submission (CORE)
  As a potential customer
  I want to submit my website requirements
  So that my enquiry is saved and I receive confirmation

  # This is the CORE feature - if this fails, the app is broken.
  # Tests that form submission actually SAVES data to the database.

  Background:
    Given I am on the enquiry form

  @critical @smoke @core
  Scenario: Form submission saves enquiry and shows confirmation
    # Complete the form with test data
    When I complete the full enquiry form with test data
    And I submit the enquiry
    Then I should see the thank you page
    And the enquiry should be saved to the database

  @critical @core
  Scenario: Submitted enquiry is retrievable by user
    # This tests the full loop: submit → login → view
    Given I have completed and submitted an enquiry
    When I login as the test user
    And I navigate to My Enquiries
    Then I should see my recently submitted enquiry
    And the enquiry details should match what I submitted

