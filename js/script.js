const start = document.querySelector('#start');
const wrapperInner = document.querySelector('.wrapper-inner');
const table = document.querySelector('.table');
const countdown = document.querySelector('#countdown');
const answer = document.querySelector('#answer');
const winArr = [
    [1,2,3,4],
    [5,6,7,8],
    [9,10,11,12],
    [13,14,15,0],
];


start.addEventListener('click', () => {
    showPosition(arr);
    wrapperInner.style.transform = 'rotateY(180deg)';
//Таймер
    let time = 300;
    function updateTimer() {
        if (time === 0) {
            clearInterval(timerId);
            gameOver(false);
        }
        let minutes =  Math.floor(time/60);
        let seconds = time % 60 < 10 ? '0' +  time % 60 : time % 60;
        countdown.innerHTML = `${minutes} : ${seconds}`;
        time --;
    }
const timerId = setInterval(updateTimer, 1000)
});

//Функция генерирует начальную позицию
const uniq = new Set();
const arr = createArray();
function createArray() {
    if (uniq.size < 16) {
        uniq.add(Math.floor(Math.random() * 16));
        createArray();
    }
    const array = Array.from(uniq);
    return [
        array.splice(0,4),
        array.splice(0,4),
        array.splice(0,4),
        array.splice(0,4),
    ];
}

// Фунция ищет пустое поле без пятнашки
function getPositionZero(mass) {
    for (let i = 0; i < mass.length; i++) {
        if (mass[i].indexOf(0) != -1) {
            return [i, mass[i].indexOf(0)];
        }
    }
}

// Функция рендерит пятнашки
function showPosition (mass) {
    for (let i = 0; i < mass.length; i++) {
        if (typeof(mass[i]) === "object" ) {
            mass[i].forEach((item, index) => {
                let elem = document.createElement('div');
                elem.setAttribute('data-row', i);
                elem.setAttribute('data-columns', index);
                elem.setAttribute('data-value', item);
                table.append(elem);
                if(item != 0) {                   
                    elem.innerHTML = `${item}`;
                    elem.classList.add('chip');
                }
            });
        }
    }
    if (JSON.stringify(mass) === JSON.stringify(winArr) && countdown.innerHTML != '0 : 00') {
        return gameOver(true);
    }
    [...table.children].forEach(item => {
        item.addEventListener('click', makeMouve);
    });
} 

// Функция проверяет валидность хода
function makeMouve() {
    let positionZero = getPositionZero(arr);
    let row = this.dataset.row;
    let columns = this.dataset.columns;
    if (Math.abs(row - positionZero[0]) === 1 && columns - positionZero[1] === 0 ||
     Math.abs(columns - positionZero[1]) === 1 && row - positionZero[0] === 0) {
        arr[positionZero[0]][positionZero[1]] = this.dataset.value;
        arr[row][columns] = 0;
        [...table.children].forEach(item => {
            item.remove();
        });
        showPosition(arr);
    }    
}


function gameOver(check) {
    [...table.children].forEach(item => {
        item.removeEventListener('click', makeMouve);
    });
    if (check) {
        answer.innerHTML = 'Game over! You won!';
    } 
    if (!check) {
        answer.innerHTML = 'Game over! You lose!';
    }
    setTimeout(() => {
        answer.innerHTML = 'Again';
        answer.addEventListener('click', () => {
            wrapperInner.style.transform = '';
            [...table.children].forEach(item => {
                item.remove();
            });
            answer.innerHTML = '';
            location.reload(); 
        });
    }, 3000);
}