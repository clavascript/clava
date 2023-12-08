import * as core from './core.js';

function _intersection2(x, y) {
  if (x.size > y.size) {
    const tmp = y;
    y = x;
    x = tmp;
  }
  const res = new Set();
  for (const elem of x) {
    if (y.has(elem)) {
      res.add(elem);
    }
  }
  return res;
}

export function intersection(...xs) {
  switch (xs.length) {
    case 0: return null;
    case 1: return xs[0];
    case 2: return _intersection2(xs[0], xs[1]);
    default: return xs.reduce(_intersection2);
  }
}

function _difference2(x, y) {
  const res = new Set();
  for (const elem of x) {
    if (!y.has(elem)) {
      res.add(elem);
    }
  }
  return res;
}

export function difference(...xs) {
  switch (xs.length) {
    case 0: return null;
    case 1: return xs[0];
    case 2: return _difference2(xs[0], xs[1]);
    default: return xs.reduce(_difference2);
  }
}

function _union2(x, y) {
  const res = new Set(x);
  for (const elem of y) {
    res.add(elem);
  }
  return res;
}

export function union(...xs) {
  switch (xs.length) {
    case 0: return null;
    case 1: return xs[0];
    case 2: return _union2(xs[0], xs[1]);
    default: return xs.reduce(_union2);
  }
}

function _subset_QMARK_2(x, y) {
  for (const elem of x) {
    if (!y.has(elem)) {
      return false;
    }
  }
  return true;
} 

export function subset_QMARK_(x, y) {
  if (x === undefined) {
    return true;
  }
  if (y === undefined) {
    return false;
  }
  if (x.size > y.size) {
    return false;
  }
  return _subset_QMARK_2(x, y);
}

function _superset_QMARK_2(x, y) {
  for (const elem of x) {
    if (!y.has(elem)) {
      return false;
    }
  }
  return true;
}

export function superset_QMARK_(x, y) {
  if (x === undefined) {
    return true;
  }
  if (y === undefined) {
    return true;
  }
  if (x.size < y.size) {
    return false;
  }
  return _superset_QMARK_2(y, x);
}

export function select(pred, xset) {
  if (xset === undefined) {
    return null;
  }
  const res = new Set();
  for (const elem of xset) {
    if (pred(elem)) {
      res.add(elem);
    }
  }
  return res;
}

export function rename_keys(map, kmap) {
  const ks = core.keys(kmap);
  return ks.reduce((m, k) => {
    const newKey = core.get(kmap, k);
    if (core.contains_QMARK_(map, k)) {
      return core.assoc(m, newKey, core.get(map, k));
    }
    return m;
  }, core.dissoc(map, ...ks));
}

export function rename(xrel, kmap) {
  return core.set(core.map(x => rename_keys(x, kmap), xrel));
}

export function project(xrel, ...ks) {
  return core.set(core.map(x => core.select_keys(x, ...ks), xrel));
}

export function map_invert(xmap) {
  if (xmap === undefined) {
    return {};
  }
  return core.reduce_kv((m, k, v) => core.assoc_BANG_(m, v, k), core.empty(xmap), xmap);
}