---
id: print-assessment-report-card-acp
title: How to Print Assessment Report Cards from ACP
sidebar_label: How to Print Assessment Report Cards from ACP
sidebar_position: 2
---
## Printing Assessment Report Cards from ACP

This feature is for SA, ML, CA, Trainer

[ACP](https://acp.brainfitstudio.com/acp) can generate the same branded PDF report cards as
[Teacher Tool](./download-assessment-report-card.md), directly from a class's Input Assessment page —
useful when you're already working in ACP and don't want to switch apps.

### Print for a class

1.  **Navigate** to [ACP](https://acp.brainfitstudio.com/acp) → **Class**, then open a class's
    **Input Assessment** page (see [Input Student Assessment Data](../Assessment_Tracker/input-assessment.md)
    for the full path there).
2.  Once the student table loads, two buttons appear above it:
    - **Print Selected** — prints only the students checked in the table below.
    - **Print All Students** — prints every student in the classroom, current and historical, regardless
      of which page of the table you're on.
3.  For **Print Selected**: tick the checkbox next to each student you want, then click **Print Selected**.
    For **Print All Students**: just click it — it will ask you to confirm first, since it can be a large
    batch.
4.  A **"Preparing Assessment Report(s)..."** window appears while the reports are generated. For larger
    groups this shows batch progress — see **Batched downloads for large classes** below.
5.  The file(s) download automatically once ready:
    - **One student, one started template** → a single PDF.
    - **More than one student, or more than one started template for a student** → a `.zip` file
      containing one PDF per report.

### "Print Selected" only sees the current page

The student table is paginated (20 per page), and **Print Selected** only picks up checkboxes on the page
you're currently viewing. If you need students from more than one page, either page through and check more
before printing, or use **Print All Students** instead — it isn't limited by pagination at all.

### Batched downloads for large classes

The print service renders PDFs one at a time, so a single request for a whole class of ~50+ students can
time out. To avoid that, both **Print Selected** and **Print All Students** split the download into
batches of **15 students** and download each batch as its own `.zip` file, one after another, instead of
one giant request.

- You'll see the progress update in the preparing window: **"Preparing batch 2 of 4 (15 students)..."**.
- Each batch's file downloads as soon as it's ready — you don't need to wait for every batch before the
  first one appears in your downloads.
- A selection of 15 students or fewer is unaffected — it still downloads as a single file, same as before.
- This matches how [Teacher Tool's batched downloads](./download-assessment-report-card.md#batched-downloads-for-large-classes)
  work, for the same reason.

### A few things to know

- **One PDF per template.** If a student has more than one assessment template (e.g. Term 1 and Term 2),
  each prints as its own separate PDF — never merged into one document.
- **Only templates currently assigned to the student's classroom are included.** If a student has changed
  classroom or level, older classrooms' templates no longer show up in their print-out — this matches what
  the Input Assessment screen itself shows for that student.
- **Not-started templates** print a report showing **"Assessment not available"** for that student/template
  — this is expected, not an error.
- Each PDF is named `{Center}_{Student Name}_Assessment_Report_{Template Name}.pdf`, same convention as
  Teacher Tool, so files stay identifiable even after unzipping a large batch.

### Program-based report header

Same as Teacher Tool: the header text on the printed PDF depends on whether the template has a
[Program](../Program/manage-program.md) attached.

- **Template has a Program attached:** the header reads **"BrainFit `Type`"**, where `Type` is that
  Program's Type — one of **Junior**, **Scholar**, **Baby**, or **Premium** (e.g. "BrainFit Scholar").
- **Template has no Program attached** (the default for most templates, since Program assignment is
  manual): the header falls back to a generic **"BrainFit"**.

To get the branded header, attach a Program to the template first — see
[Managing Assessment Templates](../Assessment_Tracker/manage-template-assessment.md) and
[Managing Programs](../Program/manage-program.md).
