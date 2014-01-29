// alert("HELLO!");

$(document).ready(function(){
    var run = function(){
        var fromDOM = window.getSelection();
        var itemTitle = $('[itemprop=name]').text();
        var itemImage = $('[itemprop=image]').attr('src');
        var itemSource = fromDOM.baseNode.baseURI;
        var itemPrice = $("[itemprop=price]").text().replace(/[A-Za-z$-\s]/g, "")
        var itemSize = $('.size.selected').text();
        var itemColor = $("[id^='selectedColorName']").text();

        chrome.runtime.sendMessage({method:'setTitle', title: itemTitle, image: itemImage, source: itemSource, price: itemPrice, size: itemSize, color: itemColor});
    }

    run();

    $('body').on("mouseover", run);
    $('body').on("click", run);
});




