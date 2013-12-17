//setting global variables to fetch what the popup.js needs.
var title;
var source;
var image;
var price;
var size;
var color;


chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  // make sure to that your sendMessages have methods so chrome can differentiate.
  if(message.method == 'setTitle'){
  //message is sent as a hash, we're grabbing the values in titles and source.
    title = message.title;
    source = message.source;
    image = message.image;
    price = message.price;
    size = message.size;
    color = message.color;
    }
  //this method was originally made for the popup to talk to background but the other function getBackground works fine too.
  else if(message.method == 'getTitle'){
    sendResponse(title);
    }
});

