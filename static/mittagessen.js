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

function checkWerkbank() {
  $.ajax("/facebook/827125074038443/photos?type=uploaded&limit=1")
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

     if (today.getDay() == 2) {
        $("#werkbank-menu-closed").show();
     } else if (today.getTime() == menuDay.getTime()) {
	var $menuImg = $("#werkbank-menu-img");
        $menuImg.attr("src", lastPhoto.images[0].source);
        $menuImg.show();
        var $menuDate = $("#werkbank-menu-date");
        $menuDate.text(lastPhoto.created_time);
        $menuDate.show();
	$("#werkbank-menu-none").hide()
     } else {
	var $menuImg = $("#werkbank-menu-img");
        $menuImg.attr("src", lastPhoto.images[0].source);
        $menuImg.show();
        var $menuDate = $("#werkbank-menu-date");
        $menuDate.text(lastPhoto.created_time);
        $menuDate.show();
        $("#werkbank-menu-none").show();
	setTimeout(checkWerkbank, 2 * 60 * 1000);
     }
   });
}

$(document).ready(function() {
  showPdf(
    "http://www.imschlachthof.de/images/stories/sh_mittagstisch.pdf?date=" + (new Date()).getTime(),
    "schlachthof-menu"
  );

  checkWerkbank();

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
