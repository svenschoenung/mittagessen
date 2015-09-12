function showPdf(url, canvasId) {
  PDFJS.getDocument("/proxy/" + url).then(function(pdf) {
    pdf.getPage(1).then(function(page) {
      var scale = 1.5;
      var viewport = page.getViewport(scale);

      var canvas = document.getElementById(canvasId);
      var context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      var renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      page.render(renderContext);
    });
  });
}


function checkFacebook(htmlId, fbId, closed, menuAvailable) {
  $.ajax("/facebook/" + fbId + "/photos?type=uploaded&limit=1")
   .done(function(data) {
     var lastPhoto = JSON.parse(data).data[0];
     var now = new Date();
     var menuDate = new Date(Date.parse(lastPhoto.created_time));

     var today = new Date(
       now.getFullYear(),
       now.getMonth(),
       now.getDate()
     );
     var menuDay = new Date(
       menuDate.getFullYear(),
       menuDate.getMonth(),
       menuDate.getDate()
     );

     if (closed && closed(today)) {
        $(htmlId + "-menu-closed").show();
        return;
     }

     if (menuAvailable && menuAvailable(today, menuDay)) {
	var $menuImg = $(htmlId + "-menu-img");
        $menuImg.attr("src", lastPhoto.images[0].source);
        $menuImg.show();
        var $menuDate = $(htmlId + "-menu-date");
        $menuDate.text(lastPhoto.created_time);
        $menuDate.show();
	$(htmlId + "-menu-none").hide()
	return;
     }

	var $menuImg = $(htmlId + "-menu-img");
        $menuImg.attr("src", lastPhoto.images[0].source);
        $menuImg.show();
        var $menuDate = $(htmlId + "-menu-date");
        $menuDate.text(lastPhoto.created_time);
        $menuDate.show();
        $(htmlId + "-menu-none").show();
	setTimeout(function() {
	    checkFacebook(htmlId, fbId, closed, menuAvailable);
	}, 2 * 60 * 1000);
   });

}

$(document).ready(function() {

  // *** Restaurants ***

  // Schlachthof
  showPdf(
    "http://www.imschlachthof.de/images/stories/sh_mittagstisch.pdf?date=" + (new Date()).getTime(),
    "schlachthof-menu"
  );

  // Werkbank
  checkFacebook("#werkbank", "827125074038443", function(today) {
    return today.getDay() == 2;
  }, function(today, menuDay) {
    return today.getTime() == menuDay.getTime();
  });

  // Carl's Wirtshaus
  checkFacebook("#carlswirtshaus", "1569441509939001", function(today) {
    return false;
  }, function(today, menuDay) {
    return (today - menuDay) / (1000*60*60*24) < 6;
  });


  // *** Bootstrap ***

  var offsetHeight = 101;

  $('body').scrollspy({
    offset: offsetHeight
  });
  $('.navbar ul li.active').removeClass('active');

  $('.navbar li a').click(function (event) {
    var scrollPos = $('main').find($(this).attr('href')).offset().top -
	            (offsetHeight - 1);
    $('body,html').animate({
      scrollTop: scrollPos
    }, 500, function () {
      $(".btn-navbar").click();
    });
    return false;
  });
});
