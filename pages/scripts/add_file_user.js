// console.log("Hi");
function on_submit_button_1(event) {
  event.preventDefault();
  let buttons = form_1.querySelectorAll("input");
  console.log(buttons);
  form_1.classList.add('hidden');
  if (buttons[0].checked && buttons[2].checked) {
    let form_2 = document.querySelector("#form_add_file");
    form_2.classList.remove('hidden');
  } else {
    let warn = document.querySelector("#no_all_true");
    warn.classList.remove('hidden');
  }

}

let form_1 = document.querySelector("#form_update");
let submit_button_1 = document.querySelector("#form_update button");

submit_button_1.addEventListener("click", on_submit_button_1);
