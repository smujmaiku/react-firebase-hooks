"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useFirebase = useFirebase;
exports.useFirestoreDoc = useFirestoreDoc;
exports.useFirestoreDocRT = useFirestoreDocRT;
exports.applyCollectionQuery = applyCollectionQuery;
exports.useFirestoreCollection = useFirestoreCollection;
exports.useFirestoreCollectionRT = useFirestoreCollectionRT;
exports.useFirebaseStorageAsUrls = useFirebaseStorageAsUrls;
exports.FirebaseProvider = FirebaseProvider;
exports.AuthWall = AuthWall;
exports.firebaseContext = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactHelperHooks = require("react-helper-hooks");

var _firebase = _interopRequireDefault(require("firebase"));

require("firebase/auth");

require("firebase/firestore");

require("firebase/storage");

require("firebase/functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var firebaseContext = (0, _react.createContext)();
/**
 * Use firebase hooks and actions
 * @returns {Array} [
 *   {fire, auth, firestore, storage, functions, ready, currentUser, authId},
 *   {signInGoogle, signOut, addDoc, setDoc, patchDoc, deleteDoc}
 * ]
 */

exports.firebaseContext = firebaseContext;

function useFirebase() {
  var _useContext = (0, _react.useContext)(firebaseContext),
      _useContext2 = _slicedToArray(_useContext, 1),
      _useContext2$ = _useContext2[0],
      fire = _useContext2$.fire,
      auth = _useContext2$.auth,
      firestore = _useContext2$.firestore,
      storage = _useContext2$.storage,
      functions = _useContext2$.functions,
      ready = _useContext2$.ready;

  var _usePatch = (0, _reactHelperHooks.usePatch)({
    fire: fire,
    auth: auth,
    firestore: firestore,
    storage: storage,
    functions: functions
  }),
      _usePatch2 = _slicedToArray(_usePatch, 2),
      state = _usePatch2[0],
      patchState = _usePatch2[1];

  (0, _react.useEffect)(function () {
    if (!ready) {
      patchState({
        ready: undefined
      });
    }

    return auth.onAuthStateChanged(function (user) {
      var _ref = user || {},
          email = _ref.email;

      var authId = (email || '').split('@')[0];
      patchState({
        ready: true,
        currentUser: user,
        authId: authId
      });
    });
  }, [auth, ready, patchState]);
  var actions = (0, _react.useMemo)(function () {
    return {
      signInGoogle: function () {
        var _signInGoogle = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          var provider, res;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  patchState({
                    ready: undefined
                  });
                  _context.prev = 1;
                  provider = new _firebase["default"].auth.GoogleAuthProvider();
                  _context.next = 5;
                  return auth.signInWithPopup(provider);

                case 5:
                  res = _context.sent;
                  return _context.abrupt("return", res.user);

                case 9:
                  _context.prev = 9;
                  _context.t0 = _context["catch"](1);
                  patchState({
                    ready: true,
                    currentUser: undefined,
                    authId: undefined
                  });
                  return _context.abrupt("return", undefined);

                case 13:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[1, 9]]);
        }));

        function signInGoogle() {
          return _signInGoogle.apply(this, arguments);
        }

        return signInGoogle;
      }(),
      signOut: function () {
        var _signOut = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  patchState({
                    ready: undefined,
                    currentUser: undefined,
                    authId: undefined
                  });
                  return _context2.abrupt("return", auth.signOut());

                case 2:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        function signOut() {
          return _signOut.apply(this, arguments);
        }

        return signOut;
      }(),
      addDoc: function () {
        var _addDoc = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(path, data) {
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  return _context3.abrupt("return", firestore.collection(path).add(data));

                case 1:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        }));

        function addDoc(_x, _x2) {
          return _addDoc.apply(this, arguments);
        }

        return addDoc;
      }(),
      setDoc: function () {
        var _setDoc = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(path, data) {
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  return _context4.abrupt("return", firestore.doc(path).set(data));

                case 1:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4);
        }));

        function setDoc(_x3, _x4) {
          return _setDoc.apply(this, arguments);
        }

        return setDoc;
      }(),
      patchDoc: function () {
        var _patchDoc = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(path, data) {
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  return _context5.abrupt("return", firestore.doc(path).set(data, {
                    merge: true
                  }));

                case 1:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5);
        }));

        function patchDoc(_x5, _x6) {
          return _patchDoc.apply(this, arguments);
        }

        return patchDoc;
      }(),
      deleteDoc: function () {
        var _deleteDoc = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(path) {
          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  return _context6.abrupt("return", firestore.doc(path)["delete"]());

                case 1:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6);
        }));

        function deleteDoc(_x7) {
          return _deleteDoc.apply(this, arguments);
        }

        return deleteDoc;
      }(),
      // Include: https://github.com/firebase/quickstart-js/blob/master/messaging/firebase-messaging-sw.js
      callFunction: function () {
        var _callFunction = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(name, data) {
          return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  return _context7.abrupt("return", functions.httpsCallable(name)(data));

                case 1:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7);
        }));

        function callFunction(_x8, _x9) {
          return _callFunction.apply(this, arguments);
        }

        return callFunction;
      }()
    };
  }, [auth, firestore, patchState]);
  return [state, actions];
}
/**
 * Get Firestore doc hook
 * @param {string} path
 * @returns {Array} [state, {reload}]
 */


