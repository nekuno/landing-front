(function($) {

    var widthThreshold = 1025;

    /** Start sliiide settings (Mobile navigation) **/
    var settings = {
        toggle: "#hamburger", // the selector for the menu toggle, whatever clickable element you want to activate or deactivate the menu. A click listener will be added to this element.
        //exit_selector: ".close", // the selector for an exit button in the div if needed, when the exit element is clicked the menu will deactivate, suitable for an exit element inside the nav menu or the side bar
        animation_duration: "0.5s", //how long it takes to slide the menu
        place: "right", //where is the menu sliding from, possible options are (left | right | top | bottom)
        animation_curve: "cubic-bezier(0.54, 0.01, 0.57, 1.03)", //animation curve for the sliding animation
        body_slide: true, //set it to true if you want to use the effect where the entire page slides and not just the div
        no_scroll: true //set to true if you want the scrolling disabled while the menu is active
    };

    var navigationMobile = $("#navigation-mobile");
    navigationMobile.sliiide(settings); //initialize sliiide

    navigationMobile.find('.navigation-item h4').on('click', selectItem);

    function selectItem(e) {
        var item = $(e.target).parent('.navigation-item');
        navigationMobile.find('.active').removeClass('active');
        item.addClass('active');
    }

    /** End sliiide settings (Mobile navigation) **/

    /** Start Swipe settings (Mobile slider) **/
    initSwipeIfSmallScreen();
    $(window).on('resize', initSwipeIfSmallScreen);

    var timeout = null;
    function initSwipeIfSmallScreen() {
        if (timeout) {
            window.clearTimeout(timeout);
        }
        timeout = window.setTimeout(function () {
            if ($(window).width() < widthThreshold && !window.mySwipe) {
                window.mySwipe = new Swipe(document.getElementById('slider'), {
                    startSlide: 0,
                    speed: 400,
                    auto: 3000,
                    continuous: true,
                    disableScroll: false,
                    stopPropagation: false,
                    callback: changeActiveDot
                });

                $('.slider-dots .slider-dot').on('click', goToSlide)

            } else if ($(window).width() >= widthThreshold && window.mySwipe) {
                window.mySwipe.kill();
                window.mySwipe = null;
                $('.slider-dots .slider-dot').off('click')
            }
        }, 500);
    }
    function changeActiveDot(index) {
        var sliderDotsElems = $('.slider-dots .slider-dot');
        sliderDotsElems.closest('.active').removeClass('active');
        sliderDotsElems.eq(index).addClass('active');
    }

    function goToSlide(e) {
        var index = $(e.target).data('index');
        window.mySwipe.slide(index);
    }

    /** End Swipe settings (Mobile slider) **/

    /** Start fixed menu settings **/
    window.setInterval(toggleMenuIfNeeded, 500);

    function toggleMenuIfNeeded() {
        var hasSmallScreen = $(window).width() < widthThreshold;
        var isScrolled = $('#menu').hasClass('scrolled');
        var top = $(window).scrollTop();
        if (!hasSmallScreen && isScrolled || isScrolled && top < 50) {
            showTopMenu();
        } else if (hasSmallScreen && !isScrolled && top >= 50) {
            showScrolledMenu();
        }
    }

    function showScrolledMenu() {
        $('#menu').addClass('scrolled');
    }

    function showTopMenu() {
        $('#menu').removeClass('scrolled');
    }

    /** End fixed menu settings **/

    /** Start section scroll settings **/
    var sectionScrollActive = false;
    initSectionScrollIfLargeScreen();
    $(window).on('resize', initSectionScrollIfLargeScreen);

    function initSectionScrollIfLargeScreen() {
        if (!sectionScrollActive && $(window).width() >= widthThreshold) {
            $('body').sectionScroll();
            sectionScrollActive = true;
        }
    }

    /** End fixed menu settings (on scroll) **/

    /** Start RSS settings **/
    var feed = "http://blog.nekuno.com/feed";

    $.ajax(feed, {
        accepts:{
            xml:"application/rss+xml"
        },
        dataType:"xml",
        success:function(data) {
            //Credit: http://stackoverflow.com/questions/10943544/how-to-parse-an-rss-feed-using-javascript

            $(data).find("item").each(function () { // or "item" or whatever suits your feed
                var el = $(this);
                console.log("------------------------");
                console.log("title      : " + el.find("title").text());
                console.log("link       : " + el.find("link").text());
                console.log("description: " + el.find("description").text());
            });


        }
    });
    
    
    
})(jQuery);
