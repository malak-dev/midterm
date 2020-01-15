
$(() => {
  $("#register").click(function () {
    event.preventDefault();
    var email = $("#email").val();
    var password = $("#password").val();
    var first_name = $('#first_name').val();
    var last_name = $('#last_name').val();
    var number = $('#number')

    if (!email) {
      $('#emailmsg').text('please enter your email');
    }
    if (!password) {
      $('#passwordmsg').text('please enter your password');

    }
    $.post('/register', { email, password, first_name, last_name, number }, function (data) {
      console.log(data);
    }).then(data => {
      console.log("request complete data");
    }).catch(err => {
      console.log(err);
    });
  });
});
