$(document).ready(function () {
    const signin_email = localStorage.getItem("signin_email");
    const signin_id = localStorage.getItem("signin_id")
    
    if (signin_email == null) {
        window.location.href = 'http://localhost:8080/Games/';
    }
    $(".logout").click(function () {
        localStorage.removeItem("signin_email");
        window.location.href = 'http://localhost:8080/Games/';
    });

    var mintue = 0, second = 0;
    let interval;
    var error = 0;
    let gameArray;
    var clickingNumber = null;
    let K = 40
    var ansGrid;
    var tempGameArray;
    var tempGame

    class Sudoku {
        constructor(K) {
            this.K = K;
            this.mat = Array.from({length: 9 }, () => Array.from({length: 9 }, () => 0));
        }
    
        fillValues() {
            this.fillDiagonal();
            this.fillRemaining(0, 3);
            this.full_mat = JSON.parse(JSON.stringify(this.mat))
            this.printSudoku();
            this.removeKDigits();
        }
    
        fillDiagonal() {
            for (let i = 0; i < 9; i += 3) {
                this.fillBox(i, i);
            }
        }
    
        unUsedInBox(rowStart, colStart, num) {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (this.mat[rowStart + i][colStart + j] === num) {
                        return false;
                    }
                }
            }
            return true;
        }
    
        fillBox(row, col) {
            let num = 0;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    while (true) {
                        num = this.randomGenerator(9);
                        if (this.unUsedInBox(row, col, num)) {
                            break;
                        }
                    }
                    this.mat[row + i][col + j] = num;
                }
            }
        }
    
        randomGenerator(num) {
            return Math.floor(Math.random() * num + 1);
        }
    
        checkIfSafe(i, j, num) {
            return ( this.unUsedInRow(i, num) && this.unUsedInCol(j, num) && this.unUsedInBox(i - (i % 3), j - (j % 3), num) );
        }
    
        unUsedInRow(i, num) {
            for (let j = 0; j < 9; j++) {
                if (this.mat[i][j] === num) {
                    return false;
                }
            }
            return true;
        }
    
        unUsedInCol(j, num) {
            for (let i = 0; i < 9; i++) {
                if (this.mat[i][j] === num) {
                    return false;
                }
            }
            return true;
        }
    
        fillRemaining(i, j) {
            if (i === 8 && j === 9) {
                return true;
            }
            if (j === 9) {
                i += 1;
                j = 0;
            }
            if (this.mat[i][j] !== 0) {
                return this.fillRemaining(i, j + 1);
            }
            
            for (let num = 1; num <= 9; num++) {
                if (this.checkIfSafe(i, j, num)) {
                    this.mat[i][j] = num;
                    if (this.fillRemaining(i, j + 1)) {
                        return true;
                    }
                    this.mat[i][j] = 0;
                }
            }
            return false;
        }
    
        printSudoku() {
            for (let i = 0; i < 9; i++) {
                    console.log(this.mat[i].join(" "))
            }
        }
    
        removeKDigits() {
            let count = this.K;
            while (count !== 0) {
                let i = Math.floor(Math.random() * 9);
                let j = Math.floor(Math.random() * 9);
                if (this.mat[i][j] !== 0) {
                    count--;
                    this.mat[i][j] = 0;
                }
            }
            return;
        }

        returnSudoku() {
            return this.mat;
        }

        returnFullSudoku() {
            return this.full_mat;
        }
    }


    $.timer = function () {
        interval = setInterval(() => {
            if (second != 60) {
                second++;
            } else if (second == 60) {
                mintue++;
                second = 0;
            }
            $("#minutes").html($.formString(mintue));
            $("#seconds").html($.formString(second));
        }, 1000);
    }


    $.formString = function (number) {
        if (number <= 9) {
            return "0" + number;
        }
        return number;
    }

    $.timer();

    $.new_game_generater = function () {
        let sudoku = new Sudoku(K)
        sudoku.fillValues()
        gameArray = sudoku.returnSudoku()
        ansGrid = sudoku.returnFullSudoku();
        sudoku.printSudoku()
        tempGame=gameArray
        return gameArray;
    }

    $.print_game = function (arr) {
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                var number = arr[i][j];
                if (number != 0) {
                    $("#" + i + j).html(number).css({ "background": "white", "color": "black" });
                } else {
                    $("#" + i + j).html("");
                }
            }
        }
    }

    $.new_game = function () {
        var arr = $.new_game_generater();
        tempGameArray = JSON.parse(JSON.stringify(arr));
        $.print_game(arr);
    }

    $.new_game();

    $("#newgame").click(function () {
        mintue = 0, second = 0, error = 0;
        $("#mistakes").html(error);
        $(".digits-inner-grid").removeClass("selected");
        $(".inner-grid").css({ "background": "black", "color": "white" });
        $.new_game();
    });

    $("#restart").click(function () {
        mintue = 0, second = 0, error = 0;
        $("#mistakes").html(error);
        var arr = gameArray;
        tempGameArray = JSON.parse(JSON.stringify(arr));
        $(".digits-inner-grid").removeClass("selected");
        $(".inner-grid").css({ "background": "black", "color": "white" });
        $.print_game(arr);
    });


    $(".digits-inner-grid").click(function () {
        if (clickingNumber != null)
            $(".digits-inner-grid").removeClass("selected");
        if ('Erase' == $(this).text()) {
            clickingNumber = ""
        } else {
            clickingNumber = $(this).text();
        }
        $(this).addClass("selected");
    });


    $(".inner-grid").click(function () {
        var box = $(this).attr("id");
        var row = box[0];
        var col = box[1];
        if(tempGame[row][col]!=0){
            return
        }
        if (clickingNumber != null) {
            $(this).html(clickingNumber);
        }
        var error_false = true
        if (ansGrid[row][col] != clickingNumber && $(this).text() != "") {
            error++
            error_false = false
            $("#mistakes").html(error);
        }
        if (error_false) {
            tempGameArray[row][col] = clickingNumber;
        }
        var gameOver = tempGameArray.findIndex(arr => arr.includes(0))
        if (gameOver == -1) {
            $.gameOver()
        }
    });

    $.gameOver = function () {
        clearInterval(interval);
        $(".time").html($.formString(mintue) + " : " + $.formString(second))
        $(".mistakes").html(error)
        $(".popup").css({ "display": "block" })
        $.ajax({
            type: "post",
            url: 'sudoku?id=' + signin_id + '&total_minute=' + mintue + '&total_second=' + second + '&error=' + error,
            success: function (response) {
                console.log('Respone : ' + response)
            }
        });
    }

    $(".new-game").click(function () {
        $(".popup").css({ "display": "none" })
        mintue = 0, second = 0, error = 0;
        $("#mistakes").html(error);
        $(".digits-inner-grid").removeClass("selected");
        $(".inner-grid").css({ "background": "black", "color": "white" });
        $.timer();
        $.new_game();
    });

});