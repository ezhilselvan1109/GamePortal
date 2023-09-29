$(document).ready(function () {

  const signin_email = localStorage.getItem("signin_email");
  let signin_id = null;

  if (signin_email == null) {
    window.location.href = 'http://localhost:8080/Games/';
  }

  $(".logout").click(function () {
    localStorage.removeItem("signin_email");
    window.location.href = 'http://localhost:8080/Games/';
  });

  $.get("member", function (response) {
    var flag = true
    var member = $.parseJSON(response);
    for (var i = 0; i < member.length; i++) {
      if (member[i].members_email == signin_email) {
        signin_id = member[i].members_id;
        localStorage.setItem("signin_id", signin_id)
      } else {
        flag = false
        var tag = $("<option value=" + member[i].members_id + ">" + member[i].members_name + "</option>");
        $("#tic-tac-toe-player,#chess-player,#ludo-player").append(tag);
      }
    }
    if (flag) {
      // var tag = $("<option value=0>No User Found</option>");
      $("#tic-tac-toe-player,#chess-player,#ludo-player").append("<option value=0>No User Found</option>");
    }

    $.get_table_data()
  });

  $(".tictactoe-target").click(function () {
    $(".tictactoe-down-arrow,.tictactoe-up-arrow").toggle();
    $(".tictactoe-dashboard").toggle(500);
  });

  $(".chess-target").click(function () {
    $(".chess-down-arrow,.chess-up-arrow").toggle();
    $(".chess-dashboard").toggle(500);
  });

  $(".tictactoe-playing-choice #player-2").click(function () {
    sessionStorage.setItem("playType", "2-player");
    window.location.href = 'TicTactoe/tictactoe.html';
  });

  $(".tictactoe-playing-choice #computer").click(function () {
    sessionStorage.setItem("playType", "computer");
    window.location.href = 'TicTactoe/tictactoe.html';
  });

  $(".chess-playing-choice #player-2").click(function () {
    sessionStorage.setItem("playType", "2-player");
    window.location.href = 'chess/chess.html';
  });

  $(".sudoku #play-btn").click(function () {
    window.location.href = 'sudoku/sudoku.html';
  });

  $(".tictactoe-playing-choice .send-btn").click(function () {
    var request_session_to = $("#tic-tac-toe-player").val()
    var choice = $("#tic-tac-toe-choice").val()
    if (request_session_to == '0')
      return
    $.tictactoeDashboard()

    $(".tictactoe-table").empty();
    $(".tictactoe-table").append("<tr><th>Name</th><th>E-mail</th><th>Choice</th><th>play Now</th></tr>");
    var data = { request_session_from: signin_id, request_session_to: request_session_to, session_game: "tictactoe", choice: choice };
    $.post("session", data, function (response) {
      var session = $.parseJSON(response);
      session.forEach(function (data) {
        if (data.isPlayed == false) {
          let choice = data.choice
          if (signin_id != data.request_session_from) {
            choice = $.opponentChoice(data.choice)
          }
          var tag = $("<tr><td>" + data.members_name + "</td><td>" + data.members_email + "</td><td>" + choice + "</td><td class=\"btns\"><div class=\"play\" id=" + data.session_id + ':' + data.session_game + ':' + data.choice + ':' + data.request_session_from + ':' + data.request_session_to + ">Play</div><div class=\"delete\" id=" + data.session_id + ':' + data.session_game + ':' + data.request_session_from + ">Delete</div></td></tr>");
          $(".tictactoe-table").append(tag);
        }
      });
      $(".btns .delete").click(function () {
        $.deletebtn($(this).attr("id"))
      });
      $(".btns .play").click(function () {
        $.playbtn($(this).attr("id"))
      });
    });
  });

  $.opponentChoice = function (choice) {
    if (choice == 'O')
      return 'X'
    else if (choice == 'X')
      return 'O'
    else if (choice == 'white')
      return 'black'
    else if (choice == 'black')
      return 'white'
  }

  $(".chess-playing-choice .send-btn").click(function () {
    $.chessDashboard()
    var request_session_to = $("#chess-player").val()
    var choice = $("#chess-choice").val()
    $(".chess-table").empty();
    $(".chess-table").append("<tr><th>Name</th><th>E-mail</th><th>Choice</th><th>play Now</th></tr>");
    var data = { request_session_from: signin_id, request_session_to: request_session_to, session_game: "chess", choice: choice };
    $.post("session", data, function (response) {
      var session = $.parseJSON(response);
      session.forEach(function (data) {
        if (data.isPlayed == false) {
          let choice = data.choice
          if (signin_id != data.request_session_from) {
            choice = $.opponentChoice(data.choice)
          }
          var tag = $("<tr><td>" + data.members_name + "</td><td>" + data.members_email + "</td><td>" + choice + "</td><td class=\"btns\"><div class=\"play\" id=" + data.session_id + ':' + data.session_game + ':' + data.choice + ':' + data.request_session_from + ':' + data.request_session_to + ">Play</div><div class=\"delete\" id=" + data.session_id + ':' + data.session_game + ':' + data.request_session_from + ">Delete</div></td></tr>");
          $(".chess-table").append(tag);
        }
      });
      $(".btns .delete").click(function () {
        $.deletebtn($(this).attr("id"))
      });
      $(".btns .play").click(function () {
        $.deletebtn($(this).attr("id"), $.playbtn($(this).attr("id")))
      });
    });
  });

  $.get_table_data = () => {
    $.dashboard('tictactoe');
    $.dashboard('chess');
    var chessFlag = true
    var tictactoeFlag = true
    var data = { request_session_from: signin_id };
    $.get("session", data, function (response) {
      var session = $.parseJSON(response);
      session.forEach(function (data) {
        if (data.isPlayed == false) {
          let choice = data.choice
          if (signin_id != data.request_session_from) {
            choice = $.opponentChoice(data.choice)
          }
          var tag = $("<tr><td>" + data.members_name + "</td><td>" + data.members_email + "</td><td>" + choice + "</td><td class=\"btns\"><div class=\"play\" id=" + data.session_id + ':' + data.session_game + ':' + data.choice + ':' + data.request_session_from + ':' + data.request_session_to + ">Play</div><div class=\"delete\" id=" + data.session_id + ':' + data.session_game + ':' + data.request_session_from + ">Delete</div></td></tr>");
          if (data.session_game == "tictactoe") {
            tictactoeFlag = false;
            $(".tictactoe-table").append(tag);
          } else if (data.session_game == "chess") {
            chessFlag = false;
            $(".chess-table").append(tag);
          }
        }
      });
      $(".btns .delete").click(function () {
        $.deletebtn($(this).attr("id"))
      });
      $(".btns .play").click(function () {
        $.playbtn($(this).attr("id"))
      });
      $.ifDashboard(tictactoeFlag, chessFlag);
    });
  }

  $.playbtn = function (id) {
    id = id.split(':')
    sessionStorage.setItem("playType", "socket");
    sessionStorage.setItem("sessionId", id[0]);
    sessionStorage.setItem("choice", id[2]);
    sessionStorage.setItem("from", id[3]);
    sessionStorage.setItem("to", id[4]);
    sessionStorage.setItem("id", signin_id);
    if (id[1] == 'tictactoe') {
      window.location.href = 'TicTactoe/tictactoe.html';
    } else if (id[1] == 'chess') {
      window.location.href = 'chess/chess.html';
    }
  }

  $.dashboard = function (x) {
    if ('tictactoe' == x)
      $.tictactoeDashboard()
    else
      $.chessDashboard()
  }
  $.tictactoeDashboard = function () {
    $(".tictactoe-dashboard table").show()
    $(".tictactoe-dashboard h1").hide()
  }

  $.chessDashboard = function () {
    $(".chess-dashboard table").show()
    $(".chess-dashboard h1").hide()
  }
  $.ifDashboard = function (tictactoeFlag, chessFlag) {
    if (tictactoeFlag) {
      $(".tictactoe-dashboard table").hide()
      $(".tictactoe-dashboard h1").show()
    }
    if (chessFlag) {
      $(".chess-dashboard table").hide()
      $(".chess-dashboard h1").show()
    }
  }

  $.deletebtn = function (id) {
    var split = id.split(':')
    if ('tictactoe' == split[1]) {
      $.tictactoeDashboard()
      $(".tictactoe-table").empty();
      $(".tictactoe-table").append("<tr><th>Name</th><th>E-mail</th><th>Choice</th><th>play Now</th></tr>");
      $.tictactoeDelete(id)
    } else if ('chess' == split[1]) {
      $.chessDashboard()
      $(".chess-table").empty();
      $(".chess-table").append("<tr><th>Name</th><th>E-mail</th><th>Choice</th><th>play Now</th></tr>");
      $.chessDelete(id)
    }
  }

  $.chessDelete = function (id) {
    var flag = true
    $.ajax({
      url: 'session?id=' + id,
      type: 'delete',
      success: function (response) {
        var session = $.parseJSON(response);
        session.forEach(function (data) {
          if (data.isPlayed == false) {
            let choice = data.choice
            if (signin_id != data.request_session_from) {
              choice = $.opponentChoice(data.choice)
            }
            var tag = $("<tr><td>" + data.members_name + "</td><td>" + data.members_email + "</td><td>" + choice + "</td><td class=\"btns\"><div class=\"play\" id=" + data.session_id + ':' + data.session_game + ':' + data.choice + ':' + data.request_session_from + ':' + data.request_session_to + ">Play</div><div class=\"delete\" id=" + data.session_id + ':' + data.session_game + ':' + data.request_session_from + ">Delete</div></td></tr>");
            flag = false;
            $(".chess-table").append(tag);
          }
        });
        $(".btns .delete").click(function () {
          $.deletebtn($(this).attr("id"))
        });
        $(".btns .play").click(function () {
          $.playbtn($(this).attr("id"))
        });
        if (flag) {
          $(".chess-dashboard table").hide()
          $(".chess-dashboard h1").show()
        }
      }
    });
  }

  $.tictactoeDelete = function (id) {
    var flag = true
    $.ajax({
      url: 'session?id=' + id,
      type: 'delete',
      success: function (response) {
        var session = $.parseJSON(response);
        session.forEach(function (data) {
          let choice = data.choice
          if (signin_id != data.request_session_from) {
            choice = $.opponentChoice(data.choice)
          }
          var tag = $("<tr><td>" + data.members_name + "</td><td>" + data.members_email + "</td><td>" + choice + "</td><td class=\"btns\"><div class=\"play\" id=" + data.session_id + ':' + data.session_game + ':' + data.choice + ':' + data.request_session_from + ':' + data.request_session_to + ">Play</div><div class=\"delete\" id=" + data.session_id + ':' + data.session_game + ':' + data.request_session_from + ">Delete</div></td></tr>");
          flag = false;
          $(".tictactoe-table").append(tag);
        });
        $(".btns .delete").click(function () {
          $.deletebtn($(this).attr("id"))
        });
        $(".btns .play").click(function () {
          $.playbtn($(this).attr("id"))
        });
        if (flag) {
          $(".tictactoe-dashboard table").hide()
          $(".tictactoe-dashboard h1").show()
        }
      }
    });
  }

  $.sudoku = function () {
    signin_id = localStorage.getItem("signin_id")
    var data = { id: signin_id };
    $.get("sudoku/sudoku", data, function (response) {
      var data = JSON.parse(response);
      total_minute = data.total_minute
      total_second = data.total_second
      errors = data.errors
      if (data.total_minute == '0')
        total_minute = '00'
      if (data.total_second == '0')
        total_second = '00'
      $(".sudoku-target #minutes").html(total_minute)
      $(".sudoku-target #seconds").html(total_second)
      $(".sudoku-target #mistake").html(errors)
    });
  }
  $.sudoku();
});