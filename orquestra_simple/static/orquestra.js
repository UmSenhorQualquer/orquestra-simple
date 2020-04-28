function loading()		{ /*$("#loading-label").addClass('active'); */		};
function not_loading()	{/* $("#loading-label").removeClass('active'); */	};

function home(name, label, url){
	$.ajax({
		method: 	'get',
		cache: 		false,
		dataType: 	"json",
		url: url,
		contentType: "application/json; charset=utf-8",
		success: function(res){
			if( res.result=='error' )
				error_msg(res.msg);
			else{
				var html = '';
				html += '<div class="ui center container" >'
				html += "<form onsubmit='return false;' class='ui form "+res.css+"' id='app-"+res.app_id+"' >";
				html += res.code;
				html += '</form>';
				html += '</div>';
				$('#app-container').html(html);
			};
		}
	}).fail(function(xhr){
		error_msg(xhr.status+" "+xhr.statusText+": "+xhr.responseText);
	}).always(function(){
		pyforms.garbage_collector();
	});
};

function home_full(name, label, url){
	$.ajax({
		method: 	'get',
		cache: 		false,
		dataType: 	"json",
		url: url,
		contentType: "application/json; charset=utf-8",
		success: function(res){
			if( res.result=='error' )
				error_msg(res.msg);
			else{
				var html = '';
				html += '<div class="ui" style="padding-left: 30px; padding-right: 30px" >'
				html += "<form onsubmit='return false;' class='ui form "+res.css+"' id='app-"+res.app_id+"' >";
				html += res.code;
				html += '</form>';
				html += '</div>';
				$('#app-container').html(html);
			};
		}
	}).fail(function(xhr){
		error_msg(xhr.status+" "+xhr.statusText+": "+xhr.responseText);
	}).always(function(){
		pyforms.garbage_collector();
	});
};

// actual addTab function: adds new tab using the input from the form above
function append_home(name, label, url) {
	$.ajax({
		method: 	'get',
		cache: 		false,
		dataType: 	"json",
		url: url,
		contentType: "application/json; charset=utf-8",
		success: function(res){
			if( res.result=='error' )
				error_msg(res.msg);
			else{
				var html = '';
				html += '<div class="ui raised floated segment" style="margin:20px; min-width:650px;" >';
				html += '<h2 class="ui right floated header">'+label+'</h2>';
				html += '<div class="ui clearing divider"></div>';
				html += "<form onsubmit='return false;' class='ui form "+res.css+"' id='app-"+res.app_id+"' >";
				html += res.code;
				html += '</form>';
				html += '</div>';
				$(html).appendTo('#app-container').show('fadeIn');
			};
		}
	}).fail(function(xhr){
		error_msg(xhr.status+" "+xhr.statusText+": "+xhr.responseText);
	}).always(function(){
		pyforms.garbage_collector();
	});
};

var refreshEvent = setInterval(function(){},100000);
var msg_timeout = undefined;

function success_msg(msg){
	if(msg_timeout!=undefined) clearTimeout(msg_timeout);
	$('#top-menu').popup({title: 'Success', variation:'basic', on:'manual', content: msg, position:'top center'}).popup('show');
	msg_timeout = setTimeout(function(){$('#top-menu').popup('destroy');}, 5000);
};

function error_msg(msg){
	if(msg_timeout!=undefined) clearTimeout(msg_timeout);
	$('#top-menu').popup({title: 'Error', variation:'basic', on:'manual', content: msg, position:'top center'}).popup('show');
	msg_timeout = setTimeout(function(){$('#top-menu').popup('destroy');}, 10000);
};

function get_current_folder(){
	if($('#MyAreaAppID-_directory').length)
		return $('#MyAreaAppID-_directory').val();
	else
		return '/';
};

/*********************************************************/
/*********************************************************/
/*********************************************************/
function show_window(name, label, url, bigwindow) {
	var dialog_id = "dialog-"+name;

	$.ajax({
		method: 	'get',
		cache: 		false,
		dataType: 	"json",
		url: url,
		contentType: "application/json; charset=utf-8",
		success: function(res){
			if( res.result=='error' )
				error_msg(res.msg);
			else{
				var window_exists = $('#'+dialog_id).length>0;
				var extra_css = '';
				if(bigwindow)
					extra_css = 'large';

				if( !window_exists )
					$('body').append(`<div class='ui ${extra_css} modal' id='${dialog_id}' ></div>`);

				var html = '<i class="close icon"></i><div class="header">'+label+'</div>';
					html += '<div class="content">';
					html += "<form onsubmit='return false;' class='ui form"+res.css+"' id='app-"+res.app_id+"' >";
					html += res.code;
					html += '</form>';
					html += '</div>';

				$('#'+dialog_id).html(html);
				
				if( !window_exists )	
					$('#'+dialog_id).modal(
						'setting', 'autofocus', false).modal(
						'setting', 'observe Changes', true).modal(
						'setting', 'duration', 0).modal(
						'setting', 'onHide', function(e){
						pyforms.remove_app(res.app_id);
					}).modal('show');
				else
					$('#'+dialog_id).modal('refresh').modal('show');

				setTimeout(`$('#${dialog_id}').modal('refresh');`, 200);
			};
		}
	}).fail(function(xhr){
		error_msg(xhr.status+" "+xhr.statusText+": "+xhr.responseText);
	}).always(function(){
		pyforms.garbage_collector();
	});
};
function activate_window(name, label, url) {
	var dialog_id = "dialog-"+name;
	$('#'+dialog_id).modal('show');
};
function close_window(app_id){
	var dialog_id = "dialog-"+app_id;
	$('#'+dialog_id).modal('hide');
	$('#'+dialog_id).remove();
};

function show_bigwindow(name, label, url) {
	show_window(name, label, url, true);
}
/*********************************************************/
/*********************************************************/
/*********************************************************/

$(document).ready(function() {
	pyforms.register_layout_place(0, home);
	pyforms.register_layout_place(2, show_window, activate_window, close_window);
	pyforms.register_layout_place(3, append_home);

	pyforms.register_layout_place(4, home_full);

	pyforms.register_layout_place(6, show_bigwindow, activate_window, close_window);

	pyforms_checkhash_wrapper();
});





