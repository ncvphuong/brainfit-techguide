---
id: update-role
title: Update Role Rule
sidebar_label: Update Role Rule
sidebar_position: 5
---

## Updating a Role
Currently, two new views have been added: Student (Class) and CMv2 Class, mainly for the Trainer and AT roles. The mechanism has changed compared to before. Trainers assigned to a class will only be able to see information related to the kids in that specific class. The same applies to ATs.

And this table will show the permission of each role.
| View                    | SA   | ML   | MA   | MU   | CA   | TRN   | AT   |
|:------------------------|:-----|:-----|:-----|:-----|:-----|:------|:-----|
| Account List            | ✅   | ✅   | ✅   | ❌   | ✅   | ❌    | ❌   |
| SA List                 | ✅   | ❌   | ❌   | ❌   | ❌   | ❌    | ❌   |
| ML List                 | ✅   | ❌   | ❌   | ❌   | ❌   | ❌    | ❌   |
| MA List                 | ✅   | ✅   | ❌   | ❌   | ❌   | ❌    | ❌   |
| MU List                 | ✅   | ✅   | ✅   | ❌   | ❌   | ❌    | ❌   |
| CA List                 | ✅   | ✅   | ✅   | ❌   | ❌   | ❌    | ❌   |
| TRN List                | ✅   | ✅   | ✅   | ❌   | ✅   | ❌    | ❌   |
| Center List             | ✅   | ✅   | ✅   | ❌   | ❌   | ❌    | ❌   |
| Center Detail           | ✅   | ✅   | ✅   | ❌   | ❌   | ❌    | ❌   |
| AT List                 | ✅   | ✅   | ✅   | ❌   | ✅   | ✅    | ❌   |
| AT Detail               | ✅   | ✅   | ✅   | ❌   | ✅   | ✅    | ❌   |
| Class List              | ✅   | ✅   | ✅   | ❌   | ✅   | ✅    | ❌   |
| Class Detail            | ✅   | ✅   | ✅   | ❌   | ✅   | ✅    | ❌   |
| Parent List             | ✅   | ✅   | ✅   | ❌   | ✅   | ✅    | ❌   |
| Parent Detail           | ✅   | ✅   | ✅   | ❌   | ✅   | ✅    | ❌   |
| Student List            | ✅   | ✅   | ✅   | ❌   | ✅   | ✅    | ❌   |
| Student Detail          | ✅   | ✅   | ✅   | ❌   | ✅   | ✅    | ❌   |
| Student (Class)         | ✅   | ✅   | ✅   | ❌   | ✅   | ✅    | ✅   |
| Student (Class) Detail  | ✅   | ✅   | ✅   | ❌   | ✅   | ✅    | ✅   |
| Notes                   | ✅   | ✅   | ✅   | ❌   | ✅   | ✅    | ✅   |
| Progress Report         | ✅   | ✅   | ✅   | ❌   | ✅   | ✅    | ❌   |
| Input Scores            | ✅   | ✅   | ✅   | ❌   | ✅   | ❌    | ✅   |
| Monthly Progress Report | ✅   | ✅   | ✅   | ❌   | ✅   | ✅    | ❌   |
| Annoucement             | ✅   | ✅   | ✅   | ❌   | ✅   | ✅    | ❌   |
| CogMap                  | ✅   | ✅   | ✅   | ❌   | ✅   | ✅    | ❌   |
| CogMapv2                | ✅   | ✅   | ✅   | ❌   | ✅   | ✅    | ❌   |
| Merger Score CMv2       | ✅   | ✅   | ✅   | ❌   | ✅   | ❌    | ❌   |
| CogMapv2 (Class)        | ✅   | ✅   | ✅   | ❌   | ✅   | ✅    | ✅   |
| Report                  | ✅   | ✅   | ❌   | ❌   | ❌   | ❌    | ❌   |
| Courses                 | ✅   | ✅   | ✅   | ✅   | ✅   | ✅    | ❌   |
| Courses List            | ✅   | ✅   | ✅   | ✅   | ✅   | ❌    | ❌   |
| Courses Individual      | ✅   | ✅   | ✅   | ✅   | ✅   | ✅    | ❌   |
| Permission              | ✅   | ❌   | ❌   | ❌   | ❌   | ❌    | ❌   |
| Developer               | ✅   | ❌   | ❌   | ❌   | ❌   | ❌    | ❌   |
| AceyTot                 | ✅   | ✅   | ✅   | ❌   | ✅   | ✅    | ❌   |
| AceyBrain               | ✅   | ✅   | ✅   | ❌   | ✅   | ❌    | ❌   |
| Chat                    | ✅   | ✅   | ✅   | ❌   | ✅   | ✅    | ✅   |
| Chat - Resource         | ✅   | ✅   | ✅   | ❌   | ✅   | ✅    | ✅   |
| Chat - Room             | ✅   | ✅   | ✅   | ❌   | ✅   | ✅    | ❌   |
| Games                   | ✅   | ❌   | ✅   | ❌   | ✅   | ❌    | ❌   |
| Assessment              | ✅   | ❌   | ❌   | ❌   | ❌   | ❌    | ❌   |