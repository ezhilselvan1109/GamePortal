$(document).ready(function () {
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

    if (localStorage.getItem("signin_email") != null) {
        window.location.href = 'home.html';
    }

    $.remember = function () {
        let email = localStorage.getItem("remember_signin_email")
        let password = localStorage.getItem("remember_password")
        $(".sign-in-email").val(email)
        $(".sign-in-password").val(password)
    }
    $.remember()

    // Sign up submiting
    $("#sign-up form").on("submit", function (event) {
        event.preventDefault();
        $("#error").hide()
        let formData = new FormData(this);
        console.log(formData.get('name') + " " + formData.get('email') + " " + formData.get('password'));
        if (formData.get('name') == '' || formData.get('email') == '' || formData.get('password') == '') {
            $("#error").html("Please fill the form").css({ "font-size": "15px", "color": "red", "text-align": "center", "display": "block" });
        } else if (!(passwordPattern.test(formData.get('password')))) {
            $("#error").html("Password must Contain 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character").css({ "font-size": "12px", "color": "red", "text-align": "center", "display": "block" });
        } else {
            var data = { name: formData.get('name'), email: formData.get('email'), password: formData.get('password') };
            $.post("home", data, function (response) {
                console.log("response : "+response);
                if ("Register" == response) {
                    $("#result").html("Successfully Registered");
                    $("#message").css({ "display": "block" });
                    $("#forgotPassword,#sign-in,#sign-up").css({ "display": "none" });
                } else {
                    $("#error").html("The Account already exists").css({ "font-size": "15px", "color": "red", "text-align": "center", "display": "block" });
                }
            });
        }
    });

    // sign in submiting
    $("#sign-in form").on("submit", function (event) {
        event.preventDefault();
        $("#signin-error-message").hide()
        let formData = new FormData(this);
        console.log("email : "+formData.get('email')+" password : "+formData.get('password'))
        if (formData.get('email') == '' || formData.get('password') == '') {
            $("#signin-error-message").html("Please fill the form").css({ "font-size": "15px", "color": "red", "text-align": "center", "display": "block" });
        } else {
            var data = { email: formData.get('email'), password: formData.get('password') };
            $.get("home", data, function (response) {
                if ('false' == response) {
                    $("#signin-error-message").html("The Account does not exists").css({ "font-size": "15px", "color": "red", "text-align": "center", "display": "block" });
                } else if ('wrong' == response) {
                    $("#signin-error-message").html("Your Password was Wrong").css({ "font-size": "15px", "color": "red", "text-align": "center", "display": "block" });
                } else if ('true' == response) {
                    if (formData.get('remember') == 'on') {
                        localStorage.setItem("remember_signin_email", formData.get('email'));
                        localStorage.setItem("remember_password", formData.get('password'));
                    }
                    localStorage.setItem("signin_email", formData.get('email'));
                    window.location.href = 'home.html';
                }
            });
        }
    });

    $("#forgotPassword form").on("submit", function (event) {
        event.preventDefault();
        let formData = new FormData(this);
        var email = formData.get('email');
        var password = formData.get('password');
        console.log("email : "+email+" password : "+password)
        if (email == '' || password == '') {
            $("#error-message").html("Please fill the form").css({ "font-size": "15px", "color": "red", "text-align": "center", "display": "block" });
        } else if (!(passwordPattern.test(password))) {
            $("#error-message").html("Password must Contain 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character").css({ "font-size": "12px", "color": "red", "text-align": "center", "display": "block" });
        } else {
            $.ajax({
                url: "home?email=" + email + '&password=' + password,
                method: "PUT",
                dataType: "json",
                success: function (response) {
                    if (true == response) {
                        $("#result").html("Successfully Updated");
                        $("#message").css({ "display": "block" });
                        $("#forgotPassword,#sign-in,#sign-up").css({ "display": "none" });
                    } else {
                        $("#error-message").html("The Account does not exists").css({ "font-size": "15px", "color": "red", "text-align": "center", "display": "block" });
                    }
                },
                error: function () {
                    console.log("FullDetails Error")
                }
            });
        }
    });

    $("#sign-up-btn").click(function () {
        $("#error").hide()
        $("#sign-up").show()
        $("#forgotPassword,#sign-in,#message").hide();
    });

    $("#sign-in-btn,#sign-in-bt").click(function () {
        $("#signin-error-message").hide()
        $("#sign-in").show()
        $("#forgotPassword,#sign-up,#message").hide();
    });

    $("#forgot-btn").click(function () {
        $("#error-message").hide()
        $("#forgotPassword").show()
        $("#sign-in,#sign-up,#message").hide();
    });

});