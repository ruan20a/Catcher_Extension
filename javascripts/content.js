// alert("HELLO!");

$(document).ready(function(){
    var image = $('img[itemprop=image]').src
    var price = $("span[itemprop=price]").text[/[0-9\.]+/]
    var size = $('.size.selected').title
    var color = $('#colorHeaderDiv span#selected').text
    var source = window.location.href


    var fromDOM = window.getSelection();
    //changes it to string for text
    var new_data = fromDOM.toString();
    //gets the source
    var new_source = fromDOM.baseNode.baseURI;
    //sets the chrome data
    chrome.runtime.sendMessage({method:'setTitle', image: image, source: new_source});
});




