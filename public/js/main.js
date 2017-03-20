$(document).ready(function() {

    var socket = io('http://localhost:8080');

    socket.on('newTask', function(data) {
        console.log(data);
    });

    $('#taskForm').submit(function(event) {
        var inputContent = $(this).find('input').val();

        if (!inputContent || inputContent === '') {

        } else {
            socket.emit('newTask', inputContent);
        }
    });
});