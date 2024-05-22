// fable_modules/fable-library-js.4.17.0/Numeric.js
var symbol = Symbol("numeric");
function isNumeric(x) {
  return typeof x === "number" || typeof x === "bigint" || x?.[symbol];
}
function compare(x, y) {
  if (typeof x === "number") {
    return x < y ? -1 : x > y ? 1 : 0;
  } else if (typeof x === "bigint") {
    return x < y ? -1 : x > y ? 1 : 0;
  } else {
    return x.CompareTo(y);
  }
}
function multiply(x, y) {
  if (typeof x === "number") {
    return x * y;
  } else if (typeof x === "bigint") {
    return x * BigInt(y);
  } else {
    return x[symbol]().multiply(y);
  }
}
function toFixed(x, dp) {
  if (typeof x === "number") {
    return x.toFixed(dp);
  } else if (typeof x === "bigint") {
    return x;
  } else {
    return x[symbol]().toFixed(dp);
  }
}
function toPrecision(x, sd) {
  if (typeof x === "number") {
    return x.toPrecision(sd);
  } else if (typeof x === "bigint") {
    return x;
  } else {
    return x[symbol]().toPrecision(sd);
  }
}
function toExponential(x, dp) {
  if (typeof x === "number") {
    return x.toExponential(dp);
  } else if (typeof x === "bigint") {
    return x;
  } else {
    return x[symbol]().toExponential(dp);
  }
}
function toHex(x) {
  if (typeof x === "number") {
    return (Number(x) >>> 0).toString(16);
  } else if (typeof x === "bigint") {
    return BigInt.asUintN(64, x).toString(16);
  } else {
    return x[symbol]().toHex();
  }
}

// fable_modules/fable-library-js.4.17.0/Util.js
function isArrayLike(x) {
  return Array.isArray(x) || ArrayBuffer.isView(x);
}
function isEnumerable(x) {
  return x != null && typeof x.GetEnumerator === "function";
}
function isComparable(x) {
  return x != null && typeof x.CompareTo === "function";
}
function isEquatable(x) {
  return x != null && typeof x.Equals === "function";
}
function isHashable(x) {
  return x != null && typeof x.GetHashCode === "function";
}
function isDisposable(x) {
  return x != null && typeof x.Dispose === "function";
}
function disposeSafe(x) {
  if (isDisposable(x)) {
    x.Dispose();
  }
}
function defaultOf() {
  return null;
}
function sameConstructor(x, y) {
  return Object.getPrototypeOf(x)?.constructor === Object.getPrototypeOf(y)?.constructor;
}
var Enumerator = class {
  constructor(iter) {
    this.iter = iter;
    this.current = defaultOf();
  }
  ["System.Collections.Generic.IEnumerator`1.get_Current"]() {
    return this.current;
  }
  ["System.Collections.IEnumerator.get_Current"]() {
    return this.current;
  }
  ["System.Collections.IEnumerator.MoveNext"]() {
    const cur = this.iter.next();
    this.current = cur.value;
    return !cur.done;
  }
  ["System.Collections.IEnumerator.Reset"]() {
    throw new Error("JS iterators cannot be reset");
  }
  Dispose() {
    return;
  }
};
function getEnumerator(e) {
  if (isEnumerable(e)) {
    return e.GetEnumerator();
  } else {
    return new Enumerator(e[Symbol.iterator]());
  }
}
function toIterator(en) {
  return {
    next() {
      const hasNext = en["System.Collections.IEnumerator.MoveNext"]();
      const current = hasNext ? en["System.Collections.Generic.IEnumerator`1.get_Current"]() : void 0;
      return { done: !hasNext, value: current };
    }
  };
}
function padWithZeros(i, length2) {
  return i.toString(10).padStart(length2, "0");
}
function dateOffset(date) {
  const date1 = date;
  return typeof date1.offset === "number" ? date1.offset : date.kind === 1 ? 0 : date.getTimezoneOffset() * -6e4;
}
var ObjectRef = class _ObjectRef {
  static id(o) {
    if (!_ObjectRef.idMap.has(o)) {
      _ObjectRef.idMap.set(o, ++_ObjectRef.count);
    }
    return _ObjectRef.idMap.get(o);
  }
};
ObjectRef.idMap = /* @__PURE__ */ new WeakMap();
ObjectRef.count = 0;
function stringHash(s) {
  let i = 0;
  let h = 5381;
  const len = s.length;
  while (i < len) {
    h = h * 33 ^ s.charCodeAt(i++);
  }
  return h;
}
function numberHash(x) {
  return x * 2654435761 | 0;
}
function bigintHash(x) {
  return stringHash(x.toString(32));
}
function combineHashCodes(hashes) {
  let h1 = 0;
  const len = hashes.length;
  for (let i = 0; i < len; i++) {
    const h2 = hashes[i];
    h1 = (h1 << 5) + h1 ^ h2;
  }
  return h1;
}
function dateHash(x) {
  return x.getTime();
}
function arrayHash(x) {
  const len = x.length;
  const hashes = new Array(len);
  for (let i = 0; i < len; i++) {
    hashes[i] = structuralHash(x[i]);
  }
  return combineHashCodes(hashes);
}
function structuralHash(x) {
  if (x == null) {
    return 0;
  }
  switch (typeof x) {
    case "boolean":
      return x ? 1 : 0;
    case "number":
      return numberHash(x);
    case "bigint":
      return bigintHash(x);
    case "string":
      return stringHash(x);
    default: {
      if (isHashable(x)) {
        return x.GetHashCode();
      } else if (isArrayLike(x)) {
        return arrayHash(x);
      } else if (x instanceof Date) {
        return dateHash(x);
      } else if (Object.getPrototypeOf(x)?.constructor === Object) {
        const hashes = Object.values(x).map((v) => structuralHash(v));
        return combineHashCodes(hashes);
      } else {
        return numberHash(ObjectRef.id(x));
      }
    }
  }
}
function equalArraysWith(x, y, eq) {
  if (x == null) {
    return y == null;
  }
  if (y == null) {
    return false;
  }
  if (x.length !== y.length) {
    return false;
  }
  for (let i = 0; i < x.length; i++) {
    if (!eq(x[i], y[i])) {
      return false;
    }
  }
  return true;
}
function equalArrays(x, y) {
  return equalArraysWith(x, y, equals);
}
function equalObjects(x, y) {
  const xKeys = Object.keys(x);
  const yKeys = Object.keys(y);
  if (xKeys.length !== yKeys.length) {
    return false;
  }
  xKeys.sort();
  yKeys.sort();
  for (let i = 0; i < xKeys.length; i++) {
    if (xKeys[i] !== yKeys[i] || !equals(x[xKeys[i]], y[yKeys[i]])) {
      return false;
    }
  }
  return true;
}
function equals(x, y) {
  if (x === y) {
    return true;
  } else if (x == null) {
    return y == null;
  } else if (y == null) {
    return false;
  } else if (isEquatable(x)) {
    return x.Equals(y);
  } else if (isArrayLike(x)) {
    return isArrayLike(y) && equalArrays(x, y);
  } else if (typeof x !== "object") {
    return false;
  } else if (x instanceof Date) {
    return y instanceof Date && compareDates(x, y) === 0;
  } else {
    return Object.getPrototypeOf(x)?.constructor === Object && equalObjects(x, y);
  }
}
function compareDates(x, y) {
  let xtime;
  let ytime;
  if ("offset" in x && "offset" in y) {
    xtime = x.getTime();
    ytime = y.getTime();
  } else {
    xtime = x.getTime() + dateOffset(x);
    ytime = y.getTime() + dateOffset(y);
  }
  return xtime === ytime ? 0 : xtime < ytime ? -1 : 1;
}
function comparePrimitives(x, y) {
  return x === y ? 0 : x < y ? -1 : 1;
}
function compareArraysWith(x, y, comp) {
  if (x == null) {
    return y == null ? 0 : 1;
  }
  if (y == null) {
    return -1;
  }
  if (x.length !== y.length) {
    return x.length < y.length ? -1 : 1;
  }
  for (let i = 0, j = 0; i < x.length; i++) {
    j = comp(x[i], y[i]);
    if (j !== 0) {
      return j;
    }
  }
  return 0;
}
function compareArrays(x, y) {
  return compareArraysWith(x, y, compare2);
}
function compareObjects(x, y) {
  const xKeys = Object.keys(x);
  const yKeys = Object.keys(y);
  if (xKeys.length !== yKeys.length) {
    return xKeys.length < yKeys.length ? -1 : 1;
  }
  xKeys.sort();
  yKeys.sort();
  for (let i = 0, j = 0; i < xKeys.length; i++) {
    const key = xKeys[i];
    if (key !== yKeys[i]) {
      return key < yKeys[i] ? -1 : 1;
    } else {
      j = compare2(x[key], y[key]);
      if (j !== 0) {
        return j;
      }
    }
  }
  return 0;
}
function compare2(x, y) {
  if (x === y) {
    return 0;
  } else if (x == null) {
    return y == null ? 0 : -1;
  } else if (y == null) {
    return 1;
  } else if (isComparable(x)) {
    return x.CompareTo(y);
  } else if (isArrayLike(x)) {
    return isArrayLike(y) ? compareArrays(x, y) : -1;
  } else if (typeof x !== "object") {
    return x < y ? -1 : 1;
  } else if (x instanceof Date) {
    return y instanceof Date ? compareDates(x, y) : -1;
  } else {
    return Object.getPrototypeOf(x)?.constructor === Object ? compareObjects(x, y) : -1;
  }
}

