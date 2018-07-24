/*
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
*/

function googlePdf(htmlId, url, options) {
    var googleUrl = 'https://docs.google.com/gview?url=' + encodeURIComponent(url) + '&embedded=true';
    var link = $('<a>Speisekarte</a>').attr('href', googleUrl).attr('target', '_blank');

    var embed = $('<embed></embed>')
      .attr('src', url)
      .attr('width', options.width)
      .attr('height', options.height)
      .attr('type', 'application/pdf');

    var iframe = $('<iframe></iframe>')
      .attr('src', googleUrl)
      .attr('frameborder', '0')
      .css('display', 'block')
      .css('margin', '0 auto')
      .css('width', options.width + 'px')
      .css('height', options.height + 'px');

    iframe.append(embed);

    $(htmlId + '-menu').append(link).append(embed);
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
    if (html) { 
      $(htmlId + "-menu").append(html);
    }
  });
}

$(document).ready(function() {

  // *** Restaurants ***

  // Purino
  //Cafe Gold
/*
  moment.locale('de');
  var week = moment(new Date()).week();
  pdf("#rintheimerstuben",
      "http://www.tsv-rintheim.de/images/Wochenkarten/Wochenkarte_KW" + week + ".pdf?date=" +
      (new Date()).getTime());

  // MTV
  proxy("#mtv", "http://www.xn--gaststtte-mtv-karlsruhe-07b.de/html/speisekarte.html", function(data) {
    var $menu = $(data).find("#LayoutBereich10LYR");
    $menu.find('img').detach();
    $menu.find('a').detach();
    return $menu;
  });
*/
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
