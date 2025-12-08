# How to Setup for New Term

This guide walks you through setting up BrainFit Scheduling for a new term, from preparing classes in ACP to creating class groups and managing student enrollments.

---

## Overview

Setting up for a new term involves three main steps:

| Step | Description | Location |
|------|-------------|----------|
| **1. Setup ACP Classes** | Prepare classes in BrainFit HQ (ACP) for the new term | BrainFit HQ System |
| **2. Create Class Groups** | Create class groups in BrainFit Scheduling | BrainFit Scheduling |
| **3. Manage Student Changes** | Handle students joining late or changing groups | BrainFit Scheduling |

> ⏱️ **Timeline Recommendation**: Complete Steps 1-2 before the term starts. Step 3 is ongoing throughout the term.

---

## Step 1: Setup ACP Classes for New Term

Before using BrainFit Scheduling, you must prepare your classes in the **BrainFit HQ (ACP)** system.

### Important: Clone, Don't Reuse

> ⚠️ **CRITICAL**: Always **clone** classes for a new term rather than reusing existing classes.

**Why Clone?**
- Preserves historical data from previous terms
- Prevents confusion between current and past enrollments
- Allows proper term-based reporting
- Maintains data integrity for billing and attendance records

### Requirements Before Setting Up Scheduling

At the time of creating class groups in BrainFit Scheduling:

✅ **All classes should be ready with students enrolled**

While it's understood that:
- Some students may join later in the term
- Some students may change class groups mid-term

The **majority of students should be enrolled** at the time you set up the class groups. This ensures:
- Accurate capacity planning
- Easier bulk enrollment of students to sessions
- Better scheduling efficiency

### Step-by-Step: Prepare ACP Classes

1. **Log in to BrainFit HQ (ACP)**
2. **Navigate to Classes**
3. **Clone previous term's classes** (do NOT reuse):
   - Select the class from the previous term
   - Use the "Clone Class" function
   - Update the term dates for the new term
   - Rename if needed (e.g., "SmartFit T1 2025" → "SmartFit T2 2025")

4. **Enroll Students**:
   - Add all confirmed students for the new term
   - Include re-enrolling students from the previous term
   - Add new students joining the program

5. **Assign Trainers**:
   - Assign all trainers who will teach this class
   - Verify trainer availability and schedules

6. **Verify Class Details**:
   - Check class name, term dates, and center assignment
   - Confirm student count matches expectations
   - Verify all trainers are assigned

> 📋 **Checklist**: Before moving to Step 2, ensure:
> - [ ] New term classes are cloned (not reused)
> - [ ] Majority of students are enrolled
> - [ ] All trainers are assigned
> - [ ] Term dates are correct
> - [ ] Class details are accurate

---

## Step 2: Create Class Groups in BrainFit Scheduling

Once your ACP classes are ready, follow this guide to create class groups:

👉 **[See Full Guide: Manage Class Groups](./manage-class-group.md)**

### Quick Summary

The Manage Class Groups guide covers:

1. **Creating Class Groups**
   - Navigate to Classes > Select Class > Create Class Group
   - Fill in basic information (name, type, description, color)
   - Set term period (start and end dates)
   - Configure capacity settings
   - Assign teachers and students

2. **Creating Session Templates**
   - Define recurring weekly session patterns
   - Set day of week, start time, and end time
   - Configure location and capacity

3. **Generating Sessions**
   - Generate actual session instances from templates
   - Set date range (term start to term end)
   - Enable "Auto-assign students to sessions" option
   - Skip dates that already have sessions

4. **Publishing**
   - Review generated sessions
   - Publish the class group when ready for parents to view

### Key Settings to Consider

| Setting | Recommendation |
|---------|----------------|
| **Term Dates** | Match ACP class term dates exactly |
| **Maximum Participants** | Based on class capacity (typical: 6-8) |
| **Expanded Capacity** | Allow 2-3 more for session changes |
| **Max Change Requests** | Typical: 3-5 per student per term |
| **Auto-assign Students** | ✅ Enable when generating sessions |

### Best Practices for New Term Setup

1. **Set up class groups while unpublished**
   - Create the group
   - Add templates and generate sessions
   - Review everything carefully
   - Only publish when ready

2. **Use "Auto-assign students to sessions"**
   - When generating sessions, enable this option
   - Saves time bulk-enrolling students
   - Ensures all students are in all sessions

3. **Generate all term sessions at once**
   - Set start date = term start
   - Set end date = term end
   - Select all templates
   - Generate once for the entire term

4. **Review before publishing**
   - Check calendar view
   - Verify all students are enrolled
   - Confirm session times are correct
   - Test attendance features

---

## Step 3: Managing Student Changes During the Term

Throughout the term, you'll need to handle students joining late or changing groups.

👉 **[See Full Guide: Manage Students](./manage-students.md)**

### Common Scenarios

#### Scenario A: Student Joins Mid-Term

**When**: A new student enrolls after the term has started

**Steps**:
1. **In BrainFit HQ (ACP)**: Enroll the student in the class
2. **In BrainFit Scheduling**:
   - Go to Class Group Detail page
   - Click **Assign Students** button
   - Select the new student
   - Click **Assign Selected Students**
3. **Sync to Sessions**:
   - Click **Sync Student Enrollments** in Quick Actions
   - This adds the student to all future sessions
