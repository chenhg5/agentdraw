# Product Flow: Registration and Login

A product has one authentication entry point. From the auth page, a user chooses whether they already
have an account.

If the user does not have an account, they enter registration details. The system validates the
email, password strength, and required profile fields. If validation fails, the user sees field-level
feedback and returns to edit the form. If validation passes, the system creates the account, verifies
the email when required, and continues to session creation.

If the user already has an account, they enter credentials. The system checks identity, account
status, and optional second-factor verification. If authentication fails, the user sees a safe error
message and can retry. If authentication passes, the system creates a session.

Both successful registration and successful login join at the same session creation step. After the
session is created, the user enters the app. Security events are logged in both success and failure
paths.

The flow should show start/end states, decision points, branch labels, retry loops, and the shared
session handoff.

