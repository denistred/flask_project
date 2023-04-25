function pick_random_card() {
    let random_number = Math.random()
    let number = Math.round(random_number * (cards.length - 1));
    return number;
}

function create_image(card_number) {
    let img = document.createElement("img");
    img.src = "static/images/" + card_number + '.png';
    img.style.height = "290px";
    img.style.width = "200px";
    img.style.margin = "10px 0px 10px";
    return img;
}


// 1 - пика  2 - крести  3 - бубна 4 - черва  11 - валет 12 - дама  13 - король 14 - туз
let cards = ['21', '22', '23', '24', '31', '32', '33', '34', '41', '42', '43', '44', '51', '52', '53', '54', '61', '62', '63', '64', '71', '72', '73', '74', '81', '82', '83', '84', '91', '92', '93', '94', '101', '102', '103', '104', '111', '112', '113', '114', '121', '122', '123', '124', '131', '132', '133', '134', '141', '142', '143', '144']; 
let dealerCards = [];
let playerCards = [];

let pointsMap = new Map();
for (let i=0; i<cards.length; i++){
    if (i < (cards.length - 4)){
        let nominal = Number(cards[i].slice(0, -1));
        if (nominal > 10){
            nominal = 10;
        }
        pointsMap[cards[i]] = nominal;
    }
    else{
        pointsMap[cards[i]] = [11, 1]
    }
}


function countDealerPoints(){
    let dealerPoints = 0;
    for (let i of dealerCards){
        let card = i;
        if ((card.slice(0, -1) == '14') && ((dealerPoints + 11) > 21)){
            dealerPoints++;
        }
        else if((card.slice(0, -1) == '14') && (dealerPoints + 10) <= 21){
            dealerPoints += 11;
        }
        else {
            dealerPoints += pointsMap[i];
        }
    }
    return dealerPoints;
}

function countPlayerPoints(){
    let playerPoints = 0;
    for (let i of playerCards){
        let card = i;
        if ((card.slice(0, -1) == '14') && ((playerPoints + 11) > 21)){
            playerPoints++;
        }
        else if((card.slice(0, -1) == '14') && (playerPoints + 10) <= 21){
            playerPoints += 11;
        }
        else {
            playerPoints += pointsMap[i];
        }
    }
    return playerPoints;
}


function startGame(){
    postMoneyChange(50, 1);
    
    clearGame();
    btn = document.getElementById("startbutton");
    btn.style.display = 'none';
    for (let i= 0; i < 2; i++){
        get_card();
    }
    getDealerCard();
    let get_card_btn = document.createElement("button");
    get_card_btn.setAttribute('id', 'getCardBtn');
    get_card_btn.setAttribute('onclick', 'get_card()');
    get_card_btn.innerText = "Взять карту";
    let pass_card_btn = document.createElement("button");
    pass_card_btn.setAttribute('id', 'passCardBtn');
    pass_card_btn.setAttribute('onclick', 'passGame()');
    pass_card_btn.innerText = "Пасс";
    const buttonContainer = document.getElementById("buttonContainer");
    buttonContainer.appendChild(get_card_btn);
    buttonContainer.appendChild(pass_card_btn);
    

}


function get_card(){
    let pickedCard = pick_random_card();

    const playerCardsContainer = document.getElementById("playerCardsContainer");
    let para = create_image(cards[pickedCard]);
    playerCardsContainer.appendChild(para);
    playerCards.push(cards[pickedCard])
    cards.splice(pickedCard, 1);
    if (dealerCards.length > 0){
        gameLogic();
    }
}

function gameLogic(){
    let playerPoints = countPlayerPoints();
    console.log("player points:" + playerPoints);
    let dealerPoints = countDealerPoints();
    console.log("dealer points:" + dealerPoints);
    if (playerPoints > 21){
        endGame(2);
    }
    else if (dealerPoints > 21){
        endGame(1)
    }
}



function getDealerCard(){
    let pickedCard = pick_random_card();
    const dealerCardsContainer = document.getElementById("dealerCardsContainer");
    const para = create_image(cards[pickedCard]);
    dealerCardsContainer.appendChild(para);
    dealerCards.push(cards[pickedCard])
    cards.splice(pickedCard, 1);

}


function passGame(){
    let playerPoints = countPlayerPoints();
    let dealerPoints = countDealerPoints();
    while (dealerPoints < 17){
        getDealerCard();
        dealerPoints = countDealerPoints();
    }
    if (dealerPoints > 21){
        endGame(1);
    }
    else if (playerPoints > 21){
        endGame(2);
    }
    else if (playerPoints < dealerPoints) {
        endGame(2);
    }
    else if (playerPoints > dealerPoints){
        endGame(1);
    }
    else if (playerPoints == dealerPoints){
        endGame(3);
    }
}


function endGame(code){ // 1 - win; 2 - lose; 3 - draw
    removeButtons();
    updateMoneyCount();
    let dealerPoints = countDealerPoints();
    let dealerPointsContainer = document.getElementById('dealerPoints');
    dealerPointsContainer.innerText = 'Количество очков дилера: ' + dealerPoints;

    let playerPoints = countPlayerPoints();
    let playerPointsContainer = document.getElementById('playerPoints');
    playerPointsContainer.innerText = 'Количество ваших очков: ' + playerPoints;

    if (code == 1) {
        document.getElementById("win-notification").style.display = "block";
        document.getElementById("gameResult").innerText = 'Вы победили!';
    }
    else if (code == 2){
        document.getElementById("win-notification").style.display = "block";
        document.getElementById('gameResult').innerText = 'Вы проиграли :(';
    }
    else if (code == 3){
        document.getElementById("win-notification").style.display = "block";
        document.getElementById('gameResult').innerText = 'Ничья';
    }
    
}

function removeButtons(){
    let btn = document.getElementById("playbutton");
    btn.style.display = '';
    let getCardBtn = document.getElementById('getCardBtn');
    getCardBtn.remove();
    let passCardBtn = document.getElementById('passCardBtn');
    passCardBtn.remove();
}

function clearGame(){
    cards = ['21', '22', '23', '24', '31', '32', '33', '34', '41', '42', '43', '44', '51', '52', '53', '54', '61', '62', '63', '64', '71', '72', '73', '74', '81', '82', '83', '84', '91', '92', '93', '94', '101', '102', '103', '104', '111', '112', '113', '114', '121', '122', '123', '124', '131', '132', '133', '134', '141', '142', '143', '144']; 
    dealerCards = [];
    playerCards = [];
    document.getElementById("win-notification").style.display = "none";

    for (var i= document.images.length; i-->0;)
        document.images[i].parentNode.removeChild(document.images[i]);

}

function postMoneyChange(amount, operationCode){
    var data = {
        money: amount,
        code: operationCode
        };
        
        var request = new XMLHttpRequest();
        request.open('POST', '/change_money_count', true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.send(JSON.stringify(data));
}


function updateMoneyCount() {
    const url = 'http://127.0.0.1:5000/get_money_count';
    fetch(url)
    .then(response => response.json())  
    .then(json => {
        console.log(json);
        document.getElementById("MoneyCount").innerText = 'Количество очков: ' + JSON.stringify(json['money'])
    })

}