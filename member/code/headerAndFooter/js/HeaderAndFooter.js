// search bar
$(function() {
	$('#search-menu').removeClass('toggled');

	$('#search-icon').click(function(e) {
		e.stopPropagation();
		$('#search-menu').toggleClass('toggled');
		$("#popup-search").focus();
	});
	
	$('#search-menu input').click(function(e) {
		e.stopPropagation();
	});

	$('#search-menu, body').click(function() {
		$('#search-menu').removeClass('toggled');
	});
});