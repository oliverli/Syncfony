var peers = [],
  peer;
var retardedUserCount = 1;

function dataReceiver(data) {
  if (!data.isDC) {
    if (data.instrument !== "drum") {
      playLocal(data.n, data.p, data.instrument);
      console.log("received remote note: " + data.n + " from " + data.nickname);
    } else {
      drumLocal(data.x);
      console.log("drum drum drum with x = " + data.x + " from " + data.nickname);
    }
    lightUp(data.nickname, data.instrument);
  } else {
    removeUser(data.nickname);
  }
}

function ghettoQuitHandler() {
  peers.forEach(function (item) {
    if (!item.connection.open && !item.connection.isClosed) {
      removeUser(item.nickname);
      item.connection.isClosed = true;
      console.log(item.nickname + " checked and is dead and has been removed.");
      retardedUserCount--;
    } else if (item.connection.open && item.connection.isClosed) {
      addUser(item.nickname);
      item.connection.isClosed = false;
      console.log(
        item.nickname + " is actually alive and has been revived. welcome to the afterlife.",
      );
      retardedUserCount++;
    } else if (!item.connection.isClosed) console.log(item.nickname + " checked and is alive.");
  });
  $("#userCount").html(retardedUserCount.toString());
}

$(document).ready(function () {
  var peerKey = $("meta[name='peerjs-key']").attr("content");

  if (sessionStorage.peerID) {
    peer = new Peer(sessionStorage.peerID, { key: peerKey });
  } else {
    window.location.replace("/");
  }
  if (!sessionStorage.roomID) {
    window.location.replace("/");
  }

  peer.on("open", function (id) {
    sessionStorage.peerID = id;
    console.log("My peer ID is: " + id);
    console.log("My nickname is: " + sessionStorage.nickname);
    $("#yourNickname").val(sessionStorage.nickname);
    if (sessionStorage.tempClientStore) {
      var result = JSON.parse(JSON.parse(sessionStorage.tempClientStore));
      for (var index = 0; index < result.length; index++) {
        if (result[index].id !== sessionStorage.peerID) {
          peers.push(new clientPeer(result[index].id, result[index].nickname));
          console.log("Connected to user: " + result[index].nickname);
        }
      }
      retardedUserCount = peers.length + 1;
      $("#roomIDfield").val(sessionStorage.roomID.toString());
      $("#userCount").html(retardedUserCount.toString());
    } else {
      $("#roomIDfield").val(sessionStorage.roomID.toString());
      retardedUserCount = 1;
      $("#userCount").html(retardedUserCount.toString());
    }
  });

  peer.on("connection", function (conn) {
    peers.push(new clientPeer2(conn));
    console.log("Connected to user: " + conn.label);
    retardedUserCount++;

    $("#userCount").html(retardedUserCount.toString());
  });
  setInterval(ghettoQuitHandler, 2500);
});

function clientPeer(peerID, nickname) {
  this.nickname = nickname;
  this.peerID = peerID;
  this.connection = peer.connect(peerID, { label: sessionStorage.nickname });
  addUser(nickname);
  this.connection.on("data", dataReceiver);
  this.connection.on("close", ghettoQuitHandler);
  this.isClosed = false;
}

function clientPeer2(connection) {
  this.nickname = connection.label;
  this.peerID = connection.peer;
  this.connection = connection;
  addUser(this.nickname);
  this.connection.on("data", dataReceiver);
  this.connection.on("close", ghettoQuitHandler);
  this.isClosed = false;
}

function getCsrfToken() {
  return $("meta[name='csrf-token']").attr("content");
}

// eslint-disable-next-line no-unused-vars
function exitHandler() {
  sessionStorage.exited = true;
  var data = { room: sessionStorage.roomID, client: sessionStorage.peerID };
  $.ajax({
    url: "/room/delete",
    data: data,
    method: "POST",
    headers: { "X-CSRF-Token": getCsrfToken() },
  });
  peers.forEach(function (conn) {
    conn.connection.close();
  });
  sessionStorage.removeItem("roomID");
  sessionStorage.removeItem("peerID");
  sessionStorage.removeItem("tempClientStore");
  sessionStorage.removeItem("nickname");
  peer.destroy();
}

function addUser(name) {
  var n = document.createElement("div");
  n.classList.add("user");
  n.classList.add("card");
  n.id = name;
  n.innerHTML = "<h2>" + name + "</h2><div class='indicator'></div>";
  document.getElementById("usercontainer").appendChild(n);
}

function removeUser(name) {
  var el = document.getElementById(name);
  if (el) el.remove();
}

function lightUp(name, instrument) {
  var color;
  if (instrument == "piano") color = "#4CAF50";
  else if (instrument == "organ") color = "#2196F3";
  else if (instrument == "acoustic") color = "#F44336";
  else if (instrument == "edm") color = "#9C27B0";
  else color = "#009688";
  var el = document.getElementById(name);
  if (!el) return;
  el.children[1].style.background = color;
  setTimeout(function () {
    el.children[1].style.background = "";
  }, 500);
}
