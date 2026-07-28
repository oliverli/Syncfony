var pitch = 4,
  duration = 2,
  instrument = "piano",
  osk = "drum";

document.onkeypress = function (event) {
  var x = event.which || event.keyCode;
  simKey(x);
  if (x == 106) x = 100;
  console.log(x);
  var d = $("#" + x);
  if (d.hasClass("key")) {
    if (d.hasClass("black")) {
      d.css("background", "#222");
    } else {
      d.css("background", "#eee");
    }
    d.css({
      transform: "translateY(2px)",
      "box-shadow": "0 0 2px rgba(0,0,0,0.2)",
    });
    setTimeout(function () {
      d.css({
        background: "",
        transform: "",
        "box-shadow": "",
      });
    }, 200);
  } else if (d.hasClass("drum")) {
    d.css({
      background: "#eee",
      transform: "translateY(2px)",
      "box-shadow": "0 0 2px rgba(0,0,0,0.2)",
    });
    setTimeout(function () {
      d.css({
        background: "",
        transform: "",
        "box-shadow": "",
      });
    }, 200);
  }
};

function simKey(x) {
  x = +x;
  switch (x) {
    case 113:
      play("C", pitch);
      break;
    case 50:
      play("C#", pitch);
      break;
    case 119:
      play("D", pitch);
      break;
    case 51:
      play("D#", pitch);
      break;
    case 101:
      play("E", pitch);
      break;
    case 114:
      play("F", pitch);
      break;
    case 53:
      play("F#", pitch);
      break;
    case 116:
      play("G", pitch);
      break;
    case 54:
      play("G#", pitch);
      break;
    case 121:
      play("A", pitch);
      break;
    case 55:
      play("A#", pitch);
      break;
    case 117:
      play("B", pitch);
      break;
    case 105:
      play("C", pitch + 1);
      break;
    case 57:
      play("C#", pitch + 1);
      break;
    case 111:
      play("D", pitch + 1);
      break;
    case 48:
      play("D#", pitch + 1);
      break;
    case 112:
      play("E", pitch + 1);
      break;
    case 91:
      pitchy(0);
      break;
    case 93:
      pitchy(1);
      break;
    case 122:
      switchInstrument({ id: "piano" });
      break;
    case 120:
      switchInstrument({ id: "organ" });
      break;
    case 99:
      switchInstrument({ id: "acoustic" });
      break;
    case 118:
      switchInstrument({ id: "edm" });
      break;
    case 97:
      drum("tom");
      break;
    case 115:
      drum("bass");
      break;
    case 100:
      drum("snare");
      break;
    case 106:
      drum("snare");
      break;
    case 107:
      drum("hihat");
      break;
    case 108:
      drum("cymbals");
      break;
  }
}

function play(n, p) {
  var dataPrep = {
    instrument: instrument,
    n: n,
    p: p,
    nickname: sessionStorage.nickname,
    isDC: false,
  };
  peers.forEach(function (conn) {
    conn.connection.send(dataPrep);
  });
  playLocal(n, p, instrument);
}

function playLocal(n, p, inst2) {
  var inst = Synth.createInstrument(inst2);
  inst.play(n, p, duration);
}

function switchInstrument(x) {
  $(".selected").removeClass("selected");
  instrument = x.id;
  $("#" + x.id).addClass("selected");
}

function pitchy(x) {
  if (x && pitch < 8) {
    pitch++;
  } else if (!x && pitch > 2) {
    pitch--;
  }
  document.getElementById("pitch").textContent = pitch;
}

function openInstrument(x) {
  if (x != osk) {
    document.getElementById(osk).style.transform = "translateY(50em)";
    document.getElementById(x).style.transform = "";
    osk = x;
  }
}

function drum(x) {
  var dataPrep = { instrument: "drum", x: x, nickname: sessionStorage.nickname, isDC: false };
  peers.forEach(function (conn) {
    conn.connection.send(dataPrep);
  });
  drumLocal(x);
}

function drumLocal(x) {
  var d = document.getElementById("a" + x);
  d.currentTime = 0;
  d.play();
}

window.onload = function () {
  openInstrument("keyboard");
};
