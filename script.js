

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

    return { checkValue, setValue, posY, posX };
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

    return {printToConsole, fillCell};
})(gridSize);



//gameBoard.printToConsole();

//k i don't quite know how visuals and the general manager are going to pass back and forth without oruborbrororusing
//but that should be somewhat manageable
const visualManager = (function () {
    const boxGrid = document.querySelector(".gameBoard");
    const gameText = document.querySelector(".gameText");

    //im wanting to pass a function in as a third thing because i dunno how tf else to not snake-eating-its-own-tail
    //i just can't figure out what, so
    //beenHit
    const makeBox = function(y,x, func){
        const newBox = document.createElement("div");
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
    
    //i don't LOVE doing this totally seperate from grid-construction but if im supposed to be keeping all visuals
    //in a hellscape quarantine from everything else i guess this is how do
    //i am so tired
    

    //okay what if it literally just handles the visuals and EVERYTHING ELSE is prompted into it by manager
    return{ makeGrid, };
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


    /*
    const takeTurn = function() {
        let x = Math.floor(Math.random() * 3);
        let y = Math.floor(Math.random() * 3);
    
        
        switch(gameBoard.fillCell(y,x,players[turn])){
            case "win": 
                console.log("player " + players[turn] + " win")
                return;
            case "tie":
                console.log("tied");
                return;
            case "full":
                takeTurn();
                return;
            default:
                turn == 0 ? turn = 1 : turn = 0;
                takeTurn();
                return;
        }
    }
    */

    //starts the first turn
    //takeTurn();
    


    const cellClicked = function(y,x){
        if(gamePlaying){
            console.log(y + "," + x);

            console.log(players[turn].tokenType);
            //cellClicked now runs in the visualManager, when a click happens. and so needs to return what happened
            //TO the visual manager, for a visual change
    
            //these seems to work except that for some reason when x wins a o appears
            switch(gameBoard.fillCell(y,x,players[turn].tokenType)){
                case "win": 
                    gamePlaying = false;
                    console.log(players[turn].playerName + " win")
                    return players[turn].tokenImage;
                case "tie":
                    gamePlaying = false;
                    console.log("tied");
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

    }


    //i really hate how many different places y/x/clickFunc are being tossed through because it would be 
    //SO EASY TO GET A WIRE CROSSED
    visualManager.makeGrid(gridSize, cellClicked)
}())





// let tNew = document.createElement("img");
// test.forEach((box) => { 
//     let tNew = document.createElement("img");
//     tNew.src = "graphics/circle-blue.svg";
//     box.appendChild(tNew);
//  } );


 /*
 the visual things needs to be able to:

 -boxes need to be clickable when inhabited or not
    (triggering the 'check and fill' process)
    which means passing the coordinate information of where was clicked

 -if manager says that a click succeeded, create a visual for that box
 */