4. **Result**: Student is enrolled in all remaining sessions

#### Scenario B: Student Unenrolls Mid-Term

**When**: A student leaves the program before term ends

**Steps**:
1. **In BrainFit HQ (ACP)**: Unenroll the student from the class
2. **In BrainFit Scheduling**:
   - Go to Class Group Detail page
   - Find the student in Students section
   - Click the **X** button next to their name
   - Confirm removal
3. **Important**: Student remains in past session attendance records (for historical data)
4. **Optional**: Manually remove from future sessions if needed

#### Scenario C: Student Changes Class Group

**When**: A student needs to move to a different group within the same term

**Steps**:
1. **From Old Group**:
   - Go to old Class Group Detail
   - Remove student from group (X button)
2. **To New Group**:
   - Go to new Class Group Detail
   - Click Assign Students
   - Select the student
   - Assign Selected Students
3. **Sync to Sessions**:
   - In new group, click Sync Student Enrollments
4. **Result**: Student is moved to new group and enrolled in future sessions

#### Scenario D: Student Needs Different Session Schedule

**When**: Student can't attend all sessions, needs specific days only

**Steps**:
1. **Add to Group**:
   - Assign student to the class group (as usual)
2. **DON'T Sync** - Instead:
   - Go to each specific session the student CAN attend
   - Click the **Add/Remove Students** icon (➕)
   - Add the student to that session only
3. **Result**: Student is only enrolled in selected sessions

---

## New Term Setup Checklist

Use this checklist to ensure you don't miss any steps:

### Before Term Starts

- [ ] **ACP Classes Ready**
  - [ ] Classes cloned for new term (not reused)
  - [ ] Majority of students enrolled
  - [ ] All trainers assigned
  - [ ] Term dates correct

- [ ] **Class Groups Created**
  - [ ] Class groups created for all classes
  - [ ] Capacity settings configured
  - [ ] Teachers and students assigned
  - [ ] Session templates created
  - [ ] Sessions generated for full term
  - [ ] Auto-assign students enabled during generation
  - [ ] Groups kept unpublished during setup

- [ ] **Review and Verification**
  - [ ] Calendar view checked for all groups
  - [ ] Student counts verified in sessions
  - [ ] Session times confirmed with trainers
  - [ ] Attendance features tested

### On Term Start Day

- [ ] **Publish Class Groups**
  - [ ] Final review of all sessions
  - [ ] Publish all class groups
  - [ ] Confirm parents can see sessions in PBC

### Throughout the Term

- [ ] **Handle Late Enrollments** (follow Step 3)
- [ ] **Process Unenrollments** (follow Step 3)
- [ ] **Manage Group Changes** (follow Step 3)
- [ ] **Monitor Reenrollment Report** for next term planning

---

## Common Questions

### Q: Can I set up scheduling before all students are enrolled in ACP?
**A:** Not recommended. While you can add students later, it's more efficient to have the majority enrolled before creating class groups. You'll spend less time on manual syncing and adjustments.

### Q: What if I forgot to enable "Auto-assign students" when generating sessions?
**A:** No problem! Just use the **Sync Student Enrollments** button in Quick Actions to add all group students to all future sessions.

### Q: Should I delete class groups from the previous term?
**A:** No. Keep them for historical reporting. Simply create new class groups for the new term. If you want to hide old groups, unpublish them or filter by term dates.

### Q: Can I reuse the same class group for a new term?
**A:** Not recommended. It's better to create a fresh class group for each term to maintain clear term boundaries and reporting accuracy.

### Q: What happens if a student is in ACP but not in the scheduling class group?
**A:** They won't appear in any sessions in BrainFit Scheduling. They'll only show up in ACP reports. Make sure to assign them to the class group if they need scheduled sessions.

### Q: How do I handle students who switch between groups frequently?
**A:** Consider using **Session Change Requests** instead of manually moving them between groups. This preserves history and allows parents to make requests themselves through the Parent Booking Center (PBC).

---

## Timeline Example

Here's a typical timeline for setting up a new term:

| Time Before Term | Task |
|------------------|------|
| **3-4 weeks** | Clone classes in ACP, begin student enrollments |
| **2-3 weeks** | Finalize student enrollments in ACP |
| **1-2 weeks** | Create class groups in Scheduling |
| **1 week** | Create session templates and generate sessions |
| **3-5 days** | Review calendar, verify enrollments, keep unpublished |
| **1-2 days** | Final checks, test attendance features |
| **Term Start** | Publish class groups, notify parents |

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Students not showing when creating group | Not enrolled in ACP class | Enroll in ACP first, then refresh Scheduling |
| Can't generate sessions | No templates created | Create session templates first |
| Students not in sessions after generation | Auto-assign not enabled | Use Sync Student Enrollments |
| Too many students for capacity | Enrollment exceeds capacity | Increase capacity settings or create additional groups |
| Parent can't see sessions | Group not published | Publish the class group |

---

## Related Guides

- **[Manage Class Groups](./manage-class-group.md)** - Detailed guide on creating and managing class groups
- **[Manage Students](./manage-students.md)** - How to add/remove students and sync enrollments
- **[Take Attendance](./take-attendance.md)** - How to mark attendance for sessions

---

*Last Updated: December 2025*
