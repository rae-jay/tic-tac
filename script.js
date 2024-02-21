



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


    // //this for testing row matches
    // for(let i = 0; i < rowSize; i++){
    //     cellGrid[i][1].setValue("a");
    //     cellGrid[i][2].setValue("o");
    // }
    // cellGrid[0][2].setValue("a");
    // cellGrid[1][1].setValue("a");
    // cellGrid[2][0].setValue("a");
    // cellGrid[1][0].setValue("x");
    // cellGrid[1][1].setValue("o");
    // cellGrid[1][2].setValue("x");
    // cellGrid[0][1].setValue("o");
    // cellGrid[2][1].setValue("o");


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
        // console.log(checkRow(cell) || checkCol(cell) || checkDiagBottomTop(cell) || checkDiagTopBottom(cell));
        return(checkRow(cell) || checkCol(cell) || checkDiagBottomTop(cell) || checkDiagTopBottom(cell));
    }

    // checkForMatches(cellGrid[1][1]);  

    

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

    return {printToConsole};
})(3);


gameBoard.printToConsole();




