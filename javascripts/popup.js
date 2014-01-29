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
    url: "http://bcatcher.herokuapp.com/login.json",
    crossDomain: true,
    data: newUser,
    dataType: "json",
    error: function(xhr, textStatus, error){
      $('#error').text("Email and password do not match. Please try again");
    }
  }).done(
    function(id){
      setChromeStorage(id);
      console.log(id);
      getChromeStorage();
    }
  )

}

Item.addItems = function(e){
  e.preventDefault();
  var newItem = {
    title: $('textarea[name=title]').val(),
    price: $('textarea[name=price]').val(),
    required_price: $('textarea[name=required_price]').val(),
    size: $('textarea[name=notes]').val(),
    color: $('textarea[name=tag_list]').val(),
    current_price: $('input[name=current_price]').val(),
    image_url: $('input[name=image_url]').val(),
    source_url: $('input[name=source]').val(),
    user_id: $('input[name=user_id]').val(),
    notes: $('input[name=notes]').val(),
  };


  $.ajax({
    type: "POST",
    url: "http://bcatcher.herokuapp.com/items.json",
    dataType: "json",
    crossDomain: true,
    data: {item: newItem}
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

    redirect_url = "http://bcatcher.herokuapp.com/users/" + user_id;

    var newUser = {
      email: result.email,
      password: result.password
    };
    // logging out first to prevent any sessions from crashing into each other.
    // post only redirects correctly correctly if we send with html, which is fine since we don't need it to return a code
    $.ajax({
      url: "http://bcatcher.herokuapp.com/logout",
      type: "GET",
      crossDomain: true,
      dataType:"json",
      complete: function(){
        $.ajax({
          url: "http://bcatcher.herokuapp.com/login",
          type: "POST",
          dataType: "html",
          crossDomain: true,
          data: newUser,
          success: function(result){
            window.open(redirect_url,"_blank");
          }
        });
      }
    });
  });
};


Item.createDropdown = function(){
  $.ajax({
    type: "GET",
    url: "http://bcatcher.herokuapp.com/categories.json",
    dataType: "json",
    crossDomain: true,
  }).done(
    function(result){
      console.log(result)
      var arr = result;
      var dropdown = $('<select>')
        .attr('class', 'form-control')
        .prependTo('#item-form');
      $(arr).each(function(){
        dropdown.append($('<option>').attr('value',this.id).text(this.name));
      });
    }
  );
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

  Item.createDropdown();
  $('#login-form').on("submit", Item.login);
  $('#post-item').on("submit", Item.addItems);
  $('textarea[name=title]').val("");
  $('textarea[name=price]').val("");
  $('textarea[name=size]').val("");
  $('textarea[name=color]').val("");
  $('input[name=source]').val("");
  $('input[name=current_price]').val("");
  $('input[name=image_url]').val("");
  $('textarea[name=required_price]').val("");
  $('textarea[name=notes]').val("");

  var bg = chrome.extension.getBackgroundPage();

  $('textarea[name=title]').val(bg.title);
  $('textarea[name=price]').val(bg.price);
  $('textarea[name=size]').val(bg.size);
  $('textarea[name=color]').val(bg.color);
  $('input[name=current_price]').val(bg.price);
  $('input[name=source]').val(bg.source);
  $('input[name=image_url]').val(bg.image);

  if(bg.image){
    $('.itemImage').attr('src', bg.image)
  }


  $('#user-profile-link').on("click", Item.redirectPage);
  }
);