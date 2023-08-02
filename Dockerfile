FROM httpd:2.4.57

COPY data.js /usr/local/apache2/htdocs/
COPY index.html /usr/local/apache2/htdocs/
COPY visjs_se.js /usr/local/apache2/htdocs/


