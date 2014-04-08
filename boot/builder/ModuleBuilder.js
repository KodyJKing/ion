void (function(){var _ion_builder_ModuleBuilder_ = function(module,exports,require){'use strict';
const ion = require('ion');
const File = require('./File'), Directory = require('./Directory'), builder = require('./');
module.exports = exports = function _template(inputName, outputName, options) {
    if (this != null && this.constructor === _template) {
        return ion.createRuntime({
            type: 'Template',
            body: [
                {
                    type: 'VariableDeclaration',
                    declarations: [{
                            type: 'VariableDeclarator',
                            id: {
                                type: 'Identifier',
                                name: 'input'
                            },
                            init: {
                                type: 'NewExpression',
                                callee: {
                                    type: 'Identifier',
                                    name: 'Directory'
                                },
                                arguments: [{
                                        type: 'Identifier',
                                        name: 'inputName'
                                    }]
                            }
                        }],
                    kind: 'let'
                },
                {
                    type: 'VariableDeclaration',
                    declarations: [{
                            type: 'VariableDeclarator',
                            id: {
                                type: 'Identifier',
                                name: 'output'
                            },
                            init: {
                                type: 'NewExpression',
                                callee: {
                                    type: 'Identifier',
                                    name: 'Directory'
                                },
                                arguments: [{
                                        type: 'Identifier',
                                        name: 'outputName'
                                    }]
                            }
                        }],
                    kind: 'let'
                },
                {
                    type: 'VariableDeclaration',
                    declarations: [{
                            type: 'VariableDeclarator',
                            id: {
                                type: 'Identifier',
                                name: 'name'
                            },
                            init: {
                                type: 'ConditionalExpression',
                                test: {
                                    type: 'BinaryExpression',
                                    operator: '!=',
                                    left: {
                                        type: 'MemberExpression',
                                        computed: false,
                                        object: {
                                            type: 'Identifier',
                                            name: 'options'
                                        },
                                        property: {
                                            type: 'Identifier',
                                            name: 'name'
                                        },
                                        existential: true
                                    },
                                    right: {
                                        type: 'Literal',
                                        value: null
                                    }
                                },
                                consequent: {
                                    type: 'MemberExpression',
                                    computed: false,
                                    object: {
                                        type: 'Identifier',
                                        name: 'options'
                                    },
                                    property: {
                                        type: 'Identifier',
                                        name: 'name'
                                    },
                                    existential: true
                                },
                                alternate: {
                                    type: 'Literal',
                                    value: ''
                                }
                            }
                        }],
                    kind: 'let'
                },
                {
                    type: 'Property',
                    key: {
                        type: 'Identifier',
                        name: 'output'
                    },
                    value: {
                        type: 'ObjectExpression',
                        objectType: null,
                        properties: [{
                                type: 'ForInStatement',
                                left: {
                                    type: 'VariableDeclaration',
                                    declarations: [
                                        {
                                            type: 'VariableDeclarator',
                                            id: {
                                                type: 'Identifier',
                                                name: 'path'
                                            },
                                            init: null
                                        },
                                        {
                                            type: 'VariableDeclarator',
                                            id: {
                                                type: 'Identifier',
                                                name: 'source'
                                            },
                                            init: null
                                        }
                                    ],
                                    kind: 'let'
                                },
                                right: {
                                    type: 'CallExpression',
                                    callee: {
                                        type: 'MemberExpression',
                                        computed: false,
                                        object: {
                                            type: 'Identifier',
                                            name: 'input'
                                        },
                                        property: {
                                            type: 'Identifier',
                                            name: 'search'
                                        }
                                    },
                                    arguments: [{
                                            type: 'Literal',
                                            value: '.coffee'
                                        }]
                                },
                                body: {
                                    type: 'BlockStatement',
                                    body: [
                                        {
                                            type: 'VariableDeclaration',
                                            declarations: [{
                                                    type: 'VariableDeclarator',
                                                    id: {
                                                        type: 'Identifier',
                                                        name: 'targetPath'
                                                    },
                                                    init: {
                                                        type: 'CallExpression',
                                                        callee: {
                                                            type: 'MemberExpression',
                                                            computed: false,
                                                            object: {
                                                                type: 'Identifier',
                                                                name: 'builder'
                                                            },
                                                            property: {
                                                                type: 'Identifier',
                                                                name: 'changeExtension'
                                                            }
                                                        },
                                                        arguments: [
                                                            {
                                                                type: 'Identifier',
                                                                name: 'path'
                                                            },
                                                            {
                                                                type: 'Literal',
                                                                value: '.js'
                                                            }
                                                        ]
                                                    }
                                                }],
                                            kind: 'let'
                                        },
                                        {
                                            type: 'VariableDeclaration',
                                            declarations: [{
                                                    type: 'VariableDeclarator',
                                                    id: {
                                                        type: 'Identifier',
                                                        name: 'moduleId'
                                                    },
                                                    init: {
                                                        type: 'CallExpression',
                                                        callee: {
                                                            type: 'MemberExpression',
                                                            computed: false,
                                                            object: {
                                                                type: 'Identifier',
                                                                name: 'builder'
                                                            },
                                                            property: {
                                                                type: 'Identifier',
                                                                name: 'getModuleId'
                                                            }
                                                        },
                                                        arguments: [
                                                            {
                                                                type: 'Identifier',
                                                                name: 'name'
                                                            },
                                                            {
                                                                type: 'Identifier',
                                                                name: 'path'
                                                            }
                                                        ]
                                                    }
                                                }],
                                            kind: 'let'
                                        },
                                        {
                                            type: 'Property',
                                            key: {
                                                type: 'Identifier',
                                                name: 'targetPath'
                                            },
                                            value: {
                                                type: 'CallExpression',
                                                callee: {
                                                    type: 'MemberExpression',
                                                    computed: false,
                                                    object: {
                                                        type: 'Identifier',
                                                        name: 'builder'
                                                    },
                                                    property: {
                                                        type: 'Identifier',
                                                        name: 'compileCoffeeScript'
                                                    }
                                                },
                                                arguments: [
                                                    {
                                                        type: 'Identifier',
                                                        name: 'source'
                                                    },
                                                    {
                                                        type: 'Identifier',
                                                        name: 'moduleId'
                                                    }
                                                ]
                                            },
                                            kind: 'init',
                                            computed: true
                                        }
                                    ]
                                }
                            }]
                    },
                    kind: 'init'
                }
            ]
        }, {
            require: require,
            module: module,
            exports: exports,
            inputName: inputName,
            outputName: outputName,
            options: options,
            File: File,
            Directory: Directory,
            builder: builder
        });
    }
    let input = new Directory(inputName);
    let output = new Directory(outputName);
    let name = (options != null ? options.name : void 0) != null ? options.name : '';
    let _ref2 = {};
    {
        {
            let _ref = input.search('.coffee');
            for (let path in _ref) {
                let source = _ref[path];
                let targetPath = builder.changeExtension(path, '.js');
                let moduleId = builder.getModuleId(name, path);
                _ref2[targetPath] = builder.compileCoffeeScript(source, moduleId);
            }
        }
    }
    ion.patch(output, _ref2);
};
  }
  if (typeof require === 'function') {
    if (require.register)
      require.register('ion/builder/ModuleBuilder',_ion_builder_ModuleBuilder_);
    else
      _ion_builder_ModuleBuilder_.call(this, module, exports, require);
  }
  else {
    _ion_builder_ModuleBuilder_.call(this);
  }
}).call(this)