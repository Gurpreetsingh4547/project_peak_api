/**
 * @param  {[any]} obj
 * @return {[bool]}
 */
export const IsObject = (obj) => {
  if (typeof obj != "undefined" && typeof obj == "object" && obj != null) {
    return true;
  }

  return false;
};

/**
 * [getObject]
 * @param  {[object]} object
 * @param  {[bool]} secondTime
 *
 */
export const GetObject = (object) => {
  if (IsObject(object)) {
    return object;
  }

  if (!HaveValue(object)) {
    return {};
  }

  return {};
};

/**
 * @param  {[any]} obj
 * @return {[bool]}
 */
export const IsObjectHaveValue = (obj) => {
  if (typeof obj == "object" && obj != null && Object.keys(obj).length > 0) {
    return true;
  }

  return false;
};

/**
 * @param  {[number, string]} opt1
 * @param  {[number, string]} opt2
 * @return {[bool]}
 */
export const IsEqual = (opt1, opt2) => {
  return opt1 == opt2;
};

/**
 * @param  {[bool]} bool
 * @param  {[bool]} returnNumeric
 * @return {[bool]}
 */
export const IsTrue = (bool, returnNumeric) => {
  if (bool == true || bool == "true" || bool == 1 || bool == "1") {
    return returnNumeric == true ? 1 : true;
  }

  return returnNumeric == true ? 0 : false;
};

/**
 * @param  {[agr]} any
 * @return {[bool]}
 */
export const IsString = (agr) => {
  if (typeof agr === "string") {
    return true;
  }

  return false;
};

/**
 * [description]
 * @param  {[any]}  text
 * @param  {[bool]} nullOption
 * @return {[bool]}
 */
export const HaveValue = (text, nullOption, noneOption) => {
  if (typeof text == "undefined") {
    return false;
  }

  if (IsTrue(nullOption) && (text == "null" || text == null)) {
    return false;
  }

  if (IsTrue(noneOption) && text.toLowerCase() === "none") {
    return false;
  }

  if (text === "0" || text === 0) {
    return true;
  }

  if (text != "" && text != null) {
    return true;
  }

  return false;
};

/**
 * [description]
 * @param  {[string]} email
 * @return {[bool]}
 */
export const IsValidEmail = (email) => {
  if (!HaveValue(email)) {
    return false;
  }

  email = email.toString();

  let re = /\S+@\S+\.\S+/;
  return re.test(email);
};

/**
 * @param  {[object]} obj
 * @return {[copy of object]}
 */
export const MakeCopy = (obj) => {
  if (!IsObject(obj)) {
    return {};
  }

  // return Object.assign({}, obj);
  return { ...obj };
};

/**
 * @param  {[object]} obj
 * @return {[copy of object]}
 */
export const FloatVal = (val) => {
  if (!HaveValue(val)) {
    return 0.0;
  }

  return isNaN(parseFloat(val)) ? 0.0 : parseFloat(val);
};

/**
 * @param  {[array]} arr
 * @return {[bool]}
 */
export const IsArray = (arr) => {
  if (typeof arr != "undefined" && arr != null && Array.isArray(arr)) {
    return true;
  }

  return false;
};

/**
 * [copy array]
 *
 */
export const CopyArray = (arr) => {
  if (!IsArray(arr)) return [];

  return JSON.parse(JSON.stringify([...arr]));
};

/**
 * [ArrayHaveValues]
 * @param  {[array]} arr
 * @return {[bool]}
 */
export const ArrayHaveValues = (arr) => {
  if (IsArray(arr) && arr.length > 0) {
    return true;
  }

  return false;
};

/**
 * [HasStringText]
 * @param  {[string]} string
 * @param  {[string]} text
 * @return {[bool]}
 */
export const HasStringText = (string, text) => {
  if (string.toLowerCase().indexOf(text.toLowerCase()) > -1) {
    return true;
  }

  return false;
};
export const GetString = (str) => {
  if (HaveValue(str) && !IsObject(str) && !IsArray(str)) {
    return str.toString();
  }

  return "";
};

export const Int = (val) => {
  return parseInt(val);
};

export const HaveArrayID = (arr, id) => {
  if (!ArrayHaveValues(arr)) {
    return false;
  }

  if (!HaveValue(id)) {
    return false;
  }

  if (
    arr.indexOf(id) > -1 ||
    arr.indexOf(GetString(id)) > -1 ||
    arr.indexOf(Int(id)) > -1
  ) {
    return true;
  }
  return false;
};

export const GetArray = (arr) => {
  if (ArrayHaveValues(arr)) {
    return arr;
  }

  return [];
};

/**
 * [Return list of keys]
 * @param  {[array]} arr
 * @return {[array]}
 */
