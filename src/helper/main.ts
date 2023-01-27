export function parseDBError(e: any) {
  const index = e?.message?.indexOf(':');
  let message = e?.message;
  if (index >= 0) {
    message = e.message.substr(index + 1);
  }
  return message;
}

export function calculateExchangeRate(from, to, amount) {
  const er = 1 / to?.toBase / (1 / from?.toBase);
  return amount * er;
}

export function clearNullField(obj: { [index: string]: any }) {
  const keys = Object.keys(obj);
  const result = {};
  if (keys.length >= 1) {
    keys.forEach((item) => {
      if (obj[item]) {
        result[item] = obj[item];
      }
    });
    return result;
  }
  return obj;
}
