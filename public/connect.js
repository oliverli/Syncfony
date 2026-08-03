let peer;
peers = [];
let userCount = 1;

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
      userCount--;
    } else if (item.connection.open && item.connection.isClosed) {
      addUser(item.nickname);
      item.connection.isClosed = false;
      console.log(
        item.nickname + " is actually alive and has been revived. welcome to the afterlife.",
      );
      userCount++;
    } else if (!item.connection.isClosed) console.log(item.nickname + " checked and is alive.");
  });
  $("#userCount").html(userCount.toString());
}

$(document).ready(function () {
  const peerKey = $("meta[name='peerjs-key']").attr("content");

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
      const result = JSON.parse(sessionStorage.tempClientStore);
      for (let index = 0; index < result.length; index++) {
        if (result[index].id !== sessionStorage.peerID) {
          peers.push(new clientPeer(result[index].id, result[index].nickname));
          console.log("Connected to user: " + result[index].nickname);
        }
      }
      userCount = peers.length + 1;
      $("#roomIDfield").val(sessionStorage.roomID.toString());
      $("#userCount").html(userCount.toString());
    } else {
      $("#roomIDfield").val(sessionStorage.roomID.toString());
      userCount = 1;
      $("#userCount").html(userCount.toString());
    }
  });

  peer.on("connection", function (conn) {
    peers.push(new clientPeer2(conn));
    console.log("Connected to user: " + conn.label);
    userCount++;

    $("#userCount").html(userCount.toString());
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

window.getCsrfToken = function () {
  return $("meta[name='csrf-token']").attr("content");
};

window.exitHandler = function () {
  sessionStorage.exited = true;
  const data = { room: sessionStorage.roomID, client: sessionStorage.peerID };
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
};

const userElements = {};
let userCounter = 0;

window.addUser = function (name) {
  const el = document.createElement("div");
  el.classList.add("user");
  el.classList.add("card");
  el.id = "user-" + userCounter++;
  const heading = document.createElement("h2");
  heading.textContent = name;
  const indicator = document.createElement("div");
  indicator.classList.add("indicator");
  el.appendChild(heading);
  el.appendChild(indicator);
  document.getElementById("usercontainer").appendChild(el);
  userElements[name] = el;
};

function removeUser(name) {
  const el = userElements[name];
  if (!el) return;
  delete userElements[name];
  if (el.parentNode) el.parentNode.removeChild(el);
}

function lightUp(name, instrument) {
  let color;
  if (instrument === "piano") color = "#4CAF50";
  else if (instrument === "organ") color = "#2196F3";
  else if (instrument === "acoustic") color = "#F44336";
  else if (instrument === "edm") color = "#9C27B0";
  else color = "#009688";
  const el = userElements[name];
  if (!el) return;
  el.children[1].style.background = color;
  setTimeout(function () {
    el.children[1].style.background = "";
  }, 500);
}