export const GetSelectedList = (arr, keyToReturn, keySelected) => {
  if (
    typeof arr != "undefined" &&
    arr != null &&
    Array.isArray(arr) &&
    arr.length > 0
  ) {
    let ids = arr.map((obj) => {
      if (IsTrue(obj[keySelected])) {
        return obj[keyToReturn];
      }
    });

    return ids;
  }

  return [];
};

export const WebAppUrl = () => {
  if (!/^www./.test(window.location.hostname)) {
    return (
      window.location.protocol + "//www." + window.location.hostname + "/app"
    );
  }

  // return 'http://localhost/jp/jp_web_api/public';
  // return window.location.origin;  // local
  return window.location.origin + "/app"; // Live & Staging
};

export const GetArrayElementValues = (list, key) => {
  if (!IsArray(list) || !HaveValue(key)) {
    return [];
  }
  let keyValues = [];

  list.map((item) => {
    if (HaveValue(item[key])) {
      keyValues.push(item[key]);
    }
  });
  return keyValues;
};

export const IsSameId = (id1, id2) => {
  if (!HaveValue(id1) && !HaveValue(id2)) {
    return false;
  }

  if (parseInt(id1) == parseInt(id2)) {
    return true;
  }

  return false;
};

export const GetListIds = (list, key = "id") => {
  if (!ArrayHaveValues(list)) {
    return [];
  }
  let ids = list.map((list) => Int(list[key]));

  return ids;
};

/**
 * @param  {Function} functionToCheck
 * @return {boolean}
 */
export const IsFunction = (functionToCheck) => {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === "[object Function]"
  );
};

export const IsUndefined = (what) => {
  return what === void 0;
};

export const IsDefined = (value) => {
  // Better way to check if a variable is defined or not
  return typeof value !== "undefined";
};

export const FromJson = (json) => {
  return IsString(json) ? JSON.parse(json) : json;
};

export const HaveNumValue = (num) => {
  if (IsDefined(num) && num != null && !isNaN(num) && Int(num) > 0) {
    return true;
  }

  return false;
};

/**
 * [GetLabel]
 * @param  {[strung]}  key
 * @param  {Boolean} isProject
 * @return {[string]}
 */
export const GetLabel = (key, isProject) => {
  const label = {
    JE: "Job Rep / Estimator",
  };

  if (!HaveValue(key)) {
    return "";
  }

  if (!HaveValue(label[key])) {
    return key;
  }

  if (IsTrue(isProject)) {
    return label[key].replace("Job", "Project ");
  }

  return label[key];
};
export const getQueryParamsArray = (arr) => {
  if (!IsDefined(arr) || arr == null) {
    return [];
  }

  if (!IsArray(arr) && HaveValue(arr)) {
    arr = [arr];
  }
  return arr;
};

export const getFiltersFromTwoArrayById = (arr1, arr2) => {
  if (!ArrayHaveValues(arr1) || !ArrayHaveValues(arr2)) return [];

  let arr = arr1.filter(
    (val) => arr2.includes(GetString(val.id)) || arr2.includes(val.id)
  );

  return arr;
};

export const getFiltersFromTwoArrayWithoutId = (arr1, arr2) => {
  if (!ArrayHaveValues(arr1) || !ArrayHaveValues(arr2)) return [];

  let arr = arr1.filter((val) => arr2.includes(val));

  return arr;
};

/**
 * [Swap Array Index Value]
 * @param {Array} arr
 * @param {Number} from
 * @param {Number} to
 */
export const SwapArrayIndexValue = (arr, from, to) => {
  arr.splice(from, 1, arr.splice(to, 1, arr[from])[0]);
};

/**
 * [Move Array Index Value]
 * @param {*} arr
 * @param {*} from
 * @param {*} to
 */
export const MoveArrayIndexValue = (arr, from, to) => {
  arr.splice(to, 0, arr.splice(from, 1)[0]);
};

/**
 * [is Id check]
 */
export const IsId = (id) => {
  if (!HaveValue(id)) {
    return false;
  }

  if (parseInt(id) > 0) {
    return true;
  }

  return false;
};
/**
 * Get Only Numeric Value
 * @param {*} value
 */
export const NumericValue = (value) => {
  return value.replace(/\D/g, "");
};

/**
 * [Object Have Key]
 * @param {*} obj
 * @param {*} propertyName
 */
export const ObjectHaveKey = (obj, propertyName) => {
  if (!IsObject(obj) || !HaveValue(propertyName)) {
    return false;
  }
  return Object.prototype.hasOwnProperty.call(obj, propertyName);
};

export const ArraySortByKey = (items, key) => {
  items.sort((a, b) => {
    let keyA = a[key].toUpperCase(); // ignore upper and lowercase
    let keyB = b[key].toUpperCase(); // ignore upper and lowercase

    if (keyA < keyB) return -1;

    if (keyA > keyB) return 1;

    return 0;
  });
};
