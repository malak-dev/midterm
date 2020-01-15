
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
      console.log(data.err)
      if (data.err === true) {
      $('#errorMsg').text('Can\'t add the item: Please modify your description');
      }
      else {
      console.log("...",data);
      console.log("request complete data");
      }
    }).catch(err => {
      console.log(err);
    });

  });

});