// fable_modules/fable-library-js.4.17.0/Types.js
function seqToString(self) {
  let count = 0;
  let str = "[";
  for (const x of self) {
    if (count === 0) {
      str += toString(x);
    } else if (count === 100) {
      str += "; ...";
      break;
    } else {
      str += "; " + toString(x);
    }
    count++;
  }
  return str + "]";
}
function toString(x, callStack = 0) {
  if (x != null && typeof x === "object") {
    if (typeof x.toString === "function") {
      return x.toString();
    } else if (Symbol.iterator in x) {
      return seqToString(x);
    } else {
      const cons2 = Object.getPrototypeOf(x)?.constructor;
      return cons2 === Object && callStack < 10 ? "{ " + Object.entries(x).map(([k, v]) => k + " = " + toString(v, callStack + 1)).join("\n  ") + " }" : cons2?.name ?? "";
    }
  }
  return String(x);
}
function unionToString(name, fields) {
  if (fields.length === 0) {
    return name;
  } else {
    let fieldStr;
    let withParens = true;
    if (fields.length === 1) {
      fieldStr = toString(fields[0]);
      withParens = fieldStr.indexOf(" ") >= 0;
    } else {
      fieldStr = fields.map((x) => toString(x)).join(", ");
    }
    return name + (withParens ? " (" : " ") + fieldStr + (withParens ? ")" : "");
  }
}
var Union = class {
  get name() {
    return this.cases()[this.tag];
  }
  toJSON() {
    return this.fields.length === 0 ? this.name : [this.name].concat(this.fields);
  }
  toString() {
    return unionToString(this.name, this.fields);
  }
  GetHashCode() {
    const hashes = this.fields.map((x) => structuralHash(x));
    hashes.splice(0, 0, numberHash(this.tag));
    return combineHashCodes(hashes);
  }
  Equals(other) {
    if (this === other) {
      return true;
    } else if (!sameConstructor(this, other)) {
      return false;
    } else if (this.tag === other.tag) {
      return equalArrays(this.fields, other.fields);
    } else {
      return false;
    }
  }
  CompareTo(other) {
    if (this === other) {
      return 0;
    } else if (!sameConstructor(this, other)) {
      return -1;
    } else if (this.tag === other.tag) {
      return compareArrays(this.fields, other.fields);
    } else {
      return this.tag < other.tag ? -1 : 1;
    }
  }
};
function recordToJSON(self) {
  const o = {};
  const keys = Object.keys(self);
  for (let i = 0; i < keys.length; i++) {
    o[keys[i]] = self[keys[i]];
  }
  return o;
}
function recordToString(self) {
  return "{ " + Object.entries(self).map(([k, v]) => k + " = " + toString(v)).join("\n  ") + " }";
}
function recordGetHashCode(self) {
  const hashes = Object.values(self).map((v) => structuralHash(v));
  return combineHashCodes(hashes);
}
function recordEquals(self, other) {
  if (self === other) {
    return true;
  } else if (!sameConstructor(self, other)) {
    return false;
  } else {
    const thisNames = Object.keys(self);
    for (let i = 0; i < thisNames.length; i++) {
      if (!equals(self[thisNames[i]], other[thisNames[i]])) {
        return false;
      }
    }
    return true;
  }
}
function recordCompareTo(self, other) {
  if (self === other) {
    return 0;
  } else if (!sameConstructor(self, other)) {
    return -1;
  } else {
    const thisNames = Object.keys(self);
    for (let i = 0; i < thisNames.length; i++) {
      const result = compare2(self[thisNames[i]], other[thisNames[i]]);
      if (result !== 0) {
        return result;
      }
    }
    return 0;
  }
}
var Record = class {
  toJSON() {
    return recordToJSON(this);
  }
  toString() {
    return recordToString(this);
  }
  GetHashCode() {
    return recordGetHashCode(this);
  }
  Equals(other) {
    return recordEquals(this, other);
  }
  CompareTo(other) {
    return recordCompareTo(this, other);
  }
};

// fable_modules/fable-library-js.4.17.0/Date.js
var shortDays = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat"
];
var longDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
var shortMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
var longMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
function parseRepeatToken(format2, pos, patternChar) {
  let tokenLength = 0;
  let internalPos = pos;
  while (internalPos < format2.length && format2[internalPos] === patternChar) {
    internalPos++;
    tokenLength++;
  }
  return tokenLength;
}
function parseNextChar(format2, pos) {
  if (pos >= format2.length - 1) {
    return -1;
  }
  return format2.charCodeAt(pos + 1);
}
function parseQuotedString(format2, pos) {
  let beginPos = pos;
  const quoteChar = format2[pos];
  let result = "";
  let foundQuote = false;
  while (pos < format2.length) {
    pos++;
    const currentChar = format2[pos];
    if (currentChar === quoteChar) {
      foundQuote = true;
      break;
    } else if (currentChar === "\\") {
      if (pos < format2.length) {
        pos++;
        result += format2[pos];
      } else {
        throw new Error("Invalid string format");
      }
    } else {
      result += currentChar;
    }
  }
  if (!foundQuote) {
    throw new Error(`Invalid string format could not find matching quote for ${quoteChar}`);
  }
  return [result, pos - beginPos + 1];
}
function dateToStringWithCustomFormat(date, format2, utc) {
  let cursorPos = 0;
  let tokenLength = 0;
  let result = "";
  const localizedDate = utc ? DateTime(
    date.getTime(),
    1
    /* DateKind.UTC */
  ) : date;
  while (cursorPos < format2.length) {
    const token = format2[cursorPos];
    switch (token) {
      case "d":
        tokenLength = parseRepeatToken(format2, cursorPos, "d");
        cursorPos += tokenLength;
        switch (tokenLength) {
          case 1:
            result += day(localizedDate);
            break;
          case 2:
            result += padWithZeros(day(localizedDate), 2);
            break;
          case 3:
            result += shortDays[dayOfWeek(localizedDate)];
            break;
          case 4:
            result += longDays[dayOfWeek(localizedDate)];
            break;
          default:
            break;
        }
        break;
      case "f":
        tokenLength = parseRepeatToken(format2, cursorPos, "f");
        cursorPos += tokenLength;
        if (tokenLength <= 3) {
          const precision = 10 ** (3 - tokenLength);
          result += padWithZeros(Math.floor(millisecond(localizedDate) / precision), tokenLength);
        } else if (tokenLength <= 7) {
          result += ("" + millisecond(localizedDate)).padEnd(tokenLength, "0");
        }
        break;
      case "F":
        tokenLength = parseRepeatToken(format2, cursorPos, "F");
        cursorPos += tokenLength;
        if (tokenLength <= 3) {
          const precision = 10 ** (3 - tokenLength);
          const value2 = Math.floor(millisecond(localizedDate) / precision);
          if (value2 != 0) {
            result += padWithZeros(value2, tokenLength);
          }
        } else if (tokenLength <= 7) {
          const value2 = millisecond(localizedDate);
          if (value2 != 0) {
            result += padWithZeros(value2, 3);
          }
        }
        break;
      case "g":
        tokenLength = parseRepeatToken(format2, cursorPos, "g");
        cursorPos += tokenLength;
        if (tokenLength <= 2) {
          result += "A.D.";
        }
        break;
      case "h":
        tokenLength = parseRepeatToken(format2, cursorPos, "h");
        cursorPos += tokenLength;
        switch (tokenLength) {
          case 1:
            result += hour(localizedDate) % 12;
            break;
          case 2:
            result += padWithZeros(hour(localizedDate) % 12, 2);
            break;
          default:
            break;
        }
        break;
      case "H":
        tokenLength = parseRepeatToken(format2, cursorPos, "H");
        cursorPos += tokenLength;
        switch (tokenLength) {
          case 1:
            result += hour(localizedDate);
            break;
          case 2:
            result += padWithZeros(hour(localizedDate), 2);
            break;
          default:
            break;
        }
        break;
      case "K":
        tokenLength = parseRepeatToken(format2, cursorPos, "K");
        cursorPos += tokenLength;
        switch (tokenLength) {
          case 1:
            switch (kind(localizedDate)) {
              case 1:
                result += "Z";
                break;
              case 2:
                result += dateOffsetToString(localizedDate.getTimezoneOffset() * -6e4);
                break;
              case 0:
                break;
            }
            break;
          default:
            break;
        }
        break;
      case "m":
        tokenLength = parseRepeatToken(format2, cursorPos, "m");
        cursorPos += tokenLength;
        switch (tokenLength) {
          case 1:
            result += minute(localizedDate);
            break;
          case 2:
            result += padWithZeros(minute(localizedDate), 2);
            break;
          default:
            break;
        }
        break;
      case "M":
        tokenLength = parseRepeatToken(format2, cursorPos, "M");
        cursorPos += tokenLength;
        switch (tokenLength) {
          case 1:
            result += month(localizedDate);
            break;
          case 2:
            result += padWithZeros(month(localizedDate), 2);
            break;
          case 3:
            result += shortMonths[month(localizedDate) - 1];
            break;
          case 4:
            result += longMonths[month(localizedDate) - 1];
            break;
          default:
            break;
        }
        break;
      case "s":
        tokenLength = parseRepeatToken(format2, cursorPos, "s");
        cursorPos += tokenLength;
        switch (tokenLength) {
          case 1:
            result += second(localizedDate);
            break;
          case 2:
            result += padWithZeros(second(localizedDate), 2);
            break;
          default:
            break;
        }
        break;
      case "t":
        tokenLength = parseRepeatToken(format2, cursorPos, "t");
        cursorPos += tokenLength;
        switch (tokenLength) {
          case 1:
            result += localizedDate.getHours() < 12 ? "A" : "P";
            break;
          case 2:
            result += localizedDate.getHours() < 12 ? "AM" : "PM";
            break;
          default:
            break;
        }
        break;
      case "y":
        tokenLength = parseRepeatToken(format2, cursorPos, "y");
        cursorPos += tokenLength;
        switch (tokenLength) {
          case 1:
            result += localizedDate.getFullYear() % 100;
            break;
          case 2:
            result += padWithZeros(localizedDate.getFullYear() % 100, 2);
            break;
          case 3:
            result += padWithZeros(localizedDate.getFullYear(), 3);
            break;
          case 4:
            result += padWithZeros(localizedDate.getFullYear(), 4);
            break;
          case 5:
            result += padWithZeros(localizedDate.getFullYear(), 5);
            break;
          default:
            break;
        }
        break;
      case "z":
        tokenLength = parseRepeatToken(format2, cursorPos, "z");
        cursorPos += tokenLength;
        let utcOffsetText = "";
        switch (kind(localizedDate)) {
          case 1:
            utcOffsetText = "+00:00";
            break;
          case 2:
            utcOffsetText = dateOffsetToString(localizedDate.getTimezoneOffset() * -6e4);
            break;
          case 0:
            utcOffsetText = dateOffsetToString(toLocalTime(localizedDate).getTimezoneOffset() * -6e4);
            break;
        }
        const sign = utcOffsetText[0] === "-" ? "-" : "+";
        const hours = parseInt(utcOffsetText.substring(1, 3), 10);
        const minutes = parseInt(utcOffsetText.substring(4, 6), 10);
        switch (tokenLength) {
          case 1:
            result += `${sign}${hours}`;
            break;
          case 2:
            result += `${sign}${padWithZeros(hours, 2)}`;
            break;
          default:
            result += `${sign}${padWithZeros(hours, 2)}:${padWithZeros(minutes, 2)}`;
            break;
        }
        break;
      case ":":
        result += ":";
        cursorPos++;
        break;
      case "/":
        result += "/";
        cursorPos++;
        break;
      case "'":
      case '"':
        const [quotedString, quotedStringLenght] = parseQuotedString(format2, cursorPos);
        result += quotedString;
        cursorPos += quotedStringLenght;
        break;
      case "%":
        const nextChar = parseNextChar(format2, cursorPos);
        if (nextChar >= 0 && nextChar !== "%".charCodeAt(0)) {
          cursorPos += 2;
          result += dateToStringWithCustomFormat(localizedDate, String.fromCharCode(nextChar), utc);
        } else {
          throw new Error("Invalid format string");
        }
        break;
      case "\\":
        const nextChar2 = parseNextChar(format2, cursorPos);
        if (nextChar2 >= 0) {
          cursorPos += 2;
          result += String.fromCharCode(nextChar2);
        } else {
          throw new Error("Invalid format string");
        }
        break;
      default:
        cursorPos++;
        result += token;
        break;
    }
  }
  return result;
}
function kind(value2) {
  return value2.kind || 0;
}
function dateOffsetToString(offset) {
  const isMinus = offset < 0;
  offset = Math.abs(offset);
  const hours = ~~(offset / 36e5);
  const minutes = offset % 36e5 / 6e4;
  return (isMinus ? "-" : "+") + padWithZeros(hours, 2) + ":" + padWithZeros(minutes, 2);
}
function dateToHalfUTCString(date, half) {
  const str = date.toISOString();
  return half === "first" ? str.substring(0, str.indexOf("T")) : str.substring(str.indexOf("T") + 1, str.length - 1);
}
function dateToISOString(d, utc) {
  if (utc) {
    return d.toISOString();
  } else {
    const printOffset = d.kind == null ? true : d.kind === 2;
    return padWithZeros(d.getFullYear(), 4) + "-" + padWithZeros(d.getMonth() + 1, 2) + "-" + padWithZeros(d.getDate(), 2) + "T" + padWithZeros(d.getHours(), 2) + ":" + padWithZeros(d.getMinutes(), 2) + ":" + padWithZeros(d.getSeconds(), 2) + "." + padWithZeros(d.getMilliseconds(), 3) + (printOffset ? dateOffsetToString(d.getTimezoneOffset() * -6e4) : "");
  }
}
function dateToISOStringWithOffset(dateWithOffset, offset) {
  const str = dateWithOffset.toISOString();
  return str.substring(0, str.length - 1) + dateOffsetToString(offset);
}
function dateToStringWithOffset(date, format2) {
  const d = new Date(date.getTime() + (date.offset ?? 0));
  if (typeof format2 !== "string") {
    return d.toISOString().replace(/\.\d+/, "").replace(/[A-Z]|\.\d+/g, " ") + dateOffsetToString(date.offset ?? 0);
  } else if (format2.length === 1) {
    switch (format2) {
      case "D":
      case "d":
        return dateToHalfUTCString(d, "first");
      case "T":
      case "t":
        return dateToHalfUTCString(d, "second");
      case "O":
      case "o":
        return dateToISOStringWithOffset(d, date.offset ?? 0);
      default:
        throw new Error("Unrecognized Date print format");
    }
  } else {
    return dateToStringWithCustomFormat(d, format2, true);
  }
}
function dateToStringWithKind(date, format2) {
  const utc = date.kind === 1;
  if (typeof format2 !== "string") {
    return utc ? date.toUTCString() : date.toLocaleString();
  } else if (format2.length === 1) {
    switch (format2) {
      case "D":
      case "d":
        return utc ? dateToHalfUTCString(date, "first") : date.toLocaleDateString();
      case "T":
      case "t":
        return utc ? dateToHalfUTCString(date, "second") : date.toLocaleTimeString();
      case "O":
      case "o":
        return dateToISOString(date, utc);
      default:
        throw new Error("Unrecognized Date print format");
    }
  } else {
    return dateToStringWithCustomFormat(date, format2, utc);
  }
}
function toString2(date, format2, _provider) {
  return date.offset != null ? dateToStringWithOffset(date, format2) : dateToStringWithKind(date, format2);
}
function DateTime(value2, kind2) {
  const d = new Date(value2);
  d.kind = (kind2 == null ? 0 : kind2) | 0;
  return d;
}
function toLocalTime(date) {
  return date.kind === 2 ? date : DateTime(
    date.getTime(),
    2
    /* DateKind.Local */
  );
}
function day(d) {
  return d.kind === 1 ? d.getUTCDate() : d.getDate();
}
function hour(d) {
  return d.kind === 1 ? d.getUTCHours() : d.getHours();
}
function millisecond(d) {
  return d.kind === 1 ? d.getUTCMilliseconds() : d.getMilliseconds();
}
function minute(d) {
  return d.kind === 1 ? d.getUTCMinutes() : d.getMinutes();
}
function month(d) {
  return (d.kind === 1 ? d.getUTCMonth() : d.getMonth()) + 1;
}
function second(d) {
  return d.kind === 1 ? d.getUTCSeconds() : d.getSeconds();
}
function dayOfWeek(d) {
  return d.kind === 1 ? d.getUTCDay() : d.getDay();
}

