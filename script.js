



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

    return { checkValue, setValue, posY, posX };
}


const gameBoard = (function (rowSize) {
    const cellGrid = [];
    for(let y = 0; y < rowSize; y++){
        cellGrid[y] = [];
        for(let x = 0; x < rowSize; x++){
            cellGrid[y].push(createCell(y,x));
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
})(3);


//gameBoard.printToConsole();




const turnManager = (function (){
    const players = ["x","o"];
    let turn = 0;


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

    //starts the first turn
    takeTurn();
}())