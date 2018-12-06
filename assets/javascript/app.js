window.onload = function(){
// localStorage.clear();

//variable to populate predefined buttons
var animals = ["cat","tortoise","toad","goose","goldfish"];
let queryNum = 10;
var query = "";

//array used to check if image already favorited //if the object exists in local storage it uses that, if it doesn't the array is empty
if (localStorage.getItem("favArrayStatic") == null){
    var favImagesStatic = [];
    var favImagesAnimate = [];
}
else{
    //the array is pulled as a string and so needs split
    var favImagesStaticString =localStorage.getItem("favArrayStatic")
    var favImagesAnimateString = localStorage.getItem("favArrayAnimate")
    var favImagesStatic = favImagesStaticString.split(",")
    var favImagesAnimate = favImagesAnimateString.split(",")
}

//function to add buttons
function renderButtons (){
    $("#btn-holder").empty();
    //for every item in the array of animals create a button with class search-btn and data attribute and text of user input
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
    //takes stored data value of button for query
    
    
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + query + "&api_key=uTqd9ezIs8uSleAAKEB0ZyDxpc94XTZn&limit=" + queryNum;

    $.ajax({
    url: queryURL,
    method: "GET"
    })
        .then(function(response){
            $("#gif-holder").empty();
            //for every data item in response (10)
            for(i=0; i < response.data.length; i++){
                //holds url for animated gif
                var animate = response.data[i].images.original.url;
                //holds url for static gif
                var static = response.data[i].images.original_still.url;
                //starts with html tags for every item created in this loop
                var img = $("<img>")
                var rated = $("<p>")
                var fav = $("<img>")

                //collects value of rating and displays it in text, adds class rating so it can be selected with css
                rated.html("Rating: " + response.data[i].rating + "<br>")
                rated.attr("class", "rating")
                 
                //stores both img urls for later usage, given class og gifs so can be selected later, default src is static, data-status added so image can pause and unpause, id of img-[i] given so can be selected when clicking corresponding fav button later
                img.attr("data-animate", animate);
                img.attr("data-static", static);
                img.attr("data-query", query)
                img.attr("class", "gifs");
                img.attr("data-status", "static");
                img.attr("src", static);
                img.attr("id", "img-" + [i])

                //if statement checks if image has been favorited yet and assigns appropriate button
                if(favImagesStatic.indexOf(static) == -1){
                    fav.attr("data-faved", "no")
                    fav.attr("src", "assets/images/unliked.png")
                }  
                else{
                    fav.attr("data-faved", "yes")
                    fav.attr("src", "assets/images/liked.png")
                }
                
                //adds classes to buttons so they can be called later, assigns value to button to use when calling images
                fav.attr("class", "fav-btn")
                fav.addClass("btn")
                fav.attr("value", [i])

                //fav button added in front of rating, image added after
                rated.prepend(fav)
                rated.append(img)

                //everything added to gif-holder div
                $("#gif-holder").append(rated)
                
            }
            var d = $("<div>")
            var b = $("<button>")
            b.attr("id","load-more")
            b.text("Load More")
            d.append(b)
            $("#gif-holder").append(d)

        })
}

//on click for user adding new search button
$("#add-animal").on("click", function(event){
    //prevents page from reloading when form submitted
    event.preventDefault();
    //value from form box assigned var animal
    var animal = $("#gif-search").val().trim();
    //var animal added to array used to render search buttons
    animals.push(animal)
    //call function that creates search buttons
    renderButtons();
    //search form emptied
    $("#gif-search").val("")
})

//when any search button is clicked, function to renderGifs is run
$(document).on("click", ".search-btn", function(){
    queryNum = 10;
    query = $(this).attr("data-animal")
})
$(document).on("click", ".search-btn", renderGifs)


//when gif is clicked image is paused or unpaused
$(document).on("click", ".gifs", function(){
    //grabs status so we can check if gif is currently paused or playing
    var status = $(this).attr("data-status")

    //if currently static url is changed to url for animated gif and class is changed to reflect that it is now animated
    if(status == "static"){
        $(this).attr("src", $(this).attr("data-animate"))
        $(this).attr("data-status", "animate")
    }
    //if image is currently animated will change url to static version and change class to reflect that it is now static
    else{
        $(this).attr("src", $(this).attr("data-static"))
        $(this).attr("data-status", "static")
    }
})

//when load more button is clicked
$(document).on("click", "#load-more", function(){
    queryNum += 10;
    query= $("#img-0").attr("data-query")
    renderGifs()
})

//when fav button is clicked
$(document).on("click", ".fav-btn", function(){
    //first checks that image is not already faved **currently this resets whenever results are reloaded so gifs can be faved multiple times
    if($(this).attr("data-faved") == "no"){
    //grabs value from button so it can be used to select corresponding img (copyImg) and creates img tag for new image to be added to favorites
    var imgNum = $(this).attr("value");
    var copyImg = $("#img-" + imgNum);
    var newImg = $("<img>");

    //storing src in array in order to check if faved when rendered
    favImagesStatic.push(copyImg.attr("data-static"));
    favImagesAnimate.push(copyImg.attr("data-animate"));
    
    //copies attributes from image to fav and adds class of copied so it can be selected by class later. (need to research .clone method further, may be able to clean this up some)
    newImg.attr("data-animate", copyImg.attr("data-animate"));
    newImg.attr("data-static", copyImg.attr("data-static"));
    newImg.attr("class", "gifs");
    newImg.attr("data-status", "static");
    newImg.attr("src", copyImg.attr("data-static"));
    newImg.addClass("copied");
    
    //adds faved image to div for holding favs
    $("#fav-holder").append(newImg);
    
    //changes data-faved value so cannot be faved again, changes icon to show image has been faved
    $(this).attr("data-faved", "yes");
    $(this).attr("src", "assets/images/liked.png");

    localStorage.setItem("favArrayStatic", favImagesStatic);
    localStorage.setItem("favArrayAnimate", favImagesAnimate);
    }
    
})
//renders button on load
renderButtons();

//render favorites on load
for(i=0; i < favImagesStatic.length; i++){
    var animate = favImagesAnimate[i];
    var static =  favImagesStatic[i];

    var favImg = $("<img>")

    favImg.attr("data-animate", animate);
    favImg.attr("data-static", static);
    favImg.attr("class", "gifs");
    favImg.attr("data-status", "static");
    favImg.attr("src", static);

    $("#fav-holder").append(favImg)

}

}