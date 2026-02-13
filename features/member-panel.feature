Feature: Member Panel - View Own Enquiries
  As a user who submitted an enquiry
  I want to view my submission
  So that I can track its progress

  # This feature tests the member's ability to view their own enquiries.
  # Requires authenticated test user.

  @member @auth-required
  Scenario: User can view their own enquiries
    Given I am logged in as a regular user
    When I navigate to My Enquiries
    Then I should see enquiries list
    And I should only see enquiries submitted with my email

  @member @auth-required
  Scenario: User can view enquiry details
    Given I am logged in as a regular user
    And I have at least one submitted enquiry
    When I navigate to My Enquiries
    And I click on an enquiry to view details
    Then I should see the full enquiry information
    And I should see the enquiry status

  @member @auth-required
  Scenario: User cannot see other users' enquiries
    Given I am logged in as a regular user
    When I navigate to My Enquiries
    Then I should NOT see other users' enquiries

