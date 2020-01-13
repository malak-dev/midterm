$(() => {
  $.ajax({
    method: "GET",
    url: "/list/userId"
  }).done((lists) => {
    for (list of lists) {
      $("<div>").text(list).appendTo($("body"));
    }
  });;
});
