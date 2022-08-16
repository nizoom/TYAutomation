# TYAutomation
The TY Automation program was built for a non-profit organization to automate the process of sending Thank You emails to online donors.

## Goal 
The goal for this project was to take writing these emails off the plate of the organization's director in anticipation of the holiday season, 
when gifts are most frequent. The resulting program freed up her time to dedicate attention to other parts of the organization. 

## Program Operation

This automation program was built in NodeJS and is initiated when a Google Cloud scheduled cron job hits an endpoint on a Heroku project where the program is hosted. The program begins by querying the donation widget’s API to see if there were any donations made since the last check. If there were, the program sorts them into three categories: new donor, recurring, and a donation in honor of someone else. Each category corresponds to a specific TY email template. For example, a new donor receives an email saying something like “Welcome to the [org name] family,” whereas a recurring donor would get an email saying “thank you for continuing to support us…” Those who donated in honor of someone would generate two emails. One to the donor and the other to the honoree.

In order to categorize the donations, a function queries the donor endpoint of the gift widget’s API to determine the donation history of that giver. If they’ve given before, then this particular donation will generate a recurring donor TY email, otherwise they will get a new donor TY email.

The changing language is finalized through setting dynamic strings based on criteria from each donation. This dynamic language included phrasing how the email would begin if there are multiple givers (from a couple for example). The dynamic strings in honoree emails were determined by factors such as, if the honoree was different from the recipient. This situation could occur if the tribute was made in memory of someone who had passed away (an option the widget provides). All this dynamic language is saved as properties of the donation object.

Once the donation types and language are set, the list of donations are passed to an HTML template built with Handlebars, a templating library. With Handlebar templates you pass in the dynamic information that was described above to create a filled-out TY email. I also included inline CSS styling and images from the organization. The letter is then sent via NodeMailer (a library for programmatically sending emails).
I set up a daily cron job to hit an endpoint on an ExpressJS app. The Express app queries their donation widget API which responds with the donations from the day. 
The program will then define the gifts by donor category (new, recurring, monthly, and in tribute). 
The assessed data for each gift are passed to a corresponding email template based on the donation category. 
These templates were built with HTML, CSS, and Handlebars. My node application then sends the filled out the email to the donor.

## Installation

This project was built custom for a specific non profit. Please email me at nissimram1812@gmail.com if you would like assistance in replicating some of its features.  
