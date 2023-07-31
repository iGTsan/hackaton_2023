let table = document.querySelector("table"); //табличка
let tbody = table.querySelector("tbody");
// var trs = table.getElementsByTagName("tr");

let req = new XMLHttpRequest();
req.open("GET", "?form_id=get_table", true);
req.onload = function (){
    fillTable(req.responseText);
}
req.send(null);

// const resp = "1 2 3 4 5 6\n9 8 7 6 5 4";
// fillTable(resp);

function parse(data) {
  data = data.split("\n");
  data.forEach((item, i) => data[i] = item.split(" "));
  return data;
}

function createRow(i, row_data) {
  let row = document.createElement("tr");
  let num = document.createElement("th");
  num.innerHTML = i;
  row.append(num);
  row_data.forEach(item => {
    let cell = document.createElement("td");
    cell.innerHTML = item;
    row.append(cell);
  });
  return row;
}

function fillTable(data) {
  data = parse(data);
  data.forEach((item, i) => {
    let row = createRow(i + 1, item);
    tbody.append(row);
  });
}