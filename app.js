requirejs.config({
    paths: {
        jquery: 'node_modules/jquery/dist/jquery',
        bluebird: 'node_modules/bluebird/js/browser/bluebird',
        underscore: 'node_modules/underscore/underscore'
    }
});

require(['jquery', 'radio'], function($, radio) {

    function addMessage(message) {
        $('.messages').append('<div>Message: ' + message + '</div>');
    }

    // set allowable origins for all incoming messages
    // It's only necessary to set allowed origins if the message will not be coming from the current origin
    radio.allowFrom(location.origin);

    // handler for getPoints request
    radio.listen('getPoints', function(message) {
        return [1, 2, 3];
    });

    // handler for all other requests
    radio.listen(function(message) {
        addMessage(message);
    });

    // click handler for message textbox
    $('button.send-message').on('click', function() {
        var message = $('input').val();
        radio.send(som, message).then(function(message) {
            $('.messages').append('<div>' + message + '</div>')
        });
        return false;
    });

    // open another window which will also have the radio library loaded
    var som = window.open('/radio/window2.html');
}); 