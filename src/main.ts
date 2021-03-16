import express from "express";
import cors from "cors";
import Busboy from "busboy";
import path from "path";
import fs from "fs";

// App
const app = express();

// Evironment
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));

// Getting all the files
app.use(express.static(path.join(__dirname,"../files/")));

app.post("*", (req, res) => {
  const busboy = new Busboy({ headers: req.headers });
  busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
    const saveTo = path.join(__dirname, "../files", `${Date.now()+filename}`);
    file.pipe(fs.createWriteStream(saveTo));
  });
  busboy.on("finish", function () {
    res.writeHead(200, { Connection: "close" });
    res.end("That's all folks!");
  });
  return req.pipe(busboy);
});

// Get a file with an id
app.get("*", (_, res) => {
  res.send("Welcome to the file server!");
});

// Starting the server
app.listen(Number(PORT), () =>
  console.log(`File Service running at port ${PORT}`)
);
