

const gridSize = 3;


function createCell(y,x){
    let cellValue = "-";
    const posY = y;
    const posX = x;

    const checkValue = function() { return cellValue };
    const setValue = function(newValue) {
        if(cellValue == "-"){
            cellValue = newValue;
            return true;
        }
        return false;
    };
    //visualManager.makeBox(y,x);

    const resetCell = function(){
        cellValue = "-";
    }

    return { checkValue, setValue, resetCell, posY, posX };
}


const gameBoard = (function (rowSize) {

    //k this works but it didn't solve the ouroboros problem even a little bit
    // const cellHit = function(y,x){
    //     console.log("hit " + y + "," + x);
    // }


    const cellGrid = [];
    for(let y = 0; y < rowSize; y++){
        cellGrid[y] = [];
        for(let x = 0; x < rowSize; x++){
            cellGrid[y].push(createCell(y,x));
            //, cellHit
            //visualManager.makeBox(y,x)
        }
    }

    //there was probably a smarter way to set up a tie check but HERE WE ARE
    let filledCells = 0;
    const checkTie = function (){
        filledCells += 1;
        if(filledCells == rowSize * rowSize){
            return true;
        }
        return false;
    }


    const checkRow = function(cell){
        value = cell.checkValue();

        for(let x = 0; x < rowSize; x++){
            if(cellGrid[cell.posY][x].checkValue() != value){
                return false;
            }
        }
        return true;
    }
    const checkCol = function(cell){
        value = cell.checkValue();

        for(let y = 0; y < rowSize; y++){
            if(cellGrid[y][cell.posX].checkValue() != value){
                return false;
            }
        }
        return true;
    }

    const checkDiagTopBottom = function(cell){
        //top left - bottom right diag
        value = cell.checkValue();

        if(cell.posY - cell.posX === 0){
            for(let i = 0; i < rowSize; i++){
                if(cellGrid[i][i].checkValue() != value){
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    const checkDiagBottomTop = function(cell){
        //bottom left - top right diag
        value = cell.checkValue();

        if(cell.posY + cell.posX === rowSize-1){
            for(let i = rowSize-1; i >= 0; i--){
                if(cellGrid[i][rowSize-1-i].checkValue() != value){
                    return false;
                }
            }
            return true;
        }
        return false;
    }

  
    //this should only check a newly turned tile, so cells with value="-"/""/"w/e" shouldn't trigger match
    //(even though they could)
    const checkForMatches = function(cell){
        return(checkRow(cell) || checkCol(cell) || checkDiagBottomTop(cell) || checkDiagTopBottom(cell));
    }




    const fillCell = function(y,x,value){
        let cell = cellGrid[y][x];
        if(cell.setValue(value)){
            printToConsole();
            if(checkForMatches(cell)){
                return "win";
            }
            else{
                if(checkTie()){
                    return "tie";
                }
            }
        }
        else{
            return "full";
        }
    }


    const printToConsole = function(){
        let result = "";
        
        for(let row = 0; row < rowSize; row++){
            for(let col = 0; col < rowSize; col++){
                result += cellGrid[row][col].checkValue();
            }
            result += '\n';
        }

        console.log(result);
    }


    const resetBoard = function(){
        filledCells = 0;
        for(let y = 0; y < gridSize; y++){
            for(let x = 0; x < gridSize; x++){
                cellGrid[y][x].resetCell();
            }
        }
    }

    return {printToConsole, fillCell, resetBoard, };
})(gridSize);



//gameBoard.printToConsole();

//k i don't quite know how visuals and the general manager are going to pass back and forth without oruborbrororusing
//but that should be somewhat manageable
const visualManager = (function () {
    const whenPlaying = document.querySelector(".whenPlaying");
    const boxGrid = document.querySelector(".gameBoard");
    const boxes = [];
    const gameText = document.querySelector(".gameText");

    whenPlaying.style.display = "none";

    const gameSetup = document.querySelector(".gameSetup");
    const playerInput1 = document.getElementById("playerOneName");
    const playerInput2 = document.getElementById("playerTwoName");



    const setupGame = function(){
        gameSetup.style.display = "none";
        whenPlaying.style.display = "flex";

        gameText.textContent = playerInput1.value + " start!";

        return [playerInput1.value, playerInput2.value];
    }


    //im wanting to pass a function in as a third thing because i dunno how tf else to not snake-eating-its-own-tail
    //i just can't figure out what, so
    //beenHit
    const makeBox = function(y,x, func){
        const newBox = document.createElement("div");
        boxes.push(newBox);
        newBox.className = "box";
        newBox.addEventListener("click", () => { 
            const playerPiece = func(y,x);
            if(playerPiece) {
                newBox.style['background-image'] = playerPiece;
                //newBox.style['background-color'] = "lime";
            }
        } );

        boxGrid.appendChild(newBox)
    }


    const makeGrid = function(rowSize, boxClickFunc){
        for(let y = 0; y < rowSize; y++){
            for(let x = 0; x < rowSize; x++){
                makeBox(y,x, boxClickFunc);
            }
        }
    }

    const resetGrid = function(){
        for(let i = 0; i < boxes.length; i++){
            boxes[i].style['background-image'] = "";
        }
    }


    const changeGameText = function(newText){
        gameText.textContent = newText;
    }
    
    //i don't LOVE doing this totally seperate from grid-construction but if im supposed to be keeping all visuals
    //in a hellscape quarantine from everything else i guess this is how do
    //i am so tired
    

    //okay what if it literally just handles the visuals and EVERYTHING ELSE is prompted into it by manager
    return{ makeGrid, changeGameText, setupGame, resetGrid};
}())



const makePlayer = function(playerName, tokenType, tokenImage){
    //tokenType and image could MAYBE be combined but i'd like it to work first because it WOULD break my
    //console version
    return {
        playerName,
        tokenType,
        tokenImage
    }
}



const turnManager = (function (){
  

    //const players = ["x","o"];
    const players = [ makePlayer("player 1", "x", "url(graphics/circle-blue.svg)"),
                      makePlayer("player 2", "o", "url(graphics/diamond-orange.svg)") ];
     
    //meaning 'hasn't finished'                  
    let gamePlaying = true;                  
    let turn = 0;




    const gameStart = function(){
        const playerNames = visualManager.setupGame();
        players[0].playerName = playerNames[0];
        players[1].playerName = playerNames[1];
    }


    


    const cellClicked = function(y,x){
        if(gamePlaying){
            console.log(y + "," + x);

            //console.log(players[turn].tokenType);
            
    
            switch(gameBoard.fillCell(y,x,players[turn].tokenType)){
                case "win": 
                    //console.log(players[turn].playerName + " win")
                    visualManager.changeGameText(players[turn].playerName + " wins!")
                    endGame();
                    return players[turn].tokenImage;
                case "tie":
                    //console.log("tied");
                    visualManager.changeGameText("Tie!");
                    endGame();
                    return players[turn].tokenImage;
                case "full":
                    //takeTurn();
                    return;
                default:
                    const waititcantflipfirst = turn;
                    turnSwap();
                    //takeTurn();
                    return players[waititcantflipfirst].tokenImage;
            }
        }
        
    }

    const turnSwap = function(){
        turn == 0 ? turn = 1 : turn = 0;
        visualManager.changeGameText(players[turn].playerName + "'s turn");
    }


    //k i SHOULD put this with other visual stuff but i WANT TO BE DONE IM SORRY
    //i wasn't thinking of a 'play again' so i SO didn't structure for that and i'm not stopping now forgive me
    const playAgainButton = document.querySelector(".playAgainButton");
    playAgainButton.addEventListener("click", () => gameReset())

    const endGame = function(){

        gamePlaying = false;
        playAgainButton.style.display = "block";
    }

    const gameReset = function(){
        gamePlaying = true;
        turnSwap();
        gameBoard.resetBoard();
        visualManager.resetGrid();
    }

    //i really hate how many different places y/x/clickFunc are being tossed through because it would be 
    //SO EASY TO GET A WIRE CROSSED
    visualManager.makeGrid(gridSize, cellClicked);

    return{ gameStart }
}())


