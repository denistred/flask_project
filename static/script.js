function pick_random_card() {
    let random_number = Math.random()
    //console.log(random_number * cards.length)
    let number = Math.round(random_number * (cards.length - 1));
    return number;
}

function create_image(card_number) {
    let img = document.createElement("img");
    img.src = "static/images/" + card_number + '.png';
    img.style.height = "363px";
    img.style.width = "250px";
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
console.log(pointsMap);


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
    //const para = document.createElement("div");
    //const node = document.createTextNode(cards[pickedCard]);

    //para.appendChild(node);
    const playerCardsContainer = document.getElementById("playerCardsContainer");
    let para = create_image(cards[pickedCard]);
    playerCardsContainer.appendChild(para);
    //console.log(pickedCard);
    playerCards.push(cards[pickedCard])
    cards.splice(pickedCard, 1);
    if (dealerCards.length > 0){
        gameLogic();
    }
    //console.log(cards);
}

function gameLogic(){
    let playerPoints = countPlayerPoints();
    console.log("player points:" + playerPoints);
    let dealerPoints = countDealerPoints();
    console.log("dealer points:" + dealerPoints);
    //if (dealerPoints < 17){ //провека, берет ли дилер карту
    //    getDealerCard();
    //}
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
    //para.appendChild(node);
    const para = create_image(cards[pickedCard]);
    dealerCardsContainer.appendChild(para);
    //console.log(pickedCard);
    dealerCards.push(cards[pickedCard])
    cards.splice(pickedCard, 1);
    //console.log(cards);

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
    let gameState = document.getElementById('gameState');
    removeButtons();

    let dealerPoints = countDealerPoints();
    let dealerPointsContainer = document.getElementById('dealerPoints');
    dealerPointsContainer.innerText = 'Количество очков дилера: ' + dealerPoints;

    let playerPoints = countPlayerPoints();
    let playerPointsContainer = document.getElementById('playerPoints');
    playerPointsContainer.innerText = 'Количество ваших очков: ' + playerPoints;

    if (code == 1) {
        //gameState.innerText = 'win';
        document.getElementById("win-notification").style.display = "block";
        document.getElementById("gameResult").innerText = 'Вы победили!';
    }
    else if (code == 2){
        //gameState.innerText = 'lose';
        document.getElementById("win-notification").style.display = "block";
        document.getElementById('gameResult').innerText = 'Вы проиграли :(';
    }
    else if (code == 3){
        //gameState.innerText = 'draw';
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
    //document.getElementById("lose-notification").style.display = "none";
    //document.getElementById("lose-notification").style.display = "none";

    for (var i= document.images.length; i-->0;)
        document.images[i].parentNode.removeChild(document.images[i]);

    }