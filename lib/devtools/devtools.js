"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ReactQueryDevtools = ReactQueryDevtools;
exports.ReactQueryDevtoolsPanel = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _react = _interopRequireDefault(require("react"));

var _reactQuery = require("react-query");

var _matchSorter = require("match-sorter");

var _useLocalStorage7 = _interopRequireDefault(require("./useLocalStorage"));

var _utils = require("./utils");

var _styledComponents = require("./styledComponents");

var _theme = require("./theme");

var _Explorer = _interopRequireDefault(require("./Explorer"));

var _Logo = _interopRequireDefault(require("./Logo"));

var _utils2 = require("../core/utils");

// @ts-nocheck
var isServer = typeof window === 'undefined';

function ReactQueryDevtools(_ref) {
  var initialIsOpen = _ref.initialIsOpen,
      _ref$panelProps = _ref.panelProps,
      panelProps = _ref$panelProps === void 0 ? {} : _ref$panelProps,
      _ref$closeButtonProps = _ref.closeButtonProps,
      closeButtonProps = _ref$closeButtonProps === void 0 ? {} : _ref$closeButtonProps,
      _ref$toggleButtonProp = _ref.toggleButtonProps,
      toggleButtonProps = _ref$toggleButtonProp === void 0 ? {} : _ref$toggleButtonProp,
      _ref$position = _ref.position,
      position = _ref$position === void 0 ? 'bottom-left' : _ref$position,
      _ref$containerElement = _ref.containerElement,
      Container = _ref$containerElement === void 0 ? 'footer' : _ref$containerElement;

  var rootRef = _react.default.useRef();

  var panelRef = _react.default.useRef();

  var _useLocalStorage = (0, _useLocalStorage7.default)('reactQueryDevtoolsOpen', initialIsOpen),
      isOpen = _useLocalStorage[0],
      setIsOpen = _useLocalStorage[1];

  var _useLocalStorage2 = (0, _useLocalStorage7.default)('reactQueryDevtoolsHeight', null),
      devtoolsHeight = _useLocalStorage2[0],
      setDevtoolsHeight = _useLocalStorage2[1];

  var _useSafeState = (0, _utils.useSafeState)(false),
      isResolvedOpen = _useSafeState[0],
      setIsResolvedOpen = _useSafeState[1];

  var _useSafeState2 = (0, _utils.useSafeState)(false),
      isResizing = _useSafeState2[0],
      setIsResizing = _useSafeState2[1];

  var _handleDragStart = function handleDragStart(panelElement, startEvent) {
    if (startEvent.button !== 0) return; // Only allow left click for drag

    setIsResizing(true);
    var dragInfo = {
      originalHeight: panelElement.getBoundingClientRect().height,
      pageY: startEvent.pageY
    };

    var run = function run(moveEvent) {
      var delta = dragInfo.pageY - moveEvent.pageY;
      var newHeight = dragInfo.originalHeight + delta;
      setDevtoolsHeight(newHeight);

      if (newHeight < 70) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    var unsub = function unsub() {
      setIsResizing(false);
      document.removeEventListener('mousemove', run);
      document.removeEventListener('mouseUp', unsub);
    };

    document.addEventListener('mousemove', run);
    document.addEventListener('mouseup', unsub);
  };

  _react.default.useEffect(function () {
    setIsResolvedOpen(isOpen);
  }, [isOpen, isResolvedOpen, setIsResolvedOpen]); // Toggle panel visibility before/after transition (depending on direction).
  // Prevents focusing in a closed panel.


  _react.default.useEffect(function () {
    var ref = panelRef.current;

    if (ref) {
      function handlePanelTransitionStart() {
        if (ref && isResolvedOpen) {
          ref.style.visibility = 'visible';
        }
      }

      function handlePanelTransitionEnd() {
        if (ref && !isResolvedOpen) {
          ref.style.visibility = 'hidden';
        }
      }

      ref.addEventListener('transitionstart', handlePanelTransitionStart);
      ref.addEventListener('transitionend', handlePanelTransitionEnd);
      return function () {
        ref.removeEventListener('transitionstart', handlePanelTransitionStart);
        ref.removeEventListener('transitionend', handlePanelTransitionEnd);
      };
    }
  }, [isResolvedOpen]);

  _react.default[isServer ? 'useEffect' : 'useLayoutEffect'](function () {
    if (isResolvedOpen) {
      var _rootRef$current;

      var previousValue = (_rootRef$current = rootRef.current) == null ? void 0 : _rootRef$current.parentElement.style.paddingBottom;

      var run = function run() {
        var _panelRef$current;

        var containerHeight = (_panelRef$current = panelRef.current) == null ? void 0 : _panelRef$current.getBoundingClientRect().height;
        rootRef.current.parentElement.style.paddingBottom = containerHeight + "px";
      };

      run();

      if (typeof window !== 'undefined') {
        window.addEventListener('resize', run);
        return function () {
          window.removeEventListener('resize', run);
          rootRef.current.parentElement.style.paddingBottom = previousValue;
        };
      }
    }
  }, [isResolvedOpen]);

  var _panelProps$style = panelProps.style,
      panelStyle = _panelProps$style === void 0 ? {} : _panelProps$style,
      otherPanelProps = (0, _objectWithoutPropertiesLoose2.default)(panelProps, ["style"]);
  var _closeButtonProps$sty = closeButtonProps.style,
      closeButtonStyle = _closeButtonProps$sty === void 0 ? {} : _closeButtonProps$sty,
      onCloseClick = closeButtonProps.onClick,
      otherCloseButtonProps = (0, _objectWithoutPropertiesLoose2.default)(closeButtonProps, ["style", "onClick"]);
  var _toggleButtonProps$st = toggleButtonProps.style,
      toggleButtonStyle = _toggleButtonProps$st === void 0 ? {} : _toggleButtonProps$st,
      onToggleClick = toggleButtonProps.onClick,
      otherToggleButtonProps = (0, _objectWithoutPropertiesLoose2.default)(toggleButtonProps, ["style", "onClick"]);
  return /*#__PURE__*/_react.default.createElement(Container, {
    ref: rootRef,
    className: "ReactQueryDevtools"
  }, /*#__PURE__*/_react.default.createElement(_theme.ThemeProvider, {
    theme: _theme.defaultTheme
  }, /*#__PURE__*/_react.default.createElement(ReactQueryDevtoolsPanel, (0, _extends2.default)({
    ref: panelRef
  }, otherPanelProps, {
    style: (0, _extends2.default)({
      position: 'fixed',
      bottom: '0',
      right: '0',
      zIndex: '99999',
      width: '100%',
      height: devtoolsHeight != null ? devtoolsHeight : 500,
      maxHeight: '90%',
      boxShadow: '0 0 20px rgba(0,0,0,.3)',
      borderTop: "1px solid " + _theme.defaultTheme.gray,
      transformOrigin: 'top',
      // visibility will be toggled after transitions, but set initial state here
      visibility: isOpen ? 'visible' : 'hidden'
    }, panelStyle, isResizing ? {
      transition: "none"
    } : {
      transition: "all .2s ease"
    }, isResolvedOpen ? {
      opacity: 1,
      pointerEvents: 'all',
      transform: "translateY(0) scale(1)"
    } : {
      opacity: 0,
      pointerEvents: 'none',
      transform: "translateY(15px) scale(1.02)"
    }),
    isOpen: isResolvedOpen,
    setIsOpen: setIsOpen,
    handleDragStart: function handleDragStart(e) {
      return _handleDragStart(panelRef.current, e);
    }
  })), isResolvedOpen ? /*#__PURE__*/_react.default.createElement(_styledComponents.Button, (0, _extends2.default)({
    type: "button",
    "aria-label": "Close React Query Devtools"
  }, otherCloseButtonProps, {
    onClick: function onClick() {
      setIsOpen(false);
      onCloseClick && onCloseClick();
    },
    style: (0, _extends2.default)({
      position: 'fixed',
      zIndex: '99999',
      margin: '.5rem',
      bottom: 0
    }, position === 'top-right' ? {
      right: '0'
    } : position === 'top-left' ? {
      left: '0'
    } : position === 'bottom-right' ? {
      right: '0'
    } : {
      left: '0'
    }, closeButtonStyle)
  }), "Close") : null), !isResolvedOpen ? /*#__PURE__*/_react.default.createElement("button", (0, _extends2.default)({
    type: "button"
  }, otherToggleButtonProps, {
    "aria-label": "Open React Query Devtools",
    onClick: function onClick() {
      setIsOpen(true);
      onToggleClick && onToggleClick();
    },
    style: (0, _extends2.default)({
      background: 'none',
      border: 0,
      padding: 0,
      position: 'fixed',
      zIndex: '99999',
      display: 'inline-flex',
      fontSize: '1.5rem',
      margin: '.5rem',
      cursor: 'pointer',
      width: 'fit-content'
    }, position === 'top-right' ? {
      top: '0',
      right: '0'
    } : position === 'top-left' ? {
      top: '0',
      left: '0'
    } : position === 'bottom-right' ? {
      bottom: '0',
      right: '0'
    } : {
      bottom: '0',
      left: '0'
    }, toggleButtonStyle)
  }), /*#__PURE__*/_react.default.createElement(_Logo.default, {
    "aria-hidden": true
  })) : null);
}

var getStatusRank = function getStatusRank(q) {
  return q.state.isFetching ? 0 : !q.getObserversCount() ? 3 : q.isStale() ? 2 : 1;
};

var sortFns = {
  'Status > Last Updated': function StatusLastUpdated(a, b) {
    return getStatusRank(a) === getStatusRank(b) ? sortFns['Last Updated'](a, b) : getStatusRank(a) > getStatusRank(b) ? 1 : -1;
  },
  'Query Hash': function QueryHash(a, b) {
    return a.queryHash > b.queryHash ? 1 : -1;
  },
  'Last Updated': function LastUpdated(a, b) {
    return a.state.dataUpdatedAt < b.state.dataUpdatedAt ? 1 : -1;
  }
};

var ReactQueryDevtoolsPanel = /*#__PURE__*/_react.default.forwardRef(function ReactQueryDevtoolsPanel(props, ref) {
  var _activeQuery$state;

  var isOpen = props.isOpen,
      setIsOpen = props.setIsOpen,
      handleDragStart = props.handleDragStart,
      panelProps = (0, _objectWithoutPropertiesLoose2.default)(props, ["isOpen", "setIsOpen", "handleDragStart"]);
  var queryClient = (0, _reactQuery.useQueryClient)();
  var queryCache = queryClient.getQueryCache();

  var _useLocalStorage3 = (0, _useLocalStorage7.default)('reactQueryDevtoolsSortFn', Object.keys(sortFns)[0]),
      sort = _useLocalStorage3[0],
      setSort = _useLocalStorage3[1];

  var _useLocalStorage4 = (0, _useLocalStorage7.default)('reactQueryDevtoolsFilter', ''),
      filter = _useLocalStorage4[0],
      setFilter = _useLocalStorage4[1];

  var _useLocalStorage5 = (0, _useLocalStorage7.default)('reactQueryDevtoolsSortDesc', false),
      sortDesc = _useLocalStorage5[0],
      setSortDesc = _useLocalStorage5[1];

  var sortFn = _react.default.useMemo(function () {
    return sortFns[sort];
  }, [sort]);

  _react.default[isServer ? 'useEffect' : 'useLayoutEffect'](function () {
    if (!sortFn) {
      setSort(Object.keys(sortFns)[0]);
    }
  }, [setSort, sortFn]);

  var _useSafeState3 = (0, _utils.useSafeState)(Object.values(queryCache.findAll())),
      unsortedQueries = _useSafeState3[0],
      setUnsortedQueries = _useSafeState3[1];

  var _useLocalStorage6 = (0, _useLocalStorage7.default)('reactQueryDevtoolsActiveQueryHash', ''),
      activeQueryHash = _useLocalStorage6[0],
      setActiveQueryHash = _useLocalStorage6[1];

  var queries = _react.default.useMemo(function () {
    var sorted = [].concat(unsortedQueries).sort(sortFn);

    if (sortDesc) {
      sorted.reverse();
    }

    if (!filter) {
      return sorted;
    }

    return (0, _matchSorter.matchSorter)(sorted, filter, {
      keys: ['queryHash']
    }).filter(function (d) {
      return d.queryHash;
    });
  }, [sortDesc, sortFn, unsortedQueries, filter]);

  var activeQuery = _react.default.useMemo(function () {
    return queries.find(function (query) {
      return query.queryHash === activeQueryHash;
    });
  }, [activeQueryHash, queries]);

  var hasFresh = queries.filter(function (q) {
    return (0, _utils.getQueryStatusLabel)(q) === 'fresh';
  }).length;
  var hasFetching = queries.filter(function (q) {
    return (0, _utils.getQueryStatusLabel)(q) === 'fetching';
  }).length;
  var hasStale = queries.filter(function (q) {
    return (0, _utils.getQueryStatusLabel)(q) === 'stale';
  }).length;
  var hasInactive = queries.filter(function (q) {
    return (0, _utils.getQueryStatusLabel)(q) === 'inactive';
  }).length;

  _react.default.useEffect(function () {
    if (isOpen) {
      var unsubscribe = queryCache.subscribe(function () {
        setUnsortedQueries(Object.values(queryCache.getAll()));
      }); // re-subscribing after the panel is closed and re-opened won't trigger the callback,
      // So we'll manually populate our state

      setUnsortedQueries(Object.values(queryCache.getAll()));
      return unsubscribe;
    }

    return undefined;
  }, [isOpen, sort, sortFn, sortDesc, setUnsortedQueries, queryCache]);

  var handleRefetch = function handleRefetch() {
    var promise = activeQuery.fetch();
    promise.catch(_utils2.noop);
  };

  return /*#__PURE__*/_react.default.createElement(_theme.ThemeProvider, {
    theme: _theme.defaultTheme
  }, /*#__PURE__*/_react.default.createElement(_styledComponents.Panel, (0, _extends2.default)({
    ref: ref,
    className: "ReactQueryDevtoolsPanel"
  }, panelProps, {
    suppressHydrationWarning: true
  }), /*#__PURE__*/_react.default.createElement("style", {
    dangerouslySetInnerHTML: {
      __html: "\n            .ReactQueryDevtoolsPanel * {\n              scrollbar-color: " + _theme.defaultTheme.backgroundAlt + " " + _theme.defaultTheme.gray + ";\n            }\n\n            .ReactQueryDevtoolsPanel *::-webkit-scrollbar, .ReactQueryDevtoolsPanel scrollbar {\n              width: 1rem;\n              height: 1rem;\n            }\n\n            .ReactQueryDevtoolsPanel *::-webkit-scrollbar-track, .ReactQueryDevtoolsPanel scrollbar-track {\n              background: " + _theme.defaultTheme.backgroundAlt + ";\n            }\n\n            .ReactQueryDevtoolsPanel *::-webkit-scrollbar-thumb, .ReactQueryDevtoolsPanel scrollbar-thumb {\n              background: " + _theme.defaultTheme.gray + ";\n              border-radius: .5rem;\n              border: 3px solid " + _theme.defaultTheme.backgroundAlt + ";\n            }\n          "
    }
  }), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '4px',
      marginBottom: '-4px',
      cursor: 'row-resize',
      zIndex: 100000
    },
    onMouseDown: handleDragStart
  }), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      flex: '1 1 500px',
      minHeight: '40%',
      maxHeight: '100%',
      overflow: 'auto',
      borderRight: "1px solid " + _theme.defaultTheme.grayAlt,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      padding: '.5rem',
      background: _theme.defaultTheme.backgroundAlt,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/_react.default.createElement(_Logo.default, {
    "aria-hidden": true,
    style: {
      marginRight: '.5rem'
    }
  }), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/_react.default.createElement(_styledComponents.QueryKeys, {
    style: {
      marginBottom: '.5rem'
    }
  }, /*#__PURE__*/_react.default.createElement(_styledComponents.QueryKey, {
    suppressHydrationWarning: true,
    style: {
      background: _theme.defaultTheme.success,
      opacity: hasFresh ? 1 : 0.3
    }
  }, "fresh ", /*#__PURE__*/_react.default.createElement(_styledComponents.Code, {
    suppressHydrationWarning: true
  }, "(", hasFresh, ")")), ' ', /*#__PURE__*/_react.default.createElement(_styledComponents.QueryKey, {
    suppressHydrationWarning: true,
    style: {
      background: _theme.defaultTheme.active,
      opacity: hasFetching ? 1 : 0.3
    }
  }, "fetching", ' ', /*#__PURE__*/_react.default.createElement(_styledComponents.Code, {
    suppressHydrationWarning: true
  }, "(", hasFetching, ")")), ' ', /*#__PURE__*/_react.default.createElement(_styledComponents.QueryKey, {
    suppressHydrationWarning: true,
    style: {
      background: _theme.defaultTheme.warning,
      color: 'black',
      textShadow: '0',
      opacity: hasStale ? 1 : 0.3
    }
  }, "stale ", /*#__PURE__*/_react.default.createElement(_styledComponents.Code, {
    suppressHydrationWarning: true
  }, "(", hasStale, ")")), ' ', /*#__PURE__*/_react.default.createElement(_styledComponents.QueryKey, {
    suppressHydrationWarning: true,
    style: {
      background: _theme.defaultTheme.gray,
      opacity: hasInactive ? 1 : 0.3
    }
  }, "inactive", ' ', /*#__PURE__*/_react.default.createElement(_styledComponents.Code, {
    suppressHydrationWarning: true
  }, "(", hasInactive, ")"))), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/_react.default.createElement(_styledComponents.Input, {
    placeholder: "Filter",
    "aria-label": "Filter by queryhash",
    value: filter != null ? filter : '',
    onChange: function onChange(e) {
      return setFilter(e.target.value);
    },
    onKeyDown: function onKeyDown(e) {
      if (e.key === 'Escape') setFilter('');
    },
    style: {
      flex: '1',
      marginRight: '.5rem'
    }
  }), !filter ? /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_styledComponents.Select, {
    "aria-label": "Sort queries",
    value: sort,
    onChange: function onChange(e) {
      return setSort(e.target.value);
    },
    style: {
      flex: '1',
      minWidth: 75,
      marginRight: '.5rem'
    }
  }, Object.keys(sortFns).map(function (key) {
    return /*#__PURE__*/_react.default.createElement("option", {
      key: key,
      value: key
    }, "Sort by ", key);
  })), /*#__PURE__*/_react.default.createElement(_styledComponents.Button, {
    type: "button",
    onClick: function onClick() {
      return setSortDesc(function (old) {
        return !old;
      });
    },
    style: {
      padding: '.3rem .4rem'
    }
  }, sortDesc ? '??? Desc' : '??? Asc')) : null))), /*#__PURE__*/_react.default.createElement("div", {
    suppressHydrationWarning: true,
    style: {
      overflowY: 'auto',
      flex: '1'
    }
  }, queries.map(function (query, i) {
    return /*#__PURE__*/_react.default.createElement("div", {
      suppressHydrationWarning: true,
      key: query.queryHash || i,
      role: "button",
      "aria-label": "Open query details for " + query.queryHash,
      onClick: function onClick() {
        return setActiveQueryHash(activeQueryHash === query.queryHash ? '' : query.queryHash);
      },
      style: {
        display: 'flex',
        borderBottom: "solid 1px " + _theme.defaultTheme.grayAlt,
        cursor: 'pointer',
        background: query === activeQuery ? 'rgba(255,255,255,.1)' : undefined
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      suppressHydrationWarning: true,
      style: {
        flex: '0 0 auto',
        width: '2rem',
        height: '2rem',
        background: (0, _utils.getQueryStatusColor)(query, _theme.defaultTheme),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        textShadow: (0, _utils.getQueryStatusLabel)(query) === 'stale' ? '0' : '0 0 10px black',
        color: (0, _utils.getQueryStatusLabel)(query) === 'stale' ? 'black' : 'white'
      }
    }, query.getObserversCount()), /*#__PURE__*/_react.default.createElement(_styledComponents.Code, {
      suppressHydrationWarning: true,
      style: {
        padding: '.5rem'
      }
    }, "" + query.queryHash));
  }))), activeQuery ? /*#__PURE__*/_react.default.createElement(_styledComponents.ActiveQueryPanel, null, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      padding: '.5rem',
      background: _theme.defaultTheme.backgroundAlt,
      position: 'sticky',
      top: 0,
      zIndex: 1
    }
  }, "Query Details"), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      padding: '.5rem'
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      marginBottom: '.5rem',
      display: 'flex',
      alignItems: 'stretch',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/_react.default.createElement(_styledComponents.Code, {
    style: {
      lineHeight: '1.8rem'
    }
  }, /*#__PURE__*/_react.default.createElement("pre", {
    style: {
      margin: 0,
      padding: 0,
      overflow: 'auto'
    }
  }, JSON.stringify(activeQuery.queryKey, null, 2))), /*#__PURE__*/_react.default.createElement("span", {
    style: {
      padding: '0.3rem .6rem',
      borderRadius: '0.4rem',
      fontWeight: 'bold',
      textShadow: '0 2px 10px black',
      background: (0, _utils.getQueryStatusColor)(activeQuery, _theme.defaultTheme),
      flexShrink: 0
    }
  }, (0, _utils.getQueryStatusLabel)(activeQuery))), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      marginBottom: '.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, "Observers: ", /*#__PURE__*/_react.default.createElement(_styledComponents.Code, null, activeQuery.getObserversCount())), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, "Last Updated:", ' ', /*#__PURE__*/_react.default.createElement(_styledComponents.Code, null, new Date(activeQuery.state.dataUpdatedAt).toLocaleTimeString()))), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      background: _theme.defaultTheme.backgroundAlt,
      padding: '.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 1
    }
  }, "Actions"), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      padding: '0.5rem'
    }
  }, /*#__PURE__*/_react.default.createElement(_styledComponents.Button, {
    type: "button",
    onClick: handleRefetch,
    disabled: activeQuery.state.isFetching,
    style: {
      background: _theme.defaultTheme.active
    }
  }, "Refetch"), ' ', /*#__PURE__*/_react.default.createElement(_styledComponents.Button, {
    type: "button",
    onClick: function onClick() {
      return queryClient.invalidateQueries(activeQuery);
    },
    style: {
      background: _theme.defaultTheme.warning,
      color: _theme.defaultTheme.inputTextColor
    }
  }, "Invalidate"), ' ', /*#__PURE__*/_react.default.createElement(_styledComponents.Button, {
    type: "button",
    onClick: function onClick() {
      return queryClient.resetQueries(activeQuery);
    },
    style: {
      background: _theme.defaultTheme.gray
    }
  }, "Reset"), ' ', /*#__PURE__*/_react.default.createElement(_styledComponents.Button, {
    type: "button",
    onClick: function onClick() {
      return queryClient.removeQueries(activeQuery);
    },
    style: {
      background: _theme.defaultTheme.danger
    }
  }, "Remove")), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      background: _theme.defaultTheme.backgroundAlt,
      padding: '.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 1
    }
  }, "Data Explorer"), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      padding: '.5rem'
    }
  }, /*#__PURE__*/_react.default.createElement(_Explorer.default, {
    label: "Data",
    value: activeQuery == null ? void 0 : (_activeQuery$state = activeQuery.state) == null ? void 0 : _activeQuery$state.data,
    defaultExpanded: {}
  })), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      background: _theme.defaultTheme.backgroundAlt,
      padding: '.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 1
    }
  }, "Query Explorer"), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      padding: '.5rem'
    }
  }, /*#__PURE__*/_react.default.createElement(_Explorer.default, {
    label: "Query",
    value: activeQuery,
    defaultExpanded: {
      queryKey: true
    }
  }))) : null));
});

exports.ReactQueryDevtoolsPanel = ReactQueryDevtoolsPanel;