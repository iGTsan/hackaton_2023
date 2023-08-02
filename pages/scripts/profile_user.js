user_id_holder = document.getElementById("user_id");
user_id_post = document.getElementById("user_id_post");

rating_number = document.getElementById("rating_number");

sum_crit = document.getElementById("sum_crit");

crit_1_holder = document.getElementById("crit_1");
crit_2_holder = document.getElementById("crit_2");
crit_3_holder = document.getElementById("crit_3");
crit_4_holder = document.getElementById("crit_4");
crit_5_holder = document.getElementById("crit_5");

function parse(data) {
  data = data.split("\n");
  data[0] = data[0].split(" ");
  if (data.length == 2) {
    data[1] = data[1].split(" ");
  }
  return data;
}

function fillInfo(data) {
  const crit_1 = +data[0] + +data[1];
  const crit_2 = +data[2] + +data[3];
  const crit_3 = +data[4] + +data[5] + +data[6] + +data[7];
  const crit_4 = +data[8] + +data[9];
  const crit_5 = +data[10] + +data[11] + +data[12] + +data[13] + +data[14];
  crit_1_holder.textContent = crit_1;
  crit_2_holder.textContent = crit_2;
  crit_3_holder.textContent = crit_3;
  crit_4_holder.textContent = crit_4;
  crit_5_holder.textContent = crit_5;
  sum_crit.textContent = data[15];
  // console.log(data);
}

function prepareInfo(data) {
  data = parse(data);
  if (data.length == 2) {
    const user_id = data[1][0];
    const code = data[1][1];
    document.cookie = `user_id=${user_id}`;
    document.cookie = `code=${code}`;
    user_id_holder.textContent = "Id: " + user_id;
    user_id_post.value = user_id;
  }
  data = data[0];
  fillInfo(data);
}

function badLogin() {
  console.log("Bad login");
  user_id_holder.textContent = "Login please";
}

function login(user_info) {
  // console.log(user_info);
  if (user_info) {
    let req = new XMLHttpRequest();
    req.open("GET", user_info + "&form_id=get_user_info", true);
    req.onload = function (){
        prepareInfo(req.responseText);
    }
    req.send(null);
  }
  else {
    badLogin();
  }
}

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function parseURL(name) {
  let matches = window.location.search.match(new RegExp(
    "[\?&]" + name + "=([^&]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function getUserInfo() {
  // Для куки «user_id» не установлено корректное значение атрибута «SameSite».
  // Вскоре куки без атрибута «SameSite» или с некорректным значением этого атрибута будут рассматриваться как «Lax».
  // Это означает, что куки больше не будут отправляться в сторонних контекстах.
  // Если ваше приложение зависит от доступности этих кук в подобных контекстах, добавьте к ним атрибут «SameSite=None».
  // Чтобы узнать больше об атрибуте «SameSite», прочитайте https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie/SameSite
  let user_info = [parseURL("user_id"), parseURL("code")];
  if (user_info[0] != undefined) {
    if (user_info[1] != undefined)
      return `?user_id=${user_info[0]}&code=${user_info[1]}`;
    }
  user_info = [getCookie("user_id"), getCookie("code")];
  if (user_info[0] != undefined) {
    if (user_info[1] != undefined)
      return `?user_id=${user_info[0]}&code=${user_info[1]}`;
    }
  return undefined;
}

const user_info = getUserInfo();

// console.log(user_info);

login(user_info);
