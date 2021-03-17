import express from "express";
import cors from "cors";
import Busboy from "busboy";
import path from "path";
import fs from "fs";
import { createConnection } from "typeorm";
import FileEntity from "./DB/entity/file.entity";

// Env
const PORT = process.env.PORT || 5000;
const DBHOST = process.env.DBHOST || "localhost";
const DBPORT = process.env.DBPORT || "5432";
const DBPASSWORD = process.env.DBPASSWORD || "pwd";
const DBUSER = process.env.DBUSER || "postgres";
const DB = process.env.DB || "test";

const CORSORIGIN = process.env.CORS || "*";

// App
const app = express();

// I want to know
// done - Who uploaded this
// is it useful anymore
// Use Tag
// what is the url to access it

app.use(cors({ origin: CORSORIGIN }));

// Getting all the files
app.use(express.static(path.join(__dirname, "../files/")));

app.post("/:user", (req, res) => {
  const busboy = new Busboy({ headers: req.headers });
  let url = "";

  busboy.on("file", async function (
    fieldname,
    file,
    filename,
    encoding,
    mimetype
  ) {
    try {
      const newFile = FileEntity.create({
        name: filename,
        owner: req.params.user,
      });
      const final = await newFile.save();
      const saveTo = path.join(__dirname, "../files", final.id);

      url = "/" + final.id;

      file.pipe(fs.createWriteStream(saveTo));
    } catch (e) {}
  });
  busboy.on("finish", function () {
    res.json({ url });
  });
  return req.pipe(busboy);
});

// Get a file with an id
app.get("/user", (req, res) => {
  res.send(`Welcome ${req.query.name}!`);
});

app.get("/files/:admin", async (req, res) => {
  const admin = req.params.admin;
  if (!admin) return res.status(404).send();
  if (admin !== "mabroor") return res.status(404).send();

  console.log(admin)

  try {
    const files = await FileEntity.find();
    res.json({ files });
  } catch (e) {
    res.status(501);
  }
});

app.use("*", (_, res) => {
  res.status(404).send("404 not found");
});

// Retry logic for database
let connectionAtempts = 0;
function startServer() {
  createConnection({
    type: "postgres",
    host: DBHOST,
    port: Number(DBPORT),
    username: DBUSER,
    password: DBPASSWORD,
    database: DB,
    entities: [FileEntity],
    synchronize: true,
    logging: false,
  })
    .then(() => {
      // Server starting
      app.listen(PORT, () => {
        console.log(`Fileserver running on port ${PORT}`);
      });
    })
    .catch(() => {
      if (connectionAtempts > 5) return;
      connectionAtempts++;
      console.log("Trying to connect again...");
      setTimeout(startServer, 2000);
    });
}

// Creating connection and then starting server
startServer();
