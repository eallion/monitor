$(document).ready(function(){
	
	$("#resolution").html(screen.width+"x"+screen.height+"x"+screen.colorDepth);
	$("#bodysize").html($("#welcome").width()+"x"+$("#welcome").height());

	slide = new Array();
	current_slide = 0;
	var lock = 1;
			
	$("#main li").each(function(i){
		var id = $(this).attr("id");
		var title = $(this).data("title");
		var size = slide.push({
			"id" : id,
			"title" : title,
			"description" : $(this).data("desc"),
		});
		$("#control_buttons").append(
			$("<a />").attr("id", "btn-"+id).text(title).click(function(){go(size-1);})
		);
	});
	
	var adjust_control = function () {
		var $btn = $("#btn-"+slide[current_slide].id);
		var current_left = $btn.offset().left;
		var target_left  = ($("#container").width()-$btn.width())/2;
		var $wrapper = $("#control_buttons");
		var pos = $wrapper.position();
		pos.left += target_left-current_left;
		$wrapper.css("left", pos.left);
	}
		
	go = function(i) {
		if (slide.length>0 && i>=0 && i<slide.length) {
            // location.hash = slide[i].id;
			current_slide = i;
			$("#control .top .title").text(slide[i].title);
			$("#control .top .description").text(slide[i].description);
            $(".slide").addClass("hide");
            $("#" + slide[current_slide].id).removeClass("hide");
		}
		setTimeout(function(){lock=(i==0);}, 100);
		adjust_control();
	}
	
	$("#main").bind("mousewheel", function(e, d) {
		if (lock) return;
		if (d>0) { // wheel up
			go(current_slide-1);
		} else { // wheel down
			go(current_slide+1);
		}
	}).bind("click", function(e) {
		if (lock) return;
		if (current_slide + 1 == slide.length) {
			$(document).fullScreen(false);
			go(0);
		} else {
			go(current_slide+1);
        }
	});
	
	$(document).keyup(function(e) {
		if (lock) return;
		switch (e.keyCode) {
			case 37: // arrow left
				go(current_slide-1); break;
			case 39: // arror right
			case 13: // enter
			case 32: // space
				go(current_slide+1); break;
			case 27: // esc
				$(document).fullScreen(false);
				go(0);
		}
	});
	
	var mouse_in_control_panel = 0;
	var last_main_mousemove = 0;
	var control_panel_daemon = 0;
	
	$("#main").bind("mousemove", function () {
		if (slide[current_slide].id.substring(0,5) == "test-") {
			last_main_mousemove = $.now();
			$("#control").removeClass("control_hide").addClass("control_show");
			if (control_panel_daemon == 0) {
				control_panel_daemon = setInterval(function(){
					if (!mouse_in_control_panel && $.now()-last_main_mousemove > 2000) {
						$("#control").removeClass("control_show").addClass("control_hide");
						clearInterval(control_panel_daemon);
						control_panel_daemon = 0;
					}
				}, 200);
			}
		}
	});

	$("#control").mouseenter(function(){
		mouse_in_control_panel = 1;
	}).mouseleave(function(){
		mouse_in_control_panel = 0;
	});

	var last_resize = 0;
	var resolution_tips_daemon = 0;
	$(window).resize(function(e) {
		$("#resolution").html(screen.width+"x"+screen.height+"x"+screen.colorDepth);
		$("#bodysize").html($("#welcome").width()+"x"+$("#welcome").height());
		$("#resolution_tips").text($("#body").width()+"x"+$("#container").height()).show();
		last_resize = $.now();
		if (resolution_tips_daemon == 0) {
			resolution_tips_daemon = setInterval(function(){
				if ($.now()-last_resize > 1000) {
					$("#resolution_tips").fadeOut();
					clearInterval(resolution_tips_daemon);
					resolution_tips_daemon = 0;
				}
			}, 200);
		}
		adjust_control();
	});	

	$("#start").click(function(){
		$(document).fullScreen(true);
		go(1);
	});

	$("#stop").click(function(){
		$(document).fullScreen(false);
		go(0);
	});

	go(0);
	
});


