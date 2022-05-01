---
layout: page
title: YNAB SpreadSheet
description: Mimic simple YNAB's features on Google Spreadsheet
img: assets/img/Project7_thumbnail.jpg
importance: 1
category: fun
---

## Inspiration

I came to the US in late August. 
I live in an off-campus dorm (my monthly income couldn't afford the on-campus dorm).
I have to manage my money myself, unlike at home where my mom and my dad manage finance for the family.
I learn from both my friends and my seniors that a Thai scholar's monthly income is barely enough to survive a month.

About a year ago, I saw Phoom's post about the finance management app called [YNAB (You Need A Budget)](https://www.youneedabudget.com/). 
I saw he said it's a good app, so I decided to give it a try.
After I use its free-trial for a month:
It really helps me become more aware of my own budget.
Even though I used a bit more money than my monthly income, I really am satisfied with the result. (I believe I would've used a lot more money if I didn't keep track of my spending)

I would like to continue the subscription, but my monthly income is very scarce.
I had been thinking that I might be able to create a google spreadsheet that mimics the app's functions.
I barely have any experiences on MS-Excel or Google Spreadsheet; I know only few things like using an equal sign to trigger mathematical functions, or knowing what does clicking and dragging the bottom right of any cell do.
I also don't know much how to write scripts; the most prestige scripts I wrote is a shell-script for checking the correctness of my C++ program in a programming contest.
Despite all that, after the free-trial expires, I decided to give it a try.

## Implementation

In YNAB app, my monthly spendings are divided into categories, such as "Groceries", "Laundry", "Education", "Internet & Fee", "Dining Out", "Fun Money", etc.

For each category, I have to assign my current money into it, and those money will be the money I can spend on that category in this month.

For example, if I assign $150 to "Groceries", that means I place $150 of my monthly income for groceries, and I can only spend $150 on groceries in this month.

I started by create a spreadsheet with one sheet, with each cell of the first column (column A) contains a name of one of the categories.
Next, to keep track my spendings in each category, I need to create a sheet for each category.

In a sheet, I will keep track the information of each of my spending in that category, such as "Amount", "Payee", "Date", and "Description".
I assign the first 4 columns for each piece of information respectively.
For example, if I went to MOOYAH (an american hamburger restaurant) and brought a cheeseburger with $15.25, then the information I will enter in each column will be (Amount)"15.25", (Payee)"MOOYAH", (Date)"10/15/2021", and (Description)"Double Cheeseburger".
Each row in the sheet will be an information for each spending.
Therefore, I create a template sheet with the specification.
### The First Problem
The problem is, I need to do that for all 17 (SEVENTEEN) categories.

Having to do
1. Right Click on the template sheet
2. Click "Duplicate"
3. Right-Click on the duplicated sheet
4. Click "Rename"
5. Type the name of a category
6. Press Enter
7. Go Back to Main Sheet

17 times over and over would be an eternal pain.
So I decided to take a step back and think of what I need to do.

Everything boils down to the following problem description:
<blockquote>
You are given a spreadsheet. In the spreadsheet, there are two sheets. In the first sheet, each cell in the first column (column A) contains a name. The second sheet is a template sheet. Create a new sheet for each of the cell in the first column of the first sheet, where the name of the sheet is the name in the cell, and the information in the sheet is the same as the information in the template sheet (the second sheet)."
</blockquote>
<blockquote>
[Thai version] "ใน spreadsheet อันหนึ่ง มี sheet นึง โดยแต่ละเซลล์ในคอลัมน์แรก (คอลัมน์ A) นั้นเต็มไปด้วยชื่อ, และมีอีก Sheet นึงเป็น templete sheet. เราต้องการสร้าง sheet ใหม่ตามจำนวนชื่อในคอลัมน์ A ในชีทแรก และให้ทุกชื่อที่อยู่ภายในคอลัมน์นั้นไปเป็นชื่อของแต่ละ sheet ที่เราสร้าง และ sheet ที่เราสร้างทุกอันจะมีเนื้อความเหมือนกับ template sheet"
</blockquote>
I believe that I might be able to automate this problem.
However, I had no idea how to do it.
Since I don't know who to ask (I did attempt to ask some of my friends, but they didn't know either), I started googling.

I came across "Macro" and "Script Editor" function of Google Spreadsheet.
At first, I tried using `Tool > Macro > Record Macro` and `Tool > Macro > (The name of my recorded macro)`, but no matter how much I tried, it didn't work as I expected.

So, I resorted to `Tool > Script Editor` which I had no idea how to use it.

When I opened the script editor, I found the scripts of my failed recorded macros.

Each macro was written as a function.

I remembered from when I was googling that this was written in `JavaScript`. (or "[Apps Script](https://developers.google.com/apps-script)" to be more precise.)

I wanted to write a function "AddTemplate()" that iterates through all selected cells, and create a new sheet which its name is the text in the current cell and its content is the same as my template.
As I absolutely had zero experience on JavaScript, I had to keep googling and copy a piece from people's code on each of everything I want to do.

