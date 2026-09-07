$(function(){

    var API_ROOT="https://todo-list.dcism.org";

    var $loginForm = $('#loginForm');
    var $loginError = $('#loginError');
    var $signupForm = $('#signupForm');
    var $signupError = $('#signupError');

    $("#showSignup").on("click", function(e){
         e.preventDefault();
        $loginError.text("");
        $loginForm.addClass("hidden");
        $signupForm.removeClass("hidden");
    
    });

    $("#showLogin").on("click", function(e){
        e.preventDefault();
        $signupError.text("");
        $signupForm.addClass("hidden");
        $loginForm.removeClass("hidden");
    });

    $loginForm.on("submit", function(e){
        e.preventDefault();
        $loginError.text("");
        var email = $("#loginEmail").val().trim();
        var password = $("#loginPassword").val();

        if(!email || !password){
            $loginError.text("I require all fields to login");
    
            return;
        }

        var $btn = $loginForm.find(".tombstone-btn");
        $btn.prop("disabled", true);

        $.ajax({
            url: API_ROOT + "/signin_action.php",
            method: "GET",
            dataType: "json",
            data:{
                email: email,
                password: password
            }

        })
        .done(function(response){
            if(response.status===200){
                sessionStorage.setItem("graveyard_user", JSON.stringify(response.data));
                window.location.href = "index.html";
            }
            else{
                $loginError.text(response.message|| "Sorry wrong credientials :(");
            }
        })
        .fail(function(xhr){
            var message = "I-JOLLIBEE TRY AGAIN";
            if(xhr.responseJSON && xhr.responseJSON.message){
                message = xhr.responseJSON.message;
            }
            $loginError.text(message);
        })
        .always(function(){
            $btn.prop("disabled", false);
        });

       });


$signupForm.on("submit", function(e){
    e.preventDefault();
    $signupError.text("");

    var first_Name = $("#signupFirstName").val().trim();
    var last_Name = $("#signupLastName").val().trim();
    var email = $("#signupEmail").val().trim();
    var password = $("#signupPassword").val();
    var confirm_Password = $("#signupConfirmPassword").val(); 

    if (!first_Name || !last_Name || !email || !password || !confirm_Password){
        $signupError.text("I require all fields to sign up");
        return;
    }

    if(password !== confirm_Password){
        $signupError.text("They do not match");
        return;
    }
    var $btn = $signupForm.find("button[type=submit]");
    $btn.prop("disabled", true);

    $.ajax({
        url: API_ROOT + "/signup_action.php",
        method: "POST",
        contentType: "text/plain",
        dataType: "json",
        data: JSON.stringify({
            first_name: first_Name,
            last_name: last_Name,
            email: email,
            password: password,
            confirm_password: confirm_Password
        })
    })
   .done(function(response){
    if(response.status===200){
        $signupForm.trigger("reset");
        $loginError.text("");
        $("#loginEmail").val(email);
        $signupForm.addClass("hidden");
        $loginForm.removeClass("hidden");
    }
    else{
        $signupError.text(response.message || "No account for you, sorry :-(");
    }


   })

   .fail(function(xhr){
    var message = "I-JOLLIBEE TRY AGAIN";
    if(xhr.responseJSON && xhr.responseJSON.message){
        message = xhr.responseJSON.message;
    }
    $signupError.text(message);

})
.always(function(){
    $btn.prop("disabled", false);
})

})
    });
      