$(() => {
  $("#edit_profile").click(function () {
    var $inputs = $('#myForm :input');
    var values = {};
    $inputs.each(function () {
      values[this.name] = $(this).val();
    })
    $.post('/edit_profile', values, function (data) {
      console.log(data);
    }).then(data => {
      console.log("request complete data");
    }).catch(err => {
      console.log(err);
    });
  })
});
