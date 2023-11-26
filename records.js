let records_first_array = []
let records_second_array = []

for (let i = 1; i < localStorage.length; ++i) {
    if (JSON.parse(localStorage.getItem(i.toString())).lvl == 1) {
        records_first_array.push(JSON.parse(localStorage.getItem(i.toString())))
    } else {
        records_second_array.push(JSON.parse(localStorage.getItem(i.toString())))
    }
}

records_first_array.sort((a, b) => a.result > b.result ? -1 : 1);
records_second_array.sort((a, b) => a.result > b.result ? -1 : 1);

if (records_first_array.length > 0) {
document.getElementById('nickname_lvl1_first').textContent = records_first_array[0].nickname
document.getElementById('time_lvl1_first').textContent = records_first_array[0].result
}
if (records_second_array.length > 0) {
document.getElementById('nickname_lvl2_first').textContent = records_second_array[0].nickname
document.getElementById('time_lvl2_first').textContent = records_second_array[0].result
}
if (records_first_array.length > 1) {
document.getElementById('nickname_lvl1_second').textContent = records_first_array[1].nickname
document.getElementById('time_lvl1_second').textContent = records_first_array[1].result
}
if (records_second_array.length > 1) {
document.getElementById('nickname_lvl2_second').textContent = records_second_array[1].nickname
document.getElementById('time_lvl2_second').textContent = records_second_array[1].result
}
if (records_first_array.length > 2) {
document.getElementById('nickname_lvl1_third').textContent = records_first_array[2].nickname
document.getElementById('time_lvl1_third').textContent = records_first_array[2].result
}
if (records_second_array.length > 2) {
document.getElementById('nickname_lvl2_third').textContent = records_second_array[2].nickname
document.getElementById('time_lvl2_third').textContent = records_second_array[2].result
}


