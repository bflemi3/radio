requirejs.config({
    paths: {
        jquery: 'node_modules/jquery/dist/jquery',
        bluebird: 'node_modules/bluebird/js/browser/bluebird',
        underscore: 'node_modules/underscore/underscore'
    }
});

require(['jquery', 'radio'], function($, radio) {

    // set trusted origins for all incoming messages. since this is on the same domain then we can just use location.origin
    // It's only necessary to set allowed origins if the message will not be coming from the current origin
    // radio.allowFrom(location.origin);
    //
    // // listen for a getPointData request from other radio listener
    // radio.listen('getPointData', function(message) {
    //     return { name: 'brandon', age: 35 };
    // });
    //
    // radio.listen(function(sender) {
    //     addMessage(sender.message);
    //     radio.send(sender.source, 'I got your message');
    // });
    //
    // // send a message from the textbox to the other radio listener
    // $('button.send-message').on('click', function() {
    //     var message = $('input').val();
    //     radio.send(som, message).then(function(sender) {
    //         addMessage(sender.message);
    //     });
    //     return false;
    // });
    //
    // // request points data from the other radio listener
    // $('button.get-points').on('click', function() {
    //     radio.send('getPoints').then(function(message) {
    //         addMessage(message);
    //     });
    // });
    //
    // function addMessage(message) {
    //     $('.messages').append('<div>Message: ' + message + '</div>');
    // }
    debugger;
    console.log(window.__radio__);
});