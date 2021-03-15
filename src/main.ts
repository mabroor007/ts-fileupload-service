import express from "express"

// App
const app = express();

// Evironment
const PORT = process.env.PORT || 5000;

// Get a file with an id
app.get("/",(_,res) => {
  res.json({ msg:"Welcome to the file Service api!"})
})

// Starting the server
app.listen(Number(PORT), () => console.log(`File Service running at port ${PORT}`));
