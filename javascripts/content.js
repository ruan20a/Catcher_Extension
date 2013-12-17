// alert("HELLO!");

$(document).ready(function(){
    var run = function(){
        var itemTitle = $('[itemprop=name]').text();
        var itemImage = $('[itemprop=image]').attr('src');
        var itemSource = window.location.href;
        var itemPrice = $("[itemprop=price]").text().replace(/\D/, "")
        var itemSize = $('.size.selected').attr('title');
        var itemColor = $("[id^='selectedColorName']").text();

        chrome.runtime.sendMessage({method:'setTitle', title: itemTitle, image: itemImage, source: itemSource, price: itemPrice, size: itemSize, color: itemColor});
    }

    run();

    $('body').on("click", run);

});




