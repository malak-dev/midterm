
$(() => {
  // catch the value from textarea and send it to back-end
  $("#submit_list").click(function () {
    event.preventDefault();
    var comment = $("#add_item").val();
    console.log(comment);
    if (!comment) {
      $('#emptymsg').text(" You Can not Add an Empty Item ").removeClass("alert alert-success").addClass("alert alert-danger");
    }

    $.post('/items', { comment }, function (data) {
      console.log(data);

    }).then(data => {
      console.log(data.err)
      if (data.err === true) {
        $('#emptymsg').text(" Can\'t add the item, Please modify your description").removeClass("alert alert-success").addClass("alert alert-danger");

      }
      else {
        $('#emptymsg').text("your item is added").removeClass("alert alert-danger").addClass("alert alert-success");
        console.log(data);
        console.log("request complete data");
      }
    }).catch(err => {
      console.log(err);
    });

  });

});
