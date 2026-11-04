---
id: bhq-sch-public-availability
title: Public class availability page and Brian
sidebar_label: Public availability and Brian
sidebar_position: 6
---
# Public class availability page and Brian

Each centre can have a **public link** to a page that shows which weekly class slots still have space. Nobody has to log in to open it. The page also has **Brian**, a small assistant that answers visitors' questions about the same availability. This guide covers what the page shows, how staff manage the link, what Brian can and cannot do, and the two controls only a Super Admin has.

**Watch (about 2 minutes):**

<video controls preload="metadata" width="100%">
  <source src="/video/hq/sch-public.mp4" type="video/mp4" />
</video>

The address looks like `scheduling.brainfitstudio.com/public/availability/` followed by a long secret code. The code is different for every centre.

## Who sees the link and what it shows

- **Anyone who has the link** can open the page. There is no login. Treat the link like a password: send it only to the people who should see it. If it is shared by mistake, make a new link (below).
- The page lists the **active, published class groups of the current term**: the class, the day, the time, and how many places are taken out of the capacity (for example 3/6). A full class is marked **Full** in red.
- **Timezone:** times are shown in the visitor's own timezone, so a class can appear on the neighbouring day for someone far away.
- **No personal data:** no student names, no teacher names and no ids appear on the page.
- **On a phone** the page is a list by day. On a computer it is a weekly calendar.

![What a visitor sees on a computer](./img/sch-public-2.png)
![The same page on a phone](./img/sch-public-3.png)

The numbers can change at any time. The page tells visitors to contact the centre to enrol: it never reserves a place.

## Manage the link (staff)

Open **Class Groups → Class Availability** and select the centre at the top. Click **Public Link** at the top right of the page. Super Admin, Master Licensee, Master Admin and Centre Admin can use it.

![The Public Link button](./img/sch-public-1.png)

A window opens with the link for the selected centre. Close it with the X, by clicking outside it, or with Esc.

![The Public link window](./img/sch-public-4.png)

- **Create link** appears if the centre has no link yet.
- **Copy link** copies the address to send to families.
- **Turn off** stops the page showing anything. **Turn on** opens it again with the same address.
- **New link** makes a new address. The old address stops working at once.

## Brian, the assistant on the page

Visitors open Brian with the round button at the bottom right of the page.

- Brian only knows **this centre's availability**. It cannot see names, change anything, enrol anyone or promise a place. It tells the visitor to contact the centre.
- Brian answers in **English, Vietnamese, Bahasa Indonesia, Thai or Simplified Chinese**, in the language the visitor writes in.
- A question can be up to **300 characters**. There are limits on how many questions one visitor can ask in a short time.
- The chat tells visitors that **chats are recorded** and not to share personal details.

![Brian answers a question in English](./img/sch-public-5.png)
![Brian answers in Vietnamese](./img/sch-public-6.png)

If Brian cannot answer (for example it is switched off, or the monthly limit is reached), the page still shows the availability.

## Super Admin only: Brian ON/OFF and the conversations log

Two more controls appear in the same Public link window for a Super Admin:

- **Brian chat: ON / OFF** switches Brian for the selected centre. The page itself keeps working when Brian is off.
- **Brian conversations** opens the log of every conversation: the centre, the date, and each question and answer. It also shows this month's spend against the **30 USD monthly cap**. When the cap is reached, Brian stops answering until the next month and the availability page keeps working.

![Brian chat ON/OFF and Brian conversations in the Public link window](./img/sch-public-7.png)
![The conversations log, one conversation opened](./img/sch-public-8.png)

## Safety

- The link is a secret address, not a login. Anyone who has it can see the page, so use **New link** if it spreads further than you wanted.
- The page shows only class names, times and the enrolled and capacity numbers. Never put personal details in a class name.
- Brian's chats are recorded. Tell visitors not to type personal details into the chat.
