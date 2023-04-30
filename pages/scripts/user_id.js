console.log("Hi");
user_id_form = document.querySelector("#user_id");
console.log(user_id_form);
if (user_id_form) {
  document.cookie = `user_id=${user_id_form.textContent}`;
}
