function pdf(htmlId, url) {
  PDFJS.getDocument("/proxy/" + url).then(function(pdf) {
    pdf.getPage(1).then(function(page) {
      var scale = 1.5;
      var viewport = page.getViewport(scale);

      var canvas = $(htmlId + "-menu")[0];
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


function facebook(htmlId, fbId, closed, menuAvailable) {
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

function proxy(htmlId, url, callback) {
  $.get("/proxy/" + url, function(data) {
    var html = callback(data);
    $(htmlId + "-menu").append(html);
  });
}

$(document).ready(function() {

  // *** Restaurants ***

  // Schlachthof
  pdf("#schlachthof",
      "http://www.imschlachthof.de/images/stories/sh_mittagstisch.pdf?date=" +
      (new Date()).getTime());

  // Werkbank
  facebook("#werkbank", "827125074038443", function(today) {
    return today.getDay() == 2;
  }, function(today, menuDay) {
    return today.getTime() == menuDay.getTime();
  });

  //Carl's Wirtshaus
  proxy("#carlswirtshaus", "http://www.carls-wirtshaus.de/getraenke-speisekarte/", function(data) {
    var url = $(data).find("#mittagstischkarte div[data-link$='.pdf']").attr('data-link');
    pdf("#carlswirtshaus-pdf", url);
    return '';
  });

  // MTV
  proxy("#mtv", "http://www.xn--gaststtte-mtv-karlsruhe-07b.de/html/speisekarte.html", function(data) {
    var $menu = $(data).find("#LayoutBereich10LYR");
    $menu.find('img').detach();
    $menu.find('a').detach();
    return $menu;
  });

  // Purino
  proxy("#purino", "http://www.purino.de/speisekarten/speisekarte.html", function(data) {
    var $menu = $(data).find(".mod_article.block");
    $menu.find('img').detach();
    return $menu;
  });

  //Liebes Beef
  proxy("#liebesbeef", "http://www.liebesbeef.de/standorte/karlsruhe/", function(data) {
    var url = $(data).find("a[href$='.pdf']").attr('href');
    if (url) {
      pdf("#liebesbeef-pdf", url);
    }
    return '';
  });

  //Liebes Beef
  proxy("#cafegold", "http://www.gold-ka.de/home/menu/essen/", function(data) {
    var url = $(data).find('.tag-tageskarte a[href$=".jpg"]').attr('href');
    return '<img id="cafegold-menu-img" src="' + url + '"/>';
  });

  moment.locale('de');
  var week = moment(new Date()).week();
  pdf("#rintheimerstuben",
      "http://www.tsv-rintheim.de/images/Wochenkarten/Wochenkarte_KW" + week + ".pdf?date=" +
      (new Date()).getTime());

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
