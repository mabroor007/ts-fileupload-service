const uploadBtn = document.getElementById("upload-btn");

const progress = document.getElementById("progress");

const uploadFile = async (file) => {
  progress.innerText = "";

  try {
    // I haveA
    console.log(`${file.name} : ${file.size}bytes : ${file.type}`);

    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("filename", file.name);

    const response = await axios.request({
      method: "post",
      url: "http://localhost:5000/mabroor",
      data: formdata,
      onUploadProgress: (p) => {
        console.log(p);
        progress.innerText = p.loaded / p.total;
      },
    });

    // Setting the progress because upload completed
    progress.innerText = "100%";

    const res = await response.json();
    console.log(res);
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
