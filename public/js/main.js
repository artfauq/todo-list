var socket = io('http://localhost:8080');

$(document).ready(function() {

    // Socket.IO implementation
    socket.on('initialize', function(tasks) {
        tasks.forEach(function(content, index) {
            appendTask(content, index);
        });
    });

    socket.on('addTask', function(task) {
        appendTask(task.content, task.index);
    });

    socket.on('removeTask', function(index) {
        $('#task-' + index).remove();
    });

    $('#taskForm').submit(function(event) {
        var input = $(this).find('input');

        if (!input.val() || input.val() === "") {

        } else {
            socket.emit('newTask', input.val());
            input.val("");
            event.preventDefault();
        }
    });


});

function appendTask(content, index) {
    var newTask = '<div class="task" id="task-' + index + '"><p class="v-align"><a href="#" id="link-task-' + index + '" class="task-delete" onclick="removeTask(this)"><i class="fa fa-minus-circle"></i></a><span>' + content + '</span></p></div>';

    $('#tasks').append(newTask);
}

function removeTask(element) {
    var id = $(element).parent().parent().attr('id');
    var index = id.substr(id.lastIndexOf('-') + 1);

    socket.emit('removeTask', index);

    return false;
}