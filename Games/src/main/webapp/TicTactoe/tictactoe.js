$(document).ready(function () {
    const signinEmail = localStorage.getItem("signin_email");
    const playType = sessionStorage.getItem("playType")
    const playerChoice = sessionStorage.getItem("choice")
    const sessionId = sessionStorage.getItem("sessionId")
    const sessionFrom = sessionStorage.getItem("from")
    const sessionTo = sessionStorage.getItem("to")
    const signinId = sessionStorage.getItem("id")

    if (signinEmail == null) {
        window.location.href = 'http://localhost:8080/Games/';
    }
    $(".logout").click(function () {
        localStorage.removeItem("signin_email");
        window.location.href = 'http://localhost:8080/Games/';
    });

    const posible = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 4, 8],
        [2, 4, 6],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8]
    ]

    var player = "X";
    var xWinCount = 0, oWinCount = 0, tieCount = 0, over = true, SocketTurn, newGame = false, id;

    $.socketPlayer = function () {
        if (playType == 'socket') {
            $(".message").show();
            if (sessionFrom != signinId) {
                if (playerChoice == "X") {
                    SocketTurn = "O"
                } else if (playerChoice == "O") {
                    SocketTurn = "X"
                }
            } else if (sessionFrom == signinId) {
                SocketTurn = playerChoice
            }
        }
    }
    $.socketPlayer()
    $(".inner-grid").click(function () {
        if ($(this).text() == "" && over == true) {
            if (playType == '2-player') {
                $(this).html(player)
                check()
                if (over != false) {
                    changePlayer()
                }
            } else if (playType == 'computer') {
                $(this).html(player)
                computer()
            } else if (playType == 'socket') {
                if (player == SocketTurn) {
                    $(this).html(player)
                    id = $(this).attr("id")
                    $.sendMessage()
                }
            }
        }
    });

    $("#new-game").click(function () {
        if (playType == 'socket') {
            newGame = true
            $.sendMessage()
        } else {
            $.newGame()
        }
    });
    $.newGame = function () {
        over = true
        player = "X"
        for (i = 0; i < 9; i++) {
            $("#" + i).html("");
        }
        $(".o,.x,.tie").removeClass("bg")
        $(".o,.x").removeClass("shife-bg")
        $(".x").addClass("shife-bg");
    }

    function check() {
        posible.forEach(function (data) {
            if ($("#" + data[0]).text() == player && $("#" + data[1]).text() == player && $("#" + data[2]).text() == player) {
                over = false;
                $(".o,.x").removeClass("shife-bg")
                if (player == "X") {
                    xWinCount++;
                    $(".x").addClass("bg");
                    $(".x span").html(" - " + xWinCount);
                } else {
                    oWinCount++;
                    $(".o").addClass("bg");
                    $(".o span").html(" - " + oWinCount);
                }
            }
        })

        let i = 0, tie = true;
        while (i < 9 && over) {
            if ($("#" + i).text() == '') {
                tie = false;
                break;
            }
            i++;
        }
        if (tie && over) {
            over = false;
            tieCount++;
            $(".o,.x").removeClass("shife-bg")
            $(".tie").addClass("bg");
            $(".tie span").html(" - " + tieCount);
        }
    }

    function computer() {
        check()
        if (over != false) {
            changePlayer()
            $("#" + generateNumber()).html(player)
            check()
            if (over != false)
                changePlayer()
        }
    }

    function generateNumber() {
        while (true) {
            index = Math.floor(Math.random() * 9);
            if ($("#" + index).text() == "") {
                return index;
            }
        }
    }

    function changePlayer() {
        $(".x,.o").removeClass("shife-bg")
        player = (player == "X") ? "O" : "X";
        if (player == "X") {
            $(".x").addClass("shife-bg");
        } else {
            $(".o").addClass("shife-bg");
        }
    }


    $.getMessage = function (message) {
        if (message.sessionId == sessionId) {
            if (message.newGame == true) {
                newGame = false
                $.newGame()
            } else {
                $("#" + message.id).html(player)
                if (message.id != 9) {
                    check()
                    if (over)
                        changePlayer()
                }
            }
        }
    }
    $.sendMessage = function () {
        let obj = {
            sessionId: sessionId,
            id: id,
            newGame: newGame
        }
        let json = JSON.stringify(obj);
        console.log("sessionId : " + sessionId + " Json : " + json);
        if (sessionId != null)
            ws.send(json);
    }

    var ws = null,status=true;
    $.initWebSocket = function () {
        ws = new WebSocket('ws://' + document.location.host + '/Games/game');
        ws.onopen = function (event) {
            console.log('WebSocket connection opened');
            id = 9
            $.sendMessage();
        };

        ws.onmessage = function (event) {
            if (event.data == 'NotJoin') {
                $(".message h2").html('Opponant Not yet Join')
            }else if(event.data =='Disconnected'){
                $(".message").show();
                $(".message h2").html('Opponent Disconnected')
            }else{
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
    $.initWebSocket()

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
});  