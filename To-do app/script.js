$(document).ready(function() {

var API_ROOT ="https://todo-list.dcism.org"
var user=JSON.parse(sessionStorage.getItem("graveyard_user"));
if(!user){  
    window.location.href = "signin.html";
    return; 
}

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
    note.append(title);
    note.append(description);
    note.append(update);
    note.append(disappearalnote);
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
        var id=$(this).data("id");
        console.log("Delete task clicked:", id);

    $.ajax({
        url: API_ROOT + "/deleteItem_action.php",
        method: "DELETE",
        dataType: "json",
        contentType: "text/plain",
        data: JSON.stringify({
            item_id: id
        })
    })
    .done(function(response){
        console.log("Delete response:");
        console.log(response);
    });
task = task.filter(function(t){
    return t.item_id != id;
});

renderNotes(task);
   });

    

//note for proffessor read me  
//HI I know your wondering why is there a note on the code well...
// Access to XMLHttpRequest at 'https://todo-list.dcism.org/deleteItem_action.php' from origin 'http://127.0.0.1:3000' has been blocked by CORS policy: Method DELETE is not allowed by Access-Control-Allow-Methods in preflight response.
//jquery-3.7.1.min.js:2  DELETE https://todo-list.dcism.org/deleteItem_action.php net::ERR_FAILED
//and 
//Access to XMLHttpRequest at 'https://todo-list.dcism.org/editItem_action.php' from origin 'http://127.0.0.1:3000' has been blocked by CORS policy: Method PUT is not allowed by Access-Control-Allow-Methods in preflight response.
//jquery-3.7.1.min.js:2  PUT https://todo-list.dcism.org/editItem_action.php net::ERR_FAILED
//everything else works expect for these as I do not have the authority to access it
   


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
    });

});

});