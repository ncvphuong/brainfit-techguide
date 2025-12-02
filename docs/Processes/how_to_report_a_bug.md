---
sidebar_position: 1
title: How to Report a Bug
---

# How to Report a Bug

A well-written bug report helps developers understand and fix issues quickly. Follow this guide to submit effective bug reports.

## Bug Report Template

When reporting a bug, please include the following information:

### 1. Title
Write a clear, concise title that summarizes the issue.

**Example:**
-  "Login button unresponsive on mobile Safari"
- L "Button doesn't work"

### 2. Description
Provide a detailed description of what went wrong.

### 3. Steps to Reproduce
List the exact steps to recreate the issue:

1. Go to [specific page/location]
2. Click on [specific element]
3. Enter [specific data]
4. Observe the error

### 4. Expected Behavior
Describe what you expected to happen.

**Example:** "The login button should redirect to the dashboard."

### 5. Actual Behavior
Describe what actually happened.

**Example:** "The button shows a loading spinner indefinitely and doesn't redirect."

### 6. Environment Details
Include relevant system information:

- **Product/App:** (e.g., CogMap, AceyBrain, Smart Moves)
- **Browser/Device:** (e.g., Chrome 120 on Windows 11, Safari on iPhone 14)
- **Operating System:** (e.g., Windows 11, macOS 14, iOS 17)
- **App Version:** (if applicable)
- **User Role:** (e.g., Admin, Instructor, Student)

### 7. Screenshots/Videos
Attach screenshots or screen recordings showing the issue. Visual evidence is extremely helpful.

### 8. Additional Context
Include any other relevant information:
- Error messages (copy the exact text)
- Console errors (if technical user)
- Frequency (always happens, sometimes, once)
- Impact (blocking work, minor inconvenience)

## Example Bug Report

```markdown
**Title:** Unable to save student assessment scores in Admin panel

**Description:**
When attempting to save assessment scores for students, the save button
becomes disabled and no data is saved to the system.

**Steps to Reproduce:**
1. Log in as Admin user
2. Navigate to Admin > Input Assessment
3. Select student "John Doe" from the dropdown
4. Enter scores in all required fields
5. Click "Save" button
6. Observe that button becomes disabled but no success message appears

**Expected Behavior:**
The scores should be saved successfully and a confirmation message
should appear: "Assessment saved successfully"

**Actual Behavior:**
The save button becomes disabled/grayed out, no confirmation message
appears, and when refreshing the page, the entered scores are not saved.

**Environment:**
- Product: Admin Portal
- Browser: Chrome 120.0.6099.129
- Operating System: Windows 11 Pro
- User Role: Master Admin
- Account: admin@brainfit.com

**Screenshots:**
[Attached: screenshot showing disabled save button]
[Attached: screenshot of browser console showing error]

**Additional Context:**
- This happens 100% of the time for all students
- Started occurring after the system update on Dec 1, 2025
- Console error shows: "TypeError: Cannot read property 'id' of undefined"
- Blocks all assessment input workflow - HIGH PRIORITY
```

## Where to Submit Bug Reports

Contact your project manager or technical lead with your bug report, or submit through your designated bug tracking system.

## Priority Levels

Help us prioritize by indicating severity:

- **Critical:** System down, data loss, security issue
- **High:** Major feature broken, blocking work
- **Medium:** Feature partially working, workaround available
- **Low:** Minor issue, cosmetic problem

## Tips for Better Bug Reports

1. **Be specific** - Avoid vague descriptions
2. **One bug per report** - Don't combine multiple issues
3. **Check for duplicates** - Search if the bug was already reported
4. **Update if needed** - Add more information if requested
5. **Be patient** - Developers will investigate and respond

Thank you for helping us improve our products!
