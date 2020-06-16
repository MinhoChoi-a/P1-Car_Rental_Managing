jQuery(document).ready(function($){
    if(window.location.pathname == '/main/car/list') {
      $.get('/main/car/list/partial', {
          flag: 'all'}).then(function (data) {
              $('tbody#data-list').html(data);
          }); }
    
    else if(window.location.pathname == '/main/search/list') {
        var car_list = $("#data").val();
        $.get('/main/search/list/partial', {
            flag: 'all', data_list: car_list}).then(function (data) {
                $('tbody#data-list').html(data);
            });
        
        }
   });

jQuery(document).ready(function($){
      $("#option0").click(function() {
    if(window.location.pathname == '/main/car/list') {
        $.get('/main/car/list/partial', {
            flag: 'all'}).then(function (data) {
                $('tbody#data-list').html(data);
            });
        }

    else if(window.location.pathname == '/main/search/list') {
        var car_list = $(this).val();
        $.get('/main/search/list/partial', {
            flag: 'all', data_list: car_list}).then(function (data) {
                $('tbody#data-list').html(data);
            });
        }
    });
});

jQuery(document).ready(function($){
    $("#option1").click(function() {
    if(window.location.pathname == '/main/car/list') {
        $.get('/main/car/list/partial', {
            flag: 'year'}).then(function (data) {
                $('tbody#data-list').html(data);
            });
        }
    else if(window.location.pathname == '/main/search/list') {
            var car_list = $(this).val();
            $.get('/main/search/list/partial', {
                flag: 'year', data_list: car_list}).then(function (data) {
                    $('tbody#data-list').html(data);
                });
            }
        });
});

jQuery(document).ready(function($){
    $("#option2").click(function() {
    if(window.location.pathname == '/main/car/list') {
        $.get('/main/car/list/partial', {
            flag: 'price'}).then(function (data) {
                $('tbody#data-list').html(data);
            });
        }
    else if(window.location.pathname == '/main/search/list') {
            var car_list = $(this).val();
            $.get('/main/search/list/partial', {
                flag: 'price', data_list: car_list}).then(function (data) {
                    $('tbody#data-list').html(data);
                });
            }
        });
});

jQuery(document).ready(function($){
    $("#style-suv").click(function() {
   if(window.location.pathname == '/main/car/list') { 
        $.get('/main/car/list/partial', {
            flag: 'suv'}).then(function (data) {
                $('tbody#data-list').html(data);
            });
        }
    
    else if(window.location.pathname == '/main/search/list') {
        var car_list = $(this).attr("value");
        $.get('/main/search/list/partial', {
            flag: 'suv', data_list: car_list}).then(function (data) {
                $('tbody#data-list').html(data);
            });
        }
    });
});

jQuery(document).ready(function($){
    $("#style-small").click(function() {
   if(window.location.pathname == '/main/car/list') { 
        $.get('/main/car/list/partial', {
            flag: 'small'}).then(function (data) {
                $('tbody#data-list').html(data);
            });
        }
    
    else if(window.location.pathname == '/main/search/list') {
        var car_list = $(this).attr("value");
        $.get('/main/search/list/partial', {
            flag: 'small', data_list: car_list}).then(function (data) {
                $('tbody#data-list').html(data);
            });
        }
    });
});

jQuery(document).ready(function($){
    $("#style-truck").click(function() {
   if(window.location.pathname == '/main/car/list') { 
        $.get('/main/car/list/partial', {
            flag: 'truck'}).then(function (data) {
                $('tbody#data-list').html(data);
            });
        }
    
    else if(window.location.pathname == '/main/search/list') {
        var car_list = $(this).attr("value");
        $.get('/main/search/list/partial', {
            flag: 'truck', data_list: car_list}).then(function (data) {
                $('tbody#data-list').html(data);
            });
        }
    });
});

jQuery(document).ready(function($){
    $("#style-luxury").click(function() {
   if(window.location.pathname == '/main/car/list') { 
        $.get('/main/car/list/partial', {
            flag: 'luxury'}).then(function (data) {
                $('tbody#data-list').html(data);
            });
        }
    
    else if(window.location.pathname == '/main/search/list') {
        var car_list = $(this).attr("value");
        $.get('/main/search/list/partial', {
            flag: 'luxury', data_list: car_list}).then(function (data) {
                $('tbody#data-list').html(data);
            });
        }
    });
});

jQuery(document).ready(function($) {
    $("#data-list").on('click', ".clickable-tr", function() {
        window.location = $(this).data("href");
    });
});

jQuery(document).ready(function($) {
    $("#data-list").on('click', ".clickable-rs", function() {
        window.location = $(this).data("href")
    });
});