
$(() => {
  // catch the value from textarea and send it to back-end
  $("#submit_list").click(function () {
    event.preventDefault();
    var comment = $("#add_item").val();
    console.log(comment);
    if (comment === "") {
      $('#errorMsg').text('you can not add an empty item');
    }
    $.post('/items', { comment }, function (data) {
      console.log(data);
    }).then(data => {
      console.log("request complete data");
    }).catch(err => {
      console.log(err);
    });

  });

});
