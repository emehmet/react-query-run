"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = useMediaQuery;

var _react = _interopRequireDefault(require("react"));

// @ts-nocheck
function useMediaQuery(query) {
  // Keep track of the preference in state, start with the current match
  var _React$useState = _react.default.useState(function () {
    if (typeof window !== 'undefined') {
      return window.matchMedia && window.matchMedia(query).matches;
    }
  }),
      isMatch = _React$useState[0],
      setIsMatch = _React$useState[1]; // Watch for changes


  _react.default.useEffect(function () {
    if (typeof window !== 'undefined') {
      if (!window.matchMedia) {
        return;
      } // Create a matcher


      var matcher = window.matchMedia(query); // Create our handler

      var onChange = function onChange(_ref) {
        var matches = _ref.matches;
        return setIsMatch(matches);
      }; // Listen for changes


      matcher.addListener(onChange);
      return function () {
        // Stop listening for changes
        matcher.removeListener(onChange);
      };
    }
  }, [isMatch, query, setIsMatch]);

  return isMatch;
}