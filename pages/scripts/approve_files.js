function GetFiles() {
  let req = new XMLHttpRequest();
  req.open("GET", "?form_id=get_files", true);
  req.send(null);
  return new Promise(function(resolve, reject) {
    try {
      req.onload = function (){
          resolve(req.responseText.split("\n"));
      }
    } catch (err) {
      console.log(err.message);
    }
  });
}

function GetFile() {

}

function Request(request) {
  let req = new XMLHttpRequest();
  req.open("GET", request, true);
  req.send(null);
}

function Approve(filename) {
  Request(`?form_id=approve_file&filename=${filename}`);
}

function Reject(filename) {
  Request(`?form_id=reject_file&filename=${filename}`);
}

function AddNewFile(filename) {
  let newLine = tempLine.cloneNode(true);
  let link = newLine.firstElementChild;
  link.textContent = filename;
  link.href = `${filename}?form_id=get_file&filename=${filename}`;
  let buttons = newLine.querySelectorAll("button");
  buttons[0].addEventListener("click", function() {
    Approve(filename);
  });
  buttons[1].addEventListener("click", function() {
    Reject(filename);
  });
  list.appendChild(newLine);
}

async function Fill() {
  const files = await GetFiles();
  files.forEach((filename) => {
    if (filename)
      AddNewFile(filename);
  });
}

Fill();

list = document.getElementById("list");
const tempLine = list.firstElementChild.cloneNode(true);
while (list.firstChild) {
  list.removeChild(list.firstChild);
}