function useFirestoreDoc(path) {
  var _useFirebase = useFirebase(),
      _useFirebase2 = _slicedToArray(_useFirebase, 1),
      firestore = _useFirebase2[0].firestore;

  var promise = (0, _react.useCallback)( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var ref, doc;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            ref = firestore.doc(path);
            _context8.next = 3;
            return ref.get();

          case 3:
            doc = _context8.sent;
            return _context8.abrupt("return", doc.data());

          case 5:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  })), [firestore, path]);
  return (0, _reactHelperHooks.usePromise)(promise);
}
/**
 * Subscribe Firestore doc hook
 * @param {string} path
 * @returns {Array} [state]
 */


function useFirestoreDocRT(path) {
  var _useFirebase3 = useFirebase(),
      _useFirebase4 = _slicedToArray(_useFirebase3, 1),
      _useFirebase4$ = _useFirebase4[0],
      authId = _useFirebase4$.authId,
      firestore = _useFirebase4$.firestore;

  var _useHelper = (0, _reactHelperHooks.useHelper)(),
      _useHelper2 = _slicedToArray(_useHelper, 2),
      state = _useHelper2[0],
      _useHelper2$ = _useHelper2[1],
      reset = _useHelper2$.reset,
      resolve = _useHelper2$.resolve,
      reject = _useHelper2$.reject;

  (0, _react.useEffect)(function () {
    reset();
    var ref = firestore.doc(path);
    return ref.onSnapshot(function (doc) {
      resolve(doc.data());
    }, function (error) {
      reject(error);
    });
  }, [firestore, authId, path, reset, resolve, reject]);
  return [state];
}
/**
 * Apply query to collection
 * @param {Firebase.collectionRef} collectionRef
 * @param {Object} query
 * @param {Array?} query.where
 * @param {Array?} query.orderBy
 * @param {number?} query.limit
 * @returns {Firebase.collectionRef}
 */


function applyCollectionQuery(collectionRef, query) {
  var ref = collectionRef;
  var where = query.where,
      orderBy = query.orderBy,
      limit = query.limit;
  /* eslint-disable no-unmodified-loop-condition */

  while (where instanceof Array && where.length > 0) {
    var _ref3;

    ref = (_ref3 = ref).where.apply(_ref3, _toConsumableArray(where.shift()));
  }

  while (orderBy instanceof Array && orderBy.length > 0) {
    var _ref4;

    ref = (_ref4 = ref).orderBy.apply(_ref4, _toConsumableArray(orderBy.shift()));
  }
  /* eslint-enable no-unmodified-loop-condition */


  if (typeof limit === 'number') {
    ref = ref.limit(limit);
  }

  return ref;
}
/**
 * Get Firestore collection hook
 * @param {string} path
 * @param {Object?} query
 * @param {Array?} query.where
 * @param {Array?} query.orderBy
 * @param {number?} query.limit
 * @returns {Array} [state, {reload}]
 */


function useFirestoreCollection(path) {
  var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _useFirebase5 = useFirebase(),
      _useFirebase6 = _slicedToArray(_useFirebase5, 1),
      firestore = _useFirebase6[0].firestore;

  var queryData = (0, _reactHelperHooks.useObject)(query);
  var promise = (0, _react.useCallback)( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
    var ref, queryRef, collection, data;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            ref = firestore.collection(path);
            queryRef = applyCollectionQuery(ref, queryData);
            _context9.next = 4;
            return queryRef.get();

          case 4:
            collection = _context9.sent;
            data = {};
            collection.forEach(function (doc) {
              data[doc.id] = doc.data();
            });
            return _context9.abrupt("return", data);

          case 8:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  })), [path, queryData, firestore]);
  return (0, _reactHelperHooks.usePromise)(promise);
}
/**
 * Subscribe Firestore collection hook
 * @param {string} path
 * @param {Object?} query
 * @param {Array?} query.where
 * @param {Array?} query.orderBy
 * @param {number?} query.limit
 * @returns {Array} [state]
 */


