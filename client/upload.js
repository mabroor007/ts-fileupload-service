const uploadBtn = document.getElementById("upload-btn");

const uploadFile = async (file) => {
  try {
    // I haveA
    console.log(`${file.name} : ${file.size}bytes : ${file.type}`);

    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("filename", file.name);
    const response = await fetch("http://localhost:5000/", {
      method: "POST",
      body: formdata,
    });
    console.log(response);
  } catch (e) {
    console.log(e);
  }
};

// Adding the event listener
uploadBtn.addEventListener("change", (e) => {
  [...e.target.files].forEach((file) => {
    uploadFile(file);
  });
});
