# Personal Static Website

## Goal:

I wanted to create my own personal website where I could post my resume and my thoughts in a blog without paying for an actual address. I knew that CS students at the University of Waterloo get free space to use for such use. The link may not be so friendly but its free none the less. Now I'm used to working on larger projects in frame works such as Django or NodeJS and using hosts such as Heroku (highly recommended), however I could not do that on the school machines.

The school machines are very restricted and don't allow installation of any thrid party software. This meant I couldnt use any frameworks or even install packages. I decided to write a simple node program to do this form me with very little overhead. I couldnt install any libraries because npm doesnt exist, nor could I do certain things since the machines still only run on node v0.6.12.

## Solution:

I built a program that uses handlebars.js (a popular templating library) to construct static pages out of templates that I write up. This is the same concept used on dynamic web apps but executed such that I could run it on these machines. I used Bootstrap to design in and started using the Flicks API for pictures and wallahh!

To run it just `node builder.js`. I also wrote a few scripts, poster which publishes posts from draft to release, and replaces which pushes out new versions of my website.

