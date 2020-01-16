
$(() => {
  $("#register").click(function () {
    event.preventDefault();
    var email = $("#email").val();
    var password = $("#password").val();
    var first_name = $('#first_name').val();
    var last_name = $('#last_name').val();
    var number = $('#number').val();

    if (!email) {
      $('#emailmsg').text('please enter your email');
    }
    if (!password) {
      $('#passwordmsg').text('please enter your password');

    }
    if (email && password) {
      $('#succes').text("your account is added go and login").addClass("alert alert-success");
      $.post('/register', { email, password, first_name, last_name, number }, function (data) {
        console.log(data);
      }).then(data => {
        console.log("request complete data");

      }).catch(err => {
        console.log(err);
      });
    }
  });
});
