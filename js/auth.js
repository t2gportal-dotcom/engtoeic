/* BT TOEIC — Standalone Auth Module (Zero course assets or data dependencies) */
window.BT_TOEIC_AUTH = (function () {
  "use strict";

  const AUTH_KEY = "bt_toeic_auth_session_v1";

  /* Salted SHA-256 account hashes (format: sha256("bt-toeic::<user>::<pass>")) */
  const ACCOUNTS = {
    baotran: {
      displayName: "baotran",
      role: "Quản trị • Toàn quyền",
      hash: "4778cfbda51019d6ab45f2b0251edfbfca1a0d94ad32217479227a8a47268e38"
    },
    guest: {
      displayName: "guest",
      role: "Học viên khách",
      hash: "4e84a7ef553c8bb077fe97cf4197229fd6f3825b9618159bdc87cb6d95ab1d63"
    }
  };

  /* Pure-JS synchronous SHA-256 (works identically on file://, http://, and https://) */
  function sha256(ascii) {
    function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
    }
    const maxWord = Math.pow(2, 32);
    const words = [];
    const asciiBitLength = ascii.length * 8;
    let hash = (sha256.h = sha256.h || []);
    const k = (sha256.k = sha256.k || []);
    let primeCounter = k.length;

    const isComposite = {};
    for (let candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (let i = 0; i < 313; i += candidate) isComposite[i] = candidate;
        hash[primeCounter] = (Math.pow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (Math.pow(candidate, 1 / 3) * maxWord) | 0;
      }
    }

    let str = ascii + "\x80";
    while ((str.length % 64) - 56) str += "\x00";
    for (let i = 0; i < str.length; i++) {
      const j = str.charCodeAt(i);
      words[i >> 2] |= j << (((3 - i) % 4) * 8);
    }
    words[words.length] = (asciiBitLength / maxWord) | 0;
    words[words.length] = asciiBitLength;

    let h = hash.slice(0, 8);
    for (let j = 0; j < words.length; ) {
      const w = words.slice(j, (j += 16));
      const oldHash = h.slice(0);
      for (let i = 0; i < 64; i++) {
        const w15 = w[i - 15], w2 = w[i - 2];
        const a = h[0], e = h[4];
        const temp1 =
          h[7] +
          (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
          ((e & h[5]) ^ (~e & h[6])) +
          k[i] +
          (w[i] =
            i < 16
              ? w[i]
              : (w[i - 16] +
                  (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                  w[i - 7] +
                  (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
                0);
        const temp2 =
          (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
          ((a & h[1]) ^ (a & h[2]) ^ (h[1] & h[2]));
        h = [(temp1 + temp2) | 0].concat(h);
        h[4] = (h[4] + temp1) | 0;
        h.pop();
      }
      for (let i = 0; i < 8; i++) h[i] = (h[i] + oldHash[i]) | 0;
    }

    let result = "";
    for (let i = 0; i < 8; i++) {
      for (let j = 3; j + 1; j--) {
        const b = (h[i] >> (j * 8)) & 255;
        result += (b < 16 ? "0" : "") + b.toString(16);
      }
    }
    return result;
  }

  function getSession() {
    try {
      const raw = sessionStorage.getItem(AUTH_KEY) || localStorage.getItem(AUTH_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.username && ACCOUNTS[parsed.username] && parsed.sig === ACCOUNTS[parsed.username].hash) {
        return parsed;
      }
    } catch (_) {
      /* ignore */
    }
    return null;
  }

  function login(username, password, remember) {
    const userKey = String(username || "").trim().toLowerCase();
    const acc = ACCOUNTS[userKey];
    if (!acc) return { ok: false, error: "Tên đăng nhập hoặc mật khẩu không đúng." };

    const digest = sha256(`bt-toeic::${userKey}::${String(password || "").trim()}`);
    if (digest !== acc.hash) {
      return { ok: false, error: "Tên đăng nhập hoặc mật khẩu không đúng." };
    }

    const session = {
      username: userKey,
      displayName: acc.displayName,
      role: acc.role,
      sig: acc.hash,
      loggedInAt: Date.now()
    };

    try {
      const serialized = JSON.stringify(session);
      sessionStorage.setItem(AUTH_KEY, serialized);
      if (remember) localStorage.setItem(AUTH_KEY, serialized);
      else localStorage.removeItem(AUTH_KEY);
    } catch (_) {
      /* ignore */
    }
    return { ok: true, session };
  }

  function logout() {
    try {
      sessionStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(AUTH_KEY);
      sessionStorage.removeItem("bt_toeic_video_unlocked_v1");
    } catch (_) {
      /* ignore */
    }
    window.location.replace("login.html");
  }

  function requireAuth() {
    if (getSession()) return true;
    const currentFile = (window.location.pathname.split("/").pop() || "index.html") + window.location.search;
    const nextParam = currentFile && !currentFile.startsWith("login.html") ? `?next=${encodeURIComponent(currentFile)}` : "";
    window.location.replace(`login.html${nextParam}`);
    return false;
  }

  return {
    getSession,
    login,
    logout,
    requireAuth
  };
})();
