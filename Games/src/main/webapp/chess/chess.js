$(document).ready(function () {
    const signin_email = localStorage.getItem("signin_email");

    $(".logout").click(function () {
        localStorage.removeItem("signin_email");
        window.location.href = 'http://localhost:8080/Games/';
    });

    if (signin_email == null) {
        window.location.href = 'http://localhost:8080/Games/';
    }

    const playType = sessionStorage.getItem("playType")
    const playerChoice = sessionStorage.getItem("choice")
    const sessionId = sessionStorage.getItem("sessionId")
    const sessionFrom = sessionStorage.getItem("from")
    const signinId = sessionStorage.getItem("id")

    var whitePawn = $("#60").text()
    var whiteKnight = $("#71").text()
    var whiteBishop = $("#72").text()
    var whiteRook = $("#70").text()
    var whiteQueen = $("#73").text()
    var whiteKing = $("#74").text()

    var blackPawn = $("#10").text()
    var blackKnight = $("#01").text()
    var blackBishop = $("#02").text()
    var blackRook = $("#00").text()
    var blackQueen = $("#03").text()
    var blackKing = $("#04").text()

    var currentPlayer = 'white'
    var coinColor
    var coinName
    var coinMoves = new Set()
    var checkReleaseIndex = new Set()
    var check = false, kingCheck = false
    var box_value, box_id, boxCopy, boxIdCopy, SocketTurn
    var isSafeKing = false;
    var isSafeKingCount = 0, safeFlag = false, safeIndex, kingSafeIndex


    $(".box").click(function () {
        if (playType == 'socket')
            if (SocketTurn != currentPlayer)
                return
        var row = 0, col = 0
        box_id = $(this).attr("id")
        box_value = $(this).text()
        if (box_value != '') {
            $.coinDetails(box_value)
        } else {
            $.removeClass()
        }
        if (true == coinMoves.has(box_id)) {
            row = box_id[0]
            col = box_id[1]
            if ((boxCopy == blackPawn && row == 7) || (boxCopy == whitePawn && row == 0)) {
                $.pawnChange()
            } else {
                $.placeCoin()
            }
        } else if ($(this).text() != '' && coinColor == currentPlayer) {
            if (check == true) {
                $.coinSelectCommon()
                if ((whiteKing != box_value) && (blackKing != box_value)) {
                    let temp = new Set()
                    temp.add(coinMoves.values().next().value);
                    coinMoves.forEach(function (element) {
                        if (checkReleaseIndex.has(element)) {
                            temp.add(element)
                        }
                    })
                    coinMoves = new Set(temp)
                }
                $.isKingSafe()
                $.print();
            } else {
                $.coinSelectCommon()
                $.isKingSafe()
                $.print();
            }
        }
    });
    $.isKingSafe = function () {
        isSafeKing = true
        isSafeKingCount = 0;
        if (currentPlayer == 'black')
            $.checkisWhiteKingSafe()
        else
            $.checkisBlackKingSafe()
        isSafeKing = false
        if (isSafeKingCount == 1) {
            let firstIndex = coinMoves.values().next().value;
            if (coinMoves.has(kingSafeIndex) == true) {
                coinMoves.clear()
                coinMoves.add(firstIndex)
                coinMoves.add(kingSafeIndex)
            } else {
                coinMoves.clear()
                coinMoves.add(firstIndex)
            }
        }
    }
    $.checkisWhiteKingSafe = function () {
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                safeIndex = i + '' + j
                safeFlag = false
                var value = $("#" + i + j).text();
                if (value == whiteRook) {
                    $.rook('black', i, j)
                } else if (value == whiteBishop) {
                    $.bishop('black', i, j)
                } else if (value == whiteQueen) {
                    $.queen('black', i, j)
                }
            }
        }
    }
    $.checkisBlackKingSafe = function () {
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                safeIndex = i + '' + j
                safeFlag = false
                var value = $("#" + i + j).text();
                if (value == blackRook) {
                    $.rook('white', i, j)
                } else if (value == blackBishop) {
                    $.bishop('white', i, j)
                } else if (value == blackQueen) {
                    $.queen('white', i, j)
                }
            }
        }
    }
    $.coinSelectCommon = function () {
        $.removeClass()
        row = box_id[0]
        col = box_id[1]
        boxCopy = box_value
        boxIdCopy = box_id
        coinMoves.clear()
        $.coinDetails(box_value)
        $.findCoinFunction(row, col)
    }
    $.removeClass = function () {
        $(".box").removeClass("free-space");
        $(".box").removeClass("selected");
        $(".box").removeClass("cutting-box");
    }

    $.placeCoin = function () {
        if (playType == 'socket') {
            if (currentPlayer == SocketTurn) {
                $.sendMessage()
            }
        } else {
            $.place()
        }
    }

    $.place = function () {
        if (boxIdCopy != box_id && check == true) {
            check = false
        }
        coinMoves.clear()
        $("#" + boxIdCopy).html('')
        $("#" + box_id).html(boxCopy)
        $.removeClass()
        row = box_id[0]
        col = box_id[1]
        $.coinDetails(boxCopy)
        $.findCoinFunction(row, col)
        $.isCheck()
        if (boxIdCopy != box_id) {
            if (box_value != '' && undefined != box_value) {
                console.log("box_value : " + box_value);
                if (currentPlayer == 'white') {
                    $(".black-container .coins").append('<div>' + box_value + '</div>')
                } else {
                    $(".white-container .coins").append('<div>' + box_value + '</div>')
                }
            }
            $.player_change()
        }
    }

    $.isCheck = function () {
        let king = $.getOpponentKings()
        coinMoves.forEach(function (element) {
            var value = $("#" + element).text()
            if (king == value) {
                check = true
                if (boxCopy == blackKnight || boxCopy == whiteKnight) {
                    checkReleaseIndex.add(coinMoves.values().next().value)
                    $.isCheckmate()
                } else {
                    $.getCheckReleaseIndex(coinMoves.values().next().value, element)
                    $.isCheckmate()
                }
                return;
            }
        })
        coinMoves.clear()
    }

    $.isCheckmate = function () {
        let withoutKing = true
        let king = false
        kingCheck = true
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                coinMoves.clear()
                var value = $("#" + i + j).text();
                if (currentPlayer == 'black' && value == whitePawn) {
                    $.white_pawn(i, j)
                } else if (currentPlayer == 'white' && value == blackPawn) {
                    $.black_pawn(i, j)
                } else if (currentPlayer == 'black' && value == whiteRook) {
                    $.rook('black', i, j)
                } else if (currentPlayer == 'white' && value == blackRook) {
                    $.rook('white', i, j)
                } else if (currentPlayer == 'black' && value == whiteBishop) {
                    $.bishop('black', i, j)
                } else if (currentPlayer == 'white' && value == blackBishop) {
                    $.bishop('white', i, j)
                } else if (currentPlayer == 'black' && value == whiteQueen) {
                    $.queen('black', i, j)
                } else if (currentPlayer == 'white' && value == blackQueen) {
                    $.queen('white', i, j)
                } else if (currentPlayer == 'black' && value == whiteKnight) {
                    $.knight('black', i, j)
                } else if (currentPlayer == 'white' && value == blackKnight) {
                    $.knight('white', i, j)
                } else if (currentPlayer == 'black' && value == whiteKing) {
                    coinMoves.add(i + '' + j)
                    $.king('black', i, j)
                    if (coinMoves.size == 1) {
                        king = true
                    }
                } else if (currentPlayer == 'white' && value == blackKing) {
                    coinMoves.add(i + '' + j)
                    $.king('white', i, j)
                    if (coinMoves.size == 1) {
                        king = true
                    }
                }
                coinMoves.forEach(element => {
                    if (checkReleaseIndex.has(element)) {
                        withoutKing = false
                    }
                })
            }
        }
        kingCheck = false
        if (king && withoutKing) {
            $.win()
            console.log("Check Mate! Win : " + currentPlayer)
        }
    }

    $.win = function () {
        $('.win').show()
        $('.win h5').html(currentPlayer)
    }

    $.getCheckReleaseIndex = function (from, to) {
        checkReleaseIndex.clear()
        let fromRow = from[0]
        let fromCol = from[1]
        let toRow = to[0]
        let toCol = to[1]
        if (fromRow == toRow && fromCol < toCol) {
            for (let i = fromCol; i < toCol; i++) {
                checkReleaseIndex.add(fromRow + '' + i)
            }
        } if (fromRow == toRow && fromCol > toCol) {
            for (let i = fromCol; i > toCol; i--) {
                checkReleaseIndex.add(fromRow + '' + i)
            }
        } else if (fromCol == toCol && fromRow < toRow) {
            for (let i = fromRow; i < toRow; i++) {
                checkReleaseIndex.add(i + '' + fromCol)
            }
        } else if (fromCol == toCol && fromRow > toRow) {
            for (let i = fromRow; i > toRow; i--) {
                checkReleaseIndex.add(i + '' + fromCol)
            }
        } else if (fromCol < toCol && fromRow > toRow) {
            for (let i = fromRow, j = fromCol; i > toRow && j <= toCol; i--, j++) {
                checkReleaseIndex.add(i + '' + j)
            }
        } else if (fromCol > toCol && fromRow < toRow) {
            for (let i = fromRow, j = fromCol; i < toRow && j >= toCol; i++, j--) {
                checkReleaseIndex.add(i + '' + j)
            }
        } else if (fromCol > toCol && fromRow > toRow) {
            for (let i = fromRow, j = fromCol; i > toRow && j >= toCol; i--, j--) {
                checkReleaseIndex.add(i + '' + j)
            }
        } else if (fromCol < toCol && fromRow < toRow) {
            for (let i = fromRow, j = fromCol; i < toRow && j <= toCol; i++, j++) {
                checkReleaseIndex.add(i + '' + j)
            }
        }
    }

    $.blackCoins = function (coinStart, opponentCoin) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let value = $("#" + i + j).text();
                if (value == blackPawn) {
                    coinMoves.add(i + '' + j)
                    coinStart.add(i + '' + j)
                    $.pawnDiagonal(i + 1, j)
                    opponentCoin.push(...Array.from(coinMoves))
                } else if (value == blackRook) {
                    coinMoves.add(i + '' + j)
                    coinStart.add(i + '' + j)
                    $.rook('black', i, j)
                    opponentCoin.push(...Array.from(coinMoves))
                } else if (value == blackBishop) {
                    coinMoves.add(i + '' + j)
                    coinStart.add(i + '' + j)
                    $.bishop('black', i, j)
                    opponentCoin.push(...Array.from(coinMoves))
                } else if (value == blackQueen) {
                    coinMoves.add(i + '' + j)
                    coinStart.add(i + '' + j)
                    $.queen('black', i, j)
                    opponentCoin.push(...Array.from(coinMoves))
                } else if (value == blackKing) {
                    coinMoves.add(i + '' + j)
                    coinStart.add(i + '' + j)
                    $.king_moves('black', i, j)
                    opponentCoin.push(...Array.from(coinMoves))
                } else if (value == blackKnight) {
                    coinMoves.add(i + '' + j)
                    coinStart.add(i + '' + j)
                    $.knight('black', i, j)
                    opponentCoin.push(...Array.from(coinMoves))
                }
                coinMoves.clear()
            }
        }
    }

    $.whiteCoins = function (coinStart, opponentCoin) {
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                var value = $("#" + i + j).text();
                if (value == whitePawn) {
                    coinMoves.add(i + '' + j)
                    coinStart.add(i + '' + j)
                    $.pawnDiagonal(i - 1, j)
                    opponentCoin.push(...Array.from(coinMoves))
                } else if (value == whiteRook) {
                    coinMoves.add(i + '' + j)
                    coinStart.add(i + '' + j)
                    $.rook('white', i, j)
                    opponentCoin.push(...Array.from(coinMoves))
                } else if (value == whiteBishop) {
                    coinMoves.add(i + '' + j)
                    coinStart.add(i + '' + j)
                    $.bishop('white', i, j)
                    opponentCoin.push(...Array.from(coinMoves))
                } else if (value == whiteQueen) {
                    coinMoves.add(i + '' + j)
                    coinStart.add(i + '' + j)
                    $.queen('white', i, j)
                    opponentCoin.push(...Array.from(coinMoves))
                } else if (value == whiteKing) {
                    coinMoves.add(i + '' + j)
                    coinStart.add(i + '' + j)
                    $.king_moves('white', i, j)
                    opponentCoin.push(...Array.from(coinMoves))
                } else if (value == whiteKnight) {
                    coinMoves.add(i + '' + j)
                    coinStart.add(i + '' + j)
                    $.knight('white', i, j)
                    opponentCoin.push(...Array.from(coinMoves))
                }
                coinMoves.clear()
            }
        }
    }

    //knight
    $.knight = function (opponentName, row, col) {
        $.knight_move(opponentName, (parseInt(row) + 2), (parseInt(col) - 1))
        $.knight_move(opponentName, (parseInt(row) + 2), (parseInt(col) + 1))
        $.knight_move(opponentName, (parseInt(row) + 1), (parseInt(col) - 2))
        $.knight_move(opponentName, (parseInt(row) + 1), (parseInt(col) + 2))

        $.knight_move(opponentName, (parseInt(row) - 2), (parseInt(col) - 1))
        $.knight_move(opponentName, (parseInt(row) - 2), (parseInt(col) + 1))
        $.knight_move(opponentName, (parseInt(row) - 1), (parseInt(col) - 2))
        $.knight_move(opponentName, (parseInt(row) - 1), (parseInt(col) + 2))
    }

    $.knight_move = function (opponentName, row, col) {
        let value = $("#" + row + col).text()
        if (value == '') {
            coinMoves.add(row + '' + col)
        } else {
            $.coinDetails(value)
            if (coinColor == opponentName) {
                coinMoves.add(row + '' + col)
            }
        }
    }

    //queen
    $.queen = function (opponentName, row, col) {
        $.bishop(opponentName, row, col)
        $.rook(opponentName, row, col)
    }

    //bishop
    $.bishop = function (opponentName, row, col) {
        for (let i = parseInt(row) + 1, j = parseInt(col) + 1; i <= 7 && j <= 7; i++, j++) {
            if ($.rook_bishop_moves(opponentName, i, j)) {
                break;
            }
        }
        for (let i = parseInt(row) - 1, j = parseInt(col) - 1; j >= 0 && i >= 0; i--, j--) {
            if ($.rook_bishop_moves(opponentName, i, j)) {
                break;
            }
        }
        for (let i = parseInt(row) - 1, j = parseInt(col) + 1; i >= 0 && j <= 7; i--, j++) {
            if ($.rook_bishop_moves(opponentName, i, j)) {
                break;
            }
        }
        for (let i = parseInt(row) + 1, j = parseInt(col) - 1; i <= 7 && j >= 0; i++, j--) {
            if ($.rook_bishop_moves(opponentName, i, j)) {
                break;
            }
        }
    }

    //rook
    $.rook = function (opponentName, row, col) {
        for (let i = parseInt(row) + 1; i <= 7; i++) {
            if ($.rook_bishop_moves(opponentName, i, col)) {
                break;
            }
        }
        for (let i = row - 1; i >= 0; i--) {
            if ($.rook_bishop_moves(opponentName, i, col)) {
                break;
            }
        }
        for (let i = parseInt(col) + 1; i <= 7; i++) {
            if ($.rook_bishop_moves(opponentName, row, i)) {
                break;
            }
        }
        for (let i = col - 1; i >= 0; i--) {
            if ($.rook_bishop_moves(opponentName, row, i)) {
                break;
            }
        }
    }

    $.rook_bishop_moves = function (opponentName, row_index, col_index) {
        let value = $("#" + row_index + col_index).text()
        let king = (kingCheck == true) ? $.getOpponentKings() : $.getCurrentKing()
        if (isSafeKing) {
            king = $.getCurrentKing();
            if (value != '') {
                $.coinDetails(value)
                if (coinColor == opponentName && box_id != (row_index + '' + col_index) && value != king) {
                    return true;
                }
            }
            if (box_id == (row_index + '' + col_index)) {
                safeFlag = true
            }
            if (value == king && safeFlag) {
                isSafeKingCount++
                kingSafeIndex = safeIndex
                return true;
            }
        } else if ((value == king || value == '') && check == true) {
            coinMoves.add(row_index + '' + col_index)
        } else if (value == '' && check == false) {
            coinMoves.add(row_index + '' + col_index)
        } else {
            $.coinDetails(value)
            if (coinColor == opponentName) {
                coinMoves.add(row_index + '' + col_index)
                return true;
            } else {
                return true;
            }
        }
    }

    //King
    $.king = function (opponentName, row, col) {
        let coinStart = new Set()
        let opponentCoin = []
        let firstIndex = coinMoves.values().next().value;

        if (currentPlayer == 'black' && kingCheck == false) {
            $.whiteCoins(coinStart, opponentCoin)
        } else if (currentPlayer == 'white' && kingCheck == false) {
            $.blackCoins(coinStart, opponentCoin)
        } else if (currentPlayer == 'black' && kingCheck == true) {
            $.blackCoins(coinStart, opponentCoin)
        } else if (currentPlayer == 'white' && kingCheck == true) {
            $.whiteCoins(coinStart, opponentCoin)
        }

        let opponentCoins = new Set(opponentCoin)
        coinMoves.clear()
        coinMoves.add(firstIndex)
        $.king_moves(opponentName, row, col);
        opponentCoins.forEach(function (element) {
            if (coinMoves.has(element) == true && coinStart.has(element) == false && firstIndex != element) {
                coinMoves.delete(element)
            }
            if (coinMoves.has(element) == true && coinStart.has(element) == true) {
                if (1 < opponentCoin.reduce((count, currentNumber) => count + (currentNumber === element ? 1 : 0), 0)) {
                    coinMoves.delete(element)
                }
            }
        })
    }
    $.king_moves = function (opponentName, row, col) {
        if (col >= 1 && col <= 6 && row == 0) {
            $.king_move(opponentName, row, (parseInt(col) + 1))
            $.king_move(opponentName, row, (parseInt(col) - 1))
            $.king_move(opponentName, (parseInt(row) + 1), col)
            $.king_move(opponentName, (parseInt(row) + 1), (parseInt(col) - 1))
            $.king_move(opponentName, (parseInt(row) + 1), (parseInt(col) + 1))
        } else if (col >= 1 && col <= 6 && row == 7) {
            $.king_move(opponentName, row, (parseInt(col) + 1))
            $.king_move(opponentName, row, (parseInt(col) - 1))
            $.king_move(opponentName, (parseInt(row) - 1), col)
            $.king_move(opponentName, (parseInt(row) - 1), (parseInt(col) + 1))
            $.king_move(opponentName, (parseInt(row) - 1), (parseInt(col) - 1))
        } else if (row >= 1 && row <= 6 && col == 0) {
            $.king_move(opponentName, (parseInt(row) + 1), col)
            $.king_move(opponentName, (parseInt(row) - 1), col)
            $.king_move(opponentName, row, (parseInt(col) + 1))
            $.king_move(opponentName, (parseInt(row) + 1), (parseInt(col) + 1))
            $.king_move(opponentName, (parseInt(row) - 1), (parseInt(col) + 1))
        } else if (row >= 1 && row <= 6 && col == 7) {
            $.king_move(opponentName, (parseInt(row) + 1), col)
            $.king_move(opponentName, (parseInt(row) - 1), col)
            $.king_move(opponentName, row, (parseInt(col) - 1))
            $.king_move(opponentName, (parseInt(row) - 1), (parseInt(col) - 1))
            $.king_move(opponentName, (parseInt(row) + 1), (parseInt(col) - 1))
        } else if (row == 0 && col == 7) {
            $.king_move(opponentName, row, (parseInt(col) - 1))
            $.king_move(opponentName, (parseInt(row) + 1), col)
            $.king_move(opponentName, (parseInt(row) + 1), (parseInt(col) - 1))
        } else if (row == 0 && col == 0) {
            $.king_move(opponentName, row, (parseInt(col) + 1))
            $.king_move(opponentName, (parseInt(row) + 1), col)
            $.king_move(opponentName, (parseInt(row) + 1), (parseInt(col) + 1))
        } else if (row == 7 && col == 0) {
            $.king_move(opponentName, row, (parseInt(col) + 1))
            $.king_move(opponentName, (parseInt(row) - 1), col)
            $.king_move(opponentName, (parseInt(row) - 1), (parseInt(col) + 1))
        } else if (row == 7 && col == 7) {
            $.king_move(opponentName, row, (parseInt(col) - 1))
            $.king_move(opponentName, (parseInt(row) - 1), col)
            $.king_move(opponentName, (parseInt(row) - 1), (parseInt(col) - 1))
        } else {
            $.king_move(opponentName, row, (parseInt(col) + 1))
            $.king_move(opponentName, row, (parseInt(col) - 1))
            $.king_move(opponentName, (parseInt(row) + 1), col)
            $.king_move(opponentName, (parseInt(row) - 1), col)
            $.king_move(opponentName, (parseInt(row) - 1), (parseInt(col) + 1))
            $.king_move(opponentName, (parseInt(row) - 1), (parseInt(col) - 1))
            $.king_move(opponentName, (parseInt(row) + 1), (parseInt(col) - 1))
            $.king_move(opponentName, (parseInt(row) + 1), (parseInt(col) + 1))
        }
    }

    $.king_move = function (opponentName, row, col) {
        let value = $("#" + row + col).text()
        if (value == '') {
            coinMoves.add(row + '' + col)
        } else {
            $.coinDetails(value)
            if (coinColor == opponentName) {
                coinMoves.add(row + '' + col)
            }
        }
    }

    $.getCurrentKing = function () {
        if (currentPlayer == 'black') {
            return blackKing
        } else {
            return whiteKing
        }
    }
    $.getOpponentKings = function () {
        if (currentPlayer == 'black') {
            return whiteKing
        } else {
            return blackKing
        }
    }

    //Pawn

    $.pawnChange = function () {
        $('.pawn').show();
        if (currentPlayer == 'white') {
            $('.pawn .black').hide()
            $('.pawn .white').show()
        } else {
            $('.pawn .white').hide()
            $('.pawn .black').show()
        }
    }

    $(".coin").click(function () {
        boxCopy = $(this).text()
        $('.pawn').hide();
        $.placeCoin()
    })

    $.pawnDiagonal = function (row, col) {
        let diagonal
        if (col == 0) {
            diagonal = $("#" + row + 1).text()
            if (diagonal == '') {
                coinMoves.add(row + '' + 1)
            }
        } else if (col == 7) {
            diagonal = $("#" + row + 6).text()
            if (diagonal == '') {
                coinMoves.add(row + '' + 6)
            }
        } else {
            diagonal = $("#" + row + (parseInt(col) + 1)).text()
            if (diagonal == '') {
                coinMoves.add(row + '' + (parseInt(col) + 1))
            }
            diagonal = $("#" + row + (col - 1)).text()
            if (diagonal == '') {
                coinMoves.add(row + '' + (col - 1))
            }
        }
    }

    $.white_pawn = function (row, col) {
        if (row >= 0 && row < 6) {
            if ($("#" + (row - 1) + col).text() == '')
                coinMoves.add((row - 1) + '' + col)
        } else if (row == 6) {
            for (var i = 5; i >= 4; i--) {
                if ($("#" + i + col).text() != '') {
                    break
                } else {
                    coinMoves.add(i + '' + col)
                }
            }
        }
        row = (parseInt(row) - 1)
        $.pawn_move('black', row, col)
    }

    $.black_pawn = function (row, col) {
        if (parseInt(row) > 1 && parseInt(row) <= 7) {
            if ($("#" + (parseInt(row) + 1) + col).text() == '')
                coinMoves.add((parseInt(row) + 1) + '' + col)
        } else if (parseInt(row) == 1) {
            for (var i = 2; i <= 3; i++) {
                if ($("#" + i + col).text() != '') {
                    break
                } else {
                    coinMoves.add(i + '' + col)
                }
            }
        }
        row = (parseInt(row) + 1)
        $.pawn_move('white', row, col)
    }

    $.pawn_move = function (opponentName, row, col) {
        if (col == 0) {
            var diagonal = $("#" + row + 1).text()
            if (diagonal != '') {
                $.coinDetails(diagonal)
                if (coinColor == opponentName) {
                    coinMoves.add(row + '' + 1)
                }
            }
        } else if (col == 7) {
            var diagonal = $("#" + row + 6).text()
            if (diagonal != '') {
                $.coinDetails(diagonal)
                if (coinColor == opponentName) {
                    coinMoves.add(row + '' + 6)
                }
            }
        } else {
            var diagonal = $("#" + row + (parseInt(col) + 1)).text()
            if (diagonal != '') {
                $.coinDetails(diagonal)
                if (coinColor == opponentName) {
                    coinMoves.add(row + '' + (parseInt(col) + 1))
                }
            }
            var diagonal = $("#" + row + (col - 1)).text()
            if (diagonal != '') {
                $.coinDetails(diagonal)
                if (coinColor == opponentName) {
                    coinMoves.add(row + '' + (col - 1))
                }
            }
        }
    }


    $.player_change = function () {
        $(".white-container h3,.black-container h3").toggle()
        if (currentPlayer == 'white') {
            currentPlayer = 'black'
        } else if (currentPlayer == 'black') {
            currentPlayer = 'white'
        }
    }

    $.findCoinFunction = function (row, col) {
        coinMoves.add(row + '' + col)
        if (coinName == 'Pawn' && coinColor == 'white') {
            $.white_pawn(row, col)
        } else if (coinName == 'Pawn' && coinColor == 'black') {
            $.black_pawn(row, col)
        } else if (coinName == 'Rook' && coinColor == 'black') {
            $.rook('white', row, col)
        } else if (coinName == 'Rook' && coinColor == 'white') {
            $.rook('black', row, col)
        } else if (coinName == 'Bishop' && coinColor == 'black') {
            $.bishop('white', row, col)
        } else if (coinName == 'Bishop' && coinColor == 'white') {
            $.bishop('black', row, col)
        } else if (coinName == 'Queen' && coinColor == 'black') {
            $.queen('white', row, col)
        } else if (coinName == 'Queen' && coinColor == 'white') {
            $.queen('black', row, col)
        } else if (coinName == 'King' && coinColor == 'black') {
            $.king('white', row, col)
        } else if (coinName == 'King' && coinColor == 'white') {
            $.king('black', row, col)
        } else if (coinName == 'Knight' && coinColor == 'black') {
            $.knight('white', row, col)
        } else if (coinName == 'Knight' && coinColor == 'white') {
            $.knight('black', row, col)
        }
    }

    $.coinDetails = function (coin) {
        var value = null;
        if (whitePawn == coin) {
            value = 'whitePawn'
        } else if (whiteKnight == coin) {
            value = 'whiteKnight'
        } else if (whiteBishop == coin) {
            value = 'whiteBishop'
        } else if (whiteRook == coin) {
            value = 'whiteRook'
        } else if (whiteQueen == coin) {
            value = 'whiteQueen'
        } else if (whiteKing == coin) {
            value = 'whiteKing'
        } else if (blackPawn == coin) {
            value = 'blackPawn'
        } else if (blackKnight == coin) {
            value = 'blackKnight'
        } else if (blackBishop == coin) {
            value = 'blackBishop'
        } else if (blackRook == coin) {
            value = 'blackRook'
        } else if (blackQueen == coin) {
            value = 'blackQueen'
        } else if (blackKing == coin) {
            value = 'blackKing'
        }
        coinColor = value.substring(0, 5)
        coinName = value.substring(5, value.length)
    }

    $.print = function () {
        let idValues = Array.from(coinMoves)
        $("#" + idValues[0]).addClass("selected");
        for (let i = 1; i < idValues.length; i++) {
            $("#" + idValues[i]).addClass("free-space")
            let value = $("#" + idValues[i]).text()
            if (value != '') {
                $("#" + idValues[i]).addClass("cutting-box")
            }
        }
    }

    $.getMessage = function (message) {
        if (message.sessionId == sessionId) {
            if (message.box_id != "88") {
                box_id = message.box_id
                boxIdCopy = message.boxIdCopy
                check = message.check
                boxCopy = message.boxCopy
                $.place()
            }
        }
    }

    $.sendMessage = function () {
        let obj = {
            sessionId: sessionId,
            box_id: box_id,
            boxCopy: boxCopy,
            boxIdCopy: boxIdCopy,
            check: check
        }
        let json = JSON.stringify(obj);
        if (sessionId != null)
            ws.send(json);
    }

    var ws = null;
    var status=true;
    $.initWebSocket = function () {
        ws = new WebSocket('ws://' + document.location.host + '/Games/game');
        ws.onopen = function (event) {
            console.log('WebSocket connection opened');
            box_id = 88
            $.sendMessage();
        };

        ws.onmessage = function (event) {
            if (event.data == 'NotJoin') {
                $(".message h2").html('Opponant Not yet Join')
            } else if (event.data == 'Disconnected') {
                $(".message").show();
                $(".message h2").html('Opponent Disconnected')
            } else {
                $(".message").hide();
                let message = JSON.parse(event.data);
                if(status){
                    status=false
                    $.updateStatus()
                }
                $.getMessage(message)
            }
        };

        ws.onclose = function (event) {
            console.log('WebSocket connection closed: ' + event.reason);
        };

        ws.onerror = function (error) {
            console.error('WebSocket error: ', error);
        };
    }

    $.updateStatus=function(){
        $.ajax({
            url: '../session?id=' + sessionId,
            method: "PUT",
            dataType: "json",
            success: function (response) {
                console.log("response : "+response);
                if (true == response) {
                } else {
                }
            },
            error: function () {
                console.log("error")
            }
        });
    }

    $.socketPlayer = function () {
        if (playType == 'socket') {
            $.initWebSocket()
            $(".message").show();
            if (sessionFrom != signinId) {
                if (playerChoice == "white") {
                    SocketTurn = "black"
                } else if (playerChoice == "black") {
                    SocketTurn = "white"
                }
            } else if (sessionFrom == signinId) {
                SocketTurn = playerChoice
            }
        }
    }
    $.socketPlayer()
});