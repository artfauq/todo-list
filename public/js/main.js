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
        $('#task-' + index).animate({ opacity: 0 }, { duration: 500 }).slideUp(400, function() {
            $(this).remove();
        });
    });

    $('#taskForm').submit(function(event) {
        var input = $(this).find('input');

        if (!input.val() || input.val() === "") {

        } else {
            socket.emit('newTask', input.val());
            input.val("");
            input.blur();
            event.preventDefault();
        }
    });
});

function appendTask(content, index) {
    var newTask = '<div class="task" id="task-' + index + '"><p class="v-align"><a href="#" id="link-task-' + index + '" class="task-delete" onclick="removeTask(this)"><i class="fa fa-minus-circle"></i></a><span>' + content + '</span></p></div>';

    // $('#tasks').append(newTask).children(':last').css('opacity', 0).slideDown('slow').animate({ opacity: 1 }, { duration: 'slow' });

    $('#tasks').append(newTask).children(':last').slideDown(500).css('opacity', 0).animate({ opacity: 1 }, { duration: 500 });
}

function removeTask(element) {
    var id = $(element).parent().parent().attr('id');
    var index = id.substr(id.lastIndexOf('-') + 1);

    socket.emit('removeTask', index);
}