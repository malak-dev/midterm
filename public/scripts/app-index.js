$(() => {

  // $.ajax({
  //   method: "GET",
  //   url: "/api/users"
  // }).done((users) => {
  //   for (user of users) {
  //     $("<div>").text(user.name).appendTo($("body"));
  //   }
  // });;
  $("#submit_list").click(function () {
    var comment = $("#add_item").val();
    alert(comment);
  });

});

