# Taking Attendance Guide

This guide explains how to take and manage student attendance in BrainFit Scheduling. Attendance can be managed from two locations: the Class Group Detail view and the Calendar view.

---

## Who Can Take Attendance

**All roles can take attendance**, including:
- Super Admin
- Master Licensee
- Center Admin
- **Trainers** (this is one of the few edit actions trainers can perform)

---

## Attendance Statuses

| Status | Description | Color |
|--------|-------------|-------|
| **Assigned** | Student is enrolled but session hasn't started | Blue |
| **Present** | Student attended the session | Green |
| **Absent** | Student did not attend | Red |
| **Excused** | Student missed with valid excuse | Yellow |

---

## Method 1: Class Group Detail View

This is the most common method for taking attendance.

### Step-by-Step

1. Navigate to **Class Groups** from the sidebar
2. Click on your class group to open the **Class Group Detail** page
3. In the **Sessions** section, find the session you want to mark attendance for
4. Click the **attendance icon** (👥 users icon) next to the session

### Attendance Modal

When you open the attendance modal, you'll see:

| Column | Description |
|--------|-------------|
| **Student** | Student name |
| **Attendance** | Status dropdown (Assigned/Present/Absent/Excused) |
| **Check-in Time** | When student was marked present |
| **Notes** | Optional notes field |

### Taking Attendance

1. For each student, select the appropriate status from the dropdown:
   - **Present** - Student is in class
   - **Absent** - Student didn't show up
   - **Excused** - Student has a valid reason for missing

2. Optionally add notes (e.g., "Left early", "Arrived late")

3. Click **Save Changes**

### Quick Tips

- **Present** automatically records the check-in time
- You can update attendance multiple times if needed
- Changes are saved immediately when you click Save

---

## Method 2: Calendar View

For a visual overview and quick access to sessions.

### Step-by-Step

1. From the Class Group Detail page, click **Calendar View** (green button)
2. Navigate to the date with sessions you need
3. Click on a session in the calendar
4. In the session details popup, click **View Details**
5. This takes you back to Class Group Detail where you can take attendance

### Calendar Legend

The calendar shows session capacity status:

| Color | Meaning |
|-------|---------|
| Green border | Has capacity available |
| Orange border | Using expanded capacity |
| Red border | At full capacity |
| Gray | Completed or Cancelled |

### Calendar Views

| View | Best For |
|------|----------|
| **Month** | Overview of all sessions |
| **Week** | Planning weekly attendance |
| **Day** | Detailed daily view |
| **List** | Quick list of upcoming sessions |

---

## Understanding Session Status

Sessions automatically update their status based on time:

| Status | Meaning |
|--------|---------|
| **Scheduled** | Future session |
| **In Progress** | Session is currently happening |
| **Completed** | Past session |
| **Cancelled** | Session was cancelled |

---

## Best Practices

### Before Class
1. Open the session in attendance modal
2. Review the student list
3. Note any expected absences

### During Class
1. Mark students as **Present** when they arrive
2. Add notes for late arrivals: "Arrived at [time]"
3. Update as students check in

### After Class
1. Mark any remaining as **Absent** or **Excused**
2. Add notes for early departures
3. Save changes

### For Excused Absences
1. Select **Excused** status
2. Add a note explaining the reason (e.g., "Medical appointment", "Family emergency")
3. This helps track legitimate absences separately from no-shows

---

## Viewing Attendance History

### For a Specific Student

1. In the Class Group Detail, find the student in the **Students** section
2. Click the **calendar icon** (📅) next to their name
3. View their complete session history showing:
   - All sessions they were assigned to
   - Attendance status for each
   - Summary counts (Present, Absent, Excused)

### For a Specific Session

1. Open the attendance modal for the session
2. View all students and their current attendance status

---

## Managing Students in Sessions

### Adding a Student to a Session

1. Find the session in the Sessions list
2. Click the **Add/Remove Students** icon (➕ user-plus)
3. In the modal:
   - **Left column**: Available students (not in session)
   - **Right column**: Assigned students
4. Click **Add** button next to students you want to add

### Removing a Student from a Session

1. Click the **Add/Remove Students** icon for the session
2. In the **Assigned Students** column (right)
3. Click **Remove** next to the student
4. Confirm the removal

---

## Attendance Reports

Attendance data is tracked in the system and can be used for:
- Student progress reports
- Session history tracking
- Re-enrollment decisions

### Viewing Summary Stats

When you open a student's session history, you'll see:
- **Total Sessions**: Number of sessions assigned
- **Present**: Number attended
- **Absent**: Number missed (unexcused)
- **Excused**: Number with valid excuses
- **Assigned**: Upcoming sessions

---

## Common Scenarios

### Scenario 1: Student Arrives Late

1. Mark as **Present**
2. Add note: "Arrived late - 10:15am (session started 10:00am)"

### Scenario 2: Student Leaves Early

1. Mark as **Present**
2. Add note: "Left early at 11:30am"

### Scenario 3: Parent Notified of Absence in Advance

1. Mark as **Excused**
2. Add note: "Parent notified - family event"

### Scenario 4: Student No-Show (No Contact)

1. Mark as **Absent**
2. Optionally add note: "No show, no contact"

### Scenario 5: Session Cancelled

1. The session status should already show **Cancelled**
2. No attendance needed for cancelled sessions

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't see attendance icon | Make sure you're logged in |
| Student not in list | Student may not be assigned to this session - use Add/Remove Students |
| Can't change status | Check if session is not cancelled |
| Attendance not saving | Ensure you click "Save Changes" after making updates |

---

## Quick Reference

### From Class Group Detail
```
Sessions section > Click 👥 icon > Update status > Save Changes
```

### From Calendar View
```
Click session > View Details > Click 👥 icon > Update status > Save Changes
```

### Attendance Status Shortcuts
- **A** = Assigned (default for future sessions)
- **P** = Present (student attended)
- **X** = Absent (no-show)
- **E** = Excused (valid absence)

---

*Last Updated: December 2025*
