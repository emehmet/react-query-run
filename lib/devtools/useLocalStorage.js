"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = useLocalStorage;

var _react = _interopRequireDefault(require("react"));

// @ts-nocheck
var getItem = function getItem(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (_unused) {
    return undefined;
  }
};

function useLocalStorage(key, defaultValue) {
  var _React$useState = _react.default.useState(),
      value = _React$useState[0],
      setValue = _React$useState[1];

  _react.default.useEffect(function () {
    var initialValue = getItem(key);

    if (typeof initialValue === 'undefined' || initialValue === null) {
      setValue(typeof defaultValue === 'function' ? defaultValue() : defaultValue);
    } else {
      setValue(initialValue);
    }
  }, [defaultValue, key]);

  var setter = _react.default.useCallback(function (updater) {
    setValue(function (old) {
      var newVal = updater;

      if (typeof updater == 'function') {
        newVal = updater(old);
      }

      try {
        localStorage.setItem(key, JSON.stringify(newVal));
      } catch (_unused2) {}

      return newVal;
    });
  }, [key]);

  return [value, setter];
}