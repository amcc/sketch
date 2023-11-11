const M1 = 0.5 * (Math.sqrt(3) - 1),
  r1 = (3 - Math.sqrt(3)) / 6,
  D1 = 1 / 3,
  Z = 1 / 6,
  q1 = (Math.sqrt(5) - 1) / 4,
  m = (5 - Math.sqrt(5)) / 20,
  W = (P) => Math.floor(P) | 0,
  h1 = new Float64Array([
    1, 1, -1, 1, 1, -1, -1, -1, 1, 0, -1, 0, 1, 0, -1, 0, 0, 1, 0, -1, 0, 1, 0,
    -1,
  ]),
  z1 = new Float64Array([
    1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0,
    -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1,
  ]),
  l1 = new Float64Array([
    0, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0, -1, 1, 1, 0, -1, 1,
    -1, 0, -1, -1, 1, 0, -1, -1, -1, 1, 0, 1, 1, 1, 0, 1, -1, 1, 0, -1, 1, 1, 0,
    -1, -1, -1, 0, 1, 1, -1, 0, 1, -1, -1, 0, -1, 1, -1, 0, -1, -1, 1, 1, 0, 1,
    1, 1, 0, -1, 1, -1, 0, 1, 1, -1, 0, -1, -1, 1, 0, 1, -1, 1, 0, -1, -1, -1,
    0, 1, -1, -1, 0, -1, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0, -1,
    1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 0,
  ]);
