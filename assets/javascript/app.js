window.onload = function(){
//variable to populate predefined buttons
var animals = ["cat","tortoise","toad","goose","goldfish"];

//function to add buttons
function renderButtons (){
    $("#btn-holder").empty();

    for(i=0; i < animals.length; i++){
        p = $("<button>");
        p.addClass("search-btn");
        p.attr("data-animal", animals[i]);
        p.text(animals[i]);
        $("#btn-holder").append(p);
        
    }
}
//function to add gifs
function renderGifs(){
    var query = $(this).attr("data-animal")
    
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + query + "&api_key=uTqd9ezIs8uSleAAKEB0ZyDxpc94XTZn&limit=10"

    $.ajax({
    url: queryURL,
    method: "GET"
    })
        .then(function(response){
            for(i=0; i < response.data.length; i++){
                var animate = response.data[i].images.original.url;
                var static = response.data[i].images.original_still.url;
                var img = $("<img>")

                img.attr("data-animate", animate);
                img.attr("data-static", static);
                img.attr("class", "gifs")
                img.attr("data-status", "static")
                img.attr("src", static)

                $("#gif-holder").prepend(img)
            }
        })
}


$("#add-animal").on("click", function(event){
    event.preventDefault();
    var animal = $("#gif-search").val().trim();
    animals.push(animal)
    renderButtons();
    $("#gif-search").val("")
})

$(document).on("click", ".search-btn", renderGifs)

$(document).on("click", ".gifs", function(){
    var status = $(this).attr("data-status")

    if(status == "static"){
        $(this).attr("src", $(this).attr("data-animate"))
        $(this).attr("data-status", "animate")
    }
    else{
        $(this).attr("src", $(this).attr("data-static"))
        $(this).attr("data-status", "static")
    }
})

renderButtons();
}