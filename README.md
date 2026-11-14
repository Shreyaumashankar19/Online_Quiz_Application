# Online Quiz Application

A simple, responsive online quiz built with HTML, CSS and JavaScript for the Foundation of DevOps subject.

## Features
- 10 multiple-choice questions (Computer Science and General Knowledge)
- 15-second countdown timer per question, auto-moves to the next question
- Progress bar, answer highlighting, final score and percentage
- Restart button and mobile-friendly design

## Run locally
Open `index.html` in a browser.

## Run tests
npm test

## Run with Docker
docker build -t online-quiz-app .
docker run -d -p 8080:80 --name quiz-container online-quiz-app
Open http://localhost:8080

## DevOps tools used
Git, GitHub, GitHub Actions (CI), Docker, Render (deployment)