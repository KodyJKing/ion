(function(){require.register('ion/postprocessor',function(module,exports,require){// Generated by CoffeeScript 1.6.3
(function() {
  var Operation, assignAddIndexes, core, postprocess;

  core = require('./core');

  Operation = require('./reactive/Operation');

  assignAddIndexes = function _assignAddIndexes(node, depthStack) {
    var child, index, operation, _i, _len, _ref;
    if (depthStack == null) {
      depthStack = [0];
    }
    if ((node != null ? node.op : void 0) != null) {
      operation = Operation.getOperation(node.op);
      if (operation.addIndex) {
        index = depthStack[depthStack.length - 1]++;
        node.args.push(index);
      }
    }
    if ((node != null ? node.args : void 0) != null) {
      _ref = node.args;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        if (child != null) {
          assignAddIndexes(child, depthStack);
        }
      }
    }
  };

  exports.postprocess = postprocess = function _postprocess(ast) {
    assignAddIndexes(ast);
    return ast;
  };

}).call(this);

})})()