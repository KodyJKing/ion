void (function(){var _ion_runtime_ForInOfStatement_ = function(module,exports,require){'use strict';
var ion = require('../'), Statement = require('./Statement'), DynamicExpression = require('./DynamicExpression');
var ForInOfStatement = ion.defineClass({
        name: 'ForInOfStatement',
        properties: {
            toKey: function (name) {
                if (this.type === 'ForOfStatement') {
                    return parseInt(name);
                } else {
                    return name;
                }
            },
            forEach: function (collection, callback) {
                if (this.type === 'ForOfStatement') {
                    for (var key = 0; key < collection.length; key++) {
                        var value = collection[key];
                        callback(key, value);
                    }
                } else {
                    for (var key in collection) {
                        var value = collection[key];
                        callback(key, value);
                    }
                }
            },
            activate: function () {
                ForInOfStatement.super.prototype.activate.apply(this, arguments);
                if (!(this.statements != null)) {
                    this.statements = {};
                    this.valueName = this.left.declarations[this.type === 'ForOfStatement' ? 0 : 1] != null ? this.left.declarations[this.type === 'ForOfStatement' ? 0 : 1].id.name : void 0;
                    this.keyName = this.left.declarations[this.type === 'ForOfStatement' ? 1 : 0] != null ? this.left.declarations[this.type === 'ForOfStatement' ? 1 : 0].id.name : void 0;
                }
                this.collectionExpression = this.collectionExpression != null ? this.collectionExpression : this.context.createRuntime(this.right);
                this.collectionExpression.watch(this.collectionWatcher = this.collectionWatcher != null ? this.collectionWatcher : ion.bind(function (collection) {
                    if (this.collection !== collection) {
                        if (this.collection != null) {
                            this.forEach(this.collection, ion.bind(function (key, value) {
                                this.removeItem(key, value);
                            }, this));
                            ion.unobserve(this.collection, this.collectionObserver);
                        }
                        this.collection = collection;
                        if (this.collection != null) {
                            this.forEach(this.collection, ion.bind(function (key, value) {
                                this.addItem(key, value);
                            }, this));
                            ion.observe(this.collection, this.collectionObserver = this.collectionObserver != null ? this.collectionObserver : this.applyChanges.bind(this));
                        }
                    }
                }, this));
            },
            deactivate: function () {
                ForInOfStatement.super.prototype.deactivate.apply(this, arguments);
                this.collectionExpression.unwatch(this.collectionWatcher);
            },
            addItem: function (key, value, activate) {
                if (activate == null)
                    activate = true;
                if (value !== void 0) {
                    var newContext = this.context.newContext();
                    if (this.valueName != null) {
                        newContext.setVariable(this.valueName, new DynamicExpression({ value: value }));
                    }
                    if (this.keyName != null) {
                        newContext.setVariable(this.keyName, new DynamicExpression({ value: key }));
                    }
                    var statement = newContext.createRuntime(this.body);
                    this.statements[key] = statement;
                    if (activate) {
                        statement.activate();
                    }
                    return statement;
                }
            },
            removeItem: function (key, value) {
                var statement = this.statements[key];
                if (statement != null) {
                    this.disposeStatement(statement);
                }
                delete this.statements[key];
                return statement;
            },
            disposeStatement: function (statement) {
                if (this.remove != null) {
                    var removeStatement = statement.context.createRuntime(this.remove);
                    removeStatement.activate();
                }
                statement.deactivate();
            },
            summarize: function (changes) {
                var ignoreProperty = ion.bind(function (name) {
                        if (!(name != null)) {
                            return true;
                        }
                        if (name[0] === '_') {
                            return true;
                        }
                        if (name === 'length' && this.type === 'ForOfStatement') {
                            return true;
                        }
                        return false;
                    }, this);
                var map = new Map();
                for (var _i = 0; _i < changes.length; _i++) {
                    var _ref = changes[_i];
                    var type = _ref.type;
                    var object = _ref.object;
                    var name = _ref.name;
                    var oldValue = _ref.oldValue;
                    if (!ignoreProperty(name)) {
                        if (!map.has(name)) {
                            map.set(name, {
                                type: type,
                                object: object,
                                name: name,
                                oldValue: oldValue
                            });
                        } else {
                            var change = map.get(name);
                            change.type = type;
                        }
                    }
                }
                var array = [];
                map.forEach(function (change, name, object) {
                    var newValue = change.object[name];
                    if (newValue !== change.oldValue) {
                        delete change.object;
                        array.push(change);
                    }
                });
                return array;
            },
            applyChanges: function (changes) {
                changes = this.summarize(changes);
                if (changes.length === 0) {
                    return;
                }
                var recyclableStatements = new Map();
                var getRecycleKey = ion.bind(function (key, value) {
                        return this.type === 'ForOfStatement' ? value : key;
                    }, this);
                var activateStatements = [];
                for (var _i2 = 0; _i2 < changes.length; _i2++) {
                    var _ref2 = changes[_i2];
                    var name = _ref2.name;
                    var oldValue = _ref2.oldValue;
                    var key = this.toKey(name);
                    if (oldValue !== void 0) {
                        var rkey = getRecycleKey(key, oldValue);
                        var statement = this.statements[key];
                        if (statement != null) {
                            delete this.statements[key];
                            recyclableStatements.set(rkey, statement);
                        }
                    }
                }
                for (var _i3 = 0; _i3 < changes.length; _i3++) {
                    var _ref3 = changes[_i3];
                    var name = _ref3.name;
                    var oldValue = _ref3.oldValue;
                    var newValue = this.collection[name];
                    var key = this.toKey(name);
                    if (newValue !== void 0) {
                        var rkey = getRecycleKey(key, newValue);
                        var statement = recyclableStatements.get(rkey);
                        if (statement != null) {
                            if (this.type === 'ForOfStatement') {
                                if (this.keyName != null) {
                                    statement.context.variables[this.keyName].setValue(key);
                                }
                            } else {
                                if (this.valueName != null) {
                                    statement.context.variables[this.valueName].setValue(newValue);
                                }
                            }
                            this.statements[key] = statement;
                            recyclableStatements.delete(rkey);
                        } else {
                            statement = this.addItem(key, newValue, false);
                            if (statement != null) {
                                activateStatements.push(statement);
                            }
                        }
                    }
                }
                recyclableStatements.forEach(ion.bind(function (statement) {
                    this.disposeStatement(statement);
                }, this));
                for (var _i4 = 0; _i4 < activateStatements.length; _i4++) {
                    var statement = activateStatements[_i4];
                    statement.activate();
                }
            }
        }
    }, Statement);
module.exports = exports = ForInOfStatement;
  }
  if (typeof require === 'function') {
    if (require.register)
      require.register('ion/runtime/ForInOfStatement',_ion_runtime_ForInOfStatement_);
    else
      _ion_runtime_ForInOfStatement_.call(this, module, exports, require);
  }
  else {
    _ion_runtime_ForInOfStatement_.call(this);
  }
}).call(this)
//@ sourceMappingURL=./ForInOfStatement.map