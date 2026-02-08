const crypto = require('crypto');

function apr1md5(password, salt) {
  if (!salt) {
    const chars = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    salt = '';
    for (let i = 0; i < 8; i++) salt += chars[Math.floor(Math.random() * chars.length)];
  }

  let ctx = crypto.createHash('md5');
  ctx.update(password);
  ctx.update('$apr1$');
  ctx.update(salt);

  let ctx1 = crypto.createHash('md5');
  ctx1.update(password);
  ctx1.update(salt);
  ctx1.update(password);
  let fin = ctx1.digest();

  for (let pl = password.length; pl > 0; pl -= 16) {
    ctx.update(fin.subarray(0, Math.min(pl, 16)));
  }

  for (let i = password.length; i; i >>= 1) {
    if (i & 1) ctx.update(Buffer.from([0]));
    else ctx.update(Buffer.from(password[0]));
  }

  fin = ctx.digest();

  for (let i = 0; i < 1000; i++) {
    let c = crypto.createHash('md5');
    if (i & 1) c.update(password); else c.update(fin);
    if (i % 3) c.update(salt);
    if (i % 7) c.update(password);
    if (i & 1) c.update(fin); else c.update(password);
    fin = c.digest();
  }

  const itoa64 = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  function to64(v, n) {
    let s = '';
    while (--n >= 0) { s += itoa64[v & 0x3f]; v >>= 6; }
    return s;
  }

  let out = '';
  out += to64((fin[0] << 16) | (fin[6] << 8) | fin[12], 4);
  out += to64((fin[1] << 16) | (fin[7] << 8) | fin[13], 4);
  out += to64((fin[2] << 16) | (fin[8] << 8) | fin[14], 4);
  out += to64((fin[3] << 16) | (fin[9] << 8) | fin[15], 4);
  out += to64((fin[4] << 16) | (fin[10] << 8) | fin[5], 4);
  out += to64(fin[11], 2);

  return '$apr1$' + salt + '$' + out;
}

const user = 'admin';
const pass = 'CpvfAdmin2026!';
const hash = apr1md5(pass);
console.log(user + ':' + hash);
