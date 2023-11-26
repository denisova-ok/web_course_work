let toGameButton = document.getElementById('toGameButton');
let input = document.getElementById('nickname');

toGameButton.addEventListener('click', ()=>{
    localStorage.setItem('last_nickname', input.value);
   // console.log(localStorage.getItem(id)['nickname']);
});