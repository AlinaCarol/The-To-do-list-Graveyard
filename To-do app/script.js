$(document).ready(function() {

var API_ROOT ="https://todo-list.dcism.org"
var user=JSON.parse(sessionStorage.getItem("graveyard_user"));
if(!user){  
    window.location.href = "signin.html";
    return; 
}
$("#logout").on("click", function(e){
    e.preventDefault();
    sessionStorage.removeItem("graveyard_user");
       window.location.href = "signin.html";
});
var task=[];


    console.log("Greeting user: " + user.fname);

    $(".nav-link").on("click", function(e){
    e.preventDefault();
    var target = $(this).data("page");
    console.log("Clicked:", target);
    $(".nav-link").removeClass("active");
    $(this).addClass("active");

   $(".page").removeClass("active");
    $("#page-" + target).addClass("active");
  
});

 
$.ajax({
    url: API_ROOT + "/getItems_action.php",
    method: "GET",
    dataType: "json",
    data:{
        status: "active",
        user_id: user.id
    }
})
.done (function(response){
   
    console.log("API Response: ");
   console.log(response);
    task = Object.values(response.data);

    console.log("Tasks: ");
    console.log(task);
       renderNotes(task);

});

function createNoteElement(task){

    console.log("CREATE NOTE:", task.item_name);
    var note =$("<article>");
    note.addClass("note");
    if(task.status=="inactive"){
       note.addClass("inactive");
}
else if(task.priority=="high"){
    note.addClass("high-priority");

}
else if(task.priority=="important"){
    note.addClass("important-priority");

}
else{
        note.addClass("normal-priority");
}
    var title =$("<h5>").addClass("note-title").text(task.item_name);

    var description = $("<p>").text(task.item_description);

    var update=$("<button>").addClass("edit-task").attr("data-id", task.item_id).html('<i class="fa-solid fa-pen-to-square"></i>');
     var disappearalnote=$("<button>").addClass("delete-task").attr("data-id", task.item_id).html('<i class="fa-solid fa-xmark"></i>');
     var done = $("<button>") .addClass("done-task") .attr("data-id", task.item_id).html('<i class="fa-solid fa-check"></i>');
    note.append(title);
    note.append(description);
    note.append(update);
    note.append(disappearalnote);
    note.append(done);
    return note; 
}

function renderNotes(list){
    $("#notesGrid").empty();
    if(list.length==0){
        $("#notesGrid").append("<p>No tasks found.</p>");
        return;
    }
    list.forEach(function(task){
           console.log("Creating:", task.item_name);

        var note= createNoteElement(task);
        $("#notesGrid").append(note);
    });
     console.log("Notes grid:", $("#notesGrid").html());
}
function showNotification(message){
    $("#notification").text(message);
    $("#notification").addClass("show");

    setTimeout(function(){
        $("#notification").removeClass("show");
    }, 2500);
}
function changeTaskStatus(taskId){

    $.ajax({
        url: API_ROOT + "/statusItem_action.php?item_id=" + taskId + "&status=inactive",
        method: "PUT",
        dataType: "json"
    }) 
    .done(function(response){

        console.log("Status Response:");
        console.log(response);

        task = task.filter(function(t){
            return t.item_id != taskId;
        });

        renderNotes(task);

        showNotification("Task completed!");

    })
    .fail(function(xhr){

        console.log("Status update failed:");
        console.log(xhr.responseText);

    });
}
$(document).on("click", ".done-task", function(){

    var id = $(this).data("id");

    console.log("Done task clicked:", id);

    changeTaskStatus(id);
});
$(document).on("click", ".done-task", function(){
    var id = $(this).data("id");

    console.log("Done task clicked:", id);

    changeTaskStatus(id);
});
  $(document).on("click", ".edit-task", function(){
        var id=$(this).data("id");
        console.log("Edit task clicked:", id);
             
        var selectedTask=task.find(function(t){
            return t.item_id==id;
    
        });
           console.log("Selected task:", selectedTask);

     $("#updateTaskId").val(selectedTask.item_id);

           $("#updateTaskName").val(selectedTask.item_name);
           $("#updateTaskDescription").val(selectedTask.item_description);
           $("#updateTaskPriority").val(selectedTask.priority || "normal");
$("#updateTaskStatus").val(selectedTask.status || "active");
          $("#updateModal").addClass("active");
     

    });

 $("#closeUpdate").on("click", function(){  
    $("#updateModal").removeClass("active");
 });

$(document).on("click", ".delete-task", function(){

    var id = $(this).data("id");

    console.log("Delete task clicked:", id);

    $.ajax({
        url: API_ROOT + "/deleteItem_action.php?item_id=" + id,
        method: "DELETE",
        dataType: "json"
    })
    .done(function(response){

        console.log("Delete response:");
        console.log(response);

    })
    .fail(function(xhr){

        console.log("Delete failed:");
        console.log(xhr.responseText);

    });

    // Remove the note from the screen immediately
    task = task.filter(function(t){
        return t.item_id != id;
    });

    renderNotes(task);

    showNotification("Task deleted successfully!");
});
    

   


$("#addTaskForm").on("submit", function(e){
    e.preventDefault();
    var name = $("#addTaskName").val();
    var description = $("#addTaskDescription").val();
var priority = $("#addTaskPriority").val();

console.log("Priority: " + priority);
    console.log("Adding task: " + name + " - " + description);

    $.ajax({
        url: API_ROOT + "/addItem_action.php",
        method: "POST",
        dataType: "json",
        contentType: "text/plain",
        data: JSON.stringify({
            item_name: name,
            item_description: description,
            user_id: user.id
        })

    })
    
    .done(function(response){
        console.log("Add task Response: ");
        console.log(response);
         showNotification("Task added successfully!");
        response.data.priority = priority;
   task.push(response.data);
   
        console.log("Tasks: ");
        console.log(task); 
         renderNotes(task);

})
});

$("#updateTaskForm").on("submit", function(e){

    e.preventDefault();

    var id = $("#updateTaskId").val();
    var name = $("#updateTaskName").val();
    var description = $("#updateTaskDescription").val();

    console.log("ID:", id);
    console.log("Name:", name);
    console.log("Description:", description);

    $.ajax({
        url: API_ROOT + "/editItem_action.php",
        method: "PUT",
        dataType: "json",
        contentType: "text/plain",
        data: JSON.stringify({
            item_name: name,
            item_description: description,
            item_id: id
        })
    })
.done(function(response){

    console.log("Update response:");
    console.log(response);

    var selectedTask = task.find(function(t){
        return t.item_id == id;
    });

    if(selectedTask){
        selectedTask.item_name = name;
        selectedTask.item_description = description;
    }

    renderNotes(task);

    $("#updateModal").removeClass("active");

    showNotification("Task updated successfully!");
});
});


});