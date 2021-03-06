void (function(){var _ion_builder_watcher_ = function(module,exports,require){var allWatchers, fs, ion, np, util;

if (global.window) {
  return;
}

ion = require('../');

fs = require('fs');

np = require('path');

util = require('./utility');

// watches a directory recursively for file changes
// will call the listener once for each matching file
// immediately and then whenever
// files are changed, deleted or created
exports.watchDirectory = function(dirname, options, listener) {
  var filter, fsListener, initial, notifyListener, unwatchFile, watchFile, watchedFiles;
  if (listener == null) {
    listener = options;
    options = {};
  }
  if (options.persistent == null) {
    options.persistent = true;
  }
  if (options.interval == null) {
    options.interval = 100;
  }
  if (options.recursive == null) {
    options.recursive = true;
  }
  // change message for initial pass. Use false for no initial pass.
  if (options.initial == null) {
    options.initial = 'initial';
  }
  if (options.exclude == null) {
    options.exclude = util.defaultFileExclude;
  }
  filter = function(name) {
    if (util.isMatch(name, options.exclude, false)) {
      return false;
    } else {
      return util.isMatch(name, options.include, true);
    }
  };
  watchedFiles = {}; // filename => bound listener
  notifyListener = function(filename, curr, prev, change, async = false) {
    if (filter(filename)) {
      if (async) {
        return ion.setImmediate(function() {
          return listener(filename, curr, prev, change);
        });
      } else {
        return listener(filename, curr, prev, change);
      }
    }
  };
  fsListener = function(filename, depth, curr, prev) {
    var change;
    change = curr.nlink === 0 ? 'deleted' : prev.nlink === 0 ? 'created' : 'modified';
    notifyListener(filename, curr, prev, change);
    // we call watchFile again in case children were added
    if (change !== 'deleted') {
      return watchFile(filename, depth, curr);
    } else {
      return unwatchFile(filename);
    }
  };
  unwatchFile = function(filename) {
    fs.unwatchFile(filename, watchedFiles[filename]);
    delete watchedFiles[filename];
    return allWatchers[filename]--;
  };
  watchFile = function(filename, depth = 0, stats) {
    var boundListener, child, i, len, ref;
    if (fs.existsSync(filename)) {
      if (stats == null) {
        stats = fs.statSync(filename);
      }
      if (stats.nlink > 0) {
        if (stats.isDirectory()) {
          // also watch all children
          // exclude directories in exclude list
          if (!util.isMatch(filename, options.exclude, false)) {
            if (depth === 0 || options.recursive) {
              ref = fs.readdirSync(filename);
              for (i = 0, len = ref.length; i < len; i++) {
                child = ref[i];
                child = np.join(filename, child);
                watchFile(child, depth + 1);
              }
            }
          }
        }
        if (watchedFiles[filename] == null) {
          if (allWatchers[filename] == null) {
            allWatchers[filename] = 0;
          }
          allWatchers[filename]++;
          boundListener = fsListener.bind(this, filename, depth);
          watchedFiles[filename] = boundListener;
          fs.watchFile(filename, options, boundListener);
          if (initial) {
            notifyListener(filename, stats, stats, initial, true);
          }
        }
      }
    }
  };
  initial = options.initial;
  watchFile(dirname);
  initial = 'created';
  return function() {    // console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
    // console.log(JSON.stringify(allWatchers, null, '  '))
    // console.log("================" + fs.setMaxListeners)
    // console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")

    // return a function that will unwatch all watched files
    var key, results;
    results = [];
    for (key in watchedFiles) {
      results.push(unwatchFile(key));
    }
    return results;
  };
};

allWatchers = {};

  }
  if (typeof require === 'function') {
    if (require.register)
      require.register('ion/builder/watcher',_ion_builder_watcher_);
    else
      _ion_builder_watcher_.call(this, module, exports, require);
  }
  else {
    _ion_builder_watcher_.call(this);
  }
}).call(this)