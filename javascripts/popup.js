var Item = Item || {};

Item.login = function(e){
  e.preventDefault();
  //grabbing input fields
  var newUser = {
    email: $('input[name=email]').val(),
    password: $('input[name=password]').val()
  };
  var Storage = chrome.storage.local;
  //sending id to chrome storage
  var setChromeStorage = function(user_id){
    Storage.set({
      "user_key": user_id
    })
  };

  // sending email and password to chrome storage
  var setChromeStorage2 = function(newUser){
    Storage.set({
      "email": newUser.email,
      "password": newUser.password
    })
  };

  setChromeStorage2(newUser);

  var getChromeStorage = function(){
    Storage.get("user_key", function(result){
      if (result.user_key > 0){
        $('#testing-login').addClass('hidden');
        $('input[name=user_id]').val(result.user_key);
        $('a').addClass('hidden');
        $('#post-item').removeClass('hidden');
      };
    })
  };

  $.ajax({
    type: "POST",
    url: "http://localhost:3000/login.json",
    crossDomain: true,
    data: newUser,
    dataType: "json",
    // error: function(xhr, textStatus, error){
    //   $('#error').text("Email and password do not match. Please try again");
    // }
  }).done(
    function(id){
      setChromeStorage(id)
      console.log(id)
      getChromeStorage();
    }
  )

}

Item.addItems = function(e){
  e.preventDefault();
    var newItem = {
      body: $('textarea[name=body]').val(),
      source: $('input[name=source]').val(),
      user_id: $('input[name=user_id]').val(),
      notes: $('textarea[name=notes]').val(),
      tag_list: $('textarea[name=tag_list]').val()
    };

    $.ajax({
      type: "POST",
      url: "http://localhost:3000/items.json",
      dataType: "json",
      crossDomain: true,
      data: {snippet: newSnippet}
    }).done(
      function(result){
        if(result.user_id > 0){
          $('#message').text("Item Saved!");
        }
        else{
          $('#message').text("We could not save your item =(");
        }
      }
    );

    if ($('#message').text() === "Item Saved!")
      e.preventDefault();
    {
      setTimeout(function(){window.close();},1500);
    }

}

Item.redirectPage = function(e){
  var Storage = chrome.storage.local;
  var user_id;
  var email;
  var password;
  //due to asynchronous callback function of the local Storage, I am setting the variables and executing the ajax calls within the function

  Storage.get(["user_key","email","password"], function(result){

    var user_id;
    //need to set up redirect to signup if people click the wallace name
    if(result.user_key){
      user_id = result.user_key;
    }
    else{
      user_id = "new";
    }

    redirect_url = "http://localhost:3000/users/" + user_id;

    var newUser = {
      email: result.email,
      password: result.password
    };
    // logging out first to prevent any sessions from crashing into each other.
    // post only redirects correctly correctly if we send with html, which is fine since we don't need it to return a code
    $.ajax({
      url: "http://localhost:3000/logout",
      type: "GET",
      crossDomain: true,
      dataType:"json",
      complete: function(){
        $.ajax({
          url: "http://localhost:3000/login",
          type: "POST",
          dataType: "html",
          crossDomain: true,
          data: newUser,
          complete: function(result){
            window.open(redirect_url,"_blank")
          }
        })
      }
    })
  });
}


$( document ).ready(function(){
  var Storage = chrome.storage.local;
  Storage.get("user_key", function(result){
    if (result.user_key > 0){
      $('#testing-login').addClass('hidden');
      $('a').addClass('hidden');
      $('input[name=user_id]').val(result.user_key);
      $('#post-item').removeClass('hidden');
    }
  })
  $('#login-form').on("submit", Item.login);
  $('#post-item').on("submit", Item.addItems);
  $('textarea[name=body]').val("");
  $('input[name=source]').val("");
  $('#user-profile-link').on("click", Item.redirectPage);
  var bg = chrome.extension.getBackgroundPage();
  $('textarea[name=body]').val(bg.title);
  $('input[name=source]').val(bg.source);
  }
);