// fable_modules/fable-library-js.4.17.0/String.js
var fsFormatRegExp = /(^|[^%])%([0+\- ]*)(\*|\d+)?(?:\.(\d+))?(\w)/g;
var formatRegExp = /\{(\d+)(,-?\d+)?(?:\:([a-zA-Z])(\d{0,2})|\:(.+?))?\}/g;
function isLessThan(x, y) {
  return compare(x, y) < 0;
}
function printf(input) {
  return {
    input,
    cont: fsFormat(input)
  };
}
function continuePrint(cont, arg) {
  return typeof arg === "string" ? cont(arg) : arg.cont(cont);
}
function toText(arg) {
  return continuePrint((x) => x, arg);
}
function formatReplacement(rep, flags, padLength, precision, format2) {
  let sign = "";
  flags = flags || "";
  format2 = format2 || "";
  if (isNumeric(rep)) {
    if (format2.toLowerCase() !== "x") {
      if (isLessThan(rep, 0)) {
        rep = multiply(rep, -1);
        sign = "-";
      } else {
        if (flags.indexOf(" ") >= 0) {
          sign = " ";
        } else if (flags.indexOf("+") >= 0) {
          sign = "+";
        }
      }
    }
    precision = precision == null ? null : parseInt(precision, 10);
    switch (format2) {
      case "f":
      case "F":
        precision = precision != null ? precision : 6;
        rep = toFixed(rep, precision);
        break;
      case "g":
      case "G":
        rep = precision != null ? toPrecision(rep, precision) : toPrecision(rep);
        break;
      case "e":
      case "E":
        rep = precision != null ? toExponential(rep, precision) : toExponential(rep);
        break;
      case "x":
        rep = toHex(rep);
        break;
      case "X":
        rep = toHex(rep).toUpperCase();
        break;
      default:
        rep = String(rep);
        break;
    }
  } else if (rep instanceof Date) {
    rep = toString2(rep);
  } else {
    rep = toString(rep);
  }
  padLength = typeof padLength === "number" ? padLength : parseInt(padLength, 10);
  if (!isNaN(padLength)) {
    const zeroFlag = flags.indexOf("0") >= 0;
    const minusFlag = flags.indexOf("-") >= 0;
    const ch = minusFlag || !zeroFlag ? " " : "0";
    if (ch === "0") {
      rep = pad(rep, padLength - sign.length, ch, minusFlag);
      rep = sign + rep;
    } else {
      rep = pad(sign + rep, padLength, ch, minusFlag);
    }
  } else {
    rep = sign + rep;
  }
  return rep;
}
function createPrinter(cont, _strParts, _matches, _result = "", padArg = -1) {
  return (...args) => {
    let result = _result;
    const strParts = _strParts.slice();
    const matches = _matches.slice();
    for (const arg of args) {
      const [, , flags, _padLength, precision, format2] = matches[0];
      let padLength = _padLength;
      if (padArg >= 0) {
        padLength = padArg;
        padArg = -1;
      } else if (padLength === "*") {
        if (arg < 0) {
          throw new Error("Non-negative number required");
        }
        padArg = arg;
        continue;
      }
      result += strParts[0];
      result += formatReplacement(arg, flags, padLength, precision, format2);
      strParts.splice(0, 1);
      matches.splice(0, 1);
    }
    if (matches.length === 0) {
      result += strParts[0];
      return cont(result);
    } else {
      return createPrinter(cont, strParts, matches, result, padArg);
    }
  };
}
function fsFormat(str) {
  return (cont) => {
    fsFormatRegExp.lastIndex = 0;
    const strParts = [];
    const matches = [];
    let strIdx = 0;
    let match = fsFormatRegExp.exec(str);
    while (match) {
      const matchIndex = match.index + (match[1] || "").length;
      strParts.push(str.substring(strIdx, matchIndex).replace(/%%/g, "%"));
      matches.push(match);
      strIdx = fsFormatRegExp.lastIndex;
      fsFormatRegExp.lastIndex -= 1;
      match = fsFormatRegExp.exec(str);
    }
    if (strParts.length === 0) {
      return cont(str.replace(/%%/g, "%"));
    } else {
      strParts.push(str.substring(strIdx).replace(/%%/g, "%"));
      return createPrinter(cont, strParts, matches);
    }
  };
}
function format(str, ...args) {
  let str2;
  if (typeof str === "object") {
    str2 = String(args[0]);
    args.shift();
  } else {
    str2 = str;
  }
  return str2.replace(formatRegExp, (_, idx, padLength, format2, precision, pattern) => {
    if (idx < 0 || idx >= args.length) {
      throw new Error("Index must be greater or equal to zero and less than the arguments' length.");
    }
    let rep = args[idx];
    if (isNumeric(rep)) {
      precision = precision == null ? null : parseInt(precision, 10);
      switch (format2) {
        case "f":
        case "F":
          precision = precision != null ? precision : 2;
          rep = toFixed(rep, precision);
          break;
        case "g":
        case "G":
          rep = precision != null ? toPrecision(rep, precision) : toPrecision(rep);
          break;
        case "e":
        case "E":
          rep = precision != null ? toExponential(rep, precision) : toExponential(rep);
          break;
        case "p":
        case "P":
          precision = precision != null ? precision : 2;
          rep = toFixed(multiply(rep, 100), precision) + " %";
          break;
        case "d":
        case "D":
          rep = precision != null ? padLeft(String(rep), precision, "0") : String(rep);
          break;
        case "x":
        case "X":
          rep = precision != null ? padLeft(toHex(rep), precision, "0") : toHex(rep);
          if (format2 === "X") {
            rep = rep.toUpperCase();
          }
          break;
        default:
          if (pattern) {
            let sign = "";
            rep = pattern.replace(/([0#,]+)(\.[0#]+)?/, (_2, intPart, decimalPart) => {
              if (isLessThan(rep, 0)) {
                rep = multiply(rep, -1);
                sign = "-";
              }
              decimalPart = decimalPart == null ? "" : decimalPart.substring(1);
              rep = toFixed(rep, Math.max(decimalPart.length, 0));
              let [repInt, repDecimal] = rep.split(".");
              repDecimal || (repDecimal = "");
              const leftZeroes = intPart.replace(/,/g, "").replace(/^#+/, "").length;
              repInt = padLeft(repInt, leftZeroes, "0");
              const rightZeros = decimalPart.replace(/#+$/, "").length;
              if (rightZeros > repDecimal.length) {
                repDecimal = padRight(repDecimal, rightZeros, "0");
              } else if (rightZeros < repDecimal.length) {
                repDecimal = repDecimal.substring(0, rightZeros) + repDecimal.substring(rightZeros).replace(/0+$/, "");
              }
              if (intPart.indexOf(",") > 0) {
                const i = repInt.length % 3;
                const thousandGroups = Math.floor(repInt.length / 3);
                let thousands = i > 0 ? repInt.substr(0, i) + (thousandGroups > 0 ? "," : "") : "";
                for (let j = 0; j < thousandGroups; j++) {
                  thousands += repInt.substr(i + j * 3, 3) + (j < thousandGroups - 1 ? "," : "");
                }
                repInt = thousands;
              }
              return repDecimal.length > 0 ? repInt + "." + repDecimal : repInt;
            });
            rep = sign + rep;
          }
      }
    } else if (rep instanceof Date) {
      rep = toString2(rep, pattern || format2);
    } else {
      rep = toString(rep);
    }
    padLength = parseInt((padLength || " ").substring(1), 10);
    if (!isNaN(padLength)) {
      rep = pad(String(rep), Math.abs(padLength), " ", padLength < 0);
    }
    return rep;
  });
}
function initialize(n, f) {
  if (n < 0) {
    throw new Error("String length must be non-negative");
  }
  const xs = new Array(n);
  for (let i = 0; i < n; i++) {
    xs[i] = f(i);
  }
  return xs.join("");
}
function join(delimiter, xs) {
  if (Array.isArray(xs)) {
    return xs.join(delimiter);
  } else {
    return Array.from(xs).join(delimiter);
  }
}
function pad(str, len, ch, isRight) {
  ch = ch || " ";
  len = len - str.length;
  for (let i = 0; i < len; i++) {
    str = isRight ? str + ch : ch + str;
  }
  return str;
}
function padLeft(str, len, ch) {
  return pad(str, len, ch);
}
function padRight(str, len, ch) {
  return pad(str, len, ch, true);
}
function replicate(n, x) {
  return initialize(n, () => x);
}

// interpreter-types.fs.js
var ty = class extends Union {
  constructor(tag, fields) {
    super();
    this.tag = tag;
    this.fields = fields;
  }
  cases() {
    return ["BOOL", "FUN"];
  }
};
var exp = class extends Union {
  constructor(tag, fields) {
    super();
    this.tag = tag;
    this.fields = fields;
  }
  cases() {
    return ["Lit", "Lam", "App", "Bool", "If"];
  }
};

// fable_modules/fable-library-js.4.17.0/Option.js
var Some = class _Some {
  constructor(value2) {
    this.value = value2;
  }
  toJSON() {
    return this.value;
  }
  // Don't add "Some" for consistency with erased options
  toString() {
    return String(this.value);
  }
  GetHashCode() {
    return structuralHash(this.value);
  }
  Equals(other) {
    if (other == null) {
      return false;
    } else {
      return equals(this.value, other instanceof _Some ? other.value : other);
    }
  }
  CompareTo(other) {
    if (other == null) {
      return 1;
    } else {
      return compare2(this.value, other instanceof _Some ? other.value : other);
    }
  }
};
function value(x) {
  if (x == null) {
    throw new Error("Option has no value");
  } else {
    return x instanceof Some ? x.value : x;
  }
}
function some(x) {
  return x == null || x instanceof Some ? new Some(x) : x;
}

// fable_modules/fable-library-js.4.17.0/FSharp.Core.js
function Operators_NullArg(x) {
  throw new Error(x);
}

// fable_modules/fable-library-js.4.17.0/Global.js
var SR_inputWasEmpty = "Collection was empty.";

// fable_modules/fable-library-js.4.17.0/Array.js
function fill(target, targetIndex, count, value2) {
  const start = targetIndex | 0;
  return target.fill(value2, start, start + count);
}
function tryHead(array) {
  if (array.length === 0) {
    return void 0;
  } else {
    return some(item(0, array));
  }
}
function item(index, array) {
  if (index < 0 ? true : index >= array.length) {
    throw new Error("Index was outside the bounds of the array.\\nParameter name: index");
  } else {
    return array[index];
  }
}
function setItem(array, index, value2) {
  if (index < 0 ? true : index >= array.length) {
    throw new Error("Index was outside the bounds of the array.\\nParameter name: index");
  } else {
    array[index] = value2;
  }
}

// fable_modules/fable-library-js.4.17.0/List.js
var FSharpList = class extends Record {
  constructor(head3, tail2) {
    super();
    this.head = head3;
    this.tail = tail2;
  }
  toString() {
    const xs = this;
    return "[" + join("; ", xs) + "]";
  }
  Equals(other) {
    const xs = this;
    if (xs === other) {
      return true;
    } else {
      const loop = (xs_1_mut, ys_1_mut) => {
        loop: while (true) {
          const xs_1 = xs_1_mut, ys_1 = ys_1_mut;
          const matchValue = xs_1.tail;
          const matchValue_1 = ys_1.tail;
          if (matchValue != null) {
            if (matchValue_1 != null) {
              const xt = value(matchValue);
              const yt = value(matchValue_1);
              if (equals(xs_1.head, ys_1.head)) {
                xs_1_mut = xt;
                ys_1_mut = yt;
                continue loop;
              } else {
                return false;
              }
            } else {
              return false;
            }
          } else if (matchValue_1 != null) {
            return false;
          } else {
            return true;
          }
          break;
        }
      };
      return loop(xs, other);
    }
  }
  GetHashCode() {
    const xs = this;
    const loop = (i_mut, h_mut, xs_1_mut) => {
      loop: while (true) {
        const i = i_mut, h = h_mut, xs_1 = xs_1_mut;
        const matchValue = xs_1.tail;
        if (matchValue != null) {
          const t = value(matchValue);
          if (i > 18) {
            return h | 0;
          } else {
            i_mut = i + 1;
            h_mut = (h << 1) + structuralHash(xs_1.head) + 631 * i;
            xs_1_mut = t;
            continue loop;
          }
        } else {
          return h | 0;
        }
        break;
      }
    };
    return loop(0, 0, xs) | 0;
  }
  toJSON() {
    const this$ = this;
    return Array.from(this$);
  }
  CompareTo(other) {
    const xs = this;
    const loop = (xs_1_mut, ys_1_mut) => {
      loop: while (true) {
        const xs_1 = xs_1_mut, ys_1 = ys_1_mut;
        const matchValue = xs_1.tail;
        const matchValue_1 = ys_1.tail;
        if (matchValue != null) {
          if (matchValue_1 != null) {
            const xt = value(matchValue);
            const yt = value(matchValue_1);
            const c = compare2(xs_1.head, ys_1.head) | 0;
            if (c === 0) {
              xs_1_mut = xt;
              ys_1_mut = yt;
              continue loop;
            } else {
              return c | 0;
            }
          } else {
            return 1;
          }
        } else if (matchValue_1 != null) {
          return -1;
        } else {
          return 0;
        }
        break;
      }
    };
    return loop(xs, other) | 0;
  }
  GetEnumerator() {
    const xs = this;
    return ListEnumerator$1_$ctor_3002E699(xs);
  }
  [Symbol.iterator]() {
    return toIterator(getEnumerator(this));
  }
  "System.Collections.IEnumerable.GetEnumerator"() {
    const xs = this;
    return getEnumerator(xs);
  }
};
var ListEnumerator$1 = class {
  constructor(xs) {
    this.xs = xs;
    this.it = this.xs;
    this.current = defaultOf();
  }
  "System.Collections.Generic.IEnumerator`1.get_Current"() {
    const _ = this;
    return _.current;
  }
  "System.Collections.IEnumerator.get_Current"() {
    const _ = this;
    return _.current;
  }
  "System.Collections.IEnumerator.MoveNext"() {
    const _ = this;
    const matchValue = _.it.tail;
    if (matchValue != null) {
      const t = value(matchValue);
      _.current = _.it.head;
      _.it = t;
      return true;
    } else {
      return false;
    }
  }
  "System.Collections.IEnumerator.Reset"() {
    const _ = this;
    _.it = _.xs;
    _.current = defaultOf();
  }
  Dispose() {
  }
};
function ListEnumerator$1_$ctor_3002E699(xs) {
  return new ListEnumerator$1(xs);
}
function FSharpList_get_Empty() {
  return new FSharpList(defaultOf(), void 0);
}
function FSharpList_Cons_305B8EAC(x, xs) {
  return new FSharpList(x, xs);
}
function FSharpList__get_IsEmpty(xs) {
  return xs.tail == null;
}
function FSharpList__get_Length(xs) {
  const loop = (i_mut, xs_1_mut) => {
    loop: while (true) {
      const i = i_mut, xs_1 = xs_1_mut;
      const matchValue = xs_1.tail;
      if (matchValue != null) {
        i_mut = i + 1;
        xs_1_mut = value(matchValue);
        continue loop;
      } else {
        return i | 0;
      }
      break;
    }
  };
  return loop(0, xs) | 0;
}
function FSharpList__get_Head(xs) {
  const matchValue = xs.tail;
  if (matchValue != null) {
    return xs.head;
  } else {
    throw new Error(SR_inputWasEmpty + "\\nParameter name: list");
  }
}
function FSharpList__get_Tail(xs) {
  const matchValue = xs.tail;
  if (matchValue != null) {
    return value(matchValue);
  } else {
    throw new Error(SR_inputWasEmpty + "\\nParameter name: list");
  }
}
function empty() {
  return FSharpList_get_Empty();
}
function singleton(x) {
  return FSharpList_Cons_305B8EAC(x, FSharpList_get_Empty());
}
function isEmpty(xs) {
  return FSharpList__get_IsEmpty(xs);
}
function head(xs) {
  return FSharpList__get_Head(xs);
}
function tryHead2(xs) {
  if (FSharpList__get_IsEmpty(xs)) {
    return void 0;
  } else {
    return some(FSharpList__get_Head(xs));
  }
}
function tail(xs) {
  return FSharpList__get_Tail(xs);
}
function toArray(xs) {
  const len = FSharpList__get_Length(xs) | 0;
  const res = fill(new Array(len), 0, len, null);
  const loop = (i_mut, xs_1_mut) => {
    loop: while (true) {
      const i = i_mut, xs_1 = xs_1_mut;
      if (!FSharpList__get_IsEmpty(xs_1)) {
        setItem(res, i, FSharpList__get_Head(xs_1));
        i_mut = i + 1;
        xs_1_mut = FSharpList__get_Tail(xs_1);
        continue loop;
      }
      break;
    }
  };
  loop(0, xs);
  return res;
}
function ofArrayWithTail(xs, tail_1) {
  let res = tail_1;
  for (let i = xs.length - 1; i >= 0; i--) {
    res = FSharpList_Cons_305B8EAC(item(i, xs), res);
  }
  return res;
}
function ofArray(xs) {
  return ofArrayWithTail(xs, FSharpList_get_Empty());
}

// fable_modules/fable-library-js.4.17.0/Seq.js
var SR_enumerationAlreadyFinished = "Enumeration already finished.";
var SR_enumerationNotStarted = "Enumeration has not started. Call MoveNext.";
var SR_inputSequenceEmpty2 = "The input sequence was empty.";
var SR_resetNotSupported = "Reset is not supported on this enumerator.";
function Enumerator_noReset() {
  throw new Error(SR_resetNotSupported);
}
function Enumerator_notStarted() {
  throw new Error(SR_enumerationNotStarted);
}
function Enumerator_alreadyFinished() {
  throw new Error(SR_enumerationAlreadyFinished);
}
var Enumerator_Seq = class {
  constructor(f) {
    this.f = f;
  }
  toString() {
    const xs = this;
    let i = 0;
    let str = "seq [";
    const e = getEnumerator(xs);
    try {
      while (i < 4 && e["System.Collections.IEnumerator.MoveNext"]()) {
        if (i > 0) {
          str = str + "; ";
        }
        str = str + toString(e["System.Collections.Generic.IEnumerator`1.get_Current"]());
        i = i + 1 | 0;
      }
      if (i === 4) {
        str = str + "; ...";
      }
      return str + "]";
    } finally {
      disposeSafe(e);
    }
  }
  GetEnumerator() {
    const x = this;
    return x.f();
  }
  [Symbol.iterator]() {
    return toIterator(getEnumerator(this));
  }
  "System.Collections.IEnumerable.GetEnumerator"() {
    const x = this;
    return x.f();
  }
};
function Enumerator_Seq_$ctor_673A07F2(f) {
  return new Enumerator_Seq(f);
}
var Enumerator_FromFunctions$1 = class {
  constructor(current, next, dispose) {
    this.current = current;
    this.next = next;
    this.dispose = dispose;
  }
  "System.Collections.Generic.IEnumerator`1.get_Current"() {
    const _ = this;
    return _.current();
  }
  "System.Collections.IEnumerator.get_Current"() {
    const _ = this;
    return _.current();
  }
  "System.Collections.IEnumerator.MoveNext"() {
    const _ = this;
    return _.next();
  }
  "System.Collections.IEnumerator.Reset"() {
    Enumerator_noReset();
  }
  Dispose() {
    const _ = this;
    _.dispose();
  }
};
function Enumerator_FromFunctions$1_$ctor_58C54629(current, next, dispose) {
  return new Enumerator_FromFunctions$1(current, next, dispose);
}
function Enumerator_generateWhileSome(openf, compute, closef) {
  let started = false;
  let curr = void 0;
  let state = some(openf());
  const dispose = () => {
    if (state != null) {
      const x_1 = value(state);
      try {
        closef(x_1);
      } finally {
        state = void 0;
      }
    }
  };
  const finish = () => {
    try {
      dispose();
    } finally {
      curr = void 0;
    }
  };
  return Enumerator_FromFunctions$1_$ctor_58C54629(() => {
    if (!started) {
      Enumerator_notStarted();
    }
    if (curr != null) {
      return value(curr);
    } else {
      return Enumerator_alreadyFinished();
    }
  }, () => {
    if (!started) {
      started = true;
    }
    if (state != null) {
      const s = value(state);
      let matchValue_1;
      try {
        matchValue_1 = compute(s);
      } catch (matchValue) {
        finish();
        throw matchValue;
      }
      if (matchValue_1 != null) {
        curr = matchValue_1;
        return true;
      } else {
        finish();
        return false;
      }
    } else {
      return false;
    }
  }, dispose);
}
function checkNonNull(argName, arg) {
  if (arg == null) {
    Operators_NullArg(argName);
  }
}
function mkSeq(f) {
  return Enumerator_Seq_$ctor_673A07F2(f);
}
function ofSeq2(xs) {
  checkNonNull("source", xs);
  return getEnumerator(xs);
}
function delay(generator) {
  return mkSeq(() => getEnumerator(generator()));
}
function ofArray2(arr) {
  return arr;
}
function toArray2(xs) {
  if (xs instanceof FSharpList) {
    const a = xs;
    return toArray(a);
  } else {
    return Array.from(xs);
  }
}
function generate(create, compute, dispose) {
  return mkSeq(() => Enumerator_generateWhileSome(create, compute, dispose));
}
function compareWith(comparer, xs, ys) {
  const e1 = ofSeq2(xs);
  try {
    const e2 = ofSeq2(ys);
    try {
      let c = 0;
      let b1 = e1["System.Collections.IEnumerator.MoveNext"]();
      let b2 = e2["System.Collections.IEnumerator.MoveNext"]();
      while (c === 0 && b1 && b2) {
        c = comparer(e1["System.Collections.Generic.IEnumerator`1.get_Current"](), e2["System.Collections.Generic.IEnumerator`1.get_Current"]()) | 0;
        if (c === 0) {
          b1 = e1["System.Collections.IEnumerator.MoveNext"]();
          b2 = e2["System.Collections.IEnumerator.MoveNext"]();
        }
      }
      return (c !== 0 ? c : b1 ? 1 : b2 ? -1 : 0) | 0;
    } finally {
      disposeSafe(e2);
    }
  } finally {
    disposeSafe(e1);
  }
}
function fold(folder, state, xs) {
  const e = ofSeq2(xs);
  try {
    let acc = state;
    while (e["System.Collections.IEnumerator.MoveNext"]()) {
      acc = folder(acc, e["System.Collections.Generic.IEnumerator`1.get_Current"]());
    }
    return acc;
  } finally {
    disposeSafe(e);
  }
}
function tryHead3(xs) {
  if (isArrayLike(xs)) {
    return tryHead(xs);
  } else if (xs instanceof FSharpList) {
    return tryHead2(xs);
  } else {
    const e = ofSeq2(xs);
    try {
      return e["System.Collections.IEnumerator.MoveNext"]() ? some(e["System.Collections.Generic.IEnumerator`1.get_Current"]()) : void 0;
    } finally {
      disposeSafe(e);
    }
  }
}
function head2(xs) {
  const matchValue = tryHead3(xs);
  if (matchValue == null) {
    throw new Error(SR_inputSequenceEmpty2 + "\\nParameter name: source");
  } else {
    return value(matchValue);
  }
}
function iterate(action, xs) {
  fold((unitVar, x) => {
    action(x);
  }, void 0, xs);
}
function map3(mapping, xs) {
  return generate(() => ofSeq2(xs), (e) => e["System.Collections.IEnumerator.MoveNext"]() ? some(mapping(e["System.Collections.Generic.IEnumerator`1.get_Current"]())) : void 0, (e_1) => {
    disposeSafe(e_1);
  });
}
function sortWith(comparer, xs) {
  return delay(() => {
    const arr = toArray2(xs);
    arr.sort(comparer);
    return ofArray2(arr);
  });
}
function sortBy(projection, xs, comparer) {
  return sortWith((x, y) => comparer.Compare(projection(x), projection(y)), xs);
}

// fable_modules/fable-library-js.4.17.0/Guid.js
function newGuid() {
  let b = "";
  for (let a = 0; a++ < 36; ) {
    b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : "-";
  }
  return b;
}

// interpreter-substitution-semantics.fs.js
function substitute(M, x, N) {
  const M_1 = M;
  const N_1 = N;
  switch (M_1.tag) {
    case 0:
      if (M_1.fields[0] === x) {
        return N_1;
      } else {
        return M_1;
      }
    case 1:
      if (M_1.fields[0][0] === x) {
        return M_1;
      } else {
        return new exp(1, [[M_1.fields[0][0], M_1.fields[0][1], substitute(M_1.fields[0][2], x, N_1)]]);
      }
    case 2:
      return new exp(2, [[substitute(M_1.fields[0][0], x, N_1), substitute(M_1.fields[0][1], x, N_1)]]);
    case 4:
      return new exp(4, [[substitute(M_1.fields[0][0], x, N_1), substitute(M_1.fields[0][1], x, N_1), substitute(M_1.fields[0][2], x, N_1)]]);
    default:
      return M_1;
  }
}
function evalS(_arg_mut) {
  evalS:
    while (true) {
      const _arg = _arg_mut;
      switch (_arg.tag) {
        case 2: {
          const matchValue = evalS(_arg.fields[0][0]);
          if (matchValue.tag === 1) {
            _arg_mut = substitute(matchValue.fields[0][2], matchValue.fields[0][0], _arg.fields[0][1]);
            continue evalS;
          } else {
            throw new Error("Match failure");
          }
        }
        case 4: {
          const matchValue_1 = evalS(_arg.fields[0][0]);
          let matchResult;
          if (matchValue_1.tag === 3) {
            if (matchValue_1.fields[0]) {
              matchResult = 0;
            } else {
              matchResult = 1;
            }
          } else {
            matchResult = 1;
          }
          switch (matchResult) {
            case 0: {
              _arg_mut = _arg.fields[0][1];
              continue evalS;
            }
            default: {
              _arg_mut = _arg.fields[0][2];
              continue evalS;
            }
          }
        }
        default:
          return _arg;
      }
      break;
    }
}

// fable_modules/fable-library-js.4.17.0/Map.js
var MapTreeLeaf$2 = class {
  constructor(k, v) {
    this.k = k;
    this.v = v;
  }
};
function MapTreeLeaf$2_$ctor_5BDDA1(k, v) {
  return new MapTreeLeaf$2(k, v);
}
function MapTreeLeaf$2__get_Key(_) {
  return _.k;
}
function MapTreeLeaf$2__get_Value(_) {
  return _.v;
}
var MapTreeNode$2 = class extends MapTreeLeaf$2 {
  constructor(k, v, left, right, h) {
    super(k, v);
    this.left = left;
    this.right = right;
    this.h = h | 0;
  }
};
function MapTreeNode$2_$ctor_Z39DE9543(k, v, left, right, h) {
  return new MapTreeNode$2(k, v, left, right, h);
}
function MapTreeNode$2__get_Left(_) {
  return _.left;
}
function MapTreeNode$2__get_Right(_) {
  return _.right;
}
function MapTreeNode$2__get_Height(_) {
  return _.h;
}
function MapTreeModule_empty() {
  return void 0;
}
function MapTreeModule_sizeAux(acc_mut, m_mut) {
  MapTreeModule_sizeAux: while (true) {
    const acc = acc_mut, m = m_mut;
    if (m != null) {
      const m2 = value(m);
      if (m2 instanceof MapTreeNode$2) {
        const mn = m2;
        acc_mut = MapTreeModule_sizeAux(acc + 1, MapTreeNode$2__get_Left(mn));
        m_mut = MapTreeNode$2__get_Right(mn);
        continue MapTreeModule_sizeAux;
      } else {
        return acc + 1 | 0;
      }
    } else {
      return acc | 0;
    }
    break;
  }
}
function MapTreeModule_size(x) {
  return MapTreeModule_sizeAux(0, x);
}
function MapTreeModule_mk(l, k, v, r) {
  let mn, mn_1;
  let hl;
  const m = l;
  if (m != null) {
    const m2 = value(m);
    hl = m2 instanceof MapTreeNode$2 ? (mn = m2, MapTreeNode$2__get_Height(mn)) : 1;
  } else {
    hl = 0;
  }
  let hr;
  const m_1 = r;
  if (m_1 != null) {
    const m2_1 = value(m_1);
    hr = m2_1 instanceof MapTreeNode$2 ? (mn_1 = m2_1, MapTreeNode$2__get_Height(mn_1)) : 1;
  } else {
    hr = 0;
  }
  const m_2 = (hl < hr ? hr : hl) | 0;
  if (m_2 === 0) {
    return MapTreeLeaf$2_$ctor_5BDDA1(k, v);
  } else {
    return MapTreeNode$2_$ctor_Z39DE9543(k, v, l, r, m_2 + 1);
  }
}
function MapTreeModule_rebalance(t1, k, v, t2) {
  let mn, mn_1, m_2, m2_2, mn_2, m_3, m2_3, mn_3;
  let t1h;
  const m = t1;
  if (m != null) {
    const m2 = value(m);
    t1h = m2 instanceof MapTreeNode$2 ? (mn = m2, MapTreeNode$2__get_Height(mn)) : 1;
  } else {
    t1h = 0;
  }
  let t2h;
  const m_1 = t2;
  if (m_1 != null) {
    const m2_1 = value(m_1);
    t2h = m2_1 instanceof MapTreeNode$2 ? (mn_1 = m2_1, MapTreeNode$2__get_Height(mn_1)) : 1;
  } else {
    t2h = 0;
  }
  if (t2h > t1h + 2) {
    const matchValue = value(t2);
    if (matchValue instanceof MapTreeNode$2) {
      const t2$0027 = matchValue;
      if ((m_2 = MapTreeNode$2__get_Left(t2$0027), m_2 != null ? (m2_2 = value(m_2), m2_2 instanceof MapTreeNode$2 ? (mn_2 = m2_2, MapTreeNode$2__get_Height(mn_2)) : 1) : 0) > t1h + 1) {
        const matchValue_1 = value(MapTreeNode$2__get_Left(t2$0027));
        if (matchValue_1 instanceof MapTreeNode$2) {
          const t2l = matchValue_1;
          return MapTreeModule_mk(MapTreeModule_mk(t1, k, v, MapTreeNode$2__get_Left(t2l)), MapTreeLeaf$2__get_Key(t2l), MapTreeLeaf$2__get_Value(t2l), MapTreeModule_mk(MapTreeNode$2__get_Right(t2l), MapTreeLeaf$2__get_Key(t2$0027), MapTreeLeaf$2__get_Value(t2$0027), MapTreeNode$2__get_Right(t2$0027)));
        } else {
          throw new Error("internal error: Map.rebalance");
        }
      } else {
        return MapTreeModule_mk(MapTreeModule_mk(t1, k, v, MapTreeNode$2__get_Left(t2$0027)), MapTreeLeaf$2__get_Key(t2$0027), MapTreeLeaf$2__get_Value(t2$0027), MapTreeNode$2__get_Right(t2$0027));
      }
    } else {
      throw new Error("internal error: Map.rebalance");
    }
  } else if (t1h > t2h + 2) {
    const matchValue_2 = value(t1);
    if (matchValue_2 instanceof MapTreeNode$2) {
      const t1$0027 = matchValue_2;
      if ((m_3 = MapTreeNode$2__get_Right(t1$0027), m_3 != null ? (m2_3 = value(m_3), m2_3 instanceof MapTreeNode$2 ? (mn_3 = m2_3, MapTreeNode$2__get_Height(mn_3)) : 1) : 0) > t2h + 1) {
        const matchValue_3 = value(MapTreeNode$2__get_Right(t1$0027));
        if (matchValue_3 instanceof MapTreeNode$2) {
          const t1r = matchValue_3;
          return MapTreeModule_mk(MapTreeModule_mk(MapTreeNode$2__get_Left(t1$0027), MapTreeLeaf$2__get_Key(t1$0027), MapTreeLeaf$2__get_Value(t1$0027), MapTreeNode$2__get_Left(t1r)), MapTreeLeaf$2__get_Key(t1r), MapTreeLeaf$2__get_Value(t1r), MapTreeModule_mk(MapTreeNode$2__get_Right(t1r), k, v, t2));
        } else {
          throw new Error("internal error: Map.rebalance");
        }
      } else {
        return MapTreeModule_mk(MapTreeNode$2__get_Left(t1$0027), MapTreeLeaf$2__get_Key(t1$0027), MapTreeLeaf$2__get_Value(t1$0027), MapTreeModule_mk(MapTreeNode$2__get_Right(t1$0027), k, v, t2));
      }
    } else {
      throw new Error("internal error: Map.rebalance");
    }
  } else {
    return MapTreeModule_mk(t1, k, v, t2);
  }
}
function MapTreeModule_add(comparer, k, v, m) {
  if (m != null) {
    const m2 = value(m);
    const c = comparer.Compare(k, MapTreeLeaf$2__get_Key(m2)) | 0;
    if (m2 instanceof MapTreeNode$2) {
      const mn = m2;
      if (c < 0) {
        return MapTreeModule_rebalance(MapTreeModule_add(comparer, k, v, MapTreeNode$2__get_Left(mn)), MapTreeLeaf$2__get_Key(mn), MapTreeLeaf$2__get_Value(mn), MapTreeNode$2__get_Right(mn));
      } else if (c === 0) {
        return MapTreeNode$2_$ctor_Z39DE9543(k, v, MapTreeNode$2__get_Left(mn), MapTreeNode$2__get_Right(mn), MapTreeNode$2__get_Height(mn));
      } else {
        return MapTreeModule_rebalance(MapTreeNode$2__get_Left(mn), MapTreeLeaf$2__get_Key(mn), MapTreeLeaf$2__get_Value(mn), MapTreeModule_add(comparer, k, v, MapTreeNode$2__get_Right(mn)));
      }
    } else if (c < 0) {
      return MapTreeNode$2_$ctor_Z39DE9543(k, v, MapTreeModule_empty(), m, 2);
    } else if (c === 0) {
      return MapTreeLeaf$2_$ctor_5BDDA1(k, v);
    } else {
      return MapTreeNode$2_$ctor_Z39DE9543(k, v, m, MapTreeModule_empty(), 2);
    }
  } else {
    return MapTreeLeaf$2_$ctor_5BDDA1(k, v);
  }
}
function MapTreeModule_tryFind(comparer_mut, k_mut, m_mut) {
  MapTreeModule_tryFind: while (true) {
    const comparer = comparer_mut, k = k_mut, m = m_mut;
    if (m != null) {
      const m2 = value(m);
      const c = comparer.Compare(k, MapTreeLeaf$2__get_Key(m2)) | 0;
      if (c === 0) {
        return some(MapTreeLeaf$2__get_Value(m2));
      } else if (m2 instanceof MapTreeNode$2) {
        const mn = m2;
        comparer_mut = comparer;
        k_mut = k;
        m_mut = c < 0 ? MapTreeNode$2__get_Left(mn) : MapTreeNode$2__get_Right(mn);
        continue MapTreeModule_tryFind;
      } else {
        return void 0;
      }
    } else {
      return void 0;
    }
    break;
  }
}
function MapTreeModule_find(comparer, k, m) {
  const matchValue = MapTreeModule_tryFind(comparer, k, m);
  if (matchValue == null) {
    throw new Error();
  } else {
    return value(matchValue);
  }
}
function MapTreeModule_mem(comparer_mut, k_mut, m_mut) {
  MapTreeModule_mem: while (true) {
    const comparer = comparer_mut, k = k_mut, m = m_mut;
    if (m != null) {
      const m2 = value(m);
      const c = comparer.Compare(k, MapTreeLeaf$2__get_Key(m2)) | 0;
      if (m2 instanceof MapTreeNode$2) {
        const mn = m2;
        if (c < 0) {
          comparer_mut = comparer;
          k_mut = k;
          m_mut = MapTreeNode$2__get_Left(mn);
          continue MapTreeModule_mem;
        } else if (c === 0) {
          return true;
        } else {
          comparer_mut = comparer;
          k_mut = k;
          m_mut = MapTreeNode$2__get_Right(mn);
          continue MapTreeModule_mem;
        }
      } else {
        return c === 0;
      }
    } else {
      return false;
    }
    break;
  }
}
function MapTreeModule_iterOpt(f_mut, m_mut) {
  MapTreeModule_iterOpt: while (true) {
    const f = f_mut, m = m_mut;
    if (m != null) {
      const m2 = value(m);
      if (m2 instanceof MapTreeNode$2) {
        const mn = m2;
        MapTreeModule_iterOpt(f, MapTreeNode$2__get_Left(mn));
        f(MapTreeLeaf$2__get_Key(mn), MapTreeLeaf$2__get_Value(mn));
        f_mut = f;
        m_mut = MapTreeNode$2__get_Right(mn);
        continue MapTreeModule_iterOpt;
      } else {
        f(MapTreeLeaf$2__get_Key(m2), MapTreeLeaf$2__get_Value(m2));
      }
    }
    break;
  }
}
function MapTreeModule_iter(f, m) {
  MapTreeModule_iterOpt(f, m);
}
function MapTreeModule_copyToArray(m, arr, i) {
  let j = i;
  MapTreeModule_iter((x, y) => {
    setItem(arr, j, [x, y]);
    j = j + 1 | 0;
  }, m);
}
var MapTreeModule_MapIterator$2 = class extends Record {
  constructor(stack, started) {
    super();
    this.stack = stack;
    this.started = started;
  }
};
function MapTreeModule_collapseLHS(stack_mut) {
  MapTreeModule_collapseLHS: while (true) {
    const stack = stack_mut;
    if (!isEmpty(stack)) {
      const rest = tail(stack);
      const m = head(stack);
      if (m != null) {
        const m2 = value(m);
        if (m2 instanceof MapTreeNode$2) {
          const mn = m2;
          stack_mut = ofArrayWithTail([MapTreeNode$2__get_Left(mn), MapTreeLeaf$2_$ctor_5BDDA1(MapTreeLeaf$2__get_Key(mn), MapTreeLeaf$2__get_Value(mn)), MapTreeNode$2__get_Right(mn)], rest);
          continue MapTreeModule_collapseLHS;
        } else {
          return stack;
        }
      } else {
        stack_mut = rest;
        continue MapTreeModule_collapseLHS;
      }
    } else {
      return empty();
    }
    break;
  }
}
function MapTreeModule_mkIterator(m) {
  return new MapTreeModule_MapIterator$2(MapTreeModule_collapseLHS(singleton(m)), false);
}
function MapTreeModule_notStarted() {
  throw new Error("enumeration not started");
}
function MapTreeModule_alreadyFinished() {
  throw new Error("enumeration already finished");
}
function MapTreeModule_current(i) {
  if (i.started) {
    const matchValue = i.stack;
    if (!isEmpty(matchValue)) {
      if (head(matchValue) != null) {
        const m = value(head(matchValue));
        if (m instanceof MapTreeNode$2) {
          throw new Error("Please report error: Map iterator, unexpected stack for current");
        } else {
          return [MapTreeLeaf$2__get_Key(m), MapTreeLeaf$2__get_Value(m)];
        }
      } else {
        throw new Error("Please report error: Map iterator, unexpected stack for current");
      }
    } else {
      return MapTreeModule_alreadyFinished();
    }
  } else {
    return MapTreeModule_notStarted();
  }
}
function MapTreeModule_moveNext(i) {
  if (i.started) {
    const matchValue = i.stack;
    if (!isEmpty(matchValue)) {
      if (head(matchValue) != null) {
        const m = value(head(matchValue));
        if (m instanceof MapTreeNode$2) {
          throw new Error("Please report error: Map iterator, unexpected stack for moveNext");
        } else {
          i.stack = MapTreeModule_collapseLHS(tail(matchValue));
          return !isEmpty(i.stack);
        }
      } else {
        throw new Error("Please report error: Map iterator, unexpected stack for moveNext");
      }
    } else {
      return false;
    }
  } else {
    i.started = true;
    return !isEmpty(i.stack);
  }
}
function MapTreeModule_mkIEnumerator(m) {
  let i = MapTreeModule_mkIterator(m);
  return {
    "System.Collections.Generic.IEnumerator`1.get_Current"() {
      return MapTreeModule_current(i);
    },
    "System.Collections.IEnumerator.get_Current"() {
      return MapTreeModule_current(i);
    },
    "System.Collections.IEnumerator.MoveNext"() {
      return MapTreeModule_moveNext(i);
    },
    "System.Collections.IEnumerator.Reset"() {
      i = MapTreeModule_mkIterator(m);
    },
    Dispose() {
    }
  };
}
var FSharpMap = class _FSharpMap {
  constructor(comparer, tree) {
    this.comparer = comparer;
    this.tree = tree;
  }
  GetHashCode() {
    const this$ = this;
    return FSharpMap__ComputeHashCode(this$) | 0;
  }
  Equals(that) {
    const this$ = this;
    if (that instanceof _FSharpMap) {
      const that_1 = that;
      const e1 = getEnumerator(this$);
      try {
        const e2 = getEnumerator(that_1);
        try {
          const loop = () => {
            const m1 = e1["System.Collections.IEnumerator.MoveNext"]();
            if (m1 === e2["System.Collections.IEnumerator.MoveNext"]()) {
              if (!m1) {
                return true;
              } else {
                const e1c = e1["System.Collections.Generic.IEnumerator`1.get_Current"]();
                const e2c = e2["System.Collections.Generic.IEnumerator`1.get_Current"]();
                if (equals(e1c[0], e2c[0]) && equals(e1c[1], e2c[1])) {
                  return loop();
                } else {
                  return false;
                }
              }
            } else {
              return false;
            }
          };
          return loop();
        } finally {
          disposeSafe(e2);
        }
      } finally {
        disposeSafe(e1);
      }
    } else {
      return false;
    }
  }
  toString() {
    const this$ = this;
    return "map [" + join("; ", map3((kv) => format("({0}, {1})", kv[0], kv[1]), this$)) + "]";
  }
  get [Symbol.toStringTag]() {
    return "FSharpMap";
  }
  toJSON() {
    const this$ = this;
    return Array.from(this$);
  }
  GetEnumerator() {
    const _ = this;
    return MapTreeModule_mkIEnumerator(_.tree);
  }
  [Symbol.iterator]() {
    return toIterator(getEnumerator(this));
  }
  "System.Collections.IEnumerable.GetEnumerator"() {
    const _ = this;
    return MapTreeModule_mkIEnumerator(_.tree);
  }
  CompareTo(obj) {
    const m = this;
    if (obj instanceof _FSharpMap) {
      const m2 = obj;
      return compareWith((kvp1, kvp2) => {
        const c = m.comparer.Compare(kvp1[0], kvp2[0]) | 0;
        return (c !== 0 ? c : compare2(kvp1[1], kvp2[1])) | 0;
      }, m, m2) | 0;
    } else {
      throw new Error("not comparable\\nParameter name: obj");
    }
  }
  "System.Collections.Generic.ICollection`1.Add2B595"(x) {
    throw new Error("Map cannot be mutated");
  }
  "System.Collections.Generic.ICollection`1.Clear"() {
    throw new Error("Map cannot be mutated");
  }
  "System.Collections.Generic.ICollection`1.Remove2B595"(x) {
    throw new Error("Map cannot be mutated");
  }
  "System.Collections.Generic.ICollection`1.Contains2B595"(x) {
    const m = this;
    return FSharpMap__ContainsKey(m, x[0]) && equals(FSharpMap__get_Item(m, x[0]), x[1]);
  }
  "System.Collections.Generic.ICollection`1.CopyToZ3B4C077E"(arr, i) {
    const m = this;
    MapTreeModule_copyToArray(m.tree, arr, i);
  }
  "System.Collections.Generic.ICollection`1.get_IsReadOnly"() {
    return true;
  }
  "System.Collections.Generic.ICollection`1.get_Count"() {
    const m = this;
    return FSharpMap__get_Count(m) | 0;
  }
  "System.Collections.Generic.IReadOnlyCollection`1.get_Count"() {
    const m = this;
    return FSharpMap__get_Count(m) | 0;
  }
  get size() {
    const m = this;
    return FSharpMap__get_Count(m) | 0;
  }
  clear() {
    throw new Error("Map cannot be mutated");
  }
  delete(_arg) {
    throw new Error("Map cannot be mutated");
    return false;
  }
  entries() {
    const m = this;
    return map3((p) => [p[0], p[1]], m);
  }
  get(k) {
    const m = this;
    return FSharpMap__get_Item(m, k);
  }
  has(k) {
    const m = this;
    return FSharpMap__ContainsKey(m, k);
  }
  keys() {
    const m = this;
    return map3((p) => p[0], m);
  }
  set(k, v) {
    const m = this;
    throw new Error("Map cannot be mutated");
    return m;
  }
  values() {
    const m = this;
    return map3((p) => p[1], m);
  }
  forEach(f, thisArg) {
    const m = this;
    iterate((p) => {
      f(p[1], p[0], m);
    }, m);
  }
};
function FSharpMap_$ctor(comparer, tree) {
  return new FSharpMap(comparer, tree);
}
function FSharpMap_Empty(comparer) {
  return FSharpMap_$ctor(comparer, MapTreeModule_empty());
}
function FSharpMap__Add(m, key, value2) {
  return FSharpMap_$ctor(m.comparer, MapTreeModule_add(m.comparer, key, value2, m.tree));
}
function FSharpMap__get_Item(m, key) {
  return MapTreeModule_find(m.comparer, key, m.tree);
}
function FSharpMap__get_Count(m) {
  return MapTreeModule_size(m.tree);
}
function FSharpMap__ContainsKey(m, key) {
  return MapTreeModule_mem(m.comparer, key, m.tree);
}
function FSharpMap__ComputeHashCode(this$) {
  const combineHash = (x, y) => (x << 1) + y + 631;
  let res = 0;
  const enumerator = getEnumerator(this$);
  try {
    while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
      const activePatternResult = enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]();
      res = combineHash(res, structuralHash(activePatternResult[0])) | 0;
      res = combineHash(res, structuralHash(activePatternResult[1])) | 0;
    }
  } finally {
    disposeSafe(enumerator);
  }
  return res | 0;
}
function add(key, value2, table) {
  return FSharpMap__Add(table, key, value2);
}
function find(key, table) {
  return FSharpMap__get_Item(table, key);
}
function empty2(comparer) {
  return FSharpMap_Empty(comparer);
}

// interpreter-closures-semantics.fs.js
var valueC = class extends Union {
  constructor(tag, fields) {
    super();
    this.tag = tag;
    this.fields = fields;
  }
  cases() {
    return ["Clos", "Boo"];
  }
};
function evalC(env_mut, e_mut) {
  evalC:
    while (true) {
      const env = env_mut, e = e_mut;
      switch (e.tag) {
        case 3:
          return new valueC(1, [e.fields[0]]);
        case 1:
          return new valueC(0, [[e.fields[0][0], e.fields[0][2], env]]);
        case 2: {
          const matchValue = evalC(env, e.fields[0][0]);
          if (matchValue.tag === 0) {
            env_mut = add(matchValue.fields[0][0], e.fields[0][1], matchValue.fields[0][2]);
            e_mut = matchValue.fields[0][1];
            continue evalC;
          } else {
            throw new Error("Match failure");
          }
        }
        case 4: {
          const matchValue_1 = evalC(env, e.fields[0][0]);
          let matchResult;
          if (matchValue_1.tag === 1) {
            if (matchValue_1.fields[0]) {
              matchResult = 0;
            } else {
              matchResult = 1;
            }
          } else {
            matchResult = 1;
          }
          switch (matchResult) {
            case 0: {
              env_mut = env;
              e_mut = e.fields[0][1];
              continue evalC;
            }
            default: {
              env_mut = env;
              e_mut = e.fields[0][2];
              continue evalC;
            }
          }
        }
        default: {
          env_mut = env;
          e_mut = find(e.fields[0], env);
          continue evalC;
        }
      }
      break;
    }
}

// interpreters-verification-of-equality-fixed.fs.js
function verifyEquality(valueC2, valueS) {
  const verifyEqualityInner = (eC_mut, eS_mut) => {
    verifyEqualityInner:
      while (true) {
        const eC = eC_mut, eS = eS_mut;
        let matchResult, l1, l2, e1_1, e2_1, i1_1, i2_1, eC$0027, eC$0027$0027, eS$0027, eS$0027$0027, eCCond, eCElse, eCThen, eSCond, eSElse, eSThen;
        switch (eC.tag) {
          case 0: {
            if (eS.tag === 0) {
              matchResult = 1;
              l1 = eC.fields[0];
              l2 = eS.fields[0];
            } else {
              matchResult = 5;
            }
            break;
          }
          case 1: {
            if (eS.tag === 1) {
              if (eC.fields[0][0] === eS.fields[0][0]) {
                matchResult = 2;
                e1_1 = eC.fields[0][2];
                e2_1 = eS.fields[0][2];
                i1_1 = eC.fields[0][0];
                i2_1 = eS.fields[0][0];
              } else {
                matchResult = 5;
              }
            } else {
              matchResult = 5;
            }
            break;
          }
          case 2: {
            if (eS.tag === 2) {
              matchResult = 3;
              eC$0027 = eC.fields[0][0];
              eC$0027$0027 = eC.fields[0][1];
              eS$0027 = eS.fields[0][0];
              eS$0027$0027 = eS.fields[0][1];
            } else {
              matchResult = 5;
            }
            break;
          }
          case 4: {
            if (eS.tag === 4) {
              matchResult = 4;
              eCCond = eC.fields[0][0];
              eCElse = eC.fields[0][2];
              eCThen = eC.fields[0][1];
              eSCond = eS.fields[0][0];
              eSElse = eS.fields[0][2];
              eSThen = eS.fields[0][1];
            } else {
              matchResult = 5;
            }
            break;
          }
          default:
            if (eS.tag === 3) {
              matchResult = 0;
            } else {
              matchResult = 5;
            }
        }
        switch (matchResult) {
          case 0:
            return true;
          case 1:
            return l1 === l2;
          case 2: {
            eC_mut = e1_1;
            eS_mut = e2_1;
            continue verifyEqualityInner;
          }
          case 3:
            if (verifyEqualityInner(eC$0027, eS$0027)) {
              eC_mut = eC$0027$0027;
              eS_mut = eS$0027$0027;
              continue verifyEqualityInner;
            } else {
              return false;
            }
          case 4:
            if (verifyEqualityInner(eCCond, eSCond) && verifyEqualityInner(eCThen, eSThen)) {
              eC_mut = eCElse;
              eS_mut = eSElse;
              continue verifyEqualityInner;
            } else {
              return false;
            }
          default:
            throw new Error("Match failure: Ombra.Interpreter.Types.exp");
        }
        break;
      }
  };
  let matchResult_1, bC, bS, eC_1, eS_1, idC, idS;
  if (valueC2.tag === 0) {
    if (valueS.tag === 1) {
      matchResult_1 = 1;
      eC_1 = valueC2.fields[0][1];
      eS_1 = valueS.fields[0][2];
      idC = valueC2.fields[0][0];
      idS = valueS.fields[0][0];
    } else {
      matchResult_1 = 2;
    }
  } else if (valueS.tag === 3) {
    matchResult_1 = 0;
    bC = valueC2.fields[0];
    bS = valueS.fields[0];
  } else {
    matchResult_1 = 2;
  }
  switch (matchResult_1) {
    case 0:
      return bC === bS;
    case 1: {
      let matchResult_2, x, y;
      if (eC_1.tag === 0) {
        if (eS_1.tag === 0) {
          matchResult_2 = 0;
          x = eC_1.fields[0];
          y = eS_1.fields[0];
        } else {
          matchResult_2 = 1;
        }
      } else {
        matchResult_2 = 1;
      }
      switch (matchResult_2) {
        case 0:
          if (x === y) {
            return idC === idS;
          } else {
            return false;
          }
        default:
          if (idC === idS) {
            return verifyEqualityInner(eC_1, eS_1);
          } else {
            return false;
          }
      }
    }
    default:
      throw new Error("Match failure: Ombra.Interpreter.Closures.valueC");
  }
}
function toCode(ast, indentation) {
  const ind = () => replicate(indentation, "  ");
  const handleApp = (e) => {
    if (e[1].tag === 3) {
      return format("{0}({1})({2})", ind(), toCode(e[0], 0), toString(e[1].fields[0]));
    } else if (e[0].tag === 3) {
      return format("({0})({1})", toString(e[0].fields[0]), toCode(e[1], 0));
    } else {
      return format("({0})({1})", toCode(e[0], indentation), toCode(e[1], indentation));
    }
  };
  switch (ast.tag) {
    case 0:
      return format("{0}{1}", ind(), ast.fields[0]);
    case 4: {
      const tupledArg = ast.fields[0];
      const eCond = tupledArg[0];
      let rCond;
      switch (eCond.tag) {
        case 3: {
          rCond = format("{0}", toString(eCond.fields[0]));
          break;
        }
        case 0: {
          rCond = format("{0}", eCond.fields[0]);
          break;
        }
        default:
          throw new Error("Match failure: Ombra.Interpreter.Types.exp");
      }
      const rThen = toCode(tupledArg[1], indentation + 1);
      const rElse = toCode(tupledArg[2], indentation + 1);
      return format("{0}if {1}\n{2}\n{3}else\n{4}", ind(), rCond, rThen, ind(), rElse);
    }
    case 1: {
      const tupledArg_1 = ast.fields[0];
      const ident = tupledArg_1[0];
      const e_3 = tupledArg_1[2];
      switch (e_3.tag) {
        case 3:
          return format("fun {0} {1}", ident, toCode(e_3, indentation));
        case 4:
          return format("fun {0} \n{1}", ident, toCode(e_3, indentation + 1));
        case 2:
          return handleApp(e_3.fields[0]);
        default:
          throw new Error("Match failure: Ombra.Interpreter.Types.exp");
      }
    }
    case 2:
      return handleApp(ast.fields[0]);
    default:
      return format("{0}{1}", ind(), toString(ast.fields[0]));
  }
}
var ast0 = new exp(2, [[new exp(1, [["c", new ty(0, []), new exp(4, [[new exp(3, [false]), new exp(3, [false]), new exp(3, [true])]])]]), new exp(3, [true])]]);
var ast1 = new exp(4, [[new exp(3, [true]), new exp(2, [[new exp(1, [["m", new ty(0, []), new exp(3, [false])]]), new exp(3, [false])]]), new exp(3, [true])]]);
var ast2 = new exp(1, [["z", new ty(1, [new ty(0, []), new ty(1, [new ty(0, []), new ty(1, [new ty(0, []), new ty(0, [])])])]), new exp(4, [[new exp(3, [true]), new exp(3, [true]), new exp(3, [true])]])]]);
var ast3 = new exp(1, [["v", new ty(1, [new ty(1, [new ty(0, []), new ty(1, [new ty(0, []), new ty(1, [new ty(1, [new ty(0, []), new ty(0, [])]), new ty(0, [])])])]), new ty(0, [])]), new exp(4, [[new exp(3, [true]), new exp(2, [[new exp(1, [["U", new ty(0, []), new exp(3, [true])]]), new exp(3, [true])]]), new exp(2, [[new exp(1, [["G", new ty(0, []), new exp(3, [false])]]), new exp(3, [false])]])]])]]);
function shuffleG(xs) {
  return sortBy((_arg) => newGuid(), xs, {
    Compare: comparePrimitives
  });
}
function verify() {
  let arg_3;
  const ast = head2(shuffleG([ast0, ast1, ast2, ast3]));
  const resS = evalS(ast);
  const resC = evalC(empty2({
    Compare: comparePrimitives
  }), ast);
  return ofArray([toText(printf("%A"))(ast), toText(printf("%A"))(resS), toText(printf("%A"))(resC), (arg_3 = verifyEquality(resC, resS), toText(printf("%A"))(arg_3)), toCode(ast, 0)]);
}
export {
  ast0,
  ast1,
  ast2,
  ast3,
  shuffleG,
  toCode,
  verify,
  verifyEquality
};
