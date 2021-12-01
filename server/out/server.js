"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const fs = require("fs");
const path = require("path");
const mime = require("mime");
const host = "127.0.0.1";
const port = "3000";
const webServer = express();
webServer.get("/*", function (req, res) {
    let extension = path.extname(req.params[0]);
    let url = "./" + req.params[0];
    const filter = /\/+/;
    url = url.replace(filter, "/");
    if (extension != "") {
        res.setHeader("Content-Type", mime.getType(url));
        fs.readFile(url, function (err, data) {
            if (err) {
                res.writeHead(404);
                res.end(JSON.stringify(err));
                return;
            }
            res.writeHead(200);
            res.end(data);
        });
    }
    else {
        //if index.html exists, serve it
        if (fs.existsSync(url + "/index.html")) {
            res.setHeader("Content-Type", "text/html");
            fs.readFile(url + "/index.html", function (err, data) {
                if (err) {
                    res.writeHead(404);
                    res.end(JSON.stringify(err));
                    return;
                }
                res.writeHead(200);
                res.end(data);
            });
        }
        else {
            fs.readdir(url, (err, files) => {
                let response = "<html><body><h1>Files: </h1>";
                if (files) {
                    files.forEach((file) => {
                        response += `<a href="${url}/${file}">${file}</a><br>`;
                    });
                }
                response += "</body></html>";
                res.send(response);
            });
        }
    }
});
http.createServer(webServer).listen(port);
