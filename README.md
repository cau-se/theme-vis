# README

This archive contains an interactive theme and cateogry map of the OceanDSL interviews (1)
and theme descriptions (2).

- (1) 10.5281/zenodo.8184267
- (2) 10.5281/zenodo.8200523

To run this you can either build the docker image or by installing the necessary files on a
webserver.

## Docker Image

Executed the command below in the same directory where this readme is situated in.

```
docker build -t visualization . 
```

Run docker with

```
docker run visualization
```

This will startup the image and display the IP address used for the web-service.

Open a brwoser window and type: https://THE-IP-ADDRESS/index.html
for example: https://172.17.0.2/index.html

## Copy to Webserver

In case you are running your own webserver just copy the files
- data.js
- index.html
- visjs_se.js
to a directory reachable for your webserver and enter the correct URL to access
the index.html file in the URL field of your browser.

## Usage

You can click on nodes to open or close them. You can also search for a specific node.






