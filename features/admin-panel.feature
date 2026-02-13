Feature: Admin Panel - Manage All Enquiries
  As an admin
  I want to view and manage all enquiries
  So that I can follow up with potential customers

  # This feature tests admin-specific functionality.
  # Requires admin test user (in Cognito "Admins" group).

  @admin @auth-required
  Scenario: Admin sees all enquiries
    Given I am logged in as an admin
    When I view the enquiries list
    Then I should see ALL submitted enquiries
    And I should see enquiries from different users

  @admin @auth-required
  Scenario: Admin can view enquiry details
    Given I am logged in as an admin
    When I view the enquiries list
    And I click on an enquiry to view details
    Then I should see the full enquiry information
    And I should see admin-only options

  @admin @auth-required
  Scenario: Admin can change enquiry status
    Given I am logged in as an admin
    And I am viewing an enquiry detail page
    When I change the status to "In Review"
    Then the status should be updated
    And I should see a success confirmation

  @admin @auth-required
  Scenario: Admin can add internal notes
    Given I am logged in as an admin
    And I am viewing an enquiry detail page
    When I add an internal note "E2E test note - can be deleted"
    Then the note should appear in the notes section
    And the note should show my name and timestamp

