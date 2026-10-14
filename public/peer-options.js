// Options for new Peer(): the API key, plus the PeerServer location when the
// server sets PEERJS_SERVER (otherwise PeerJS uses its cloud server).
window.peerOptions = function () {
  const options = { key: $("meta[name='peerjs-key']").attr("content") };
  const server = $("meta[name='peerjs-server']").attr("content");
  if (server) {
    const url = new URL(server);
    options.secure = url.protocol === "https:";
    options.host = url.hostname;
    options.port = url.port || (options.secure ? 443 : 80);
    options.path = url.pathname;
  }
  return options;
};
