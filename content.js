// content.js
//Get name
function main(){
  var names = $("p");
  var name = [];
  $.each(names, function(i, val){
    var elem = names[i];

    name.push("ratings" + $(elem).text().split(", ")[0]);

    var newDiv = document.createElement('div');
    $(newDiv).addClass(name[i])
              .appendTo($(names[i]))
              .hide();
    $(elem).hover(function(){
      $("." + name[i]).show();
    },
    function(){
      $("." + name[i]).hide();
    });

    names[i] = parseName($(names[i]).text().trim());
    url = getUrl(names[i][0], names[i][1]);
    sendUrl(url, elem);

  }); //End each
}

//Returns an array splitting firstName and lastName
function parseName(name){
  return name.split(", ");
};

//Concatenate the good url
function getUrl(lastName, firstName){
  var url = "http://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=Concordia+University&schoolID=1422&query=" + lastName + "+" + firstName;
  return url;
}

function sendUrl(url, elem){
  chrome.runtime.sendMessage({"message": "getRating", "url": url},
    function (response){
      //Get the <a> link for the professor
        //Insert response in a div to search through it
        var tempDiv = document.createElement('div').innerHTML = response;

        //Look for the link for the professor page
        var professorPage = $(tempDiv).find("li[class='listing PROFESSOR']").children().attr("href");

        getRatings(professorPage, elem);
  }); //end sendMessage
}

//Retrieve the actual professor page
function getRatings(url, elem){
  url = "http://www.ratemyprofessors.com" + url;
  var gradesToReturn;

  chrome.runtime.sendMessage({"message": "actualPage", "url": url},
    function (response){
      //Insert response in a div to search through it
      var tempDiv = document.createElement('div').innerHTML = response;

      //Get the grades
      var grades = $(tempDiv).find("div[class='grade']").text().trim().split(" ");

      //Format the grades
      grades = jQuery.grep(grades, function(value){
        return value != "";
      }); //end grep

      $.each(grades, function(index, value){
        grades[index] = grades[index].split("\n")
        grades[index] = jQuery.grep(grades[index], function(value){
          return value != "";
        }); //end grep
      }); //end each

      //Keep the necessary data
      grades = [grades[0],grades[3]];

      //Get number of ratings
      var numOfRatings = $(tempDiv).find("div[data-table='rating-filter']").text().trim().split(" ")[0];
      console.log(numOfRatings);

      appendRatings(grades, numOfRatings, url, elem);
  }); //End sendMessage
}

function appendRatings(ratings, numOfRatings, url, elem){
  $(elem).find('div').html("Overall rating: " + ratings[0] + "<br>Level of Difficulty: " + ratings[1] +
                            "<br><a href=" + url + ">" + numOfRatings + " Students Ratings</a>");
}

main();
