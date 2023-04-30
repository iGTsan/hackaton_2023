function on_user_id_submit(event) {
  event.preventDefault();
  let form_user_id = document.querySelector("#form_user_id");
  const user_id = document.querySelectorAll("#form_user_id input")[0];
  form_user_id.classList.add('hidden');
  form_update.classList.remove('hidden');
  // <input type="hidden" name="form_id" value="2">
  let input_user_id = document.createElement("input");
  input_user_id.type = "hidden";
  input_user_id.name = "user_id";
  input_user_id.value = user_id.value;
  form_update.appendChild(input_user_id);
}

let user_id_submit = document.querySelector("#form_user_id button");
user_id_submit.addEventListener("click", on_user_id_submit);
let form_update = document.querySelector("#form_update");
form_update.classList.add('hidden');
