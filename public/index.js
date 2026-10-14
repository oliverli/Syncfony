window.getCsrfToken = function () {
  return $("meta[name='csrf-token']").attr("content");
};

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
  const peerKey = $("meta[name='peerjs-key']").attr("content");
  let peer;
  if (sessionStorage.peerID) {
    peer = new Peer(sessionStorage.peerID, { key: peerKey });
  } else {
    peer = new Peer({ key: peerKey });
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
  });
}
