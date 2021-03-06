$(document).ready(function() {
  const socket = io();
  //message from server
  socket.on("newPost", msg => {
    outputMessage(msg);
  });
  $.get("/api/user_data", function(req) {
    if (req.id) {
      $(".welcome-hero").addClass("hide");
      $(".yourProfile").removeClass("hide");
      $("#logoutButton").removeClass("hide");
      $("#loginButton").addClass("hide");
      $("#signupButton").addClass("hide");
      $("#askQuestion").removeClass("hide");
      $(".replyButton").removeClass("hide");
    } else {
      $(".welcome-hero").removeClass("hide");
      $("#yourProfile").addClass("hide");
      $("#logoutButton").addClass("hide");
      $("#loginButton").removeClass("hide");
      $("#signupButton").removeClass("hide");
      $("#askQuestion").addClass("hide");
      $(".replyButton").addClass("hide");
    }
    $(".memberSection").on("click", event => {
      event.preventDefault();
      //Get userID of current user
      const CurrentUser = req.id;
      renderMemberQuestion(CurrentUser);
      $("#askQuestion").addClass("hide");
    });
    $(".userUsername").on("click", event => {
      event.preventDefault();
      let userId = $(event.target)
        .parent()
        .attr("data-user");
      // console.log(userId)
      renderMemberQuestion(userId);
      $("#askQuestion").addClass("hide");
    });
    function renderMemberQuestion(UserId) {
      const url = "/member/" + UserId;
      window.location.href = url;
    }

    // adding delete button functionality
    $(".userUsername").each(function() {
      if (parseInt($(this).data("user")) === parseInt(req.id)) {
        $(this).addClass("activeUser");
      }
    });
    //For each question checking to see if the question belongs to current user then rendering 'Delete' button
    $(".profile-page .question").each(function() {
      if (parseInt($(this).data("user")) === parseInt(req.id)) {
        let questionId = $(this).data("id");
        let newDeleteButton = $("<div>");
        newDeleteButton.html(`
        <div class="media-right">
          <button class="delete delete-button is-danger" data-id=${questionId}></button>
        </div>
        `);
        $(this).append(newDeleteButton);

        $(".delete-button").each(function(index) {
          let qid = $(this).attr("data-id");
          $(".delete-button")
            .eq(index)
            .on("click", () => {
              $.ajax(`/api/questions/${qid}`, {
                type: "DELETE"
              }).then(() => {
                //Broadcast the question
                socket.emit("newPost", "question deleted");
                location.reload();
              });
            });
        });
      }
    });
  });
  //Output message on DOM
  function outputMessage(msg) {
    console.log("got new event" + msg);
    location.reload();
  }
});
