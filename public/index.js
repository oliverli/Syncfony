window.getCsrfToken = function () {
  return $("meta[name='csrf-token']").attr("content");
};

function showError(xhr) {
  alert((xhr.responseJSON && xhr.responseJSON.error) || "Something went wrong, please try again.");
}

$(document).ready(function () {
  if (sessionStorage.exited) {
    sessionStorage.removeItem("exited");
    sessionStorage.removeItem("roomID");
    sessionStorage.removeItem("peerID");
    sessionStorage.removeItem("tempClientStore");
    sessionStorage.removeItem("nickname");
  }
  if (sessionStorage.roomID && !sessionStorage.exited) {
    window.location.replace("./room/");
  }
  let peer;
  if (sessionStorage.peerID) {
    peer = new Peer(sessionStorage.peerID, peerOptions());
  } else {
    peer = new Peer(peerOptions());
  }
  peer.on("open", function (id) {
    sessionStorage.peerID = id;
    console.log("Peer ID: " + id);
  });

  $("#joinRoom").on("click", joinRoom);
  $("#createRoom").on("click", createRoom);
});

function createRoom() {
  sessionStorage.nickname = $("#nickname").val();
  if (sessionStorage.roomID) return false;
  const data = { client: sessionStorage.peerID, nickname: sessionStorage.nickname };
  $.ajax({
    url: "/room/create",
    data: data,
    method: "POST",
    headers: { "X-CSRF-Token": getCsrfToken() },
    success: function (result) {
      sessionStorage.roomID = result.room;
      window.location.replace("./room/");
    },
    error: showError,
  });
}

function joinRoom() {
  sessionStorage.nickname = $("#nickname").val();
  if (sessionStorage.roomID) return false;
  const data = {
    room: $("#joinRoomID").val(),
    client: sessionStorage.peerID,
    nickname: sessionStorage.nickname,
  };
  $.ajax({
    url: "/room/join",
    data: data,
    method: "POST",
    headers: { "X-CSRF-Token": getCsrfToken() },
    success: function (result) {
      sessionStorage.roomID = $("#joinRoomID").val();
      sessionStorage.tempClientStore = JSON.stringify(result.clients);
      window.location.replace("./room/");
    },
    error: showError,
  });
}
