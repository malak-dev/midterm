
$(() => {
  // catch the value from textarea and send it to back-end
  $("#submit_list").click(function () {
   event.preventDefault();
    var comment = $("#add_item").val();
    console.log(comment);
    if (!comment) {
      $('#addNewItem').append("<p> You Can not Add an Empty Item </p>").addClass("alert alert-danger")
    }
    if(comment){
      {
        event.preventDefault();
        $('#addNewItem').append("<p> your item is added </p>").addClass("alert alert-success")
      }
    $.post('/items', { comment }, function (data) {
      console.log(data);

    }).then(data => {
      console.log(data.err)
      if (data.err === true) {
        $('#addNewItem').append("<p> Can\'t add the item: Please modify your description </p>").addClass("alert alert-danger")

      }
      else {
      console.log("...",data);
      console.log("request complete data");
      }
    }).catch(err => {
      console.log(err);
    });
  }
  });

});