function useFirestoreCollectionRT(path) {
  var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _useFirebase7 = useFirebase(),
      _useFirebase8 = _slicedToArray(_useFirebase7, 1),
      _useFirebase8$ = _useFirebase8[0],
      authId = _useFirebase8$.authId,
      firestore = _useFirebase8$.firestore;

  var queryData = (0, _reactHelperHooks.useObject)(query);

  var _useHelper3 = (0, _reactHelperHooks.useHelper)(),
      _useHelper4 = _slicedToArray(_useHelper3, 2),
      state = _useHelper4[0],
      _useHelper4$ = _useHelper4[1],
      reset = _useHelper4$.reset,
      resolve = _useHelper4$.resolve,
      reject = _useHelper4$.reject;

  (0, _react.useEffect)(function () {
    reset();
    var ref = firestore.collection(path);
    var queryRef = applyCollectionQuery(ref, queryData);
    return queryRef.onSnapshot(function (snp) {
      var list = {};
      snp.forEach(function (doc) {
        list[doc.id] = doc.data();
      });
      resolve(list);
    }, function (error) {
      reject(error);
    });
  }, [firestore, authId, path, queryData, reset, resolve, reject]);
  return [state];
}
/**
 * Get storage urls
 * @param {Array|Object} files
 * @param {Array} [state]
 */


function useFirebaseStorageAsUrls(files) {
  var _useFirebase9 = useFirebase(),
      _useFirebase10 = _slicedToArray(_useFirebase9, 1),
      storage = _useFirebase10[0].storage;

  var fileList = (0, _reactHelperHooks.useObject)(files);
  var promise = (0, _react.useCallback)( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
    var isArray, map, _i2, _Object$entries, _Object$entries$_i, key, file, url;

    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            isArray = fileList instanceof Array;
            map = {};
            _i2 = 0, _Object$entries = Object.entries(fileList);

          case 3:
            if (!(_i2 < _Object$entries.length)) {
              _context10.next = 12;
              break;
            }

            _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2), key = _Object$entries$_i[0], file = _Object$entries$_i[1];
            _context10.next = 7;
            return storage.ref(file).getDownloadURL();

          case 7:
            url = _context10.sent;
            map[isArray ? file : key] = url;

          case 9:
            _i2++;
            _context10.next = 3;
            break;

          case 12:
            return _context10.abrupt("return", map);

          case 13:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  })), [fileList, storage]);
  return (0, _reactHelperHooks.usePromise)(promise);
}

function FirebaseProvider(props) {
  var config = props.config,
      children = props.children,
      loadingComponent = props.loadingComponent;
  var value = (0, _reactHelperHooks.usePatch)();

  var _value = _slicedToArray(value, 2),
      state = _value[0],
      patchState = _value[1];

  (0, _react.useEffect)(function () {
    var fire = _firebase["default"].initializeApp(config);

    patchState({
      fire: fire,
      auth: fire.auth(),
      firestore: fire.firestore(),
      storage: fire.storage(),
      functions: fire.functions(),
      ready: true
    });
  }, [config, patchState]);
  if (!state.fire) return loadingComponent;
  return /*#__PURE__*/_react["default"].createElement(firebaseContext.Provider, {
    value: [state, patchState]
  }, children);
}

FirebaseProvider.defaultProps = {
  loadingComponent: false
};
/* eslint-disable react/forbid-prop-types */

FirebaseProvider.propTypes = {
  config: _propTypes["default"].object.isRequired,
  children: _propTypes["default"].node.isRequired,
  loadingComponent: _propTypes["default"].node
};

function AuthWall(props) {
  var children = props.children,
      loadingComponent = props.loadingComponent,
      promptComponent = props.promptComponent;

  var _useFirebase11 = useFirebase(),
      _useFirebase12 = _slicedToArray(_useFirebase11, 1),
      _useFirebase12$ = _useFirebase12[0],
      ready = _useFirebase12$.ready,
      currentUser = _useFirebase12$.currentUser;

  if (!ready) {
    return loadingComponent;
  }

  if (!currentUser) {
    return promptComponent;
  }

  return children;
}

AuthWall.defaultProps = {
  promptComponent: false,
  loadingComponent: false
};
AuthWall.propTypes = {
  children: _propTypes["default"].node.isRequired,
  promptComponent: _propTypes["default"].node,
  loadingComponent: _propTypes["default"].node
};
