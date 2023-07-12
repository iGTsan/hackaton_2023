var table = document.querySelector("table"); //табличка
var trs = table.getElementsByTagName("tr");

for(let i = 0; i < trs.length; i++){
    user_tds = trs[i].getElementsByTagName("td"); //строка таблицы
    user_id = user_tds[0];
    crit_1 = user_tds[1];
    crit_2 = user_tds[2];
    crit_3 = user_tds[3];
    crit_4 = user_tds[4];
    crit_5 = user_tds[5];
    crit_sum = user_tds[6];
}

