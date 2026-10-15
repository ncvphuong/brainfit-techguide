---
id: manage-template-assessment
title: Management Template Assessment
sidebar_label: Management Template Assessment
sidebar_position: 1
slug: /Guideline/Admin/manage-template-assessment
---

This feature is for SA, ML, Master Admin, Center Admin

## Finding a Template (Search & Filter)

The Templates list can be searched by name and filtered by [Program](../Program/manage-program.md) — useful
once you have many templates across different Programs.

![Assessment Templates list, showing the Program column and "All programs" filter](./img/manage-template-assessment-program-column.png)

- Use the **Search by name** box and/or the **All programs** dropdown, then click **Filter**.
- The **Program** column shows each template's attached Program, or **"Not assigned"** if none is set yet.

## Creating a New Assessment Template

1.  **Navigate** to the [ACP](https://acp.brainfitstudio.com/acp).
2.  Find the **Assessments** menu in the navigation menu, then click **Templates**.

![Assessments menu, expanded to Templates](./img/nav-assessments-templates.png)

3.  Click the **Add** button.

![Image](./img/manage-template-assessment-5.png)

4.  Fill in the following information for each field:
    * **Name:** Enter the desired name for the template.
    * **Description:** Provide a brief description of the template.
    * **Program:** Optional. Attaches this template to one of your own Master Licensee's
      [Programs](../Program/manage-program.md) — see the note below for what this affects. Leave as
      **"-- No program assigned --"** if you don't need it yet; it can be set later from **Edit**.
    * **Template is active** checkbox: Check to enable the template; uncheck to disable it.

![Image](./img/manage-template-assessment-program-field.png)

5.  Click **Create Assessment template** to save the new template.

:::info Program is manual-only, and affects the printed PDF header
There's no automatic matching or bulk backfill — every template's Program is set by hand, at whatever pace
you choose. Once a Program is attached, printed Assessment Report Card PDFs for that template show that
Program's Type in the header (e.g. "BrainFit Scholar") instead of the generic default. See
[Assessment Print-Out](../Assessment_PrintOut/download-assessment-report-card.md) for what this looks like
on the actual PDF, and [Managing Programs](../Program/manage-program.md) for how to set up a Program first.
:::

## Editing a Assessment Template
1.  **Navigate** to the [ACP](https://acp.brainfitstudio.com/acp).
2.  Find the **Assessments** menu in the navigation menu, then click **Templates**.

![Assessments menu, expanded to Templates](./img/nav-assessments-templates.png)

3.  Click the **Edit** button.

![Image](./img/manage-template-assessment-7.png)

4.  Fill in the following information for each field:
    * **Name:** Enter the desired name for the template.
    * **Description:** Provide a brief description of the template.
    * **Program:** Optional — see the note above under "Creating a New Assessment Template" for what
      attaching a Program does to the printed PDF header.
    * **Template is active** checkbox: Check to enable the template; uncheck to disable it.

![Image](./img/manage-template-assessment-6b.png)

5.  Click **Update Assessment template** to save .

## Setting Up a Template

1.  **Navigate** to the [ACP](https://acp.brainfitstudio.com/acp).
2.  Find the **Assessments** menu in the navigation menu, then click **Templates**.

![Assessments menu, expanded to Templates](./img/nav-assessments-templates.png)

3.  Click the **Setup Template** button (cog icon) for the template you want to configure.

![Image](./img/manage-template-assessment-8.png)

4.  Click within the **"Assessment area name"** field.

![Image](./img/manage-template-assessment-11.png)

5.  Type the desired assessment area name (e.g., "Emotion").
6.  Click **Add Assessment Area**.

![Image](./img/manage-template-assessment-12.png)

7.  For each assessment area, click **Add Sub-Area**.

![Image](./img/manage-template-assessment-13.png)

8.  Fill in the following information for each sub-area:
    * **Title:** Enter the name of the sub-area.
    * **Criteria:** List the criteria associated with this sub-area (one criterion per line).

![Image](./img/manage-template-assessment-13a.png)

9.  Click **Save** to apply the template setup.
10. Click **Generate Lessons**.

![Image](./img/manage-template-assessment-15.png)

11. Fill in the following information:
    * **From Lesson Number:** Enter the starting lesson number.
    * **To Lesson Number:** Enter the ending lesson number.
    * **Lesson Titles (one per line):** Optionally enter specific titles for each lesson. If left blank, the system will use default titles (e.g., Lesson 1, Lesson 2).

![Image](./img/manage-template-assessment-16.png)

12. Click **Generate**.
13. In the **Associated Classrooms** section, you can view a list of classrooms currently attached to this template, and detach any of them. To attach a new classroom, use **Classroom Templates** in the Assessments menu instead — the "Attach Classroom" panel that used to be on this page has been removed.

![Image](./img/manage-template-assessment-19.png)



## Creating Criteria

1.  **Navigate** to the [ACP](https://acp.brainfitstudio.com/acp).
2.  Find the **Assessments** menu in the navigation menu, then click **Criteria**.

![Assessments menu, expanded to Criteria](./img/nav-assessments-criteria.png)

3.  Click **New Criterion**.

![Image](./img/manage-template-assessment-20.png)

4.  Enter the name for the new criterion.

![Image](./img/manage-template-assessment-21.png)

5.  Click **Save**.

<!-- ## Managing Classroom Templates

1.  Click **Classroom Templates** in the navigation menu.
2.  Click **All Templates**.

![Image](./img/manage-template-assessment-22.png)


3.  The Classroom Assessment Templates will be displayed in a table format, showing complete information about the assigned templates for each classroom. -->


