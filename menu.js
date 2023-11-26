
document.getElementById('firstLvlButton').addEventListener('click', function() {
    let nickname = localStorage.getItem('last_nickname')
    let user = {'nickname' : nickname, 'lvl': 1, 'result': 0}
    let id = localStorage.length
    localStorage.setItem(id, JSON.stringify(user))
    document.location.replace('http://localhost:3000/game.html')
});
document.getElementById('secondLvlButton').addEventListener('click', function() {
    let nickname = localStorage.getItem('last_nickname')
    let user = {'nickname' : nickname, 'lvl': 2, 'result': 0}
    let id = (localStorage.length).toString()
    localStorage.setItem(id, JSON.stringify(user))
    document.location.replace('http://localhost:3000/game.html')
});