For instances,
1. How to iterate through each of the current selected cells? I adapted from [this stackoverflow thread](https://stackoverflow.com/questions/50185970/iterate-through-selected-cells-in-google-sheets?fbclid=IwAR0TgOydFPs0jmIxHOb0Kv2ksmBh7McjemM8wwf6Ynlhdsc812Z-RUWtX1Q).
2. How to iterate through every cell in a "range" in google spreadsheet? and what is "range"? I read and adapted from [the documentation apps script itself](https://spreadsheet.dev/iterate-through-every-cell-in-range-google-sheets-apps-script?fbclid=IwAR2CL5B8FPzAl2iv_KB997b54YWvto6QBMxku7JoeyqdpYdQS7FlnGl9L04)

My understanding of C++ and Java really helped me understanding these codes (the concept of for-loop, forEach-loop, and Object-Oritented Programming)
However, while I can read the code, I can't really write one.
And about how to create a new sheet and rename it, I used the piece of code of my failed macro.

After many attempts, lo and behold, it works! The sastification of creating my first script is really satisfying.
Now we have created 17 sheets for each of category. Let's move on the next part.

### The Second Problem
Since there is a lot of sheets, it is really hard to navigate from the main sheet to a specific category's sheet.
I want to link each cell that contains a category name in the main sheet to its corresponding sheet.
If we do it manually, the process will be like the following:
1) Click at a cell
2) Press ctrl+k
3) Click its corresponding sheet.
Doing this for 17 times would require 17*3 = 51 clicks(+presses), which is painstaking.
Just kidding! It's not that much of a work, but I wanted to try automating this process too. So, here we go!
"There is a spreadsheet, which contains several sheets inside. In one of the sheets, the cells in the first column contain the names of all other sheets. Link each of these cells to its correspending sheet."
[Thai version] "ใน spreadsheet อันหนึ่ง มี sheet หลายอัน โดยมี sheet นึงที่แต่ละ cell ในคอลัมน์แรก (คอลัมน์ A) เต็มไปด้วยชื่อของ sheet อื่น(นอกจาก sheet นี้)ทั้งหมดอยู่ เราอยาก link แต่ละ cell กับ sheet ที่มีชื่อเดียวกับชื่อที่ระบุใน cell นั้น ๆ"
I wanted to write a function "Linking()" that iterates through all selected cells, and link the cell to a sheet with the same name as the content in the cell.
As I still couldn't write code, I searched for more pieces of the code I needed:
1) How to add links to a cell in Spreadsheet? I adapted from https://spreadsheet.dev/add-links-to-a-cell-in-google...
2) How do I make it link to other sheets? Adapted from little each of these blogs
https://stackoverflow.com/.../hyperlink-to-a-specific-sheet
https://newbedev.com/linking-to-another-tab-in-google-sheets
https://stackoverflow.com/.../iterate-over-range-append...
This is a more complicated one for sure, as I had to learn how we originally add link to a cell using equal sign (=hyperlink("...")), and how to refer to a string variable in a string(?) (`${variable}`).
It took more time than the first problem, but it works!
It is getting more and more fun.
Now we have linked the cells to its coresponding sheet. The navigation has become much easier.
Just a little bit more, let's move on to the final part.
The only tedious thing left to do is to keep track of the total money spending on each of category.
In other words, I want to keep track of the sums of numeric values in "Amount" column of each category.
Doing this manually would be:
1) Click at a cell on the right of a name cell.
2) type '=SUM()'
3) Navigate to the name cell's corresponding sheet
4) Select the entire column A
5) Press Enter
6) Navigate back to the main sheet

### The Final Problem
<blockquote>
You are given a spreadsheet, which contains several sheets inside. In one of the sheets, the cells in the first column contain the names of all other sheets, and they also link to their corresponding sheets. Make the cells to the right of each cell of the first column correspond to the sum of all numberic values in its corresponding sheet's first column (column A).
</blockquote>
<blockquote>
[Thai Version] "ใน spreadsheet อันหนึ่ง มี sheet หลายอัน โดยมี sheet นึงที่แต่ละ cell ในคอลัมน์แรก (คอลัมน์ A) เต็มไปด้วยชื่อของ sheet อื่น(นอกจาก sheet นี้)ทั้งหมดอยู่ และแต่ละ cell ยัง link ไปยัง sheet ที่มีชื่อเดียวกับชื่อที่ระบุใน cell นั้น ๆ อีกด้วย เราอยากทำให้ cell ที่อยู่ทางขวาของแต่ละ cell (cell ในคอลัมน์ B ในแถวเดียวกัน) เป็นผลรวมของเลขในคอลัมน์ที่ A ทั้งคอลัมน์ใน sheet ที่ link กับ cell นั้น"
</blockquote>
Luckily this time, I got almost all the things I need from the previous problems.
This is what I searched for additionally:
1) How does each function work? What are their inputs? What are their outputs? I looked it up on devlopers.googles.com/apps-cript. For example, I want to know function 'getValue()' of 'sheet' object will return, so I searched for https://developers.google.com/.../refer.../spreadsheet/sheet
2) How to get a reference to any cell object, knowing its row and column? https://blog.gsmart.in/google-sheet-script-get-cell-value/
I did say that I know most of things I need for this problem.
However, this problem takes the longest time to debug out of all three (lmao), by a lot too.

## The Final Product
Here's the link to the finished spreadsheet (the scripts are available in 'Tool > Script Editor')
https://docs.google.com/.../1GrePsU8OO7W58bBz4W8y.../edit...
Thank you for reading!