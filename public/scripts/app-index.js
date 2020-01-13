
$(() => {

  $("#submit_list").click(function () {
    var comment = $("#add_item").val();
    console.log(comment);
    $.post('/items', { comment }, function (data) {
      console.log(data);
    }).then(data => {
      console.log("request complete data");
    }).catch(err => {
      console.log(err);
    });

  });

});