function b1(P = Math.random) {
  const t = i1(P),
    l = new Float64Array(t).map((a) => h1[(a % 12) * 2]),
    n = new Float64Array(t).map((a) => h1[(a % 12) * 2 + 1]);
  return function (f, p) {
    let z = 0,
      h = 0,
      M = 0;
    const D = (f + p) * M1,
      A = W(f + D),
      G = W(p + D),
      q = (A + G) * r1,
      S = A - q,
      T = G - q,
      d = f - S,
      F = p - T;
    let b, N;
    d > F ? ((b = 1), (N = 0)) : ((b = 0), (N = 1));
    const U = d - b + r1,
      y = F - N + r1,
      x = d - 1 + 2 * r1,
      g = F - 1 + 2 * r1,
      j = A & 255,
      k = G & 255;
    let s = 0.5 - d * d - F * F;
    if (s >= 0) {
      const o = j + t[k],
        u = l[o],
        w = n[o];
      (s *= s), (z = s * s * (u * d + w * F));
    }
    let c = 0.5 - U * U - y * y;
    if (c >= 0) {
      const o = j + b + t[k + N],
        u = l[o],
        w = n[o];
      (c *= c), (h = c * c * (u * U + w * y));
    }
    let e = 0.5 - x * x - g * g;
    if (e >= 0) {
      const o = j + 1 + t[k + 1],
        u = l[o],
        w = n[o];
      (e *= e), (M = e * e * (u * x + w * g));
    }
    return 70 * (z + h + M);
  };
}
function N1(P = Math.random) {
  const t = i1(P),
    l = new Float64Array(t).map((f) => z1[(f % 12) * 3]),
    n = new Float64Array(t).map((f) => z1[(f % 12) * 3 + 1]),
    a = new Float64Array(t).map((f) => z1[(f % 12) * 3 + 2]);
  return function (p, z, h) {
    let M, D, A, G;
    const q = (p + z + h) * D1,
      S = W(p + q),
      T = W(z + q),
      d = W(h + q),
      F = (S + T + d) * Z,
      b = S - F,
      N = T - F,
      U = d - F,
      y = p - b,
      x = z - N,
      g = h - U;
    let j, k, s, c, e, o;
    y >= x
      ? x >= g
        ? ((j = 1), (k = 0), (s = 0), (c = 1), (e = 1), (o = 0))
        : y >= g
        ? ((j = 1), (k = 0), (s = 0), (c = 1), (e = 0), (o = 1))
        : ((j = 0), (k = 0), (s = 1), (c = 1), (e = 0), (o = 1))
      : x < g
      ? ((j = 0), (k = 0), (s = 1), (c = 0), (e = 1), (o = 1))
      : y < g
      ? ((j = 0), (k = 1), (s = 0), (c = 0), (e = 1), (o = 1))
      : ((j = 0), (k = 1), (s = 0), (c = 1), (e = 1), (o = 0));
    const u = y - j + Z,
      w = x - k + Z,
      X = g - s + Z,
      Y = y - c + 2 * Z,
      K = x - e + 2 * Z,
      L = g - o + 2 * Z,
      O = y - 1 + 3 * Z,
      Q = x - 1 + 3 * Z,
      R = g - 1 + 3 * Z,
      H = S & 255,
      I = T & 255,
      J = d & 255;
    let v = 0.6 - y * y - x * x - g * g;
    if (v < 0) M = 0;
    else {
      const i = H + t[I + t[J]];
      (v *= v), (M = v * v * (l[i] * y + n[i] * x + a[i] * g));
    }
    let B = 0.6 - u * u - w * w - X * X;
    if (B < 0) D = 0;
    else {
      const i = H + j + t[I + k + t[J + s]];
      (B *= B), (D = B * B * (l[i] * u + n[i] * w + a[i] * X));
    }
    let C = 0.6 - Y * Y - K * K - L * L;
    if (C < 0) A = 0;
    else {
      const i = H + c + t[I + e + t[J + o]];
      (C *= C), (A = C * C * (l[i] * Y + n[i] * K + a[i] * L));
    }
    let E = 0.6 - O * O - Q * Q - R * R;
    if (E < 0) G = 0;
    else {
      const i = H + 1 + t[I + 1 + t[J + 1]];
      (E *= E), (G = E * E * (l[i] * O + n[i] * Q + a[i] * R));
    }
    return 32 * (M + D + A + G);
  };
}
function X1(P = Math.random) {
  const t = i1(P),
    l = new Float64Array(t).map((p) => l1[(p % 32) * 4]),
    n = new Float64Array(t).map((p) => l1[(p % 32) * 4 + 1]),
    a = new Float64Array(t).map((p) => l1[(p % 32) * 4 + 2]),
    f = new Float64Array(t).map((p) => l1[(p % 32) * 4 + 3]);
  return function (z, h, M, D) {
    let A, G, q, S, T;
    const d = (z + h + M + D) * q1,
      F = W(z + d),
      b = W(h + d),
      N = W(M + d),
      U = W(D + d),
      y = (F + b + N + U) * m,
      x = F - y,
      g = b - y,
      j = N - y,
      k = U - y,
      s = z - x,
      c = h - g,
      e = M - j,
      o = D - k;
    let u = 0,
      w = 0,
      X = 0,
      Y = 0;
    s > c ? u++ : w++,
      s > e ? u++ : X++,
      s > o ? u++ : Y++,
      c > e ? w++ : X++,
      c > o ? w++ : Y++,
      e > o ? X++ : Y++;
    const K = u >= 3 ? 1 : 0,
      L = w >= 3 ? 1 : 0,
      O = X >= 3 ? 1 : 0,
      Q = Y >= 3 ? 1 : 0,
      R = u >= 2 ? 1 : 0,
      H = w >= 2 ? 1 : 0,
      I = X >= 2 ? 1 : 0,
      J = Y >= 2 ? 1 : 0,
      v = u >= 1 ? 1 : 0,
      B = w >= 1 ? 1 : 0,
      C = X >= 1 ? 1 : 0,
      E = Y >= 1 ? 1 : 0,
      i = s - K + m,
      a1 = c - L + m,
      f1 = e - O + m,
      y1 = o - Q + m,
      m1 = s - R + 2 * m,
      p1 = c - H + 2 * m,
      g1 = e - I + 2 * m,
      u1 = o - J + 2 * m,
      w1 = s - v + 3 * m,
      d1 = c - B + 3 * m,
      x1 = e - C + 3 * m,
      F1 = o - E + 3 * m,
      j1 = s - 1 + 4 * m,
      k1 = c - 1 + 4 * m,
      A1 = e - 1 + 4 * m,
      G1 = o - 1 + 4 * m,
      V = F & 255,
      _ = b & 255,
      $ = N & 255,
      t1 = U & 255;
    let n1 = 0.6 - s * s - c * c - e * e - o * o;
    if (n1 < 0) A = 0;
    else {
      const r = V + t[_ + t[$ + t[t1]]];
      (n1 *= n1), (A = n1 * n1 * (l[r] * s + n[r] * c + a[r] * e + f[r] * o));
    }
    let o1 = 0.6 - i * i - a1 * a1 - f1 * f1 - y1 * y1;
    if (o1 < 0) G = 0;
    else {
      const r = V + K + t[_ + L + t[$ + O + t[t1 + Q]]];
      (o1 *= o1),
        (G = o1 * o1 * (l[r] * i + n[r] * a1 + a[r] * f1 + f[r] * y1));
    }
    let s1 = 0.6 - m1 * m1 - p1 * p1 - g1 * g1 - u1 * u1;
    if (s1 < 0) q = 0;
    else {
      const r = V + R + t[_ + H + t[$ + I + t[t1 + J]]];
      (s1 *= s1),
        (q = s1 * s1 * (l[r] * m1 + n[r] * p1 + a[r] * g1 + f[r] * u1));
    }
    let c1 = 0.6 - w1 * w1 - d1 * d1 - x1 * x1 - F1 * F1;
    if (c1 < 0) S = 0;
    else {
      const r = V + v + t[_ + B + t[$ + C + t[t1 + E]]];
      (c1 *= c1),
        (S = c1 * c1 * (l[r] * w1 + n[r] * d1 + a[r] * x1 + f[r] * F1));
    }
    let e1 = 0.6 - j1 * j1 - k1 * k1 - A1 * A1 - G1 * G1;
    if (e1 < 0) T = 0;
    else {
      const r = V + 1 + t[_ + 1 + t[$ + 1 + t[t1 + 1]]];
      (e1 *= e1),
        (T = e1 * e1 * (l[r] * j1 + n[r] * k1 + a[r] * A1 + f[r] * G1));
    }
    return 27 * (A + G + q + S + T);
  };
}
function i1(P) {
  const t = 512,
    l = new Uint8Array(t);
  for (let n = 0; n < t / 2; n++) l[n] = n;
  for (let n = 0; n < t / 2 - 1; n++) {
    const a = n + ~~(P() * (256 - n)),
      f = l[n];
    (l[n] = l[a]), (l[a] = f);
  }
  for (let n = 256; n < t; n++) l[n] = l[n - 256];
  return l;
}
export {
  i1 as buildPermutationTable,
  b1 as createNoise2D,
  N1 as createNoise3D,
  X1 as createNoise4D,
};
export default null;
