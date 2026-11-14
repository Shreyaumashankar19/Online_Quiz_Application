# Start from a small Nginx web server image
FROM nginx:alpine

# Copy our website files into the folder Nginx serves
COPY index.html style.css script.js quizLogic.js /usr/share/nginx/html/

# Nginx listens on port 80 inside the container
EXPOSE 80