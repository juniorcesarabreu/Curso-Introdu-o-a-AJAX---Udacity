
function loadData() {

    // $ não quer dizer nada, é apenas para identificar que se trata de um objeto jQuery
    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    var streetStr = $("#form-container #street").val();    
    var cityStr = $("#form-container #city").val();
    
    var address = streetStr + ', ' + cityStr;
    $greeting.text('So, you want to live at ' + address + '?');
    
    var streetViewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location='+address+'';
    
    $body.append('<img class="bgimg" src="'+streetViewUrl+'">');
    
    // Your NYTimes Ajax request goes here
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
url += '?' + $.param({
  'api-key': "f880efe1b7c245c98605730ab1eae30d",
    'q': cityStr
});

    
    $.getJSON(url, function(data) {
        
        $nytHeaderElem.text("New York Times News About " + cityStr);
        
        articles = data.response.docs;
        $.each(articles, function(key, val) {
            $nytElem.append("<li id='article" + key +"'>" + 
                    "<a href='" + val.web_url + "'>" + val.headline.main + "</a>" + 
                    "<p>" + val.snippet + "</p>" +
            "</li>");
        });
        
        console.log(data);
    })
    .error(function(e) {
        
        $nytHeaderElem.text("New York Times Articles Could Not Be Loaded");
    });
    
    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);
    
    var remoteUrlWithOrigin = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+cityStr+"&format=json&callback=wikiCallback";
    
    $.ajax({
        url: remoteUrlWithOrigin,
        dataType: 'jsonp',
        //jsonp: "callback", // é redundante, só utilizado se precisar mudar o nome do callback
        success: function(data) {
            console.log(data);
            
            var articleList = data[1];
            
            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                
                var url = 'http://en.wikipedia.org/wiki/'+articleStr;
                
                $wikiElem.append('<li><a href="'+url+'">'+articleStr+'</a></li>');
            };
            clearTimeout(wikiRequestTimeout);
        }
        // Não há tratamento de erro no JSONP
    })
    

    return false;
};

$('#form-container').submit(loadData);
