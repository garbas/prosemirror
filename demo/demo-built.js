(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _srcMenuMenu = require("../src/menu/menu");

var _srcEditMain = require("../src/edit/main");

var _srcDom = require("../src/dom");

var _srcConvertFrom_dom = require("../src/convert/from_dom");

var _srcMenuItems = require("../src/menu/items");

var _srcModel = require("../src/model");

require("../src/inputrules/autoinput");

require("../src/menu/inlinemenu");

require("../src/menu/menubar");

require("../src/menu/buttonmenu");

require("../src/collab");

var te = document.querySelector("#content");
te.style.display = "none";

var dummy = document.createElement("div");
dummy.innerHTML = te.value;
var doc = (0, _srcConvertFrom_dom.fromDOM)(dummy);

var DummyServer = (function () {
  function DummyServer() {
    _classCallCheck(this, DummyServer);

    this.version = 0;
    this.pms = [];
  }

  _createClass(DummyServer, [{
    key: "attach",
    value: function attach(pm) {
      var _this = this;

      pm.mod.collab.on("mustSend", function () {
        return _this.mustSend(pm);
      });
      this.pms.push(pm);
    }
  }, {
    key: "mustSend",
    value: function mustSend(pm) {
      var toSend = pm.mod.collab.sendableSteps();
      this.send(pm, toSend.version, toSend.steps);
      pm.mod.collab.confirmSteps(toSend);
    }
  }, {
    key: "send",
    value: function send(pm, version, steps) {
      this.version += steps.length;
      for (var i = 0; i < this.pms.length; i++) {
        if (this.pms[i] != pm) this.pms[i].mod.collab.receive(steps);
      }
    }
  }]);

  return DummyServer;
})();

var CustomImageItem = (function (_IconItem) {
  _inherits(CustomImageItem, _IconItem);

  function CustomImageItem() {
    _classCallCheck(this, CustomImageItem);

    _get(Object.getPrototypeOf(CustomImageItem.prototype), "constructor", this).call(this, "image", "Insert image");
  }

  _createClass(CustomImageItem, [{
    key: "apply",
    value: function apply(pm) {

      var modal = $('<div class="pat-modal">' + '  <h3>Upload Image<h3>' + '  <div class="pat-upload" data-pat-upload="url: https://example.org/upload; label: Drop files here to upload or click to browse.; trigger: button" />' + '  <button>Insert animal</button>' + '</div>').appendTo('body');

      $('button', modal).on('click', function () {
        var image_src = 'http://lorempixel.com/g/200/200/animals/';
        var sel = pm.selection,
            tr = pm.tr;
        tr["delete"](sel.from, sel.to);
        var attrs = { src: image_src, alt: 'Kitty', title: 'WooW!' };
        pm.apply(tr.insertInline(sel.from, new _srcModel.Span("image", attrs, null, null)));
        $(this).parents('.pat-modal').data('pattern-modal').destroy();
      });

      window.patterns.scan(modal);
    }
  }]);

  return CustomImageItem;
})(_srcMenuItems.IconItem);

function makeEditor(where, collab) {
  return new _srcEditMain.ProseMirror({
    place: document.querySelector(where),
    autoInput: true,
    menuBar: {
      float: true,
      items: [].concat(_toConsumableArray((0, _srcMenuItems.getItems)("inline").filter(function (item) {
        if (!(item instanceof _srcMenuItems.ImageItem)) {
          return true;
        }
      })), [_srcMenuItems.separatorItem, new CustomImageItem(), _srcMenuItems.separatorItem], _toConsumableArray((0, _srcMenuItems.getItems)("block")), _toConsumableArray((0, _srcMenuItems.getItems)("history")))
    },
    inlineMenu: false,
    buttonMenu: false,
    doc: doc,
    collab: collab
  });
}

window.pm = window.pm2 = null;
function createCollab() {
  var server = new DummyServer();
  pm = makeEditor(".left", { version: server.version });
  server.attach(pm);
  pm2 = makeEditor(".right", { version: server.version });
  server.attach(pm2);
}

var collab = document.location.hash != "#single";
var button = document.querySelector("#switch");
function choose(collab) {
  if (pm) {
    pm.wrapper.parentNode.removeChild(pm.wrapper);pm = null;
  }
  if (pm2) {
    pm2.wrapper.parentNode.removeChild(pm2.wrapper);pm2 = null;
  }

  if (collab) {
    createCollab();
    button.textContent = "try single editor";
    document.location.hash = "#collab";
  } else {
    pm = makeEditor(".full", false);
    button.textContent = "try collaborative editor";
    document.location.hash = "#single";
  }
}
button.addEventListener("click", function () {
  return choose(collab = !collab);
});

choose(collab);

addEventListener("hashchange", function () {
  var newVal = document.location.hash != "#single";
  if (newVal != collab) choose(collab = newVal);
});

document.querySelector("#mark").addEventListener("mousedown", function (e) {
  pm.markRange(pm.selection.from, pm.selection.to, { className: "marked" });
  e.preventDefault();
});

},{"../src/collab":3,"../src/convert/from_dom":6,"../src/dom":10,"../src/edit/main":22,"../src/inputrules/autoinput":27,"../src/menu/buttonmenu":29,"../src/menu/inlinemenu":31,"../src/menu/items":32,"../src/menu/menu":33,"../src/menu/menubar":34,"../src/model":37}],2:[function(require,module,exports){
var inserted = {};

module.exports = function (css, options) {
    if (inserted[css]) return;
    inserted[css] = true;
    
    var elem = document.createElement('style');
    elem.setAttribute('type', 'text/css');

    if ('textContent' in elem) {
      elem.textContent = css;
    } else {
      elem.styleSheet.cssText = css;
    }
    
    var head = document.getElementsByTagName('head')[0];
    if (options && options.prepend) {
        head.insertBefore(elem, head.childNodes[0]);
    } else {
        head.appendChild(elem);
    }
};

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _edit = require("../edit");

var _transform = require("../transform");

var _rebase = require("./rebase");

exports.rebaseSteps = _rebase.rebaseSteps;

(0, _edit.defineOption)("collab", false, function (pm, value) {
  if (pm.mod.collab) {
    pm.mod.collab.detach();
    pm.mod.collab = null;
  }

  if (value) {
    pm.mod.collab = new Collab(pm, value);
  }
});

var Collab = (function () {
  function Collab(pm, options) {
    var _this = this;

    _classCallCheck(this, Collab);

    this.pm = pm;
    this.options = options;

    this.version = options.version || 0;
    this.versionDoc = pm.doc;

    this.unconfirmedSteps = [];
    this.unconfirmedMaps = [];

    pm.on("transform", this.onTransform = function (transform) {
      for (var i = 0; i < transform.steps.length; i++) {
        _this.unconfirmedSteps.push(transform.steps[i]);
        _this.unconfirmedMaps.push(transform.maps[i]);
      }
      _this.signal("mustSend");
    });
    pm.on("beforeSetDoc", this.onSetDoc = function () {
      throw new Error("setDoc is not supported on a collaborative editor");
    });
    pm.history.allowCollapsing = false;
  }

  _createClass(Collab, [{
    key: "detach",
    value: function detach() {
      this.pm.off("transform", this.onTransform);
      this.pm.off("beforeSetDoc", this.onSetDoc);
      this.pm.history.allowCollapsing = true;
    }
  }, {
    key: "hasSendableSteps",
    value: function hasSendableSteps() {
      return this.unconfirmedSteps.length > 0;
    }
  }, {
    key: "sendableSteps",
    value: function sendableSteps() {
      return {
        version: this.version,
        doc: this.pm.doc,
        steps: this.unconfirmedSteps.slice()
      };
    }
  }, {
    key: "confirmSteps",
    value: function confirmSteps(sendable) {
      this.unconfirmedSteps.splice(0, sendable.steps.length);
      this.unconfirmedMaps.splice(0, sendable.steps.length);
      this.version += sendable.steps.length;
      this.versionDoc = sendable.doc;
    }
  }, {
    key: "receive",
    value: function receive(steps) {
      var doc = this.versionDoc;
      var maps = steps.map(function (step) {
        var result = (0, _transform.applyStep)(doc, step);
        doc = result.doc;
        return result.map;
      });
      this.version += steps.length;
      this.versionDoc = doc;

      var rebased = (0, _rebase.rebaseSteps)(doc, maps, this.unconfirmedSteps, this.unconfirmedMaps);
      this.unconfirmedSteps = rebased.transform.steps.slice();
      this.unconfirmedMaps = rebased.transform.maps.slice();

      this.pm.updateDoc(rebased.doc, rebased.mapping);
      this.pm.history.rebased(maps, rebased.transform, rebased.positions);
      return maps;
    }
  }]);

  return Collab;
})();

(0, _edit.eventMixin)(Collab);

},{"../edit":19,"../transform":44,"./rebase":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rebaseSteps = rebaseSteps;

var _transform = require("../transform");

function rebaseSteps(doc, forward, steps, maps) {
  var remap = new _transform.Remapping([], forward.slice());
  var transform = new _transform.Transform(doc);
  var positions = [];

  for (var i = 0; i < steps.length; i++) {
    var step = (0, _transform.mapStep)(steps[i], remap);
    var result = step && transform.step(step);
    var id = remap.addToFront(maps[i].invert());
    if (result) {
      remap.addToBack(result.map, id);
      positions.push(transform.steps.length - 1);
    } else {
      positions.push(-1);
    }
  }
  return { doc: transform.doc, transform: transform, mapping: remap, positions: positions };
}

},{"../transform":44}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertFrom = convertFrom;
exports.convertTo = convertTo;
exports.knownSource = knownSource;
exports.knownTarget = knownTarget;
exports.defineSource = defineSource;
exports.defineTarget = defineTarget;

var _model = require("../model");

var from = Object.create(null);
var to = Object.create(null);

function convertFrom(value, format, arg) {
  var converter = from[format];
  if (!converter) throw new Error("Source format " + format + " not defined");
  return converter(value, arg);
}

function convertTo(doc, format, arg) {
  var converter = to[format];
  if (!converter) throw new Error("Target format " + format + " not defined");
  return converter(doc, arg);
}

function knownSource(format) {
  return !!from[format];
}

function knownTarget(format) {
  return !!to[format];
}

function defineSource(format, func) {
  from[format] = func;
}

function defineTarget(format, func) {
  to[format] = func;
}

defineSource("json", function (json) {
  return _model.Node.fromJSON(json);
});
defineTarget("json", function (doc) {
  return doc.toJSON();
});

},{"../model":37}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.fromDOM = fromDOM;
exports.fromHTML = fromHTML;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _model = require("../model");

var _convert = require("./convert");

function fromDOM(dom, options) {
  if (!options) options = {};
  var context = new Context(options.topNode || new _model.Node("doc"));
  var start = options.from ? dom.childNodes[options.from] : dom.firstChild;
  var end = options.to != null && dom.childNodes[options.to] || null;
  context.addAll(start, end, true);
  return context.stack[0];
}

(0, _convert.defineSource)("dom", fromDOM);

function fromHTML(html, options) {
  var wrap = options.document.createElement("div");
  wrap.innerHTML = html;
  return fromDOM(wrap, options);
}

(0, _convert.defineSource)("html", fromHTML);

var blockElements = {
  address: true, article: true, aside: true, blockquote: true, canvas: true,
  dd: true, div: true, dl: true, fieldset: true, figcaption: true, figure: true,
  footer: true, form: true, h1: true, h2: true, h3: true, h4: true, h5: true,
  h6: true, header: true, hgroup: true, hr: true, li: true, noscript: true, ol: true,
  output: true, p: true, pre: true, section: true, table: true, tfoot: true, ul: true
};

var Context = (function () {
  function Context(topNode) {
    _classCallCheck(this, Context);

    this.stack = [topNode];
    this.styles = [];
    this.closing = false;
  }

  // FIXME don't export, define proper extension mechanism

  _createClass(Context, [{
    key: "addDOM",
    value: function addDOM(dom) {
      if (dom.nodeType == 3) {
        var value = dom.nodeValue;
        var _top = this.top,
            block = _top.type.block;
        if (/\S/.test(value) || block) {
          value = value.replace(/\s+/g, " ");
          if (/^\s/.test(value) && _top.content.length && /\s$/.test(_top.content[_top.content.length - 1].text)) value = value.slice(1);
          this.insert(_model.Span.text(value, this.styles));
        }
      } else if (dom.nodeType != 1) {
        // Ignore non-text non-element nodes
      } else if (dom.hasAttribute("pm-html")) {
          var type = dom.getAttribute("pm-html");
          if (type == "html_tag") this.insert(new _model.Span("html_tag", { html: dom.innerHTML }, this.styles));else this.insert(new _model.Node("html_block", { html: dom.innerHTML }));
        } else {
          var _name = dom.nodeName.toLowerCase();
          if (_name in tags) {
            tags[_name](dom, this);
          } else {
            this.addAll(dom.firstChild, null);
            if (blockElements.hasOwnProperty(_name) && this.top.type == _model.nodeTypes.paragraph) this.closing = true;
          }
        }
    }
  }, {
    key: "addAll",
    value: function addAll(from, to, sync) {
      var stack = sync && this.stack.slice();
      for (var dom = from; dom != to; dom = dom.nextSibling) {
        this.addDOM(dom);
        if (sync && blockElements.hasOwnProperty(dom.nodeName.toLowerCase())) this.sync(stack);
      }
    }
  }, {
    key: "doClose",
    value: function doClose() {
      if (!this.closing) return;
      var left = this.stack.pop().copy();
      this.top.push(left);
      this.stack.push(left);
      this.closing = false;
    }
  }, {
    key: "insert",
    value: function insert(node) {
      if (this.top.type.contains == node.type.type) {
        this.doClose();
      } else {
        for (var _i = this.stack.length - 1; _i >= 0; _i--) {
          var route = (0, _model.findConnection)(this.stack[_i].type, node.type);
          if (!route) continue;
          if (_i == this.stack.length - 1) this.doClose();else this.stack.length = _i + 1;
          for (var j = 0; j < route.length; j++) {
            var _wrap = new _model.Node(route[j]);
            this.top.push(_wrap);
            this.stack.push(_wrap);
          }
          if (this.styles.length) this.styles = [];
          break;
        }
      }
      this.top.push(node);
    }
  }, {
    key: "enter",
    value: function enter(node) {
      this.insert(node);
      if (this.styles.length) this.styles = [];
      this.stack.push(node);
    }
  }, {
    key: "sync",
    value: function sync(stack) {
      while (this.stack.length > stack.length) this.stack.pop();
      while (!stack[this.stack.length - 1].sameMarkup(stack[this.stack.length - 1])) this.stack.pop();
      while (stack.length > this.stack.length) {
        var add = stack[this.stack.length].copy();
        this.top.push(add);
        this.stack.push(add);
      }
      if (this.styles.length) this.styles = [];
      this.closing = false;
    }
  }, {
    key: "top",
    get: function get() {
      return this.stack[this.stack.length - 1];
    }
  }]);

  return Context;
})();

var tags = Object.create(null);

exports.tags = tags;
function wrap(dom, context, node) {
  context.enter(node);
  context.addAll(dom.firstChild, null, true);
  context.stack.pop();
}

function wrapAs(type) {
  return function (dom, context) {
    return wrap(dom, context, new _model.Node(type));
  };
}

function inline(dom, context, added) {
  var old = context.styles;
  context.styles = _model.style.add(old, added);
  context.addAll(dom.firstChild, null);
  context.styles = old;
}

tags.p = wrapAs("paragraph");

tags.blockquote = wrapAs("blockquote");

var _loop = function () {
  var attrs = { level: i };
  tags["h" + i] = function (dom, context) {
    return wrap(dom, context, new _model.Node("heading", attrs));
  };
};

for (var i = 1; i <= 6; i++) {
  _loop();
}

tags.hr = function (_, context) {
  return context.insert(new _model.Node("horizontal_rule"));
};

tags.pre = function (dom, context) {
  var params = dom.firstChild && /^code$/i.test(dom.firstChild.nodeName) && dom.firstChild.getAttribute("class");
  if (params && /fence/.test(params)) {
    var found = [],
        re = /(?:^|\s)lang-(\S+)/g,
        m = undefined;
    while (m = re.test(params)) found.push(m[1]);
    params = found.join(" ");
  } else {
    params = null;
  }
  context.insert(new _model.Node("code_block", { params: params }, [_model.Span.text(dom.textContent)]));
};

tags.ul = function (dom, context) {
  var cls = dom.getAttribute("class");
  var attrs = { bullet: /bullet_dash/.test(cls) ? "-" : /bullet_plus/.test(cls) ? "+" : "*",
    tight: /\btight\b/.test(dom.getAttribute("class")) };
  wrap(dom, context, new _model.Node("bullet_list", attrs));
};

tags.ol = function (dom, context) {
  var attrs = { order: dom.getAttribute("start") || 1,
    tight: /\btight\b/.test(dom.getAttribute("class")) };
  wrap(dom, context, new _model.Node("ordered_list", attrs));
};

tags.li = wrapAs("list_item");

tags.br = function (dom, context) {
  if (!dom.hasAttribute("pm-force-br")) context.insert(new _model.Span("hard_break", null, context.styles));
};

tags.a = function (dom, context) {
  return inline(dom, context, _model.style.link(dom.getAttribute("href"), dom.getAttribute("title")));
};

tags.b = tags.strong = function (dom, context) {
  return inline(dom, context, _model.style.strong);
};

tags.i = tags.em = function (dom, context) {
  return inline(dom, context, _model.style.em);
};

tags.code = function (dom, context) {
  return inline(dom, context, _model.style.code);
};

tags.img = function (dom, context) {
  var attrs = { src: dom.getAttribute("src"),
    title: dom.getAttribute("title") || null,
    alt: dom.getAttribute("alt") || null };
  context.insert(new _model.Span("image", attrs));
};

},{"../model":37,"./convert":5}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromText = fromText;

var _model = require("../model");

var _convert = require("./convert");

function fromText(text) {
  var blocks = text.trim().split("\n\n");
  var doc = new _model.Node("doc");
  for (var i = 0; i < blocks.length; i++) {
    var para = new _model.Node("paragraph");
    var parts = blocks[i].split("\n");
    for (var j = 0; j < parts.length; j++) {
      if (j) para.push(new _model.Span("hard_break"));
      para.push(_model.Span.text(parts[j]));
    }
    doc.push(para);
  }
  return doc;
}

(0, _convert.defineSource)("text", fromText);

},{"../model":37,"./convert":5}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toDOM = toDOM;
exports.toHTML = toHTML;
exports.renderNodeToDOM = renderNodeToDOM;

var _model = require("../model");

var _convert = require("./convert");

// FIXME un-export, define proper extension mechanism
var render = Object.create(null),
    renderStyle = Object.create(null);

exports.render = render;
exports.renderStyle = renderStyle;
var doc = null;

function toDOM(node, options) {
  doc = options.document;
  return renderNodes(node.content, options);
}

(0, _convert.defineTarget)("dom", toDOM);

function toHTML(node, options) {
  var wrap = options.document.createElement("div");
  wrap.appendChild(toDOM(node, options));
  return wrap.innerHTML;
}

(0, _convert.defineTarget)("html", toHTML);

function renderNodeToDOM(node, options, offset) {
  var dom = renderNode(node, options, offset);
  if (options.renderInlineFlat && node.type.type == "span") {
    dom = wrapInlineFlat(node, dom);
    dom = options.renderInlineFlat(node, dom, offset) || dom;
  }
  return dom;
}

function elt(name) {
  var dom = doc.createElement(name);

  for (var _len = arguments.length, children = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    children[_key - 1] = arguments[_key];
  }

  for (var i = 0; i < children.length; i++) {
    var child = children[i];
    dom.appendChild(typeof child == "string" ? doc.createTextNode(child) : child);
  }
  return dom;
}

function wrap(node, options, type) {
  var dom = elt(type || node.type.name);
  if (node.type.contains != "span") renderNodesInto(node.content, dom, options);else if (options.renderInlineFlat) renderInlineContentFlat(node.content, dom, options);else renderInlineContent(node.content, dom, options);
  return dom;
}

function wrapIn(type) {
  return function (node, options) {
    return wrap(node, options, type);
  };
}

function renderNodes(nodes, options) {
  var frag = doc.createDocumentFragment();
  renderNodesInto(nodes, frag, options);
  return frag;
}

function renderNode(node, options, offset) {
  var dom = render[node.type.name](node, options);
  if (options.onRender) dom = options.onRender(node, dom, offset) || dom;
  return dom;
}

function renderNodesInto(nodes, where, options) {
  for (var i = 0; i < nodes.length; i++) {
    if (options.path) options.path.push(i);
    where.appendChild(renderNode(nodes[i], options, i));
    if (options.path) options.path.pop();
  }
}

function renderInlineContent(nodes, where, options) {
  var top = where;
  var active = [];
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i],
        styles = node.styles;
    var keep = 0;
    for (; keep < Math.min(active.length, styles.length); ++keep) if (!_model.style.same(active[keep], styles[keep])) break;
    while (keep < active.length) {
      active.pop();
      top = top.parentNode;
    }
    while (active.length < styles.length) {
      var add = styles[active.length];
      active.push(add);
      top = top.appendChild(renderStyle[add.type](add));
    }
    top.appendChild(renderNode(node, options, i));
  }
}

function wrapInlineFlat(node, dom) {
  var styles = node.styles;
  for (var i = styles.length - 1; i >= 0; i--) {
    var _wrap = renderStyle[styles[i].type](styles[i]);
    _wrap.appendChild(dom);
    dom = _wrap;
  }
  return dom;
}

function renderInlineContentFlat(nodes, where, options) {
  var offset = 0;
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    var dom = wrapInlineFlat(node, renderNode(node, options, i));
    dom = options.renderInlineFlat(node, dom, offset) || dom;
    where.appendChild(dom);
    offset += node.size;
  }
  if (!nodes.length || nodes[nodes.length - 1].type.name == "hard_break") where.appendChild(elt("br")).setAttribute("pm-force-br", "true");
}

// Block nodes

render.blockquote = wrap;

render.code_block = function (node, options) {
  var code = wrap(node, options, "code");
  if (node.attrs.params != null) code.className = "fence " + node.attrs.params.replace(/(^|\s+)/g, "$&lang-");
  return elt("pre", code);
};

render.heading = function (node, options) {
  return wrap(node, options, "h" + node.attrs.level);
};

render.horizontal_rule = function (_node) {
  return elt("hr");
};

render.bullet_list = function (node, options) {
  var dom = wrap(node, options, "ul");
  var bul = node.attrs.bullet;
  dom.setAttribute("class", bul == "+" ? "bullet_plus" : bul == "-" ? "bullet_dash" : "bullet_star");
  if (node.attrs.tight) dom.setAttribute("class", "tight");
  return dom;
};

render.ordered_list = function (node, options) {
  var dom = wrap(node, options, "ol");
  if (node.attrs.order > 1) dom.setAttribute("start", node.attrs.order);
  if (node.attrs.tight) dom.setAttribute("class", "tight");
  return dom;
};

render.list_item = wrapIn("li");

render.paragraph = wrapIn("p");

render.html_block = function (node) {
  var dom = elt("div");
  dom.innerHTML = node.attrs.html;
  dom.setAttribute("pm-html", "html_block");
  return dom;
};

// Inline content

render.text = function (node) {
  return doc.createTextNode(node.text);
};

render.image = function (node) {
  var dom = elt("img");
  dom.setAttribute("src", node.attrs.src);
  if (node.attrs.title) dom.setAttribute("title", node.attrs.title);
  if (node.attrs.alt) dom.setAttribute("alt", node.attrs.alt);
  return dom;
};

render.hard_break = function (_node) {
  return elt("br");
};

render.html_tag = function (node) {
  var dom = elt("span");
  dom.innerHTML = node.attrs.html;
  dom.setAttribute("pm-html", "html_tag");
  return dom;
};

// Inline styles

renderStyle.em = function () {
  return elt("em");
};

renderStyle.strong = function () {
  return elt("strong");
};

renderStyle.code = function () {
  return elt("code");
};

renderStyle.link = function (style) {
  var dom = elt("a");
  dom.setAttribute("href", style.href);
  if (style.title) dom.setAttribute("title", style.title);
  return dom;
};

},{"../model":37,"./convert":5}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toText = toText;

var _model = require("../model");

var _convert = require("./convert");

function toText(doc) {
  var out = "";
  function explore(node) {
    if (node.type.block) {
      var text = "";
      for (var i = 0; i < node.content.length; i++) {
        var child = node.content[i];
        if (child.type == _model.nodeTypes.text) text += child.text;else if (child.type == _model.nodeTypes.hard_break) text += "\n";
      }
      if (text) out += (out ? "\n\n" : "") + text;
    } else {
      node.content.forEach(explore);
    }
  }
  explore(doc);
  return out;
}

(0, _convert.defineTarget)("text", toText);

},{"../model":37,"./convert":5}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.elt = elt;
exports.requestAnimationFrame = requestAnimationFrame;
exports.rmClass = rmClass;
exports.addClass = addClass;
exports.contains = contains;

function elt(tag, attrs) {
  var result = document.createElement(tag);
  if (attrs) for (var _name in attrs) {
    if (_name == "style") result.style.cssText = attrs[_name];else if (attrs[_name] != null) result.setAttribute(_name, attrs[_name]);
  }

  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  for (var i = 0; i < args.length; i++) {
    add(args[i], result);
  }return result;
}

function add(value, target) {
  if (typeof value == "string") value = document.createTextNode(value);
  if (Array.isArray(value)) {
    for (var i = 0; i < value.length; i++) {
      add(value[i], target);
    }
  } else {
    target.appendChild(value);
  }
}

var reqFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

function requestAnimationFrame(f) {
  if (reqFrame) reqFrame(f);else setTimeout(f, 10);
}

var ie_upto10 = /MSIE \d/.test(navigator.userAgent);
var ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);

var browser = {
  mac: /Mac/.test(navigator.platform),
  ie_upto10: ie_upto10,
  ie_11up: ie_11up,
  ie: ie_upto10 || ie_11up,
  gecko: /gecko\/\d/i.test(navigator.userAgent)
};

exports.browser = browser;
function classTest(cls) {
  return new RegExp("(^|\\s)" + cls + "(?:$|\\s)\\s*");
}

function rmClass(node, cls) {
  var current = node.className;
  var match = classTest(cls).exec(current);
  if (match) {
    var after = current.slice(match.index + match[0].length);
    node.className = current.slice(0, match.index) + (after ? match[1] + after : "");
  }
}

function addClass(node, cls) {
  var current = node.className;
  if (!classTest(cls).test(current)) node.className += (current ? " " : "") + cls;
}

function contains(parent, child) {
  // Android browser and IE will return false if child is a text node.
  if (child.nodeType != 1) child = child.parentNode;
  return child && parent.contains(child);
}

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isWordChar = isWordChar;
exports.charCategory = charCategory;
var nonASCIISingleCaseWordChar = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;

function isWordChar(ch) {
  return (/\w/.test(ch) || ch > "\x80" && (ch.toUpperCase() != ch.toLowerCase() || nonASCIISingleCaseWordChar.test(ch))
  );
}

function charCategory(ch) {
  return (/\s/.test(ch) ? "space" : isWordChar(ch) ? "word" : "other"
  );
}

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCommand = registerCommand;
exports.execCommand = execCommand;

var _model = require("../model");

var _transform = require("../transform");

var _char = require("./char");

var commands = Object.create(null);

function registerCommand(name, func) {
  commands[name] = func;
}

function execCommand(pm, name) {
  var ext = pm.input.commandExtensions[name];
  if (ext && ext.high) for (var i = 0; i < ext.high.length; i++) {
    if (ext.high[i](pm) !== false) return true;
  }if (ext && ext.normal) for (var i = 0; i < ext.normal.length; i++) {
    if (ext.normal[i](pm) !== false) return true;
  }var base = commands[name];
  if (base && base(pm) !== false) return true;
  if (ext && ext.low) for (var i = 0; i < ext.low.length; i++) {
    if (ext.low[i](pm) !== false) return true;
  }return false;
}

function clearSel(pm) {
  var sel = pm.selection,
      tr = pm.tr;
  if (!sel.empty) tr["delete"](sel.from, sel.to);
  return tr;
}

commands.insertHardBreak = function (pm) {
  pm.scrollIntoView();
  var tr = clearSel(pm),
      pos = pm.selection.from;
  if (pm.doc.path(pos.path).type == _model.nodeTypes.code_block) tr.insertText(pos, "\n");else tr.insert(pos, new _model.Span("hard_break"));
  return pm.apply(tr);
};

commands.setStrong = function (pm) {
  return pm.setInlineStyle(_model.style.strong, true);
};
commands.unsetStrong = function (pm) {
  return pm.setInlineStyle(_model.style.strong, false);
};
commands.toggleStrong = function (pm) {
  return pm.setInlineStyle(_model.style.strong, null);
};

commands.setEm = function (pm) {
  return pm.setInlineStyle(_model.style.em, true);
};
commands.unsetEm = function (pm) {
  return pm.setInlineStyle(_model.style.em, false);
};
commands.toggleEm = function (pm) {
  return pm.setInlineStyle(_model.style.em, null);
};

commands.setCode = function (pm) {
  return pm.setInlineStyle(_model.style.code, true);
};
commands.unsetCode = function (pm) {
  return pm.setInlineStyle(_model.style.code, false);
};
commands.toggleCode = function (pm) {
  return pm.setInlineStyle(_model.style.code, null);
};

function blockBefore(pos) {
  for (var i = pos.path.length - 1; i >= 0; i--) {
    var offset = pos.path[i] - 1;
    if (offset >= 0) return new _model.Pos(pos.path.slice(0, i), offset);
  }
}

function delBlockBackward(pm, tr, pos) {
  if (pos.depth == 1) {
    // Top level block, join with block above
    var iBefore = _model.Pos.before(pm.doc, new _model.Pos([], pos.path[0]));
    var bBefore = blockBefore(pos);
    if (iBefore && bBefore) {
      if (iBefore.cmp(bBefore) > 0) bBefore = null;else iBefore = null;
    }
    if (iBefore) {
      tr["delete"](iBefore, pos);
      var joinable = (0, _transform.joinPoint)(tr.doc, tr.map(pos).pos, 1);
      if (joinable) tr.join(joinable);
    } else if (bBefore) {
      tr["delete"](bBefore, bBefore.shift(1));
    }
  } else {
    var last = pos.depth - 1;
    var _parent = pm.doc.path(pos.path.slice(0, last));
    var offset = pos.path[last];
    // Top of list item below other list item
    // Join with the one above
    if (_parent.type == _model.nodeTypes.list_item && offset == 0 && pos.path[last - 1] > 0) {
      tr.join((0, _transform.joinPoint)(pm.doc, pos));
      // Any other nested block, lift up
    } else {
        tr.lift(pos, pos);
        var next = pos.depth - 2;
        // Split list item when we backspace back into it
        if (next > 0 && offset > 0 && pm.doc.path(pos.path.slice(0, next)).type == _model.nodeTypes.list_item) tr.split(new _model.Pos(pos.path.slice(0, next), pos.path[next] + 1));
      }
  }
}

function moveBackward(parent, offset, by) {
  if (by == "char") return offset - 1;
  if (by == "word") {
    var _spanAtOrBefore = (0, _model.spanAtOrBefore)(parent, offset);

    var nodeOffset = _spanAtOrBefore.offset;
    var innerOffset = _spanAtOrBefore.innerOffset;

    var cat = null,
        counted = 0;
    for (; nodeOffset >= 0; nodeOffset--, innerOffset = null) {
      var child = parent.content[nodeOffset],
          size = child.size;
      if (child.type != _model.nodeTypes.text) return cat ? offset : offset - 1;

      for (var i = innerOffset == null ? size : innerOffset; i > 0; i--) {
        var nextCharCat = (0, _char.charCategory)(child.text.charAt(i - 1));
        if (cat == null || counted == 1 && cat == "space") cat = nextCharCat;else if (cat != nextCharCat) return offset;
        offset--;
        counted++;
      }
    }
    return offset;
  }
  throw new Error("Unknown motion unit: " + by);
}

function delBackward(pm, by) {
  pm.scrollIntoView();

  var tr = pm.tr,
      sel = pm.selection,
      from = sel.from;
  if (!sel.empty) tr["delete"](from, sel.to);else if (from.offset == 0) delBlockBackward(pm, tr, from);else tr["delete"](new _model.Pos(from.path, moveBackward(pm.doc.path(from.path), from.offset, by)), from);
  return pm.apply(tr);
}

commands.delBackward = function (pm) {
  return delBackward(pm, "char");
};

commands.delWordBackward = function (pm) {
  return delBackward(pm, "word");
};

function blockAfter(doc, pos) {
  var path = pos.path;
  while (path.length > 0) {
    var end = path.length - 1;
    var offset = path[end] + 1;
    path = path.slice(0, end);
    var node = doc.path(path);
    if (offset < node.content.length) return new _model.Pos(path, offset);
  }
}

function delBlockForward(pm, tr, pos) {
  var lst = pos.depth - 1;
  var iAfter = _model.Pos.after(pm.doc, new _model.Pos(pos.path.slice(0, lst), pos.path[lst] + 1));
  var bAfter = blockAfter(pm.doc, pos);
  if (iAfter && bAfter) {
    if (iAfter.cmp(bAfter.shift(1)) < 0) bAfter = null;else iAfter = null;
  }

  if (iAfter) {
    tr["delete"](pos, iAfter);
    var joinable = (0, _transform.joinPoint)(tr.doc, tr.map(pos).pos, 1);
    if (joinable) tr.join(joinable);
  } else if (bAfter) {
    tr["delete"](bAfter, bAfter.shift(1));
  }
}

function moveForward(parent, offset, by) {
  if (by == "char") return offset + 1;
  if (by == "word") {
    var _spanAtOrBefore2 = (0, _model.spanAtOrBefore)(parent, offset);

    var nodeOffset = _spanAtOrBefore2.offset;
    var innerOffset = _spanAtOrBefore2.innerOffset;

    var cat = null,
        counted = 0;
    for (; nodeOffset < parent.content.length; nodeOffset++, innerOffset = 0) {
      var child = parent.content[nodeOffset],
          size = child.size;
      if (child.type != _model.nodeTypes.text) return cat ? offset : offset + 1;

      for (var i = innerOffset; i < size; i++) {
        var nextCharCat = (0, _char.charCategory)(child.text.charAt(i));
        if (cat == null || counted == 1 && cat == "space") cat = nextCharCat;else if (cat != nextCharCat) return offset;
        offset++;
        counted++;
      }
    }
    return offset;
  }
  throw new Error("Unknown motion unit: " + by);
}

function delForward(pm, by) {
  pm.scrollIntoView();
  var tr = pm.tr,
      sel = pm.selection,
      from = sel.from;
  if (!sel.empty) {
    tr["delete"](from, sel.to);
  } else {
    var _parent2 = pm.doc.path(from.path);
    if (from.offset == _parent2.size) delBlockForward(pm, tr, from);else tr["delete"](from, new _model.Pos(from.path, moveForward(_parent2, from.offset, by)));
  }
  return pm.apply(tr);
}

commands.delForward = function (pm) {
  return delForward(pm, "char");
};

commands.delWordForward = function (pm) {
  return delForward(pm, "word");
};

function scrollAnd(pm, value) {
  pm.scrollIntoView();
  return value;
}

commands.undo = function (pm) {
  return scrollAnd(pm, pm.history.undo());
};
commands.redo = function (pm) {
  return scrollAnd(pm, pm.history.redo());
};

commands.join = function (pm) {
  var point = (0, _transform.joinPoint)(pm.doc, pm.selection.head);
  if (!point) return false;
  return pm.apply(pm.tr.join(point));
};

commands.lift = function (pm) {
  var sel = pm.selection;
  var result = pm.apply(pm.tr.lift(sel.from, sel.to));
  if (result !== false) pm.scrollIntoView();
  return result;
};

function wrap(pm, type) {
  var sel = pm.selection;
  pm.scrollIntoView();
  return pm.apply(pm.tr.wrap(sel.from, sel.to, new _model.Node(type)));
}

commands.wrapBulletList = function (pm) {
  return wrap(pm, "bullet_list");
};
commands.wrapOrderedList = function (pm) {
  return wrap(pm, "ordered_list");
};
commands.wrapBlockquote = function (pm) {
  return wrap(pm, "blockquote");
};

commands.endBlock = function (pm) {
  pm.scrollIntoView();
  var pos = pm.selection.from;
  var tr = clearSel(pm);
  var block = pm.doc.path(pos.path);
  if (pos.depth > 1 && block.content.length == 0 && tr.lift(pos).steps.length) {
    // Lift
  } else if (block.type == _model.nodeTypes.code_block && pos.offset < block.size) {
      tr.insertText(pos, "\n");
    } else {
      var end = pos.depth - 1;
      var isList = end > 0 && pos.path[end] == 0 && pm.doc.path(pos.path.slice(0, end)).type == _model.nodeTypes.list_item;
      var type = pos.offset == block.size ? new _model.Node("paragraph") : null;
      tr.split(pos, isList ? 2 : 1, type);
    }
  return pm.apply(tr);
};

function setType(pm, type, attrs) {
  var sel = pm.selection;
  pm.scrollIntoView();
  return pm.apply(pm.tr.setBlockType(sel.from, sel.to, new _model.Node(type, attrs)));
}

commands.makeH1 = function (pm) {
  return setType(pm, "heading", { level: 1 });
};
commands.makeH2 = function (pm) {
  return setType(pm, "heading", { level: 2 });
};
commands.makeH3 = function (pm) {
  return setType(pm, "heading", { level: 3 });
};
commands.makeH4 = function (pm) {
  return setType(pm, "heading", { level: 4 });
};
commands.makeH5 = function (pm) {
  return setType(pm, "heading", { level: 5 });
};
commands.makeH6 = function (pm) {
  return setType(pm, "heading", { level: 6 });
};

commands.makeParagraph = function (pm) {
  return setType(pm, "paragraph");
};
commands.makeCodeBlock = function (pm) {
  return setType(pm, "code_block");
};

function insertOpaqueBlock(pm, type, attrs) {
  type = _model.nodeTypes[type];
  pm.scrollIntoView();
  var pos = pm.selection.from;
  var tr = clearSel(pm);
  var parent = tr.doc.path(pos.path);
  if (parent.type.type != type.type) return false;
  var off = 0;
  if (pos.offset) {
    tr.split(pos);
    off = 1;
  }
  return pm.apply(tr.insert(pos.shorten(null, off), new _model.Node(type, attrs)));
}

commands.insertRule = function (pm) {
  return insertOpaqueBlock(pm, "horizontal_rule");
};

},{"../model":37,"../transform":44,"./char":11}],13:[function(require,module,exports){
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _insertCss = require("insert-css");

var _insertCss2 = _interopRequireDefault(_insertCss);

(0, _insertCss2["default"])("\n\n.ProseMirror {\n  border: 1px solid silver;\n  position: relative;\n}\n\n.ProseMirror-content {\n  padding: 4px 8px 4px 14px;\n  white-space: pre-wrap;\n  line-height: 1.2;\n}\n\n.ProseMirror-content ul.tight p, .ProseMirror-content ol.tight p {\n  margin: 0;\n}\n\n.ProseMirror-content ul, .ProseMirror-content ol {\n  padding-left: 2em;\n}\n\n.ProseMirror-content blockquote {\n  padding-left: 1em;\n  border-left: 3px solid #eee;\n  margin-left: 0; margin-right: 0;\n}\n\n.ProseMirror-content pre {\n  white-space: pre-wrap;\n}\n\n.ProseMirror-content p:first-child,\n.ProseMirror-content h1:first-child,\n.ProseMirror-content h2:first-child,\n.ProseMirror-content h3:first-child,\n.ProseMirror-content h4:first-child,\n.ProseMirror-content h5:first-child,\n.ProseMirror-content h6:first-child {\n  margin-top: .3em;\n}\n\n");

},{"insert-css":2}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ref;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _keys = require("./keys");

var _dom = require("../dom");

var mod = _dom.browser.mac ? "Cmd-" : "Ctrl-";

var defaultKeymap = new _keys.Keymap((_ref = {
  "Enter": "endBlock"
}, _defineProperty(_ref, mod + "Enter", "insertHardBreak"), _defineProperty(_ref, "Shift-Enter", "insertHardBreak"), _defineProperty(_ref, "Backspace", "delBackward"), _defineProperty(_ref, "Delete", "delForward"), _defineProperty(_ref, mod + "B", "toggleStrong"), _defineProperty(_ref, mod + "I", "toggleEm"), _defineProperty(_ref, mod + "`", "toggleCode"), _defineProperty(_ref, mod + "Backspace", "delWordBackward"), _defineProperty(_ref, mod + "Delete", "delWordForward"), _defineProperty(_ref, mod + "Z", "undo"), _defineProperty(_ref, mod + "Y", "redo"), _defineProperty(_ref, "Shift-" + mod + "Z", "redo"), _defineProperty(_ref, "Alt-Up", "join"), _defineProperty(_ref, "Alt-Left", "lift"), _defineProperty(_ref, "Alt-Right '*'", "wrapBulletList"), _defineProperty(_ref, "Alt-Right '1'", "wrapOrderedList"), _defineProperty(_ref, "Alt-Right '>'", "wrapBlockquote"), _defineProperty(_ref, mod + "H '1'", "makeH1"), _defineProperty(_ref, mod + "H '2'", "makeH2"), _defineProperty(_ref, mod + "H '3'", "makeH3"), _defineProperty(_ref, mod + "H '4'", "makeH4"), _defineProperty(_ref, mod + "H '5'", "makeH5"), _defineProperty(_ref, mod + "H '6'", "makeH6"), _defineProperty(_ref, mod + "P", "makeParagraph"), _defineProperty(_ref, mod + "\\", "makeCodeBlock"), _defineProperty(_ref, mod + "Space", "insertRule"), _ref));

exports.defaultKeymap = defaultKeymap;
function add(key, val) {
  defaultKeymap.addBinding(key, val);
}

if (_dom.browser.mac) {
  add("Ctrl-D", "delForward");
  add("Ctrl-H", "delBackward");
  add("Ctrl-Alt-Backspace", "delWordForward");
  add("Alt-D", "delWordForward");
  add("Alt-Delete", "delWordForward");
  add("Alt-Backspace", "delWordBackward");
}

},{"../dom":10,"./keys":21}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyDOMChange = applyDOMChange;
exports.textContext = textContext;
exports.textInContext = textInContext;

var _model = require("../model");

var _convertFrom_dom = require("../convert/from_dom");

var _transformTree = require("../transform/tree");

var _selection = require("./selection");

function isAtEnd(node, pos, depth) {
  for (var i = depth || 0; i < pos.path.length; i++) {
    var n = pos.path[depth];
    if (n < node.content.length - 1) return false;
    node = node.content[n];
  }
  return pos.offset == node.maxOffset;
}
function isAtStart(pos, depth) {
  if (pos.offset > 0) return false;
  for (var i = depth || 0; i < pos.path.length; i++) {
    if (pos.path[depth] > 0) return false;
  }return true;
}

function parseNearSelection(pm) {
  var dom = pm.content,
      node = pm.doc;
  var from = pm.selection.from,
      to = pm.selection.to;
  for (var depth = 0;; depth++) {
    var toNode = node.content[to.path[depth]];
    var fromStart = isAtStart(from, depth + 1);
    var toEnd = isAtEnd(toNode, to, depth + 1);
    if (fromStart || toEnd || from.path[depth] != to.path[depth] || toNode.type.block) {
      var startOffset = depth == from.depth ? from.offset : from.path[depth];
      if (fromStart && startOffset > 0) startOffset--;
      var endOffset = depth == to.depth ? to.offset : to.path[depth] + 1;
      if (toEnd && endOffset < node.content.length - 1) endOffset++;
      var parsed = (0, _convertFrom_dom.fromDOM)(dom, { topNode: node.copy(), from: startOffset, to: dom.childNodes.length - (node.content.length - endOffset) });
      parsed.content = node.content.slice(0, startOffset).concat(parsed.content).concat(node.content.slice(endOffset));
      for (var i = depth - 1; i >= 0; i--) {
        var wrap = pm.doc.path(from.path.slice(0, i));
        var copy = wrap.copy(wrap.content.slice());
        copy.content[from.path[i]] = parsed;
        parsed = copy;
      }
      return parsed;
    }
    node = toNode;
    dom = (0, _selection.findByPath)(dom, from.path[depth], false);
  }
}

function applyDOMChange(pm) {
  var updated = parseNearSelection(pm);
  var changeStart = (0, _model.findDiffStart)(pm.doc, updated);
  if (changeStart) {
    var changeEnd = findDiffEndConstrained(pm.doc, updated, changeStart);
    pm.apply(pm.tr.replace(changeStart.a, changeEnd.a, updated, changeStart.b, changeEnd.b));
    pm.operation.fullRedraw = true;
    return true;
  } else {
    return false;
  }
}

function offsetBy(first, second, pos) {
  var same = (0, _transformTree.samePathDepth)(first, second);
  var firstEnd = same == first.depth,
      secondEnd = same == second.depth;
  var off = (secondEnd ? second.offset : second.path[same]) - (firstEnd ? first.offset : first.path[same]);
  var shorter = firstEnd ? pos.shift(off) : pos.shorten(same, off);
  if (secondEnd) return shorter;else return shorter.extend(new _model.Pos(second.path.slice(same), second.offset));
}

function findDiffEndConstrained(a, b, start) {
  var end = (0, _model.findDiffEnd)(a, b);
  if (!end) return end;
  if (end.a.cmp(start.a) < 0) return { a: start.a, b: offsetBy(end.a, start.a, end.b) };
  if (end.b.cmp(start.b) < 0) return { a: offsetBy(end.b, start.b, end.a), b: start.b };
  return end;
}

// Text-only queries for composition events

function textContext(data) {
  var range = getSelection().getRangeAt(0);
  var start = range.startContainer,
      end = range.endContainer;
  if (start == end && start.nodeType == 3) {
    var value = start.nodeValue,
        lead = range.startOffset,
        _end = range.endOffset;
    if (data && _end >= data.length && value.slice(_end - data.length, _end) == data) lead = _end - data.length;
    return { inside: start, lead: lead, trail: value.length - _end };
  }

  var sizeBefore = null,
      sizeAfter = null;
  var before = start.childNodes[range.startOffset - 1] || nodeBefore(start);
  while (before.lastChild) before = before.lastChild;
  if (before && before.nodeType == 3) {
    var value = before.nodeValue;
    sizeBefore = value.length;
    if (data && value.slice(value.length - data.length) == data) sizeBefore -= data.length;
  }
  var after = end.childNodes[range.endOffset] || nodeAfter(end);
  while (after.firstChild) after = after.firstChild;
  if (after && after.nodeType == 3) sizeAfter = after.nodeValue.length;

  return { before: before, sizeBefore: sizeBefore,
    after: after, sizeAfter: sizeAfter };
}

function textInContext(context, deflt) {
  if (context.inside) {
    var _val = context.inside.nodeValue;
    return _val.slice(context.lead, _val.length - context.trail);
  } else {
    var before = context.before,
        after = context.after,
        val = "";
    if (!before) return deflt;
    if (before.nodeType == 3) val = before.nodeValue.slice(context.sizeBefore);
    var scan = scanText(before, after);
    if (scan == null) return deflt;
    val += scan;
    if (after && after.nodeType == 3) {
      var valAfter = after.nodeValue;
      val += valAfter.slice(0, valAfter.length - context.sizeAfter);
    }
    return val;
  }
}

function nodeAfter(node) {
  for (;;) {
    var next = node.nextSibling;
    if (next) {
      while (next.firstChild) next = next.firstChild;
      return next;
    }
    if (!(node = node.parentElement)) return null;
  }
}

function nodeBefore(node) {
  for (;;) {
    var prev = node.previousSibling;
    if (prev) {
      while (prev.lastChild) prev = prev.lastChild;
      return prev;
    }
    if (!(node = node.parentElement)) return null;
  }
}

function scanText(start, end) {
  var text = "",
      cur = start;
  for (;;) {
    if (cur == end) return text;
    if (!cur) return null;
    if (cur.nodeType == 3) text += cur.nodeValue;
    cur = cur.firstChild || nodeAfter(cur);
  }
}

},{"../convert/from_dom":6,"../model":37,"../transform/tree":52,"./selection":26}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.draw = draw;
exports.redraw = redraw;

var _model = require("../model");

var _convertTo_dom = require("../convert/to_dom");

var _dom = require("../dom");

var nonEditable = { html_block: true, html_tag: true, horizontal_rule: true };

function options(path, ranges) {
  return {
    onRender: function onRender(node, dom, offset) {
      if (node.type.type != "span" && offset != null) dom.setAttribute("pm-path", offset);
      if (nonEditable.hasOwnProperty(node.type.name)) dom.contentEditable = false;
      return dom;
    },
    renderInlineFlat: function renderInlineFlat(node, dom, offset) {
      ranges.advanceTo(new _model.Pos(path, offset));
      var end = new _model.Pos(path, offset + node.size);
      var nextCut = ranges.nextChangeBefore(end);

      var inner = dom,
          wrapped = undefined;
      for (var i = 0; i < node.styles.length; i++) {
        inner = inner.firstChild;
      }if (dom.nodeType != 1) {
        dom = (0, _dom.elt)("span", null, dom);
        if (!nextCut) wrapped = dom;
      }
      if (!wrapped && (nextCut || ranges.current.length)) {
        wrapped = inner == dom ? dom = (0, _dom.elt)("span", null, inner) : inner.parentNode.appendChild((0, _dom.elt)("span", null, inner));
      }

      dom.setAttribute("pm-span", offset + "-" + end.offset);
      if (node.type != _model.nodeTypes.text) dom.setAttribute("pm-span-atom", "true");

      var inlineOffset = 0;
      while (nextCut) {
        var size = nextCut - offset;
        var split = splitSpan(wrapped, size);
        if (ranges.current.length) split.className = ranges.current.join(" ");
        split.setAttribute("pm-span-offset", inlineOffset);
        inlineOffset += size;
        offset += size;
        ranges.advanceTo(new _model.Pos(path, offset));
        if (!(nextCut = ranges.nextChangeBefore(end))) wrapped.setAttribute("pm-span-offset", inlineOffset);
      }

      if (ranges.current.length) wrapped.className = ranges.current.join(" ");
      return dom;
    },
    document: document,
    path: path
  };
}

function splitSpan(span, at) {
  var textNode = span.firstChild,
      text = textNode.nodeValue;
  var newNode = span.parentNode.insertBefore((0, _dom.elt)("span", null, text.slice(0, at)), span);
  textNode.nodeValue = text.slice(at);
  return newNode;
}

function draw(pm, doc) {
  pm.content.textContent = "";
  pm.content.appendChild((0, _convertTo_dom.toDOM)(doc, options([], pm.ranges.activeRangeTracker())));
}

function deleteNextNodes(parent, at, amount) {
  for (var i = 0; i < amount; i++) {
    var prev = at;
    at = at.nextSibling;
    parent.removeChild(prev);
  }
  return at;
}

function redraw(pm, dirty, doc, prev) {
  var ranges = pm.ranges.activeRangeTracker();
  var path = [];

  function scan(dom, node, prev) {
    var status = [],
        inPrev = [],
        inNode = [];
    for (var i = 0, _j = 0; i < prev.content.length && _j < node.content.length; i++) {
      var cur = prev.content[i],
          dirtyStatus = dirty.get(cur);
      status.push(dirtyStatus);
      var matching = dirtyStatus ? -1 : node.content.indexOf(cur, _j);
      if (matching > -1) {
        inNode[i] = matching;
        inPrev[matching] = i;
        _j = matching + 1;
      }
    }

    if (node.type.contains == "span") {
      var needsBR = node.content.length == 0 || node.content[node.content.length - 1].type == _model.nodeTypes.hard_break;
      var last = dom.lastChild,
          hasBR = last && last.nodeType == 1 && last.hasAttribute("pm-force-br");
      if (needsBR && !hasBR) dom.appendChild((0, _dom.elt)("br", { "pm-force-br": "true" }));else if (!needsBR && hasBR) dom.removeChild(last);
    }

    var domPos = dom.firstChild,
        j = 0;
    var block = node.type.block;
    for (var i = 0, offset = 0; i < node.content.length; i++) {
      var child = node.content[i];
      if (!block) path.push(i);
      var found = inPrev[i];
      var nodeLeft = true;
      if (found > -1) {
        domPos = deleteNextNodes(dom, domPos, found - j);
        j = found;
      } else if (!block && j < prev.content.length && inNode[j] == null && status[j] != 2 && child.sameMarkup(prev.content[j])) {
        scan(domPos, child, prev.content[j]);
      } else {
        dom.insertBefore((0, _convertTo_dom.renderNodeToDOM)(child, options(path, ranges), block ? offset : i), domPos);
        nodeLeft = false;
      }
      if (nodeLeft) {
        if (block) domPos.setAttribute("pm-span", offset + "-" + (offset + child.size));else domPos.setAttribute("pm-path", i);
        domPos = domPos.nextSibling;
        j++;
      }
      if (block) offset += child.size;else path.pop();
    }
    deleteNextNodes(dom, domPos, prev.content.length - j);
  }
  scan(pm.content, doc, prev);
}

},{"../convert/to_dom":8,"../dom":10,"../model":37}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addEventListener = addEventListener;
exports.removeEventListener = removeEventListener;
exports.signal = signal;
exports.hasHandler = hasHandler;
exports.eventMixin = eventMixin;

function addEventListener(emitter, type, f) {
  var map = emitter._handlers || (emitter._handlers = {});
  var arr = map[type] || (map[type] = []);
  arr.push(f);
}

function removeEventListener(emitter, type, f) {
  var arr = emitter._handlers && emitter._handlers[type];
  if (arr) for (var i = 0; i < arr.length; ++i) {
    if (arr[i] == f) {
      arr.splice(i, 1);break;
    }
  }
}

function signal(emitter, type) {
  var arr = emitter._handlers && emitter._handlers[type];

  for (var _len = arguments.length, values = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    values[_key - 2] = arguments[_key];
  }

  if (arr) for (var i = 0; i < arr.length; ++i) {
    arr[i].apply(arr, values);
  }
}

function hasHandler(emitter, type) {
  var arr = emitter._handlers && emitter._handlers[type];
  return arr && arr.length > 0;
}

// Add event-related methods to a constructor's prototype, to make
// registering events on such objects more convenient.

function eventMixin(ctor) {
  var proto = ctor.prototype;
  proto.on = proto.addEventListener = function (type, f) {
    addEventListener(this, type, f);
  };
  proto.off = proto.removeEventListener = function (type, f) {
    removeEventListener(this, type, f);
  };
  proto.signal = function (type) {
    for (var _len2 = arguments.length, values = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      values[_key2 - 1] = arguments[_key2];
    }

    signal.apply(undefined, [this, type].concat(values));
  };
}

},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _model = require("../model");

var _transform = require("../transform");

var InvertedStep = function InvertedStep(step, version, id) {
  _classCallCheck(this, InvertedStep);

  this.step = step;
  this.version = version;
  this.id = id;
};

var BranchRemapping = (function () {
  function BranchRemapping(branch) {
    _classCallCheck(this, BranchRemapping);

    this.branch = branch;
    this.remap = new _transform.Remapping();
    this.version = branch.version;
    this.mirrorBuffer = Object.create(null);
  }

  _createClass(BranchRemapping, [{
    key: "moveToVersion",
    value: function moveToVersion(version) {
      while (this.version > version) this.addNextMap();
    }
  }, {
    key: "addNextMap",
    value: function addNextMap() {
      var found = this.branch.mirror[this.version];
      var mapOffset = this.branch.maps.length - (this.branch.version - this.version) - 1;
      var id = this.remap.addToFront(this.branch.maps[mapOffset], this.mirrorBuffer[this.version]);
      --this.version;
      if (found != null) this.mirrorBuffer[found] = id;
      return id;
    }
  }, {
    key: "movePastStep",
    value: function movePastStep(result) {
      var id = this.addNextMap();
      if (result) this.remap.addToBack(result.map, id);
    }
  }]);

  return BranchRemapping;
})();

var workTime = 100,
    pauseTime = 150;

var CompressionWorker = (function () {
  function CompressionWorker(doc, branch, callback) {
    _classCallCheck(this, CompressionWorker);

    this.branch = branch;
    this.callback = callback;
    this.remap = new BranchRemapping(branch);

    this.doc = doc;
    this.events = [];
    this.maps = [];
    this.version = this.startVersion = branch.version;

    this.i = branch.events.length;
    this.timeout = null;
    this.aborted = false;
  }

  _createClass(CompressionWorker, [{
    key: "work",
    value: function work() {
      var _this = this;

      if (this.aborted) return;

      var endTime = Date.now() + workTime;

      for (;;) {
        if (this.i == 0) return this.finish();
        var _event = this.branch.events[--this.i],
            outEvent = [];
        for (var j = _event.length - 1; j >= 0; j--) {
          var _event$j = _event[j];
          var step = _event$j.step;
          var stepVersion = _event$j.version;
          var stepID = _event$j.id;

          this.remap.moveToVersion(stepVersion);

          var mappedStep = (0, _transform.mapStep)(step, this.remap.remap);
          if (mappedStep && isDelStep(step)) {
            var extra = 0,
                start = step.from;
            while (j > 0) {
              var next = _event[j - 1];
              if (next.version != stepVersion - 1 || !isDelStep(next.step) || start.cmp(next.step.to)) break;
              extra += next.step.to.offset - next.step.from.offset;
              start = next.step.from;
              stepVersion--;
              j--;
              this.remap.addNextMap();
            }
            if (extra > 0) {
              var _start = mappedStep.from.shift(-extra);
              mappedStep = new _transform.Step("replace", _start, mappedStep.to, _start, { nodes: [], openLeft: 0, openRight: 0 });
            }
          }
          var result = mappedStep && (0, _transform.applyStep)(this.doc, mappedStep);
          if (result) {
            this.doc = result.doc;
            this.maps.push(result.map.invert());
            outEvent.push(new InvertedStep(mappedStep, this.version, stepID));
            this.version--;
          }
          this.remap.movePastStep(result);
        }
        if (outEvent.length) {
          outEvent.reverse();
          this.events.push(outEvent);
        }
        if (Date.now() > endTime) {
          this.timeout = window.setTimeout(function () {
            return _this.work();
          }, pauseTime);
          return;
        }
      }
    }
  }, {
    key: "finish",
    value: function finish() {
      if (this.aborted) return;

      this.events.reverse();
      this.maps.reverse();
      this.callback(this.maps.concat(this.branch.maps.slice(this.branch.maps.length - (this.branch.version - this.startVersion))), this.events);
    }
  }, {
    key: "abort",
    value: function abort() {
      this.aborted = true;
      window.clearTimeout(this.timeout);
    }
  }]);

  return CompressionWorker;
})();

function isDelStep(step) {
  return step.name == "replace" && step.from.offset < step.to.offset && _model.Pos.samePath(step.from.path, step.to.path) && step.param.nodes.length == 0;
}

var compressStepCount = 150;

var Branch = (function () {
  function Branch(maxDepth) {
    _classCallCheck(this, Branch);

    this.maxDepth = maxDepth;
    this.version = 0;
    this.nextStepID = 1;

    this.maps = [];
    this.mirror = Object.create(null);
    this.events = [];

    this.stepsSinceCompress = 0;
    this.compressing = null;
    this.compressTimeout = null;
  }

  _createClass(Branch, [{
    key: "clear",
    value: function clear(force) {
      if (force || !this.empty()) {
        this.maps.length = this.events.length = this.stepsSinceCompress = 0;
        this.mirror = Object.create(null);
        this.abortCompression();
      }
    }
  }, {
    key: "newEvent",
    value: function newEvent() {
      this.abortCompression();
      this.events.push([]);
      while (this.events.length > this.maxDepth) this.events.shift();
    }
  }, {
    key: "addMap",
    value: function addMap(map) {
      if (!this.empty()) {
        this.maps.push(map);
        this.version++;
        this.stepsSinceCompress++;
        return true;
      }
    }
  }, {
    key: "empty",
    value: function empty() {
      return this.events.length == 0;
    }
  }, {
    key: "addStep",
    value: function addStep(step, map, id) {
      this.addMap(map);
      if (id == null) id = this.nextStepID++;
      this.events[this.events.length - 1].push(new InvertedStep(step, this.version, id));
    }
  }, {
    key: "addTransform",
    value: function addTransform(transform, ids) {
      this.abortCompression();
      for (var i = 0; i < transform.steps.length; i++) {
        var inverted = (0, _transform.invertStep)(transform.steps[i], transform.docs[i], transform.maps[i]);
        this.addStep(inverted, transform.maps[i], ids && ids[i]);
      }
    }
  }, {
    key: "popEvent",
    value: function popEvent(doc, allowCollapsing) {
      this.abortCompression();
      var event = this.events.pop();
      if (!event) return null;

      var remap = new BranchRemapping(this),
          collapsing = allowCollapsing;
      var tr = new _transform.Transform(doc);
      var ids = [];

      for (var i = event.length - 1; i >= 0; i--) {
        var invertedStep = event[i],
            step = invertedStep.step;
        if (!collapsing || invertedStep.version != remap.version) {
          collapsing = false;
          remap.moveToVersion(invertedStep.version);

          step = (0, _transform.mapStep)(step, remap.remap);
          var result = step && tr.step(step);
          if (result) {
            ids.push(invertedStep.id);
            if (this.addMap(result.map)) this.mirror[this.version] = invertedStep.version;
          }

          if (i > 0) remap.movePastStep(result);
        } else {
          this.version--;
          delete this.mirror[this.version];
          this.maps.pop();
          tr.step(step);
          ids.push(invertedStep.id);
          --remap.version;
        }
      }
      if (this.empty()) this.clear(true);
      return { transform: tr, ids: ids };
    }
  }, {
    key: "getVersion",
    value: function getVersion() {
      return { id: this.nextStepID, version: this.version };
    }
  }, {
    key: "findVersion",
    value: function findVersion(version) {
      for (var i = this.events.length - 1; i >= 0; i--) {
        var _event2 = this.events[i];
        for (var j = _event2.length - 1; j >= 0; j--) {
          var step = _event2[j];
          if (step.id == version.id) return { event: i, step: j };else if (step.id < version.id) return { event: i, step: j + 1 };
        }
      }
    }
  }, {
    key: "rebased",
    value: function rebased(newMaps, rebasedTransform, positions) {
      if (this.empty()) return;
      this.abortCompression();

      var startVersion = this.version - positions.length;

      // Update and clean up the events
      out: for (var i = this.events.length - 1; i >= 0; i--) {
        var _event3 = this.events[i];
        for (var j = _event3.length - 1; j >= 0; j--) {
          var step = _event3[j];
          if (step.version <= startVersion) break out;
          var off = positions[step.version - startVersion - 1];
          if (off == -1) {
            _event3.splice(j--, 1);
          } else {
            var inv = (0, _transform.invertStep)(rebasedTransform.steps[off], rebasedTransform.docs[off], rebasedTransform.maps[off]);
            _event3[j] = new InvertedStep(inv, startVersion + newMaps.length + off + 1, step.id);
          }
        }
      }

      // Sync the array of maps
      if (this.maps.length > positions.length) this.maps = this.maps.slice(0, this.maps.length - positions.length).concat(newMaps).concat(rebasedTransform.maps);else this.maps = rebasedTransform.maps.slice();

      this.version = startVersion + newMaps.length + rebasedTransform.maps.length;

      this.stepsSinceCompress += newMaps.length + rebasedTransform.steps.length - positions.length;
    }
  }, {
    key: "abortCompression",
    value: function abortCompression() {
      if (this.compressing) {
        this.compressing.abort();
        this.compressing = null;
      }
    }
  }, {
    key: "needsCompression",
    value: function needsCompression() {
      return this.stepsSinceCompress > compressStepCount && !this.compressing;
    }
  }, {
    key: "startCompression",
    value: function startCompression(doc) {
      var _this2 = this;

      this.compressing = new CompressionWorker(doc, this, function (maps, events) {
        _this2.maps = maps;
        _this2.events = events;
        _this2.mirror = Object.create(null);
        _this2.compressing = null;
        _this2.stepsSinceCompress = 0;
      });
      this.compressing.work();
    }
  }]);

  return Branch;
})();

var compressDelay = 750;

var History = (function () {
  function History(pm) {
    var _this3 = this;

    _classCallCheck(this, History);

    this.pm = pm;

    this.done = new Branch(pm.options.historyDepth);
    this.undone = new Branch(pm.options.historyDepth);

    this.lastAddedAt = 0;
    this.ignoreTransform = false;

    this.allowCollapsing = true;

    pm.on("transform", function (transform, options) {
      return _this3.recordTransform(transform, options);
    });
  }

  _createClass(History, [{
    key: "recordTransform",
    value: function recordTransform(transform, options) {
      if (this.ignoreTransform) return;

      if (options.addToHistory == false) {
        for (var i = 0; i < transform.maps.length; i++) {
          var map = transform.maps[i];
          this.done.addMap(map);
          this.undone.addMap(map);
        }
      } else {
        this.undone.clear();
        var now = Date.now();
        if (now > this.lastAddedAt + this.pm.options.historyEventDelay) this.done.newEvent();

        this.done.addTransform(transform);
        this.lastAddedAt = now;
      }
      this.maybeScheduleCompression();
    }
  }, {
    key: "undo",
    value: function undo() {
      return this.shift(this.done, this.undone);
    }
  }, {
    key: "redo",
    value: function redo() {
      return this.shift(this.undone, this.done);
    }
  }, {
    key: "canUndo",
    value: function canUndo() {
      return this.done.events.length > 0;
    }
  }, {
    key: "canRedo",
    value: function canRedo() {
      return this.undone.events.length > 0;
    }
  }, {
    key: "shift",
    value: function shift(from, to) {
      var event = from.popEvent(this.pm.doc, this.allowCollapsing);
      if (!event) return false;
      var transform = event.transform;
      var ids = event.ids;

      this.ignoreTransform = true;
      this.pm.apply(transform);
      this.ignoreTransform = false;

      if (!transform.steps.length) return this.shift(from, to);

      if (to) {
        to.newEvent();
        to.addTransform(transform, ids);
      }
      this.lastAddedAt = 0;

      return true;
    }
  }, {
    key: "getVersion",
    value: function getVersion() {
      return this.done.getVersion();
    }
  }, {
    key: "backToVersion",
    value: function backToVersion(version) {
      var found = this.done.findVersion(version);
      if (!found) return false;
      var event = this.done.events[found.event];
      var combined = this.done.events.slice(found.event + 1).reduce(function (comb, arr) {
        return comb.concat(arr);
      }, event.slice(found.step));
      this.done.events.length = found.event + ((event.length = found.step) ? 1 : 0);
      this.done.events.push(combined);

      this.shift(this.done);
    }
  }, {
    key: "rebased",
    value: function rebased(newMaps, rebasedTransform, positions) {
      this.done.rebased(newMaps, rebasedTransform, positions);
      this.undone.rebased(newMaps, rebasedTransform, positions);
      this.maybeScheduleCompression();
    }
  }, {
    key: "maybeScheduleCompression",
    value: function maybeScheduleCompression() {
      this.maybeScheduleCompressionForBranch(this.done);
      this.maybeScheduleCompressionForBranch(this.undone);
    }
  }, {
    key: "maybeScheduleCompressionForBranch",
    value: function maybeScheduleCompressionForBranch(branch) {
      var _this4 = this;

      window.clearTimeout(branch.compressTimeout);
      if (branch.needsCompression()) branch.compressTimeout = window.setTimeout(function () {
        if (branch.needsCompression()) branch.startCompression(_this4.pm.doc);
      }, compressDelay);
    }
  }]);

  return History;
})();

exports.History = History;

},{"../model":37,"../transform":44}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _main = require("./main");

Object.defineProperty(exports, "ProseMirror", {
  enumerable: true,
  get: function get() {
    return _main.ProseMirror;
  }
});

var _options = require("./options");

Object.defineProperty(exports, "defineOption", {
  enumerable: true,
  get: function get() {
    return _options.defineOption;
  }
});

var _selection = require("./selection");

Object.defineProperty(exports, "Range", {
  enumerable: true,
  get: function get() {
    return _selection.Range;
  }
});

var _event = require("./event");

Object.defineProperty(exports, "eventMixin", {
  enumerable: true,
  get: function get() {
    return _event.eventMixin;
  }
});

var _keys = require("./keys");

Object.defineProperty(exports, "Keymap", {
  enumerable: true,
  get: function get() {
    return _keys.Keymap;
  }
});

},{"./event":17,"./keys":21,"./main":22,"./options":24,"./selection":26}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.dispatchKey = dispatchKey;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _model = require("../model");

var _convertFrom_dom = require("../convert/from_dom");

var _convertTo_dom = require("../convert/to_dom");

var _convertTo_text = require("../convert/to_text");

var _convertConvert = require("../convert/convert");

var _keys = require("./keys");

var _dom = require("../dom");

var _commands = require("./commands");

var _domchange = require("./domchange");

var _selection = require("./selection");

var stopSeq = null;
var handlers = {};

var Input = (function () {
  function Input(pm) {
    var _this = this;

    _classCallCheck(this, Input);

    this.pm = pm;

    this.keySeq = null;
    this.composing = null;
    this.shiftKey = this.updatingComposition = false;
    this.skipInput = 0;

    this.draggingFrom = false;

    this.keymaps = [];
    this.commandExtensions = Object.create(null);

    this.storedStyles = null;

    var _loop = function (_event) {
      var handler = handlers[_event];
      pm.content.addEventListener(_event, function (e) {
        return handler(pm, e);
      });
    };

    for (var _event in handlers) {
      _loop(_event);
    }

    pm.on("selectionChange", function () {
      return _this.storedStyles = null;
    });
  }

  _createClass(Input, [{
    key: "extendCommand",
    value: function extendCommand(name, priority, f) {
      var obj = this.commandExtensions[name] || (this.commandExtensions[name] = { low: [], normal: [], high: [] });
      obj[priority].push(f);
    }
  }, {
    key: "unextendCommand",
    value: function unextendCommand(name, priority, f) {
      var obj = this.commandExtensions[name];
      var arr = obj && obj[priority];
      if (arr) for (var i = 0; i < arr.length; i++) {
        if (arr[i] == f) {
          arr.splice(i, 1);break;
        }
      }
    }
  }, {
    key: "maybeAbortComposition",
    value: function maybeAbortComposition() {
      if (this.composing && !this.updatingComposition) {
        if (this.composing.finished) {
          finishComposing(this.pm);
        } else {
          // Toggle selection to force end of composition
          this.composing = null;
          this.skipInput++;
          var sel = getSelection();
          if (sel.rangeCount) {
            var range = sel.getRangeAt(0);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
        return true;
      }
    }
  }]);

  return Input;
})();

exports.Input = Input;

function dispatchKey(pm, name, e) {
  var seq = pm.input.keySeq;
  if (seq) {
    if ((0, _keys.isModifierKey)(name)) return true;
    clearTimeout(stopSeq);
    stopSeq = setTimeout(function () {
      if (pm.input.keySeq == seq) pm.input.keySeq = null;
    }, 50);
    name = seq + " " + name;
  }

  var handle = function handle(bound) {
    var result = typeof bound == "string" ? (0, _commands.execCommand)(pm, bound) : bound(pm);
    return result !== false;
  };

  var result = undefined;
  for (var i = 0; !result && i < pm.input.keymaps.length; i++) {
    result = (0, _keys.lookupKey)(name, pm.input.keymaps[i], handle, pm);
  }if (!result) result = (0, _keys.lookupKey)(name, pm.options.extraKeymap, handle, pm) || (0, _keys.lookupKey)(name, pm.options.keymap, handle, pm);

  if (result == "multi") pm.input.keySeq = name;

  if (result == "handled" || result == "multi") e.preventDefault();

  if (seq && !result && /\'$/.test(name)) {
    e.preventDefault();
    return true;
  }
  return !!result;
}

handlers.keydown = function (pm, e) {
  if (e.keyCode == 16) pm.input.shiftKey = true;
  if (pm.input.composing) return;
  var name = (0, _keys.keyName)(e);
  if (name) dispatchKey(pm, name, e);
};

handlers.keyup = function (pm, e) {
  if (e.keyCode == 16) pm.input.shiftKey = false;
};

function inputText(pm, range, text) {
  if (range.empty && !text) return false;
  var styles = pm.input.storedStyles || (0, _model.spanStylesAt)(pm.doc, range.from);
  var tr = pm.tr;
  if (!range.empty) tr["delete"](range.from, range.to);
  pm.apply(tr.insert(range.from, _model.Span.text(text, styles)));
  pm.signal("textInput", text);
  pm.scrollIntoView();
}

handlers.keypress = function (pm, e) {
  if (pm.input.composing || !e.charCode || e.ctrlKey && !e.altKey || _dom.browser.mac && e.metaKey) return;
  var ch = String.fromCharCode(e.charCode);
  if (dispatchKey(pm, "'" + ch + "'", e)) return;
  inputText(pm, pm.selection, ch);
  e.preventDefault();
};

var Composing = function Composing(pm, data) {
  _classCallCheck(this, Composing);

  this.finished = false;
  this.context = (0, _domchange.textContext)(data);
  this.data = data;
  this.endData = null;
  var range = pm.selection;
  if (data) {
    var path = range.head.path,
        line = pm.doc.path(path).textContent;
    var found = line.indexOf(data, range.head.offset - data.length);
    if (found > -1 && found <= range.head.offset + data.length) range = new _selection.Range(new _model.Pos(path, found), new _model.Pos(path, found + data.length));
  }
  this.range = range;
};

handlers.compositionstart = function (pm, e) {
  if (pm.input.maybeAbortComposition()) return;

  pm.flush();
  pm.input.composing = new Composing(pm, e.data);
};

handlers.compositionupdate = function (pm, e) {
  var info = pm.input.composing;
  if (info && info.data != e.data) {
    info.data = e.data;
    pm.input.updatingComposition = true;
    inputText(pm, info.range, info.data);
    pm.input.updatingComposition = false;
    info.range = new _selection.Range(info.range.from, info.range.from.shift(info.data.length));
  }
};

handlers.compositionend = function (pm, e) {
  var info = pm.input.composing;
  if (info) {
    pm.input.composing.finished = true;
    pm.input.composing.endData = e.data;
    setTimeout(function () {
      if (pm.input.composing == info) finishComposing(pm);
    }, 20);
  }
};

function finishComposing(pm) {
  var info = pm.input.composing;
  var text = (0, _domchange.textInContext)(info.context, info.endData);
  if (text != info.data) pm.ensureOperation();
  pm.input.composing = null;
  if (text != info.data) inputText(pm, info.range, text);
}

handlers.input = function (pm) {
  if (pm.input.skipInput) return --pm.input.skipInput;

  if (pm.input.composing) {
    if (pm.input.composing.finished) finishComposing(pm);
    return;
  }

  pm.input.suppressPolling = true;
  (0, _domchange.applyDOMChange)(pm);
  pm.input.suppressPolling = false;
  pm.sel.poll(true);
  pm.scrollIntoView();
};

var lastCopied = null;

handlers.copy = handlers.cut = function (pm, e) {
  var sel = pm.selection;
  if (sel.empty) return;
  var fragment = pm.selectedDoc;
  lastCopied = { doc: pm.doc, from: sel.from, to: sel.to,
    html: (0, _convertTo_dom.toHTML)(fragment, { document: document }),
    text: (0, _convertTo_text.toText)(fragment) };

  if (e.clipboardData) {
    e.preventDefault();
    e.clipboardData.clearData();
    e.clipboardData.setData("text/html", lastCopied.html);
    e.clipboardData.setData("text/plain", lastCopied.text);
    if (e.type == "cut" && !sel.empty) pm.apply(pm.tr["delete"](sel.from, sel.to));
  }
};

handlers.paste = function (pm, e) {
  if (!e.clipboardData) return;
  var sel = pm.selection;
  var txt = e.clipboardData.getData("text/plain");
  var html = e.clipboardData.getData("text/html");
  if (html || txt) {
    e.preventDefault();
    var doc = undefined,
        from = undefined,
        to = undefined;
    if (pm.input.shiftKey && txt) {
      (function () {
        var paragraphs = txt.split(/[\r\n]+/);
        var styles = (0, _model.spanStylesAt)(pm.doc, sel.from);
        doc = new _model.Node("doc", null, paragraphs.map(function (s) {
          return new _model.Node("paragraph", null, [_model.Span.text(s, styles)]);
        }));
      })();
    } else if (lastCopied && (lastCopied.html == html || lastCopied.text == txt)) {
      ;var _lastCopied = lastCopied;
      doc = _lastCopied.doc;
      from = _lastCopied.from;
      to = _lastCopied.to;
    } else if (html) {
      doc = (0, _convertFrom_dom.fromHTML)(html, { document: document });
    } else {
      doc = (0, _convertConvert.convertFrom)(txt, (0, _convertConvert.knownSource)("markdown") ? "markdown" : "text");
    }
    pm.apply(pm.tr.replace(sel.from, sel.to, doc, from || _model.Pos.start(doc), to || _model.Pos.end(doc)));
    pm.scrollIntoView();
  }
};

handlers.dragstart = function (pm, e) {
  if (!e.dataTransfer) return;

  var fragment = pm.selectedDoc;

  e.dataTransfer.setData("text/html", (0, _convertTo_dom.toHTML)(fragment, { document: document }));
  e.dataTransfer.setData("text/plain", (0, _convertTo_text.toText)(fragment) + "??");
  pm.input.draggingFrom = true;
};

handlers.dragend = function (pm) {
  return window.setTimeout(function () {
    return pm.input.dragginFrom = false;
  }, 50);
};

handlers.dragover = handlers.dragenter = function (_, e) {
  return e.preventDefault();
};

handlers.drop = function (pm, e) {
  if (!e.dataTransfer) return;

  var html = undefined,
      txt = undefined,
      doc = undefined;
  if (html = e.dataTransfer.getData("text/html")) doc = (0, _convertFrom_dom.fromHTML)(html, { document: document });else if (txt = e.dataTransfer.getData("text/plain")) doc = (0, _convertConvert.convertFrom)(txt, (0, _convertConvert.knownSource)("markdown") ? "markdown" : "text");

  if (doc) {
    e.preventDefault();
    var insertPos = pm.posAtCoords({ left: e.clientX, top: e.clientY });
    var tr = pm.tr;
    if (pm.input.draggingFrom && !e.ctrlKey) {
      var sel = pm.selection;
      tr["delete"](sel.from, sel.to);
      insertPos = tr.map(insertPos).pos;
    }
    tr.replace(insertPos, insertPos, doc, _model.Pos.start(doc), _model.Pos.end(doc));
    pm.apply(tr);
    pm.setSelection(new _selection.Range(insertPos, tr.map(insertPos).pos));
    pm.focus();
  }
};

handlers.focus = function (pm) {
  (0, _dom.addClass)(pm.wrapper, "ProseMirror-focused");
  pm.signal("focus");
};

handlers.blur = function (pm) {
  (0, _dom.rmClass)(pm.wrapper, "ProseMirror-focused");
  pm.signal("blur");
};

},{"../convert/convert":5,"../convert/from_dom":6,"../convert/to_dom":8,"../convert/to_text":9,"../dom":10,"../model":37,"./commands":12,"./domchange":15,"./keys":21,"./selection":26}],21:[function(require,module,exports){
// From CodeMirror, should be factored into its own NPM module

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.keyName = keyName;
exports.isModifierKey = isModifierKey;
exports.lookupKey = lookupKey;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var names = {
  3: "Enter", 8: "Backspace", 9: "Tab", 13: "Enter", 16: "Shift", 17: "Ctrl", 18: "Alt",
  19: "Pause", 20: "CapsLock", 27: "Esc", 32: "Space", 33: "PageUp", 34: "PageDown", 35: "End",
  36: "Home", 37: "Left", 38: "Up", 39: "Right", 40: "Down", 44: "PrintScrn", 45: "Insert",
  46: "Delete", 59: ";", 61: "=", 91: "Mod", 92: "Mod", 93: "Mod", 107: "=", 109: "-", 127: "Delete",
  173: "-", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\",
  221: "]", 222: "'", 63232: "Up", 63233: "Down", 63234: "Left", 63235: "Right", 63272: "Delete",
  63273: "Home", 63275: "End", 63276: "PageUp", 63277: "PageDown", 63302: "Insert"
};

exports.names = names;
// Number keys
for (var i = 0; i < 10; i++) {
  names[i + 48] = names[i + 96] = String(i);
} // Alphabetic keys
for (var i = 65; i <= 90; i++) {
  names[i] = String.fromCharCode(i);
} // Function keys
for (var i = 1; i <= 12; i++) {
  names[i + 111] = names[i + 63235] = "F" + i;
}
function keyName(event, noShift) {
  var base = names[event.keyCode],
      name = base;
  if (name == null || event.altGraphKey) return false;

  if (event.altKey && base != "Alt") name = "Alt-" + name;
  if (event.ctrlKey && base != "Ctrl") name = "Ctrl-" + name;
  if (event.metaKey && base != "Cmd") name = "Cmd-" + name;
  if (!noShift && event.shiftKey && base != "Shift") name = "Shift-" + name;
  return name;
}

function isModifierKey(value) {
  var name = typeof value == "string" ? value : names[value.keyCode];
  return name == "Ctrl" || name == "Alt" || name == "Shift" || name == "Mod";
}

function normalizeKeyName(fullName) {
  var parts = fullName.split(/-(?!$)/),
      name = parts[parts.length - 1];
  var alt = undefined,
      ctrl = undefined,
      shift = undefined,
      cmd = undefined;
  for (var i = 0; i < parts.length - 1; i++) {
    var mod = parts[i];
    if (/^(cmd|meta|m)$/i.test(mod)) cmd = true;else if (/^a(lt)?$/i.test(mod)) alt = true;else if (/^(c|ctrl|control)$/i.test(mod)) ctrl = true;else if (/^s(hift)$/i.test(mod)) shift = true;else throw new Error("Unrecognized modifier name: " + mod);
  }
  if (alt) name = "Alt-" + name;
  if (ctrl) name = "Ctrl-" + name;
  if (cmd) name = "Cmd-" + name;
  if (shift) name = "Shift-" + name;
  return name;
}

var Keymap = (function () {
  function Keymap(keys, options) {
    _classCallCheck(this, Keymap);

    this.options = options || {};
    this.bindings = Object.create(null);
    if (keys) for (var keyname in keys) {
      if (Object.prototype.hasOwnProperty.call(keys, keyname)) this.addBinding(keyname, keys[keyname]);
    }
  }

  _createClass(Keymap, [{
    key: "addBinding",
    value: function addBinding(keyname, value) {
      var keys = keyname.split(" ").map(normalizeKeyName);
      for (var i = 0; i < keys.length; i++) {
        var _name = keys.slice(0, i + 1).join(" ");
        var val = i == keys.length - 1 ? value : "...";
        var prev = this.bindings[_name];
        if (!prev) this.bindings[_name] = val;else if (prev != val) throw new Error("Inconsistent bindings for " + _name);
      }
    }
  }, {
    key: "removeBinding",
    value: function removeBinding(keyname) {
      var keys = keyname.split(" ").map(normalizeKeyName);
      for (var i = keys.length - 1; i >= 0; i--) {
        var _name2 = keys.slice(0, i).join(" ");
        var val = this.bindings[_name2];
        if (val == "..." && !this.unusedMulti(_name2)) break;else if (val) delete this.bindings[_name2];
      }
    }
  }, {
    key: "unusedMulti",
    value: function unusedMulti(name) {
      for (var binding in this.bindings) {
        if (binding.length > name && binding.indexOf(name) == 0 && binding.charAt(name.length) == " ") return false;
      }return true;
    }
  }]);

  return Keymap;
})();

exports.Keymap = Keymap;

function lookupKey(_x, _x2, _x3, _x4) {
  var _again = true;

  _function: while (_again) {
    var key = _x,
        map = _x2,
        handle = _x3,
        context = _x4;
    found = fall = i = result = undefined;
    _again = false;

    var found = map.options.call ? map.options.call(key, context) : map.bindings[key];
    if (found === false) return "nothing";
    if (found === "...") return "multi";
    if (found != null && handle(found)) return "handled";

    var fall = map.options.fallthrough;
    if (fall) {
      if (!Array.isArray(fall)) {
        _x = key;
        _x2 = fall;
        _x3 = handle;
        _x4 = context;
        _again = true;
        continue _function;
      }
      for (var i = 0; i < fall.length; i++) {
        var result = lookupKey(key, fall[i], handle, context);
        if (result) return result;
      }
    }
  }
}

},{}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require("./css");

var _model = require("../model");

var _transform = require("../transform");

var _options = require("./options");

var _selection = require("./selection");

var _dom = require("../dom");

var _draw = require("./draw");

var _input = require("./input");

var _history = require("./history");

var _event = require("./event");

var _convertTo_text = require("../convert/to_text");

require("../convert/from_text");

var _convertConvert = require("../convert/convert");

var _commands = require("./commands");

var _range = require("./range");

var ProseMirror = (function () {
  function ProseMirror(opts) {
    _classCallCheck(this, ProseMirror);

    opts = this.options = (0, _options.parseOptions)(opts);
    this.content = (0, _dom.elt)("div", { "class": "ProseMirror-content" });
    this.wrapper = (0, _dom.elt)("div", { "class": "ProseMirror" }, this.content);
    this.wrapper.ProseMirror = this;

    if (opts.place && opts.place.appendChild) opts.place.appendChild(this.wrapper);else if (opts.place) opts.place(this.wrapper);

    this.setDocInner(opts.docFormat ? (0, _convertConvert.convertFrom)(opts.doc, opts.docFormat, { document: document }) : opts.doc);
    (0, _draw.draw)(this, this.doc);
    this.content.contentEditable = true;

    this.mod = Object.create(null);
    this.operation = null;
    this.flushScheduled = false;

    this.sel = new _selection.Selection(this);
    this.input = new _input.Input(this);

    (0, _options.initOptions)(this);
  }

  _createClass(ProseMirror, [{
    key: "apply",
    value: function apply(transform) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? nullOptions : arguments[1];

      if (transform.doc == this.doc) return false;

      this.updateDoc(transform.doc, transform);
      this.signal("transform", transform, options);
      return transform;
    }
  }, {
    key: "setContent",
    value: function setContent(value, format) {
      if (format) value = (0, _convertConvert.convertFrom)(value, format, { document: document });
      this.setDoc(value);
    }
  }, {
    key: "getContent",
    value: function getContent(format) {
      return format ? (0, _convertConvert.convertTo)(this.doc, format, { document: document }) : this.doc;
    }
  }, {
    key: "setDocInner",
    value: function setDocInner(doc) {
      this.doc = doc;
      this.ranges = new _range.RangeStore(this);
      this.history = new _history.History(this);
    }
  }, {
    key: "setDoc",
    value: function setDoc(doc, sel) {
      if (!sel) {
        var start = _model.Pos.start(doc);
        sel = new _selection.Range(start, start);
      }
      this.signal("beforeSetDoc", doc, sel);
      this.ensureOperation();
      this.setDocInner(doc);
      this.sel.set(sel, true);
      this.signal("setDoc", doc, sel);
    }
  }, {
    key: "updateDoc",
    value: function updateDoc(doc, mapping) {
      this.ensureOperation();
      this.input.maybeAbortComposition();
      this.ranges.transform(mapping);
      this.doc = doc;
      var range = this.sel.range;
      this.sel.setAndSignal(new _selection.Range(mapping.map(range.anchor).pos, mapping.map(range.head).pos));
      this.signal("change");
    }
  }, {
    key: "checkPos",
    value: function checkPos(pos, block) {
      if (!this.doc.isValidPos(pos, block)) throw new Error("Position " + pos + " is not valid in current document");
    }
  }, {
    key: "setSelection",
    value: function setSelection(rangeOrAnchor, head) {
      var range = rangeOrAnchor;
      if (!(range instanceof _selection.Range)) range = new _selection.Range(rangeOrAnchor, head || rangeOrAnchor);
      this.checkPos(range.head, true);
      this.checkPos(range.anchor, true);
      this.ensureOperation();
      this.input.maybeAbortComposition();
      if (range.head.cmp(this.sel.range.head) || range.anchor.cmp(this.sel.range.anchor)) this.sel.setAndSignal(range);
    }
  }, {
    key: "ensureOperation",
    value: function ensureOperation() {
      var _this = this;

      if (!this.operation) {
        if (!this.input.suppressPolling) this.sel.poll();
        this.operation = new Operation(this);
      }
      if (!this.flushScheduled) {
        (0, _dom.requestAnimationFrame)(function () {
          _this.flushScheduled = false;
          _this.flush();
        });
        this.flushScheduled = true;
      }
      return this.operation;
    }
  }, {
    key: "flush",
    value: function flush() {
      var op = this.operation;
      if (!op || !document.body.contains(this.wrapper)) return;
      this.operation = null;

      var docChanged = op.doc != this.doc || this.ranges.dirty.size;
      if (docChanged && !this.input.composing) {
        if (op.fullRedraw) (0, _draw.draw)(this, this.doc); // FIXME only redraw target block composition
        else (0, _draw.redraw)(this, this.ranges.dirty, this.doc, op.doc);
        this.ranges.resetDirty();
      }
      if ((docChanged || op.sel.anchor.cmp(this.sel.range.anchor) || op.sel.head.cmp(this.sel.range.head)) && !this.input.composing) this.sel.toDOM(docChanged, op.focus);
      if (op.scrollIntoView !== false) (0, _selection.scrollIntoView)(this, op.scrollIntoView);
      if (docChanged) this.signal("draw");
      this.signal("flush");
    }
  }, {
    key: "setOption",
    value: function setOption(name, value) {
      (0, _options.setOption)(this, name, value);
    }
  }, {
    key: "getOption",
    value: function getOption(name) {
      return this.options[name];
    }
  }, {
    key: "addKeymap",
    value: function addKeymap(map, bottom) {
      this.input.keymaps[bottom ? "push" : "unshift"](map);
    }
  }, {
    key: "removeKeymap",
    value: function removeKeymap(map) {
      var maps = this.input.keymaps;
      for (var i = 0; i < maps.length; ++i) {
        if (maps[i] == map || maps[i].options.name == map) {
          maps.splice(i, 1);
          return true;
        }
      }
    }
  }, {
    key: "markRange",
    value: function markRange(from, to, options) {
      this.checkPos(from);
      this.checkPos(to);
      var range = new _range.MarkedRange(from, to, options);
      this.ranges.addRange(range);
      return range;
    }
  }, {
    key: "removeRange",
    value: function removeRange(range) {
      this.ranges.removeRange(range);
    }
  }, {
    key: "extendCommand",
    value: function extendCommand(name, priority, f) {
      if (f == null) {
        f = priority;priority = "normal";
      }
      if (!/^(normal|low|high)$/.test(priority)) throw new Error("Invalid priority: " + priority);
      this.input.extendCommand(name, priority, f);
    }
  }, {
    key: "unextendCommand",
    value: function unextendCommand(name, priority, f) {
      if (f == null) {
        f = priority;priority = "normal";
      }
      this.input.unextendCommand(name, priority, f);
    }
  }, {
    key: "setInlineStyle",
    value: function setInlineStyle(st, to, range) {
      if (!range) range = this.selection;
      if (!range.empty) {
        if (to == null) to = !(0, _model.rangeHasStyle)(this.doc, range.from, range.to, st.type);
        this.apply(this.tr[to ? "addStyle" : "removeStyle"](range.from, range.to, st));
      } else if (!this.doc.path(range.head.path).type.plainText && range == this.selection) {
        var styles = this.activeStyles();
        if (to == null) to = !_model.style.contains(styles, st);
        this.input.storedStyles = to ? _model.style.add(styles, st) : _model.style.remove(styles, st);
        this.signal("activeStyleChange");
      }
    }
  }, {
    key: "activeStyles",
    value: function activeStyles() {
      return this.input.storedStyles || (0, _model.spanStylesAt)(this.doc, this.selection.head);
    }
  }, {
    key: "focus",
    value: function focus() {
      if (this.operation) this.operation.focus = true;else this.sel.toDOM(false, true);
    }
  }, {
    key: "hasFocus",
    value: function hasFocus() {
      return (0, _selection.hasFocus)(this);
    }
  }, {
    key: "posAtCoords",
    value: function posAtCoords(coords) {
      return (0, _selection.posAtCoords)(this, coords);
    }
  }, {
    key: "coordsAtPos",
    value: function coordsAtPos(pos) {
      this.checkPos(pos);
      return (0, _selection.coordsAtPos)(this, pos);
    }
  }, {
    key: "scrollIntoView",
    value: function scrollIntoView() {
      var pos = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (pos) this.checkPos(pos);
      this.ensureOperation();
      this.operation.scrollIntoView = pos;
    }
  }, {
    key: "execCommand",
    value: function execCommand(name) {
      (0, _commands.execCommand)(this, name);
    }
  }, {
    key: "selection",
    get: function get() {
      this.ensureOperation();
      return this.sel.range;
    }
  }, {
    key: "selectedDoc",
    get: function get() {
      var sel = this.selection;
      return (0, _model.sliceBetween)(this.doc, sel.from, sel.to);
    }
  }, {
    key: "selectedText",
    get: function get() {
      return (0, _convertTo_text.toText)(this.selectedDoc);
    }
  }, {
    key: "tr",
    get: function get() {
      return new _transform.Transform(this.doc);
    }
  }]);

  return ProseMirror;
})();

exports.ProseMirror = ProseMirror;

var nullOptions = {};

(0, _event.eventMixin)(ProseMirror);

var Operation = function Operation(pm) {
  _classCallCheck(this, Operation);

  this.doc = pm.doc;
  this.sel = pm.sel.range;
  this.scrollIntoView = false;
  this.focus = false;
  this.fullRedraw = !!pm.input.composing;
};

},{"../convert/convert":5,"../convert/from_text":7,"../convert/to_text":9,"../dom":10,"../model":37,"../transform":44,"./commands":12,"./css":13,"./draw":16,"./event":17,"./history":18,"./input":20,"./options":24,"./range":25,"./selection":26}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Map = window.Map || (function () {
  function _class() {
    _classCallCheck(this, _class);

    this.content = [];
  }

  _createClass(_class, [{
    key: "set",
    value: function set(key, value) {
      var found = this.find(key);
      if (found > -1) this.content[found + 1] = value;else this.content.push(key, value);
    }
  }, {
    key: "get",
    value: function get(key) {
      var found = this.find(key);
      return found == -1 ? undefined : this.content[found + 1];
    }
  }, {
    key: "has",
    value: function has(key) {
      return this.find(key) > -1;
    }
  }, {
    key: "find",
    value: function find(key) {
      for (var i = 0; i < this.content.length; i += 2) {
        if (this.content[i] === key) return i;
      }
    }
  }, {
    key: "size",
    get: function get() {
      return this.content.length / 2;
    }
  }]);

  return _class;
})();
exports.Map = Map;

},{}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineOption = defineOption;
exports.parseOptions = parseOptions;
exports.initOptions = initOptions;
exports.setOption = setOption;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _model = require("../model");

var _defaultkeymap = require("./defaultkeymap");

var _keys = require("./keys");

var Option = function Option(defaultValue, update, updateOnInit) {
  _classCallCheck(this, Option);

  this.defaultValue = defaultValue;
  this.update = update;
  this.updateOnInit = updateOnInit !== false;
};

var options = {
  __proto__: null,

  doc: new Option(new _model.Node("doc", null, [new _model.Node("paragraph")]), function (pm, value) {
    pm.setDoc(value);
  }, false),

  docFormat: new Option(null),

  place: new Option(null),

  keymap: new Option(_defaultkeymap.defaultKeymap),

  extraKeymap: new Option(new _keys.Keymap()),

  historyDepth: new Option(50),

  historyEventDelay: new Option(500)
};

function defineOption(name, defaultValue, update, updateOnInit) {
  options[name] = new Option(defaultValue, update, updateOnInit);
}

function parseOptions(obj) {
  var result = Object.create(null);
  var given = obj ? [obj].concat(obj.use || []) : [];
  outer: for (var opt in options) {
    for (var i = 0; i < given.length; i++) {
      if (opt in given[i]) {
        result[opt] = given[i][opt];
        continue outer;
      }
    }
    result[opt] = options[opt].defaultValue;
  }
  return result;
}

function initOptions(pm) {
  for (var opt in options) {
    var desc = options[opt];
    if (desc.update && desc.updateOnInit) desc.update(pm, pm.options[opt], null, true);
  }
}

function setOption(pm, name, value) {
  var old = pm.options[name];
  pm.options[name] = value;
  var desc = options[name];
  if (desc.update) desc.update(pm, value, old, false);
}

},{"../model":37,"./defaultkeymap":14,"./keys":21}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _map = require("./map");

var _event = require("./event");

var MarkedRange = (function () {
  function MarkedRange(from, to, options) {
    _classCallCheck(this, MarkedRange);

    this.options = options || {};
    this.from = from;
    this.to = to;
  }

  _createClass(MarkedRange, [{
    key: "clear",
    value: function clear() {
      this.signal("removed", this.from);
      this.from = this.to = null;
    }
  }]);

  return MarkedRange;
})();

exports.MarkedRange = MarkedRange;

(0, _event.eventMixin)(MarkedRange);

var RangeSorter = (function () {
  function RangeSorter() {
    _classCallCheck(this, RangeSorter);

    this.sorted = [];
  }

  _createClass(RangeSorter, [{
    key: "find",
    value: function find(at) {
      var min = 0,
          max = this.sorted.length;
      for (;;) {
        if (max < min + 10) {
          for (var i = min; i < max; i++) {
            if (this.sorted[i].at.cmp(at) >= 0) return i;
          }return max;
        }
        var mid = min + max >> 1;
        if (this.sorted[mid].at.cmp(at) > 0) max = mid;else min = mid;
      }
    }
  }, {
    key: "insert",
    value: function insert(obj) {
      this.sorted.splice(this.find(obj.at), 0, obj);
    }
  }, {
    key: "remove",
    value: function remove(at, range) {
      var pos = this.find(at);
      for (var dist = 0;; dist++) {
        var leftPos = pos - dist - 1,
            rightPos = pos + dist;
        if (leftPos >= 0 && this.sorted[leftPos].range == range) {
          this.sorted.splice(leftPos, 1);
          return;
        } else if (rightPos < this.sorted.length && this.sorted[rightPos].range == range) {
          this.sorted.splice(rightPos, 1);
          return;
        }
      }
    }
  }, {
    key: "resort",
    value: function resort() {
      for (var i = 0; i < this.sorted.length; i++) {
        var cur = this.sorted[i];
        var at = cur.at = cur.type == "open" ? cur.range.from : cur.range.to;
        var pos = i;
        while (pos > 0 && this.sorted[pos - 1].at.cmp(at) > 0) {
          this.sorted[pos] = this.sorted[pos - 1];
          this.sorted[--pos] = cur;
        }
      }
    }
  }]);

  return RangeSorter;
})();

var RangeStore = (function () {
  function RangeStore(pm) {
    _classCallCheck(this, RangeStore);

    this.pm = pm;
    this.ranges = [];
    this.sorted = new RangeSorter();
    this.resetDirty();
  }

  _createClass(RangeStore, [{
    key: "resetDirty",
    value: function resetDirty() {
      this.dirty = new _map.Map();
    }
  }, {
    key: "addRange",
    value: function addRange(range) {
      this.ranges.push(range);
      this.sorted.insert({ type: "open", at: range.from, range: range });
      this.sorted.insert({ type: "close", at: range.to, range: range });
      this.markDisplayDirty(range);
    }
  }, {
    key: "removeRange",
    value: function removeRange(range) {
      var found = this.ranges.indexOf(range);
      if (found > -1) {
        this.ranges.splice(found, 1);
        this.sorted.remove(range.from, range);
        this.sorted.remove(range.to, range);
        this.markDisplayDirty(range);
        range.clear();
      }
    }
  }, {
    key: "transform",
    value: function transform(mapping) {
      for (var i = 0; i < this.ranges.length; i++) {
        var range = this.ranges[i];
        range.from = mapping.map(range.from, range.options.inclusiveLeft ? -1 : 1).pos;
        range.to = mapping.map(range.to, range.options.inclusiveRight ? 1 : -1).pos;
        var diff = range.from.cmp(range.to);
        if (range.options.clearWhenEmpty !== false && diff >= 0) {
          this.removeRange(range);
          i--;
        } else if (diff > 0) {
          range.to = range.from;
        }
      }
      this.sorted.resort();
    }
  }, {
    key: "markDisplayDirty",
    value: function markDisplayDirty(range) {
      this.pm.ensureOperation();
      var dirty = this.dirty;
      var from = range.from,
          to = range.to;
      for (var depth = 0, node = this.pm.doc;; depth++) {
        var fromEnd = depth == from.depth,
            toEnd = depth == to.depth;
        if (!fromEnd && !toEnd && from.path[depth] == to.path[depth]) {
          var child = node.content[from.path[depth]];
          if (!dirty.has(child)) dirty.set(child, 1);
          node = child;
        } else {
          var start = fromEnd ? from.offset : from.path[depth];
          var end = toEnd ? to.offset : to.path[depth] + 1;
          if (node.type.block) {
            for (var offset = 0, i = 0; offset < end; i++) {
              var child = node.content[i];
              offset += child.size;
              if (offset > start) dirty.set(child, 2);
            }
          } else {
            for (var i = start; i < end; i++) {
              dirty.set(node.content[i], 2);
            }
          }
          break;
        }
      }
    }
  }, {
    key: "activeRangeTracker",
    value: function activeRangeTracker() {
      return new RangeTracker(this.sorted.sorted);
    }
  }]);

  return RangeStore;
})();

exports.RangeStore = RangeStore;

var RangeTracker = (function () {
  function RangeTracker(sorted) {
    _classCallCheck(this, RangeTracker);

    this.sorted = sorted;
    this.pos = 0;
    this.current = [];
  }

  _createClass(RangeTracker, [{
    key: "advanceTo",
    value: function advanceTo(pos) {
      var next = undefined;
      while (this.pos < this.sorted.length && (next = this.sorted[this.pos]).at.cmp(pos) <= 0) {
        var className = next.range.options.className;
        if (!className) continue;
        if (next.type == "open") this.current.push(className);else this.current.splice(this.current.indexOf(className), 1);
        this.pos++;
      }
    }
  }, {
    key: "nextChangeBefore",
    value: function nextChangeBefore(pos) {
      for (;;) {
        if (this.pos == this.sorted.length) return null;
        var next = this.sorted[this.pos];
        if (!next.range.options.className) this.pos++;else if (next.at.cmp(pos) >= 0) return null;else return next.at.offset;
      }
    }
  }]);

  return RangeTracker;
})();

},{"./event":17,"./map":23}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.findByPath = findByPath;
exports.resolvePath = resolvePath;
exports.hasFocus = hasFocus;
exports.posAtCoords = posAtCoords;
exports.coordsAtPos = coordsAtPos;
exports.scrollIntoView = scrollIntoView;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _model = require("../model");

var _dom = require("../dom");

var Selection = (function () {
  function Selection(pm) {
    var _this = this;

    _classCallCheck(this, Selection);

    this.pm = pm;
    this.polling = null;
    this.lastAnchorNode = this.lastHeadNode = this.lastAnchorOffset = this.lastHeadOffset = null;
    var start = _model.Pos.start(pm.doc);
    this.range = new Range(start, start);
    pm.content.addEventListener("focus", function () {
      return _this.receivedFocus();
    });
  }

  _createClass(Selection, [{
    key: "setAndSignal",
    value: function setAndSignal(range, clearLast) {
      this.set(range, clearLast);
      this.pm.signal("selectionChange");
    }
  }, {
    key: "set",
    value: function set(range, clearLast) {
      this.range = range;
      if (clearLast !== false) this.lastAnchorNode = null;
    }
  }, {
    key: "poll",
    value: function poll(force) {
      if (this.pm.input.composing || !hasFocus(this.pm)) return;
      var sel = getSelection();
      if (force || sel.anchorNode != this.lastAnchorNode || sel.anchorOffset != this.lastAnchorOffset || sel.focusNode != this.lastHeadNode || sel.focusOffset != this.lastHeadOffset) {
        var _posFromDOM = posFromDOM(this.pm, sel.anchorNode, sel.anchorOffset, force);

        var anchor = _posFromDOM.pos;
        var anchorInline = _posFromDOM.inline;

        var _posFromDOM2 = posFromDOM(this.pm, sel.focusNode, sel.focusOffset, force);

        var head = _posFromDOM2.pos;
        var headInline = _posFromDOM2.inline;

        this.lastAnchorNode = sel.anchorNode;this.lastAnchorOffset = sel.anchorOffset;
        this.lastHeadNode = sel.focusNode;this.lastHeadOffset = sel.focusOffset;
        this.pm.sel.setAndSignal(new Range(anchorInline ? anchor : moveInline(this.pm.doc, anchor, this.range.anchor), headInline ? head : moveInline(this.pm.doc, head, this.range.head)), false);
        if (this.range.anchor.cmp(anchor) || this.range.head.cmp(head)) this.toDOM(true);
        return true;
      }
    }
  }, {
    key: "toDOM",
    value: function toDOM(force, takeFocus) {
      var sel = window.getSelection();
      if (!hasFocus(this.pm)) {
        if (!takeFocus) return;
        // See https://bugzilla.mozilla.org/show_bug.cgi?id=921444
        else if (_dom.browser.gecko) this.pm.content.focus();
      }
      if (!force && sel.anchorNode == this.lastAnchorNode && sel.anchorOffset == this.lastAnchorOffset && sel.focusNode == this.lastHeadNode && sel.focusOffset == this.lastHeadOffset) return;

      var range = document.createRange();
      var content = this.pm.content;
      var anchor = DOMFromPos(content, this.range.anchor);
      var head = DOMFromPos(content, this.range.head);

      if (sel.extend) {
        range.setEnd(anchor.node, anchor.offset);
        range.collapse();
      } else {
        if (this.range.anchor.cmp(this.range.head) > 0) {
          var tmp = anchor;anchor = head;head = tmp;
        }
        range.setEnd(head.node, head.offset);
        range.setStart(anchor.node, anchor.offset);
      }
      sel.removeAllRanges();
      sel.addRange(range);
      if (sel.extend) sel.extend(head.node, head.offset);

      this.lastAnchorNode = anchor.node;this.lastAnchorOffset = anchor.offset;
      this.lastHeadNode = head.node;this.lastHeadOffset = head.offset;
    }
  }, {
    key: "receivedFocus",
    value: function receivedFocus() {
      var _this2 = this;

      var poll = function poll() {
        if (document.activeElement == _this2.pm.content) {
          if (!_this2.pm.operation) _this2.poll();
          clearTimeout(_this2.polling);
          _this2.polling = setTimeout(poll, 50);
        }
      };
      this.polling = setTimeout(poll, 20);
    }
  }]);

  return Selection;
})();

exports.Selection = Selection;

function windowRect() {
  return { left: 0, right: window.innerWidth,
    top: 0, bottom: window.innerHeight };
}

var Range = (function () {
  function Range(anchor, head) {
    _classCallCheck(this, Range);

    this.anchor = anchor;
    this.head = head;
  }

  _createClass(Range, [{
    key: "inverted",
    get: function get() {
      return this.anchor.cmp(this.head) > 0;
    }
  }, {
    key: "from",
    get: function get() {
      return this.inverted ? this.head : this.anchor;
    }
  }, {
    key: "to",
    get: function get() {
      return this.inverted ? this.anchor : this.head;
    }
  }, {
    key: "empty",
    get: function get() {
      return this.anchor.cmp(this.head) == 0;
    }
  }]);

  return Range;
})();

exports.Range = Range;

function attr(node, name) {
  return node.nodeType == 1 && node.getAttribute(name);
}

function scanOffset(node, parent) {
  for (var scan = node ? node.previousSibling : parent.lastChild; scan; scan = scan.previousSibling) {
    var tag = undefined,
        range = undefined;
    if (tag = attr(scan, "pm-path")) return +tag + 1;else if (range = attr(scan, "pm-span")) return +/-(\d+)/.exec(range)[1];
  }
  return 0;
}

function posFromDOM(pm, node, domOffset, force) {
  if (!force && pm.operation && pm.doc != pm.operation.doc) throw new Error("Fetching a position from an outdated DOM structure");

  var path = [],
      inText = false,
      offset = null,
      inline = false,
      prev = undefined;

  if (node.nodeType == 3) {
    inText = true;
    prev = node;
    node = node.parentNode;
  } else {
    prev = node.childNodes[domOffset];
  }

  for (var cur = node; cur != pm.content; prev = cur, cur = cur.parentNode) {
    var tag = undefined,
        range = undefined;
    if (tag = cur.getAttribute("pm-path")) {
      path.unshift(+tag);
      if (offset == null) offset = scanOffset(prev, cur);
    } else if (range = cur.getAttribute("pm-span")) {
      var _dD$exec = /(\d+)-(\d+)/.exec(range);

      var _dD$exec2 = _slicedToArray(_dD$exec, 3);

      var _ = _dD$exec2[0];
      var from = _dD$exec2[1];
      var to = _dD$exec2[2];

      if (inText) offset = +from + domOffset;else offset = domOffset ? +to : +from;
      inline = true;
    } else if (inText && (tag = cur.getAttribute("pm-span-offset"))) {
      domOffset += +tag;
    }
  }
  if (offset == null) offset = scanOffset(prev, node);
  return { pos: new _model.Pos(path, offset), inline: inline };
}

function moveInline(doc, pos, from) {
  var dir = pos.cmp(from);
  var found = dir < 0 ? _model.Pos.before(doc, pos) : _model.Pos.after(doc, pos);
  if (!found) found = dir >= 0 ? _model.Pos.before(doc, pos) : _model.Pos.after(doc, pos);
  return found;
}

function findByPath(node, n, fromEnd) {
  for (var ch = fromEnd ? node.lastChild : node.firstChild; ch; ch = fromEnd ? ch.previousSibling : ch.nextSibling) {
    if (ch.nodeType != 1) continue;
    var path = ch.getAttribute("pm-path");
    if (!path) {
      var found = findByPath(ch, n);
      if (found) return found;
    } else if (+path == n) {
      return ch;
    }
  }
}

function resolvePath(parent, path) {
  var node = parent;
  for (var i = 0; i < path.length; i++) {
    node = findByPath(node, path[i]);
    if (!node) throw new Error("Failed to resolve path " + path.join("/"));
  }
  return node;
}

function findByOffset(node, offset) {
  function search(node, domOffset) {
    if (node.nodeType != 1) return;
    var range = node.getAttribute("pm-span");
    if (range) {
      var _dD$exec3 = /(\d+)-(\d+)/.exec(range);

      var _dD$exec32 = _slicedToArray(_dD$exec3, 3);

      var _ = _dD$exec32[0];
      var from = _dD$exec32[1];
      var to = _dD$exec32[2];

      if (+to >= offset) return { node: node, parent: node.parentNode, offset: domOffset,
        innerOffset: offset - +from };
    } else {
      for (var ch = node.firstChild, i = 0; ch; ch = ch.nextSibling, i++) {
        var result = search(ch, i);
        if (result) return result;
      }
    }
  }
  return search(node);
}

function leafAt(node, offset) {
  for (;;) {
    var child = node.firstChild;
    if (!child) return { node: node, offset: offset };
    if (child.nodeType != 1) return { node: child, offset: offset };
    if (child.hasAttribute("pm-span-offset")) {
      var nodeOffset = 0;
      for (;;) {
        var nextSib = child.nextSibling,
            nextOffset = undefined;
        if (!nextSib || (nextOffset = +nextSib.getAttribute("pm-span-offset")) >= offset) break;
        child = nextSib;
        nodeOffset = nextOffset;
      }
      offset -= nodeOffset;
    }
    node = child;
  }
}

function DOMFromPos(parent, pos) {
  var node = resolvePath(parent, pos.path);
  var found = findByOffset(node, pos.offset),
      inner = undefined;
  if (!found) return { node: node, offset: 0 };
  if (found.node.hasAttribute("pm-span-atom") || !(inner = leafAt(found.node, found.innerOffset))) return { node: found.parent, offset: found.offset + (found.innerOffset ? 1 : 0) };else return inner;
}

function hasFocus(pm) {
  var sel = window.getSelection();
  return sel.rangeCount && (0, _dom.contains)(pm.content, sel.anchorNode);
}

function posAtCoords(pm, coords) {
  var element = document.elementFromPoint(coords.left, coords.top + 1);
  if (!(0, _dom.contains)(pm.content, element)) return _model.Pos.start(pm.doc);

  var offset = undefined;
  if (element.childNodes.length == 1 && element.firstChild.nodeType == 3) {
    element = element.firstChild;
    offset = offsetInTextNode(element, coords);
  } else {
    offset = offsetInElement(element, coords);
  }

  var _posFromDOM3 = posFromDOM(pm, element, offset);

  var pos = _posFromDOM3.pos;
  var inline = _posFromDOM3.inline;

  return inline ? pos : moveInline(pm.doc, pos, pos);
}

function coordsAtPos(pm, pos) {
  var _DOMFromPos = DOMFromPos(pm.content, pos);

  var node = _DOMFromPos.node;
  var offset = _DOMFromPos.offset;

  var rect = undefined;
  if (node.nodeType == 3 && node.nodeValue) {
    var range = document.createRange();
    range.setEnd(node, offset ? offset : offset + 1);
    range.setStart(node, offset ? offset - 1 : offset);
    rect = range.getBoundingClientRect();
  } else if (node.nodeType == 1 && node.firstChild) {
    rect = node.childNodes[offset ? offset - 1 : offset].getBoundingClientRect();
    // BR nodes are likely to return a useless empty rectangle. Try
    // the node on the other side in that case.
    if (rect.left == rect.right && offset && offset < node.childNodes.length) {
      var otherRect = node.childNodes[offset].getBoundingClientRect();
      if (otherRect.left != otherRect.right) rect = { top: otherRect.top, bottom: otherRect.bottom, right: otherRect.left };
    }
  } else {
    rect = node.getBoundingClientRect();
  }
  var x = offset ? rect.right : rect.left;
  return { top: rect.top, bottom: rect.bottom, left: x, right: x };
}

var scrollMargin = 5;

function scrollIntoView(pm, pos) {
  if (!pos) pos = pm.sel.range.head;
  var coords = coordsAtPos(pm, pos);
  for (var _parent = pm.content;; _parent = _parent.parentNode) {
    var atBody = _parent == document.body;
    var rect = atBody ? windowRect() : _parent.getBoundingClientRect();
    if (coords.top < rect.top) _parent.scrollTop -= rect.top - coords.top + scrollMargin;else if (coords.bottom > rect.bottom) _parent.scrollTop += coords.bottom - rect.bottom + scrollMargin;
    if (coords.left < rect.left) _parent.scrollLeft -= rect.left - coords.left + scrollMargin;else if (coords.right > rect.right) _parent.scrollLeft += coords.right - rect.right + scrollMargin;
    if (atBody) break;
  }
}

function offsetInRects(coords, rects) {
  var y = coords.top;
  var x = coords.left;

  var minY = 1e5,
      minX = 1e5,
      offset = 0;
  for (var i = 0; i < rects.length; i++) {
    var rect = rects[i];
    if (!rect || rect.top == 0 && rect.bottom == 0) continue;
    var dY = y < rect.top ? rect.top - y : y > rect.bottom ? y - rect.bottom : 0;
    if (dY > minY) continue;
    if (dY < minY) {
      minY = dY;minX = 1e5;
    }
    var dX = x < rect.left ? rect.left - x : x > rect.right ? x - rect.right : 0;
    if (dX < minX) {
      minX = dX;
      offset = Math.abs(x - rect.left) < Math.abs(x - rect.right) ? i : i + 1;
    }
  }
  return offset;
}

function offsetInTextNode(text, coords) {
  var len = text.nodeValue.length;
  var range = document.createRange();
  var rects = [];
  for (var i = 0; i < len; i++) {
    range.setEnd(text, i + 1);
    range.setStart(text, i);
    rects.push(range.getBoundingClientRect());
  }
  return offsetInRects(coords, rects);
}

function offsetInElement(element, coords) {
  var rects = [];
  for (var child = element.firstChild; child; child = child.nextSibling) {
    rects.push(child.getBoundingClientRect());
  }return offsetInRects(coords, rects);
}

},{"../dom":10,"../model":37}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _model = require("../model");

var _edit = require("../edit");

var _inputrules = require("./inputrules");

(0, _edit.defineOption)("autoInput", false, function (pm, val, old) {
  if (val && !old) (0, _inputrules.addInputRules)(pm, rules);else if (!val && old) (0, _inputrules.removeInputRules)(pm, rules);
});

var rules = [new _inputrules.Rule("-", /--$/, "—"), new _inputrules.Rule('"', /\s(")$/, "“"), new _inputrules.Rule('"', /"$/, "”"), new _inputrules.Rule("'", /\s(')$/, "‘"), new _inputrules.Rule("'", /'$/, "’"), new _inputrules.Rule(" ", /^\s*> $/, function (pm, _, pos) {
  wrapAndJoin(pm, pos, "blockquote");
}), new _inputrules.Rule(" ", /^(\d+)\. $/, function (pm, match, pos) {
  var order = +match[1];
  wrapAndJoin(pm, pos, "ordered_list", { order: order || null, tight: true }, function (node) {
    return node.content.length + (node.attrs.order || 1) == order;
  });
}), new _inputrules.Rule(" ", /^\s*([-+*]) $/, function (pm, match, pos) {
  var bullet = match[1];
  wrapAndJoin(pm, pos, "bullet_list", { bullet: bullet, tight: true }, function (node) {
    return node.attrs.bullet == bullet;
  });
}), new _inputrules.Rule("`", /^```$/, function (pm, _, pos) {
  setAs(pm, pos, "code_block", { params: "" });
}), new _inputrules.Rule(" ", /^(#{1,6}) $/, function (pm, match, pos) {
  setAs(pm, pos, "heading", { level: match[1].length });
})];

exports.rules = rules;
function wrapAndJoin(pm, pos, type) {
  var attrs = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
  var predicate = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

  var parentOffset = pos.path[pos.path.length - 1];
  var sibling = parentOffset > 0 && pm.doc.path(pos.shorten()).content[parentOffset - 1];
  var join = sibling && sibling.type.name == type && (!predicate || predicate(sibling));
  var tr = pm.tr.wrap(pos, pos, new _model.Node(type, attrs));
  var delPos = tr.map(pos).pos;
  tr["delete"](new _model.Pos(delPos.path, 0), delPos);
  if (join) tr.join(tr.map(pos, -1).pos);
  pm.apply(tr);
}

function setAs(pm, pos, type, attrs) {
  pm.apply(pm.tr.setBlockType(pos, pos, new _model.Node(type, attrs))["delete"](new _model.Pos(pos.path, 0), pos));
}

},{"../edit":19,"../model":37,"./inputrules":28}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.addInputRules = addInputRules;
exports.removeInputRule = removeInputRule;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _model = require("../model");

function addInputRules(pm, rules) {
  if (!pm.mod.interpretInput) pm.mod.interpretInput = new InputRules(pm);
  pm.mod.interpretInput.addRules(rules);
}

function removeInputRule(pm, rules) {
  var ii = pm.mod.interpretInput;
  if (!ii) return;
  ii.removeRules(rules);
  if (ii.rules.length == 0) {
    ii.unregister();
    pm.mod.interpretInput = null;
  }
}

var Rule = function Rule(lastChar, match, handler) {
  _classCallCheck(this, Rule);

  this.lastChar = lastChar;
  this.match = match;
  this.handler = handler;
};

exports.Rule = Rule;

var InputRules = (function () {
  function InputRules(pm) {
    var _this = this;

    _classCallCheck(this, InputRules);

    this.pm = pm;
    this.rules = [];
    this.cancelVersion = null;

    pm.on("selectionChange", this.onSelChange = function () {
      return _this.cancelVersion = null;
    });
    pm.on("textInput", this.onTextInput = this.onTextInput.bind(this));
    pm.extendCommand("delBackward", "high", this.delBackward = this.delBackward.bind(this));
  }

  _createClass(InputRules, [{
    key: "unregister",
    value: function unregister() {
      this.pm.off("selectionChange", this.onSelChange);
      this.pm.off("textInput", this.onTextInput);
      this.pm.unextendCommand("delBackward", "high", this.delBackward);
    }
  }, {
    key: "addRules",
    value: function addRules(rules) {
      this.rules = this.rules.concat(rules);
    }
  }, {
    key: "removeRules",
    value: function removeRules(rules) {
      for (var i = 0; i < rules.length; i++) {
        var found = this.rules.indexOf(rules[i]);
        if (found > -1) this.rules.splice(found, 1);
      }
    }
  }, {
    key: "onTextInput",
    value: function onTextInput(text) {
      var pos = this.pm.selection.head;

      var textBefore = undefined,
          isCode = undefined;
      var lastCh = text[text.length - 1];

      for (var i = 0; i < this.rules.length; i++) {
        var rule = this.rules[i],
            match = undefined;
        if (rule.lastChar && rule.lastChar != lastCh) continue;
        if (textBefore == null) {
          ;
          var _getContext = getContext(this.pm.doc, pos);

          textBefore = _getContext.textBefore;
          isCode = _getContext.isCode;

          if (isCode) return;
        }
        if (match = rule.match.exec(textBefore)) {
          var startVersion = this.pm.history.getVersion();
          if (typeof rule.handler == "string") {
            var offset = pos.offset - (match[1] || match[0]).length;
            var start = new _model.Pos(pos.path, offset);
            var styles = (0, _model.spanStylesAt)(this.pm.doc, pos);
            this.pm.apply(this.pm.tr["delete"](start, pos).insert(start, _model.Span.text(rule.handler, styles)));
          } else {
            rule.handler(this.pm, match, pos);
          }
          this.cancelVersion = startVersion;
          return;
        }
      }
    }
  }, {
    key: "delBackward",
    value: function delBackward() {
      if (this.cancelVersion) {
        this.pm.history.backToVersion(this.cancelVersion);
        this.cancelVersion = null;
      } else {
        return false;
      }
    }
  }]);

  return InputRules;
})();

function getContext(doc, pos) {
  var parent = doc.path(pos.path);
  var isPlain = parent.type.plainText;
  var textBefore = "";
  for (var offset = 0, i = 0; offset < pos.offset;) {
    var child = parent.content[i++],
        size = child.size;
    textBefore += offset + size > pos.offset ? child.text.slice(0, pos.offset - offset) : child.text;
    if (offset + size >= pos.offset) {
      if (_model.style.contains(child.styles, _model.style.code)) isPlain = true;
      break;
    }
    offset += size;
  }
  return { textBefore: textBefore, isPlain: isPlain };
}

},{"../model":37}],29:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _edit = require("../edit");

var _dom = require("../dom");

var _editSelection = require("../edit/selection");

var _utilDebounce = require("../util/debounce");

var _tooltip = require("./tooltip");

var _menu = require("./menu");

var _items = require("./items");

var _insertCss = require("insert-css");

var _insertCss2 = _interopRequireDefault(_insertCss);

require("./icons");

var classPrefix = "ProseMirror-buttonmenu";

(0, _edit.defineOption)("buttonMenu", false, function (pm, value) {
  if (pm.mod.menu) pm.mod.menu.detach();
  pm.mod.menu = value ? new ButtonMenu(pm, value) : null;
});

var ButtonMenu = (function () {
  function ButtonMenu(pm, _config) {
    var _this = this;

    _classCallCheck(this, ButtonMenu);

    this.pm = pm;

    this.tooltip = new _tooltip.Tooltip(pm, "left");
    this.menu = new _menu.Menu(pm, new _menu.TooltipDisplay(this.tooltip));
    this.hamburger = pm.wrapper.appendChild((0, _dom.elt)("div", { "class": classPrefix + "-button" }, (0, _dom.elt)("div"), (0, _dom.elt)("div"), (0, _dom.elt)("div")));
    this.hamburger.addEventListener("mousedown", function (e) {
      e.preventDefault();e.stopPropagation();
      if (_this.tooltip.isOpen) _this.tooltip.close();else _this.openMenu();
    });

    this.debounced = new _utilDebounce.Debounced(pm, 100, function () {
      return _this.alignButton();
    });
    pm.on("selectionChange", this.updateFunc = function () {
      return _this.updated();
    });
    pm.on("change", this.updateFunc);
    pm.on("blur", this.updateFunc);

    this.blockItems = (0, _items.getItems)("block");
    this.allItems = [].concat(_toConsumableArray((0, _items.getItems)("inline")), [_items.separatorItem], _toConsumableArray(this.blockItems));

    this.pm.content.addEventListener("keydown", this.closeFunc = function () {
      return _this.tooltip.close();
    });
    this.pm.content.addEventListener("mousedown", this.closeFunc);

    (0, _items.forceFontLoad)(pm);
  }

  _createClass(ButtonMenu, [{
    key: "detach",
    value: function detach() {
      this.debounced.clear();
      this.hamburger.parentNode.removeChild(this.hamburger);
      this.tooltip.detach();

      this.pm.off("selectionChange", this.updateFunc);
      this.pm.off("change", this.updateFunc);
      this.pm.off("blur", this.updateFunc);
      this.pm.content.removeEventListener("keydown", this.closeFunc);
      this.pm.content.removeEventListener("mousedown", this.closeFunc);
    }
  }, {
    key: "updated",
    value: function updated() {
      if (!this.menu.active) {
        this.tooltip.close();
        this.debounced.trigger();
      }
    }
  }, {
    key: "openMenu",
    value: function openMenu() {
      var rect = this.hamburger.getBoundingClientRect();
      var pos = { left: rect.left, top: (rect.top + rect.bottom) / 2 };
      var showInline = this.pm.selection.empty || !this.pm.getOption("inlineMenu");
      this.menu.show(showInline ? this.allItems : this.blockItems, pos);
    }
  }, {
    key: "alignButton",
    value: function alignButton() {
      var blockElt = (0, _editSelection.resolvePath)(this.pm.content, this.pm.selection.from.path);

      var _blockElt$getBoundingClientRect = blockElt.getBoundingClientRect();

      var top = _blockElt$getBoundingClientRect.top;

      var around = this.pm.wrapper.getBoundingClientRect();
      this.hamburger.style.top = Math.max(top - this.hamburger.offsetHeight - 2 - around.top, 7) + "px";
    }
  }]);

  return ButtonMenu;
})();

(0, _insertCss2["default"])("\n\n.ProseMirror-buttonmenu-button {\n  display: none;\n  position: absolute;\n  top: 7px;\n  right: 7px;\n  width: 15px;\n  height: 13px;\n  cursor: pointer;\n\n  -webkit-transition: top 0.3s ease-out;\n  -moz-transition: top 0.3s ease-out;\n  transition: top 0.3s ease-out;\n}\n\n.ProseMirror-focused .ProseMirror-buttonmenu-button {\n  display: block;\n}\n\n.ProseMirror-buttonmenu-button div {\n  height: 3px;\n  margin-bottom: 2px;\n  border-radius: 4px;\n  background: #888;\n}\n\n.ProseMirror-buttonmenu-button:hover div {\n  background: #333;\n}\n\n");

},{"../dom":10,"../edit":19,"../edit/selection":26,"../util/debounce":53,"./icons":30,"./items":32,"./menu":33,"./tooltip":35,"insert-css":2}],30:[function(require,module,exports){
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _insertCss = require("insert-css");

var _insertCss2 = _interopRequireDefault(_insertCss);

(0, _insertCss2["default"])("\n\n.ProseMirror-icon-lift:after {\n  font-family: ProseMirror-icons;\n  content: \"\";\n}\n.ProseMirror-icon-join:after {\n  font-family: ProseMirror-icons;\n  content: \"\";\n}\n.ProseMirror-icon-image:after {\n  font-family: ProseMirror-icons;\n  content: \"\";\n}\n.ProseMirror-icon-strong:after {\n  font-family: ProseMirror-icons;\n  content: \"\";\n}\n.ProseMirror-icon-em:after {\n  font-family: ProseMirror-icons;\n  content: \"\";\n}\n.ProseMirror-icon-link:after {\n  font-family: ProseMirror-icons;\n  content: \"\";\n}\n.ProseMirror-icon-code:after {\n  font-family: ProseMirror-icons;\n  font-size: 110%;\n  content: \"\";\n}\n.ProseMirror-icon-list-ol:after {\n  font-family: ProseMirror-icons;\n  font-size: 110%;\n  content: \"\";\n}\n.ProseMirror-icon-list-ul:after {\n  font-family: ProseMirror-icons;\n  font-size: 110%;\n  content: \"\";\n}\n.ProseMirror-icon-quote:after {\n  font-family: ProseMirror-icons;\n  font-size: 110%;\n  content: \"\";\n}\n.ProseMirror-icon-hr:after {\n  font-family: ProseMirror-icons;\n  content: \"\";\n}\n.ProseMirror-icon-undo:after {\n  font-family: ProseMirror-icons;\n  content: \"\";\n}\n.ProseMirror-icon-redo:after {\n  font-family: ProseMirror-icons;\n  content: \"\";\n}\n\n@font-face {\n  font-family: ProseMirror-icons;\n  src: url(data:application/x-font-woff;base64,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) format('woff');\n  font-weight: normal;\n  font-style: normal;\n}\n\n");

},{"insert-css":2}],31:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _edit = require("../edit");

var _model = require("../model");

var _dom = require("../dom");

var _utilDebounce = require("../util/debounce");

var _tooltip = require("./tooltip");

var _items = require("./items");

var _menu = require("./menu");

var _insertCss = require("insert-css");

var _insertCss2 = _interopRequireDefault(_insertCss);

var classPrefix = "ProseMirror-inlinemenu";

(0, _edit.defineOption)("inlineMenu", false, function (pm, value) {
  if (pm.mod.inlineMenu) pm.mod.inlineMenu.detach();
  pm.mod.inlineMenu = value ? new InlineMenu(pm, value) : null;
});

var InlineMenu = (function () {
  function InlineMenu(pm, config) {
    var _this = this;

    _classCallCheck(this, InlineMenu);

    this.pm = pm;
    this.items = config && config.items || (0, _items.getItems)("inline");
    this.showLinks = config ? config.showLinks !== false : true;
    this.debounced = new _utilDebounce.Debounced(pm, 100, function () {
      return _this.update();
    });

    pm.on("selectionChange", this.updateFunc = function () {
      return _this.debounced.trigger();
    });
    pm.on("change", this.updateFunc);
    pm.on("blur", this.updateFunc);

    this.tooltip = new _tooltip.Tooltip(pm, "above");
    this.menu = new _menu.Menu(pm, new _menu.TooltipDisplay(this.tooltip, this.updateFunc));

    (0, _items.forceFontLoad)(pm);
  }

  _createClass(InlineMenu, [{
    key: "detach",
    value: function detach() {
      this.debounced.clear();
      this.tooltip.detach();

      this.pm.off("selectionChange", this.updateFunc);
      this.pm.off("change", this.updateFunc);
      this.pm.off("blur", this.updateFunc);
    }
  }, {
    key: "inPlainText",
    value: function inPlainText(sel) {
      var start = this.pm.doc.path(sel.from.path);
      var end = this.pm.doc.path(sel.to.path);
      return start.type.plainText && end.type.plainText;
    }
  }, {
    key: "update",
    value: function update() {
      if (this.menu.active) return;

      var sel = this.pm.selection,
          link = undefined;
      if (!this.pm.hasFocus()) this.tooltip.close();else if (!sel.empty && !this.inPlainText(sel)) this.menu.show(this.items, topCenterOfSelection());else if (this.showLinks && (link = this.linkUnderCursor())) this.showLink(link, this.pm.coordsAtPos(sel.head));else this.tooltip.close();
    }
  }, {
    key: "linkUnderCursor",
    value: function linkUnderCursor() {
      var styles = (0, _model.spanStylesAt)(this.pm.doc, this.pm.selection.head);
      return styles.reduce(function (found, st) {
        return found || st.type == "link" && st;
      }, null);
    }
  }, {
    key: "showLink",
    value: function showLink(link, pos) {
      var node = (0, _dom.elt)("div", { "class": classPrefix + "-linktext" }, (0, _dom.elt)("a", { href: link.href, title: link.title }, link.href));
      this.tooltip.open(node, pos);
    }
  }]);

  return InlineMenu;
})();

function topCenterOfSelection() {
  var rects = window.getSelection().getRangeAt(0).getClientRects();
  var _rects$0 = rects[0];
  var left = _rects$0.left;
  var right = _rects$0.right;
  var top = _rects$0.top;

  for (var i = 1; i < rects.length; i++) {
    if (rects[i].top < rects[0].bottom - 1 && (
    // Chrome bug where bogus rectangles are inserted at span boundaries
    i == rects.length - 1 || Math.abs(rects[i + 1].left - rects[i].left) > 1)) {
      left = Math.min(left, rects[i].left);
      right = Math.max(right, rects[i].right);
      top = Math.min(top, rects[i].top);
    }
  }
  return { top: top, left: (left + right) / 2 };
}

(0, _insertCss2["default"])("\n\n.ProseMirror-inlinemenu-linktext a {\n  color: white;\n  text-decoration: none;\n  padding: 0 5px;\n}\n\n.ProseMirror-inlinemenu-linktext a:hover {\n  text-decoration: underline;\n}\n\n");

},{"../dom":10,"../edit":19,"../model":37,"../util/debounce":53,"./items":32,"./menu":33,"./tooltip":35,"insert-css":2}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports.registerItem = registerItem;
exports.getItems = getItems;
exports.forceFontLoad = forceFontLoad;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _model = require("../model");

var _transform = require("../transform");

var _dom = require("../dom");

var _menu = require("./menu");

var _insertCss = require("insert-css");

var _insertCss2 = _interopRequireDefault(_insertCss);

require("./icons");

exports.MenuItem = _menu.MenuItem;

var tags = Object.create(null);

function registerItem(tag, item) {
  ;(tags[tag] || (tags[tag] = [])).push(item);
}

function getItems(tag) {
  return tags[tag] || [];
}

var IconItem = (function (_MenuItem) {
  _inherits(IconItem, _MenuItem);

  function IconItem(icon, title) {
    _classCallCheck(this, IconItem);

    _get(Object.getPrototypeOf(IconItem.prototype), "constructor", this).call(this);
    this.icon = icon;
    this.title = title;
  }

  _createClass(IconItem, [{
    key: "active",
    value: function active() {
      return false;
    }
  }, {
    key: "render",
    value: function render(menu) {
      var _this = this;

      var iconClass = "ProseMirror-menuicon";
      if (this.active(menu.pm)) iconClass += " ProseMirror-menuicon-active";
      var dom = (0, _dom.elt)("div", { "class": iconClass, title: this.title }, (0, _dom.elt)("span", { "class": "ProseMirror-menuicon ProseMirror-icon-" + this.icon }));
      dom.addEventListener("mousedown", function (e) {
        e.preventDefault();e.stopPropagation();
        menu.run(_this.apply(menu.pm));
      });
      return dom;
    }
  }]);

  return IconItem;
})(_menu.MenuItem);

exports.IconItem = IconItem;

var LiftItem = (function (_IconItem) {
  _inherits(LiftItem, _IconItem);

  function LiftItem() {
    _classCallCheck(this, LiftItem);

    _get(Object.getPrototypeOf(LiftItem.prototype), "constructor", this).call(this, "lift", "Move out of block");
  }

  _createClass(LiftItem, [{
    key: "select",
    value: function select(pm) {
      var sel = pm.selection;
      return (0, _transform.canLift)(pm.doc, sel.from, sel.to);
    }
  }, {
    key: "apply",
    value: function apply(pm) {
      var sel = pm.selection;
      pm.apply(pm.tr.lift(sel.from, sel.to));
    }
  }]);

  return LiftItem;
})(IconItem);

exports.LiftItem = LiftItem;

var JoinItem = (function (_IconItem2) {
  _inherits(JoinItem, _IconItem2);

  function JoinItem() {
    _classCallCheck(this, JoinItem);

    _get(Object.getPrototypeOf(JoinItem.prototype), "constructor", this).call(this, "join", "Join with block above");
  }

  _createClass(JoinItem, [{
    key: "select",
    value: function select(pm) {
      return (0, _transform.joinPoint)(pm.doc, pm.selection.head);
    }
  }, {
    key: "apply",
    value: function apply(pm) {
      pm.apply(pm.tr.join((0, _transform.joinPoint)(pm.doc, pm.selection.head)));
    }
  }]);

  return JoinItem;
})(IconItem);

exports.JoinItem = JoinItem;

var InsertBlockItem = (function (_IconItem3) {
  _inherits(InsertBlockItem, _IconItem3);

  function InsertBlockItem(icon, title, type, attrs) {
    _classCallCheck(this, InsertBlockItem);

    _get(Object.getPrototypeOf(InsertBlockItem.prototype), "constructor", this).call(this, icon, title);
    this.type = type;
    this.attrs = attrs;
  }

  _createClass(InsertBlockItem, [{
    key: "select",
    value: function select(pm) {
      var sel = pm.selection;
      return _model.Pos.samePath(sel.head.path, sel.anchor.path) && pm.doc.path(sel.head.path).type.type == _model.nodeTypes[this.type].type;
    }
  }, {
    key: "apply",
    value: function apply(pm) {
      var sel = pm.selection,
          tr = pm.tr,
          off = 0;
      if (sel.head.offset) {
        tr.split(sel.head);
        off = 1;
      }
      pm.apply(tr.insert(sel.head.shorten(null, off), new _model.Node(this.type, this.attrs)));
    }
  }]);

  return InsertBlockItem;
})(IconItem);

exports.InsertBlockItem = InsertBlockItem;

var WrapItem = (function (_IconItem4) {
  _inherits(WrapItem, _IconItem4);

  function WrapItem(icon, title, type) {
    _classCallCheck(this, WrapItem);

    _get(Object.getPrototypeOf(WrapItem.prototype), "constructor", this).call(this, icon, title);
    this.type = type;
  }

  _createClass(WrapItem, [{
    key: "select",
    value: function select(pm) {
      return (0, _transform.canWrap)(pm.doc, pm.selection.from, pm.selection.to, new _model.Node(this.type));
    }
  }, {
    key: "apply",
    value: function apply(pm) {
      var sel = pm.selection;
      pm.apply(pm.tr.wrap(sel.from, sel.to, new _model.Node(this.type)));
    }
  }]);

  return WrapItem;
})(IconItem);

exports.WrapItem = WrapItem;

var InlineStyleItem = (function (_IconItem5) {
  _inherits(InlineStyleItem, _IconItem5);

  function InlineStyleItem(icon, title, style, dialog) {
    _classCallCheck(this, InlineStyleItem);

    _get(Object.getPrototypeOf(InlineStyleItem.prototype), "constructor", this).call(this, icon, title);
    this.style = typeof style == "string" ? { type: style } : style;
    this.dialog = dialog;
  }

  _createClass(InlineStyleItem, [{
    key: "active",
    value: function active(pm) {
      var sel = pm.selection;
      if (sel.empty) return _model.style.containsType(pm.activeStyles(), this.style.type);else return (0, _model.rangeHasStyle)(pm.doc, sel.from, sel.to, this.style.type);
    }
  }, {
    key: "apply",
    value: function apply(pm) {
      var sel = pm.selection;
      if (this.active(pm)) {
        if (sel.empty) pm.setInlineStyle(this.style, false);else pm.apply(pm.tr.removeStyle(sel.from, sel.to, this.style.type));
      } else if (this.dialog) {
        return [this.dialog];
      } else {
        if (sel.empty) pm.setInlineStyle(this.style, true);else pm.apply(pm.tr.addStyle(sel.from, sel.to, this.style));
      }
    }
  }]);

  return InlineStyleItem;
})(IconItem);

exports.InlineStyleItem = InlineStyleItem;

var ImageItem = (function (_IconItem6) {
  _inherits(ImageItem, _IconItem6);

  function ImageItem() {
    _classCallCheck(this, ImageItem);

    _get(Object.getPrototypeOf(ImageItem.prototype), "constructor", this).call(this, "image", "Insert image");
  }

  _createClass(ImageItem, [{
    key: "apply",
    value: function apply() {
      return [imageDialog];
    }
  }]);

  return ImageItem;
})(IconItem);

exports.ImageItem = ImageItem;

var DialogItem = (function (_MenuItem2) {
  _inherits(DialogItem, _MenuItem2);

  function DialogItem() {
    _classCallCheck(this, DialogItem);

    _get(Object.getPrototypeOf(DialogItem.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(DialogItem, [{
    key: "focus",
    value: function focus(form) {
      var input = form.querySelector("input, textarea");
      if (input) input.focus();
    }
  }, {
    key: "render",
    value: function render(menu) {
      var _this2 = this;

      var form = this.form(menu.pm),
          done = false;

      var finish = function finish() {
        if (!done) {
          done = true;
          menu.pm.focus();
        }
      };

      var submit = function submit() {
        var result = _this2.apply(form, menu.pm);
        finish();
        menu.run(result);
      };
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        submit();
      });
      form.addEventListener("keydown", function (e) {
        if (e.keyCode == 27) {
          finish();
          menu.leave();
        } else if (e.keyCode == 13 && !(e.ctrlKey || e.metaKey || e.shiftKey)) {
          e.preventDefault();
          submit();
        }
      });
      // FIXME too hacky?
      setTimeout(function () {
        return _this2.focus(form);
      }, 20);
      return form;
    }
  }]);

  return DialogItem;
})(_menu.MenuItem);

exports.DialogItem = DialogItem;

var LinkDialog = (function (_DialogItem) {
  _inherits(LinkDialog, _DialogItem);

  function LinkDialog() {
    _classCallCheck(this, LinkDialog);

    _get(Object.getPrototypeOf(LinkDialog.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(LinkDialog, [{
    key: "form",
    value: function form() {
      return (0, _dom.elt)("form", null, (0, _dom.elt)("div", null, (0, _dom.elt)("input", { name: "href", type: "text", placeholder: "Target URL",
        size: 40, autocomplete: "off" })), (0, _dom.elt)("div", null, (0, _dom.elt)("input", { name: "title", type: "text", placeholder: "Title",
        size: 40, autocomplete: "off" })));
    }
  }, {
    key: "apply",
    value: function apply(form, pm) {
      var elts = form.elements;
      if (!elts.href.value) return;
      var sel = pm.selection;
      pm.apply(pm.tr.addStyle(sel.from, sel.to, _model.style.link(elts.href.value, elts.title.value)));
    }
  }]);

  return LinkDialog;
})(DialogItem);

exports.LinkDialog = LinkDialog;

var linkDialog = new LinkDialog();

var ImageDialog = (function (_DialogItem2) {
  _inherits(ImageDialog, _DialogItem2);

  function ImageDialog() {
    _classCallCheck(this, ImageDialog);

    _get(Object.getPrototypeOf(ImageDialog.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(ImageDialog, [{
    key: "form",
    value: function form(pm) {
      var alt = pm.selectedText;
      return (0, _dom.elt)("form", null, (0, _dom.elt)("div", null, (0, _dom.elt)("input", { name: "src", type: "text", placeholder: "Image URL",
        size: 40, autocomplete: "off" })), (0, _dom.elt)("div", null, (0, _dom.elt)("input", { name: "alt", type: "text", value: alt, autocomplete: "off",
        placeholder: "Description / alternative text", size: 40 })), (0, _dom.elt)("div", null, (0, _dom.elt)("input", { name: "title", type: "text", placeholder: "Title",
        size: 40, autcomplete: "off" })));
    }
  }, {
    key: "apply",
    value: function apply(form, pm) {
      var elts = form.elements;
      if (!elts.src.value) return;
      var sel = pm.selection,
          tr = pm.tr;
      tr["delete"](sel.from, sel.to);
      var attrs = { src: elts.src.value, alt: elts.alt.value, title: elts.title.value };
      pm.apply(tr.insertInline(sel.from, new _model.Span("image", attrs, null, null)));
    }
  }]);

  return ImageDialog;
})(DialogItem);

exports.ImageDialog = ImageDialog;

var imageDialog = new ImageDialog();

var SeparatorItem = (function (_MenuItem3) {
  _inherits(SeparatorItem, _MenuItem3);

  function SeparatorItem() {
    _classCallCheck(this, SeparatorItem);

    _get(Object.getPrototypeOf(SeparatorItem.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(SeparatorItem, [{
    key: "render",
    value: function render() {
      return (0, _dom.elt)("div", { "class": "ProseMirror-menuseparator" });
    }
  }]);

  return SeparatorItem;
})(_menu.MenuItem);

var separatorItem = new SeparatorItem();

exports.separatorItem = separatorItem;

var UndoItem = (function (_IconItem7) {
  _inherits(UndoItem, _IconItem7);

  function UndoItem() {
    _classCallCheck(this, UndoItem);

    _get(Object.getPrototypeOf(UndoItem.prototype), "constructor", this).call(this, "undo", "Undo");
  }

  _createClass(UndoItem, [{
    key: "select",
    value: function select(pm) {
      return pm.history.canUndo();
    }
  }, {
    key: "apply",
    value: function apply(pm) {
      pm.history.undo();
    }
  }]);

  return UndoItem;
})(IconItem);

var RedoItem = (function (_IconItem8) {
  _inherits(RedoItem, _IconItem8);

  function RedoItem() {
    _classCallCheck(this, RedoItem);

    _get(Object.getPrototypeOf(RedoItem.prototype), "constructor", this).call(this, "redo", "Redo");
  }

  _createClass(RedoItem, [{
    key: "select",
    value: function select(pm) {
      return pm.history.canRedo();
    }
  }, {
    key: "apply",
    value: function apply(pm) {
      pm.history.redo();
    }
  }]);

  return RedoItem;
})(IconItem);

var HistorySeparator = (function (_SeparatorItem) {
  _inherits(HistorySeparator, _SeparatorItem);

  function HistorySeparator() {
    _classCallCheck(this, HistorySeparator);

    _get(Object.getPrototypeOf(HistorySeparator.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(HistorySeparator, [{
    key: "select",
    value: function select(pm) {
      return pm.history.canUndo() || pm.history.canRedo();
    }
  }]);

  return HistorySeparator;
})(SeparatorItem);

var blockTypes = [{ name: "Normal", node: new _model.Node("paragraph") }, { name: "Code", node: new _model.Node("code_block") }];
for (var i = 1; i <= 6; i++) {
  blockTypes.push({ name: "Head " + i, node: new _model.Node("heading", { level: i }) });
}function getBlockType(block) {
  for (var i = 0; i < blockTypes.length; i++) {
    if (blockTypes[i].node.sameMarkup(block)) return blockTypes[i];
  }
}

var BlockTypeItem = (function (_MenuItem4) {
  _inherits(BlockTypeItem, _MenuItem4);

  function BlockTypeItem() {
    _classCallCheck(this, BlockTypeItem);

    _get(Object.getPrototypeOf(BlockTypeItem.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(BlockTypeItem, [{
    key: "render",
    value: function render(menu) {
      var sel = menu.pm.selection,
          type = undefined;
      if (_model.Pos.samePath(sel.head.path, sel.anchor.path)) type = getBlockType(menu.pm.doc.path(sel.head.path));
      var dom = (0, _dom.elt)("div", { "class": "ProseMirror-blocktype", title: "Paragraph type" }, type ? type.name : "Type...");
      dom.addEventListener("mousedown", function (e) {
        e.preventDefault();e.stopPropagation();
        showBlockTypeMenu(menu.pm, dom);
      });
      return dom;
    }
  }]);

  return BlockTypeItem;
})(_menu.MenuItem);

function showBlockTypeMenu(pm, dom) {
  var menu = (0, _dom.elt)("div", { "class": "ProseMirror-blocktype-menu" }, blockTypes.map(function (t) {
    var dom = (0, _dom.elt)("div", null, t.name);
    dom.addEventListener("mousedown", function (e) {
      e.preventDefault();
      var sel = pm.selection;
      pm.apply(pm.tr.setBlockType(sel.from, sel.to, t.node));
      finish();
    });
    return dom;
  }));
  var pos = dom.getBoundingClientRect(),
      box = pm.wrapper.getBoundingClientRect();
  menu.style.left = pos.left - box.left - 2 + "px";
  menu.style.top = pos.top - box.top - 2 + "px";

  var done = false;
  function finish() {
    if (done) return;
    done = true;
    document.body.removeEventListener("mousedown", finish);
    document.body.removeEventListener("keydown", finish);
    pm.wrapper.removeChild(menu);
  }
  document.body.addEventListener("mousedown", finish);
  document.body.addEventListener("keydown", finish);
  pm.wrapper.appendChild(menu);
}

registerItem("inline", new InlineStyleItem("strong", "Strong text", _model.style.strong));
registerItem("inline", new InlineStyleItem("em", "Emphasized text", _model.style.em));
registerItem("inline", new InlineStyleItem("link", "Hyperlink", "link", linkDialog));
registerItem("inline", new InlineStyleItem("code", "Code font", _model.style.code));
registerItem("inline", new ImageItem("image"));

registerItem("block", new BlockTypeItem());
registerItem("block", new LiftItem());
registerItem("block", new WrapItem("list-ol", "Wrap in ordered list", "ordered_list"));
registerItem("block", new WrapItem("list-ul", "Wrap in bullet list", "bullet_list"));
registerItem("block", new WrapItem("quote", "Wrap in blockquote", "blockquote"));
registerItem("block", new InsertBlockItem("hr", "Insert horizontal rule", "horizontal_rule"));
registerItem("block", new JoinItem());

registerItem("history", new HistorySeparator());
registerItem("history", new UndoItem());
registerItem("history", new RedoItem());

// Awkward hack to force Chrome to initialize the font and not return
// incorrect size information the first time it is used.

var forced = false;

function forceFontLoad(pm) {
  if (forced) return;
  forced = true;

  var node = pm.wrapper.appendChild((0, _dom.elt)("div", { "class": "ProseMirror-menuicon ProseMirror-icon-strong",
    style: "visibility: hidden; position: absolute" }));
  window.setTimeout(function () {
    return pm.wrapper.removeChild(node);
  }, 20);
}

(0, _insertCss2["default"])("\n\n.ProseMirror-menuicon {\n  display: inline-block;\n  padding: 1px 4px;\n  margin: 0 2px;\n  cursor: pointer;\n  text-rendering: auto;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  text-align: center;\n  vertical-align: middle;\n}\n\n.ProseMirror-menuicon-active {\n  background: #666;\n  border-radius: 4px;\n}\n\n.ProseMirror-menuseparator {\n  display: inline-block;\n}\n.ProseMirror-menuseparator:after {\n  content: \"︙\";\n  opacity: 0.5;\n  padding: 0 4px;\n  vertical-align: middle;\n}\n\n.ProseMirror-blocktype, .ProseMirror-blocktype-menu {\n  border: 1px solid #777;\n  border-radius: 3px;\n  font-size: 90%;\n}\n\n.ProseMirror-blocktype {\n  padding: 1px 2px 1px 4px;\n  display: inline-block;\n  vertical-align: middle;\n  cursor: pointer;\n  margin: 0 4px;\n}\n\n.ProseMirror-blocktype:after {\n  content: \" ▿\";\n  color: #777;\n  vertical-align: top;\n}\n\n.ProseMirror-blocktype-menu {\n  position: absolute;\n  background: #444;\n  color: white;\n  padding: 2px 2px;\n  z-index: 5;\n}\n.ProseMirror-blocktype-menu div {\n  cursor: pointer;\n  padding: 0 1em 0 2px;\n}\n.ProseMirror-blocktype-menu div:hover {\n  background: #777;\n}\n\n");

},{"../dom":10,"../model":37,"../transform":44,"./icons":30,"./menu":33,"insert-css":2}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _dom = require("../dom");

var _insertCss = require("insert-css");

var _insertCss2 = _interopRequireDefault(_insertCss);

var Menu = (function () {
  function Menu(pm, display) {
    _classCallCheck(this, Menu);

    this.display = display;
    this.stack = [];
    this.pm = pm;
  }

  _createClass(Menu, [{
    key: "show",
    value: function show(content, displayInfo) {
      this.stack.length = 0;
      this.enter(content, displayInfo);
    }
  }, {
    key: "reset",
    value: function reset() {
      this.stack.length = 0;
      this.display.reset();
    }
  }, {
    key: "enter",
    value: function enter(content, displayInfo) {
      var _this = this;

      var selected = content.filter(function (i) {
        return i.select(_this.pm);
      });
      if (!selected.length) return this.display.clear();

      this.stack.push(selected);
      this.draw(displayInfo);
    }
  }, {
    key: "draw",
    value: function draw(displayInfo) {
      var _this2 = this;

      var cur = this.stack[this.stack.length - 1];
      var rendered = (0, _dom.elt)("div", { "class": "ProseMirror-menu" }, cur.map(function (item) {
        return item.render(_this2);
      }));
      if (this.stack.length > 1) this.display.enter(rendered, function () {
        return _this2.leave();
      }, displayInfo);else this.display.show(rendered, displayInfo);
    }
  }, {
    key: "run",
    value: function run(content) {
      if (!content) return this.reset();else this.enter(content);
    }
  }, {
    key: "leave",
    value: function leave() {
      this.stack.pop();
      if (this.stack.length) this.draw();else this.display.reset();
    }
  }, {
    key: "active",
    get: function get() {
      return this.stack.length > 1;
    }
  }]);

  return Menu;
})();

exports.Menu = Menu;

var TooltipDisplay = (function () {
  function TooltipDisplay(tooltip, resetFunc) {
    _classCallCheck(this, TooltipDisplay);

    this.tooltip = tooltip;
    this.resetFunc = resetFunc;
  }

  _createClass(TooltipDisplay, [{
    key: "clear",
    value: function clear() {
      this.tooltip.close();
    }
  }, {
    key: "reset",
    value: function reset() {
      if (this.resetFunc) this.resetFunc();else this.clear();
    }
  }, {
    key: "show",
    value: function show(dom, info) {
      this.tooltip.open(dom, info);
    }
  }, {
    key: "enter",
    value: function enter(dom, back, info) {
      var button = (0, _dom.elt)("div", { "class": "ProseMirror-tooltip-back", title: "Back" });
      button.addEventListener("mousedown", function (e) {
        e.preventDefault();e.stopPropagation();
        back();
      });
      this.show((0, _dom.elt)("div", { "class": "ProseMirror-tooltip-back-wrapper" }, dom, button), info);
    }
  }]);

  return TooltipDisplay;
})();

exports.TooltipDisplay = TooltipDisplay;

var MenuItem = (function () {
  function MenuItem() {
    _classCallCheck(this, MenuItem);
  }

  _createClass(MenuItem, [{
    key: "select",
    value: function select() {
      return true;
    }
  }, {
    key: "render",
    value: function render() {
      throw new Error("You have to implement this");
    }
  }]);

  return MenuItem;
})();

exports.MenuItem = MenuItem;

(0, _insertCss2["default"])("\n\n.ProseMirror-menu {\n  margin: 0 -4px;\n  line-height: 1;\n  white-space: pre;\n  width: -webkit-fit-content;\n  width: fit-content;\n}\n\n.ProseMirror-tooltip-back-wrapper {\n  padding-left: 12px;\n}\n.ProseMirror-tooltip-back {\n  position: absolute;\n  top: 5px; left: 5px;\n  cursor: pointer;\n}\n.ProseMirror-tooltip-back:after {\n  content: \"«\";\n}\n\n");

},{"../dom":10,"insert-css":2}],34:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _edit = require("../edit");

var _dom = require("../dom");

var _utilDebounce = require("../util/debounce");

var _menu = require("./menu");

var _items = require("./items");

var _insertCss = require("insert-css");

var _insertCss2 = _interopRequireDefault(_insertCss);

require("./icons");

(0, _edit.defineOption)("menuBar", false, function (pm, value) {
  if (pm.mod.menuBar) pm.mod.menuBar.detach();
  pm.mod.menuBar = value ? new MenuBar(pm, value) : null;
});

var BarDisplay = (function () {
  function BarDisplay(container, resetFunc) {
    _classCallCheck(this, BarDisplay);

    this.container = container;
    this.resetFunc = resetFunc;
  }

  _createClass(BarDisplay, [{
    key: "clear",
    value: function clear() {
      this.container.textContent = "";
    }
  }, {
    key: "reset",
    value: function reset() {
      this.resetFunc();
    }
  }, {
    key: "show",
    value: function show(dom) {
      this.clear();
      this.container.appendChild(dom);
    }
  }, {
    key: "enter",
    value: function enter(dom, back) {
      var current = this.container.firstChild;
      if (current) {
        current.style.position = "absolute";
        current.style.opacity = "0.5";
      }
      var backButton = (0, _dom.elt)("div", { "class": "ProseMirror-menubar-back" });
      backButton.addEventListener("mousedown", function (e) {
        e.preventDefault();e.stopPropagation();
        back();
      });
      var added = (0, _dom.elt)("div", { "class": "ProseMirror-menubar-sliding" }, backButton, dom);
      this.container.appendChild(added);
      added.getBoundingClientRect(); // Force layout for transition
      added.style.left = "0";
      added.addEventListener("transitionend", function () {
        if (current && current.parentNode) current.parentNode.removeChild(current);
      });
    }
  }]);

  return BarDisplay;
})();

var MenuBar = (function () {
  function MenuBar(pm, config) {
    var _this = this;

    _classCallCheck(this, MenuBar);

    this.pm = pm;

    this.menuElt = (0, _dom.elt)("div", { "class": "ProseMirror-menubar-inner" });
    this.wrapper = (0, _dom.elt)("div", { "class": "ProseMirror-menubar" },
    // Height-forcing placeholder
    (0, _dom.elt)("div", { "class": "ProseMirror-menu", style: "visibility: hidden" }, (0, _dom.elt)("div", { "class": "ProseMirror-menuicon" }, (0, _dom.elt)("span", { "class": "ProseMirror-menuicon ProseMirror-icon-strong" }))), this.menuElt);
    pm.wrapper.insertBefore(this.wrapper, pm.wrapper.firstChild);

    this.menu = new _menu.Menu(pm, new BarDisplay(this.menuElt, function () {
      return _this.resetMenu();
    }));
    this.debounced = new _utilDebounce.Debounced(pm, 100, function () {
      return _this.update();
    });
    pm.on("selectionChange", this.updateFunc = function () {
      return _this.debounced.trigger();
    });
    pm.on("change", this.updateFunc);
    pm.on("activeStyleChange", this.updateFunc);

    this.menuItems = config && config.items || [].concat(_toConsumableArray((0, _items.getItems)("inline")), [_items.separatorItem], _toConsumableArray((0, _items.getItems)("block")), _toConsumableArray((0, _items.getItems)("history")));
    this.update();

    this.floating = false;
    if (config && config.float) {
      this.updateFloat();
      this.scrollFunc = function () {
        if (!document.body.contains(_this.pm.wrapper)) window.removeEventListener("scroll", _this.scrollFunc);else _this.updateFloat();
      };
      window.addEventListener("scroll", this.scrollFunc);
    }
  }

  _createClass(MenuBar, [{
    key: "detach",
    value: function detach() {
      this.debounced.clear();
      this.wrapper.parentNode.removeChild(this.wrapper);

      this.pm.off("selectionChange", this.updateFunc);
      this.pm.off("change", this.updateFunc);
      this.pm.off("activeStyleChange", this.updateFunc);
      if (this.scrollFunc) window.removeEventListener("scroll", this.scrollFunc);
    }
  }, {
    key: "update",
    value: function update() {
      if (!this.menu.active) this.resetMenu();
      if (this.floating) this.scrollCursorIfNeeded();
    }
  }, {
    key: "resetMenu",
    value: function resetMenu() {
      this.menu.show(this.menuItems);
    }
  }, {
    key: "updateFloat",
    value: function updateFloat() {
      var editorRect = this.pm.wrapper.getBoundingClientRect();
      if (this.floating) {
        if (editorRect.top >= 0 || editorRect.bottom < this.menuElt.offsetHeight + 10) {
          this.floating = false;
          this.menuElt.style.position = this.menuElt.style.left = this.menuElt.style.width = "";
          this.menuElt.style.display = "";
        } else {
          var border = (this.pm.wrapper.offsetWidth - this.pm.wrapper.clientWidth) / 2;
          this.menuElt.style.left = editorRect.left + border + "px";
          this.menuElt.style.display = editorRect.top > window.innerHeight ? "none" : "";
        }
      } else {
        if (editorRect.top < 0 && editorRect.bottom >= this.menuElt.offsetHeight + 10) {
          this.floating = true;
          var menuRect = this.menuElt.getBoundingClientRect();
          this.menuElt.style.left = menuRect.left + "px";
          this.menuElt.style.width = menuRect.width + "px";
          this.menuElt.style.position = "fixed";
        }
      }
    }
  }, {
    key: "scrollCursorIfNeeded",
    value: function scrollCursorIfNeeded() {
      var cursorPos = this.pm.coordsAtPos(this.pm.selection.head);
      var menuRect = this.menuElt.getBoundingClientRect();
      if (cursorPos.top < menuRect.bottom && cursorPos.bottom > menuRect.top) {
        var scrollable = findWrappingScrollable(this.pm.wrapper);
        if (scrollable) scrollable.scrollTop -= menuRect.bottom - cursorPos.top;
      }
    }
  }]);

  return MenuBar;
})();

function findWrappingScrollable(node) {
  for (var cur = node.parentNode; cur; cur = cur.parentNode) {
    if (cur.scrollHeight > cur.clientHeight) return cur;
  }
}

(0, _insertCss2["default"])("\n.ProseMirror-menubar {\n  padding: 1px 4px;\n  position: relative;\n  margin-bottom: 3px;\n  border-top-left-radius: inherit;\n  border-top-right-radius: inherit;\n}\n\n.ProseMirror-menubar-inner {\n  color: #666;\n  padding: 1px 4px;\n  top: 0; left: 0; right: 0;\n  position: absolute;\n  border-bottom: 1px solid silver;\n  background: white;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  overflow: hidden;\n  border-top-left-radius: inherit;\n  border-top-right-radius: inherit;\n}\n\n.ProseMirror-menubar .ProseMirror-menuicon-active {\n  background: #eee;\n}\n\n.ProseMirror-menubar input[type=\"text\"],\n.ProseMirror-menubar textarea {\n  background: #eee;\n  color: black;\n  border: none;\n  outline: none;\n  margin: 2px;\n}\n\n.ProseMirror-menubar input[type=\"text\"] {\n  padding: 0 4px;\n}\n\n.ProseMirror-menubar .ProseMirror-blocktype {\n  border: 1px solid #ccc;\n  min-width: 4em;\n}\n.ProseMirror-menubar .ProseMirror-blocktype:after {\n  color: #ccc;\n}\n\n.ProseMirror-menubar-sliding {\n  -webkit-transition: left 0.2s ease-out;\n  -moz-transition: left 0.2s ease-out;\n  transition: left 0.2s ease-out;\n  position: relative;\n  left: 100%;\n  width: 100%;\n  padding-left: 16px;\n  background: white;\n}\n\n.ProseMirror-menubar-back {\n  position: absolute;\n  height: 100%;\n  margin-top: -1px;\n  padding-bottom: 2px;\n  width: 10px;\n  left: 0;\n  border-right: 1px solid silver;\n  cursor: pointer;\n}\n.ProseMirror-menubar-back:after {\n  content: \"«\";\n}\n\n");

},{"../dom":10,"../edit":19,"../util/debounce":53,"./icons":30,"./items":32,"./menu":33,"insert-css":2}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _dom = require("../dom");

var _insertCss = require("insert-css");

var _insertCss2 = _interopRequireDefault(_insertCss);

var prefix = "ProseMirror-tooltip";

var Tooltip = (function () {
  function Tooltip(pm, dir) {
    var _this = this;

    _classCallCheck(this, Tooltip);

    this.pm = pm;
    this.dir = dir || "above";
    this.pointer = pm.wrapper.appendChild((0, _dom.elt)("div", { "class": prefix + "-pointer-" + this.dir + " " + prefix + "-pointer" }));
    this.pointerWidth = this.pointerHeight = null;
    this.dom = pm.wrapper.appendChild((0, _dom.elt)("div", { "class": prefix }));
    this.dom.addEventListener("transitionend", function () {
      if (_this.dom.style.opacity == "0") _this.dom.style.display = _this.pointer.style.display = "";
    });

    this.isOpen = false;
    this.lastLeft = this.lastRight = null;
  }

  _createClass(Tooltip, [{
    key: "detach",
    value: function detach() {
      this.dom.parentNode.removeChild(this.dom);
      this.pointer.parentNode.removeChild(this.pointer);
    }
  }, {
    key: "getSize",
    value: function getSize(node) {
      var wrap = this.pm.wrapper.appendChild((0, _dom.elt)("div", {
        "class": prefix,
        style: "display: block; position: absolute"
      }, node));
      var size = { width: wrap.offsetWidth, height: wrap.offsetHeight };
      wrap.parentNode.removeChild(wrap);
      return size;
    }
  }, {
    key: "open",
    value: function open(node, pos) {
      var left = this.lastLeft = pos ? pos.left : this.lastLeft;
      var top = this.lastTop = pos ? pos.top : this.lastTop;

      var size = this.getSize(node);

      var around = this.pm.wrapper.getBoundingClientRect();

      for (var child = this.dom.firstChild, next = undefined; child; child = next) {
        next = child.nextSibling;
        if (child != this.pointer) this.dom.removeChild(child);
      }
      this.dom.appendChild(node);

      this.dom.style.display = this.pointer.style.display = "block";

      if (this.pointerWidth == null) {
        this.pointerWidth = this.pointer.offsetWidth - 1;
        this.pointerHeight = this.pointer.offsetHeight - 1;
      }

      this.dom.style.width = size.width + "px";
      this.dom.style.height = size.height + "px";

      var margin = 5;
      if (this.dir == "above" || this.dir == "below") {
        var tipLeft = Math.max(0, Math.min(left - size.width / 2, window.innerWidth - size.width));
        this.dom.style.left = tipLeft - around.left + "px";
        this.pointer.style.left = left - around.left - this.pointerWidth / 2 + "px";
        if (this.dir == "above") {
          var tipTop = top - around.top - margin - this.pointerHeight - size.height;
          this.dom.style.top = tipTop + "px";
          this.pointer.style.top = tipTop + size.height + "px";
        } else {
          // below
          var tipTop = top - around.top + margin;
          this.pointer.style.top = tipTop + "px";
          this.dom.style.top = tipTop + this.pointerHeight + "px";
        }
      } else {
        // left/right
        this.dom.style.top = top - around.top - size.height / 2 + "px";
        this.pointer.style.top = top - this.pointerHeight / 2 - around.top + "px";
        if (this.dir == "left") {
          var pointerLeft = left - around.left - margin - this.pointerWidth;
          this.dom.style.left = pointerLeft - size.width + "px";
          this.pointer.style.left = pointerLeft + "px";
        } else {
          // right
          var pointerLeft = left - around.left + margin;
          this.dom.style.left = pointerLeft + this.pointerWidth + "px";
          this.pointer.style.left = pointerLeft + "px";
        }
      }

      getComputedStyle(this.dom).opacity;
      getComputedStyle(this.pointer).opacity;
      this.dom.style.opacity = this.pointer.style.opacity = 1;
      this.isOpen = true;
    }
  }, {
    key: "close",
    value: function close() {
      if (this.isOpen) {
        this.isOpen = false;
        this.dom.style.opacity = this.pointer.style.opacity = 0;
      }
    }
  }]);

  return Tooltip;
})();

exports.Tooltip = Tooltip;

(0, _insertCss2["default"])("\n\n.ProseMirror-tooltip {\n  position: absolute;\n  display: none;\n  box-sizing: border-box;\n  -moz-box-sizing: border- box;\n  overflow: hidden;\n\n  -webkit-transition: width 0.4s ease-out, height 0.4s ease-out, left 0.4s ease-out, top 0.4s ease-out, opacity 0.2s;\n  -moz-transition: width 0.4s ease-out, height 0.4s ease-out, left 0.4s ease-out, top 0.4s ease-out, opacity 0.2s;\n  transition: width 0.4s ease-out, height 0.4s ease-out, left 0.4s ease-out, top 0.4s ease-out, opacity 0.2s;\n  opacity: 0;\n\n  border-radius: 5px;\n  padding: 3px 7px;\n  margin: 0;\n  background: #444;\n  border-color: #777;\n  color: white;\n\n  z-index: 5;\n}\n\n.ProseMirror-tooltip-pointer {\n  content: \"\";\n  position: absolute;\n  display: none;\n  width: 0; height: 0;\n\n  -webkit-transition: left 0.4s ease-out, top 0.4s ease-out, opacity 0.2s;\n  -moz-transition: left 0.4s ease-out, top 0.4s ease-out, opacity 0.2s;\n  transition: left 0.4s ease-out, top 0.4s ease-out, opacity 0.2s;\n  opacity: 0;\n\n  z-index: 5;\n}\n\n.ProseMirror-tooltip-pointer-above {\n  border-left: 6px solid transparent;\n  border-right: 6px solid transparent;\n  border-top: 6px solid #444;\n}\n\n.ProseMirror-tooltip-pointer-below {\n  border-left: 6px solid transparent;\n  border-right: 6px solid transparent;\n  border-bottom: 6px solid #444;\n}\n\n.ProseMirror-tooltip-pointer-right {\n  border-top: 6px solid transparent;\n  border-bottom: 6px solid transparent;\n  border-right: 6px solid #444;\n}\n\n.ProseMirror-tooltip-pointer-left {\n  border-top: 6px solid transparent;\n  border-bottom: 6px solid transparent;\n  border-left: 6px solid #444;\n}\n\n.ProseMirror-tooltip input[type=\"text\"],\n.ProseMirror-tooltip textarea {\n  background: #666;\n  color: white;\n  border: none;\n  outline: none;\n}\n\n.ProseMirror-tooltip input[type=\"text\"] {\n  padding: 0 4px;\n}\n\n");

},{"../dom":10,"insert-css":2}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findDiffStart = findDiffStart;
exports.findDiffEnd = findDiffEnd;

var _pos = require("./pos");

var _style = require("./style");

function findDiffStart(a, b) {
  var pathA = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
  var pathB = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];

  var offset = 0;
  for (var i = 0;; i++) {
    if (i == a.content.length || i == b.content.length) {
      if (a.content.length == b.content.length) return null;
      break;
    }
    var childA = a.content[i],
        childB = b.content[i];
    if (childA == childB) {
      offset += a.type.block ? childA.text.length : 1;
      continue;
    }

    if (!childA.sameMarkup(childB)) break;

    if (a.type.block) {
      if (!(0, _style.sameSet)(childA.styles, childB.styles)) break;
      if (childA.text != childB.text) {
        for (var j = 0; childA.text[j] == childB.text[j]; j++) {
          offset++;
        }break;
      }
      offset += childA.text.length;
    } else {
      var inner = findDiffStart(childA, childB, pathA.concat(i), pathB.concat(i));
      if (inner) return inner;
      offset++;
    }
  }
  return { a: new _pos.Pos(pathA, offset), b: new _pos.Pos(pathB, offset) };
}

function findDiffEnd(a, b) {
  var pathA = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
  var pathB = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];

  var iA = a.content.length,
      iB = b.content.length;
  var offset = 0;

  for (;; iA--, iB--) {
    if (iA == 0 || iB == 0) {
      if (iA == iB) return null;
      break;
    }
    var childA = a.content[iA - 1],
        childB = b.content[iB - 1];
    if (childA == childB) {
      offset += a.type.block ? childA.text.length : 1;
      continue;
    }

    if (!childA.sameMarkup(childB)) break;

    if (a.type.block) {
      if (!(0, _style.sameSet)(childA.styles, childB.styles)) break;

      if (childA.text != childB.text) {
        var same = 0,
            minSize = Math.min(childA.text.length, childB.text.length);
        while (same < minSize && childA.text[childA.text.length - same - 1] == childB.text[childB.text.length - same - 1]) {
          same++;
          offset++;
        }
        break;
      }
      offset += childA.text.length;
    } else {
      var inner = findDiffEnd(childA, childB, pathA.concat(iA - 1), pathB.concat(iB - 1));
      if (inner) return inner;
      offset++;
    }
  }
  return { a: new _pos.Pos(pathA, a.maxOffset - offset),
    b: new _pos.Pos(pathB, b.maxOffset - offset) };
}

},{"./pos":40,"./style":42}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
        value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _style = require("./style");

var style = _interopRequireWildcard(_style);

var _node = require("./node");

Object.defineProperty(exports, "Node", {
        enumerable: true,
        get: function get() {
                return _node.Node;
        }
});
Object.defineProperty(exports, "Span", {
        enumerable: true,
        get: function get() {
                return _node.Span;
        }
});
Object.defineProperty(exports, "nodeTypes", {
        enumerable: true,
        get: function get() {
                return _node.nodeTypes;
        }
});
Object.defineProperty(exports, "NodeType", {
        enumerable: true,
        get: function get() {
                return _node.NodeType;
        }
});
Object.defineProperty(exports, "findConnection", {
        enumerable: true,
        get: function get() {
                return _node.findConnection;
        }
});

var _pos = require("./pos");

Object.defineProperty(exports, "Pos", {
        enumerable: true,
        get: function get() {
                return _pos.Pos;
        }
});
exports.style = style;

var _slice = require("./slice");

Object.defineProperty(exports, "sliceBefore", {
        enumerable: true,
        get: function get() {
                return _slice.sliceBefore;
        }
});
Object.defineProperty(exports, "sliceAfter", {
        enumerable: true,
        get: function get() {
                return _slice.sliceAfter;
        }
});
Object.defineProperty(exports, "sliceBetween", {
        enumerable: true,
        get: function get() {
                return _slice.sliceBetween;
        }
});

var _inline = require("./inline");

Object.defineProperty(exports, "stitchTextNodes", {
        enumerable: true,
        get: function get() {
                return _inline.stitchTextNodes;
        }
});
Object.defineProperty(exports, "clearMarkup", {
        enumerable: true,
        get: function get() {
                return _inline.clearMarkup;
        }
});
Object.defineProperty(exports, "spanAtOrBefore", {
        enumerable: true,
        get: function get() {
                return _inline.spanAtOrBefore;
        }
});
Object.defineProperty(exports, "getSpan", {
        enumerable: true,
        get: function get() {
                return _inline.getSpan;
        }
});
Object.defineProperty(exports, "spanStylesAt", {
        enumerable: true,
        get: function get() {
                return _inline.spanStylesAt;
        }
});
Object.defineProperty(exports, "rangeHasStyle", {
        enumerable: true,
        get: function get() {
                return _inline.rangeHasStyle;
        }
});
Object.defineProperty(exports, "splitSpansAt", {
        enumerable: true,
        get: function get() {
                return _inline.splitSpansAt;
        }
});

var _diff = require("./diff");

Object.defineProperty(exports, "findDiffStart", {
        enumerable: true,
        get: function get() {
                return _diff.findDiffStart;
        }
});
Object.defineProperty(exports, "findDiffEnd", {
        enumerable: true,
        get: function get() {
                return _diff.findDiffEnd;
        }
});

},{"./diff":36,"./inline":38,"./node":39,"./pos":40,"./slice":41,"./style":42}],38:[function(require,module,exports){
// Primitive operations on inline content

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stitchTextNodes = stitchTextNodes;
exports.clearMarkup = clearMarkup;
exports.getSpan = getSpan;
exports.spanAtOrBefore = spanAtOrBefore;
exports.spanStylesAt = spanStylesAt;
exports.rangeHasStyle = rangeHasStyle;
exports.splitSpansAt = splitSpansAt;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _node = require("./node");

var _style = require("./style");

var style = _interopRequireWildcard(_style);

function stitchTextNodes(node, at) {
  var before = undefined,
      after = undefined;
  if (at && node.content.length > at && (before = node.content[at - 1]).type == _node.nodeTypes.text && (after = node.content[at]).type == _node.nodeTypes.text && style.sameSet(before.styles, after.styles)) {
    var joined = _node.Span.text(before.text + after.text, before.styles);
    node.content.splice(at - 1, 2, joined);
    return true;
  }
}

function clearMarkup(node) {
  if (node.content.length > 1 || node.content[0].type != _node.nodeTypes.text || node.content[0].styles.length) {
    var text = "";
    for (var i = 0; i < node.content.length; i++) {
      var child = node.content[i];
      if (child.type == _node.nodeTypes.text) text += child.text;
    }
    node.content = [_node.Span.text(text)];
  }
}

function getSpan(doc, pos) {
  return spanAtOrBefore(doc.path(pos.path), pos.offset).node;
}

function spanAtOrBefore(parent, offset) {
  for (var i = 0; i < parent.content.length; i++) {
    var child = parent.content[i];
    offset -= child.size;
    if (offset <= 0) return { node: child, offset: i, innerOffset: offset + child.size };
  }
  return { node: null, offset: 0, innerOffset: 0 };
}

function spanStylesAt(doc, pos) {
  var _spanAtOrBefore = spanAtOrBefore(doc.path(pos.path), pos.offset);

  var node = _spanAtOrBefore.node;

  return node ? node.styles : _node.Node.empty;
}

function rangeHasStyle(doc, from, to, type) {
  function scan(_x, _x2, _x3, _x4, _x5) {
    var _left;

    var _again = true;

    _function: while (_again) {
      var node = _x,
          from = _x2,
          to = _x3,
          type = _x4,
          depth = _x5;
      start = end = i = offset = child = size = start = end = found = i = undefined;
      _again = false;

      if (node.type.block) {
        var start = from ? from.offset : 0;
        var end = to ? to.offset : 1e5;
        for (var i = 0, offset = 0; i < node.content.length; i++) {
          var child = node.content[i],
              size = child.text.length;
          if (offset < end && offset + size > start && style.containsType(child.styles, type)) return true;
          offset += size;
        }
      } else if (node.content.length) {
        var start = from ? from.path[depth] : 0;
        var end = to ? to.path[depth] : node.content.length - 1;
        if (start == end) {
          _x = node.content[start];
          _x2 = from;
          _x3 = to;
          _x4 = type;
          _x5 = depth + 1;
          _again = true;
          continue _function;
        } else {
          var found = scan(node.content[start], from, null, type, depth + 1);
          for (var i = start + 1; i < end && !found; i++) {
            found = scan(node.content[i], null, null, type, depth + 1);
          }
          if (_left = found) {
            return _left;
          }

          _x = node.content[end];
          _x2 = null;
          _x3 = to;
          _x4 = type;
          _x5 = depth + 1;
          _again = true;
          continue _function;
        }
      }
    }
  }
  return scan(doc, from, to, type, 0);
}

function splitSpansAt(parent, offset_) {
  var _spanAtOrBefore2 = spanAtOrBefore(parent, offset_);

  var node = _spanAtOrBefore2.node;
  var offset = _spanAtOrBefore2.offset;
  var innerOffset = _spanAtOrBefore2.innerOffset;

  if (innerOffset && innerOffset != node.size) {
    parent.content.splice(offset, 1, node.slice(0, innerOffset), node.slice(innerOffset));
    offset += 1;
  } else if (innerOffset) {
    offset += 1;
  }
  return { offset: offset, styles: node ? node.styles : _node.Node.empty };
}

},{"./node":39,"./style":42}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x6, _x7, _x8) { var _again = true; _function: while (_again) { var object = _x6, property = _x7, receiver = _x8; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x6 = parent; _x7 = property; _x8 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.findConnection = findConnection;

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Node = (function () {
  function Node(type, attrs, content) {
    if (attrs === undefined) attrs = null;

    _classCallCheck(this, Node);

    if (typeof type == "string") {
      var found = nodeTypes[type];
      if (!found) throw new Error("Unknown node type: " + type);
      type = found;
    }
    if (!(type instanceof NodeType)) throw new Error("Invalid node type: " + type);
    this.type = type;
    this.content = content || (type.contains ? [] : Node.empty);
    if (!attrs && !(attrs = type.defaultAttrs)) throw new Error("No default attributes for node type " + type.name);
    this.attrs = attrs || type.defaultAttrs;
  }

  _createClass(Node, [{
    key: "toString",
    value: function toString() {
      if (this.type.contains) return this.type.name + "(" + this.content.join(", ") + ")";else return this.type.name;
    }
  }, {
    key: "copy",
    value: function copy() {
      var content = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      return new Node(this.type, this.attrs, content);
    }
  }, {
    key: "push",
    value: function push(child) {
      if (this.type.contains != child.type.type) throw new Error("Can't insert " + child.type.name + " into " + this.type.name);
      this.content.push(child);
    }
  }, {
    key: "pushFrom",
    value: function pushFrom(other) {
      var start = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
      var end = arguments.length <= 2 || arguments[2] === undefined ? other.content.length : arguments[2];
      return (function () {
        for (var i = start; i < end; i++) {
          this.push(other.content[i]);
        }
      }).apply(this, arguments);
    }
  }, {
    key: "pushNodes",
    value: function pushNodes(array) {
      for (var i = 0; i < array.length; i++) {
        this.push(array[i]);
      }
    }
  }, {
    key: "slice",
    value: function slice(from) {
      var to = arguments.length <= 1 || arguments[1] === undefined ? this.maxOffset : arguments[1];

      if (from == to) return [];
      if (!this.type.block) return this.content.slice(from, to);
      var result = [];
      for (var i = 0, offset = 0;; i++) {
        var child = this.content[i],
            size = child.size,
            end = offset + size;
        if (offset + size > from) result.push(offset >= from && end <= to ? child : child.slice(Math.max(0, from - offset), Math.min(size, to - offset)));
        if (end >= to) return result;
        offset = end;
      }
    }
  }, {
    key: "remove",
    value: function remove(child) {
      var found = this.content.indexOf(child);
      if (found == -1) throw new Error("Child not found");
      this.content.splice(found, 1);
    }
  }, {
    key: "path",
    value: function path(_path) {
      for (var i = 0, node = this; i < _path.length; node = node.content[_path[i]], i++) {}
      return node;
    }
  }, {
    key: "isValidPos",
    value: function isValidPos(pos, requireInBlock) {
      for (var i = 0, node = this;; i++) {
        if (i == pos.path.length) {
          if (requireInBlock && !node.type.block) return false;
          return pos.offset <= node.maxOffset;
        } else {
          var n = pos.path[i];
          if (n >= node.content.length || node.type.block) return false;
          node = node.content[n];
        }
      }
    }
  }, {
    key: "pathNodes",
    value: function pathNodes(path) {
      var nodes = [];
      for (var i = 0, node = this;; i++) {
        nodes.push(node);
        if (i == path.length) break;
        node = node.content[path[i]];
      }
      return nodes;
    }
  }, {
    key: "sameMarkup",
    value: function sameMarkup(other) {
      return Node.compareMarkup(this.type, other.type, this.attrs, other.attrs);
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      var obj = { type: this.type.name };
      if (this.content.length) obj.content = this.content.map(function (n) {
        return n.toJSON();
      });
      if (this.attrs != nullAttrs) obj.attrs = this.attrs;
      return obj;
    }
  }, {
    key: "size",
    get: function get() {
      var sum = 0;
      for (var i = 0; i < this.content.length; i++) {
        sum += this.content[i].size;
      }return sum;
    }
  }, {
    key: "maxOffset",
    get: function get() {
      return this.type.block ? this.size : this.content.length;
    }
  }, {
    key: "textContent",
    get: function get() {
      var text = "";
      for (var i = 0; i < this.content.length; i++) {
        text += this.content[i].textContent;
      }return text;
    }
  }], [{
    key: "compareMarkup",
    value: function compareMarkup(typeA, typeB, attrsA, attrsB) {
      if (typeA != typeB) return false;
      for (var prop in attrsA) if (attrsB[prop] !== attrsA[prop]) return false;
      return true;
    }
  }, {
    key: "fromJSON",
    value: function fromJSON(json) {
      var type = nodeTypes[json.type];
      if (type.type == "span") return Span.fromJSON(type, json);else return new Node(type, maybeNull(json.attrs), json.content ? json.content.map(function (n) {
        return Node.fromJSON(n);
      }) : Node.empty);
    }
  }]);

  return Node;
})();

exports.Node = Node;

Node.empty = []; // Reused empty array for collections that are guaranteed to remain empty

function maybeNull(obj) {
  if (!obj) return nullAttrs;
  for (var _prop in obj) {
    return obj;
  }return nullAttrs;
}

var Span = (function (_Node) {
  _inherits(Span, _Node);

  function Span(type, attrs, styles, text) {
    _classCallCheck(this, Span);

    _get(Object.getPrototypeOf(Span.prototype), "constructor", this).call(this, type, attrs);
    this.text = text == null ? "×" : text;
    this.styles = styles || Node.empty;
  }

  _createClass(Span, [{
    key: "toString",
    value: function toString() {
      if (this.type == nodeTypes.text) {
        var text = JSON.stringify(this.text);
        for (var i = 0; i < this.styles.length; i++) {
          text = this.styles[i].type + "(" + text + ")";
        }return text;
      } else {
        return _get(Object.getPrototypeOf(Span.prototype), "toString", this).call(this);
      }
    }
  }, {
    key: "slice",
    value: function slice(from) {
      var to = arguments.length <= 1 || arguments[1] === undefined ? this.text.length : arguments[1];

      return new Span(this.type, this.attrs, this.styles, this.text.slice(from, to));
    }
  }, {
    key: "copy",
    value: function copy() {
      throw new Error("Can't copy span nodes like this!");
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      var obj = { type: this.type.name };
      if (this.attrs != nullAttrs) obj.attrs = this.attrs;
      if (this.text != "×") obj.text = this.text;
      if (this.styles.length) obj.styles = this.styles;
      return obj;
    }
  }, {
    key: "size",
    get: function get() {
      return this.text.length;
    }
  }, {
    key: "textContent",
    get: function get() {
      return this.text;
    }
  }], [{
    key: "fromJSON",
    value: function fromJSON(type, json) {
      return new Span(type, maybeNull(json.attrs), json.styles || Node.empty, json.text || "×");
    }
  }, {
    key: "text",
    value: function text(_text, styles) {
      return new Span(nodeTypes.text, null, styles, _text);
    }
  }]);

  return Span;
})(Node);

exports.Span = Span;

var nullAttrs = Node.nullAttrs = {};

var NodeType = function NodeType(options) {
  _classCallCheck(this, NodeType);

  this.name = options.name;
  this.type = options.type;
  this.contains = options.contains;
  this.block = this.contains == "span";
  this.defaultAttrs = options.defaultAttrs;
  if (this.defaultAttrs == null) this.defaultAttrs = nullAttrs;
  this.plainText = !!options.plainText;
};

exports.NodeType = NodeType;
var nodeTypes = {
  doc: new NodeType({ type: "doc", contains: "element" }),
  paragraph: new NodeType({ type: "element", contains: "span" }),
  blockquote: new NodeType({ type: "element", contains: "element" }),
  heading: new NodeType({ type: "element", contains: "span", defaultAttrs: false }),
  bullet_list: new NodeType({ type: "element", contains: "list_item", defaultAttrs: { bullet: "*", tight: true } }),
  ordered_list: new NodeType({ type: "element", contains: "list_item", defaultAttrs: { order: 1, tight: true } }),
  list_item: new NodeType({ type: "list_item", contains: "element" }),
  html_block: new NodeType({ type: "element", defaultAttrs: false }),
  code_block: new NodeType({ type: "element", contains: "span", defaultAttrs: { params: null }, plainText: true }),
  horizontal_rule: new NodeType({ type: "element" }),
  text: new NodeType({ type: "span" }),
  image: new NodeType({ type: "span", defaultAttrs: false }),
  hard_break: new NodeType({ type: "span" }),
  html_tag: new NodeType({ type: "span", defaultAttrs: false })
};

exports.nodeTypes = nodeTypes;
for (var _name in nodeTypes) {
  nodeTypes[_name].name = _name;
}
function findConnection(from, to) {
  if (from.contains == to.type) return [];

  var seen = Object.create(null);
  var active = [{ from: from, via: [] }];
  while (active.length) {
    var current = active.shift();
    for (var _name2 in nodeTypes) {
      var type = nodeTypes[_name2];
      if (current.from.contains == type.type && !(type.contains in seen)) {
        var via = current.via.concat(type);
        if (type.contains == to.type) return via;
        active.push({ from: type, via: via });
        seen[type.contains] = true;
      }
    }
  }
}

},{}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pos = (function () {
  function Pos(path, offset) {
    _classCallCheck(this, Pos);

    this.path = path;
    this.offset = offset;
  }

  _createClass(Pos, [{
    key: "toString",
    value: function toString() {
      return this.path.join("/") + ":" + this.offset;
    }
  }, {
    key: "cmp",
    value: function cmp(other) {
      return Pos.cmp(this.path, this.offset, other.path, other.offset);
    }
  }, {
    key: "shorten",
    value: function shorten() {
      var to = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
      var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      if (to == this.depth) return this;
      return Pos.shorten(this.path, to, offset);
    }
  }, {
    key: "shift",
    value: function shift(by) {
      return new Pos(this.path, this.offset + by);
    }
  }, {
    key: "offsetAt",
    value: function offsetAt(pos, offset) {
      var path = this.path.slice();
      path[pos] += offset;
      return new Pos(path, this.offset);
    }
  }, {
    key: "extend",
    value: function extend(pos) {
      var path = this.path.slice(),
          add = this.offset;
      for (var i = 0; i < pos.path.length; i++) {
        path.push(pos.path[i] + add);
        add = 0;
      }
      return new Pos(path, pos.offset + add);
    }
  }, {
    key: "depth",
    get: function get() {
      return this.path.length;
    }
  }], [{
    key: "cmp",
    value: function cmp(pathA, offsetA, pathB, offsetB) {
      var lenA = pathA.length,
          lenB = pathB.length;
      for (var i = 0, end = Math.min(lenA, lenB); i < end; i++) {
        var diff = pathA[i] - pathB[i];
        if (diff != 0) return diff;
      }
      if (lenA > lenB) return offsetB <= pathA[i] ? 1 : -1;else if (lenB > lenA) return offsetA <= pathB[i] ? -1 : 1;else return offsetA - offsetB;
    }
  }, {
    key: "samePath",
    value: function samePath(pathA, pathB) {
      if (pathA.length != pathB.length) return false;
      for (var i = 0; i < pathA.length; i++) {
        if (pathA[i] !== pathB[i]) return false;
      }return true;
    }
  }, {
    key: "shorten",
    value: function shorten(path) {
      var to = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
      var offset = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

      if (to == null) to = path.length - 1;
      return new Pos(path.slice(0, to), path[to] + offset);
    }
  }, {
    key: "fromJSON",
    value: function fromJSON(json) {
      return new Pos(json.path, json.offset);
    }
  }]);

  return Pos;
})();

exports.Pos = Pos;

function findLeft(node, path) {
  if (node.type.block) return new Pos(path, 0);
  for (var i = 0; i < node.content.length; i++) {
    path.push(i);
    var found = findLeft(node.content[i], path);
    if (found) return found;
    path.pop();
  }
}

function findAfter(node, pos, path) {
  if (node.type.block) return pos;
  var atEnd = path.length == pos.path.length;
  var start = atEnd ? pos.offset : pos.path[path.length];
  for (var i = start; i < node.content.length; i++) {
    path.push(i);
    var child = node.content[i];
    var found = i == start && !atEnd ? findAfter(child, pos, path) : findLeft(child, path);
    if (found) return found;
    path.pop();
  }
}

Pos.after = function (node, pos) {
  return findAfter(node, pos, []);
};
Pos.start = function (node) {
  return findLeft(node, []);
};

function findRight(node, path) {
  if (node.type.block) return new Pos(path, node.size);
  for (var i = node.content.length - 1; i >= 0; i--) {
    path.push(i);
    var found = findRight(node.content[i], path);
    if (found) return found;
    path.pop();
  }
}

function findBefore(node, pos, path) {
  if (node.type.block) return pos;
  var atEnd = pos.path.length == path.length;
  var end = atEnd ? pos.offset - 1 : pos.path[path.length];
  for (var i = end; i >= 0; i--) {
    path.push(i);
    var child = node.content[i];
    var found = i == end && !atEnd ? findBefore(child, pos, path) : findRight(child, path);
    if (found) return found;
    path.pop();
  }
}

Pos.before = function (node, pos) {
  return findBefore(node, pos, []);
};
Pos.end = function (node) {
  return findRight(node, []);
};

Pos.near = function (node, pos) {
  return Pos.after(node, pos) || Pos.before(node, pos);
};

},{}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sliceBefore = sliceBefore;
exports.sliceAfter = sliceAfter;
exports.sliceBetween = sliceBetween;

var _node = require("./node");

function copyInlineTo(node, offset, copy) {
  for (var left = offset, i = 0; left > 0; i++) {
    var chunk = node.content[i];
    if (chunk.text.length <= left) {
      left -= chunk.text.length;
      copy.push(chunk);
    } else {
      copy.push(chunk.slice(0, left));
      break;
    }
  }
}

function copyInlineFrom(node, offset, copy) {
  for (var before = offset, i = 0; i < node.content.length; i++) {
    var chunk = node.content[i];
    if (before == 0) {
      copy.push(chunk);
    } else if (chunk.text.length <= before) {
      before -= chunk.text.length;
    } else {
      copy.push(chunk.slice(before));
      before = 0;
    }
  }
}

function copyInlineBetween(node, from, to, copy) {
  if (from == to) return;

  for (var pos = 0, i = 0; pos < to; i++) {
    var chunk = node.content[i],
        size = chunk.text.length;
    if (pos < from) {
      if (pos + size > from) copy.push(chunk.slice(from - pos, Math.min(to - pos, size)));
    } else if (pos + size <= to) {
      copy.push(chunk);
    } else if (pos < to) {
      copy.push(chunk.slice(0, to - pos));
    }
    pos += size;
  }
}

function sliceBefore(node, pos) {
  var depth = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

  var copy = node.copy();
  if (depth < pos.depth) {
    var n = pos.path[depth];
    copy.pushFrom(node, 0, n);
    copy.push(sliceBefore(node.content[n], pos, depth + 1));
  } else if (node.type.contains != "span") {
    copy.pushFrom(node, 0, pos.offset);
  } else {
    copyInlineTo(node, pos.offset, copy);
  }
  return copy;
}

function sliceAfter(node, pos) {
  var depth = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

  var copy = node.copy();
  if (depth < pos.depth) {
    var n = pos.path[depth];
    copy.push(sliceAfter(node.content[n], pos, depth + 1));
    copy.pushFrom(node, n + 1);
  } else if (node.type.contains != "span") {
    copy.pushFrom(node, pos.offset);
  } else {
    copyInlineFrom(node, pos.offset, copy);
  }
  return copy;
}

function sliceBetween(node, from, to) {
  var collapse = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];
  var depth = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];

  if (depth < from.depth && depth < to.depth && from.path[depth] == to.path[depth]) {
    var inner = sliceBetween(node.content[from.path[depth]], from, to, collapse, depth + 1);
    if (!collapse) return node.copy([inner]);
    if (node.type.name != "doc") return inner;
    var conn = (0, _node.findConnection)(node.type, inner.type);
    for (var i = conn.length - 1; i >= 0; i--) {
      inner = new _node.Node(conn[i], null, [inner]);
    }return node.copy([inner]);
  } else {
    var copy = node.copy();
    if (depth == from.depth && depth == to.depth && node.type.block) {
      copyInlineBetween(node, from.offset, to.offset, copy);
    } else {
      var start = undefined;
      if (depth < from.depth) {
        start = from.path[depth] + 1;
        copy.push(sliceAfter(node.content[start - 1], from, depth + 1));
      } else {
        start = from.offset;
      }
      var end = depth < to.depth ? to.path[depth] : to.offset;
      copy.pushFrom(node, start, end);
      if (depth < to.depth) copy.push(sliceBefore(node.content[end], to, depth + 1));
    }
    return copy;
  }
}

},{"./node":39}],42:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.link = link;
exports.add = add;
exports.remove = remove;
exports.removeType = removeType;
exports.sameSet = sameSet;
exports.same = same;
exports.contains = contains;
exports.containsType = containsType;
var code = { type: "code" };
exports.code = code;
var em = { type: "em" };
exports.em = em;
var strong = { type: "strong" };

exports.strong = strong;

function link(href, title) {
  return { type: "link", href: href, title: title || null };
}

var ordering = ["em", "strong", "link", "code"];

exports.ordering = ordering;

function add(styles, style) {
  var order = ordering.indexOf(style.type);
  for (var i = 0; i < styles.length; i++) {
    var other = styles[i];
    if (other.type == style.type) {
      if (same(other, style)) return styles;else return styles.slice(0, i).concat(style).concat(styles.slice(i + 1));
    }
    if (ordering.indexOf(other.type) > order) return styles.slice(0, i).concat(style).concat(styles.slice(i));
  }
  return styles.concat(style);
}

function remove(styles, style) {
  for (var i = 0; i < styles.length; i++) if (same(style, styles[i])) return styles.slice(0, i).concat(styles.slice(i + 1));
  return styles;
}

function removeType(styles, type) {
  for (var i = 0; i < styles.length; i++) if (styles[i].type == type) return styles.slice(0, i).concat(styles.slice(i + 1));
  return styles;
}

function sameSet(a, b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (!same(a[i], b[i])) return false;
  }return true;
}

function same(a, b) {
  if (a == b) return true;
  for (var prop in a) {
    if (a[prop] != b[prop]) return false;
  }for (var prop in b) {
    if (a[prop] != b[prop]) return false;
  }return true;
}

function contains(set, style) {
  for (var i = 0; i < set.length; i++) {
    if (same(set[i], style)) return true;
  }return false;
}

function containsType(set, type) {
  for (var i = 0; i < set.length; i++) {
    if (set[i].type == type) return set[i];
  }return false;
}

},{}],43:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canLift = canLift;
exports.canWrap = canWrap;

var _model = require("../model");

var _transform = require("./transform");

var _step = require("./step");

var _tree = require("./tree");

var _map = require("./map");

(0, _step.defineStep)("ancestor", {
  apply: function apply(doc, step) {
    var from = step.from,
        to = step.to;
    if (!(0, _tree.isFlatRange)(from, to)) return null;
    var toParent = from.path,
        start = from.offset,
        end = to.offset;
    var depth = step.param.depth || 0,
        wrappers = step.param.wrappers || _model.Node.empty;
    if (!depth && wrappers.length == 0) return null;
    for (var i = 0; i < depth; i++) {
      if (start > 0 || end < doc.path(toParent).maxOffset || toParent.length == 0) return null;
      start = toParent[toParent.length - 1];
      end = start + 1;
      toParent = toParent.slice(0, toParent.length - 1);
    }
    var copy = (0, _tree.copyTo)(doc, toParent);
    var parent = copy.path(toParent),
        inner = copy.path(from.path);
    var parentSize = parent.content.length;
    if (wrappers.length) {
      var lastWrapper = wrappers[wrappers.length - 1];
      if (parent.type.contains != wrappers[0].type.type || lastWrapper.type.contains != inner.type.contains || lastWrapper.type.plainText && !(0, _tree.isPlainText)(inner)) return null;
      var node = null;
      for (var i = wrappers.length - 1; i >= 0; i--) {
        node = wrappers[i].copy(node ? [node] : inner.content.slice(from.offset, to.offset));
      }parent.content.splice(start, end - start, node);
    } else {
      if (parent.type.contains != inner.type.contains) return null;
      parent.content = parent.content.slice(0, start).concat(inner.content).concat(parent.content.slice(end));
    }

    var toInner = toParent.slice();
    for (var i = 0; i < wrappers.length; i++) {
      toInner.push(i ? 0 : start);
    }var startOfInner = new _model.Pos(toInner, wrappers.length ? 0 : start);
    var replaced = null;
    var insertedSize = wrappers.length ? 1 : to.offset - from.offset;
    if (depth != wrappers.length || depth > 1 || wrappers.length > 1) {
      var posBefore = new _model.Pos(toParent, start);
      var posAfter1 = new _model.Pos(toParent, end),
          posAfter2 = new _model.Pos(toParent, start + insertedSize);
      var endOfInner = new _model.Pos(toInner, startOfInner.offset + (to.offset - from.offset));
      replaced = [new _map.ReplacedRange(posBefore, from, posBefore, startOfInner), new _map.ReplacedRange(to, posAfter1, endOfInner, posAfter2, posAfter1, posAfter2)];
    }
    var moved = [new _map.MovedRange(from, to.offset - from.offset, startOfInner)];
    if (end - start != insertedSize) moved.push(new _map.MovedRange(new _model.Pos(toParent, end), parentSize - end, new _model.Pos(toParent, start + insertedSize)));
    return new _transform.TransformResult(copy, new _map.PosMap(moved, replaced));
  },
  invert: function invert(step, oldDoc, map) {
    var wrappers = [];
    if (step.param.depth) for (var i = 0; i < step.param.depth; i++) {
      var _parent = oldDoc.path(step.from.path.slice(0, step.from.path.length - i));
      wrappers.unshift(_parent.copy());
    }
    var newFrom = map.map(step.from).pos;
    var newTo = step.from.cmp(step.to) ? map.map(step.to, -1).pos : newFrom;
    return new _step.Step("ancestor", newFrom, newTo, null, { depth: step.param.wrappers ? step.param.wrappers.length : 0,
      wrappers: wrappers });
  },
  paramToJSON: function paramToJSON(param) {
    return { depth: param.depth,
      wrappers: param.wrappers && param.wrappers.map(function (n) {
        return n.toJSON();
      }) };
  },
  paramFromJSON: function paramFromJSON(json) {
    return { depth: json.depth,
      wrappers: json.wrappers && json.wrappers.map(_model.Node.fromJSON) };
  }
});

function canUnwrap(container, from, to) {
  var type = container.content[from].type.contains;
  for (var i = from + 1; i < to; i++) {
    if (container.content[i].type.contains != type) return false;
  }return type;
}

function canBeLifted(doc, range) {
  var container = doc.path(range.path);
  var parentDepth = undefined,
      unwrap = false,
      innerType = container.type.contains;
  for (;;) {
    parentDepth = -1;
    for (var node = doc, i = 0; i < range.path.length; i++) {
      if (node.type.contains == innerType) parentDepth = i;
      node = node.content[range.path[i]];
    }
    if (parentDepth > -1) return { path: range.path.slice(0, parentDepth),
      unwrap: unwrap };
    if (unwrap || !(innerType = canUnwrap(container, range.from, range.to))) return null;
    unwrap = true;
  }
}

function canLift(doc, from, to) {
  var range = (0, _tree.selectedSiblings)(doc, from, to || from);
  var found = canBeLifted(doc, range);
  if (found) return { found: found, range: range };
}

_transform.Transform.prototype.lift = function (from) {
  var to = arguments.length <= 1 || arguments[1] === undefined ? from : arguments[1];
  return (function () {
    var can = canLift(this.doc, from, to);
    if (!can) return this;
    var found = can.found;
    var range = can.range;

    var depth = range.path.length - found.path.length;
    var rangeNode = found.unwrap && this.doc.path(range.path);

    for (var d = 0, pos = new _model.Pos(range.path, range.to);; d++) {
      if (pos.offset < this.doc.path(pos.path).content.length) {
        this.split(pos, depth);
        break;
      }
      if (d == depth - 1) break;
      pos = pos.shorten(null, 1);
    }
    for (var d = 0, pos = new _model.Pos(range.path, range.from);; d++) {
      if (pos.offset > 0) {
        this.split(pos, depth - d);
        var cut = range.path.length - depth,
            path = pos.path.slice(0, cut).concat(pos.path[cut] + 1);
        while (path.length < range.path.length) path.push(0);
        range = { path: path, from: 0, to: range.to - range.from };
        break;
      }
      if (d == depth - 1) break;
      pos = pos.shorten();
    }
    if (found.unwrap) {
      for (var i = range.to - 1; i > range.from; i--) {
        this.join(new _model.Pos(range.path, i));
      }var size = 0;
      for (var i = range.from; i < range.to; i++) {
        size += rangeNode.content[i].content.length;
      }range = { path: range.path.concat(range.from), from: 0, to: size };
      ++depth;
    }
    this.step("ancestor", new _model.Pos(range.path, range.from), new _model.Pos(range.path, range.to), null, { depth: depth });
    return this;
  }).apply(this, arguments);
};

function canWrap(doc, from, to, node) {
  var range = (0, _tree.selectedSiblings)(doc, from, to || from);
  if (range.from == range.to) return null;
  var parent = doc.path(range.path);
  var around = (0, _model.findConnection)(parent.type, node.type);
  var inside = (0, _model.findConnection)(node.type, parent.content[range.from].type);
  if (around && inside) return { range: range, around: around, inside: inside };
}

_transform.Transform.prototype.wrap = function (from, to, node) {
  var can = canWrap(this.doc, from, to, node);
  if (!can) return this;
  var range = can.range;
  var around = can.around;
  var inside = can.inside;

  var wrappers = around.map(function (t) {
    return new _model.Node(t);
  }).concat(node).concat(inside.map(function (t) {
    return new _model.Node(t);
  }));
  this.step("ancestor", new _model.Pos(range.path, range.from), new _model.Pos(range.path, range.to), null, { wrappers: wrappers });
  if (inside.length) {
    var toInner = range.path.slice();
    for (var i = 0; i < around.length + inside.length + 1; i++) {
      toInner.push(i ? 0 : range.from);
    }for (var i = range.to - 1 - range.from; i > 0; i--) {
      this.split(new _model.Pos(toInner, i), inside.length);
    }
  }
  return this;
};

_transform.Transform.prototype.setBlockType = function (from, to, wrapNode) {
  var _this = this;

  (0, _tree.blocksBetween)(this.doc, from, to || from, function (node, path) {
    path = path.slice();
    if (wrapNode.type.plainText && !(0, _tree.isPlainText)(node)) _this.clearMarkup(new _model.Pos(path, 0), new _model.Pos(path, node.size));
    _this.step("ancestor", new _model.Pos(path, 0), new _model.Pos(path, node.size), null, { depth: 1, wrappers: [wrapNode] });
  });
  return this;
};

},{"../model":37,"./map":46,"./step":49,"./transform":51,"./tree":52}],44:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

require("./style");

require("./split");

require("./replace");

var _transform = require("./transform");

Object.defineProperty(exports, "Result", {
  enumerable: true,
  get: function get() {
    return _transform.Result;
  }
});
Object.defineProperty(exports, "Transform", {
  enumerable: true,
  get: function get() {
    return _transform.Transform;
  }
});

var _step = require("./step");

Object.defineProperty(exports, "Step", {
  enumerable: true,
  get: function get() {
    return _step.Step;
  }
});
Object.defineProperty(exports, "applyStep", {
  enumerable: true,
  get: function get() {
    return _step.applyStep;
  }
});
Object.defineProperty(exports, "invertStep", {
  enumerable: true,
  get: function get() {
    return _step.invertStep;
  }
});

var _ancestor = require("./ancestor");

Object.defineProperty(exports, "canLift", {
  enumerable: true,
  get: function get() {
    return _ancestor.canLift;
  }
});
Object.defineProperty(exports, "canWrap", {
  enumerable: true,
  get: function get() {
    return _ancestor.canWrap;
  }
});

var _join = require("./join");

Object.defineProperty(exports, "joinPoint", {
  enumerable: true,
  get: function get() {
    return _join.joinPoint;
  }
});

var _map = require("./map");

Object.defineProperty(exports, "MapResult", {
  enumerable: true,
  get: function get() {
    return _map.MapResult;
  }
});
Object.defineProperty(exports, "mapStep", {
  enumerable: true,
  get: function get() {
    return _map.mapStep;
  }
});
Object.defineProperty(exports, "Remapping", {
  enumerable: true,
  get: function get() {
    return _map.Remapping;
  }
});

},{"./ancestor":43,"./join":45,"./map":46,"./replace":47,"./split":48,"./step":49,"./style":50,"./transform":51}],45:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.joinPoint = joinPoint;

var _model = require("../model");

var _transform = require("./transform");

var _step = require("./step");

var _tree = require("./tree");

var _map = require("./map");

(0, _step.defineStep)("join", {
  apply: function apply(doc, step) {
    var before = doc.path(step.from.path);
    var after = doc.path(step.to.path);
    if (step.from.offset < before.maxOffset || step.to.offset > 0 || before.type.contains != after.type.contains) return null;
    var pFrom = step.from.path,
        pTo = step.to.path;
    var last = pFrom.length - 1,
        offset = pFrom[last] + 1;
    if (pFrom.length != pTo.length || pFrom.length == 0 || offset != pTo[last]) return null;
    for (var i = 0; i < last; i++) {
      if (pFrom[i] != pTo[i]) return null;
    }var targetPath = pFrom.slice(0, last);
    var copy = (0, _tree.copyTo)(doc, targetPath);
    var target = copy.path(targetPath),
        oldSize = target.content.length;
    var joined = new _model.Node(before.type, before.attrs, before.content.concat(after.content));
    if (joined.type.block) (0, _model.stitchTextNodes)(joined, before.content.length);
    target.content.splice(offset - 1, 2, joined);

    var map = new _map.PosMap([new _map.MovedRange(step.to, after.maxOffset, step.from), new _map.MovedRange(new _model.Pos(targetPath, offset + 1), oldSize - offset - 1, new _model.Pos(targetPath, offset))], [new _map.ReplacedRange(step.from, step.to, step.from, step.from, step.to.shorten())]);
    return new _transform.TransformResult(copy, map);
  },
  invert: function invert(step, oldDoc) {
    return new _step.Step("split", null, null, step.from, oldDoc.path(step.to.path).copy());
  }
});

function joinPoint(doc, pos) {
  var dir = arguments.length <= 2 || arguments[2] === undefined ? -1 : arguments[2];

  var joinDepth = -1;
  for (var i = 0, _parent = doc; i < pos.path.length; i++) {
    var index = pos.path[i];
    var type = _parent.content[index].type;
    if (!type.block && (dir == -1 ? index > 0 && _parent.content[index - 1].type == type : index < _parent.content.length - 1 && _parent.content[index + 1].type == type)) joinDepth = i;
    _parent = _parent.content[index];
  }
  if (joinDepth > -1) return pos.shorten(joinDepth, dir == -1 ? 0 : 1);
}

_transform.Transform.prototype.join = function (at) {
  var parent = this.doc.path(at.path);
  if (at.offset == 0 || at.offset == parent.content.length || parent.type.block) return this;
  this.step("join", new _model.Pos(at.path.concat(at.offset - 1), parent.content[at.offset - 1].maxOffset), new _model.Pos(at.path.concat(at.offset), 0));
  return this;
};

},{"../model":37,"./map":46,"./step":49,"./transform":51,"./tree":52}],46:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.mapStep = mapStep;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _model = require("../model");

var _step = require("./step");

var MovedRange = (function () {
  function MovedRange(start, size) {
    var dest = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    _classCallCheck(this, MovedRange);

    this.start = start;
    this.size = size;
    this.dest = dest;
  }

  _createClass(MovedRange, [{
    key: "toString",
    value: function toString() {
      return "[moved " + this.start + "+" + this.size + " to " + this.dest + "]";
    }
  }, {
    key: "end",
    get: function get() {
      return new _model.Pos(this.start.path, this.start.offset + this.size);
    }
  }]);

  return MovedRange;
})();

exports.MovedRange = MovedRange;

var Side = function Side(from, to, ref) {
  _classCallCheck(this, Side);

  this.from = from;
  this.to = to;
  this.ref = ref;
};

var ReplacedRange = (function () {
  function ReplacedRange(from, to, newFrom, newTo) {
    var ref = arguments.length <= 4 || arguments[4] === undefined ? from : arguments[4];
    var newRef = arguments.length <= 5 || arguments[5] === undefined ? newFrom : arguments[5];
    return (function () {
      _classCallCheck(this, ReplacedRange);

      this.before = new Side(from, to, ref);
      this.after = new Side(newFrom, newTo, newRef);
    }).apply(this, arguments);
  }

  _createClass(ReplacedRange, [{
    key: "toString",
    value: function toString() {
      return "[replaced " + this.before.from + "-" + this.before.to + " with " + this.after.from + "-" + this.after.to + "]";
    }
  }]);

  return ReplacedRange;
})();

exports.ReplacedRange = ReplacedRange;

var empty = [];

var MapResult = function MapResult(pos) {
  var deleted = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
  var recover = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

  _classCallCheck(this, MapResult);

  this.pos = pos;
  this.deleted = deleted;
  this.recover = recover;
};

exports.MapResult = MapResult;

function offsetFrom(base, pos) {
  if (pos.path.length > base.path.length) {
    var path = [pos.path[base.path.length] - base.offset];
    for (var i = base.path.length + 1; i < pos.path.length; i++) {
      path.push(pos.path[i]);
    }return new _model.Pos(path, pos.offset);
  } else {
    return new _model.Pos([], pos.offset - base.offset);
  }
}

function mapThrough(map, pos, bias, back) {
  if (bias === undefined) bias = 1;

  for (var i = 0; i < map.replaced.length; i++) {
    var range = map.replaced[i],
        side = back ? range.after : range.before;
    var left = undefined,
        right = undefined;
    if ((left = pos.cmp(side.from)) >= 0 && (right = pos.cmp(side.to)) <= 0) {
      var other = back ? range.before : range.after;
      return new MapResult(bias < 0 ? other.from : other.to, !!(left && right), { rangeID: i, offset: offsetFrom(side.ref, pos) });
    }
  }

  for (var i = 0; i < map.moved.length; i++) {
    var range = map.moved[i];
    var start = back ? range.dest : range.start;
    if (pos.cmp(start) >= 0 && _model.Pos.cmp(pos.path, pos.offset, start.path, start.offset + range.size) <= 0) {
      var dest = back ? range.start : range.dest;
      var depth = start.depth;
      if (pos.depth > depth) {
        var offset = dest.offset + (pos.path[depth] - start.offset);
        return new MapResult(new _model.Pos(dest.path.concat(offset).concat(pos.path.slice(depth + 1)), pos.offset));
      } else {
        return new MapResult(new _model.Pos(dest.path, dest.offset + (pos.offset - start.offset)));
      }
    }
  }

  return new MapResult(pos);
}

var PosMap = (function () {
  function PosMap(moved, replaced) {
    _classCallCheck(this, PosMap);

    this.moved = moved || empty;
    this.replaced = replaced || empty;
  }

  _createClass(PosMap, [{
    key: "recover",
    value: function recover(offset) {
      return this.replaced[offset.rangeID].after.ref.extend(offset.offset);
    }
  }, {
    key: "map",
    value: function map(pos, bias) {
      return mapThrough(this, pos, bias, false);
    }
  }, {
    key: "invert",
    value: function invert() {
      return new InvertedPosMap(this);
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.moved.concat(this.replaced).join(" ");
    }
  }]);

  return PosMap;
})();

exports.PosMap = PosMap;

var InvertedPosMap = (function () {
  function InvertedPosMap(map) {
    _classCallCheck(this, InvertedPosMap);

    this.inner = map;
  }

  _createClass(InvertedPosMap, [{
    key: "recover",
    value: function recover(offset) {
      return this.inner.replaced[offset.rangeID].before.ref.extend(offset.offset);
    }
  }, {
    key: "map",
    value: function map(pos, bias) {
      return mapThrough(this.inner, pos, bias, true);
    }
  }, {
    key: "invert",
    value: function invert() {
      return this.inner;
    }
  }, {
    key: "toString",
    value: function toString() {
      return "-" + this.inner;
    }
  }]);

  return InvertedPosMap;
})();

var nullMap = new PosMap();

exports.nullMap = nullMap;

var Remapping = (function () {
  function Remapping() {
    var head = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    var tail = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
    var mirror = arguments.length <= 2 || arguments[2] === undefined ? Object.create(null) : arguments[2];

    _classCallCheck(this, Remapping);

    this.head = head;
    this.tail = tail;
    this.mirror = mirror;
  }

  _createClass(Remapping, [{
    key: "addToFront",
    value: function addToFront(map, corr) {
      this.head.push(map);
      var id = -this.head.length;
      if (corr != null) this.mirror[id] = corr;
      return id;
    }
  }, {
    key: "addToBack",
    value: function addToBack(map, corr) {
      this.tail.push(map);
      var id = this.tail.length - 1;
      if (corr != null) this.mirror[corr] = id;
      return id;
    }
  }, {
    key: "get",
    value: function get(id) {
      return id < 0 ? this.head[-id - 1] : this.tail[id];
    }
  }, {
    key: "map",
    value: function map(pos, bias) {
      var deleted = false;

      for (var i = -this.head.length; i < this.tail.length; i++) {
        var map = this.get(i);
        var result = map.map(pos, bias);
        if (result.recover) {
          var corr = this.mirror[i];
          if (corr != null) {
            i = corr;
            pos = this.get(corr).recover(result.recover);
            continue;
          }
        }
        if (result.deleted) deleted = true;
        pos = result.pos;
      }

      return new MapResult(pos, deleted);
    }
  }]);

  return Remapping;
})();

exports.Remapping = Remapping;

function maxPos(a, b) {
  return a.cmp(b) > 0 ? a : b;
}

function mapStep(step, remapping) {
  var allDeleted = true;
  var from = null,
      to = null,
      pos = null;

  if (step.from) {
    var result = remapping.map(step.from, 1);
    from = result.pos;
    if (!result.deleted) allDeleted = false;
  }
  if (step.to) {
    if (step.to.cmp(step.from) == 0) {
      to = from;
    } else {
      var result = remapping.map(step.to, -1);
      to = maxPos(result.pos, from);
      if (!result.deleted) allDeleted = false;
    }
  }
  if (step.pos) {
    if (from && step.pos.cmp(step.from) == 0) {
      pos = from;
    } else if (to && step.pos.cmp(step.to) == 0) {
      pos = to;
    } else {
      var result = remapping.map(step.pos, 1);
      pos = result.pos;
      if (!result.deleted) allDeleted = false;
    }
  }
  if (!allDeleted) return new _step.Step(step.name, from, to, pos, step.param);
}

},{"../model":37,"./step":49}],47:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.replace = replace;

var _model = require("../model");

var _transform = require("./transform");

var _step = require("./step");

var _map = require("./map");

var _tree = require("./tree");

function sizeBefore(node, at) {
  if (node.type.block) {
    var size = 0;
    for (var i = 0; i < at; i++) {
      size += node.content[i].size;
    }return size;
  } else {
    return at;
  }
}

function replace(doc, from, to, root, repl) {
  var origParent = doc.path(root);
  if (repl.nodes.length && repl.nodes[0].type.type != origParent.type.contains) return null;

  var copy = (0, _tree.copyTo)(doc, root);
  var parent = copy.path(root);
  parent.content.length = 0;
  var depth = root.length;

  var fromEnd = depth == from.depth;
  var start = fromEnd ? from.offset : from.path[depth];
  parent.pushNodes(origParent.slice(0, start));
  if (!fromEnd) {
    parent.push((0, _model.sliceBefore)(origParent.content[start], from, depth + 1));
    ++start;
  } else {
    start = parent.content.length;
  }
  parent.pushNodes(repl.nodes);
  var end = undefined;
  if (depth == to.depth) {
    end = to.offset;
  } else {
    var n = to.path[depth];
    parent.push((0, _model.sliceAfter)(origParent.content[n], to, depth + 1));
    end = n + 1;
  }
  parent.pushNodes(origParent.slice(end));

  var moved = [];

  var rightEdge = start + repl.nodes.length,
      startLen = parent.content.length;
  if (repl.nodes.length) mendLeft(parent, start, depth, repl.openLeft);
  mendRight(parent, rightEdge + (parent.content.length - startLen), root, repl.nodes.length ? repl.openRight : from.depth - depth);

  function mendLeft(node, at, depth, open) {
    if (node.type.block) return (0, _model.stitchTextNodes)(node, at);

    if (open == 0 || depth == from.depth || at == 0 || at == node.content.length) return;

    var before = node.content[at - 1],
        after = node.content[at];
    if (before.sameMarkup(after)) {
      var oldSize = before.content.length;
      before.pushFrom(after);
      node.content.splice(at, 1);
      mendLeft(before, oldSize, depth + 1, open - 1);
    }
  }

  function addMoved(start, size, dest) {
    if (start.cmp(dest)) moved.push(new _map.MovedRange(start, size, dest));
  }

  function mendRight(node, at, path, open) {
    var toEnd = path.length == to.depth;
    var after = node.content[at],
        before = undefined;

    var sBefore = toEnd ? sizeBefore(node, at) : at + 1;
    var movedStart = toEnd ? to : to.shorten(path.length, 1);
    var movedSize = node.maxOffset - sBefore;

    if (!toEnd && open > 0 && (before = node.content[at - 1]).sameMarkup(after)) {
      after.content = before.content.concat(after.content);
      node.content.splice(at - 1, 1);
      addMoved(movedStart, movedSize, new _model.Pos(path, sBefore - 1));
      mendRight(after, before.content.length, path.concat(at - 1), open - 1);
    } else {
      if (node.type.block) (0, _model.stitchTextNodes)(node, at);
      addMoved(movedStart, movedSize, new _model.Pos(path, sBefore));
      if (!toEnd) mendRight(after, 0, path.concat(at), 0);
    }
  }

  return { doc: copy, moved: moved };
}

var nullRepl = { nodes: [], openLeft: 0, openRight: 0 };

(0, _step.defineStep)("replace", {
  apply: function apply(doc, step) {
    var rootPos = step.pos,
        root = rootPos.path;
    if (step.from.depth < root.length || step.to.depth < root.length) return null;
    for (var i = 0; i < root.length; i++) {
      if (step.from.path[i] != root[i] || step.to.path[i] != root[i]) return null;
    }var result = replace(doc, step.from, step.to, rootPos.path, step.param || nullRepl);
    if (!result) return null;
    var out = result.doc;
    var moved = result.moved;

    var end = moved.length ? moved[moved.length - 1].dest : step.to;
    var replaced = new _map.ReplacedRange(step.from, step.to, step.from, end, rootPos, rootPos);
    return new _transform.TransformResult(out, new _map.PosMap(moved, [replaced]));
  },
  invert: function invert(step, oldDoc, map) {
    var depth = step.pos.depth;
    var between = (0, _model.sliceBetween)(oldDoc, step.from, step.to, false);
    for (var i = 0; i < depth; i++) {
      between = between.content[0];
    }return new _step.Step("replace", step.from, map.map(step.to).pos, step.from.shorten(depth), {
      nodes: between.content,
      openLeft: step.from.depth - depth,
      openRight: step.to.depth - depth
    });
  },
  paramToJSON: function paramToJSON(param) {
    return param && { nodes: param.nodes && param.nodes.map(function (n) {
        return n.toJSON();
      }),
      openLeft: param.openLeft, openRight: param.openRight };
  },
  paramFromJSON: function paramFromJSON(json) {
    return json && { nodes: json.nodes && json.nodes.map(_model.Node.fromJSON),
      openLeft: json.openLeft, openRight: json.openRight };
  }
});

function buildInserted(nodesLeft, source, start, end) {
  var sliced = (0, _model.sliceBetween)(source, start, end, false);
  var nodesRight = [];
  for (var node = sliced, i = 0; i <= start.path.length; i++, node = node.content[0]) {
    nodesRight.push(node);
  }var same = (0, _tree.samePathDepth)(start, end);
  var searchLeft = nodesLeft.length - 1,
      searchRight = nodesRight.length - 1;
  var result = null;

  var inner = nodesRight[searchRight];
  if (inner.type.block && inner.size && nodesLeft[searchLeft].type.block) {
    result = nodesLeft[searchLeft--].copy(inner.content);
    nodesRight[--searchRight].content.shift();
  }

  for (;;) {
    var node = nodesRight[searchRight],
        type = node.type,
        matched = null;
    var outside = searchRight <= same;
    for (var i = searchLeft; i >= 0; i--) {
      var left = nodesLeft[i];
      if (outside ? left.type.contains == type.contains : left.type == type) {
        matched = i;
        break;
      }
    }
    if (matched != null) {
      if (!result) {
        result = nodesLeft[matched].copy(node.content);
        searchLeft = matched - 1;
      } else {
        while (searchLeft >= matched) result = nodesLeft[searchLeft--].copy([result]);
        result.pushFrom(node);
      }
    }
    if (matched != null || node.content.length == 0) {
      if (outside) break;
      if (searchRight) nodesRight[searchRight - 1].content.shift();
    }
    searchRight--;
  }

  var repl = { nodes: result ? result.content : [],
    openLeft: start.depth - searchRight,
    openRight: end.depth - searchRight };
  return { repl: repl, depth: searchLeft + 1 };
}

function moveText(tr, doc, before, after) {
  var root = (0, _tree.samePathDepth)(before, after);
  var cutAt = after.shorten(null, 1);
  while (cutAt.path.length > root && doc.path(cutAt.path).content.length == 1) cutAt = cutAt.shorten(null, 1);
  tr.split(cutAt, cutAt.path.length - root);
  var start = after,
      end = new _model.Pos(start.path, doc.path(start.path).maxOffset);
  var parent = doc.path(start.path.slice(0, root));
  var wanted = parent.pathNodes(before.path.slice(root));
  var existing = parent.pathNodes(start.path.slice(root));
  while (wanted.length && existing.length && wanted[0].sameMarkup(existing[0])) {
    wanted.shift();
    existing.shift();
  }
  if (existing.length || wanted.length) tr.step("ancestor", start, end, null, {
    depth: existing.length,
    wrappers: wanted.map(function (n) {
      return n.copy();
    })
  });
  for (var i = root; i < before.path.length; i++) {
    tr.join(before.shorten(i, 1));
  }
}

_transform.Transform.prototype["delete"] = function (from, to) {
  return this.replace(from, to);
};

_transform.Transform.prototype.replace = function (from, to, source, start, end) {
  var repl = undefined,
      depth = undefined,
      doc = this.doc,
      maxDepth = (0, _tree.samePathDepth)(from, to);
  if (source) {
    ;
    var _buildInserted = buildInserted(doc.pathNodes(from.path), source, start, end);

    repl = _buildInserted.repl;
    depth = _buildInserted.depth;

    while (depth > maxDepth) {
      if (repl.nodes.length) repl = { nodes: [doc.path(from.path.slice(0, depth)).copy(repl.nodes)],
        openLeft: repl.openLeft + 1, openRight: repl.openRight + 1 };
      depth--;
    }
  } else {
    repl = nullRepl;
    depth = maxDepth;
  }
  var root = from.shorten(depth),
      docAfter = doc,
      after = to;
  if (repl.nodes.length || (0, _tree.replaceHasEffect)(doc, from, to)) {
    var result = this.step("replace", from, to, root, repl);
    docAfter = result.doc;
    after = result.map.map(to).pos;
  }

  // If no text nodes before or after end of replacement, don't glue text
  if (!doc.path(to.path).type.block) return this;
  if (!(repl.nodes.length ? source.path(end.path).type.block : doc.path(from.path).type.block)) return this;

  var nodesAfter = doc.path(root.path).pathNodes(to.path.slice(depth)).slice(1);
  var nodesBefore = undefined;
  if (repl.nodes.length) {
    var inserted = repl.nodes;
    nodesBefore = [];
    for (var i = 0; i < repl.openRight; i++) {
      var last = inserted[inserted.length - 1];
      nodesBefore.push(last);
      inserted = last.content;
    }
  } else {
    nodesBefore = doc.path(root.path).pathNodes(from.path.slice(depth)).slice(1);
  }
  if (nodesAfter.length != nodesBefore.length || !nodesAfter.every(function (n, i) {
    return n.sameMarkup(nodesBefore[i]);
  })) {
    var before = _model.Pos.before(docAfter, after.shorten(null, 0));
    moveText(this, docAfter, before, after);
  }
  return this;
};

_transform.Transform.prototype.insert = function (pos, nodes) {
  if (!Array.isArray(nodes)) nodes = [nodes];
  this.step("replace", pos, pos, pos, { nodes: nodes, openLeft: 0, openRight: 0 });
  return this;
};

_transform.Transform.prototype.insertInline = function (pos, nodes) {
  if (!Array.isArray(nodes)) nodes = [nodes];
  var styles = (0, _model.spanStylesAt)(this.doc, pos);
  nodes = nodes.map(function (n) {
    return new _model.Span(n.type, n.attrs, styles, n.text);
  });
  return this.insert(pos, nodes);
};

_transform.Transform.prototype.insertText = function (pos, text) {
  return this.insertInline(pos, _model.Span.text(text));
};

},{"../model":37,"./map":46,"./step":49,"./transform":51,"./tree":52}],48:[function(require,module,exports){
"use strict";

var _model = require("../model");

var _transform = require("./transform");

var _step = require("./step");

var _tree = require("./tree");

var _map = require("./map");

(0, _step.defineStep)("split", {
  apply: function apply(doc, step) {
    var pos = step.pos;
    if (pos.depth == 0) return null;
    var copy = (0, _tree.copyTo)(doc, pos.path);
    var last = pos.depth - 1,
        parentPath = pos.path.slice(0, last);
    var offset = pos.path[last],
        parent = copy.path(parentPath);
    var target = parent.content[offset],
        targetSize = target.maxOffset;
    var splitAt = pos.offset;
    if (target.type.block) splitAt = (0, _model.splitSpansAt)(target, pos.offset).offset;
    var after = (step.param || target).copy(target.content.slice(splitAt));
    target.content.length = splitAt;
    parent.content.splice(offset + 1, 0, after);

    var dest = new _model.Pos(parentPath.concat(offset + 1), 0);
    var map = new _map.PosMap([new _map.MovedRange(pos, targetSize - pos.offset, dest), new _map.MovedRange(new _model.Pos(parentPath, offset + 1), parent.content.length - 2 - offset, new _model.Pos(parentPath, offset + 2))], [new _map.ReplacedRange(pos, pos, pos, dest, pos, pos.shorten(null, 1))]);
    return new _transform.TransformResult(copy, map);
  },
  invert: function invert(step, _oldDoc, map) {
    return new _step.Step("join", step.pos, map.map(step.pos).pos);
  },
  paramToJSON: function paramToJSON(param) {
    return param && param.toJSON();
  },
  paramFromJSON: function paramFromJSON(json) {
    return json && _model.Node.fromJSON(json);
  }
});

_transform.Transform.prototype.split = function (pos) {
  var depth = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
  var nodeAfter = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

  if (depth == 0) return this;
  for (var i = 0;; i++) {
    this.step("split", null, null, pos, nodeAfter);
    if (i == depth - 1) return this;
    nodeAfter = null;
    pos = pos.shorten(null, 1);
  }
};

},{"../model":37,"./map":46,"./step":49,"./transform":51,"./tree":52}],49:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.defineStep = defineStep;
exports.applyStep = applyStep;
exports.invertStep = invertStep;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _model = require("../model");

var Step = (function () {
  function Step(name, from, to, pos) {
    var param = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

    _classCallCheck(this, Step);

    if (!(name in steps)) throw new Error("Unknown step type: " + name);
    this.name = name;
    this.from = from;
    this.to = to;
    this.pos = pos;
    this.param = param;
  }

  _createClass(Step, [{
    key: "toJSON",
    value: function toJSON() {
      var impl = steps[this.name];
      return {
        name: this.name,
        from: this.from,
        to: this.to,
        pos: this.pos,
        param: impl.paramToJSON ? impl.paramToJSON(this.param) : this.param
      };
    }
  }], [{
    key: "fromJSON",
    value: function fromJSON(json) {
      var impl = steps[json.name];
      return new Step(json.name, json.from && _model.Pos.fromJSON(json.from), json.to && _model.Pos.fromJSON(json.to), json.pos && _model.Pos.fromJSON(json.pos), impl.paramFromJSON ? impl.paramFromJSON(json.param) : json.param);
    }
  }]);

  return Step;
})();

exports.Step = Step;

var steps = Object.create(null);

function defineStep(name, impl) {
  steps[name] = impl;
}

function applyStep(doc, step) {
  if (!(step.name in steps)) throw new Error("Undefined transform " + step.name);

  return steps[step.name].apply(doc, step);
}

function invertStep(step, oldDoc, map) {
  return steps[step.name].invert(step, oldDoc, map);
}

},{"../model":37}],50:[function(require,module,exports){
"use strict";

var _model = require("../model");

var _transform = require("./transform");

var _step = require("./step");

var _tree = require("./tree");

(0, _step.defineStep)("addStyle", {
  apply: function apply(doc, step) {
    return new _transform.TransformResult((0, _tree.copyStructure)(doc, step.from, step.to, function (node, from, to) {
      if (node.type.plainText) return node;
      return (0, _tree.copyInline)(node, from, to, function (node) {
        return new _model.Span(node.type, node.attrs, _model.style.add(node.styles, step.param), node.text);
      });
    }));
  },
  invert: function invert(step, _oldDoc, map) {
    return new _step.Step("removeStyle", step.from, map.map(step.to).pos, null, step.param);
  }
});

_transform.Transform.prototype.addStyle = function (from, to, st) {
  var _this = this;

  var removed = [],
      added = [],
      removing = null,
      adding = null;
  (0, _tree.forSpansBetween)(this.doc, from, to, function (span, path, start, end) {
    if (_model.style.contains(span.styles, st)) {
      adding = removing = null;
    } else {
      path = path.slice();
      var rm = _model.style.containsType(span.styles, st.type);
      if (rm) {
        if (removing && _model.style.same(removing.param, rm)) {
          removing.to = new _model.Pos(path, end);
        } else {
          removing = new _step.Step("removeStyle", new _model.Pos(path, start), new _model.Pos(path, end), null, rm);
          removed.push(removing);
        }
      } else if (removing) {
        removing = null;
      }
      if (adding) {
        adding.to = new _model.Pos(path, end);
      } else {
        adding = new _step.Step("addStyle", new _model.Pos(path, start), new _model.Pos(path, end), null, st);
        added.push(adding);
      }
    }
  });
  removed.forEach(function (s) {
    return _this.step(s);
  });
  added.forEach(function (s) {
    return _this.step(s);
  });
  return this;
};

(0, _step.defineStep)("removeStyle", {
  apply: function apply(doc, step) {
    return new _transform.TransformResult((0, _tree.copyStructure)(doc, step.from, step.to, function (node, from, to) {
      return (0, _tree.copyInline)(node, from, to, function (node) {
        var styles = _model.style.remove(node.styles, step.param);
        return new _model.Span(node.type, node.attrs, styles, node.text);
      });
    }));
  },
  invert: function invert(step, _oldDoc, map) {
    return new _step.Step("addStyle", step.from, map.map(step.to).pos, null, step.param);
  }
});

_transform.Transform.prototype.removeStyle = function (from, to) {
  var _this2 = this;

  var st = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

  var matched = [],
      step = 0;
  (0, _tree.forSpansBetween)(this.doc, from, to, function (span, path, start, end) {
    step++;
    var toRemove = null;
    if (typeof st == "string") {
      var found = _model.style.containsType(span.styles, st);
      if (found) toRemove = [found];
    } else if (st) {
      if (_model.style.contains(span.styles, st)) toRemove = [st];
    } else {
      toRemove = span.styles;
    }
    if (toRemove && toRemove.length) {
      path = path.slice();
      for (var i = 0; i < toRemove.length; i++) {
        var rm = toRemove[i],
            found = undefined;
        for (var j = 0; j < matched.length; j++) {
          var m = matched[j];
          if (m.step == step - 1 && _model.style.same(rm, matched[j].style)) found = m;
        }
        if (found) {
          found.to = new _model.Pos(path, end);
          found.step = step;
        } else {
          matched.push({ style: rm, from: new _model.Pos(path, start), to: new _model.Pos(path, end), step: step });
        }
      }
    }
  });
  matched.forEach(function (m) {
    return _this2.step("removeStyle", m.from, m.to, null, m.style);
  });
  return this;
};

_transform.Transform.prototype.clearMarkup = function (from, to) {
  var _this3 = this;

  var steps = [];
  (0, _tree.forSpansBetween)(this.doc, from, to, function (span, path, start, end) {
    if (span.type != _model.nodeTypes.text) {
      path = path.slice();
      var _from = new _model.Pos(path, start);
      steps.unshift(new _step.Step("replace", _from, new _model.Pos(path, end), _from));
    }
  });
  this.removeStyle(from.to);
  steps.forEach(function (s) {
    return _this3.step(s);
  });
  return this;
};

},{"../model":37,"./step":49,"./transform":51,"./tree":52}],51:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _step2 = require("./step");

var _map = require("./map");

var TransformResult = function TransformResult(doc) {
  var map = arguments.length <= 1 || arguments[1] === undefined ? _map.nullMap : arguments[1];

  _classCallCheck(this, TransformResult);

  this.doc = doc;
  this.map = map;
};

exports.TransformResult = TransformResult;

var Transform = (function () {
  function Transform(doc) {
    _classCallCheck(this, Transform);

    this.docs = [doc];
    this.steps = [];
    this.maps = [];
  }

  _createClass(Transform, [{
    key: "step",
    value: function step(_step, from, to, pos, param) {
      if (typeof _step == "string") _step = new _step2.Step(_step, from, to, pos, param);
      var result = (0, _step2.applyStep)(this.doc, _step);
      if (result) {
        this.steps.push(_step);
        this.maps.push(result.map);
        this.docs.push(result.doc);
      }
      return result;
    }
  }, {
    key: "map",
    value: function map(pos, bias) {
      var deleted = false;
      for (var i = 0; i < this.maps.length; i++) {
        var result = this.maps[i].map(pos, bias);
        pos = result.pos;
        if (result.deleted) deleted = true;
      }
      return new _map.MapResult(pos, deleted);
    }
  }, {
    key: "doc",
    get: function get() {
      return this.docs[this.docs.length - 1];
    }
  }, {
    key: "before",
    get: function get() {
      return this.docs[0];
    }
  }]);

  return Transform;
})();

exports.Transform = Transform;

},{"./map":46,"./step":49}],52:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copyStructure = copyStructure;
exports.copyInline = copyInline;
exports.forSpansBetween = forSpansBetween;
exports.copyTo = copyTo;
exports.isFlatRange = isFlatRange;
exports.selectedSiblings = selectedSiblings;
exports.blocksBetween = blocksBetween;
exports.isPlainText = isPlainText;
exports.replaceHasEffect = replaceHasEffect;
exports.samePathDepth = samePathDepth;

var _model = require("../model");

function copyStructure(node, from, to, f) {
  var depth = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];

  if (node.type.block) {
    return f(node, from, to);
  } else {
    var copy = node.copy();
    if (node.content.length == 0) return copy;
    var start = from ? from.path[depth] : 0;
    var end = to ? to.path[depth] : node.content.length - 1;
    copy.pushFrom(node, 0, start);
    if (start == end) {
      copy.push(copyStructure(node.content[start], from, to, f, depth + 1));
    } else {
      copy.push(copyStructure(node.content[start], from, null, f, depth + 1));
      for (var i = start + 1; i < end; i++) {
        copy.push(copyStructure(node.content[i], null, null, f, depth + 1));
      }copy.push(copyStructure(node.content[end], null, to, f, depth + 1));
    }
    copy.pushFrom(node, end + 1);
    return copy;
  }
}

function copyInline(node, from, to, f) {
  var start = from ? from.offset : 0;
  var end = to ? to.offset : node.size;
  var copy = node.copy(node.slice(0, start).concat(node.slice(start, end).map(f)).concat(node.slice(end)));
  for (var i = copy.content.length - 1; i > 0; i--) {
    (0, _model.stitchTextNodes)(copy, i);
  }return copy;
}

function forSpansBetween(doc, from, to, f) {
  var path = [];
  function scan(node, from, to) {
    if (node.type.block) {
      var startOffset = from ? from.offset : 0;
      var endOffset = to ? to.offset : node.size;
      for (var i = 0, offset = 0; offset < endOffset; i++) {
        var child = node.content[i],
            size = child.size;
        offset += size;
        if (offset > startOffset) f(child, path, Math.max(offset - child.size, startOffset), Math.min(offset, endOffset));
      }
    } else if (node.content.length) {
      var start = from ? from.path[path.length] : 0;
      var end = to ? to.path[path.length] + 1 : node.content.length;
      for (var i = start; i < end; i++) {
        path.push(i);
        scan(node.content[i], i == start && from, i == end - 1 && to);
        path.pop();
      }
    }
  }
  scan(doc, from, to);
}

function copyTo(node, path) {
  var depth = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

  if (depth == path.length) return node.copy(node.content.slice());

  var copy = node.copy();
  var n = path[depth];
  copy.pushFrom(node, 0, n);
  copy.push(copyTo(node.content[n], path, depth + 1));
  copy.pushFrom(node, n + 1);
  return copy;
}

function isFlatRange(from, to) {
  if (from.path.length != to.path.length) return false;
  for (var i = 0; i < from.path.length; i++) {
    if (from.path[i] != to.path[i]) return false;
  }return from.offset <= to.offset;
}

function selectedSiblings(doc, from, to) {
  for (var i = 0, node = doc;; i++) {
    if (node.type.block) return { path: from.path.slice(0, i - 1), from: from.path[i - 1], to: from.path[i - 1] + 1 };
    var fromEnd = i == from.path.length,
        toEnd = i == to.path.length;
    var left = fromEnd ? from.offset : from.path[i];
    var right = toEnd ? to.offset : to.path[i];
    if (fromEnd || toEnd || left != right) return { path: from.path.slice(0, i), from: left, to: right + (toEnd ? 0 : 1) };
    node = node.content[left];
  }
}

function blocksBetween(doc, from, to, f) {
  var path = [];
  function scan(node, from, to) {
    if (node.type.block) {
      f(node, path);
    } else {
      var fromMore = from && from.path.length > path.length;
      var toMore = to && to.path.length > path.length;
      var start = !from ? 0 : fromMore ? from.path[path.length] : from.offset;
      var end = !to ? node.content.length : toMore ? to.path[path.length] + 1 : to.offset;
      for (var i = start; i < end; i++) {
        path.push(i);
        scan(node.content[i], fromMore && i == start ? from : null, toMore && i == end - 1 ? to : null);
        path.pop();
      }
    }
  }
  scan(doc, from, to);
}

function isPlainText(node) {
  if (node.content.length == 0) return true;
  var child = node.content[0];
  return node.content.length == 1 && child.type == _model.nodeTypes.text && child.styles.length == 0;
}

function canBeJoined(node, offset, depth) {
  if (!depth || offset == 0 || offset == node.content.length) return false;
  var left = node.content[offset - 1],
      right = node.content[offset];
  return left.sameMarkup(right);
}

function replaceHasEffect(doc, from, to) {
  for (var depth = 0, node = doc;; depth++) {
    var fromEnd = depth == from.depth,
        toEnd = depth == to.depth;
    if (fromEnd || toEnd || from.path[depth] != to.path[depth]) {
      var gapStart = undefined,
          gapEnd = undefined;
      if (fromEnd) {
        gapStart = from.offset;
      } else {
        gapStart = from.path[depth] + 1;
        for (var i = depth + 1, n = node.content[gapStart - 1]; i <= from.path.length; i++) {
          if (i == from.path.length) {
            if (from.offset < n.maxOffset) return true;
          } else {
            if (from.path[i] + 1 < n.maxOffset) return true;
            n = n.content[from.path[i]];
          }
        }
      }
      if (toEnd) {
        gapEnd = to.offset;
      } else {
        gapEnd = to.path[depth];
        for (var i = depth + 1; i <= to.path.length; i++) {
          if ((i == to.path.length ? to.offset : to.path[i]) > 0) return true;
        }
      }
      if (gapStart != gapEnd) return true;
      return canBeJoined(node, gapStart, Math.min(from.depth, to.depth) - depth);
    } else {
      node = node.content[from.path[depth]];
    }
  }
}

function samePathDepth(a, b) {
  for (var i = 0;; i++) {
    if (i == a.path.length || i == b.path.length || a.path[i] != b.path[i]) return i;
  }
}

},{"../model":37}],53:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Debounced = (function () {
  function Debounced(pm, delay, f) {
    _classCallCheck(this, Debounced);

    this.pm = pm;
    this.delay = delay;
    this.scheduled = null;
    this.f = f;
    this.pending = null;
  }

  _createClass(Debounced, [{
    key: "trigger",
    value: function trigger() {
      var _this = this;

      window.clearTimeout(this.scheduled);
      this.scheduled = window.setTimeout(function () {
        return _this.fire();
      }, this.delay);
    }
  }, {
    key: "fire",
    value: function fire() {
      var _this2 = this;

      if (!this.pending) {
        if (this.pm.operation) this.pm.on("flush", this.pending = function () {
          _this2.pm.off("flush", _this2.pending);
          _this2.pending = null;
          _this2.f();
        });else this.f();
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      window.clearTimeout(this.scheduled);
    }
  }]);

  return Debounced;
})();

exports.Debounced = Debounced;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvcm9rL2Rldi9jbGllbnRzL3N5c2xhYi9wcm9zZW1pcnJvci9kZW1vL2RlbW8uanMiLCJub2RlX21vZHVsZXMvaW5zZXJ0LWNzcy9pbmRleC5qcyIsIi9ob21lL3Jvay9kZXYvY2xpZW50cy9zeXNsYWIvcHJvc2VtaXJyb3Ivc3JjL2NvbGxhYi9pbmRleC5qcyIsIi9ob21lL3Jvay9kZXYvY2xpZW50cy9zeXNsYWIvcHJvc2VtaXJyb3Ivc3JjL2NvbGxhYi9yZWJhc2UuanMiLCIvaG9tZS9yb2svZGV2L2NsaWVudHMvc3lzbGFiL3Byb3NlbWlycm9yL3NyYy9jb252ZXJ0L2NvbnZlcnQuanMiLCIvaG9tZS9yb2svZGV2L2NsaWVudHMvc3lzbGFiL3Byb3NlbWlycm9yL3NyYy9jb252ZXJ0L2Zyb21fZG9tLmpzIiwiL2hvbWUvcm9rL2Rldi9jbGllbnRzL3N5c2xhYi9wcm9zZW1pcnJvci9zcmMvY29udmVydC9mcm9tX3RleHQuanMiLCIvaG9tZS9yb2svZGV2L2NsaWVudHMvc3lzbGFiL3Byb3NlbWlycm9yL3NyYy9jb252ZXJ0L3RvX2RvbS5qcyIsIi9ob21lL3Jvay9kZXYvY2xpZW50cy9zeXNsYWIvcHJvc2VtaXJyb3Ivc3JjL2NvbnZlcnQvdG9fdGV4dC5qcyIsIi9ob21lL3Jvay9kZXYvY2xpZW50cy9zeXNsYWIvcHJvc2VtaXJyb3Ivc3JjL2RvbS9pbmRleC5qcyIsIi9ob21lL3Jvay9kZXYvY2xpZW50cy9zeXNsYWIvcHJvc2VtaXJyb3Ivc3JjL2VkaXQvY2hhci5qcyIsIi9ob21lL3Jvay9kZXYvY2xpZW50cy9zeXNsYWIvcHJvc2VtaXJyb3Ivc3JjL2VkaXQvY29tbWFuZHMuanMiLCIvaG9tZS9yb2svZGV2L2NsaWVudHMvc3lzbGFiL3Byb3NlbWlycm9yL3NyYy9lZGl0L2Nzcy5qcyIsIi9ob21lL3Jvay9kZXYvY2xpZW50cy9zeXNsYWIvcHJvc2VtaXJyb3Ivc3JjL2VkaXQvZGVmYXVsdGtleW1hcC5qcyIsIi9ob21lL3Jvay9kZXYvY2xpZW50cy9zeXNsYWIvcHJvc2VtaXJyb3Ivc3JjL2VkaXQvZG9tY2hhbmdlLmpzIiwiL2hvbWUvcm9rL2Rldi9jbGllbnRzL3N5c2xhYi9wcm9zZW1pcnJvci9zcmMvZWRpdC9kcmF3LmpzIiwiL2hvbWUvcm9rL2Rldi9jbGllbnRzL3N5c2xhYi9wcm9zZW1pcnJvci9zcmMvZWRpdC9ldmVudC5qcyIsIi9ob21lL3Jvay9kZXYvY2xpZW50cy9zeXNsYWIvcHJvc2VtaXJyb3Ivc3JjL2VkaXQvaGlzdG9yeS5qcyIsIi9ob21lL3Jvay9kZXYvY2xpZW50cy9zeXNsYWIvcHJvc2VtaXJyb3Ivc3JjL2VkaXQvaW5kZXguanMiLCIvaG9tZS9yb2svZGV2L2NsaWVudHMvc3lzbGFiL3Byb3NlbWlycm9yL3NyYy9lZGl0L2lucHV0LmpzIiwiL2hvbWUvcm9rL2Rldi9jbGllbnRzL3N5c2xhYi9wcm9zZW1pcnJvci9zcmMvZWRpdC9rZXlzLmpzIiwiL2hvbWUvcm9rL2Rldi9jbGllbnRzL3N5c2xhYi9wcm9zZW1pcnJvci9zcmMvZWRpdC9tYWluLmpzIiwiL2hvbWUvcm9rL2Rldi9jbGllbnRzL3N5c2xhYi9wcm9zZW1pcnJvci9zcmMvZWRpdC9tYXAuanMiLCIvaG9tZS9yb2svZGV2L2NsaWVudHMvc3lzbGFiL3Byb3NlbWlycm9yL3NyYy9lZGl0L29wdGlvbnMuanMiLCIvaG9tZS9yb2svZGV2L2NsaWVudHMvc3lzbGFiL3Byb3NlbWlycm9yL3NyYy9lZGl0L3JhbmdlLmpzIiwiL2hvbWUvcm9rL2Rldi9jbGllbnRzL3N5c2xhYi9wcm9zZW1pcnJvci9zcmMvZWRpdC9zZWxlY3Rpb24uanMiLCIvaG9tZS9yb2svZGV2L2NsaWVudHMvc3lzbGFiL3Byb3NlbWlycm9yL3NyYy9pbnB1dHJ1bGVzL2F1dG9pbnB1dC5qcyIsIi9ob21lL3Jvay9kZXYvY2xpZW50cy9zeXNsYWIvcHJvc2VtaXJyb3Ivc3JjL2lucHV0cnVsZXMvaW5wdXRydWxlcy5qcyIsIi9ob21lL3Jvay9kZXYvY2xpZW50cy9zeXNsYWIvcHJvc2VtaXJyb3Ivc3JjL21lbnUvYnV0dG9ubWVudS5qcyIsIi9ob21lL3Jvay9kZXYvY2xpZW50cy9zeXNsYWIvcHJvc2VtaXJyb3Ivc3JjL21lbnUvaWNvbnMuanMiLCIvaG9tZS9yb2svZGV2L2NsaWVudHMvc3lzbGFiL3Byb3NlbWlycm9yL3NyYy9tZW51L2lubGluZW1lbnUuanMiLCIvaG9tZS9yb2svZGV2L2NsaWVudHMvc3lzbGFiL3Byb3NlbWlycm9yL3NyYy9tZW51L2l0ZW1zLmpzIiwiL2hvbWUvcm9rL2Rldi9jbGllbnRzL3N5c2xhYi9wcm9zZW1pcnJvci9zcmMvbWVudS9tZW51LmpzIiwiL2hvbWUvcm9rL2Rldi9jbGllbnRzL3N5c2xhYi9wcm9zZW1pcnJvci9zcmMvbWVudS9tZW51YmFyLmpzIiwiL2hvbWUvcm9rL2Rldi9jbGllbnRzL3N5c2xhYi9wcm9zZW1pcnJvci9zcmMvbWVudS90b29sdGlwLmpzIiwiL2hvbWUvcm9rL2Rldi9jbGllbnRzL3N5c2xhYi9wcm9zZW1pcnJvci9zcmMvbW9kZWwvZGlmZi5qcyIsIi9ob21lL3Jvay9kZXYvY2xpZW50cy9zeXNsYWIvcHJvc2VtaXJyb3Ivc3JjL21vZGVsL2luZGV4LmpzIiwiL2hvbWUvcm9rL2Rldi9jbGllbnRzL3N5c2xhYi9wcm9zZW1pcnJvci9zcmMvbW9kZWwvaW5saW5lLmpzIiwiL2hvbWUvcm9rL2Rldi9jbGllbnRzL3N5c2xhYi9wcm9zZW1pcnJvci9zcmMvbW9kZWwvbm9kZS5qcyIsIi9ob21lL3Jvay9kZXYvY2xpZW50cy9zeXNsYWIvcHJvc2VtaXJyb3Ivc3JjL21vZGVsL3Bvcy5qcyIsIi9ob21lL3Jvay9kZXYvY2xpZW50cy9zeXNsYWIvcHJvc2VtaXJyb3Ivc3JjL21vZGVsL3NsaWNlLmpzIiwiL2hvbWUvcm9rL2Rldi9jbGllbnRzL3N5c2xhYi9wcm9zZW1pcnJvci9zcmMvbW9kZWwvc3R5bGUuanMiLCIvaG9tZS9yb2svZGV2L2NsaWVudHMvc3lzbGFiL3Byb3NlbWlycm9yL3NyYy90cmFuc2Zvcm0vYW5jZXN0b3IuanMiLCIvaG9tZS9yb2svZGV2L2NsaWVudHMvc3lzbGFiL3Byb3NlbWlycm9yL3NyYy90cmFuc2Zvcm0vaW5kZXguanMiLCIvaG9tZS9yb2svZGV2L2NsaWVudHMvc3lzbGFiL3Byb3NlbWlycm9yL3NyYy90cmFuc2Zvcm0vam9pbi5qcyIsIi9ob21lL3Jvay9kZXYvY2xpZW50cy9zeXNsYWIvcHJvc2VtaXJyb3Ivc3JjL3RyYW5zZm9ybS9tYXAuanMiLCIvaG9tZS9yb2svZGV2L2NsaWVudHMvc3lzbGFiL3Byb3NlbWlycm9yL3NyYy90cmFuc2Zvcm0vcmVwbGFjZS5qcyIsIi9ob21lL3Jvay9kZXYvY2xpZW50cy9zeXNsYWIvcHJvc2VtaXJyb3Ivc3JjL3RyYW5zZm9ybS9zcGxpdC5qcyIsIi9ob21lL3Jvay9kZXYvY2xpZW50cy9zeXNsYWIvcHJvc2VtaXJyb3Ivc3JjL3RyYW5zZm9ybS9zdGVwLmpzIiwiL2hvbWUvcm9rL2Rldi9jbGllbnRzL3N5c2xhYi9wcm9zZW1pcnJvci9zcmMvdHJhbnNmb3JtL3N0eWxlLmpzIiwiL2hvbWUvcm9rL2Rldi9jbGllbnRzL3N5c2xhYi9wcm9zZW1pcnJvci9zcmMvdHJhbnNmb3JtL3RyYW5zZm9ybS5qcyIsIi9ob21lL3Jvay9kZXYvY2xpZW50cy9zeXNsYWIvcHJvc2VtaXJyb3Ivc3JjL3RyYW5zZm9ybS90cmVlLmpzIiwiL2hvbWUvcm9rL2Rldi9jbGllbnRzL3N5c2xhYi9wcm9zZW1pcnJvci9zcmMvdXRpbC9kZWJvdW5jZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7OzsyQkNBdUIsa0JBQWtCOzsyQkFDZixrQkFBa0I7O3NCQUMxQixZQUFZOztrQ0FDUix5QkFBeUI7OzRCQUNZLG1CQUFtQjs7d0JBQ3pDLGNBQWM7O1FBRTVDLDZCQUE2Qjs7UUFDN0Isd0JB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TyxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFBO0FBQzFDLFFBQUksU0FBUyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDakYsVUFBSSxXQUFXLEdBQUcsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ3RFLFVBQUksU0FBUyxJQUFJLFdBQVcsR0FBRyxDQUFDLEVBQUUsV0FBVyxFQUFFLENBQUE7QUFDL0MsVUFBSSxTQUFTLEdBQUcsS0FBSyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUNsRSxVQUFJLEtBQUssSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFBO0FBQzdELFVBQUksTUFBTSxHQUFHLDhCQUFRLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFBLEFBQUMsRUFBQyxDQUFDLENBQUE7QUFDbkksWUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMs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LEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsUUFBUTtBQUN4RixJQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLFFBQVE7QUFDbEcsS0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUk7QUFDbkcsS0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQVE7QUFDOUYsT0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsUUFBUTtDQUNqRixDQUFBOzs7O0FBR0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFBRSxPQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO0NBQUE7QUFFdEUsS0FBSyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFBRSxPQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQTtDQUFBO0FBRWhFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0FBQUUsT0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUE7Q0FBQTtBQUVsRSxTQUFTLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO0FBQ3RDLE1BQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO01BQUUsSUFBSSxHQUFHLElBQUksQ0FBQTtBQUM1QyxNQUFJLElBQUksSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxPQUFPLEtBQUssQ0FBQTs7QUFFbkQsTUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLElBQUksSUFBSSxLQUFLLEVBQUUsSUFBSSxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUE7QUFDdkQsTUFBSSxLQUFLLENBQUMsT0FBTyxJQUFJLElBQUksSUFBSSxNQUFNLEVBQUUsSUFBSSxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUE7QUFDMUQsTUFBSSxLQUFLLENBQUMsT0FBTyxJQUFJLElBQUksSUFBSSxLQUFLLEVBQUUsSUFBSSxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUE7QUFDeEQsTUFBSSxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUMsUUFBUSxJQUFJLElBQUksSUFBSSxPQUFPLEVBQUUsSUFBSSxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUE7QUFDekUsU0FBTyxJQUFJLENBQUE7Q0FDWjs7QUFFTSxTQUFTLGFBQWEsQ0FBQyxLQUFLLEVBQUU7QUFDbkMsTUFB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RyxJQUFJLENBQUMsQ0FBQyxHQUFJLEtBQUssR0FBRyxDQUFDLElBQUksT0FBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksR0FDbkQsS0FBSyxHQUFHLE9BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxPQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEFBQUMsRUFDN0YsU0FBUyxHQUFHLENBQUMsQ0FBQTtBQUNmLFdBQU0sR0FBRyxPQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO0dBQy9CO0FBQ0QsTUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO0NBQ3JFOztBQUVELHFCQUFVLFNBQVMsQ0FBQyxJQUFJLEdBQUcsVUFBUyxFQUFFLEVBQUU7QUFDdEMsTUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ25DLE1BQUksRUFBRSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLElBQUksQ0FBQTtBQUMxRixNQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxlQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUN2RixlQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFB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LEVBQUUsRUFBRSxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7S0FDdEUsTUFBTTtBQUNMLFVBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDdkUsV0FBSyxJQUFJLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFO0FBQ2xDLFlBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7T0FBQSxBQUNyRSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQ3BFO0FBQ0QsUUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFBO0FBQzVCLFdBQU8sSUFBSSxDQUFBO0dBQ1o7Q0FDRjs7QUFFTSxTQUFTLFVBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDNUMsTUFBSSxLQUFLLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBO0FBQ2xDLE1BQUksR0FBRyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUE7QUFDcEMsTUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFL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LEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUE7QUFDNUYsUUFBSSxPQUFPLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTTtRQUFFLEtBQUssR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUE7QUFDaEUsUUFBSSxJQUFJLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUMvQyxRQUFJLEtBQUssR0FBRyxLQUFLLEdBQUcsRUFBRSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzFDLFFBQUksT0FBTyxJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxFQUNuQyxPQUFPLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxFQUFDLENBQUE7QUFDL0UsUUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDMUI7Q0FDRjs7QUFFTSxTQUFTLGFBQWEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDOUMsTUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ2IsV0FBUyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7QUFDNUIsUUFBSSxJQUFJLENBQUMsSUFBSSxDQUFD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QUE7R0FDcEI7O2VBUFUsU0FBUzs7V0FTYixtQkFBRzs7O0FBQ1IsWUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDbkMsVUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO2VBQU0sTUFBSyxJQUFJLEVBQUU7T0FBQSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtLQUNsRTs7O1dBRUcsZ0JBQUc7OztBQUNMLFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2pCLFlBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQ25CLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxHQUFHLFlBQU07QUFDdkMsaUJBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBSyxPQUFPLENBQUMsQ0FBQTtBQUNsQyxpQkFBSyxPQUFPLEdBQUcsSUFBSSxDQUFBO0FBQ25CLGlCQUFLLENBQUMsRUFBRSxDQUFBO1NBQ1QsQ0FBQyxDQUFBLEtBRUYsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFBO09BQ1g7S0FDRjs7O1dBRUksaUJBQUc7QUFDTixZQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtLQUNwQzs7O1NBN0JVLFNBQVMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtNZW51SXRlbX0gZnJvbSBcIi4uL3NyYy9tZW51L21lbnVcIlxuaW1wb3J0IHtQcm9zZU1pcnJvcn0gZnJvbSBcIi4uL3NyYy9lZGl0L21haW5cIlxuaW1wb3J0IHtlbHR9IGZyb20gXCIuLi9zcmMvZG9tXCJcbmltcG9ydCB7ZnJvbURPTX0gZnJvbSBcIi4uL3NyYy9jb252ZXJ0L2Zyb21fZG9tXCJcbmltcG9ydCB7Z2V0SXRlbXMsIHNlcGFyYXRvckl0ZW0sIEltYWdlSXRlbSwgSWNvbkl0ZW19IGZyb20gXCIuLi9zcmMvbWVudS9pdGVtc1wiXG5pbXBvcnQge3N0eWxlLCBQb3MsIE5vZGUsIFNwYW59IGZyb20gXCIuLi9zcmMvbW9kZWxcIlxuXG5pbXBvcnQgXCIuLi9zcmMvaW5wdXRydWxlcy9hdXRvaW5wdXRcIlxuaW1wb3J0IFwiLi4vc3JjL21lbnUvaW5saW5lbWVudVwiXG5pbXBvcnQgXCIuLi9zcmMvbWVudS9tZW51YmFyXCJcbmltcG9ydCBcIi4uL3NyYy9tZW51L2J1dHRvbm1lbnVcIlxuaW1wb3J0IFwiLi4vc3JjL2NvbGxhYlwiXG5cbmxldCB0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGVudFwiKVxudGUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiXG5cbmxldCBkdW1teSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbmR1bW15LmlubmVySFRNTCA9IHRlLnZhbHVlXG5sZXQgZG9jID0gZnJvbURPTShkdW1teSlcblxuY2xhc3MgRHVtbXlTZXJ2ZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZlcnNpb24gPSAwXG4gICAgdGhpcy5wbXMgPSBbXVxuICB9XG5cbiAgYXR0YWNoKHBtKSB7XG4gICAgcG0ubW9kLmNvbGxhYi5vbihcIm11c3RTZW5kXCIsICgpID0+IHRoaXMubXVzdFNlbmQocG0pKVxuICAgIHRoaXMucG1zLnB1c2gocG0pXG4gIH1cblxuICBtdXN0U2VuZChwbSkge1xuICAgIGxldCB0b1NlbmQgPSBwbS5tb2QuY29sbGFiLnNlbmRhYmxlU3RlcHMoKVxuICAgIHRoaXMuc2VuZChwbSwgdG9TZW5kLnZlcnNpb24sIHRvU2VuZC5zdGVwcylcbiAgICBwbS5tb2QuY29sbGFiLmNvbmZpcm1TdGVwcyh0b1NlbmQpXG4gIH1cblxuICBzZW5kKHBtLCB2ZXJzaW9uLCBzdGVwcykge1xuICAgIHRoaXMudmVyc2lvbiArPSBzdGVwcy5sZW5ndGhcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucG1zLmxlbmd0aDsgaSsrKVxuICAgICAgaWYgKHRoaXMucG1zW2ldICE9IHBtKSB0aGlzLnBtc1tpXS5tb2QuY29sbGFiLnJlY2VpdmUoc3RlcHMpXG4gIH1cbn1cblxuXG5jbGFzcyBDdXN0b21JbWFnZUl0ZW0gZXh0ZW5kcyBJY29uSXRlbSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFwiaW1hZ2VcIiwgXCJJbnNlcnQgaW1hZ2VcIilcbiAgfVxuICBhcHBseShwbSkge1xuXG4gICAgbGV0IG1vZGFsID0gJChcbiAgICAgICc8ZGl2IGNsYXNzPVwicGF0LW1vZGFsXCI+JyArXG4gICAgICAnICA8aDM+VXBsb2FkIEltYWdlPGgzPicgK1xuICAgICAgJyAgPGRpdiBjbGFzcz1cInBhdC11cGxvYWRcIiBkYXRhLXBhdC11cGxvYWQ9XCJ1cmw6IGh0dHBzOi8vZXhhbXBsZS5vcmcvdXBsb2FkOyBsYWJlbDogRHJvcCBmaWxlcyBoZXJlIHRvIHVwbG9hZCBvciBjbGljayB0byBicm93c2UuOyB0cmlnZ2VyOiBidXR0b25cIiAvPicgK1xuICAgICAgJyAgPGJ1dHRvbj5JbnNlcnQgYW5pbWFsPC9idXR0b24+JyArXG4gICAgICAnPC9kaXY+J1xuICAgICkuYXBwZW5kVG8oJ2JvZHknKTtcblxuICAgICQoJ2J1dHRvbicsIG1vZGFsKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGltYWdlX3NyYyA9ICdodHRwOi8vbG9yZW1waXhlbC5jb20vZy8yMDAvMjAwL2FuaW1hbHMvJ1xuICAgICAgICBsZXQgc2VsID0gcG0uc2VsZWN0aW9uLCB0ciA9IHBtLnRyXG4gICAgICAgIHRyLmRlbGV0ZShzZWwuZnJvbSwgc2VsLnRvKVxuICAgICAgICBsZXQgYXR0cnMgPSB7c3JjOiBpbWFnZV9zcmMsIGFsdDogJ0tpdHR5JywgdGl0bGU6ICdXb29XISd9XG4gICAgICAgIHBtLmFwcGx5KHRyLmluc2VydElubGluZShzZWwuZnJvbSwgbmV3IFNwYW4oXCJpbWFnZVwiLCBhdHRycywgbnVsbCwgbnVsbCkpKVxuICAgICAgICAkKHRoaXMpLnBhcmVudHMoJy5wYXQtbW9kYWwnKS5kYXRhKCdwYXR0ZXJuLW1vZGFsJykuZGVzdHJveSgpXG4gICAgfSlcblxuICAgIHdpbmRvdy5wYXR0ZXJucy5zY2FuKG1vZGFsKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYWtlRWRpdG9yKHdoZXJlLCBjb2xsYWIpIHtcbiAgcmV0dXJuIG5ldyBQcm9zZU1pcnJvcih7XG4gICAgcGxhY2U6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Iod2hlcmUpLFxuICAgIGF1dG9JbnB1dDogdHJ1ZSxcbiAgICBtZW51QmFyOiB7XG4gICAgICBmbG9hdDogdHJ1ZSwgXG4gICAgICBpdGVtczogW1xuICAgICAgICAuLi5nZXRJdGVtcyhcImlubGluZVwiKS5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgIGlmICghKGl0ZW0gaW5zdGFuY2VvZiBJbWFnZUl0ZW0pKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pLCBzZXBhcmF0b3JJdGVtLFxuICAgICAgICAobmV3IEN1c3RvbUltYWdlSXRlbSksIHNlcGFyYXRvckl0ZW0sIFxuICAgICAgICAuLi5nZXRJdGVtcyhcImJsb2NrXCIpLCAuLi5nZXRJdGVtcyhcImhpc3RvcnlcIilcbiAgICAgIF1cbiAgICB9LFxuICAgIGlubGluZU1lbnU6IGZhbHNlLFxuICAgIGJ1dHRvbk1lbnU6IGZhbHNlLFxuICAgIGRvYzogZG9jLFxuICAgIGNvbGxhYjogY29sbGFiXG4gIH0pXG59XG5cbndpbmRvdy5wbSA9IHdpbmRvdy5wbTIgPSBudWxsXG5mdW5jdGlvbiBjcmVhdGVDb2xsYWIoKSB7XG4gIGxldCBzZXJ2ZXIgPSBuZXcgRHVtbXlTZXJ2ZXJcbiAgcG0gPSBtYWtlRWRpdG9yKFwiLmxlZnRcIiwge3ZlcnNpb246IHNlcnZlci52ZXJzaW9ufSlcbiAgc2VydmVyLmF0dGFjaChwbSlcbiAgcG0yID0gbWFrZUVkaXRvcihcIi5yaWdodFwiLCB7dmVyc2lvbjogc2VydmVyLnZlcnNpb259KVxuICBzZXJ2ZXIuYXR0YWNoKHBtMilcbn1cblxubGV0IGNvbGxhYiA9IGRvY3VtZW50LmxvY2F0aW9uLmhhc2ggIT0gXCIjc2luZ2xlXCJcbmxldCBidXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3N3aXRjaFwiKVxuZnVuY3Rpb24gY2hvb3NlKGNvbGxhYikge1xuICBpZiAocG0pIHsgcG0ud3JhcHBlci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHBtLndyYXBwZXIpOyBwbSA9IG51bGwgfVxuICBpZiAocG0yKSB7IHBtMi53cmFwcGVyLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocG0yLndyYXBwZXIpOyBwbTIgPSBudWxsIH1cblxuICBpZiAoY29sbGFiKSB7XG4gICAgY3JlYXRlQ29sbGFiKClcbiAgICBidXR0b24udGV4dENvbnRlbnQgPSBcInRyeSBzaW5nbGUgZWRpdG9yXCJcbiAgICBkb2N1bWVudC5sb2NhdGlvbi5oYXNoID0gXCIjY29sbGFiXCJcbiAgfSBlbHNlIHsgICAgXG4gICAgcG0gPSBtYWtlRWRpdG9yKFwiLmZ1bGxcIiwgZmFsc2UpXG4gICAgYnV0dG9uLnRleHRDb250ZW50ID0gXCJ0cnkgY29sbGFib3JhdGl2ZSBlZGl0b3JcIlxuICAgIGRvY3VtZW50LmxvY2F0aW9uLmhhc2ggPSBcIiNzaW5nbGVcIlxuICB9XG59XG5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IGNob29zZShjb2xsYWIgPSAhY29sbGFiKSlcblxuY2hvb3NlKGNvbGxhYilcblxuYWRkRXZlbnRMaXN0ZW5lcihcImhhc2hjaGFuZ2VcIiwgKCkgPT4ge1xuICBsZXQgbmV3VmFsID0gZG9jdW1lbnQubG9jYXRpb24uaGFzaCAhPSBcIiNzaW5nbGVcIlxuICBpZiAobmV3VmFsICE9IGNvbGxhYikgY2hvb3NlKGNvbGxhYiA9IG5ld1ZhbClcbn0pXG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFya1wiKS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGUgPT4ge1xuICBwbS5tYXJrUmFuZ2UocG0uc2VsZWN0aW9uLmZyb20sIHBtLnNlbGVjdGlvbi50bywge2NsYXNzTmFtZTogXCJtYXJrZWRcIn0pXG4gIGUucHJldmVudERlZmF1bHQoKVxufSlcbiIsInZhciBpbnNlcnRlZCA9IHt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3MsIG9wdGlvbnMpIHtcbiAgICBpZiAoaW5zZXJ0ZWRbY3NzXSkgcmV0dXJuO1xuICAgIGluc2VydGVkW2Nzc10gPSB0cnVlO1xuICAgIFxuICAgIHZhciBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICBlbGVtLnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2NzcycpO1xuXG4gICAgaWYgKCd0ZXh0Q29udGVudCcgaW4gZWxlbSkge1xuICAgICAgZWxlbS50ZXh0Q29udGVudCA9IGNzcztcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gICAgfVxuICAgIFxuICAgIHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnByZXBlbmQpIHtcbiAgICAgICAgaGVhZC5pbnNlcnRCZWZvcmUoZWxlbSwgaGVhZC5jaGlsZE5vZGVzWzBdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBoZWFkLmFwcGVuZENoaWxkKGVsZW0pO1xuICAgIH1cbn07XG4iLCJpbXBvcnQge2RlZmluZU9wdGlvbiwgZXZlbnRNaXhpbn0gZnJvbSBcIi4uL2VkaXRcIlxuaW1wb3J0IHthcHBseVN0ZXB9IGZyb20gXCIuLi90cmFuc2Zvcm1cIlxuXG5pbXBvcnQge3JlYmFzZVN0ZXBzfSBmcm9tIFwiLi9yZWJhc2VcIlxuZXhwb3J0IHtyZWJhc2VTdGVwc31cblxuZGVmaW5lT3B0aW9uKFwiY29sbGFiXCIsIGZhbHNlLCAocG0sIHZhbHVlKSA9PiB7XG4gIGlmIChwbS5tb2QuY29sbGFiKSB7XG4gICAgcG0ubW9kLmNvbGxhYi5kZXRhY2goKVxuICAgIHBtLm1vZC5jb2xsYWIgPSBudWxsXG4gIH1cblxuICBpZiAodmFsdWUpIHtcbiAgICBwbS5tb2QuY29sbGFiID0gbmV3IENvbGxhYihwbSwgdmFsdWUpXG4gIH1cbn0pXG5cbmNsYXNzIENvbGxhYiB7XG4gIGNvbnN0cnVjdG9yKHBtLCBvcHRpb25zKSB7XG4gICAgdGhpcy5wbSA9IHBtXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuXG4gICAgdGhpcy52ZXJzaW9uID0gb3B0aW9ucy52ZXJzaW9uIHx8IDBcbiAgICB0aGlzLnZlcnNpb25Eb2MgPSBwbS5kb2NcblxuICAgIHRoaXMudW5jb25maXJtZWRTdGVwcyA9IFtdXG4gICAgdGhpcy51bmNvbmZpcm1lZE1hcHMgPSBbXVxuXG4gICAgcG0ub24oXCJ0cmFuc2Zvcm1cIiwgdGhpcy5vblRyYW5zZm9ybSA9IHRyYW5zZm9ybSA9PiB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyYW5zZm9ybS5zdGVwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzLnVuY29uZmlybWVkU3RlcHMucHVzaCh0cmFuc2Zvcm0uc3RlcHNbaV0pXG4gICAgICAgIHRoaXMudW5jb25maXJtZWRNYXBzLnB1c2godHJhbnNmb3JtLm1hcHNbaV0pXG4gICAgICB9XG4gICAgICB0aGlzLnNpZ25hbChcIm11c3RTZW5kXCIpXG4gICAgfSlcbiAgICBwbS5vbihcImJlZm9yZVNldERvY1wiLCB0aGlzLm9uU2V0RG9jID0gKCkgPT4ge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwic2V0RG9jIGlzIG5vdCBzdXBwb3J0ZWQgb24gYSBjb2xsYWJvcmF0aXZlIGVkaXRvclwiKVxuICAgIH0pXG4gICAgcG0uaGlzdG9yeS5hbGxvd0NvbGxhcHNpbmcgPSBmYWxzZVxuICB9XG5cbiAgZGV0YWNoKCkge1xuICAgIHRoaXMucG0ub2ZmKFwidHJhbnNmb3JtXCIsIHRoaXMub25UcmFuc2Zvcm0pXG4gICAgdGhpcy5wbS5vZmYoXCJiZWZvcmVTZXREb2NcIiwgdGhpcy5vblNldERvYylcbiAgICB0aGlzLnBtLmhpc3RvcnkuYWxsb3dDb2xsYXBzaW5nID0gdHJ1ZVxuICB9XG5cbiAgaGFzU2VuZGFibGVTdGVwcygpIHtcbiAgICByZXR1cm4gdGhpcy51bmNvbmZpcm1lZFN0ZXBzLmxlbmd0aCA+IDBcbiAgfVxuXG4gIHNlbmRhYmxlU3RlcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZlcnNpb246IHRoaXMudmVyc2lvbixcbiAgICAgIGRvYzogdGhpcy5wbS5kb2MsXG4gICAgICBzdGVwczogdGhpcy51bmNvbmZpcm1lZFN0ZXBzLnNsaWNlKClcbiAgICB9XG4gIH1cblxuICBjb25maXJtU3RlcHMoc2VuZGFibGUpIHtcbiAgICB0aGlzLnVuY29uZmlybWVkU3RlcHMuc3BsaWNlKDAsIHNlbmRhYmxlLnN0ZXBzLmxlbmd0aClcbiAgICB0aGlzLnVuY29uZmlybWVkTWFwcy5zcGxpY2UoMCwgc2VuZGFibGUuc3RlcHMubGVuZ3RoKVxuICAgIHRoaXMudmVyc2lvbiArPSBzZW5kYWJsZS5zdGVwcy5sZW5ndGhcbiAgICB0aGlzLnZlcnNpb25Eb2MgPSBzZW5kYWJsZS5kb2NcbiAgfVxuXG4gIHJlY2VpdmUoc3RlcHMpIHtcbiAgICBsZXQgZG9jID0gdGhpcy52ZXJzaW9uRG9jXG4gICAgbGV0IG1hcHMgPSBzdGVwcy5tYXAoc3RlcCA9PiB7XG4gICAgICBsZXQgcmVzdWx0ID0gYXBwbHlTdGVwKGRvYywgc3RlcClcbiAgICAgIGRvYyA9IHJlc3VsdC5kb2NcbiAgICAgIHJldHVybiByZXN1bHQubWFwXG4gICAgfSlcbiAgICB0aGlzLnZlcnNpb24gKz0gc3RlcHMubGVuZ3RoXG4gICAgdGhpcy52ZXJzaW9uRG9jID0gZG9jXG5cbiAgICBsZXQgcmViYXNlZCA9IHJlYmFzZVN0ZXBzKGRvYywgbWFwcywgdGhpcy51bmNvbmZpcm1lZFN0ZXBzLCB0aGlzLnVuY29uZmlybWVkTWFwcylcbiAgICB0aGlzLnVuY29uZmlybWVkU3RlcHMgPSByZWJhc2VkLnRyYW5zZm9ybS5zdGVwcy5zbGljZSgpXG4gICAgdGhpcy51bmNvbmZpcm1lZE1hcHMgPSByZWJhc2VkLnRyYW5zZm9ybS5tYXBzLnNsaWNlKClcblxuICAgIHRoaXMucG0udXBkYXRlRG9jKHJlYmFzZWQuZG9jLCByZWJhc2VkLm1hcHBpbmcpXG4gICAgdGhpcy5wbS5oaXN0b3J5LnJlYmFzZWQobWFwcywgcmViYXNlZC50cmFuc2Zvcm0sIHJlYmFzZWQucG9zaXRpb25zKVxuICAgIHJldHVybiBtYXBzXG4gIH1cbn1cblxuZXZlbnRNaXhpbihDb2xsYWIpXG4iLCJpbXBvcnQge21hcFN0ZXAsIFJlbWFwcGluZywgVHJhbnNmb3JtfSBmcm9tIFwiLi4vdHJhbnNmb3JtXCJcblxuZXhwb3J0IGZ1bmN0aW9uIHJlYmFzZVN0ZXBzKGRvYywgZm9yd2FyZCwgc3RlcHMsIG1hcHMpIHtcbiAgbGV0IHJlbWFwID0gbmV3IFJlbWFwcGluZyhbXSwgZm9yd2FyZC5zbGljZSgpKVxuICBsZXQgdHJhbnNmb3JtID0gbmV3IFRyYW5zZm9ybShkb2MpXG4gIGxldCBwb3NpdGlvbnMgPSBbXVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3RlcHMubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgc3RlcCA9IG1hcFN0ZXAoc3RlcHNbaV0sIHJlbWFwKVxuICAgIGxldCByZXN1bHQgPSBzdGVwICYmIHRyYW5zZm9ybS5zdGVwKHN0ZXApXG4gICAgbGV0IGlkID0gcmVtYXAuYWRkVG9Gcm9udChtYXBzW2ldLmludmVydCgpKVxuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgIHJlbWFwLmFkZFRvQmFjayhyZXN1bHQubWFwLCBpZClcbiAgICAgIHBvc2l0aW9ucy5wdXNoKHRyYW5zZm9ybS5zdGVwcy5sZW5ndGggLSAxKVxuICAgIH0gZWxzZSB7XG4gICAgICBwb3NpdGlvbnMucHVzaCgtMSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtkb2M6IHRyYW5zZm9ybS5kb2MsIHRyYW5zZm9ybSwgbWFwcGluZzogcmVtYXAsIHBvc2l0aW9uc31cbn1cbiIsImltcG9ydCB7Tm9kZX0gZnJvbSBcIi4uL21vZGVsXCJcblxuY29uc3QgZnJvbSA9IE9iamVjdC5jcmVhdGUobnVsbClcbmNvbnN0IHRvID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXG5leHBvcnQgZnVuY3Rpb24gY29udmVydEZyb20odmFsdWUsIGZvcm1hdCwgYXJnKSB7XG4gIGxldCBjb252ZXJ0ZXIgPSBmcm9tW2Zvcm1hdF1cbiAgaWYgKCFjb252ZXJ0ZXIpIHRocm93IG5ldyBFcnJvcihcIlNvdXJjZSBmb3JtYXQgXCIgKyBmb3JtYXQgKyBcIiBub3QgZGVmaW5lZFwiKVxuICByZXR1cm4gY29udmVydGVyKHZhbHVlLCBhcmcpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0VG8oZG9jLCBmb3JtYXQsIGFyZykge1xuICBsZXQgY29udmVydGVyID0gdG9bZm9ybWF0XVxuICBpZiAoIWNvbnZlcnRlcikgdGhyb3cgbmV3IEVycm9yKFwiVGFyZ2V0IGZvcm1hdCBcIiArIGZvcm1hdCArIFwiIG5vdCBkZWZpbmVkXCIpXG4gIHJldHVybiBjb252ZXJ0ZXIoZG9jLCBhcmcpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBrbm93blNvdXJjZShmb3JtYXQpIHsgcmV0dXJuICEhZnJvbVtmb3JtYXRdIH1cbmV4cG9ydCBmdW5jdGlvbiBrbm93blRhcmdldChmb3JtYXQpIHsgcmV0dXJuICEhdG9bZm9ybWF0XSB9XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZpbmVTb3VyY2UoZm9ybWF0LCBmdW5jKSB7IGZyb21bZm9ybWF0XSA9IGZ1bmMgfVxuZXhwb3J0IGZ1bmN0aW9uIGRlZmluZVRhcmdldChmb3JtYXQsIGZ1bmMpIHsgdG9bZm9ybWF0XSA9IGZ1bmMgfVxuXG5kZWZpbmVTb3VyY2UoXCJqc29uXCIsIGpzb24gPT4gTm9kZS5mcm9tSlNPTihqc29uKSlcbmRlZmluZVRhcmdldChcImpzb25cIiwgZG9jID0+IGRvYy50b0pTT04oKSlcbiIsImltcG9ydCB7c3R5bGUsIE5vZGUsIFNwYW4sIG5vZGVUeXBlcywgZmluZENvbm5lY3Rpb259IGZyb20gXCIuLi9tb2RlbFwiXG5pbXBvcnQge2RlZmluZVNvdXJjZX0gZnJvbSBcIi4vY29udmVydFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tRE9NKGRvbSwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIG9wdGlvbnMgPSB7fVxuICBsZXQgY29udGV4dCA9IG5ldyBDb250ZXh0KG9wdGlvbnMudG9wTm9kZSB8fCBuZXcgTm9kZShcImRvY1wiKSlcbiAgbGV0IHN0YXJ0ID0gb3B0aW9ucy5mcm9tID8gZG9tLmNoaWxkTm9kZXNbb3B0aW9ucy5mcm9tXSA6IGRvbS5maXJzdENoaWxkXG4gIGxldCBlbmQgPSBvcHRpb25zLnRvICE9IG51bGwgJiYgZG9tLmNoaWxkTm9kZXNbb3B0aW9ucy50b10gfHwgbnVsbFxuICBjb250ZXh0LmFkZEFsbChzdGFydCwgZW5kLCB0cnVlKVxuICByZXR1cm4gY29udGV4dC5zdGFja1swXVxufVxuXG5kZWZpbmVTb3VyY2UoXCJkb21cIiwgZnJvbURPTSlcblxuZXhwb3J0IGZ1bmN0aW9uIGZyb21IVE1MKGh0bWwsIG9wdGlvbnMpIHtcbiAgbGV0IHdyYXAgPSBvcHRpb25zLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgd3JhcC5pbm5lckhUTUwgPSBodG1sXG4gIHJldHVybiBmcm9tRE9NKHdyYXAsIG9wdGlvbnMpXG59XG5cbmRlZmluZVNvdXJjZShcImh0bWxcIiwgZnJvbUhUTUwpXG5cbmNvbnN0IGJsb2NrRWxlbWVudHMgPSB7XG4gIGFkZHJlc3M6IHRydWUsIGFydGljbGU6IHRydWUsIGFzaWRlOiB0cnVlLCBibG9ja3F1b3RlOiB0cnVlLCBjYW52YXM6IHRydWUsXG4gIGRkOiB0cnVlLCBkaXY6IHRydWUsIGRsOiB0cnVlLCBmaWVsZHNldDogdHJ1ZSwgZmlnY2FwdGlvbjogdHJ1ZSwgZmlndXJlOiB0cnVlLFxuICBmb290ZXI6IHRydWUsIGZvcm06IHRydWUsIGgxOiB0cnVlLCBoMjogdHJ1ZSwgaDM6IHRydWUsIGg0OiB0cnVlLCBoNTogdHJ1ZSxcbiAgaDY6IHRydWUsIGhlYWRlcjogdHJ1ZSwgaGdyb3VwOiB0cnVlLCBocjogdHJ1ZSwgbGk6IHRydWUsIG5vc2NyaXB0OiB0cnVlLCBvbDogdHJ1ZSxcbiAgb3V0cHV0OiB0cnVlLCBwOiB0cnVlLCBwcmU6IHRydWUsIHNlY3Rpb246IHRydWUsIHRhYmxlOiB0cnVlLCB0Zm9vdDogdHJ1ZSwgdWw6IHRydWVcbn1cblxuY2xhc3MgQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKHRvcE5vZGUpIHtcbiAgICB0aGlzLnN0YWNrID0gW3RvcE5vZGVdXG4gICAgdGhpcy5zdHlsZXMgPSBbXVxuICAgIHRoaXMuY2xvc2luZyA9IGZhbHNlXG4gIH1cblxuICBnZXQgdG9wKCkge1xuICAgIHJldHVybiB0aGlzLnN0YWNrW3RoaXMuc3RhY2subGVuZ3RoIC0gMV1cbiAgfVxuXG4gIGFkZERPTShkb20pIHtcbiAgICBpZiAoZG9tLm5vZGVUeXBlID09IDMpIHtcbiAgICAgIGxldCB2YWx1ZSA9IGRvbS5ub2RlVmFsdWVcbiAgICAgIGxldCB0b3AgPSB0aGlzLnRvcCwgYmxvY2sgPSB0b3AudHlwZS5ibG9ja1xuICAgICAgaWYgKC9cXFMvLnRlc3QodmFsdWUpIHx8IGJsb2NrKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFxzKy9nLCBcIiBcIilcbiAgICAgICAgaWYgKC9eXFxzLy50ZXN0KHZhbHVlKSAmJiB0b3AuY29udGVudC5sZW5ndGggJiYgL1xccyQvLnRlc3QodG9wLmNvbnRlbnRbdG9wLmNvbnRlbnQubGVuZ3RoIC0gMV0udGV4dCkpXG4gICAgICAgICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgxKVxuICAgICAgICB0aGlzLmluc2VydChTcGFuLnRleHQodmFsdWUsIHRoaXMuc3R5bGVzKSlcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRvbS5ub2RlVHlwZSAhPSAxKSB7XG4gICAgICAvLyBJZ25vcmUgbm9uLXRleHQgbm9uLWVsZW1lbnQgbm9kZXNcbiAgICB9IGVsc2UgaWYgKGRvbS5oYXNBdHRyaWJ1dGUoXCJwbS1odG1sXCIpKSB7XG4gICAgICBsZXQgdHlwZSA9IGRvbS5nZXRBdHRyaWJ1dGUoXCJwbS1odG1sXCIpXG4gICAgICBpZiAodHlwZSA9PSBcImh0bWxfdGFnXCIpXG4gICAgICAgIHRoaXMuaW5zZXJ0KG5ldyBTcGFuKFwiaHRtbF90YWdcIiwge2h0bWw6IGRvbS5pbm5lckhUTUx9LCB0aGlzLnN0eWxlcykpXG4gICAgICBlbHNlXG4gICAgICAgIHRoaXMuaW5zZXJ0KG5ldyBOb2RlKFwiaHRtbF9ibG9ja1wiLCB7aHRtbDogZG9tLmlubmVySFRNTH0pKVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgbmFtZSA9IGRvbS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICBpZiAobmFtZSBpbiB0YWdzKSB7XG4gICAgICAgIHRhZ3NbbmFtZV0oZG9tLCB0aGlzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hZGRBbGwoZG9tLmZpcnN0Q2hpbGQsIG51bGwpXG4gICAgICAgIGlmIChibG9ja0VsZW1lbnRzLmhhc093blByb3BlcnR5KG5hbWUpICYmIHRoaXMudG9wLnR5cGUgPT0gbm9kZVR5cGVzLnBhcmFncmFwaClcbiAgICAgICAgICB0aGlzLmNsb3NpbmcgPSB0cnVlXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYWRkQWxsKGZyb20sIHRvLCBzeW5jKSB7XG4gICAgbGV0IHN0YWNrID0gc3luYyAmJiB0aGlzLnN0YWNrLnNsaWNlKClcbiAgICBmb3IgKGxldCBkb20gPSBmcm9tOyBkb20gIT0gdG87IGRvbSA9IGRvbS5uZXh0U2libGluZykge1xuICAgICAgdGhpcy5hZGRET00oZG9tKVxuICAgICAgaWYgKHN5bmMgJiYgYmxvY2tFbGVtZW50cy5oYXNPd25Qcm9wZXJ0eShkb20ubm9kZU5hbWUudG9Mb3dlckNhc2UoKSkpXG4gICAgICAgIHRoaXMuc3luYyhzdGFjaylcbiAgICB9XG4gIH1cblxuICBkb0Nsb3NlKCkge1xuICAgIGlmICghdGhpcy5jbG9zaW5nKSByZXR1cm5cbiAgICBsZXQgbGVmdCA9IHRoaXMuc3RhY2sucG9wKCkuY29weSgpXG4gICAgdGhpcy50b3AucHVzaChsZWZ0KVxuICAgIHRoaXMuc3RhY2sucHVzaChsZWZ0KVxuICAgIHRoaXMuY2xvc2luZyA9IGZhbHNlXG4gIH1cblxuICBpbnNlcnQobm9kZSkge1xuICAgIGlmICh0aGlzLnRvcC50eXBlLmNvbnRhaW5zID09IG5vZGUudHlwZS50eXBlKSB7XG4gICAgICB0aGlzLmRvQ2xvc2UoKVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gdGhpcy5zdGFjay5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBsZXQgcm91dGUgPSBmaW5kQ29ubmVjdGlvbih0aGlzLnN0YWNrW2ldLnR5cGUsIG5vZGUudHlwZSlcbiAgICAgICAgaWYgKCFyb3V0ZSkgY29udGludWVcbiAgICAgICAgaWYgKGkgPT0gdGhpcy5zdGFjay5sZW5ndGggLSAxKVxuICAgICAgICAgIHRoaXMuZG9DbG9zZSgpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aGlzLnN0YWNrLmxlbmd0aCA9IGkgKyAxXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcm91dGUubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBsZXQgd3JhcCA9IG5ldyBOb2RlKHJvdXRlW2pdKVxuICAgICAgICAgIHRoaXMudG9wLnB1c2god3JhcClcbiAgICAgICAgICB0aGlzLnN0YWNrLnB1c2god3JhcClcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zdHlsZXMubGVuZ3RoKSB0aGlzLnN0eWxlcyA9IFtdXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMudG9wLnB1c2gobm9kZSlcbiAgfVxuXG4gIGVudGVyKG5vZGUpIHtcbiAgICB0aGlzLmluc2VydChub2RlKVxuICAgIGlmICh0aGlzLnN0eWxlcy5sZW5ndGgpIHRoaXMuc3R5bGVzID0gW11cbiAgICB0aGlzLnN0YWNrLnB1c2gobm9kZSlcbiAgfVxuXG4gIHN5bmMoc3RhY2spIHtcbiAgICB3aGlsZSAodGhpcy5zdGFjay5sZW5ndGggPiBzdGFjay5sZW5ndGgpIHRoaXMuc3RhY2sucG9wKClcbiAgICB3aGlsZSAoIXN0YWNrW3RoaXMuc3RhY2subGVuZ3RoIC0gMV0uc2FtZU1hcmt1cChzdGFja1t0aGlzLnN0YWNrLmxlbmd0aCAtIDFdKSkgdGhpcy5zdGFjay5wb3AoKVxuICAgIHdoaWxlIChzdGFjay5sZW5ndGggPiB0aGlzLnN0YWNrLmxlbmd0aCkge1xuICAgICAgbGV0IGFkZCA9IHN0YWNrW3RoaXMuc3RhY2subGVuZ3RoXS5jb3B5KClcbiAgICAgIHRoaXMudG9wLnB1c2goYWRkKVxuICAgICAgdGhpcy5zdGFjay5wdXNoKGFkZClcbiAgICB9XG4gICAgaWYgKHRoaXMuc3R5bGVzLmxlbmd0aCkgdGhpcy5zdHlsZXMgPSBbXVxuICAgIHRoaXMuY2xvc2luZyA9IGZhbHNlXG4gIH1cbn1cblxuLy8gRklYTUUgZG9uJ3QgZXhwb3J0LCBkZWZpbmUgcHJvcGVyIGV4dGVuc2lvbiBtZWNoYW5pc21cbmV4cG9ydCBjb25zdCB0YWdzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXG5mdW5jdGlvbiB3cmFwKGRvbSwgY29udGV4dCwgbm9kZSkge1xuICBjb250ZXh0LmVudGVyKG5vZGUpXG4gIGNvbnRleHQuYWRkQWxsKGRvbS5maXJzdENoaWxkLCBudWxsLCB0cnVlKVxuICBjb250ZXh0LnN0YWNrLnBvcCgpXG59XG5cbmZ1bmN0aW9uIHdyYXBBcyh0eXBlKSB7XG4gIHJldHVybiAoZG9tLCBjb250ZXh0KSA9PiB3cmFwKGRvbSwgY29udGV4dCwgbmV3IE5vZGUodHlwZSkpXG59XG5cbmZ1bmN0aW9uIGlubGluZShkb20sIGNvbnRleHQsIGFkZGVkKSB7XG4gIHZhciBvbGQgPSBjb250ZXh0LnN0eWxlc1xuICBjb250ZXh0LnN0eWxlcyA9IHN0eWxlLmFkZChvbGQsIGFkZGVkKVxuICBjb250ZXh0LmFkZEFsbChkb20uZmlyc3RDaGlsZCwgbnVsbClcbiAgY29udGV4dC5zdHlsZXMgPSBvbGRcbn1cblxudGFncy5wID0gd3JhcEFzKFwicGFyYWdyYXBoXCIpXG5cbnRhZ3MuYmxvY2txdW90ZSA9IHdyYXBBcyhcImJsb2NrcXVvdGVcIilcblxuZm9yICh2YXIgaSA9IDE7IGkgPD0gNjsgaSsrKSB7XG4gIGxldCBhdHRycyA9IHtsZXZlbDogaX1cbiAgdGFnc1tcImhcIiArIGldID0gKGRvbSwgY29udGV4dCkgPT4gd3JhcChkb20sIGNvbnRleHQsIG5ldyBOb2RlKFwiaGVhZGluZ1wiLCBhdHRycykpXG59XG5cbnRhZ3MuaHIgPSAoXywgY29udGV4dCkgPT4gY29udGV4dC5pbnNlcnQobmV3IE5vZGUoXCJob3Jpem9udGFsX3J1bGVcIikpXG5cbnRhZ3MucHJlID0gKGRvbSwgY29udGV4dCkgPT4ge1xuICBsZXQgcGFyYW1zID0gZG9tLmZpcnN0Q2hpbGQgJiYgL15jb2RlJC9pLnRlc3QoZG9tLmZpcnN0Q2hpbGQubm9kZU5hbWUpICYmIGRvbS5maXJzdENoaWxkLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpXG4gIGlmIChwYXJhbXMgJiYgL2ZlbmNlLy50ZXN0KHBhcmFtcykpIHtcbiAgICBsZXQgZm91bmQgPSBbXSwgcmUgPSAvKD86XnxcXHMpbGFuZy0oXFxTKykvZywgbVxuICAgIHdoaWxlIChtID0gcmUudGVzdChwYXJhbXMpKSBmb3VuZC5wdXNoKG1bMV0pXG4gICAgcGFyYW1zID0gZm91bmQuam9pbihcIiBcIilcbiAgfSBlbHNlIHtcbiAgICBwYXJhbXMgPSBudWxsXG4gIH1cbiAgY29udGV4dC5pbnNlcnQobmV3IE5vZGUoXCJjb2RlX2Jsb2NrXCIsIHtwYXJhbXM6IHBhcmFtc30sIFtTcGFuLnRleHQoZG9tLnRleHRDb250ZW50KV0pKVxufVxuXG50YWdzLnVsID0gKGRvbSwgY29udGV4dCkgPT4ge1xuICBsZXQgY2xzID0gZG9tLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpXG4gIGxldCBhdHRycyA9IHtidWxsZXQ6IC9idWxsZXRfZGFzaC8udGVzdChjbHMpID8gXCItXCIgOiAvYnVsbGV0X3BsdXMvLnRlc3QoY2xzKSA/IFwiK1wiIDogXCIqXCIsXG4gICAgICAgICAgICAgICB0aWdodDogL1xcYnRpZ2h0XFxiLy50ZXN0KGRvbS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSl9XG4gIHdyYXAoZG9tLCBjb250ZXh0LCBuZXcgTm9kZShcImJ1bGxldF9saXN0XCIsIGF0dHJzKSlcbn1cblxudGFncy5vbCA9IChkb20sIGNvbnRleHQpID0+IHtcbiAgbGV0IGF0dHJzID0ge29yZGVyOiBkb20uZ2V0QXR0cmlidXRlKFwic3RhcnRcIikgfHwgMSxcbiAgICAgICAgICAgICAgIHRpZ2h0OiAvXFxidGlnaHRcXGIvLnRlc3QoZG9tLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpKX1cbiAgd3JhcChkb20sIGNvbnRleHQsIG5ldyBOb2RlKFwib3JkZXJlZF9saXN0XCIsIGF0dHJzKSlcbn1cblxudGFncy5saSA9IHdyYXBBcyhcImxpc3RfaXRlbVwiKVxuXG50YWdzLmJyID0gKGRvbSwgY29udGV4dCkgPT4ge1xuICBpZiAoIWRvbS5oYXNBdHRyaWJ1dGUoXCJwbS1mb3JjZS1iclwiKSlcbiAgICBjb250ZXh0Lmluc2VydChuZXcgU3BhbihcImhhcmRfYnJlYWtcIiwgbnVsbCwgY29udGV4dC5zdHlsZXMpKVxufVxuXG50YWdzLmEgPSAoZG9tLCBjb250ZXh0KSA9PiBpbmxpbmUoZG9tLCBjb250ZXh0LCBzdHlsZS5saW5rKGRvbS5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpLCBkb20uZ2V0QXR0cmlidXRlKFwidGl0bGVcIikpKVxuXG50YWdzLmIgPSB0YWdzLnN0cm9uZyA9IChkb20sIGNvbnRleHQpID0+IGlubGluZShkb20sIGNvbnRleHQsIHN0eWxlLnN0cm9uZylcblxudGFncy5pID0gdGFncy5lbSA9IChkb20sIGNvbnRleHQpID0+IGlubGluZShkb20sIGNvbnRleHQsIHN0eWxlLmVtKVxuXG50YWdzLmNvZGUgPSAoZG9tLCBjb250ZXh0KSA9PiBpbmxpbmUoZG9tLCBjb250ZXh0LCBzdHlsZS5jb2RlKVxuXG50YWdzLmltZyA9IChkb20sIGNvbnRleHQpID0+IHtcbiAgbGV0IGF0dHJzID0ge3NyYzogZG9tLmdldEF0dHJpYnV0ZShcInNyY1wiKSxcbiAgICAgICAgICAgICAgIHRpdGxlOiBkb20uZ2V0QXR0cmlidXRlKFwidGl0bGVcIikgfHwgbnVsbCxcbiAgICAgICAgICAgICAgIGFsdDogZG9tLmdldEF0dHJpYnV0ZShcImFsdFwiKSB8fCBudWxsfVxuICBjb250ZXh0Lmluc2VydChuZXcgU3BhbihcImltYWdlXCIsIGF0dHJzKSlcbn1cbiIsImltcG9ydCB7U3BhbiwgTm9kZX0gZnJvbSBcIi4uL21vZGVsXCJcbmltcG9ydCB7ZGVmaW5lU291cmNlfSBmcm9tIFwiLi9jb252ZXJ0XCJcblxuZXhwb3J0IGZ1bmN0aW9uIGZyb21UZXh0KHRleHQpIHtcbiAgbGV0IGJsb2NrcyA9IHRleHQudHJpbSgpLnNwbGl0KFwiXFxuXFxuXCIpXG4gIGxldCBkb2MgPSBuZXcgTm9kZShcImRvY1wiKVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBwYXJhID0gbmV3IE5vZGUoXCJwYXJhZ3JhcGhcIilcbiAgICBsZXQgcGFydHMgPSBibG9ja3NbaV0uc3BsaXQoXCJcXG5cIilcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHBhcnRzLmxlbmd0aDsgaisrKSB7XG4gICAgICBpZiAoaikgcGFyYS5wdXNoKG5ldyBTcGFuKFwiaGFyZF9icmVha1wiKSlcbiAgICAgIHBhcmEucHVzaChTcGFuLnRleHQocGFydHNbal0pKVxuICAgIH1cbiAgICBkb2MucHVzaChwYXJhKVxuICB9XG4gIHJldHVybiBkb2Ncbn1cblxuZGVmaW5lU291cmNlKFwidGV4dFwiLCBmcm9tVGV4dClcbiIsImltcG9ydCB7c3R5bGV9IGZyb20gXCIuLi9tb2RlbFwiXG5pbXBvcnQge2RlZmluZVRhcmdldH0gZnJvbSBcIi4vY29udmVydFwiXG5cbi8vIEZJWE1FIHVuLWV4cG9ydCwgZGVmaW5lIHByb3BlciBleHRlbnNpb24gbWVjaGFuaXNtXG5leHBvcnQgY29uc3QgcmVuZGVyID0gT2JqZWN0LmNyZWF0ZShudWxsKSwgcmVuZGVyU3R5bGUgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cbmxldCBkb2MgPSBudWxsXG5cbmV4cG9ydCBmdW5jdGlvbiB0b0RPTShub2RlLCBvcHRpb25zKSB7XG4gIGRvYyA9IG9wdGlvbnMuZG9jdW1lbnRcbiAgcmV0dXJuIHJlbmRlck5vZGVzKG5vZGUuY29udGVudCwgb3B0aW9ucylcbn1cblxuZGVmaW5lVGFyZ2V0KFwiZG9tXCIsIHRvRE9NKVxuXG5leHBvcnQgZnVuY3Rpb24gdG9IVE1MKG5vZGUsIG9wdGlvbnMpIHtcbiAgbGV0IHdyYXAgPSBvcHRpb25zLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgd3JhcC5hcHBlbmRDaGlsZCh0b0RPTShub2RlLCBvcHRpb25zKSlcbiAgcmV0dXJuIHdyYXAuaW5uZXJIVE1MXG59XG5cbmRlZmluZVRhcmdldChcImh0bWxcIiwgdG9IVE1MKVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyTm9kZVRvRE9NKG5vZGUsIG9wdGlvbnMsIG9mZnNldCkge1xuICBsZXQgZG9tID0gcmVuZGVyTm9kZShub2RlLCBvcHRpb25zLCBvZmZzZXQpXG4gIGlmIChvcHRpb25zLnJlbmRlcklubGluZUZsYXQgJiYgbm9kZS50eXBlLnR5cGUgPT0gXCJzcGFuXCIpIHtcbiAgICBkb20gPSB3cmFwSW5saW5lRmxhdChub2RlLCBkb20pXG4gICAgZG9tID0gb3B0aW9ucy5yZW5kZXJJbmxpbmVGbGF0KG5vZGUsIGRvbSwgb2Zmc2V0KSB8fCBkb21cbiAgfVxuICByZXR1cm4gZG9tXG59XG5cbmZ1bmN0aW9uIGVsdChuYW1lLCAuLi5jaGlsZHJlbikge1xuICBsZXQgZG9tID0gZG9jLmNyZWF0ZUVsZW1lbnQobmFtZSlcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgIGxldCBjaGlsZCA9IGNoaWxkcmVuW2ldXG4gICAgZG9tLmFwcGVuZENoaWxkKHR5cGVvZiBjaGlsZCA9PSBcInN0cmluZ1wiID8gZG9jLmNyZWF0ZVRleHROb2RlKGNoaWxkKSA6IGNoaWxkKVxuICB9XG4gIHJldHVybiBkb21cbn1cblxuZnVuY3Rpb24gd3JhcChub2RlLCBvcHRpb25zLCB0eXBlKSB7XG4gIGxldCBkb20gPSBlbHQodHlwZSB8fCBub2RlLnR5cGUubmFtZSlcbiAgaWYgKG5vZGUudHlwZS5jb250YWlucyAhPSBcInNwYW5cIilcbiAgICByZW5kZXJOb2Rlc0ludG8obm9kZS5jb250ZW50LCBkb20sIG9wdGlvbnMpXG4gIGVsc2UgaWYgKG9wdGlvbnMucmVuZGVySW5saW5lRmxhdClcbiAgICByZW5kZXJJbmxpbmVDb250ZW50RmxhdChub2RlLmNvbnRlbnQsIGRvbSwgb3B0aW9ucylcbiAgZWxzZVxuICAgIHJlbmRlcklubGluZUNvbnRlbnQobm9kZS5jb250ZW50LCBkb20sIG9wdGlvbnMpXG4gIHJldHVybiBkb21cbn1cblxuZnVuY3Rpb24gd3JhcEluKHR5cGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG5vZGUsIG9wdGlvbnMpIHsgcmV0dXJuIHdyYXAobm9kZSwgb3B0aW9ucywgdHlwZSkgfVxufVxuXG5mdW5jdGlvbiByZW5kZXJOb2Rlcyhub2Rlcywgb3B0aW9ucykge1xuICBsZXQgZnJhZyA9IGRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcbiAgcmVuZGVyTm9kZXNJbnRvKG5vZGVzLCBmcmFnLCBvcHRpb25zKVxuICByZXR1cm4gZnJhZ1xufVxuXG5mdW5jdGlvbiByZW5kZXJOb2RlKG5vZGUsIG9wdGlvbnMsIG9mZnNldCkge1xuICBsZXQgZG9tID0gcmVuZGVyW25vZGUudHlwZS5uYW1lXShub2RlLCBvcHRpb25zKVxuICBpZiAob3B0aW9ucy5vblJlbmRlcilcbiAgICBkb20gPSBvcHRpb25zLm9uUmVuZGVyKG5vZGUsIGRvbSwgb2Zmc2V0KSB8fCBkb21cbiAgcmV0dXJuIGRvbVxufVxuXG5mdW5jdGlvbiByZW5kZXJOb2Rlc0ludG8obm9kZXMsIHdoZXJlLCBvcHRpb25zKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAob3B0aW9ucy5wYXRoKSBvcHRpb25zLnBhdGgucHVzaChpKVxuICAgIHdoZXJlLmFwcGVuZENoaWxkKHJlbmRlck5vZGUobm9kZXNbaV0sIG9wdGlvbnMsIGkpKVxuICAgIGlmIChvcHRpb25zLnBhdGgpIG9wdGlvbnMucGF0aC5wb3AoKVxuICB9XG59XG5cbmZ1bmN0aW9uIHJlbmRlcklubGluZUNvbnRlbnQobm9kZXMsIHdoZXJlLCBvcHRpb25zKSB7XG4gIGxldCB0b3AgPSB3aGVyZVxuICBsZXQgYWN0aXZlID0gW11cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBub2RlID0gbm9kZXNbaV0sIHN0eWxlcyA9IG5vZGUuc3R5bGVzXG4gICAgbGV0IGtlZXAgPSAwXG4gICAgZm9yICg7IGtlZXAgPCBNYXRoLm1pbihhY3RpdmUubGVuZ3RoLCBzdHlsZXMubGVuZ3RoKTsgKytrZWVwKVxuICAgICAgaWYgKCFzdHlsZS5zYW1lKGFjdGl2ZVtrZWVwXSwgc3R5bGVzW2tlZXBdKSkgYnJlYWtcbiAgICB3aGlsZSAoa2VlcCA8IGFjdGl2ZS5sZW5ndGgpIHtcbiAgICAgIGFjdGl2ZS5wb3AoKVxuICAgICAgdG9wID0gdG9wLnBhcmVudE5vZGVcbiAgICB9XG4gICAgd2hpbGUgKGFjdGl2ZS5sZW5ndGggPCBzdHlsZXMubGVuZ3RoKSB7XG4gICAgICBsZXQgYWRkID0gc3R5bGVzW2FjdGl2ZS5sZW5ndGhdXG4gICAgICBhY3RpdmUucHVzaChhZGQpXG4gICAgICB0b3AgPSB0b3AuYXBwZW5kQ2hpbGQocmVuZGVyU3R5bGVbYWRkLnR5cGVdKGFkZCkpXG4gICAgfVxuICAgIHRvcC5hcHBlbmRDaGlsZChyZW5kZXJOb2RlKG5vZGUsIG9wdGlvbnMsIGkpKVxuICB9XG59XG5cbmZ1bmN0aW9uIHdyYXBJbmxpbmVGbGF0KG5vZGUsIGRvbSkge1xuICBsZXQgc3R5bGVzID0gbm9kZS5zdHlsZXNcbiAgZm9yIChsZXQgaSA9IHN0eWxlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGxldCB3cmFwID0gcmVuZGVyU3R5bGVbc3R5bGVzW2ldLnR5cGVdKHN0eWxlc1tpXSlcbiAgICB3cmFwLmFwcGVuZENoaWxkKGRvbSlcbiAgICBkb20gPSB3cmFwXG4gIH1cbiAgcmV0dXJuIGRvbVxufVxuXG5mdW5jdGlvbiByZW5kZXJJbmxpbmVDb250ZW50RmxhdChub2Rlcywgd2hlcmUsIG9wdGlvbnMpIHtcbiAgbGV0IG9mZnNldCA9IDBcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBub2RlID0gbm9kZXNbaV1cbiAgICBsZXQgZG9tID0gd3JhcElubGluZUZsYXQobm9kZSwgcmVuZGVyTm9kZShub2RlLCBvcHRpb25zLCBpKSlcbiAgICBkb20gPSBvcHRpb25zLnJlbmRlcklubGluZUZsYXQobm9kZSwgZG9tLCBvZmZzZXQpIHx8IGRvbVxuICAgIHdoZXJlLmFwcGVuZENoaWxkKGRvbSlcbiAgICBvZmZzZXQgKz0gbm9kZS5zaXplXG4gIH1cbiAgaWYgKCFub2Rlcy5sZW5ndGggfHwgbm9kZXNbbm9kZXMubGVuZ3RoIC0gMV0udHlwZS5uYW1lID09IFwiaGFyZF9icmVha1wiKVxuICAgIHdoZXJlLmFwcGVuZENoaWxkKGVsdChcImJyXCIpKS5zZXRBdHRyaWJ1dGUoXCJwbS1mb3JjZS1iclwiLCBcInRydWVcIilcbn1cblxuLy8gQmxvY2sgbm9kZXNcblxucmVuZGVyLmJsb2NrcXVvdGUgPSB3cmFwXG5cbnJlbmRlci5jb2RlX2Jsb2NrID0gKG5vZGUsIG9wdGlvbnMpID0+IHtcbiAgbGV0IGNvZGUgPSB3cmFwKG5vZGUsIG9wdGlvbnMsIFwiY29kZVwiKVxuICBpZiAobm9kZS5hdHRycy5wYXJhbXMgIT0gbnVsbClcbiAgICBjb2RlLmNsYXNzTmFtZSA9IFwiZmVuY2UgXCIgKyBub2RlLmF0dHJzLnBhcmFtcy5yZXBsYWNlKC8oXnxcXHMrKS9nLCBcIiQmbGFuZy1cIilcbiAgcmV0dXJuIGVsdChcInByZVwiLCBjb2RlKVxufVxuXG5yZW5kZXIuaGVhZGluZyA9IChub2RlLCBvcHRpb25zKSA9PiB3cmFwKG5vZGUsIG9wdGlvbnMsIFwiaFwiICsgbm9kZS5hdHRycy5sZXZlbClcblxucmVuZGVyLmhvcml6b250YWxfcnVsZSA9IF9ub2RlID0+IGVsdChcImhyXCIpXG5cbnJlbmRlci5idWxsZXRfbGlzdCA9IChub2RlLCBvcHRpb25zKSA9PiB7XG4gIGxldCBkb20gPSB3cmFwKG5vZGUsIG9wdGlvbnMsIFwidWxcIilcbiAgbGV0IGJ1bCA9IG5vZGUuYXR0cnMuYnVsbGV0XG4gIGRvbS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBidWwgPT0gXCIrXCIgPyBcImJ1bGxldF9wbHVzXCIgOiBidWwgPT0gXCItXCIgPyBcImJ1bGxldF9kYXNoXCIgOiBcImJ1bGxldF9zdGFyXCIpXG4gIGlmIChub2RlLmF0dHJzLnRpZ2h0KSBkb20uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJ0aWdodFwiKVxuICByZXR1cm4gZG9tXG59XG5cbnJlbmRlci5vcmRlcmVkX2xpc3QgPSAobm9kZSwgb3B0aW9ucykgPT4ge1xuICBsZXQgZG9tID0gd3JhcChub2RlLCBvcHRpb25zLCBcIm9sXCIpXG4gIGlmIChub2RlLmF0dHJzLm9yZGVyID4gMSkgZG9tLnNldEF0dHJpYnV0ZShcInN0YXJ0XCIsIG5vZGUuYXR0cnMub3JkZXIpXG4gIGlmIChub2RlLmF0dHJzLnRpZ2h0KSBkb20uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJ0aWdodFwiKVxuICByZXR1cm4gZG9tXG59XG5cbnJlbmRlci5saXN0X2l0ZW0gPSB3cmFwSW4oXCJsaVwiKVxuXG5yZW5kZXIucGFyYWdyYXBoID0gd3JhcEluKFwicFwiKVxuXG5yZW5kZXIuaHRtbF9ibG9jayA9IG5vZGUgPT4ge1xuICBsZXQgZG9tID0gZWx0KFwiZGl2XCIpXG4gIGRvbS5pbm5lckhUTUwgPSBub2RlLmF0dHJzLmh0bWxcbiAgZG9tLnNldEF0dHJpYnV0ZShcInBtLWh0bWxcIiwgXCJodG1sX2Jsb2NrXCIpXG4gIHJldHVybiBkb21cbn1cblxuLy8gSW5saW5lIGNvbnRlbnRcblxucmVuZGVyLnRleHQgPSBub2RlID0+IGRvYy5jcmVhdGVUZXh0Tm9kZShub2RlLnRleHQpXG5cbnJlbmRlci5pbWFnZSA9IG5vZGUgPT4ge1xuICBsZXQgZG9tID0gZWx0KFwiaW1nXCIpXG4gIGRvbS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgbm9kZS5hdHRycy5zcmMpXG4gIGlmIChub2RlLmF0dHJzLnRpdGxlKSBkb20uc2V0QXR0cmlidXRlKFwidGl0bGVcIiwgbm9kZS5hdHRycy50aXRsZSlcbiAgaWYgKG5vZGUuYXR0cnMuYWx0KSBkb20uc2V0QXR0cmlidXRlKFwiYWx0XCIsIG5vZGUuYXR0cnMuYWx0KVxuICByZXR1cm4gZG9tXG59XG5cbnJlbmRlci5oYXJkX2JyZWFrID0gX25vZGUgPT4gZWx0KFwiYnJcIilcblxucmVuZGVyLmh0bWxfdGFnID0gbm9kZSA9PiB7XG4gIGxldCBkb20gPSBlbHQoXCJzcGFuXCIpXG4gIGRvbS5pbm5lckhUTUwgPSBub2RlLmF0dHJzLmh0bWxcbiAgZG9tLnNldEF0dHJpYnV0ZShcInBtLWh0bWxcIiwgXCJodG1sX3RhZ1wiKVxuICByZXR1cm4gZG9tXG59XG5cbi8vIElubGluZSBzdHlsZXNcblxucmVuZGVyU3R5bGUuZW0gPSAoKSA9PiBlbHQoXCJlbVwiKVxuXG5yZW5kZXJTdHlsZS5zdHJvbmcgPSAoKSA9PiBlbHQoXCJzdHJvbmdcIilcblxucmVuZGVyU3R5bGUuY29kZSA9ICgpID0+IGVsdChcImNvZGVcIilcblxucmVuZGVyU3R5bGUubGluayA9IHN0eWxlID0+IHtcbiAgbGV0IGRvbSA9IGVsdChcImFcIilcbiAgZG9tLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgc3R5bGUuaHJlZilcbiAgaWYgKHN0eWxlLnRpdGxlKSBkb20uc2V0QXR0cmlidXRlKFwidGl0bGVcIiwgc3R5bGUudGl0bGUpXG4gIHJldHVybiBkb21cbn1cbiIsImltcG9ydCB7bm9kZVR5cGVzfSBmcm9tIFwiLi4vbW9kZWxcIlxuaW1wb3J0IHtkZWZpbmVUYXJnZXR9IGZyb20gXCIuL2NvbnZlcnRcIlxuXG5leHBvcnQgZnVuY3Rpb24gdG9UZXh0KGRvYykge1xuICBsZXQgb3V0ID0gXCJcIlxuICBmdW5jdGlvbiBleHBsb3JlKG5vZGUpIHtcbiAgICBpZiAobm9kZS50eXBlLmJsb2NrKSB7XG4gICAgICBsZXQgdGV4dCA9IFwiXCJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5jb250ZW50Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBjaGlsZCA9IG5vZGUuY29udGVudFtpXVxuICAgICAgICBpZiAoY2hpbGQudHlwZSA9PSBub2RlVHlwZXMudGV4dClcbiAgICAgICAgICB0ZXh0ICs9IGNoaWxkLnRleHRcbiAgICAgICAgZWxzZSBpZiAoY2hpbGQudHlwZSA9PSBub2RlVHlwZXMuaGFyZF9icmVhaylcbiAgICAgICAgICB0ZXh0ICs9IFwiXFxuXCJcbiAgICAgIH1cbiAgICAgIGlmICh0ZXh0KSBvdXQgKz0gKG91dCA/IFwiXFxuXFxuXCIgOiBcIlwiKSArIHRleHRcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZS5jb250ZW50LmZvckVhY2goZXhwbG9yZSlcbiAgICB9XG4gIH1cbiAgZXhwbG9yZShkb2MpXG4gIHJldHVybiBvdXRcbn1cblxuZGVmaW5lVGFyZ2V0KFwidGV4dFwiLCB0b1RleHQpXG4iLCJleHBvcnQgZnVuY3Rpb24gZWx0KHRhZywgYXR0cnMsIC4uLmFyZ3MpIHtcbiAgbGV0IHJlc3VsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKVxuICBpZiAoYXR0cnMpIGZvciAobGV0IG5hbWUgaW4gYXR0cnMpIHtcbiAgICBpZiAobmFtZSA9PSBcInN0eWxlXCIpXG4gICAgICByZXN1bHQuc3R5bGUuY3NzVGV4dCA9IGF0dHJzW25hbWVdXG4gICAgZWxzZSBpZiAoYXR0cnNbbmFtZV0gIT0gbnVsbClcbiAgICAgIHJlc3VsdC5zZXRBdHRyaWJ1dGUobmFtZSwgYXR0cnNbbmFtZV0pXG4gIH1cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSBhZGQoYXJnc1tpXSwgcmVzdWx0KVxuICByZXR1cm4gcmVzdWx0XG59XG5cbmZ1bmN0aW9uIGFkZCh2YWx1ZSwgdGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gXCJzdHJpbmdcIilcbiAgICB2YWx1ZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHZhbHVlKVxuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSBhZGQodmFsdWVbaV0sIHRhcmdldClcbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQodmFsdWUpXG4gIH1cbn1cblxuXG5jb25zdCByZXFGcmFtZSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcblxuZXhwb3J0IGZ1bmN0aW9uIHJlcXVlc3RBbmltYXRpb25GcmFtZShmKSB7XG4gIGlmIChyZXFGcmFtZSkgcmVxRnJhbWUoZilcbiAgZWxzZSBzZXRUaW1lb3V0KGYsIDEwKVxufVxuXG5cbmNvbnN0IGllX3VwdG8xMCA9IC9NU0lFIFxcZC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KVxuY29uc3QgaWVfMTF1cCA9IC9UcmlkZW50XFwvKD86WzctOV18XFxkezIsfSlcXC4uKnJ2OihcXGQrKS8uZXhlYyhuYXZpZ2F0b3IudXNlckFnZW50KVxuXG5leHBvcnQgY29uc3QgYnJvd3NlciA9IHtcbiAgbWFjOiAvTWFjLy50ZXN0KG5hdmlnYXRvci5wbGF0Zm9ybSksXG4gIGllX3VwdG8xMCxcbiAgaWVfMTF1cCxcbiAgaWU6IGllX3VwdG8xMCB8fCBpZV8xMXVwLFxuICBnZWNrbzogL2dlY2tvXFwvXFxkL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KVxufVxuXG5cbmZ1bmN0aW9uIGNsYXNzVGVzdChjbHMpIHsgcmV0dXJuIG5ldyBSZWdFeHAoXCIoXnxcXFxccylcIiArIGNscyArIFwiKD86JHxcXFxccylcXFxccypcIik7IH1cblxuZXhwb3J0IGZ1bmN0aW9uIHJtQ2xhc3Mobm9kZSwgY2xzKSB7XG4gIGxldCBjdXJyZW50ID0gbm9kZS5jbGFzc05hbWVcbiAgbGV0IG1hdGNoID0gY2xhc3NUZXN0KGNscykuZXhlYyhjdXJyZW50KVxuICBpZiAobWF0Y2gpIHtcbiAgICBsZXQgYWZ0ZXIgPSBjdXJyZW50LnNsaWNlKG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoKVxuICAgIG5vZGUuY2xhc3NOYW1lID0gY3VycmVudC5zbGljZSgwLCBtYXRjaC5pbmRleCkgKyAoYWZ0ZXIgPyBtYXRjaFsxXSArIGFmdGVyIDogXCJcIilcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkQ2xhc3Mobm9kZSwgY2xzKSB7XG4gIGxldCBjdXJyZW50ID0gbm9kZS5jbGFzc05hbWVcbiAgaWYgKCFjbGFzc1Rlc3QoY2xzKS50ZXN0KGN1cnJlbnQpKSBub2RlLmNsYXNzTmFtZSArPSAoY3VycmVudCA/IFwiIFwiIDogXCJcIikgKyBjbHNcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gY29udGFpbnMocGFyZW50LCBjaGlsZCkge1xuICAvLyBBbmRyb2lkIGJyb3dzZXIgYW5kIElFIHdpbGwgcmV0dXJuIGZhbHNlIGlmIGNoaWxkIGlzIGEgdGV4dCBub2RlLlxuICBpZiAoY2hpbGQubm9kZVR5cGUgIT0gMSlcbiAgICBjaGlsZCA9IGNoaWxkLnBhcmVudE5vZGVcbiAgcmV0dXJuIGNoaWxkICYmIHBhcmVudC5jb250YWlucyhjaGlsZClcbn1cbiIsImNvbnN0IG5vbkFTQ0lJU2luZ2xlQ2FzZVdvcmRDaGFyID0gL1tcXHUwMGRmXFx1MDU4N1xcdTA1OTAtXFx1MDVmNFxcdTA2MDAtXFx1MDZmZlxcdTMwNDAtXFx1MzA5ZlxcdTMwYTAtXFx1MzBmZlxcdTM0MDAtXFx1NGRiNVxcdTRlMDAtXFx1OWZjY1xcdWFjMDAtXFx1ZDdhZl0vXG5cbmV4cG9ydCBmdW5jdGlvbiBpc1dvcmRDaGFyKGNoKSB7XG4gIHJldHVybiAvXFx3Ly50ZXN0KGNoKSB8fCBjaCA+IFwiXFx4ODBcIiAmJlxuICAgIChjaC50b1VwcGVyQ2FzZSgpICE9IGNoLnRvTG93ZXJDYXNlKCkgfHwgbm9uQVNDSUlTaW5nbGVDYXNlV29yZENoYXIudGVzdChjaCkpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGFyQ2F0ZWdvcnkoY2gpIHtcbiAgcmV0dXJuIC9cXHMvLnRlc3QoY2gpID8gXCJzcGFjZVwiIDogaXNXb3JkQ2hhcihjaCkgPyBcIndvcmRcIiA6IFwib3RoZXJcIlxufVxuIiwiaW1wb3J0IHtTcGFuLCBOb2RlLCBub2RlVHlwZXMsIFBvcywgc3R5bGUsIHNwYW5BdE9yQmVmb3JlfSBmcm9tIFwiLi4vbW9kZWxcIlxuaW1wb3J0IHtqb2luUG9pbnR9IGZyb20gXCIuLi90cmFuc2Zvcm1cIlxuXG5pbXBvcnQge2NoYXJDYXRlZ29yeX0gZnJvbSBcIi4vY2hhclwiXG5cbmNvbnN0IGNvbW1hbmRzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJDb21tYW5kKG5hbWUsIGZ1bmMpIHtcbiAgY29tbWFuZHNbbmFtZV0gPSBmdW5jXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleGVjQ29tbWFuZChwbSwgbmFtZSkge1xuICBsZXQgZXh0ID0gcG0uaW5wdXQuY29tbWFuZEV4dGVuc2lvbnNbbmFtZV1cbiAgaWYgKGV4dCAmJiBleHQuaGlnaCkgZm9yIChsZXQgaSA9IDA7IGkgPCBleHQuaGlnaC5sZW5ndGg7IGkrKylcbiAgICBpZiAoZXh0LmhpZ2hbaV0ocG0pICE9PSBmYWxzZSkgcmV0dXJuIHRydWVcbiAgaWYgKGV4dCAmJiBleHQubm9ybWFsKSBmb3IgKGxldCBpID0gMDsgaSA8IGV4dC5ub3JtYWwubGVuZ3RoOyBpKyspXG4gICAgaWYgKGV4dC5ub3JtYWxbaV0ocG0pICE9PSBmYWxzZSkgcmV0dXJuIHRydWVcbiAgbGV0IGJhc2UgPSBjb21tYW5kc1tuYW1lXVxuICBpZiAoYmFzZSAmJiBiYXNlKHBtKSAhPT0gZmFsc2UpIHJldHVybiB0cnVlXG4gIGlmIChleHQgJiYgZXh0LmxvdykgZm9yIChsZXQgaSA9IDA7IGkgPCBleHQubG93Lmxlbmd0aDsgaSsrKVxuICAgIGlmIChleHQubG93W2ldKHBtKSAhPT0gZmFsc2UpIHJldHVybiB0cnVlXG4gIHJldHVybiBmYWxzZVxufVxuXG5mdW5jdGlvbiBjbGVhclNlbChwbSkge1xuICBsZXQgc2VsID0gcG0uc2VsZWN0aW9uLCB0ciA9IHBtLnRyXG4gIGlmICghc2VsLmVtcHR5KSB0ci5kZWxldGUoc2VsLmZyb20sIHNlbC50bylcbiAgcmV0dXJuIHRyXG59XG5cbmNvbW1hbmRzLmluc2VydEhhcmRCcmVhayA9IHBtID0+IHtcbiAgcG0uc2Nyb2xsSW50b1ZpZXcoKVxuICBsZXQgdHIgPSBjbGVhclNlbChwbSksIHBvcyA9IHBtLnNlbGVjdGlvbi5mcm9tXG4gIGlmIChwbS5kb2MucGF0aChwb3MucGF0aCkudHlwZSA9PSBub2RlVHlwZXMuY29kZV9ibG9jaylcbiAgICB0ci5pbnNlcnRUZXh0KHBvcywgXCJcXG5cIilcbiAgZWxzZVxuICAgIHRyLmluc2VydChwb3MsIG5ldyBTcGFuKFwiaGFyZF9icmVha1wiKSlcbiAgcmV0dXJuIHBtLmFwcGx5KHRyKVxufVxuXG5jb21tYW5kcy5zZXRTdHJvbmcgPSBwbSA9PiBwbS5zZXRJbmxpbmVTdHlsZShzdHlsZS5zdHJvbmcsIHRydWUpXG5jb21tYW5kcy51bnNldFN0cm9uZyA9IHBtID0+IHBtLnNldElubGluZVN0eWxlKHN0eWxlLnN0cm9uZywgZmFsc2UpXG5jb21tYW5kcy50b2dnbGVTdHJvbmcgPSBwbSA9PiBwbS5zZXRJbmxpbmVTdHlsZShzdHlsZS5zdHJvbmcsIG51bGwpXG5cbmNvbW1hbmRzLnNldEVtID0gcG0gPT4gcG0uc2V0SW5saW5lU3R5bGUoc3R5bGUuZW0sIHRydWUpXG5jb21tYW5kcy51bnNldEVtID0gcG0gPT4gcG0uc2V0SW5saW5lU3R5bGUoc3R5bGUuZW0sIGZhbHNlKVxuY29tbWFuZHMudG9nZ2xlRW0gPSBwbSA9PiBwbS5zZXRJbmxpbmVTdHlsZShzdHlsZS5lbSwgbnVsbClcblxuY29tbWFuZHMuc2V0Q29kZSA9IHBtID0+IHBtLnNldElubGluZVN0eWxlKHN0eWxlLmNvZGUsIHRydWUpXG5jb21tYW5kcy51bnNldENvZGUgPSBwbSA9PiBwbS5zZXRJbmxpbmVTdHlsZShzdHlsZS5jb2RlLCBmYWxzZSlcbmNvbW1hbmRzLnRvZ2dsZUNvZGUgPSBwbSA9PiBwbS5zZXRJbmxpbmVTdHlsZShzdHlsZS5jb2RlLCBudWxsKVxuXG5mdW5jdGlvbiBibG9ja0JlZm9yZShwb3MpIHtcbiAgZm9yIChsZXQgaSA9IHBvcy5wYXRoLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgbGV0IG9mZnNldCA9IHBvcy5wYXRoW2ldIC0gMVxuICAgIGlmIChvZmZzZXQgPj0gMCkgcmV0dXJuIG5ldyBQb3MocG9zLnBhdGguc2xpY2UoMCwgaSksIG9mZnNldClcbiAgfVxufVxuXG5mdW5jdGlvbiBkZWxCbG9ja0JhY2t3YXJkKHBtLCB0ciwgcG9zKSB7XG4gIGlmIChwb3MuZGVwdGggPT0gMSkgeyAvLyBUb3AgbGV2ZWwgYmxvY2ssIGpvaW4gd2l0aCBibG9jayBhYm92ZVxuICAgIGxldCBpQmVmb3JlID0gUG9zLmJlZm9yZShwbS5kb2MsIG5ldyBQb3MoW10sIHBvcy5wYXRoWzBdKSlcbiAgICBsZXQgYkJlZm9yZSA9IGJsb2NrQmVmb3JlKHBvcylcbiAgICBpZiAoaUJlZm9yZSAmJiBiQmVmb3JlKSB7XG4gICAgICBpZiAoaUJlZm9yZS5jbXAoYkJlZm9yZSkgPiAwKSBiQmVmb3JlID0gbnVsbFxuICAgICAgZWxzZSBpQmVmb3JlID0gbnVsbFxuICAgIH1cbiAgICBpZiAoaUJlZm9yZSkge1xuICAgICAgdHIuZGVsZXRlKGlCZWZvcmUsIHBvcylcbiAgICAgIGxldCBqb2luYWJsZSA9IGpvaW5Qb2ludCh0ci5kb2MsIHRyLm1hcChwb3MpLnBvcywgMSlcbiAgICAgIGlmIChqb2luYWJsZSkgdHIuam9pbihqb2luYWJsZSlcbiAgICB9IGVsc2UgaWYgKGJCZWZvcmUpIHtcbiAgICAgIHRyLmRlbGV0ZShiQmVmb3JlLCBiQmVmb3JlLnNoaWZ0KDEpKVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBsZXQgbGFzdCA9IHBvcy5kZXB0aCAtIDFcbiAgICBsZXQgcGFyZW50ID0gcG0uZG9jLnBhdGgocG9zLnBhdGguc2xpY2UoMCwgbGFzdCkpXG4gICAgbGV0IG9mZnNldCA9IHBvcy5wYXRoW2xhc3RdXG4gICAgLy8gVG9wIG9mIGxpc3QgaXRlbSBiZWxvdyBvdGhlciBsaXN0IGl0ZW1cbiAgICAvLyBKb2luIHdpdGggdGhlIG9uZSBhYm92ZVxuICAgIGlmIChwYXJlbnQudHlwZSA9PSBub2RlVHlwZXMubGlzdF9pdGVtICYmXG4gICAgICAgIG9mZnNldCA9PSAwICYmIHBvcy5wYXRoW2xhc3QgLSAxXSA+IDApIHtcbiAgICAgIHRyLmpvaW4oam9pblBvaW50KHBtLmRvYywgcG9zKSlcbiAgICAvLyBBbnkgb3RoZXIgbmVzdGVkIGJsb2NrLCBsaWZ0IHVwXG4gICAgfSBlbHNlIHtcbiAgICAgIHRyLmxpZnQocG9zLCBwb3MpXG4gICAgICBsZXQgbmV4dCA9IHBvcy5kZXB0aCAtIDJcbiAgICAgIC8vIFNwbGl0IGxpc3QgaXRlbSB3aGVuIHdlIGJhY2tzcGFjZSBiYWNrIGludG8gaXRcbiAgICAgIGlmIChuZXh0ID4gMCAmJiBvZmZzZXQgPiAwICYmXG4gICAgICAgICAgcG0uZG9jLnBhdGgocG9zLnBhdGguc2xpY2UoMCwgbmV4dCkpLnR5cGUgPT0gbm9kZVR5cGVzLmxpc3RfaXRlbSlcbiAgICAgICAgdHIuc3BsaXQobmV3IFBvcyhwb3MucGF0aC5zbGljZSgwLCBuZXh0KSwgcG9zLnBhdGhbbmV4dF0gKyAxKSlcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gbW92ZUJhY2t3YXJkKHBhcmVudCwgb2Zmc2V0LCBieSkge1xuICBpZiAoYnkgPT0gXCJjaGFyXCIpIHJldHVybiBvZmZzZXQgLSAxXG4gIGlmIChieSA9PSBcIndvcmRcIikge1xuICAgIGxldCB7b2Zmc2V0OiBub2RlT2Zmc2V0LCBpbm5lck9mZnNldH0gPSBzcGFuQXRPckJlZm9yZShwYXJlbnQsIG9mZnNldClcbiAgICBsZXQgY2F0ID0gbnVsbCwgY291bnRlZCA9IDBcbiAgICBmb3IgKDsgbm9kZU9mZnNldCA+PSAwOyBub2RlT2Zmc2V0LS0sIGlubmVyT2Zmc2V0ID0gbnVsbCkge1xuICAgICAgbGV0IGNoaWxkID0gcGFyZW50LmNvbnRlbnRbbm9kZU9mZnNldF0sIHNpemUgPSBjaGlsZC5zaXplXG4gICAgICBpZiAoY2hpbGQudHlwZSAhPSBub2RlVHlwZXMudGV4dCkgcmV0dXJuIGNhdCA/IG9mZnNldCA6IG9mZnNldCAtIDFcblxuICAgICAgZm9yIChsZXQgaSA9IGlubmVyT2Zmc2V0ID09IG51bGwgPyBzaXplIDogaW5uZXJPZmZzZXQ7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgbGV0IG5leHRDaGFyQ2F0ID0gY2hhckNhdGVnb3J5KGNoaWxkLnRleHQuY2hhckF0KGkgLSAxKSlcbiAgICAgICAgaWYgKGNhdCA9PSBudWxsIHx8IGNvdW50ZWQgPT0gMSAmJiBjYXQgPT0gXCJzcGFjZVwiKSBjYXQgPSBuZXh0Q2hhckNhdFxuICAgICAgICBlbHNlIGlmIChjYXQgIT0gbmV4dENoYXJDYXQpIHJldHVybiBvZmZzZXRcbiAgICAgICAgb2Zmc2V0LS1cbiAgICAgICAgY291bnRlZCsrXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvZmZzZXRcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIG1vdGlvbiB1bml0OiBcIiArIGJ5KVxufVxuXG5mdW5jdGlvbiBkZWxCYWNrd2FyZChwbSwgYnkpIHtcbiAgcG0uc2Nyb2xsSW50b1ZpZXcoKVxuXG4gIGxldCB0ciA9IHBtLnRyLCBzZWwgPSBwbS5zZWxlY3Rpb24sIGZyb20gPSBzZWwuZnJvbVxuICBpZiAoIXNlbC5lbXB0eSlcbiAgICB0ci5kZWxldGUoZnJvbSwgc2VsLnRvKVxuICBlbHNlIGlmIChmcm9tLm9mZnNldCA9PSAwKVxuICAgIGRlbEJsb2NrQmFja3dhcmQocG0sIHRyLCBmcm9tKVxuICBlbHNlXG4gICAgdHIuZGVsZXRlKG5ldyBQb3MoZnJvbS5wYXRoLCBtb3ZlQmFja3dhcmQocG0uZG9jLnBhdGgoZnJvbS5wYXRoKSwgZnJvbS5vZmZzZXQsIGJ5KSksIGZyb20pXG4gIHJldHVybiBwbS5hcHBseSh0cilcbn1cblxuY29tbWFuZHMuZGVsQmFja3dhcmQgPSBwbSA9PiBkZWxCYWNrd2FyZChwbSwgXCJjaGFyXCIpXG5cbmNvbW1hbmRzLmRlbFdvcmRCYWNrd2FyZCA9IHBtID0+IGRlbEJhY2t3YXJkKHBtLCBcIndvcmRcIilcblxuZnVuY3Rpb24gYmxvY2tBZnRlcihkb2MsIHBvcykge1xuICBsZXQgcGF0aCA9IHBvcy5wYXRoXG4gIHdoaWxlIChwYXRoLmxlbmd0aCA+IDApIHtcbiAgICBsZXQgZW5kID0gcGF0aC5sZW5ndGggLSAxXG4gICAgbGV0IG9mZnNldCA9IHBhdGhbZW5kXSArIDFcbiAgICBwYXRoID0gcGF0aC5zbGljZSgwLCBlbmQpXG4gICAgbGV0IG5vZGUgPSBkb2MucGF0aChwYXRoKVxuICAgIGlmIChvZmZzZXQgPCBub2RlLmNvbnRlbnQubGVuZ3RoKVxuICAgICAgcmV0dXJuIG5ldyBQb3MocGF0aCwgb2Zmc2V0KVxuICB9XG59XG5cbmZ1bmN0aW9uIGRlbEJsb2NrRm9yd2FyZChwbSwgdHIsIHBvcykge1xuICBsZXQgbHN0ID0gcG9zLmRlcHRoIC0gMVxuICBsZXQgaUFmdGVyID0gUG9zLmFmdGVyKHBtLmRvYywgbmV3IFBvcyhwb3MucGF0aC5zbGljZSgwLCBsc3QpLCBwb3MucGF0aFtsc3RdICsgMSkpXG4gIGxldCBiQWZ0ZXIgPSBibG9ja0FmdGVyKHBtLmRvYywgcG9zKVxuICBpZiAoaUFmdGVyICYmIGJBZnRlcikge1xuICAgIGlmIChpQWZ0ZXIuY21wKGJBZnRlci5zaGlmdCgxKSkgPCAwKSBiQWZ0ZXIgPSBudWxsXG4gICAgZWxzZSBpQWZ0ZXIgPSBudWxsXG4gIH1cblxuICBpZiAoaUFmdGVyKSB7XG4gICAgdHIuZGVsZXRlKHBvcywgaUFmdGVyKVxuICAgIGxldCBqb2luYWJsZSA9IGpvaW5Qb2ludCh0ci5kb2MsIHRyLm1hcChwb3MpLnBvcywgMSlcbiAgICBpZiAoam9pbmFibGUpIHRyLmpvaW4oam9pbmFibGUpXG4gIH0gZWxzZSBpZiAoYkFmdGVyKSB7XG4gICAgdHIuZGVsZXRlKGJBZnRlciwgYkFmdGVyLnNoaWZ0KDEpKVxuICB9XG59XG5cbmZ1bmN0aW9uIG1vdmVGb3J3YXJkKHBhcmVudCwgb2Zmc2V0LCBieSkge1xuICBpZiAoYnkgPT0gXCJjaGFyXCIpIHJldHVybiBvZmZzZXQgKyAxXG4gIGlmIChieSA9PSBcIndvcmRcIikge1xuICAgIGxldCB7b2Zmc2V0OiBub2RlT2Zmc2V0LCBpbm5lck9mZnNldH0gPSBzcGFuQXRPckJlZm9yZShwYXJlbnQsIG9mZnNldClcbiAgICBsZXQgY2F0ID0gbnVsbCwgY291bnRlZCA9IDBcbiAgICBmb3IgKDsgbm9kZU9mZnNldCA8IHBhcmVudC5jb250ZW50Lmxlbmd0aDsgbm9kZU9mZnNldCsrLCBpbm5lck9mZnNldCA9IDApIHtcbiAgICAgIGxldCBjaGlsZCA9IHBhcmVudC5jb250ZW50W25vZGVPZmZzZXRdLCBzaXplID0gY2hpbGQuc2l6ZVxuICAgICAgaWYgKGNoaWxkLnR5cGUgIT0gbm9kZVR5cGVzLnRleHQpIHJldHVybiBjYXQgPyBvZmZzZXQgOiBvZmZzZXQgKyAxXG5cbiAgICAgIGZvciAobGV0IGkgPSBpbm5lck9mZnNldDsgaSA8IHNpemU7IGkrKykge1xuICAgICAgICBsZXQgbmV4dENoYXJDYXQgPSBjaGFyQ2F0ZWdvcnkoY2hpbGQudGV4dC5jaGFyQXQoaSkpXG4gICAgICAgIGlmIChjYXQgPT0gbnVsbCB8fCBjb3VudGVkID09IDEgJiYgY2F0ID09IFwic3BhY2VcIikgY2F0ID0gbmV4dENoYXJDYXRcbiAgICAgICAgZWxzZSBpZiAoY2F0ICE9IG5leHRDaGFyQ2F0KSByZXR1cm4gb2Zmc2V0XG4gICAgICAgIG9mZnNldCsrXG4gICAgICAgIGNvdW50ZWQrK1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2Zmc2V0XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBtb3Rpb24gdW5pdDogXCIgKyBieSlcbn1cblxuZnVuY3Rpb24gZGVsRm9yd2FyZChwbSwgYnkpIHtcbiAgcG0uc2Nyb2xsSW50b1ZpZXcoKVxuICBsZXQgdHIgPSBwbS50ciwgc2VsID0gcG0uc2VsZWN0aW9uLCBmcm9tID0gc2VsLmZyb21cbiAgaWYgKCFzZWwuZW1wdHkpIHtcbiAgICB0ci5kZWxldGUoZnJvbSwgc2VsLnRvKVxuICB9IGVsc2Uge1xuICAgIGxldCBwYXJlbnQgPSBwbS5kb2MucGF0aChmcm9tLnBhdGgpXG4gICAgaWYgKGZyb20ub2Zmc2V0ID09IHBhcmVudC5zaXplKVxuICAgICAgZGVsQmxvY2tGb3J3YXJkKHBtLCB0ciwgZnJvbSlcbiAgICBlbHNlXG4gICAgICB0ci5kZWxldGUoZnJvbSwgbmV3IFBvcyhmcm9tLnBhdGgsIG1vdmVGb3J3YXJkKHBhcmVudCwgZnJvbS5vZmZzZXQsIGJ5KSkpXG4gIH1cbiAgcmV0dXJuIHBtLmFwcGx5KHRyKVxufVxuXG5jb21tYW5kcy5kZWxGb3J3YXJkID0gcG0gPT4gZGVsRm9yd2FyZChwbSwgXCJjaGFyXCIpXG5cbmNvbW1hbmRzLmRlbFdvcmRGb3J3YXJkID0gcG0gPT4gZGVsRm9yd2FyZChwbSwgXCJ3b3JkXCIpXG5cbmZ1bmN0aW9uIHNjcm9sbEFuZChwbSwgdmFsdWUpIHtcbiAgcG0uc2Nyb2xsSW50b1ZpZXcoKVxuICByZXR1cm4gdmFsdWVcbn1cblxuY29tbWFuZHMudW5kbyA9IHBtID0+IHNjcm9sbEFuZChwbSwgcG0uaGlzdG9yeS51bmRvKCkpXG5jb21tYW5kcy5yZWRvID0gcG0gPT4gc2Nyb2xsQW5kKHBtLCBwbS5oaXN0b3J5LnJlZG8oKSlcblxuY29tbWFuZHMuam9pbiA9IHBtID0+IHtcbiAgbGV0IHBvaW50ID0gam9pblBvaW50KHBtLmRvYywgcG0uc2VsZWN0aW9uLmhlYWQpXG4gIGlmICghcG9pbnQpIHJldHVybiBmYWxzZVxuICByZXR1cm4gcG0uYXBwbHkocG0udHIuam9pbihwb2ludCkpXG59XG5cbmNvbW1hbmRzLmxpZnQgPSBwbSA9PiB7XG4gIGxldCBzZWwgPSBwbS5zZWxlY3Rpb25cbiAgbGV0IHJlc3VsdCA9IHBtLmFwcGx5KHBtLnRyLmxpZnQoc2VsLmZyb20sIHNlbC50bykpXG4gIGlmIChyZXN1bHQgIT09IGZhbHNlKSBwbS5zY3JvbGxJbnRvVmlldygpXG4gIHJldHVybiByZXN1bHRcbn1cblxuZnVuY3Rpb24gd3JhcChwbSwgdHlwZSkge1xuICBsZXQgc2VsID0gcG0uc2VsZWN0aW9uXG4gIHBtLnNjcm9sbEludG9WaWV3KClcbiAgcmV0dXJuIHBtLmFwcGx5KHBtLnRyLndyYXAoc2VsLmZyb20sIHNlbC50bywgbmV3IE5vZGUodHlwZSkpKVxufVxuXG5jb21tYW5kcy53cmFwQnVsbGV0TGlzdCA9IHBtID0+IHdyYXAocG0sIFwiYnVsbGV0X2xpc3RcIilcbmNvbW1hbmRzLndyYXBPcmRlcmVkTGlzdCA9IHBtID0+IHdyYXAocG0sIFwib3JkZXJlZF9saXN0XCIpXG5jb21tYW5kcy53cmFwQmxvY2txdW90ZSA9IHBtID0+IHdyYXAocG0sIFwiYmxvY2txdW90ZVwiKVxuXG5jb21tYW5kcy5lbmRCbG9jayA9IHBtID0+IHtcbiAgcG0uc2Nyb2xsSW50b1ZpZXcoKVxuICBsZXQgcG9zID0gcG0uc2VsZWN0aW9uLmZyb21cbiAgbGV0IHRyID0gY2xlYXJTZWwocG0pXG4gIGxldCBibG9jayA9IHBtLmRvYy5wYXRoKHBvcy5wYXRoKVxuICBpZiAocG9zLmRlcHRoID4gMSAmJiBibG9jay5jb250ZW50Lmxlbmd0aCA9PSAwICYmXG4gICAgICB0ci5saWZ0KHBvcykuc3RlcHMubGVuZ3RoKSB7XG4gICAgLy8gTGlmdFxuICB9IGVsc2UgaWYgKGJsb2NrLnR5cGUgPT0gbm9kZVR5cGVzLmNvZGVfYmxvY2sgJiYgcG9zLm9mZnNldCA8IGJsb2NrLnNpemUpIHtcbiAgICB0ci5pbnNlcnRUZXh0KHBvcywgXCJcXG5cIilcbiAgfSBlbHNlIHtcbiAgICBsZXQgZW5kID0gcG9zLmRlcHRoIC0gMVxuICAgIGxldCBpc0xpc3QgPSBlbmQgPiAwICYmIHBvcy5wYXRoW2VuZF0gPT0gMCAmJlxuICAgICAgICBwbS5kb2MucGF0aChwb3MucGF0aC5zbGljZSgwLCBlbmQpKS50eXBlID09IG5vZGVUeXBlcy5saXN0X2l0ZW1cbiAgICBsZXQgdHlwZSA9IHBvcy5vZmZzZXQgPT0gYmxvY2suc2l6ZSA/IG5ldyBOb2RlKFwicGFyYWdyYXBoXCIpIDogbnVsbFxuICAgIHRyLnNwbGl0KHBvcywgaXNMaXN0ID8gMiA6IDEsIHR5cGUpXG4gIH1cbiAgcmV0dXJuIHBtLmFwcGx5KHRyKVxufVxuXG5mdW5jdGlvbiBzZXRUeXBlKHBtLCB0eXBlLCBhdHRycykge1xuICBsZXQgc2VsID0gcG0uc2VsZWN0aW9uXG4gIHBtLnNjcm9sbEludG9WaWV3KClcbiAgcmV0dXJuIHBtLmFwcGx5KHBtLnRyLnNldEJsb2NrVHlwZShzZWwuZnJvbSwgc2VsLnRvLCBuZXcgTm9kZSh0eXBlLCBhdHRycykpKVxufVxuXG5jb21tYW5kcy5tYWtlSDEgPSBwbSA9PiBzZXRUeXBlKHBtLCBcImhlYWRpbmdcIiwge2xldmVsOiAxfSlcbmNvbW1hbmRzLm1ha2VIMiA9IHBtID0+IHNldFR5cGUocG0sIFwiaGVhZGluZ1wiLCB7bGV2ZWw6IDJ9KVxuY29tbWFuZHMubWFrZUgzID0gcG0gPT4gc2V0VHlwZShwbSwgXCJoZWFkaW5nXCIsIHtsZXZlbDogM30pXG5jb21tYW5kcy5tYWtlSDQgPSBwbSA9PiBzZXRUeXBlKHBtLCBcImhlYWRpbmdcIiwge2xldmVsOiA0fSlcbmNvbW1hbmRzLm1ha2VINSA9IHBtID0+IHNldFR5cGUocG0sIFwiaGVhZGluZ1wiLCB7bGV2ZWw6IDV9KVxuY29tbWFuZHMubWFrZUg2ID0gcG0gPT4gc2V0VHlwZShwbSwgXCJoZWFkaW5nXCIsIHtsZXZlbDogNn0pXG5cbmNvbW1hbmRzLm1ha2VQYXJhZ3JhcGggPSBwbSA9PiBzZXRUeXBlKHBtLCBcInBhcmFncmFwaFwiKVxuY29tbWFuZHMubWFrZUNvZGVCbG9jayA9IHBtID0+IHNldFR5cGUocG0sIFwiY29kZV9ibG9ja1wiKVxuXG5mdW5jdGlvbiBpbnNlcnRPcGFxdWVCbG9jayhwbSwgdHlwZSwgYXR0cnMpIHtcbiAgdHlwZSA9IG5vZGVUeXBlc1t0eXBlXVxuICBwbS5zY3JvbGxJbnRvVmlldygpXG4gIGxldCBwb3MgPSBwbS5zZWxlY3Rpb24uZnJvbVxuICBsZXQgdHIgPSBjbGVhclNlbChwbSlcbiAgbGV0IHBhcmVudCA9IHRyLmRvYy5wYXRoKHBvcy5wYXRoKVxuICBpZiAocGFyZW50LnR5cGUudHlwZSAhPSB0eXBlLnR5cGUpIHJldHVybiBmYWxzZVxuICBsZXQgb2ZmID0gMFxuICBpZiAocG9zLm9mZnNldCkge1xuICAgIHRyLnNwbGl0KHBvcylcbiAgICBvZmYgPSAxXG4gIH1cbiAgcmV0dXJuIHBtLmFwcGx5KHRyLmluc2VydChwb3Muc2hvcnRlbihudWxsLCBvZmYpLCBuZXcgTm9kZSh0eXBlLCBhdHRycykpKVxufVxuXG5jb21tYW5kcy5pbnNlcnRSdWxlID0gcG0gPT4gaW5zZXJ0T3BhcXVlQmxvY2socG0sIFwiaG9yaXpvbnRhbF9ydWxlXCIpXG4iLCJpbXBvcnQgaW5zZXJ0Q1NTIGZyb20gXCJpbnNlcnQtY3NzXCJcblxuaW5zZXJ0Q1NTKGBcblxuLlByb3NlTWlycm9yIHtcbiAgYm9yZGVyOiAxcHggc29saWQgc2lsdmVyO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG5cbi5Qcm9zZU1pcnJvci1jb250ZW50IHtcbiAgcGFkZGluZzogNHB4IDhweCA0cHggMTRweDtcbiAgd2hpdGUtc3BhY2U6IHByZS13cmFwO1xuICBsaW5lLWhlaWdodDogMS4yO1xufVxuXG4uUHJvc2VNaXJyb3ItY29udGVudCB1bC50aWdodCBwLCAuUHJvc2VNaXJyb3ItY29udGVudCBvbC50aWdodCBwIHtcbiAgbWFyZ2luOiAwO1xufVxuXG4uUHJvc2VNaXJyb3ItY29udGVudCB1bCwgLlByb3NlTWlycm9yLWNvbnRlbnQgb2wge1xuICBwYWRkaW5nLWxlZnQ6IDJlbTtcbn1cblxuLlByb3NlTWlycm9yLWNvbnRlbnQgYmxvY2txdW90ZSB7XG4gIHBhZGRpbmctbGVmdDogMWVtO1xuICBib3JkZXItbGVmdDogM3B4IHNvbGlkICNlZWU7XG4gIG1hcmdpbi1sZWZ0OiAwOyBtYXJnaW4tcmlnaHQ6IDA7XG59XG5cbi5Qcm9zZU1pcnJvci1jb250ZW50IHByZSB7XG4gIHdoaXRlLXNwYWNlOiBwcmUtd3JhcDtcbn1cblxuLlByb3NlTWlycm9yLWNvbnRlbnQgcDpmaXJzdC1jaGlsZCxcbi5Qcm9zZU1pcnJvci1jb250ZW50IGgxOmZpcnN0LWNoaWxkLFxuLlByb3NlTWlycm9yLWNvbnRlbnQgaDI6Zmlyc3QtY2hpbGQsXG4uUHJvc2VNaXJyb3ItY29udGVudCBoMzpmaXJzdC1jaGlsZCxcbi5Qcm9zZU1pcnJvci1jb250ZW50IGg0OmZpcnN0LWNoaWxkLFxuLlByb3NlTWlycm9yLWNvbnRlbnQgaDU6Zmlyc3QtY2hpbGQsXG4uUHJvc2VNaXJyb3ItY29udGVudCBoNjpmaXJzdC1jaGlsZCB7XG4gIG1hcmdpbi10b3A6IC4zZW07XG59XG5cbmApXG4iLCJpbXBvcnQge0tleW1hcH0gZnJvbSBcIi4va2V5c1wiXG5pbXBvcnQge2Jyb3dzZXJ9IGZyb20gXCIuLi9kb21cIlxuXG5jb25zdCBtb2QgPSBicm93c2VyLm1hYyA/IFwiQ21kLVwiIDogXCJDdHJsLVwiXG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0S2V5bWFwID0gbmV3IEtleW1hcCh7XG4gIFwiRW50ZXJcIjogXCJlbmRCbG9ja1wiLFxuICBbbW9kICsgXCJFbnRlclwiXTogXCJpbnNlcnRIYXJkQnJlYWtcIixcbiAgW1wiU2hpZnQtRW50ZXJcIl06IFwiaW5zZXJ0SGFyZEJyZWFrXCIsXG4gIFwiQmFja3NwYWNlXCI6IFwiZGVsQmFja3dhcmRcIixcbiAgXCJEZWxldGVcIjogXCJkZWxGb3J3YXJkXCIsXG4gIFttb2QgKyBcIkJcIl06IFwidG9nZ2xlU3Ryb25nXCIsXG4gIFttb2QgKyBcIklcIl06IFwidG9nZ2xlRW1cIixcbiAgW21vZCArIFwiYFwiXTogXCJ0b2dnbGVDb2RlXCIsXG4gIFttb2QgKyBcIkJhY2tzcGFjZVwiXTogXCJkZWxXb3JkQmFja3dhcmRcIixcbiAgW21vZCArIFwiRGVsZXRlXCJdOiBcImRlbFdvcmRGb3J3YXJkXCIsXG4gIFttb2QgKyBcIlpcIl06IFwidW5kb1wiLFxuICBbbW9kICsgXCJZXCJdOiBcInJlZG9cIixcbiAgW1wiU2hpZnQtXCIgKyBtb2QgKyBcIlpcIl06IFwicmVkb1wiLFxuICBcIkFsdC1VcFwiOiBcImpvaW5cIixcbiAgXCJBbHQtTGVmdFwiOiBcImxpZnRcIixcbiAgXCJBbHQtUmlnaHQgJyonXCI6IFwid3JhcEJ1bGxldExpc3RcIixcbiAgXCJBbHQtUmlnaHQgJzEnXCI6IFwid3JhcE9yZGVyZWRMaXN0XCIsXG4gIFwiQWx0LVJpZ2h0ICc+J1wiOiBcIndyYXBCbG9ja3F1b3RlXCIsXG4gIFttb2QgKyBcIkggJzEnXCJdOiBcIm1ha2VIMVwiLFxuICBbbW9kICsgXCJIICcyJ1wiXTogXCJtYWtlSDJcIixcbiAgW21vZCArIFwiSCAnMydcIl06IFwibWFrZUgzXCIsXG4gIFttb2QgKyBcIkggJzQnXCJdOiBcIm1ha2VINFwiLFxuICBbbW9kICsgXCJIICc1J1wiXTogXCJtYWtlSDVcIixcbiAgW21vZCArIFwiSCAnNidcIl06IFwibWFrZUg2XCIsXG4gIFttb2QgKyBcIlBcIl06IFwibWFrZVBhcmFncmFwaFwiLFxuICBbbW9kICsgXCJcXFxcXCJdOiBcIm1ha2VDb2RlQmxvY2tcIixcbiAgW21vZCArIFwiU3BhY2VcIl06IFwiaW5zZXJ0UnVsZVwiXG59KVxuXG5mdW5jdGlvbiBhZGQoa2V5LCB2YWwpIHsgZGVmYXVsdEtleW1hcC5hZGRCaW5kaW5nKGtleSwgdmFsKSB9XG5cbmlmIChicm93c2VyLm1hYykge1xuICBhZGQoXCJDdHJsLURcIiwgXCJkZWxGb3J3YXJkXCIpXG4gIGFkZChcIkN0cmwtSFwiLCBcImRlbEJhY2t3YXJkXCIpXG4gIGFkZChcIkN0cmwtQWx0LUJhY2tzcGFjZVwiLCBcImRlbFdvcmRGb3J3YXJkXCIpXG4gIGFkZChcIkFsdC1EXCIsIFwiZGVsV29yZEZvcndhcmRcIilcbiAgYWRkKFwiQWx0LURlbGV0ZVwiLCBcImRlbFdvcmRGb3J3YXJkXCIpXG4gIGFkZChcIkFsdC1CYWNrc3BhY2VcIiwgXCJkZWxXb3JkQmFja3dhcmRcIilcbn1cbiIsImltcG9ydCB7UG9zLCBmaW5kRGlmZlN0YXJ0LCBmaW5kRGlmZkVuZH0gZnJvbSBcIi4uL21vZGVsXCJcbmltcG9ydCB7ZnJvbURPTX0gZnJvbSBcIi4uL2NvbnZlcnQvZnJvbV9kb21cIlxuaW1wb3J0IHtzYW1lUGF0aERlcHRofSBmcm9tIFwiLi4vdHJhbnNmb3JtL3RyZWVcIlxuXG5pbXBvcnQge2ZpbmRCeVBhdGh9IGZyb20gXCIuL3NlbGVjdGlvblwiXG5cbmZ1bmN0aW9uIGlzQXRFbmQobm9kZSwgcG9zLCBkZXB0aCkge1xuICBmb3IgKGxldCBpID0gZGVwdGggfHwgMDsgaSA8IHBvcy5wYXRoLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IG4gPSBwb3MucGF0aFtkZXB0aF1cbiAgICBpZiAobiA8IG5vZGUuY29udGVudC5sZW5ndGggLSAxKSByZXR1cm4gZmFsc2VcbiAgICBub2RlID0gbm9kZS5jb250ZW50W25dXG4gIH1cbiAgcmV0dXJuIHBvcy5vZmZzZXQgPT0gbm9kZS5tYXhPZmZzZXRcbn1cbmZ1bmN0aW9uIGlzQXRTdGFydChwb3MsIGRlcHRoKSB7XG4gIGlmIChwb3Mub2Zmc2V0ID4gMCkgcmV0dXJuIGZhbHNlXG4gIGZvciAobGV0IGkgPSBkZXB0aCB8fCAwOyBpIDwgcG9zLnBhdGgubGVuZ3RoOyBpKyspXG4gICAgaWYgKHBvcy5wYXRoW2RlcHRoXSA+IDApIHJldHVybiBmYWxzZVxuICByZXR1cm4gdHJ1ZVxufVxuXG5mdW5jdGlvbiBwYXJzZU5lYXJTZWxlY3Rpb24ocG0pIHtcbiAgbGV0IGRvbSA9IHBtLmNvbnRlbnQsIG5vZGUgPSBwbS5kb2NcbiAgbGV0IGZyb20gPSBwbS5zZWxlY3Rpb24uZnJvbSwgdG8gPSBwbS5zZWxlY3Rpb24udG9cbiAgZm9yIChsZXQgZGVwdGggPSAwOzsgZGVwdGgrKykge1xuICAgIGxldCB0b05vZGUgPSBub2RlLmNvbnRlbnRbdG8ucGF0aFtkZXB0aF1dXG4gICAgbGV0IGZyb21TdGFydCA9IGlzQXRTdGFydChmcm9tLCBkZXB0aCArIDEpXG4gICAgbGV0IHRvRW5kID0gaXNBdEVuZCh0b05vZGUsIHRvLCBkZXB0aCArIDEpXG4gICAgaWYgKGZyb21TdGFydCB8fCB0b0VuZCB8fCBmcm9tLnBhdGhbZGVwdGhdICE9IHRvLnBhdGhbZGVwdGhdIHx8IHRvTm9kZS50eXBlLmJsb2NrKSB7XG4gICAgICBsZXQgc3RhcnRPZmZzZXQgPSBkZXB0aCA9PSBmcm9tLmRlcHRoID8gZnJvbS5vZmZzZXQgOiBmcm9tLnBhdGhbZGVwdGhdXG4gICAgICBpZiAoZnJvbVN0YXJ0ICYmIHN0YXJ0T2Zmc2V0ID4gMCkgc3RhcnRPZmZzZXQtLVxuICAgICAgbGV0IGVuZE9mZnNldCA9IGRlcHRoID09IHRvLmRlcHRoID8gdG8ub2Zmc2V0IDogdG8ucGF0aFtkZXB0aF0gKyAxXG4gICAgICBpZiAodG9FbmQgJiYgZW5kT2Zmc2V0IDwgbm9kZS5jb250ZW50Lmxlbmd0aCAtIDEpIGVuZE9mZnNldCsrXG4gICAgICBsZXQgcGFyc2VkID0gZnJvbURPTShkb20sIHt0b3BOb2RlOiBub2RlLmNvcHkoKSwgZnJvbTogc3RhcnRPZmZzZXQsIHRvOiBkb20uY2hpbGROb2Rlcy5sZW5ndGggLSAobm9kZS5jb250ZW50Lmxlbmd0aCAtIGVuZE9mZnNldCl9KVxuICAgICAgcGFyc2VkLmNvbnRlbnQgPSBub2RlLmNvbnRlbnQuc2xpY2UoMCwgc3RhcnRPZmZzZXQpLmNvbmNhdChwYXJzZWQuY29udGVudCkuY29uY2F0KG5vZGUuY29udGVudC5zbGljZShlbmRPZmZzZXQpKVxuICAgICAgZm9yIChsZXQgaSA9IGRlcHRoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgbGV0IHdyYXAgPSBwbS5kb2MucGF0aChmcm9tLnBhdGguc2xpY2UoMCwgaSkpXG4gICAgICAgIGxldCBjb3B5ID0gd3JhcC5jb3B5KHdyYXAuY29udGVudC5zbGljZSgpKVxuICAgICAgICBjb3B5LmNvbnRlbnRbZnJvbS5wYXRoW2ldXSA9IHBhcnNlZFxuICAgICAgICBwYXJzZWQgPSBjb3B5XG4gICAgICB9XG4gICAgICByZXR1cm4gcGFyc2VkXG4gICAgfVxuICAgIG5vZGUgPSB0b05vZGVcbiAgICBkb20gPSBmaW5kQnlQYXRoKGRvbSwgZnJvbS5wYXRoW2RlcHRoXSwgZmFsc2UpXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5RE9NQ2hhbmdlKHBtKSB7XG4gIGxldCB1cGRhdGVkID0gcGFyc2VOZWFyU2VsZWN0aW9uKHBtKVxuICBsZXQgY2hhbmdlU3RhcnQgPSBmaW5kRGlmZlN0YXJ0KHBtLmRvYywgdXBkYXRlZClcbiAgaWYgKGNoYW5nZVN0YXJ0KSB7XG4gICAgbGV0IGNoYW5nZUVuZCA9IGZpbmREaWZmRW5kQ29uc3RyYWluZWQocG0uZG9jLCB1cGRhdGVkLCBjaGFuZ2VTdGFydClcbiAgICBwbS5hcHBseShwbS50ci5yZXBsYWNlKGNoYW5nZVN0YXJ0LmEsIGNoYW5nZUVuZC5hLCB1cGRhdGVkLCBjaGFuZ2VTdGFydC5iLCBjaGFuZ2VFbmQuYikpXG4gICAgcG0ub3BlcmF0aW9uLmZ1bGxSZWRyYXcgPSB0cnVlXG4gICAgcmV0dXJuIHRydWVcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5mdW5jdGlvbiBvZmZzZXRCeShmaXJzdCwgc2Vjb25kLCBwb3MpIHtcbiAgbGV0IHNhbWUgPSBzYW1lUGF0aERlcHRoKGZpcnN0LCBzZWNvbmQpXG4gIGxldCBmaXJzdEVuZCA9IHNhbWUgPT0gZmlyc3QuZGVwdGgsIHNlY29uZEVuZCA9IHNhbWUgPT0gc2Vjb25kLmRlcHRoXG4gIGxldCBvZmYgPSAoc2Vjb25kRW5kID8gc2Vjb25kLm9mZnNldCA6IHNlY29uZC5wYXRoW3NhbWVdKSAtIChmaXJzdEVuZCA/IGZpcnN0Lm9mZnNldCA6IGZpcnN0LnBhdGhbc2FtZV0pXG4gIGxldCBzaG9ydGVyID0gZmlyc3RFbmQgPyBwb3Muc2hpZnQob2ZmKSA6IHBvcy5zaG9ydGVuKHNhbWUsIG9mZilcbiAgaWYgKHNlY29uZEVuZCkgcmV0dXJuIHNob3J0ZXJcbiAgZWxzZSByZXR1cm4gc2hvcnRlci5leHRlbmQobmV3IFBvcyhzZWNvbmQucGF0aC5zbGljZShzYW1lKSwgc2Vjb25kLm9mZnNldCkpXG59XG5cbmZ1bmN0aW9uIGZpbmREaWZmRW5kQ29uc3RyYWluZWQoYSwgYiwgc3RhcnQpIHtcbiAgbGV0IGVuZCA9IGZpbmREaWZmRW5kKGEsIGIpXG4gIGlmICghZW5kKSByZXR1cm4gZW5kXG4gIGlmIChlbmQuYS5jbXAoc3RhcnQuYSkgPCAwKSByZXR1cm4ge2E6IHN0YXJ0LmEsIGI6IG9mZnNldEJ5KGVuZC5hLCBzdGFydC5hLCBlbmQuYil9XG4gIGlmIChlbmQuYi5jbXAoc3RhcnQuYikgPCAwKSByZXR1cm4ge2E6IG9mZnNldEJ5KGVuZC5iLCBzdGFydC5iLCBlbmQuYSksIGI6IHN0YXJ0LmJ9XG4gIHJldHVybiBlbmRcbn1cblxuLy8gVGV4dC1vbmx5IHF1ZXJpZXMgZm9yIGNvbXBvc2l0aW9uIGV2ZW50c1xuXG5leHBvcnQgZnVuY3Rpb24gdGV4dENvbnRleHQoZGF0YSkge1xuICBsZXQgcmFuZ2UgPSBnZXRTZWxlY3Rpb24oKS5nZXRSYW5nZUF0KDApXG4gIGxldCBzdGFydCA9IHJhbmdlLnN0YXJ0Q29udGFpbmVyLCBlbmQgPSByYW5nZS5lbmRDb250YWluZXJcbiAgaWYgKHN0YXJ0ID09IGVuZCAmJiBzdGFydC5ub2RlVHlwZSA9PSAzKSB7XG4gICAgbGV0IHZhbHVlID0gc3RhcnQubm9kZVZhbHVlLCBsZWFkID0gcmFuZ2Uuc3RhcnRPZmZzZXQsIGVuZCA9IHJhbmdlLmVuZE9mZnNldFxuICAgIGlmIChkYXRhICYmIGVuZCA+PSBkYXRhLmxlbmd0aCAmJiB2YWx1ZS5zbGljZShlbmQgLSBkYXRhLmxlbmd0aCwgZW5kKSA9PSBkYXRhKVxuICAgICAgbGVhZCA9IGVuZCAtIGRhdGEubGVuZ3RoXG4gICAgcmV0dXJuIHtpbnNpZGU6IHN0YXJ0LCBsZWFkLCB0cmFpbDogdmFsdWUubGVuZ3RoIC0gZW5kfVxuICB9XG5cbiAgbGV0IHNpemVCZWZvcmUgPSBudWxsLCBzaXplQWZ0ZXIgPSBudWxsXG4gIGxldCBiZWZvcmUgPSBzdGFydC5jaGlsZE5vZGVzW3JhbmdlLnN0YXJ0T2Zmc2V0IC0gMV0gfHwgbm9kZUJlZm9yZShzdGFydClcbiAgd2hpbGUgKGJlZm9yZS5sYXN0Q2hpbGQpIGJlZm9yZSA9IGJlZm9yZS5sYXN0Q2hpbGRcbiAgaWYgKGJlZm9yZSAmJiBiZWZvcmUubm9kZVR5cGUgPT0gMykge1xuICAgIGxldCB2YWx1ZSA9IGJlZm9yZS5ub2RlVmFsdWVcbiAgICBzaXplQmVmb3JlID0gdmFsdWUubGVuZ3RoXG4gICAgaWYgKGRhdGEgJiYgdmFsdWUuc2xpY2UodmFsdWUubGVuZ3RoIC0gZGF0YS5sZW5ndGgpID09IGRhdGEpXG4gICAgICBzaXplQmVmb3JlIC09IGRhdGEubGVuZ3RoXG4gIH1cbiAgbGV0IGFmdGVyID0gZW5kLmNoaWxkTm9kZXNbcmFuZ2UuZW5kT2Zmc2V0XSB8fCBub2RlQWZ0ZXIoZW5kKVxuICB3aGlsZSAoYWZ0ZXIuZmlyc3RDaGlsZCkgYWZ0ZXIgPSBhZnRlci5maXJzdENoaWxkXG4gIGlmIChhZnRlciAmJiBhZnRlci5ub2RlVHlwZSA9PSAzKSBzaXplQWZ0ZXIgPSBhZnRlci5ub2RlVmFsdWUubGVuZ3RoXG5cbiAgcmV0dXJuIHtiZWZvcmU6IGJlZm9yZSwgc2l6ZUJlZm9yZSxcbiAgICAgICAgICBhZnRlcjogYWZ0ZXIsIHNpemVBZnRlcn1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRleHRJbkNvbnRleHQoY29udGV4dCwgZGVmbHQpIHtcbiAgaWYgKGNvbnRleHQuaW5zaWRlKSB7XG4gICAgbGV0IHZhbCA9IGNvbnRleHQuaW5zaWRlLm5vZGVWYWx1ZVxuICAgIHJldHVybiB2YWwuc2xpY2UoY29udGV4dC5sZWFkLCB2YWwubGVuZ3RoIC0gY29udGV4dC50cmFpbClcbiAgfSBlbHNlIHtcbiAgICB2YXIgYmVmb3JlID0gY29udGV4dC5iZWZvcmUsIGFmdGVyID0gY29udGV4dC5hZnRlciwgdmFsID0gXCJcIlxuICAgIGlmICghYmVmb3JlKSByZXR1cm4gZGVmbHRcbiAgICBpZiAoYmVmb3JlLm5vZGVUeXBlID09IDMpXG4gICAgICB2YWwgPSBiZWZvcmUubm9kZVZhbHVlLnNsaWNlKGNvbnRleHQuc2l6ZUJlZm9yZSlcbiAgICB2YXIgc2NhbiA9IHNjYW5UZXh0KGJlZm9yZSwgYWZ0ZXIpXG4gICAgaWYgKHNjYW4gPT0gbnVsbCkgcmV0dXJuIGRlZmx0XG4gICAgdmFsICs9IHNjYW5cbiAgICBpZiAoYWZ0ZXIgJiYgYWZ0ZXIubm9kZVR5cGUgPT0gMykge1xuICAgICAgbGV0IHZhbEFmdGVyID0gYWZ0ZXIubm9kZVZhbHVlXG4gICAgICB2YWwgKz0gdmFsQWZ0ZXIuc2xpY2UoMCwgdmFsQWZ0ZXIubGVuZ3RoIC0gY29udGV4dC5zaXplQWZ0ZXIpXG4gICAgfVxuICAgIHJldHVybiB2YWxcbiAgfVxufVxuXG5mdW5jdGlvbiBub2RlQWZ0ZXIobm9kZSkge1xuICBmb3IgKDs7KSB7XG4gICAgbGV0IG5leHQgPSBub2RlLm5leHRTaWJsaW5nXG4gICAgaWYgKG5leHQpIHtcbiAgICAgIHdoaWxlIChuZXh0LmZpcnN0Q2hpbGQpIG5leHQgPSBuZXh0LmZpcnN0Q2hpbGRcbiAgICAgIHJldHVybiBuZXh0XG4gICAgfVxuICAgIGlmICghKG5vZGUgPSBub2RlLnBhcmVudEVsZW1lbnQpKSByZXR1cm4gbnVsbFxuICB9XG59XG5cbmZ1bmN0aW9uIG5vZGVCZWZvcmUobm9kZSkge1xuICBmb3IgKDs7KSB7XG4gICAgbGV0IHByZXYgPSBub2RlLnByZXZpb3VzU2libGluZ1xuICAgIGlmIChwcmV2KSB7XG4gICAgICB3aGlsZSAocHJldi5sYXN0Q2hpbGQpIHByZXYgPSBwcmV2Lmxhc3RDaGlsZFxuICAgICAgcmV0dXJuIHByZXZcbiAgICB9XG4gICAgaWYgKCEobm9kZSA9IG5vZGUucGFyZW50RWxlbWVudCkpIHJldHVybiBudWxsXG4gIH1cbn1cblxuZnVuY3Rpb24gc2NhblRleHQoc3RhcnQsIGVuZCkge1xuICBsZXQgdGV4dCA9IFwiXCIsIGN1ciA9IHN0YXJ0XG4gIGZvciAoOzspIHtcbiAgICBpZiAoY3VyID09IGVuZCkgcmV0dXJuIHRleHRcbiAgICBpZiAoIWN1cikgcmV0dXJuIG51bGxcbiAgICBpZiAoY3VyLm5vZGVUeXBlID09IDMpIHRleHQgKz0gY3VyLm5vZGVWYWx1ZVxuICAgIGN1ciA9IGN1ci5maXJzdENoaWxkIHx8IG5vZGVBZnRlcihjdXIpXG4gIH1cbn1cbiIsImltcG9ydCB7UG9zLCBub2RlVHlwZXN9IGZyb20gXCIuLi9tb2RlbFwiXG5pbXBvcnQge3RvRE9NLCByZW5kZXJOb2RlVG9ET019IGZyb20gXCIuLi9jb252ZXJ0L3RvX2RvbVwiXG5cbmltcG9ydCB7ZWx0fSBmcm9tIFwiLi4vZG9tXCJcblxuY29uc3Qgbm9uRWRpdGFibGUgPSB7aHRtbF9ibG9jazogdHJ1ZSwgaHRtbF90YWc6IHRydWUsIGhvcml6b250YWxfcnVsZTogdHJ1ZX1cblxuZnVuY3Rpb24gb3B0aW9ucyhwYXRoLCByYW5nZXMpIHtcbiAgcmV0dXJuIHtcbiAgICBvblJlbmRlcihub2RlLCBkb20sIG9mZnNldCkge1xuICAgICAgaWYgKG5vZGUudHlwZS50eXBlICE9IFwic3BhblwiICYmIG9mZnNldCAhPSBudWxsKVxuICAgICAgICBkb20uc2V0QXR0cmlidXRlKFwicG0tcGF0aFwiLCBvZmZzZXQpXG4gICAgICBpZiAobm9uRWRpdGFibGUuaGFzT3duUHJvcGVydHkobm9kZS50eXBlLm5hbWUpKVxuICAgICAgICBkb20uY29udGVudEVkaXRhYmxlID0gZmFsc2VcbiAgICAgIHJldHVybiBkb21cbiAgICB9LFxuICAgIHJlbmRlcklubGluZUZsYXQobm9kZSwgZG9tLCBvZmZzZXQpIHtcbiAgICAgIHJhbmdlcy5hZHZhbmNlVG8obmV3IFBvcyhwYXRoLCBvZmZzZXQpKVxuICAgICAgbGV0IGVuZCA9IG5ldyBQb3MocGF0aCwgb2Zmc2V0ICsgbm9kZS5zaXplKVxuICAgICAgbGV0IG5leHRDdXQgPSByYW5nZXMubmV4dENoYW5nZUJlZm9yZShlbmQpXG5cbiAgICAgIGxldCBpbm5lciA9IGRvbSwgd3JhcHBlZFxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLnN0eWxlcy5sZW5ndGg7IGkrKykgaW5uZXIgPSBpbm5lci5maXJzdENoaWxkXG5cbiAgICAgIGlmIChkb20ubm9kZVR5cGUgIT0gMSkge1xuICAgICAgICBkb20gPSBlbHQoXCJzcGFuXCIsIG51bGwsIGRvbSlcbiAgICAgICAgaWYgKCFuZXh0Q3V0KSB3cmFwcGVkID0gZG9tXG4gICAgICB9XG4gICAgICBpZiAoIXdyYXBwZWQgJiYgKG5leHRDdXQgfHwgcmFuZ2VzLmN1cnJlbnQubGVuZ3RoKSkge1xuICAgICAgICB3cmFwcGVkID0gaW5uZXIgPT0gZG9tID8gKGRvbSA9IGVsdChcInNwYW5cIiwgbnVsbCwgaW5uZXIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogaW5uZXIucGFyZW50Tm9kZS5hcHBlbmRDaGlsZChlbHQoXCJzcGFuXCIsIG51bGwsIGlubmVyKSlcbiAgICAgIH1cblxuICAgICAgZG9tLnNldEF0dHJpYnV0ZShcInBtLXNwYW5cIiwgb2Zmc2V0ICsgXCItXCIgKyBlbmQub2Zmc2V0KVxuICAgICAgaWYgKG5vZGUudHlwZSAhPSBub2RlVHlwZXMudGV4dClcbiAgICAgICAgZG9tLnNldEF0dHJpYnV0ZShcInBtLXNwYW4tYXRvbVwiLCBcInRydWVcIilcblxuICAgICAgbGV0IGlubGluZU9mZnNldCA9IDBcbiAgICAgIHdoaWxlIChuZXh0Q3V0KSB7XG4gICAgICAgIGxldCBzaXplID0gbmV4dEN1dCAtIG9mZnNldFxuICAgICAgICBsZXQgc3BsaXQgPSBzcGxpdFNwYW4od3JhcHBlZCwgc2l6ZSlcbiAgICAgICAgaWYgKHJhbmdlcy5jdXJyZW50Lmxlbmd0aClcbiAgICAgICAgICBzcGxpdC5jbGFzc05hbWUgPSByYW5nZXMuY3VycmVudC5qb2luKFwiIFwiKVxuICAgICAgICBzcGxpdC5zZXRBdHRyaWJ1dGUoXCJwbS1zcGFuLW9mZnNldFwiLCBpbmxpbmVPZmZzZXQpXG4gICAgICAgIGlubGluZU9mZnNldCArPSBzaXplXG4gICAgICAgIG9mZnNldCArPSBzaXplXG4gICAgICAgIHJhbmdlcy5hZHZhbmNlVG8obmV3IFBvcyhwYXRoLCBvZmZzZXQpKVxuICAgICAgICBpZiAoIShuZXh0Q3V0ID0gcmFuZ2VzLm5leHRDaGFuZ2VCZWZvcmUoZW5kKSkpXG4gICAgICAgICAgd3JhcHBlZC5zZXRBdHRyaWJ1dGUoXCJwbS1zcGFuLW9mZnNldFwiLCBpbmxpbmVPZmZzZXQpXG4gICAgICB9XG5cbiAgICAgIGlmIChyYW5nZXMuY3VycmVudC5sZW5ndGgpXG4gICAgICAgIHdyYXBwZWQuY2xhc3NOYW1lID0gcmFuZ2VzLmN1cnJlbnQuam9pbihcIiBcIilcbiAgICAgIHJldHVybiBkb21cbiAgICB9LFxuICAgIGRvY3VtZW50OiBkb2N1bWVudCxcbiAgICBwYXRoOiBwYXRoXG4gIH1cbn1cblxuZnVuY3Rpb24gc3BsaXRTcGFuKHNwYW4sIGF0KSB7XG4gIGxldCB0ZXh0Tm9kZSA9IHNwYW4uZmlyc3RDaGlsZCwgdGV4dCA9IHRleHROb2RlLm5vZGVWYWx1ZVxuICBsZXQgbmV3Tm9kZSA9IHNwYW4ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZWx0KFwic3BhblwiLCBudWxsLCB0ZXh0LnNsaWNlKDAsIGF0KSksIHNwYW4pXG4gIHRleHROb2RlLm5vZGVWYWx1ZSA9IHRleHQuc2xpY2UoYXQpXG4gIHJldHVybiBuZXdOb2RlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkcmF3KHBtLCBkb2MpIHtcbiAgcG0uY29udGVudC50ZXh0Q29udGVudCA9IFwiXCJcbiAgcG0uY29udGVudC5hcHBlbmRDaGlsZCh0b0RPTShkb2MsIG9wdGlvbnMoW10sIHBtLnJhbmdlcy5hY3RpdmVSYW5nZVRyYWNrZXIoKSkpKVxufVxuXG5mdW5jdGlvbiBkZWxldGVOZXh0Tm9kZXMocGFyZW50LCBhdCwgYW1vdW50KSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYW1vdW50OyBpKyspIHtcbiAgICBsZXQgcHJldiA9IGF0XG4gICAgYXQgPSBhdC5uZXh0U2libGluZ1xuICAgIHBhcmVudC5yZW1vdmVDaGlsZChwcmV2KVxuICB9XG4gIHJldHVybiBhdFxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVkcmF3KHBtLCBkaXJ0eSwgZG9jLCBwcmV2KSB7XG4gIGxldCByYW5nZXMgPSBwbS5yYW5nZXMuYWN0aXZlUmFuZ2VUcmFja2VyKClcbiAgbGV0IHBhdGggPSBbXVxuXG4gIGZ1bmN0aW9uIHNjYW4oZG9tLCBub2RlLCBwcmV2KSB7XG4gICAgbGV0IHN0YXR1cyA9IFtdLCBpblByZXYgPSBbXSwgaW5Ob2RlID0gW11cbiAgICBmb3IgKGxldCBpID0gMCwgaiA9IDA7IGkgPCBwcmV2LmNvbnRlbnQubGVuZ3RoICYmIGogPCBub2RlLmNvbnRlbnQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBjdXIgPSBwcmV2LmNvbnRlbnRbaV0sIGRpcnR5U3RhdHVzID0gZGlydHkuZ2V0KGN1cilcbiAgICAgIHN0YXR1cy5wdXNoKGRpcnR5U3RhdHVzKVxuICAgICAgbGV0IG1hdGNoaW5nID0gZGlydHlTdGF0dXMgPyAtMSA6IG5vZGUuY29udGVudC5pbmRleE9mKGN1ciwgailcbiAgICAgIGlmIChtYXRjaGluZyA+IC0xKSB7XG4gICAgICAgIGluTm9kZVtpXSA9IG1hdGNoaW5nXG4gICAgICAgIGluUHJldlttYXRjaGluZ10gPSBpXG4gICAgICAgIGogPSBtYXRjaGluZyArIDFcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobm9kZS50eXBlLmNvbnRhaW5zID09IFwic3BhblwiKSB7XG4gICAgICBsZXQgbmVlZHNCUiA9IG5vZGUuY29udGVudC5sZW5ndGggPT0gMCB8fFxuICAgICAgICAgIG5vZGUuY29udGVudFtub2RlLmNvbnRlbnQubGVuZ3RoIC0gMV0udHlwZSA9PSBub2RlVHlwZXMuaGFyZF9icmVha1xuICAgICAgbGV0IGxhc3QgPSBkb20ubGFzdENoaWxkLCBoYXNCUiA9IGxhc3QgJiYgbGFzdC5ub2RlVHlwZSA9PSAxICYmIGxhc3QuaGFzQXR0cmlidXRlKFwicG0tZm9yY2UtYnJcIilcbiAgICAgIGlmIChuZWVkc0JSICYmICFoYXNCUilcbiAgICAgICAgZG9tLmFwcGVuZENoaWxkKGVsdChcImJyXCIsIHtcInBtLWZvcmNlLWJyXCI6IFwidHJ1ZVwifSkpXG4gICAgICBlbHNlIGlmICghbmVlZHNCUiAmJiBoYXNCUilcbiAgICAgICAgZG9tLnJlbW92ZUNoaWxkKGxhc3QpXG4gICAgfVxuXG4gICAgbGV0IGRvbVBvcyA9IGRvbS5maXJzdENoaWxkLCBqID0gMFxuICAgIGxldCBibG9jayA9IG5vZGUudHlwZS5ibG9ja1xuICAgIGZvciAobGV0IGkgPSAwLCBvZmZzZXQgPSAwOyBpIDwgbm9kZS5jb250ZW50Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgY2hpbGQgPSBub2RlLmNvbnRlbnRbaV1cbiAgICAgIGlmICghYmxvY2spIHBhdGgucHVzaChpKVxuICAgICAgbGV0IGZvdW5kID0gaW5QcmV2W2ldXG4gICAgICBsZXQgbm9kZUxlZnQgPSB0cnVlXG4gICAgICBpZiAoZm91bmQgPiAtMSkge1xuICAgICAgICBkb21Qb3MgPSBkZWxldGVOZXh0Tm9kZXMoZG9tLCBkb21Qb3MsIGZvdW5kIC0gailcbiAgICAgICAgaiA9IGZvdW5kXG4gICAgICB9IGVsc2UgaWYgKCFibG9jayAmJiBqIDwgcHJldi5jb250ZW50Lmxlbmd0aCAmJiBpbk5vZGVbal0gPT0gbnVsbCAmJlxuICAgICAgICAgICAgICAgICBzdGF0dXNbal0gIT0gMiAmJiBjaGlsZC5zYW1lTWFya3VwKHByZXYuY29udGVudFtqXSkpIHtcbiAgICAgICAgc2Nhbihkb21Qb3MsIGNoaWxkLCBwcmV2LmNvbnRlbnRbal0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb20uaW5zZXJ0QmVmb3JlKHJlbmRlck5vZGVUb0RPTShjaGlsZCwgb3B0aW9ucyhwYXRoLCByYW5nZXMpLCBibG9jayA/IG9mZnNldCA6IGkpLCBkb21Qb3MpXG4gICAgICAgIG5vZGVMZWZ0ID0gZmFsc2VcbiAgICAgIH1cbiAgICAgIGlmIChub2RlTGVmdCkge1xuICAgICAgICBpZiAoYmxvY2spXG4gICAgICAgICAgZG9tUG9zLnNldEF0dHJpYnV0ZShcInBtLXNwYW5cIiwgb2Zmc2V0ICsgXCItXCIgKyAob2Zmc2V0ICsgY2hpbGQuc2l6ZSkpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBkb21Qb3Muc2V0QXR0cmlidXRlKFwicG0tcGF0aFwiLCBpKVxuICAgICAgICBkb21Qb3MgPSBkb21Qb3MubmV4dFNpYmxpbmdcbiAgICAgICAgaisrXG4gICAgICB9XG4gICAgICBpZiAoYmxvY2spIG9mZnNldCArPSBjaGlsZC5zaXplXG4gICAgICBlbHNlIHBhdGgucG9wKClcbiAgICB9XG4gICAgZGVsZXRlTmV4dE5vZGVzKGRvbSwgZG9tUG9zLCBwcmV2LmNvbnRlbnQubGVuZ3RoIC0gailcbiAgfVxuICBzY2FuKHBtLmNvbnRlbnQsIGRvYywgcHJldilcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBhZGRFdmVudExpc3RlbmVyKGVtaXR0ZXIsIHR5cGUsIGYpIHtcbiAgbGV0IG1hcCA9IGVtaXR0ZXIuX2hhbmRsZXJzIHx8IChlbWl0dGVyLl9oYW5kbGVycyA9IHt9KVxuICBsZXQgYXJyID0gbWFwW3R5cGVdIHx8IChtYXBbdHlwZV0gPSBbXSlcbiAgYXJyLnB1c2goZilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUV2ZW50TGlzdGVuZXIoZW1pdHRlciwgdHlwZSwgZikge1xuICBsZXQgYXJyID0gZW1pdHRlci5faGFuZGxlcnMgJiYgZW1pdHRlci5faGFuZGxlcnNbdHlwZV1cbiAgaWYgKGFycikgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyArK2kpXG4gICAgaWYgKGFycltpXSA9PSBmKSB7IGFyci5zcGxpY2UoaSwgMSk7IGJyZWFrIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNpZ25hbChlbWl0dGVyLCB0eXBlLCAuLi52YWx1ZXMpIHtcbiAgbGV0IGFyciA9IGVtaXR0ZXIuX2hhbmRsZXJzICYmIGVtaXR0ZXIuX2hhbmRsZXJzW3R5cGVdXG4gIGlmIChhcnIpIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgKytpKVxuICAgIGFycltpXSguLi52YWx1ZXMpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNIYW5kbGVyKGVtaXR0ZXIsIHR5cGUpIHtcbiAgbGV0IGFyciA9IGVtaXR0ZXIuX2hhbmRsZXJzICYmIGVtaXR0ZXIuX2hhbmRsZXJzW3R5cGVdXG4gIHJldHVybiBhcnIgJiYgYXJyLmxlbmd0aCA+IDBcbn1cblxuLy8gQWRkIGV2ZW50LXJlbGF0ZWQgbWV0aG9kcyB0byBhIGNvbnN0cnVjdG9yJ3MgcHJvdG90eXBlLCB0byBtYWtlXG4vLyByZWdpc3RlcmluZyBldmVudHMgb24gc3VjaCBvYmplY3RzIG1vcmUgY29udmVuaWVudC5cbmV4cG9ydCBmdW5jdGlvbiBldmVudE1peGluKGN0b3IpIHtcbiAgbGV0IHByb3RvID0gY3Rvci5wcm90b3R5cGVcbiAgcHJvdG8ub24gPSBwcm90by5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgZikgeyBhZGRFdmVudExpc3RlbmVyKHRoaXMsIHR5cGUsIGYpIH1cbiAgcHJvdG8ub2ZmID0gcHJvdG8ucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGYpIHsgcmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLCB0eXBlLCBmKSB9XG4gIHByb3RvLnNpZ25hbCA9IGZ1bmN0aW9uKHR5cGUsIC4uLnZhbHVlcykgeyBzaWduYWwodGhpcywgdHlwZSwgLi4udmFsdWVzKSB9XG59XG4iLCJpbXBvcnQge1Bvc30gZnJvbSBcIi4uL21vZGVsXCJcbmltcG9ydCB7VHJhbnNmb3JtLCBTdGVwLCBpbnZlcnRTdGVwLCBtYXBTdGVwLCBSZW1hcHBpbmcsIGFwcGx5U3RlcH0gZnJvbSBcIi4uL3RyYW5zZm9ybVwiXG5cbmNsYXNzIEludmVydGVkU3RlcCB7XG4gIGNvbnN0cnVjdG9yKHN0ZXAsIHZlcnNpb24sIGlkKSB7XG4gICAgdGhpcy5zdGVwID0gc3RlcFxuICAgIHRoaXMudmVyc2lvbiA9IHZlcnNpb25cbiAgICB0aGlzLmlkID0gaWRcbiAgfVxufVxuXG5jbGFzcyBCcmFuY2hSZW1hcHBpbmcge1xuICBjb25zdHJ1Y3RvcihicmFuY2gpIHtcbiAgICB0aGlzLmJyYW5jaCA9IGJyYW5jaFxuICAgIHRoaXMucmVtYXAgPSBuZXcgUmVtYXBwaW5nXG4gICAgdGhpcy52ZXJzaW9uID0gYnJhbmNoLnZlcnNpb25cbiAgICB0aGlzLm1pcnJvckJ1ZmZlciA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgfVxuXG4gIG1vdmVUb1ZlcnNpb24odmVyc2lvbikge1xuICAgIHdoaWxlICh0aGlzLnZlcnNpb24gPiB2ZXJzaW9uKSB0aGlzLmFkZE5leHRNYXAoKVxuICB9XG5cbiAgYWRkTmV4dE1hcCgpIHtcbiAgICBsZXQgZm91bmQgPSB0aGlzLmJyYW5jaC5taXJyb3JbdGhpcy52ZXJzaW9uXVxuICAgIGxldCBtYXBPZmZzZXQgPSB0aGlzLmJyYW5jaC5tYXBzLmxlbmd0aCAtICh0aGlzLmJyYW5jaC52ZXJzaW9uIC0gdGhpcy52ZXJzaW9uKSAtIDFcbiAgICBsZXQgaWQgPSB0aGlzLnJlbWFwLmFkZFRvRnJvbnQodGhpcy5icmFuY2gubWFwc1ttYXBPZmZzZXRdLCB0aGlzLm1pcnJvckJ1ZmZlclt0aGlzLnZlcnNpb25dKVxuICAgIC0tdGhpcy52ZXJzaW9uXG4gICAgaWYgKGZvdW5kICE9IG51bGwpIHRoaXMubWlycm9yQnVmZmVyW2ZvdW5kXSA9IGlkXG4gICAgcmV0dXJuIGlkXG4gIH1cblxuICBtb3ZlUGFzdFN0ZXAocmVzdWx0KSB7XG4gICAgbGV0IGlkID0gdGhpcy5hZGROZXh0TWFwKClcbiAgICBpZiAocmVzdWx0KSB0aGlzLnJlbWFwLmFkZFRvQmFjayhyZXN1bHQubWFwLCBpZClcbiAgfVxufVxuXG5jb25zdCB3b3JrVGltZSA9IDEwMCwgcGF1c2VUaW1lID0gMTUwXG5cbmNsYXNzIENvbXByZXNzaW9uV29ya2VyIHtcbiAgY29uc3RydWN0b3IoZG9jLCBicmFuY2gsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5icmFuY2ggPSBicmFuY2hcbiAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2tcbiAgICB0aGlzLnJlbWFwID0gbmV3IEJyYW5jaFJlbWFwcGluZyhicmFuY2gpXG5cbiAgICB0aGlzLmRvYyA9IGRvY1xuICAgIHRoaXMuZXZlbnRzID0gW11cbiAgICB0aGlzLm1hcHMgPSBbXVxuICAgIHRoaXMudmVyc2lvbiA9IHRoaXMuc3RhcnRWZXJzaW9uID0gYnJhbmNoLnZlcnNpb25cblxuICAgIHRoaXMuaSA9IGJyYW5jaC5ldmVudHMubGVuZ3RoXG4gICAgdGhpcy50aW1lb3V0ID0gbnVsbFxuICAgIHRoaXMuYWJvcnRlZCA9IGZhbHNlXG4gIH1cblxuICB3b3JrKCkge1xuICAgIGlmICh0aGlzLmFib3J0ZWQpIHJldHVyblxuXG4gICAgbGV0IGVuZFRpbWUgPSBEYXRlLm5vdygpICsgd29ya1RpbWVcblxuICAgIGZvciAoOzspIHtcbiAgICAgIGlmICh0aGlzLmkgPT0gMCkgcmV0dXJuIHRoaXMuZmluaXNoKClcbiAgICAgIGxldCBldmVudCA9IHRoaXMuYnJhbmNoLmV2ZW50c1stLXRoaXMuaV0sIG91dEV2ZW50ID0gW11cbiAgICAgIGZvciAobGV0IGogPSBldmVudC5sZW5ndGggLSAxOyBqID49IDA7IGotLSkge1xuICAgICAgICBsZXQge3N0ZXAsIHZlcnNpb246IHN0ZXBWZXJzaW9uLCBpZDogc3RlcElEfSA9IGV2ZW50W2pdXG4gICAgICAgIHRoaXMucmVtYXAubW92ZVRvVmVyc2lvbihzdGVwVmVyc2lvbilcblxuICAgICAgICBsZXQgbWFwcGVkU3RlcCA9IG1hcFN0ZXAoc3RlcCwgdGhpcy5yZW1hcC5yZW1hcClcbiAgICAgICAgaWYgKG1hcHBlZFN0ZXAgJiYgaXNEZWxTdGVwKHN0ZXApKSB7XG4gICAgICAgICAgbGV0IGV4dHJhID0gMCwgc3RhcnQgPSBzdGVwLmZyb21cbiAgICAgICAgICB3aGlsZSAoaiA+IDApIHtcbiAgICAgICAgICAgIGxldCBuZXh0ID0gZXZlbnRbaiAtIDFdXG4gICAgICAgICAgICBpZiAobmV4dC52ZXJzaW9uICE9IHN0ZXBWZXJzaW9uIC0gMSB8fCAhaXNEZWxTdGVwKG5leHQuc3RlcCkgfHxcbiAgICAgICAgICAgICAgICBzdGFydC5jbXAobmV4dC5zdGVwLnRvKSlcbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGV4dHJhICs9IG5leHQuc3RlcC50by5vZmZzZXQgLSBuZXh0LnN0ZXAuZnJvbS5vZmZzZXRcbiAgICAgICAgICAgIHN0YXJ0ID0gbmV4dC5zdGVwLmZyb21cbiAgICAgICAgICAgIHN0ZXBWZXJzaW9uLS1cbiAgICAgICAgICAgIGotLVxuICAgICAgICAgICAgdGhpcy5yZW1hcC5hZGROZXh0TWFwKClcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGV4dHJhID4gMCkge1xuICAgICAgICAgICAgbGV0IHN0YXJ0ID0gbWFwcGVkU3RlcC5mcm9tLnNoaWZ0KC1leHRyYSlcbiAgICAgICAgICAgIG1hcHBlZFN0ZXAgPSBuZXcgU3RlcChcInJlcGxhY2VcIiwgc3RhcnQsIG1hcHBlZFN0ZXAudG8sIHN0YXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtub2RlczogW10sIG9wZW5MZWZ0OiAwLCBvcGVuUmlnaHQ6IDB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgcmVzdWx0ID0gbWFwcGVkU3RlcCAmJiBhcHBseVN0ZXAodGhpcy5kb2MsIG1hcHBlZFN0ZXApXG4gICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICB0aGlzLmRvYyA9IHJlc3VsdC5kb2NcbiAgICAgICAgICB0aGlzLm1hcHMucHVzaChyZXN1bHQubWFwLmludmVydCgpKVxuICAgICAgICAgIG91dEV2ZW50LnB1c2gobmV3IEludmVydGVkU3RlcChtYXBwZWRTdGVwLCB0aGlzLnZlcnNpb24sIHN0ZXBJRCkpXG4gICAgICAgICAgdGhpcy52ZXJzaW9uLS1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbWFwLm1vdmVQYXN0U3RlcChyZXN1bHQpXG4gICAgICB9XG4gICAgICBpZiAob3V0RXZlbnQubGVuZ3RoKSB7XG4gICAgICAgIG91dEV2ZW50LnJldmVyc2UoKVxuICAgICAgICB0aGlzLmV2ZW50cy5wdXNoKG91dEV2ZW50KVxuICAgICAgfVxuICAgICAgaWYgKERhdGUubm93KCkgPiBlbmRUaW1lKSB7XG4gICAgICAgIHRoaXMudGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHRoaXMud29yaygpLCBwYXVzZVRpbWUpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZpbmlzaCgpIHtcbiAgICBpZiAodGhpcy5hYm9ydGVkKSByZXR1cm5cblxuICAgIHRoaXMuZXZlbnRzLnJldmVyc2UoKVxuICAgIHRoaXMubWFwcy5yZXZlcnNlKClcbiAgICB0aGlzLmNhbGxiYWNrKHRoaXMubWFwcy5jb25jYXQodGhpcy5icmFuY2gubWFwcy5zbGljZSh0aGlzLmJyYW5jaC5tYXBzLmxlbmd0aCAtICh0aGlzLmJyYW5jaC52ZXJzaW9uIC0gdGhpcy5zdGFydFZlcnNpb24pKSksXG4gICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50cylcbiAgfVxuXG4gIGFib3J0KCkge1xuICAgIHRoaXMuYWJvcnRlZCA9IHRydWVcbiAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dClcbiAgfVxufVxuXG5mdW5jdGlvbiBpc0RlbFN0ZXAoc3RlcCkge1xuICByZXR1cm4gc3RlcC5uYW1lID09IFwicmVwbGFjZVwiICYmIHN0ZXAuZnJvbS5vZmZzZXQgPCBzdGVwLnRvLm9mZnNldCAmJlxuICAgIFBvcy5zYW1lUGF0aChzdGVwLmZyb20ucGF0aCwgc3RlcC50by5wYXRoKSAmJiBzdGVwLnBhcmFtLm5vZGVzLmxlbmd0aCA9PSAwXG59XG5cbmNvbnN0IGNvbXByZXNzU3RlcENvdW50ID0gMTUwXG5cbmNsYXNzIEJyYW5jaCB7XG4gIGNvbnN0cnVjdG9yKG1heERlcHRoKSB7XG4gICAgdGhpcy5tYXhEZXB0aCA9IG1heERlcHRoXG4gICAgdGhpcy52ZXJzaW9uID0gMFxuICAgIHRoaXMubmV4dFN0ZXBJRCA9IDFcblxuICAgIHRoaXMubWFwcyA9IFtdXG4gICAgdGhpcy5taXJyb3IgPSBPYmplY3QuY3JlYXRlKG51bGwpXG4gICAgdGhpcy5ldmVudHMgPSBbXVxuXG4gICAgdGhpcy5zdGVwc1NpbmNlQ29tcHJlc3MgPSAwXG4gICAgdGhpcy5jb21wcmVzc2luZyA9IG51bGxcbiAgICB0aGlzLmNvbXByZXNzVGltZW91dCA9IG51bGxcbiAgfVxuXG4gIGNsZWFyKGZvcmNlKSB7XG4gICAgaWYgKGZvcmNlIHx8ICF0aGlzLmVtcHR5KCkpIHtcbiAgICAgIHRoaXMubWFwcy5sZW5ndGggPSB0aGlzLmV2ZW50cy5sZW5ndGggPSB0aGlzLnN0ZXBzU2luY2VDb21wcmVzcyA9IDBcbiAgICAgIHRoaXMubWlycm9yID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuICAgICAgdGhpcy5hYm9ydENvbXByZXNzaW9uKClcbiAgICB9XG4gIH1cblxuICBuZXdFdmVudCgpIHtcbiAgICB0aGlzLmFib3J0Q29tcHJlc3Npb24oKVxuICAgIHRoaXMuZXZlbnRzLnB1c2goW10pXG4gICAgd2hpbGUgKHRoaXMuZXZlbnRzLmxlbmd0aCA+IHRoaXMubWF4RGVwdGgpXG4gICAgICB0aGlzLmV2ZW50cy5zaGlmdCgpXG4gIH1cblxuICBhZGRNYXAobWFwKSB7XG4gICAgaWYgKCF0aGlzLmVtcHR5KCkpIHtcbiAgICAgIHRoaXMubWFwcy5wdXNoKG1hcClcbiAgICAgIHRoaXMudmVyc2lvbisrXG4gICAgICB0aGlzLnN0ZXBzU2luY2VDb21wcmVzcysrXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIGVtcHR5KCkge1xuICAgIHJldHVybiB0aGlzLmV2ZW50cy5sZW5ndGggPT0gMFxuICB9XG5cbiAgYWRkU3RlcChzdGVwLCBtYXAsIGlkKSB7XG4gICAgdGhpcy5hZGRNYXAobWFwKVxuICAgIGlmIChpZCA9PSBudWxsKSBpZCA9IHRoaXMubmV4dFN0ZXBJRCsrXG4gICAgdGhpcy5ldmVudHNbdGhpcy5ldmVudHMubGVuZ3RoIC0gMV0ucHVzaChuZXcgSW52ZXJ0ZWRTdGVwKHN0ZXAsIHRoaXMudmVyc2lvbiwgaWQpKVxuICB9XG5cbiAgYWRkVHJhbnNmb3JtKHRyYW5zZm9ybSwgaWRzKSB7XG4gICAgdGhpcy5hYm9ydENvbXByZXNzaW9uKClcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyYW5zZm9ybS5zdGVwcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGludmVydGVkID0gaW52ZXJ0U3RlcCh0cmFuc2Zvcm0uc3RlcHNbaV0sIHRyYW5zZm9ybS5kb2NzW2ldLCB0cmFuc2Zvcm0ubWFwc1tpXSlcbiAgICAgIHRoaXMuYWRkU3RlcChpbnZlcnRlZCwgdHJhbnNmb3JtLm1hcHNbaV0sIGlkcyAmJiBpZHNbaV0pXG4gICAgfVxuICB9XG5cbiAgcG9wRXZlbnQoZG9jLCBhbGxvd0NvbGxhcHNpbmcpIHtcbiAgICB0aGlzLmFib3J0Q29tcHJlc3Npb24oKVxuICAgIGxldCBldmVudCA9IHRoaXMuZXZlbnRzLnBvcCgpXG4gICAgaWYgKCFldmVudCkgcmV0dXJuIG51bGxcblxuICAgIGxldCByZW1hcCA9IG5ldyBCcmFuY2hSZW1hcHBpbmcodGhpcyksIGNvbGxhcHNpbmcgPSBhbGxvd0NvbGxhcHNpbmdcbiAgICBsZXQgdHIgPSBuZXcgVHJhbnNmb3JtKGRvYylcbiAgICBsZXQgaWRzID0gW11cblxuICAgIGZvciAobGV0IGkgPSBldmVudC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgbGV0IGludmVydGVkU3RlcCA9IGV2ZW50W2ldLCBzdGVwID0gaW52ZXJ0ZWRTdGVwLnN0ZXBcbiAgICAgIGlmICghY29sbGFwc2luZyB8fCBpbnZlcnRlZFN0ZXAudmVyc2lvbiAhPSByZW1hcC52ZXJzaW9uKSB7XG4gICAgICAgIGNvbGxhcHNpbmcgPSBmYWxzZVxuICAgICAgICByZW1hcC5tb3ZlVG9WZXJzaW9uKGludmVydGVkU3RlcC52ZXJzaW9uKVxuXG4gICAgICAgIHN0ZXAgPSBtYXBTdGVwKHN0ZXAsIHJlbWFwLnJlbWFwKVxuICAgICAgICBsZXQgcmVzdWx0ID0gc3RlcCAmJiB0ci5zdGVwKHN0ZXApXG4gICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICBpZHMucHVzaChpbnZlcnRlZFN0ZXAuaWQpXG4gICAgICAgICAgaWYgKHRoaXMuYWRkTWFwKHJlc3VsdC5tYXApKVxuICAgICAgICAgICAgdGhpcy5taXJyb3JbdGhpcy52ZXJzaW9uXSA9IGludmVydGVkU3RlcC52ZXJzaW9uXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaSA+IDApIHJlbWFwLm1vdmVQYXN0U3RlcChyZXN1bHQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnZlcnNpb24tLVxuICAgICAgICBkZWxldGUgdGhpcy5taXJyb3JbdGhpcy52ZXJzaW9uXVxuICAgICAgICB0aGlzLm1hcHMucG9wKClcbiAgICAgICAgdHIuc3RlcChzdGVwKVxuICAgICAgICBpZHMucHVzaChpbnZlcnRlZFN0ZXAuaWQpXG4gICAgICAgIC0tcmVtYXAudmVyc2lvblxuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5lbXB0eSgpKSB0aGlzLmNsZWFyKHRydWUpXG4gICAgcmV0dXJuIHt0cmFuc2Zvcm06IHRyLCBpZHN9XG4gIH1cblxuICBnZXRWZXJzaW9uKCkge1xuICAgIHJldHVybiB7aWQ6IHRoaXMubmV4dFN0ZXBJRCwgdmVyc2lvbjogdGhpcy52ZXJzaW9ufVxuICB9XG5cbiAgZmluZFZlcnNpb24odmVyc2lvbikge1xuICAgIGZvciAobGV0IGkgPSB0aGlzLmV2ZW50cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgbGV0IGV2ZW50ID0gdGhpcy5ldmVudHNbaV1cbiAgICAgIGZvciAobGV0IGogPSBldmVudC5sZW5ndGggLSAxOyBqID49IDA7IGotLSkge1xuICAgICAgICBsZXQgc3RlcCA9IGV2ZW50W2pdXG4gICAgICAgIGlmIChzdGVwLmlkID09IHZlcnNpb24uaWQpIHJldHVybiB7ZXZlbnQ6IGksIHN0ZXA6IGp9XG4gICAgICAgIGVsc2UgaWYgKHN0ZXAuaWQgPCB2ZXJzaW9uLmlkKSByZXR1cm4ge2V2ZW50OiBpLCBzdGVwOiBqICsgMX1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZWJhc2VkKG5ld01hcHMsIHJlYmFzZWRUcmFuc2Zvcm0sIHBvc2l0aW9ucykge1xuICAgIGlmICh0aGlzLmVtcHR5KCkpIHJldHVyblxuICAgIHRoaXMuYWJvcnRDb21wcmVzc2lvbigpXG5cbiAgICBsZXQgc3RhcnRWZXJzaW9uID0gdGhpcy52ZXJzaW9uIC0gcG9zaXRpb25zLmxlbmd0aFxuXG4gICAgLy8gVXBkYXRlIGFuZCBjbGVhbiB1cCB0aGUgZXZlbnRzXG4gICAgb3V0OiBmb3IgKGxldCBpID0gdGhpcy5ldmVudHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGxldCBldmVudCA9IHRoaXMuZXZlbnRzW2ldXG4gICAgICBmb3IgKGxldCBqID0gZXZlbnQubGVuZ3RoIC0gMTsgaiA+PSAwOyBqLS0pIHtcbiAgICAgICAgbGV0IHN0ZXAgPSBldmVudFtqXVxuICAgICAgICBpZiAoc3RlcC52ZXJzaW9uIDw9IHN0YXJ0VmVyc2lvbikgYnJlYWsgb3V0XG4gICAgICAgIGxldCBvZmYgPSBwb3NpdGlvbnNbc3RlcC52ZXJzaW9uIC0gc3RhcnRWZXJzaW9uIC0gMV1cbiAgICAgICAgaWYgKG9mZiA9PSAtMSkge1xuICAgICAgICAgIGV2ZW50LnNwbGljZShqLS0sIDEpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGV0IGludiA9IGludmVydFN0ZXAocmViYXNlZFRyYW5zZm9ybS5zdGVwc1tvZmZdLCByZWJhc2VkVHJhbnNmb3JtLmRvY3Nbb2ZmXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWJhc2VkVHJhbnNmb3JtLm1hcHNbb2ZmXSlcbiAgICAgICAgICBldmVudFtqXSA9IG5ldyBJbnZlcnRlZFN0ZXAoaW52LCBzdGFydFZlcnNpb24gKyBuZXdNYXBzLmxlbmd0aCArIG9mZiArIDEsIHN0ZXAuaWQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTeW5jIHRoZSBhcnJheSBvZiBtYXBzXG4gICAgaWYgKHRoaXMubWFwcy5sZW5ndGggPiBwb3NpdGlvbnMubGVuZ3RoKVxuICAgICAgdGhpcy5tYXBzID0gdGhpcy5tYXBzLnNsaWNlKDAsIHRoaXMubWFwcy5sZW5ndGggLSBwb3NpdGlvbnMubGVuZ3RoKS5jb25jYXQobmV3TWFwcykuY29uY2F0KHJlYmFzZWRUcmFuc2Zvcm0ubWFwcylcbiAgICBlbHNlXG4gICAgICB0aGlzLm1hcHMgPSByZWJhc2VkVHJhbnNmb3JtLm1hcHMuc2xpY2UoKVxuXG4gICAgdGhpcy52ZXJzaW9uID0gc3RhcnRWZXJzaW9uICsgbmV3TWFwcy5sZW5ndGggKyByZWJhc2VkVHJhbnNmb3JtLm1hcHMubGVuZ3RoXG5cbiAgICB0aGlzLnN0ZXBzU2luY2VDb21wcmVzcyArPSBuZXdNYXBzLmxlbmd0aCArIHJlYmFzZWRUcmFuc2Zvcm0uc3RlcHMubGVuZ3RoIC0gcG9zaXRpb25zLmxlbmd0aFxuICB9XG5cbiAgYWJvcnRDb21wcmVzc2lvbigpIHtcbiAgICBpZiAodGhpcy5jb21wcmVzc2luZykge1xuICAgICAgdGhpcy5jb21wcmVzc2luZy5hYm9ydCgpXG4gICAgICB0aGlzLmNvbXByZXNzaW5nID0gbnVsbFxuICAgIH1cbiAgfVxuXG4gIG5lZWRzQ29tcHJlc3Npb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RlcHNTaW5jZUNvbXByZXNzID4gY29tcHJlc3NTdGVwQ291bnQgJiYgIXRoaXMuY29tcHJlc3NpbmdcbiAgfVxuXG4gIHN0YXJ0Q29tcHJlc3Npb24oZG9jKSB7XG4gICAgdGhpcy5jb21wcmVzc2luZyA9IG5ldyBDb21wcmVzc2lvbldvcmtlcihkb2MsIHRoaXMsIChtYXBzLCBldmVudHMpID0+IHtcbiAgICAgIHRoaXMubWFwcyA9IG1hcHNcbiAgICAgIHRoaXMuZXZlbnRzID0gZXZlbnRzXG4gICAgICB0aGlzLm1pcnJvciA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgICAgIHRoaXMuY29tcHJlc3NpbmcgPSBudWxsXG4gICAgICB0aGlzLnN0ZXBzU2luY2VDb21wcmVzcyA9IDBcbiAgICB9KVxuICAgIHRoaXMuY29tcHJlc3Npbmcud29yaygpXG4gIH1cbn1cblxuY29uc3QgY29tcHJlc3NEZWxheSA9IDc1MFxuXG5leHBvcnQgY2xhc3MgSGlzdG9yeSB7XG4gIGNvbnN0cnVjdG9yKHBtKSB7XG4gICAgdGhpcy5wbSA9IHBtXG5cbiAgICB0aGlzLmRvbmUgPSBuZXcgQnJhbmNoKHBtLm9wdGlvbnMuaGlzdG9yeURlcHRoKVxuICAgIHRoaXMudW5kb25lID0gbmV3IEJyYW5jaChwbS5vcHRpb25zLmhpc3RvcnlEZXB0aClcblxuICAgIHRoaXMubGFzdEFkZGVkQXQgPSAwXG4gICAgdGhpcy5pZ25vcmVUcmFuc2Zvcm0gPSBmYWxzZVxuXG4gICAgdGhpcy5hbGxvd0NvbGxhcHNpbmcgPSB0cnVlXG5cbiAgICBwbS5vbihcInRyYW5zZm9ybVwiLCAodHJhbnNmb3JtLCBvcHRpb25zKSA9PiB0aGlzLnJlY29yZFRyYW5zZm9ybSh0cmFuc2Zvcm0sIG9wdGlvbnMpKVxuICB9XG5cbiAgcmVjb3JkVHJhbnNmb3JtKHRyYW5zZm9ybSwgb3B0aW9ucykge1xuICAgIGlmICh0aGlzLmlnbm9yZVRyYW5zZm9ybSkgcmV0dXJuXG5cbiAgICBpZiAob3B0aW9ucy5hZGRUb0hpc3RvcnkgPT0gZmFsc2UpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJhbnNmb3JtLm1hcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IG1hcCA9IHRyYW5zZm9ybS5tYXBzW2ldXG4gICAgICAgIHRoaXMuZG9uZS5hZGRNYXAobWFwKVxuICAgICAgICB0aGlzLnVuZG9uZS5hZGRNYXAobWFwKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVuZG9uZS5jbGVhcigpXG4gICAgICBsZXQgbm93ID0gRGF0ZS5ub3coKVxuICAgICAgaWYgKG5vdyA+IHRoaXMubGFzdEFkZGVkQXQgKyB0aGlzLnBtLm9wdGlvbnMuaGlzdG9yeUV2ZW50RGVsYXkpXG4gICAgICAgIHRoaXMuZG9uZS5uZXdFdmVudCgpXG5cbiAgICAgIHRoaXMuZG9uZS5hZGRUcmFuc2Zvcm0odHJhbnNmb3JtKVxuICAgICAgdGhpcy5sYXN0QWRkZWRBdCA9IG5vd1xuICAgIH1cbiAgICB0aGlzLm1heWJlU2NoZWR1bGVDb21wcmVzc2lvbigpXG4gIH1cblxuICB1bmRvKCkgeyByZXR1cm4gdGhpcy5zaGlmdCh0aGlzLmRvbmUsIHRoaXMudW5kb25lKSB9XG4gIHJlZG8oKSB7IHJldHVybiB0aGlzLnNoaWZ0KHRoaXMudW5kb25lLCB0aGlzLmRvbmUpIH1cblxuICBjYW5VbmRvKCkgeyByZXR1cm4gdGhpcy5kb25lLmV2ZW50cy5sZW5ndGggPiAwIH1cbiAgY2FuUmVkbygpIHsgcmV0dXJuIHRoaXMudW5kb25lLmV2ZW50cy5sZW5ndGggPiAwIH1cblxuICBzaGlmdChmcm9tLCB0bykge1xuICAgIGxldCBldmVudCA9IGZyb20ucG9wRXZlbnQodGhpcy5wbS5kb2MsIHRoaXMuYWxsb3dDb2xsYXBzaW5nKVxuICAgIGlmICghZXZlbnQpIHJldHVybiBmYWxzZVxuICAgIGxldCB7dHJhbnNmb3JtLCBpZHN9ID0gZXZlbnRcblxuICAgIHRoaXMuaWdub3JlVHJhbnNmb3JtID0gdHJ1ZVxuICAgIHRoaXMucG0uYXBwbHkodHJhbnNmb3JtKVxuICAgIHRoaXMuaWdub3JlVHJhbnNmb3JtID0gZmFsc2VcblxuICAgIGlmICghdHJhbnNmb3JtLnN0ZXBzLmxlbmd0aCkgcmV0dXJuIHRoaXMuc2hpZnQoZnJvbSwgdG8pXG5cbiAgICBpZiAodG8pIHtcbiAgICAgIHRvLm5ld0V2ZW50KClcbiAgICAgIHRvLmFkZFRyYW5zZm9ybSh0cmFuc2Zvcm0sIGlkcylcbiAgICB9XG4gICAgdGhpcy5sYXN0QWRkZWRBdCA9IDBcblxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBnZXRWZXJzaW9uKCkgeyByZXR1cm4gdGhpcy5kb25lLmdldFZlcnNpb24oKSB9XG5cbiAgYmFja1RvVmVyc2lvbih2ZXJzaW9uKSB7XG4gICAgbGV0IGZvdW5kID0gdGhpcy5kb25lLmZpbmRWZXJzaW9uKHZlcnNpb24pXG4gICAgaWYgKCFmb3VuZCkgcmV0dXJuIGZhbHNlXG4gICAgbGV0IGV2ZW50ID0gdGhpcy5kb25lLmV2ZW50c1tmb3VuZC5ldmVudF1cbiAgICBsZXQgY29tYmluZWQgPSB0aGlzLmRvbmUuZXZlbnRzLnNsaWNlKGZvdW5kLmV2ZW50ICsgMSlcbiAgICAgICAgLnJlZHVjZSgoY29tYiwgYXJyKSA9PiBjb21iLmNvbmNhdChhcnIpLCBldmVudC5zbGljZShmb3VuZC5zdGVwKSlcbiAgICB0aGlzLmRvbmUuZXZlbnRzLmxlbmd0aCA9IGZvdW5kLmV2ZW50ICsgKChldmVudC5sZW5ndGggPSBmb3VuZC5zdGVwKSA/IDEgOiAwKVxuICAgIHRoaXMuZG9uZS5ldmVudHMucHVzaChjb21iaW5lZClcblxuICAgIHRoaXMuc2hpZnQodGhpcy5kb25lKVxuICB9XG5cbiAgcmViYXNlZChuZXdNYXBzLCByZWJhc2VkVHJhbnNmb3JtLCBwb3NpdGlvbnMpIHtcbiAgICB0aGlzLmRvbmUucmViYXNlZChuZXdNYXBzLCByZWJhc2VkVHJhbnNmb3JtLCBwb3NpdGlvbnMpXG4gICAgdGhpcy51bmRvbmUucmViYXNlZChuZXdNYXBzLCByZWJhc2VkVHJhbnNmb3JtLCBwb3NpdGlvbnMpXG4gICAgdGhpcy5tYXliZVNjaGVkdWxlQ29tcHJlc3Npb24oKVxuICB9XG5cbiAgbWF5YmVTY2hlZHVsZUNvbXByZXNzaW9uKCkge1xuICAgIHRoaXMubWF5YmVTY2hlZHVsZUNvbXByZXNzaW9uRm9yQnJhbmNoKHRoaXMuZG9uZSlcbiAgICB0aGlzLm1heWJlU2NoZWR1bGVDb21wcmVzc2lvbkZvckJyYW5jaCh0aGlzLnVuZG9uZSlcbiAgfVxuXG4gIG1heWJlU2NoZWR1bGVDb21wcmVzc2lvbkZvckJyYW5jaChicmFuY2gpIHtcbiAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KGJyYW5jaC5jb21wcmVzc1RpbWVvdXQpXG4gICAgaWYgKGJyYW5jaC5uZWVkc0NvbXByZXNzaW9uKCkpXG4gICAgICBicmFuY2guY29tcHJlc3NUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAoYnJhbmNoLm5lZWRzQ29tcHJlc3Npb24oKSlcbiAgICAgICAgICBicmFuY2guc3RhcnRDb21wcmVzc2lvbih0aGlzLnBtLmRvYylcbiAgICAgIH0sIGNvbXByZXNzRGVsYXkpXG4gIH1cbn1cbiIsImV4cG9ydCB7UHJvc2VNaXJyb3J9IGZyb20gXCIuL21haW5cIlxuZXhwb3J0IHtkZWZpbmVPcHRpb259IGZyb20gXCIuL29wdGlvbnNcIlxuZXhwb3J0IHtSYW5nZX0gZnJvbSBcIi4vc2VsZWN0aW9uXCJcbmV4cG9ydCB7ZXZlbnRNaXhpbn0gZnJvbSBcIi4vZXZlbnRcIlxuZXhwb3J0IHtLZXltYXB9IGZyb20gXCIuL2tleXNcIlxuIiwiaW1wb3J0IHtQb3MsIE5vZGUsIFNwYW4sIHNwYW5TdHlsZXNBdH0gZnJvbSBcIi4uL21vZGVsXCJcblxuaW1wb3J0IHtmcm9tSFRNTH0gZnJvbSBcIi4uL2NvbnZlcnQvZnJvbV9kb21cIlxuaW1wb3J0IHt0b0hUTUx9IGZyb20gXCIuLi9jb252ZXJ0L3RvX2RvbVwiXG5pbXBvcnQge3RvVGV4dH0gZnJvbSBcIi4uL2NvbnZlcnQvdG9fdGV4dFwiXG5pbXBvcnQge2tub3duU291cmNlLCBjb252ZXJ0RnJvbX0gZnJvbSBcIi4uL2NvbnZlcnQvY29udmVydFwiXG5cbmltcG9ydCB7aXNNb2RpZmllcktleSwgbG9va3VwS2V5LCBrZXlOYW1lfSBmcm9tIFwiLi9rZXlzXCJcbmltcG9ydCB7YnJvd3NlciwgYWRkQ2xhc3MsIHJtQ2xhc3N9IGZyb20gXCIuLi9kb21cIlxuaW1wb3J0IHtleGVjQ29tbWFuZH0gZnJvbSBcIi4vY29tbWFuZHNcIlxuaW1wb3J0IHthcHBseURPTUNoYW5nZSwgdGV4dENvbnRleHQsIHRleHRJbkNvbnRleHR9IGZyb20gXCIuL2RvbWNoYW5nZVwiXG5pbXBvcnQge1JhbmdlfSBmcm9tIFwiLi9zZWxlY3Rpb25cIlxuXG5sZXQgc3RvcFNlcSA9IG51bGxcbmNvbnN0IGhhbmRsZXJzID0ge31cblxuZXhwb3J0IGNsYXNzIElucHV0IHtcbiAgY29uc3RydWN0b3IocG0pIHtcbiAgICB0aGlzLnBtID0gcG1cblxuICAgIHRoaXMua2V5U2VxID0gbnVsbFxuICAgIHRoaXMuY29tcG9zaW5nID0gbnVsbFxuICAgIHRoaXMuc2hpZnRLZXkgPSB0aGlzLnVwZGF0aW5nQ29tcG9zaXRpb24gPSBmYWxzZVxuICAgIHRoaXMuc2tpcElucHV0ID0gMFxuXG4gICAgdGhpcy5kcmFnZ2luZ0Zyb20gPSBmYWxzZVxuXG4gICAgdGhpcy5rZXltYXBzID0gW11cbiAgICB0aGlzLmNvbW1hbmRFeHRlbnNpb25zID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXG4gICAgdGhpcy5zdG9yZWRTdHlsZXMgPSBudWxsXG5cbiAgICBmb3IgKGxldCBldmVudCBpbiBoYW5kbGVycykge1xuICAgICAgbGV0IGhhbmRsZXIgPSBoYW5kbGVyc1tldmVudF1cbiAgICAgIHBtLmNvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZSA9PiBoYW5kbGVyKHBtLCBlKSlcbiAgICB9XG5cbiAgICBwbS5vbihcInNlbGVjdGlvbkNoYW5nZVwiLCAoKSA9PiB0aGlzLnN0b3JlZFN0eWxlcyA9IG51bGwpXG4gIH1cblxuICBleHRlbmRDb21tYW5kKG5hbWUsIHByaW9yaXR5LCBmKSB7XG4gICAgbGV0IG9iaiA9IHRoaXMuY29tbWFuZEV4dGVuc2lvbnNbbmFtZV0gfHxcbiAgICAgICAgKHRoaXMuY29tbWFuZEV4dGVuc2lvbnNbbmFtZV0gPSB7bG93OiBbXSwgbm9ybWFsOiBbXSwgaGlnaDogW119KVxuICAgIG9ialtwcmlvcml0eV0ucHVzaChmKVxuICB9XG5cbiAgdW5leHRlbmRDb21tYW5kKG5hbWUsIHByaW9yaXR5LCBmKSB7XG4gICAgbGV0IG9iaiA9IHRoaXMuY29tbWFuZEV4dGVuc2lvbnNbbmFtZV1cbiAgICBsZXQgYXJyID0gb2JqICYmIG9ialtwcmlvcml0eV1cbiAgICBpZiAoYXJyKSBmb3IgKGxldCBpID0gMDsgaSA8IGFyci5sZW5ndGg7IGkrKylcbiAgICAgIGlmIChhcnJbaV0gPT0gZikgeyBhcnIuc3BsaWNlKGksIDEpOyBicmVhayB9XG4gIH1cblxuICBtYXliZUFib3J0Q29tcG9zaXRpb24oKSB7XG4gICAgaWYgKHRoaXMuY29tcG9zaW5nICYmICF0aGlzLnVwZGF0aW5nQ29tcG9zaXRpb24pIHtcbiAgICAgIGlmICh0aGlzLmNvbXBvc2luZy5maW5pc2hlZCkge1xuICAgICAgICBmaW5pc2hDb21wb3NpbmcodGhpcy5wbSlcbiAgICAgIH0gZWxzZSB7IC8vIFRvZ2dsZSBzZWxlY3Rpb24gdG8gZm9yY2UgZW5kIG9mIGNvbXBvc2l0aW9uXG4gICAgICAgIHRoaXMuY29tcG9zaW5nID0gbnVsbFxuICAgICAgICB0aGlzLnNraXBJbnB1dCsrXG4gICAgICAgIGxldCBzZWwgPSBnZXRTZWxlY3Rpb24oKVxuICAgICAgICBpZiAoc2VsLnJhbmdlQ291bnQpIHtcbiAgICAgICAgICBsZXQgcmFuZ2UgPSBzZWwuZ2V0UmFuZ2VBdCgwKVxuICAgICAgICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKVxuICAgICAgICAgIHNlbC5hZGRSYW5nZShyYW5nZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BhdGNoS2V5KHBtLCBuYW1lLCBlKSB7XG4gIGxldCBzZXEgPSBwbS5pbnB1dC5rZXlTZXFcbiAgaWYgKHNlcSkge1xuICAgIGlmIChpc01vZGlmaWVyS2V5KG5hbWUpKSByZXR1cm4gdHJ1ZVxuICAgIGNsZWFyVGltZW91dChzdG9wU2VxKVxuICAgIHN0b3BTZXEgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHBtLmlucHV0LmtleVNlcSA9PSBzZXEpXG4gICAgICAgIHBtLmlucHV0LmtleVNlcSA9IG51bGxcbiAgICB9LCA1MClcbiAgICBuYW1lID0gc2VxICsgXCIgXCIgKyBuYW1lXG4gIH1cblxuICBsZXQgaGFuZGxlID0gZnVuY3Rpb24oYm91bmQpIHtcbiAgICBsZXQgcmVzdWx0ID0gdHlwZW9mIGJvdW5kID09IFwic3RyaW5nXCIgPyBleGVjQ29tbWFuZChwbSwgYm91bmQpIDogYm91bmQocG0pXG4gICAgcmV0dXJuIHJlc3VsdCAhPT0gZmFsc2VcbiAgfVxuXG4gIGxldCByZXN1bHRcbiAgZm9yIChsZXQgaSA9IDA7ICFyZXN1bHQgJiYgaSA8IHBtLmlucHV0LmtleW1hcHMubGVuZ3RoOyBpKyspXG4gICAgcmVzdWx0ID0gbG9va3VwS2V5KG5hbWUsIHBtLmlucHV0LmtleW1hcHNbaV0sIGhhbmRsZSwgcG0pXG4gIGlmICghcmVzdWx0KVxuICAgIHJlc3VsdCA9IGxvb2t1cEtleShuYW1lLCBwbS5vcHRpb25zLmV4dHJhS2V5bWFwLCBoYW5kbGUsIHBtKSB8fFxuICAgICAgbG9va3VwS2V5KG5hbWUsIHBtLm9wdGlvbnMua2V5bWFwLCBoYW5kbGUsIHBtKVxuXG4gIGlmIChyZXN1bHQgPT0gXCJtdWx0aVwiKVxuICAgIHBtLmlucHV0LmtleVNlcSA9IG5hbWVcblxuICBpZiAocmVzdWx0ID09IFwiaGFuZGxlZFwiIHx8IHJlc3VsdCA9PSBcIm11bHRpXCIpXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgaWYgKHNlcSAmJiAhcmVzdWx0ICYmIC9cXCckLy50ZXN0KG5hbWUpKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICByZXR1cm4gISFyZXN1bHRcbn1cblxuaGFuZGxlcnMua2V5ZG93biA9IChwbSwgZSkgPT4ge1xuICBpZiAoZS5rZXlDb2RlID09IDE2KSBwbS5pbnB1dC5zaGlmdEtleSA9IHRydWVcbiAgaWYgKHBtLmlucHV0LmNvbXBvc2luZykgcmV0dXJuXG4gIGxldCBuYW1lID0ga2V5TmFtZShlKVxuICBpZiAobmFtZSkgZGlzcGF0Y2hLZXkocG0sIG5hbWUsIGUpXG59XG5cbmhhbmRsZXJzLmtleXVwID0gKHBtLCBlKSA9PiB7XG4gIGlmIChlLmtleUNvZGUgPT0gMTYpIHBtLmlucHV0LnNoaWZ0S2V5ID0gZmFsc2Vcbn1cblxuZnVuY3Rpb24gaW5wdXRUZXh0KHBtLCByYW5nZSwgdGV4dCkge1xuICBpZiAocmFuZ2UuZW1wdHkgJiYgIXRleHQpIHJldHVybiBmYWxzZVxuICBsZXQgc3R5bGVzID0gcG0uaW5wdXQuc3RvcmVkU3R5bGVzIHx8IHNwYW5TdHlsZXNBdChwbS5kb2MsIHJhbmdlLmZyb20pXG4gIGxldCB0ciA9IHBtLnRyXG4gIGlmICghcmFuZ2UuZW1wdHkpIHRyLmRlbGV0ZShyYW5nZS5mcm9tLCByYW5nZS50bylcbiAgcG0uYXBwbHkodHIuaW5zZXJ0KHJhbmdlLmZyb20sIFNwYW4udGV4dCh0ZXh0LCBzdHlsZXMpKSlcbiAgcG0uc2lnbmFsKFwidGV4dElucHV0XCIsIHRleHQpXG4gIHBtLnNjcm9sbEludG9WaWV3KClcbn1cblxuaGFuZGxlcnMua2V5cHJlc3MgPSAocG0sIGUpID0+IHtcbiAgaWYgKHBtLmlucHV0LmNvbXBvc2luZyB8fCAhZS5jaGFyQ29kZSB8fCBlLmN0cmxLZXkgJiYgIWUuYWx0S2V5IHx8IGJyb3dzZXIubWFjICYmIGUubWV0YUtleSkgcmV0dXJuXG4gIGxldCBjaCA9IFN0cmluZy5mcm9tQ2hhckNvZGUoZS5jaGFyQ29kZSlcbiAgaWYgKGRpc3BhdGNoS2V5KHBtLCBcIidcIiArIGNoICsgXCInXCIsIGUpKSByZXR1cm5cbiAgaW5wdXRUZXh0KHBtLCBwbS5zZWxlY3Rpb24sIGNoKVxuICBlLnByZXZlbnREZWZhdWx0KClcbn1cblxuY2xhc3MgQ29tcG9zaW5nIHtcbiAgY29uc3RydWN0b3IocG0sIGRhdGEpIHtcbiAgICB0aGlzLmZpbmlzaGVkID0gZmFsc2VcbiAgICB0aGlzLmNvbnRleHQgPSB0ZXh0Q29udGV4dChkYXRhKVxuICAgIHRoaXMuZGF0YSA9IGRhdGFcbiAgICB0aGlzLmVuZERhdGEgPSBudWxsXG4gICAgbGV0IHJhbmdlID0gcG0uc2VsZWN0aW9uXG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIGxldCBwYXRoID0gcmFuZ2UuaGVhZC5wYXRoLCBsaW5lID0gcG0uZG9jLnBhdGgocGF0aCkudGV4dENvbnRlbnRcbiAgICAgIGxldCBmb3VuZCA9IGxpbmUuaW5kZXhPZihkYXRhLCByYW5nZS5oZWFkLm9mZnNldCAtIGRhdGEubGVuZ3RoKVxuICAgICAgaWYgKGZvdW5kID4gLTEgJiYgZm91bmQgPD0gcmFuZ2UuaGVhZC5vZmZzZXQgKyBkYXRhLmxlbmd0aClcbiAgICAgICAgcmFuZ2UgPSBuZXcgUmFuZ2UobmV3IFBvcyhwYXRoLCBmb3VuZCksIG5ldyBQb3MocGF0aCwgZm91bmQgKyBkYXRhLmxlbmd0aCkpXG4gICAgfVxuICAgIHRoaXMucmFuZ2UgPSByYW5nZVxuICB9XG59XG5cbmhhbmRsZXJzLmNvbXBvc2l0aW9uc3RhcnQgPSAocG0sIGUpID0+IHtcbiAgaWYgKHBtLmlucHV0Lm1heWJlQWJvcnRDb21wb3NpdGlvbigpKSByZXR1cm5cblxuICBwbS5mbHVzaCgpXG4gIHBtLmlucHV0LmNvbXBvc2luZyA9IG5ldyBDb21wb3NpbmcocG0sIGUuZGF0YSlcbn1cblxuaGFuZGxlcnMuY29tcG9zaXRpb251cGRhdGUgPSAocG0sIGUpID0+IHtcbiAgbGV0IGluZm8gPSBwbS5pbnB1dC5jb21wb3NpbmdcbiAgaWYgKGluZm8gJiYgaW5mby5kYXRhICE9IGUuZGF0YSkge1xuICAgIGluZm8uZGF0YSA9IGUuZGF0YVxuICAgIHBtLmlucHV0LnVwZGF0aW5nQ29tcG9zaXRpb24gPSB0cnVlXG4gICAgaW5wdXRUZXh0KHBtLCBpbmZvLnJhbmdlLCBpbmZvLmRhdGEpXG4gICAgcG0uaW5wdXQudXBkYXRpbmdDb21wb3NpdGlvbiA9IGZhbHNlXG4gICAgaW5mby5yYW5nZSA9IG5ldyBSYW5nZShpbmZvLnJhbmdlLmZyb20sIGluZm8ucmFuZ2UuZnJvbS5zaGlmdChpbmZvLmRhdGEubGVuZ3RoKSlcbiAgfVxufVxuXG5oYW5kbGVycy5jb21wb3NpdGlvbmVuZCA9IChwbSwgZSkgPT4ge1xuICBsZXQgaW5mbyA9IHBtLmlucHV0LmNvbXBvc2luZ1xuICBpZiAoaW5mbykge1xuICAgIHBtLmlucHV0LmNvbXBvc2luZy5maW5pc2hlZCA9IHRydWVcbiAgICBwbS5pbnB1dC5jb21wb3NpbmcuZW5kRGF0YSA9IGUuZGF0YVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge2lmIChwbS5pbnB1dC5jb21wb3NpbmcgPT0gaW5mbykgZmluaXNoQ29tcG9zaW5nKHBtKX0sIDIwKVxuICB9XG59XG5cbmZ1bmN0aW9uIGZpbmlzaENvbXBvc2luZyhwbSkge1xuICBsZXQgaW5mbyA9IHBtLmlucHV0LmNvbXBvc2luZ1xuICBsZXQgdGV4dCA9IHRleHRJbkNvbnRleHQoaW5mby5jb250ZXh0LCBpbmZvLmVuZERhdGEpXG4gIGlmICh0ZXh0ICE9IGluZm8uZGF0YSkgcG0uZW5zdXJlT3BlcmF0aW9uKClcbiAgcG0uaW5wdXQuY29tcG9zaW5nID0gbnVsbFxuICBpZiAodGV4dCAhPSBpbmZvLmRhdGEpIGlucHV0VGV4dChwbSwgaW5mby5yYW5nZSwgdGV4dClcbn1cblxuaGFuZGxlcnMuaW5wdXQgPSAocG0pID0+IHtcbiAgaWYgKHBtLmlucHV0LnNraXBJbnB1dCkgcmV0dXJuIC0tcG0uaW5wdXQuc2tpcElucHV0XG5cbiAgaWYgKHBtLmlucHV0LmNvbXBvc2luZykge1xuICAgIGlmIChwbS5pbnB1dC5jb21wb3NpbmcuZmluaXNoZWQpIGZpbmlzaENvbXBvc2luZyhwbSlcbiAgICByZXR1cm5cbiAgfVxuXG4gIHBtLmlucHV0LnN1cHByZXNzUG9sbGluZyA9IHRydWVcbiAgYXBwbHlET01DaGFuZ2UocG0pXG4gIHBtLmlucHV0LnN1cHByZXNzUG9sbGluZyA9IGZhbHNlXG4gIHBtLnNlbC5wb2xsKHRydWUpXG4gIHBtLnNjcm9sbEludG9WaWV3KClcbn1cblxubGV0IGxhc3RDb3BpZWQgPSBudWxsXG5cbmhhbmRsZXJzLmNvcHkgPSBoYW5kbGVycy5jdXQgPSAocG0sIGUpID0+IHtcbiAgbGV0IHNlbCA9IHBtLnNlbGVjdGlvblxuICBpZiAoc2VsLmVtcHR5KSByZXR1cm5cbiAgbGV0IGZyYWdtZW50ID0gcG0uc2VsZWN0ZWREb2NcbiAgbGFzdENvcGllZCA9IHtkb2M6IHBtLmRvYywgZnJvbTogc2VsLmZyb20sIHRvOiBzZWwudG8sXG4gICAgICAgICAgICAgICAgaHRtbDogdG9IVE1MKGZyYWdtZW50LCB7ZG9jdW1lbnR9KSxcbiAgICAgICAgICAgICAgICB0ZXh0OiB0b1RleHQoZnJhZ21lbnQpfVxuXG4gIGlmIChlLmNsaXBib2FyZERhdGEpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICBlLmNsaXBib2FyZERhdGEuY2xlYXJEYXRhKClcbiAgICBlLmNsaXBib2FyZERhdGEuc2V0RGF0YShcInRleHQvaHRtbFwiLCBsYXN0Q29waWVkLmh0bWwpXG4gICAgZS5jbGlwYm9hcmREYXRhLnNldERhdGEoXCJ0ZXh0L3BsYWluXCIsIGxhc3RDb3BpZWQudGV4dClcbiAgICBpZiAoZS50eXBlID09IFwiY3V0XCIgJiYgIXNlbC5lbXB0eSlcbiAgICAgIHBtLmFwcGx5KHBtLnRyLmRlbGV0ZShzZWwuZnJvbSwgc2VsLnRvKSlcbiAgfVxufVxuXG5oYW5kbGVycy5wYXN0ZSA9IChwbSwgZSkgPT4ge1xuICBpZiAoIWUuY2xpcGJvYXJkRGF0YSkgcmV0dXJuXG4gIGxldCBzZWwgPSBwbS5zZWxlY3Rpb25cbiAgbGV0IHR4dCA9IGUuY2xpcGJvYXJkRGF0YS5nZXREYXRhKFwidGV4dC9wbGFpblwiKVxuICBsZXQgaHRtbCA9IGUuY2xpcGJvYXJkRGF0YS5nZXREYXRhKFwidGV4dC9odG1sXCIpXG4gIGlmIChodG1sIHx8IHR4dCkge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGxldCBkb2MsIGZyb20sIHRvXG4gICAgaWYgKHBtLmlucHV0LnNoaWZ0S2V5ICYmIHR4dCkge1xuICAgICAgbGV0IHBhcmFncmFwaHMgPSB0eHQuc3BsaXQoL1tcXHJcXG5dKy8pXG4gICAgICBsZXQgc3R5bGVzID0gc3BhblN0eWxlc0F0KHBtLmRvYywgc2VsLmZyb20pXG4gICAgICBkb2MgPSBuZXcgTm9kZShcImRvY1wiLCBudWxsLCBwYXJhZ3JhcGhzLm1hcChzID0+IG5ldyBOb2RlKFwicGFyYWdyYXBoXCIsIG51bGwsIFtTcGFuLnRleHQocywgc3R5bGVzKV0pKSlcbiAgICB9IGVsc2UgaWYgKGxhc3RDb3BpZWQgJiYgKGxhc3RDb3BpZWQuaHRtbCA9PSBodG1sIHx8IGxhc3RDb3BpZWQudGV4dCA9PSB0eHQpKSB7XG4gICAgICA7KHtkb2MsIGZyb20sIHRvfSA9IGxhc3RDb3BpZWQpXG4gICAgfSBlbHNlIGlmIChodG1sKSB7XG4gICAgICBkb2MgPSBmcm9tSFRNTChodG1sLCB7ZG9jdW1lbnR9KVxuICAgIH0gZWxzZSB7XG4gICAgICBkb2MgPSBjb252ZXJ0RnJvbSh0eHQsIGtub3duU291cmNlKFwibWFya2Rvd25cIikgPyBcIm1hcmtkb3duXCIgOiBcInRleHRcIilcbiAgICB9XG4gICAgcG0uYXBwbHkocG0udHIucmVwbGFjZShzZWwuZnJvbSwgc2VsLnRvLCBkb2MsIGZyb20gfHwgUG9zLnN0YXJ0KGRvYyksIHRvIHx8IFBvcy5lbmQoZG9jKSkpXG4gICAgcG0uc2Nyb2xsSW50b1ZpZXcoKVxuICB9XG59XG5cbmhhbmRsZXJzLmRyYWdzdGFydCA9IChwbSwgZSkgPT4ge1xuICBpZiAoIWUuZGF0YVRyYW5zZmVyKSByZXR1cm5cblxuICBsZXQgZnJhZ21lbnQgPSBwbS5zZWxlY3RlZERvY1xuXG4gIGUuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJ0ZXh0L2h0bWxcIiwgdG9IVE1MKGZyYWdtZW50LCB7ZG9jdW1lbnR9KSlcbiAgZS5kYXRhVHJhbnNmZXIuc2V0RGF0YShcInRleHQvcGxhaW5cIiwgdG9UZXh0KGZyYWdtZW50KSArIFwiPz9cIilcbiAgcG0uaW5wdXQuZHJhZ2dpbmdGcm9tID0gdHJ1ZVxufVxuXG5oYW5kbGVycy5kcmFnZW5kID0gcG0gPT4gd2luZG93LnNldFRpbWVvdXQoKCkgPT4gcG0uaW5wdXQuZHJhZ2dpbkZyb20gPSBmYWxzZSwgNTApXG5cbmhhbmRsZXJzLmRyYWdvdmVyID0gaGFuZGxlcnMuZHJhZ2VudGVyID0gKF8sIGUpID0+IGUucHJldmVudERlZmF1bHQoKVxuXG5oYW5kbGVycy5kcm9wID0gKHBtLCBlKSA9PiB7XG4gIGlmICghZS5kYXRhVHJhbnNmZXIpIHJldHVyblxuXG4gIGxldCBodG1sLCB0eHQsIGRvY1xuICBpZiAoaHRtbCA9IGUuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJ0ZXh0L2h0bWxcIikpXG4gICAgZG9jID0gZnJvbUhUTUwoaHRtbCwge2RvY3VtZW50fSlcbiAgZWxzZSBpZiAodHh0ID0gZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcInRleHQvcGxhaW5cIikpXG4gICAgZG9jID0gY29udmVydEZyb20odHh0LCBrbm93blNvdXJjZShcIm1hcmtkb3duXCIpID8gXCJtYXJrZG93blwiIDogXCJ0ZXh0XCIpXG5cbiAgaWYgKGRvYykge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgIGxldCBpbnNlcnRQb3MgPSBwbS5wb3NBdENvb3Jkcyh7bGVmdDogZS5jbGllbnRYLCB0b3A6IGUuY2xpZW50WX0pXG4gICAgbGV0IHRyID0gcG0udHJcbiAgICBpZiAocG0uaW5wdXQuZHJhZ2dpbmdGcm9tICYmICFlLmN0cmxLZXkpIHtcbiAgICAgIGxldCBzZWwgPSBwbS5zZWxlY3Rpb25cbiAgICAgIHRyLmRlbGV0ZShzZWwuZnJvbSwgc2VsLnRvKVxuICAgICAgaW5zZXJ0UG9zID0gdHIubWFwKGluc2VydFBvcykucG9zXG4gICAgfVxuICAgIHRyLnJlcGxhY2UoaW5zZXJ0UG9zLCBpbnNlcnRQb3MsIGRvYywgUG9zLnN0YXJ0KGRvYyksIFBvcy5lbmQoZG9jKSlcbiAgICBwbS5hcHBseSh0cilcbiAgICBwbS5zZXRTZWxlY3Rpb24obmV3IFJhbmdlKGluc2VydFBvcywgdHIubWFwKGluc2VydFBvcykucG9zKSlcbiAgICBwbS5mb2N1cygpXG4gIH1cbn1cblxuaGFuZGxlcnMuZm9jdXMgPSBwbSA9PiB7XG4gIGFkZENsYXNzKHBtLndyYXBwZXIsIFwiUHJvc2VNaXJyb3ItZm9jdXNlZFwiKVxuICBwbS5zaWduYWwoXCJmb2N1c1wiKVxufVxuXG5oYW5kbGVycy5ibHVyID0gcG0gPT4ge1xuICBybUNsYXNzKHBtLndyYXBwZXIsIFwiUHJvc2VNaXJyb3ItZm9jdXNlZFwiKVxuICBwbS5zaWduYWwoXCJibHVyXCIpXG59XG4iLCIvLyBGcm9tIENvZGVNaXJyb3IsIHNob3VsZCBiZSBmYWN0b3JlZCBpbnRvIGl0cyBvd24gTlBNIG1vZHVsZVxuXG5leHBvcnQgY29uc3QgbmFtZXMgPSB7XG4gIDM6IFwiRW50ZXJcIiwgODogXCJCYWNrc3BhY2VcIiwgOTogXCJUYWJcIiwgMTM6IFwiRW50ZXJcIiwgMTY6IFwiU2hpZnRcIiwgMTc6IFwiQ3RybFwiLCAxODogXCJBbHRcIixcbiAgMTk6IFwiUGF1c2VcIiwgMjA6IFwiQ2Fwc0xvY2tcIiwgMjc6IFwiRXNjXCIsIDMyOiBcIlNwYWNlXCIsIDMzOiBcIlBhZ2VVcFwiLCAzNDogXCJQYWdlRG93blwiLCAzNTogXCJFbmRcIixcbiAgMzY6IFwiSG9tZVwiLCAzNzogXCJMZWZ0XCIsIDM4OiBcIlVwXCIsIDM5OiBcIlJpZ2h0XCIsIDQwOiBcIkRvd25cIiwgNDQ6IFwiUHJpbnRTY3JuXCIsIDQ1OiBcIkluc2VydFwiLFxuICA0NjogXCJEZWxldGVcIiwgNTk6IFwiO1wiLCA2MTogXCI9XCIsIDkxOiBcIk1vZFwiLCA5MjogXCJNb2RcIiwgOTM6IFwiTW9kXCIsIDEwNzogXCI9XCIsIDEwOTogXCItXCIsIDEyNzogXCJEZWxldGVcIixcbiAgMTczOiBcIi1cIiwgMTg2OiBcIjtcIiwgMTg3OiBcIj1cIiwgMTg4OiBcIixcIiwgMTg5OiBcIi1cIiwgMTkwOiBcIi5cIiwgMTkxOiBcIi9cIiwgMTkyOiBcImBcIiwgMjE5OiBcIltcIiwgMjIwOiBcIlxcXFxcIixcbiAgMjIxOiBcIl1cIiwgMjIyOiBcIidcIiwgNjMyMzI6IFwiVXBcIiwgNjMyMzM6IFwiRG93blwiLCA2MzIzNDogXCJMZWZ0XCIsIDYzMjM1OiBcIlJpZ2h0XCIsIDYzMjcyOiBcIkRlbGV0ZVwiLFxuICA2MzI3MzogXCJIb21lXCIsIDYzMjc1OiBcIkVuZFwiLCA2MzI3NjogXCJQYWdlVXBcIiwgNjMyNzc6IFwiUGFnZURvd25cIiwgNjMzMDI6IFwiSW5zZXJ0XCJcbn1cblxuLy8gTnVtYmVyIGtleXNcbmZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykgbmFtZXNbaSArIDQ4XSA9IG5hbWVzW2kgKyA5Nl0gPSBTdHJpbmcoaSlcbi8vIEFscGhhYmV0aWMga2V5c1xuZm9yIChsZXQgaSA9IDY1OyBpIDw9IDkwOyBpKyspIG5hbWVzW2ldID0gU3RyaW5nLmZyb21DaGFyQ29kZShpKVxuLy8gRnVuY3Rpb24ga2V5c1xuZm9yIChsZXQgaSA9IDE7IGkgPD0gMTI7IGkrKykgbmFtZXNbaSArIDExMV0gPSBuYW1lc1tpICsgNjMyMzVdID0gXCJGXCIgKyBpXG5cbmV4cG9ydCBmdW5jdGlvbiBrZXlOYW1lKGV2ZW50LCBub1NoaWZ0KSB7XG4gIGxldCBiYXNlID0gbmFtZXNbZXZlbnQua2V5Q29kZV0sIG5hbWUgPSBiYXNlXG4gIGlmIChuYW1lID09IG51bGwgfHwgZXZlbnQuYWx0R3JhcGhLZXkpIHJldHVybiBmYWxzZVxuXG4gIGlmIChldmVudC5hbHRLZXkgJiYgYmFzZSAhPSBcIkFsdFwiKSBuYW1lID0gXCJBbHQtXCIgKyBuYW1lXG4gIGlmIChldmVudC5jdHJsS2V5ICYmIGJhc2UgIT0gXCJDdHJsXCIpIG5hbWUgPSBcIkN0cmwtXCIgKyBuYW1lXG4gIGlmIChldmVudC5tZXRhS2V5ICYmIGJhc2UgIT0gXCJDbWRcIikgbmFtZSA9IFwiQ21kLVwiICsgbmFtZVxuICBpZiAoIW5vU2hpZnQgJiYgZXZlbnQuc2hpZnRLZXkgJiYgYmFzZSAhPSBcIlNoaWZ0XCIpIG5hbWUgPSBcIlNoaWZ0LVwiICsgbmFtZVxuICByZXR1cm4gbmFtZVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNNb2RpZmllcktleSh2YWx1ZSkge1xuICBsZXQgbmFtZSA9IHR5cGVvZiB2YWx1ZSA9PSBcInN0cmluZ1wiID8gdmFsdWUgOiBuYW1lc1t2YWx1ZS5rZXlDb2RlXVxuICByZXR1cm4gbmFtZSA9PSBcIkN0cmxcIiB8fCBuYW1lID09IFwiQWx0XCIgfHwgbmFtZSA9PSBcIlNoaWZ0XCIgfHwgbmFtZSA9PSBcIk1vZFwiXG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUtleU5hbWUoZnVsbE5hbWUpIHtcbiAgbGV0IHBhcnRzID0gZnVsbE5hbWUuc3BsaXQoLy0oPyEkKS8pLCBuYW1lID0gcGFydHNbcGFydHMubGVuZ3RoIC0gMV1cbiAgbGV0IGFsdCwgY3RybCwgc2hpZnQsIGNtZFxuICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgIGxldCBtb2QgPSBwYXJ0c1tpXVxuICAgIGlmICgvXihjbWR8bWV0YXxtKSQvaS50ZXN0KG1vZCkpIGNtZCA9IHRydWVcbiAgICBlbHNlIGlmICgvXmEobHQpPyQvaS50ZXN0KG1vZCkpIGFsdCA9IHRydWVcbiAgICBlbHNlIGlmICgvXihjfGN0cmx8Y29udHJvbCkkL2kudGVzdChtb2QpKSBjdHJsID0gdHJ1ZVxuICAgIGVsc2UgaWYgKC9ecyhoaWZ0KSQvaS50ZXN0KG1vZCkpIHNoaWZ0ID0gdHJ1ZVxuICAgIGVsc2UgdGhyb3cgbmV3IEVycm9yKFwiVW5yZWNvZ25pemVkIG1vZGlmaWVyIG5hbWU6IFwiICsgbW9kKVxuICB9XG4gIGlmIChhbHQpIG5hbWUgPSBcIkFsdC1cIiArIG5hbWVcbiAgaWYgKGN0cmwpIG5hbWUgPSBcIkN0cmwtXCIgKyBuYW1lXG4gIGlmIChjbWQpIG5hbWUgPSBcIkNtZC1cIiArIG5hbWVcbiAgaWYgKHNoaWZ0KSBuYW1lID0gXCJTaGlmdC1cIiArIG5hbWVcbiAgcmV0dXJuIG5hbWVcbn1cblxuZXhwb3J0IGNsYXNzIEtleW1hcCB7XG4gIGNvbnN0cnVjdG9yKGtleXMsIG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgdGhpcy5iaW5kaW5ncyA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgICBpZiAoa2V5cykgZm9yIChsZXQga2V5bmFtZSBpbiBrZXlzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGtleXMsIGtleW5hbWUpKVxuICAgICAgdGhpcy5hZGRCaW5kaW5nKGtleW5hbWUsIGtleXNba2V5bmFtZV0pXG4gIH1cblxuICBhZGRCaW5kaW5nKGtleW5hbWUsIHZhbHVlKSB7XG4gICAgbGV0IGtleXMgPSBrZXluYW1lLnNwbGl0KFwiIFwiKS5tYXAobm9ybWFsaXplS2V5TmFtZSlcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBuYW1lID0ga2V5cy5zbGljZSgwLCBpICsgMSkuam9pbihcIiBcIilcbiAgICAgIGxldCB2YWwgPSBpID09IGtleXMubGVuZ3RoIC0gMSA/IHZhbHVlIDogXCIuLi5cIlxuICAgICAgbGV0IHByZXYgPSB0aGlzLmJpbmRpbmdzW25hbWVdXG4gICAgICBpZiAoIXByZXYpIHRoaXMuYmluZGluZ3NbbmFtZV0gPSB2YWxcbiAgICAgIGVsc2UgaWYgKHByZXYgIT0gdmFsKSB0aHJvdyBuZXcgRXJyb3IoXCJJbmNvbnNpc3RlbnQgYmluZGluZ3MgZm9yIFwiICsgbmFtZSlcbiAgICB9XG4gIH1cblxuICByZW1vdmVCaW5kaW5nKGtleW5hbWUpIHtcbiAgICBsZXQga2V5cyA9IGtleW5hbWUuc3BsaXQoXCIgXCIpLm1hcChub3JtYWxpemVLZXlOYW1lKVxuICAgIGZvciAobGV0IGkgPSBrZXlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBsZXQgbmFtZSA9IGtleXMuc2xpY2UoMCwgaSkuam9pbihcIiBcIilcbiAgICAgIGxldCB2YWwgPSB0aGlzLmJpbmRpbmdzW25hbWVdXG4gICAgICBpZiAodmFsID09IFwiLi4uXCIgJiYgIXRoaXMudW51c2VkTXVsdGkobmFtZSkpXG4gICAgICAgIGJyZWFrXG4gICAgICBlbHNlIGlmICh2YWwpXG4gICAgICAgIGRlbGV0ZSB0aGlzLmJpbmRpbmdzW25hbWVdXG4gICAgfVxuICB9XG5cbiAgdW51c2VkTXVsdGkobmFtZSkge1xuICAgIGZvciAobGV0IGJpbmRpbmcgaW4gdGhpcy5iaW5kaW5ncylcbiAgICAgIGlmIChiaW5kaW5nLmxlbmd0aCA+IG5hbWUgJiYgYmluZGluZy5pbmRleE9mKG5hbWUpID09IDAgJiYgYmluZGluZy5jaGFyQXQobmFtZS5sZW5ndGgpID09IFwiIFwiKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb29rdXBLZXkoa2V5LCBtYXAsIGhhbmRsZSwgY29udGV4dCkge1xuICBsZXQgZm91bmQgPSBtYXAub3B0aW9ucy5jYWxsID8gbWFwLm9wdGlvbnMuY2FsbChrZXksIGNvbnRleHQpIDogbWFwLmJpbmRpbmdzW2tleV1cbiAgaWYgKGZvdW5kID09PSBmYWxzZSkgcmV0dXJuIFwibm90aGluZ1wiXG4gIGlmIChmb3VuZCA9PT0gXCIuLi5cIikgcmV0dXJuIFwibXVsdGlcIlxuICBpZiAoZm91bmQgIT0gbnVsbCAmJiBoYW5kbGUoZm91bmQpKSByZXR1cm4gXCJoYW5kbGVkXCJcblxuICBsZXQgZmFsbCA9IG1hcC5vcHRpb25zLmZhbGx0aHJvdWdoXG4gIGlmIChmYWxsKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGZhbGwpKVxuICAgICAgcmV0dXJuIGxvb2t1cEtleShrZXksIGZhbGwsIGhhbmRsZSwgY29udGV4dClcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZhbGwubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCByZXN1bHQgPSBsb29rdXBLZXkoa2V5LCBmYWxsW2ldLCBoYW5kbGUsIGNvbnRleHQpXG4gICAgICBpZiAocmVzdWx0KSByZXR1cm4gcmVzdWx0XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgXCIuL2Nzc1wiXG5cbmltcG9ydCB7c3BhblN0eWxlc0F0LCByYW5nZUhhc1N0eWxlLCBzdHlsZSwgc2xpY2VCZXR3ZWVuLCBQb3N9IGZyb20gXCIuLi9tb2RlbFwiXG5pbXBvcnQge1RyYW5zZm9ybX0gZnJvbSBcIi4uL3RyYW5zZm9ybVwiXG5cbmltcG9ydCB7cGFyc2VPcHRpb25zLCBpbml0T3B0aW9ucywgc2V0T3B0aW9ufSBmcm9tIFwiLi9vcHRpb25zXCJcbmltcG9ydCB7U2VsZWN0aW9uLCBSYW5nZSwgcG9zQXRDb29yZHMsIGNvb3Jkc0F0UG9zLCBzY3JvbGxJbnRvVmlldywgaGFzRm9jdXN9IGZyb20gXCIuL3NlbGVjdGlvblwiXG5pbXBvcnQge3JlcXVlc3RBbmltYXRpb25GcmFtZSwgZWx0fSBmcm9tIFwiLi4vZG9tXCJcbmltcG9ydCB7ZHJhdywgcmVkcmF3fSBmcm9tIFwiLi9kcmF3XCJcbmltcG9ydCB7SW5wdXR9IGZyb20gXCIuL2lucHV0XCJcbmltcG9ydCB7SGlzdG9yeX0gZnJvbSBcIi4vaGlzdG9yeVwiXG5pbXBvcnQge2V2ZW50TWl4aW59IGZyb20gXCIuL2V2ZW50XCJcbmltcG9ydCB7dG9UZXh0fSBmcm9tIFwiLi4vY29udmVydC90b190ZXh0XCJcbmltcG9ydCBcIi4uL2NvbnZlcnQvZnJvbV90ZXh0XCJcbmltcG9ydCB7Y29udmVydEZyb20sIGNvbnZlcnRUb30gZnJvbSBcIi4uL2NvbnZlcnQvY29udmVydFwiXG5pbXBvcnQge2V4ZWNDb21tYW5kfSBmcm9tIFwiLi9jb21tYW5kc1wiXG5pbXBvcnQge1JhbmdlU3RvcmUsIE1hcmtlZFJhbmdlfSBmcm9tIFwiLi9yYW5nZVwiXG5cbmV4cG9ydCBjbGFzcyBQcm9zZU1pcnJvciB7XG4gIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICBvcHRzID0gdGhpcy5vcHRpb25zID0gcGFyc2VPcHRpb25zKG9wdHMpXG4gICAgdGhpcy5jb250ZW50ID0gZWx0KFwiZGl2XCIsIHtjbGFzczogXCJQcm9zZU1pcnJvci1jb250ZW50XCJ9KVxuICAgIHRoaXMud3JhcHBlciA9IGVsdChcImRpdlwiLCB7Y2xhc3M6IFwiUHJvc2VNaXJyb3JcIn0sIHRoaXMuY29udGVudClcbiAgICB0aGlzLndyYXBwZXIuUHJvc2VNaXJyb3IgPSB0aGlzXG5cbiAgICBpZiAob3B0cy5wbGFjZSAmJiBvcHRzLnBsYWNlLmFwcGVuZENoaWxkKVxuICAgICAgb3B0cy5wbGFjZS5hcHBlbmRDaGlsZCh0aGlzLndyYXBwZXIpXG4gICAgZWxzZSBpZiAob3B0cy5wbGFjZSlcbiAgICAgIG9wdHMucGxhY2UodGhpcy53cmFwcGVyKVxuXG4gICAgdGhpcy5zZXREb2NJbm5lcihvcHRzLmRvY0Zvcm1hdCA/IGNvbnZlcnRGcm9tKG9wdHMuZG9jLCBvcHRzLmRvY0Zvcm1hdCwge2RvY3VtZW50fSkgOiBvcHRzLmRvYylcbiAgICBkcmF3KHRoaXMsIHRoaXMuZG9jKVxuICAgIHRoaXMuY29udGVudC5jb250ZW50RWRpdGFibGUgPSB0cnVlXG5cbiAgICB0aGlzLm1vZCA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgICB0aGlzLm9wZXJhdGlvbiA9IG51bGxcbiAgICB0aGlzLmZsdXNoU2NoZWR1bGVkID0gZmFsc2VcblxuICAgIHRoaXMuc2VsID0gbmV3IFNlbGVjdGlvbih0aGlzKVxuICAgIHRoaXMuaW5wdXQgPSBuZXcgSW5wdXQodGhpcylcblxuICAgIGluaXRPcHRpb25zKHRoaXMpXG4gIH1cblxuICBnZXQgc2VsZWN0aW9uKCkge1xuICAgIHRoaXMuZW5zdXJlT3BlcmF0aW9uKClcbiAgICByZXR1cm4gdGhpcy5zZWwucmFuZ2VcbiAgfVxuXG4gIGdldCBzZWxlY3RlZERvYygpIHtcbiAgICBsZXQgc2VsID0gdGhpcy5zZWxlY3Rpb25cbiAgICByZXR1cm4gc2xpY2VCZXR3ZWVuKHRoaXMuZG9jLCBzZWwuZnJvbSwgc2VsLnRvKVxuICB9XG5cbiAgZ2V0IHNlbGVjdGVkVGV4dCgpIHtcbiAgICByZXR1cm4gdG9UZXh0KHRoaXMuc2VsZWN0ZWREb2MpXG4gIH1cblxuICBhcHBseSh0cmFuc2Zvcm0sIG9wdGlvbnMgPSBudWxsT3B0aW9ucykge1xuICAgIGlmICh0cmFuc2Zvcm0uZG9jID09IHRoaXMuZG9jKSByZXR1cm4gZmFsc2VcblxuICAgIHRoaXMudXBkYXRlRG9jKHRyYW5zZm9ybS5kb2MsIHRyYW5zZm9ybSlcbiAgICB0aGlzLnNpZ25hbChcInRyYW5zZm9ybVwiLCB0cmFuc2Zvcm0sIG9wdGlvbnMpXG4gICAgcmV0dXJuIHRyYW5zZm9ybVxuICB9XG5cbiAgZ2V0IHRyKCkgeyByZXR1cm4gbmV3IFRyYW5zZm9ybSh0aGlzLmRvYykgfVxuXG4gIHNldENvbnRlbnQodmFsdWUsIGZvcm1hdCkge1xuICAgIGlmIChmb3JtYXQpIHZhbHVlID0gY29udmVydEZyb20odmFsdWUsIGZvcm1hdCwge2RvY3VtZW50fSlcbiAgICB0aGlzLnNldERvYyh2YWx1ZSlcbiAgfVxuXG4gIGdldENvbnRlbnQoZm9ybWF0KSB7XG4gICAgcmV0dXJuIGZvcm1hdCA/IGNvbnZlcnRUbyh0aGlzLmRvYywgZm9ybWF0LCB7ZG9jdW1lbnR9KSA6IHRoaXMuZG9jXG4gIH1cblxuICBzZXREb2NJbm5lcihkb2MpIHtcbiAgICB0aGlzLmRvYyA9IGRvY1xuICAgIHRoaXMucmFuZ2VzID0gbmV3IFJhbmdlU3RvcmUodGhpcylcbiAgICB0aGlzLmhpc3RvcnkgPSBuZXcgSGlzdG9yeSh0aGlzKVxuICB9XG5cbiAgc2V0RG9jKGRvYywgc2VsKSB7XG4gICAgaWYgKCFzZWwpIHtcbiAgICAgIGxldCBzdGFydCA9IFBvcy5zdGFydChkb2MpXG4gICAgICBzZWwgPSBuZXcgUmFuZ2Uoc3RhcnQsIHN0YXJ0KVxuICAgIH1cbiAgICB0aGlzLnNpZ25hbChcImJlZm9yZVNldERvY1wiLCBkb2MsIHNlbClcbiAgICB0aGlzLmVuc3VyZU9wZXJhdGlvbigpXG4gICAgdGhpcy5zZXREb2NJbm5lcihkb2MpXG4gICAgdGhpcy5zZWwuc2V0KHNlbCwgdHJ1ZSlcbiAgICB0aGlzLnNpZ25hbChcInNldERvY1wiLCBkb2MsIHNlbClcbiAgfVxuXG4gIHVwZGF0ZURvYyhkb2MsIG1hcHBpbmcpIHtcbiAgICB0aGlzLmVuc3VyZU9wZXJhdGlvbigpXG4gICAgdGhpcy5pbnB1dC5tYXliZUFib3J0Q29tcG9zaXRpb24oKVxuICAgIHRoaXMucmFuZ2VzLnRyYW5zZm9ybShtYXBwaW5nKVxuICAgIHRoaXMuZG9jID0gZG9jXG4gICAgbGV0IHJhbmdlID0gdGhpcy5zZWwucmFuZ2VcbiAgICB0aGlzLnNlbC5zZXRBbmRTaWduYWwobmV3IFJhbmdlKG1hcHBpbmcubWFwKHJhbmdlLmFuY2hvcikucG9zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwcGluZy5tYXAocmFuZ2UuaGVhZCkucG9zKSlcbiAgICB0aGlzLnNpZ25hbChcImNoYW5nZVwiKVxuICB9XG5cbiAgY2hlY2tQb3MocG9zLCBibG9jaykge1xuICAgIGlmICghdGhpcy5kb2MuaXNWYWxpZFBvcyhwb3MsIGJsb2NrKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlBvc2l0aW9uIFwiICsgcG9zICsgXCIgaXMgbm90IHZhbGlkIGluIGN1cnJlbnQgZG9jdW1lbnRcIilcbiAgfVxuXG4gIHNldFNlbGVjdGlvbihyYW5nZU9yQW5jaG9yLCBoZWFkKSB7XG4gICAgbGV0IHJhbmdlID0gcmFuZ2VPckFuY2hvclxuICAgIGlmICghKHJhbmdlIGluc3RhbmNlb2YgUmFuZ2UpKVxuICAgICAgcmFuZ2UgPSBuZXcgUmFuZ2UocmFuZ2VPckFuY2hvciwgaGVhZCB8fCByYW5nZU9yQW5jaG9yKVxuICAgIHRoaXMuY2hlY2tQb3MocmFuZ2UuaGVhZCwgdHJ1ZSlcbiAgICB0aGlzLmNoZWNrUG9zKHJhbmdlLmFuY2hvciwgdHJ1ZSlcbiAgICB0aGlzLmVuc3VyZU9wZXJhdGlvbigpXG4gICAgdGhpcy5pbnB1dC5tYXliZUFib3J0Q29tcG9zaXRpb24oKVxuICAgIGlmIChyYW5nZS5oZWFkLmNtcCh0aGlzLnNlbC5yYW5nZS5oZWFkKSB8fFxuICAgICAgICByYW5nZS5hbmNob3IuY21wKHRoaXMuc2VsLnJhbmdlLmFuY2hvcikpXG4gICAgICB0aGlzLnNlbC5zZXRBbmRTaWduYWwocmFuZ2UpXG4gIH1cblxuICBlbnN1cmVPcGVyYXRpb24oKSB7XG4gICAgaWYgKCF0aGlzLm9wZXJhdGlvbikge1xuICAgICAgaWYgKCF0aGlzLmlucHV0LnN1cHByZXNzUG9sbGluZykgdGhpcy5zZWwucG9sbCgpXG4gICAgICB0aGlzLm9wZXJhdGlvbiA9IG5ldyBPcGVyYXRpb24odGhpcylcbiAgICB9XG4gICAgaWYgKCF0aGlzLmZsdXNoU2NoZWR1bGVkKSB7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICB0aGlzLmZsdXNoU2NoZWR1bGVkID0gZmFsc2VcbiAgICAgICAgdGhpcy5mbHVzaCgpXG4gICAgICB9KVxuICAgICAgdGhpcy5mbHVzaFNjaGVkdWxlZCA9IHRydWVcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMub3BlcmF0aW9uXG4gIH1cblxuICBmbHVzaCgpIHtcbiAgICBsZXQgb3AgPSB0aGlzLm9wZXJhdGlvblxuICAgIGlmICghb3AgfHwgIWRvY3VtZW50LmJvZHkuY29udGFpbnModGhpcy53cmFwcGVyKSkgcmV0dXJuXG4gICAgdGhpcy5vcGVyYXRpb24gPSBudWxsXG5cbiAgICBsZXQgZG9jQ2hhbmdlZCA9IG9wLmRvYyAhPSB0aGlzLmRvYyB8fCB0aGlzLnJhbmdlcy5kaXJ0eS5zaXplXG4gICAgaWYgKGRvY0NoYW5nZWQgJiYgIXRoaXMuaW5wdXQuY29tcG9zaW5nKSB7XG4gICAgICBpZiAob3AuZnVsbFJlZHJhdykgZHJhdyh0aGlzLCB0aGlzLmRvYykgLy8gRklYTUUgb25seSByZWRyYXcgdGFyZ2V0IGJsb2NrIGNvbXBvc2l0aW9uXG4gICAgICBlbHNlIHJlZHJhdyh0aGlzLCB0aGlzLnJhbmdlcy5kaXJ0eSwgdGhpcy5kb2MsIG9wLmRvYylcbiAgICAgIHRoaXMucmFuZ2VzLnJlc2V0RGlydHkoKVxuICAgIH1cbiAgICBpZiAoKGRvY0NoYW5nZWQgfHwgb3Auc2VsLmFuY2hvci5jbXAodGhpcy5zZWwucmFuZ2UuYW5jaG9yKSB8fCBvcC5zZWwuaGVhZC5jbXAodGhpcy5zZWwucmFuZ2UuaGVhZCkpICYmXG4gICAgICAgICF0aGlzLmlucHV0LmNvbXBvc2luZylcbiAgICAgIHRoaXMuc2VsLnRvRE9NKGRvY0NoYW5nZWQsIG9wLmZvY3VzKVxuICAgIGlmIChvcC5zY3JvbGxJbnRvVmlldyAhPT0gZmFsc2UpXG4gICAgICBzY3JvbGxJbnRvVmlldyh0aGlzLCBvcC5zY3JvbGxJbnRvVmlldylcbiAgICBpZiAoZG9jQ2hhbmdlZCkgdGhpcy5zaWduYWwoXCJkcmF3XCIpXG4gICAgdGhpcy5zaWduYWwoXCJmbHVzaFwiKVxuICB9XG5cbiAgc2V0T3B0aW9uKG5hbWUsIHZhbHVlKSB7IHNldE9wdGlvbih0aGlzLCBuYW1lLCB2YWx1ZSkgfVxuICBnZXRPcHRpb24obmFtZSkgeyByZXR1cm4gdGhpcy5vcHRpb25zW25hbWVdIH1cblxuICBhZGRLZXltYXAobWFwLCBib3R0b20pIHtcbiAgICB0aGlzLmlucHV0LmtleW1hcHNbYm90dG9tID8gXCJwdXNoXCIgOiBcInVuc2hpZnRcIl0obWFwKVxuICB9XG5cbiAgcmVtb3ZlS2V5bWFwKG1hcCkge1xuICAgIGxldCBtYXBzID0gdGhpcy5pbnB1dC5rZXltYXBzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXBzLmxlbmd0aDsgKytpKSBpZiAobWFwc1tpXSA9PSBtYXAgfHwgbWFwc1tpXS5vcHRpb25zLm5hbWUgPT0gbWFwKSB7XG4gICAgICBtYXBzLnNwbGljZShpLCAxKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICBtYXJrUmFuZ2UoZnJvbSwgdG8sIG9wdGlvbnMpIHtcbiAgICB0aGlzLmNoZWNrUG9zKGZyb20pXG4gICAgdGhpcy5jaGVja1Bvcyh0bylcbiAgICBsZXQgcmFuZ2UgPSBuZXcgTWFya2VkUmFuZ2UoZnJvbSwgdG8sIG9wdGlvbnMpXG4gICAgdGhpcy5yYW5nZXMuYWRkUmFuZ2UocmFuZ2UpXG4gICAgcmV0dXJuIHJhbmdlXG4gIH1cblxuICByZW1vdmVSYW5nZShyYW5nZSkge1xuICAgIHRoaXMucmFuZ2VzLnJlbW92ZVJhbmdlKHJhbmdlKVxuICB9XG5cbiAgZXh0ZW5kQ29tbWFuZChuYW1lLCBwcmlvcml0eSwgZikge1xuICAgIGlmIChmID09IG51bGwpIHsgZiA9IHByaW9yaXR5OyBwcmlvcml0eSA9IFwibm9ybWFsXCI7IH1cbiAgICBpZiAoIS9eKG5vcm1hbHxsb3d8aGlnaCkkLy50ZXN0KHByaW9yaXR5KSkgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBwcmlvcml0eTogXCIgKyBwcmlvcml0eSlcbiAgICB0aGlzLmlucHV0LmV4dGVuZENvbW1hbmQobmFtZSwgcHJpb3JpdHksIGYpXG4gIH1cblxuICB1bmV4dGVuZENvbW1hbmQobmFtZSwgcHJpb3JpdHksIGYpIHtcbiAgICBpZiAoZiA9PSBudWxsKSB7IGYgPSBwcmlvcml0eTsgcHJpb3JpdHkgPSBcIm5vcm1hbFwiOyB9XG4gICAgdGhpcy5pbnB1dC51bmV4dGVuZENvbW1hbmQobmFtZSwgcHJpb3JpdHksIGYpXG4gIH1cblxuICBzZXRJbmxpbmVTdHlsZShzdCwgdG8sIHJhbmdlKSB7XG4gICAgaWYgKCFyYW5nZSkgcmFuZ2UgPSB0aGlzLnNlbGVjdGlvblxuICAgIGlmICghcmFuZ2UuZW1wdHkpIHtcbiAgICAgIGlmICh0byA9PSBudWxsKSB0byA9ICFyYW5nZUhhc1N0eWxlKHRoaXMuZG9jLCByYW5nZS5mcm9tLCByYW5nZS50bywgc3QudHlwZSlcbiAgICAgIHRoaXMuYXBwbHkodGhpcy50clt0byA/IFwiYWRkU3R5bGVcIiA6IFwicmVtb3ZlU3R5bGVcIl0ocmFuZ2UuZnJvbSwgcmFuZ2UudG8sIHN0KSlcbiAgICB9IGVsc2UgaWYgKCF0aGlzLmRvYy5wYXRoKHJhbmdlLmhlYWQucGF0aCkudHlwZS5wbGFpblRleHQgJiYgcmFuZ2UgPT0gdGhpcy5zZWxlY3Rpb24pIHtcbiAgICAgIGxldCBzdHlsZXMgPSB0aGlzLmFjdGl2ZVN0eWxlcygpXG4gICAgICBpZiAodG8gPT0gbnVsbCkgdG8gPSAhc3R5bGUuY29udGFpbnMoc3R5bGVzLCBzdClcbiAgICAgIHRoaXMuaW5wdXQuc3RvcmVkU3R5bGVzID0gdG8gPyBzdHlsZS5hZGQoc3R5bGVzLCBzdCkgOiBzdHlsZS5yZW1vdmUoc3R5bGVzLCBzdClcbiAgICAgIHRoaXMuc2lnbmFsKFwiYWN0aXZlU3R5bGVDaGFuZ2VcIilcbiAgICB9XG4gIH1cblxuICBhY3RpdmVTdHlsZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5wdXQuc3RvcmVkU3R5bGVzIHx8IHNwYW5TdHlsZXNBdCh0aGlzLmRvYywgdGhpcy5zZWxlY3Rpb24uaGVhZClcbiAgfVxuXG4gIGZvY3VzKCkge1xuICAgIGlmICh0aGlzLm9wZXJhdGlvbikgdGhpcy5vcGVyYXRpb24uZm9jdXMgPSB0cnVlXG4gICAgZWxzZSB0aGlzLnNlbC50b0RPTShmYWxzZSwgdHJ1ZSlcbiAgfVxuXG4gIGhhc0ZvY3VzKCkge1xuICAgIHJldHVybiBoYXNGb2N1cyh0aGlzKVxuICB9XG5cbiAgcG9zQXRDb29yZHMoY29vcmRzKSB7XG4gICAgcmV0dXJuIHBvc0F0Q29vcmRzKHRoaXMsIGNvb3JkcylcbiAgfVxuXG4gIGNvb3Jkc0F0UG9zKHBvcykge1xuICAgIHRoaXMuY2hlY2tQb3MocG9zKVxuICAgIHJldHVybiBjb29yZHNBdFBvcyh0aGlzLCBwb3MpXG4gIH1cblxuICBzY3JvbGxJbnRvVmlldyhwb3MgPSBudWxsKSB7XG4gICAgaWYgKHBvcykgdGhpcy5jaGVja1Bvcyhwb3MpXG4gICAgdGhpcy5lbnN1cmVPcGVyYXRpb24oKVxuICAgIHRoaXMub3BlcmF0aW9uLnNjcm9sbEludG9WaWV3ID0gcG9zXG4gIH1cblxuICBleGVjQ29tbWFuZChuYW1lKSB7IGV4ZWNDb21tYW5kKHRoaXMsIG5hbWUpIH1cbn1cblxuY29uc3QgbnVsbE9wdGlvbnMgPSB7fVxuXG5ldmVudE1peGluKFByb3NlTWlycm9yKVxuXG5jbGFzcyBPcGVyYXRpb24ge1xuICBjb25zdHJ1Y3RvcihwbSkge1xuICAgIHRoaXMuZG9jID0gcG0uZG9jXG4gICAgdGhpcy5zZWwgPSBwbS5zZWwucmFuZ2VcbiAgICB0aGlzLnNjcm9sbEludG9WaWV3ID0gZmFsc2VcbiAgICB0aGlzLmZvY3VzID0gZmFsc2VcbiAgICB0aGlzLmZ1bGxSZWRyYXcgPSAhIXBtLmlucHV0LmNvbXBvc2luZ1xuICB9XG59XG4iLCJleHBvcnQgY29uc3QgTWFwID0gd2luZG93Lk1hcCB8fCBjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKCkgeyB0aGlzLmNvbnRlbnQgPSBbXSB9XG4gIHNldChrZXksIHZhbHVlKSB7XG4gICAgbGV0IGZvdW5kID0gdGhpcy5maW5kKGtleSlcbiAgICBpZiAoZm91bmQgPiAtMSkgdGhpcy5jb250ZW50W2ZvdW5kICsgMV0gPSB2YWx1ZVxuICAgIGVsc2UgdGhpcy5jb250ZW50LnB1c2goa2V5LCB2YWx1ZSlcbiAgfVxuICBnZXQoa2V5KSB7XG4gICAgbGV0IGZvdW5kID0gdGhpcy5maW5kKGtleSlcbiAgICByZXR1cm4gZm91bmQgPT0gLTEgPyB1bmRlZmluZWQgOiB0aGlzLmNvbnRlbnRbZm91bmQgKyAxXVxuICB9XG4gIGhhcyhrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5maW5kKGtleSkgPiAtMVxuICB9XG4gIGZpbmQoa2V5KSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNvbnRlbnQubGVuZ3RoOyBpICs9IDIpXG4gICAgICBpZiAodGhpcy5jb250ZW50W2ldID09PSBrZXkpIHJldHVybiBpXG4gIH1cbiAgZ2V0IHNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGVudC5sZW5ndGggLyAyXG4gIH1cbn1cbiIsImltcG9ydCB7Tm9kZX0gZnJvbSBcIi4uL21vZGVsXCJcblxuaW1wb3J0IHtkZWZhdWx0S2V5bWFwfSBmcm9tIFwiLi9kZWZhdWx0a2V5bWFwXCJcbmltcG9ydCB7S2V5bWFwfSBmcm9tIFwiLi9rZXlzXCJcblxuY2xhc3MgT3B0aW9uIHtcbiAgY29uc3RydWN0b3IoZGVmYXVsdFZhbHVlLCB1cGRhdGUsIHVwZGF0ZU9uSW5pdCkge1xuICAgIHRoaXMuZGVmYXVsdFZhbHVlID0gZGVmYXVsdFZhbHVlXG4gICAgdGhpcy51cGRhdGUgPSB1cGRhdGVcbiAgICB0aGlzLnVwZGF0ZU9uSW5pdCA9IHVwZGF0ZU9uSW5pdCAhPT0gZmFsc2VcbiAgfVxufVxuXG5jb25zdCBvcHRpb25zID0ge1xuICBfX3Byb3RvX186IG51bGwsXG5cbiAgZG9jOiBuZXcgT3B0aW9uKG5ldyBOb2RlKFwiZG9jXCIsIG51bGwsIFtuZXcgTm9kZShcInBhcmFncmFwaFwiKV0pLCBmdW5jdGlvbihwbSwgdmFsdWUpIHtcbiAgICBwbS5zZXREb2ModmFsdWUpXG4gIH0sIGZhbHNlKSxcblxuICBkb2NGb3JtYXQ6IG5ldyBPcHRpb24obnVsbCksXG5cbiAgcGxhY2U6IG5ldyBPcHRpb24obnVsbCksXG5cbiAga2V5bWFwOiBuZXcgT3B0aW9uKGRlZmF1bHRLZXltYXApLFxuXG4gIGV4dHJhS2V5bWFwOiBuZXcgT3B0aW9uKG5ldyBLZXltYXApLFxuXG4gIGhpc3RvcnlEZXB0aDogbmV3IE9wdGlvbig1MCksXG5cbiAgaGlzdG9yeUV2ZW50RGVsYXk6IG5ldyBPcHRpb24oNTAwKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lT3B0aW9uKG5hbWUsIGRlZmF1bHRWYWx1ZSwgdXBkYXRlLCB1cGRhdGVPbkluaXQpIHtcbiAgb3B0aW9uc1tuYW1lXSA9IG5ldyBPcHRpb24oZGVmYXVsdFZhbHVlLCB1cGRhdGUsIHVwZGF0ZU9uSW5pdClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlT3B0aW9ucyhvYmopIHtcbiAgbGV0IHJlc3VsdCA9IE9iamVjdC5jcmVhdGUobnVsbClcbiAgbGV0IGdpdmVuID0gb2JqID8gW29ial0uY29uY2F0KG9iai51c2UgfHwgW10pIDogW11cbiAgb3V0ZXI6IGZvciAobGV0IG9wdCBpbiBvcHRpb25zKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBnaXZlbi5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKG9wdCBpbiBnaXZlbltpXSkge1xuICAgICAgICByZXN1bHRbb3B0XSA9IGdpdmVuW2ldW29wdF1cbiAgICAgICAgY29udGludWUgb3V0ZXJcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0W29wdF0gPSBvcHRpb25zW29wdF0uZGVmYXVsdFZhbHVlXG4gIH1cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdE9wdGlvbnMocG0pIHtcbiAgZm9yICh2YXIgb3B0IGluIG9wdGlvbnMpIHtcbiAgICBsZXQgZGVzYyA9IG9wdGlvbnNbb3B0XVxuICAgIGlmIChkZXNjLnVwZGF0ZSAmJiBkZXNjLnVwZGF0ZU9uSW5pdClcbiAgICAgIGRlc2MudXBkYXRlKHBtLCBwbS5vcHRpb25zW29wdF0sIG51bGwsIHRydWUpXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldE9wdGlvbihwbSwgbmFtZSwgdmFsdWUpIHtcbiAgbGV0IG9sZCA9IHBtLm9wdGlvbnNbbmFtZV1cbiAgcG0ub3B0aW9uc1tuYW1lXSA9IHZhbHVlXG4gIGxldCBkZXNjID0gb3B0aW9uc1tuYW1lXVxuICBpZiAoZGVzYy51cGRhdGUpIGRlc2MudXBkYXRlKHBtLCB2YWx1ZSwgb2xkLCBmYWxzZSlcbn1cbiIsImltcG9ydCB7TWFwfSBmcm9tIFwiLi9tYXBcIlxuaW1wb3J0IHtldmVudE1peGlufSBmcm9tIFwiLi9ldmVudFwiXG5cbmV4cG9ydCBjbGFzcyBNYXJrZWRSYW5nZSB7XG4gIGNvbnN0cnVjdG9yKGZyb20sIHRvLCBvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgIHRoaXMuZnJvbSA9IGZyb21cbiAgICB0aGlzLnRvID0gdG9cbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuc2lnbmFsKFwicmVtb3ZlZFwiLCB0aGlzLmZyb20pXG4gICAgdGhpcy5mcm9tID0gdGhpcy50byA9IG51bGxcbiAgfVxufVxuXG5ldmVudE1peGluKE1hcmtlZFJhbmdlKVxuXG5jbGFzcyBSYW5nZVNvcnRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc29ydGVkID0gW11cbiAgfVxuXG4gIGZpbmQoYXQpIHtcbiAgICBsZXQgbWluID0gMCwgbWF4ID0gdGhpcy5zb3J0ZWQubGVuZ3RoXG4gICAgZm9yICg7Oykge1xuICAgICAgaWYgKG1heCA8IG1pbiArIDEwKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSBtaW47IGkgPCBtYXg7IGkrKylcbiAgICAgICAgICBpZiAodGhpcy5zb3J0ZWRbaV0uYXQuY21wKGF0KSA+PSAwKSByZXR1cm4gaVxuICAgICAgICByZXR1cm4gbWF4XG4gICAgICB9XG4gICAgICBsZXQgbWlkID0gKG1pbiArIG1heCkgPj4gMVxuICAgICAgaWYgKHRoaXMuc29ydGVkW21pZF0uYXQuY21wKGF0KSA+IDApIG1heCA9IG1pZFxuICAgICAgZWxzZSBtaW4gPSBtaWRcbiAgICB9XG4gIH1cblxuICBpbnNlcnQob2JqKSB7XG4gICAgdGhpcy5zb3J0ZWQuc3BsaWNlKHRoaXMuZmluZChvYmouYXQpLCAwLCBvYmopXG4gIH1cblxuICByZW1vdmUoYXQsIHJhbmdlKSB7XG4gICAgbGV0IHBvcyA9IHRoaXMuZmluZChhdClcbiAgICBmb3IgKGxldCBkaXN0ID0gMDs7IGRpc3QrKykge1xuICAgICAgbGV0IGxlZnRQb3MgPSBwb3MgLSBkaXN0IC0gMSwgcmlnaHRQb3MgPSBwb3MgKyBkaXN0XG4gICAgICBpZiAobGVmdFBvcyA+PSAwICYmIHRoaXMuc29ydGVkW2xlZnRQb3NdLnJhbmdlID09IHJhbmdlKSB7XG4gICAgICAgIHRoaXMuc29ydGVkLnNwbGljZShsZWZ0UG9zLCAxKVxuICAgICAgICByZXR1cm5cbiAgICAgIH0gZWxzZSBpZiAocmlnaHRQb3MgPCB0aGlzLnNvcnRlZC5sZW5ndGggJiYgdGhpcy5zb3J0ZWRbcmlnaHRQb3NdLnJhbmdlID09IHJhbmdlKSB7XG4gICAgICAgIHRoaXMuc29ydGVkLnNwbGljZShyaWdodFBvcywgMSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVzb3J0KCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zb3J0ZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBjdXIgPSB0aGlzLnNvcnRlZFtpXVxuICAgICAgbGV0IGF0ID0gY3VyLmF0ID0gY3VyLnR5cGUgPT0gXCJvcGVuXCIgPyBjdXIucmFuZ2UuZnJvbSA6IGN1ci5yYW5nZS50b1xuICAgICAgbGV0IHBvcyA9IGlcbiAgICAgIHdoaWxlIChwb3MgPiAwICYmIHRoaXMuc29ydGVkW3BvcyAtIDFdLmF0LmNtcChhdCkgPiAwKSB7XG4gICAgICAgIHRoaXMuc29ydGVkW3Bvc10gPSB0aGlzLnNvcnRlZFtwb3MgLSAxXVxuICAgICAgICB0aGlzLnNvcnRlZFstLXBvc10gPSBjdXJcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJhbmdlU3RvcmUge1xuICBjb25zdHJ1Y3RvcihwbSkge1xuICAgIHRoaXMucG0gPSBwbVxuICAgIHRoaXMucmFuZ2VzID0gW11cbiAgICB0aGlzLnNvcnRlZCA9IG5ldyBSYW5nZVNvcnRlclxuICAgIHRoaXMucmVzZXREaXJ0eSgpXG4gIH1cblxuICByZXNldERpcnR5KCkge1xuICAgIHRoaXMuZGlydHkgPSBuZXcgTWFwXG4gIH1cblxuICBhZGRSYW5nZShyYW5nZSkge1xuICAgIHRoaXMucmFuZ2VzLnB1c2gocmFuZ2UpXG4gICAgdGhpcy5zb3J0ZWQuaW5zZXJ0KHt0eXBlOiBcIm9wZW5cIiwgYXQ6IHJhbmdlLmZyb20sIHJhbmdlOiByYW5nZX0pXG4gICAgdGhpcy5zb3J0ZWQuaW5zZXJ0KHt0eXBlOiBcImNsb3NlXCIsIGF0OiByYW5nZS50bywgcmFuZ2U6IHJhbmdlfSlcbiAgICB0aGlzLm1hcmtEaXNwbGF5RGlydHkocmFuZ2UpXG4gIH1cblxuICByZW1vdmVSYW5nZShyYW5nZSkge1xuICAgIGxldCBmb3VuZCA9IHRoaXMucmFuZ2VzLmluZGV4T2YocmFuZ2UpXG4gICAgaWYgKGZvdW5kID4gLTEpIHtcbiAgICAgIHRoaXMucmFuZ2VzLnNwbGljZShmb3VuZCwgMSlcbiAgICAgIHRoaXMuc29ydGVkLnJlbW92ZShyYW5nZS5mcm9tLCByYW5nZSlcbiAgICAgIHRoaXMuc29ydGVkLnJlbW92ZShyYW5nZS50bywgcmFuZ2UpXG4gICAgICB0aGlzLm1hcmtEaXNwbGF5RGlydHkocmFuZ2UpXG4gICAgICByYW5nZS5jbGVhcigpXG4gICAgfVxuICB9XG5cbiAgdHJhbnNmb3JtKG1hcHBpbmcpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucmFuZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgcmFuZ2UgPSB0aGlzLnJhbmdlc1tpXVxuICAgICAgcmFuZ2UuZnJvbSA9IG1hcHBpbmcubWFwKHJhbmdlLmZyb20sIHJhbmdlLm9wdGlvbnMuaW5jbHVzaXZlTGVmdCA/IC0xIDogMSkucG9zXG4gICAgICByYW5nZS50byA9IG1hcHBpbmcubWFwKHJhbmdlLnRvLCByYW5nZS5vcHRpb25zLmluY2x1c2l2ZVJpZ2h0ID8gMSA6IC0xKS5wb3NcbiAgICAgIGxldCBkaWZmID0gcmFuZ2UuZnJvbS5jbXAocmFuZ2UudG8pXG4gICAgICBpZiAocmFuZ2Uub3B0aW9ucy5jbGVhcldoZW5FbXB0eSAhPT0gZmFsc2UgJiYgZGlmZiA+PSAwKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlUmFuZ2UocmFuZ2UpXG4gICAgICAgIGktLVxuICAgICAgfSBlbHNlIGlmIChkaWZmID4gMCkge1xuICAgICAgICByYW5nZS50byA9IHJhbmdlLmZyb21cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5zb3J0ZWQucmVzb3J0KClcbiAgfVxuXG4gIG1hcmtEaXNwbGF5RGlydHkocmFuZ2UpIHtcbiAgICB0aGlzLnBtLmVuc3VyZU9wZXJhdGlvbigpXG4gICAgbGV0IGRpcnR5ID0gdGhpcy5kaXJ0eVxuICAgIGxldCBmcm9tID0gcmFuZ2UuZnJvbSwgdG8gPSByYW5nZS50b1xuICAgIGZvciAobGV0IGRlcHRoID0gMCwgbm9kZSA9IHRoaXMucG0uZG9jOzsgZGVwdGgrKykge1xuICAgICAgbGV0IGZyb21FbmQgPSBkZXB0aCA9PSBmcm9tLmRlcHRoLCB0b0VuZCA9IGRlcHRoID09IHRvLmRlcHRoXG4gICAgICBpZiAoIWZyb21FbmQgJiYgIXRvRW5kICYmIGZyb20ucGF0aFtkZXB0aF0gPT0gdG8ucGF0aFtkZXB0aF0pIHtcbiAgICAgICAgbGV0IGNoaWxkID0gbm9kZS5jb250ZW50W2Zyb20ucGF0aFtkZXB0aF1dXG4gICAgICAgIGlmICghZGlydHkuaGFzKGNoaWxkKSkgZGlydHkuc2V0KGNoaWxkLCAxKVxuICAgICAgICBub2RlID0gY2hpbGRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBzdGFydCA9IGZyb21FbmQgPyBmcm9tLm9mZnNldCA6IGZyb20ucGF0aFtkZXB0aF1cbiAgICAgICAgbGV0IGVuZCA9IHRvRW5kID8gdG8ub2Zmc2V0IDogdG8ucGF0aFtkZXB0aF0gKyAxXG4gICAgICAgIGlmIChub2RlLnR5cGUuYmxvY2spIHtcbiAgICAgICAgICBmb3IgKGxldCBvZmZzZXQgPSAwLCBpID0gMDsgb2Zmc2V0IDwgZW5kOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBjaGlsZCA9IG5vZGUuY29udGVudFtpXVxuICAgICAgICAgICAgb2Zmc2V0ICs9IGNoaWxkLnNpemVcbiAgICAgICAgICAgIGlmIChvZmZzZXQgPiBzdGFydCkgZGlydHkuc2V0KGNoaWxkLCAyKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKylcbiAgICAgICAgICAgIGRpcnR5LnNldChub2RlLmNvbnRlbnRbaV0sIDIpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhY3RpdmVSYW5nZVRyYWNrZXIoKSB7XG4gICAgcmV0dXJuIG5ldyBSYW5nZVRyYWNrZXIodGhpcy5zb3J0ZWQuc29ydGVkKVxuICB9XG59XG5cbmNsYXNzIFJhbmdlVHJhY2tlciB7XG4gIGNvbnN0cnVjdG9yKHNvcnRlZCkge1xuICAgIHRoaXMuc29ydGVkID0gc29ydGVkXG4gICAgdGhpcy5wb3MgPSAwXG4gICAgdGhpcy5jdXJyZW50ID0gW11cbiAgfVxuXG4gIGFkdmFuY2VUbyhwb3MpIHtcbiAgICBsZXQgbmV4dFxuICAgIHdoaWxlICh0aGlzLnBvcyA8IHRoaXMuc29ydGVkLmxlbmd0aCAmJiAobmV4dCA9IHRoaXMuc29ydGVkW3RoaXMucG9zXSkuYXQuY21wKHBvcykgPD0gMCkge1xuICAgICAgbGV0IGNsYXNzTmFtZSA9IG5leHQucmFuZ2Uub3B0aW9ucy5jbGFzc05hbWVcbiAgICAgIGlmICghY2xhc3NOYW1lKSBjb250aW51ZVxuICAgICAgaWYgKG5leHQudHlwZSA9PSBcIm9wZW5cIilcbiAgICAgICAgdGhpcy5jdXJyZW50LnB1c2goY2xhc3NOYW1lKVxuICAgICAgZWxzZVxuICAgICAgICB0aGlzLmN1cnJlbnQuc3BsaWNlKHRoaXMuY3VycmVudC5pbmRleE9mKGNsYXNzTmFtZSksIDEpXG4gICAgICB0aGlzLnBvcysrXG4gICAgfVxuICB9XG5cbiAgbmV4dENoYW5nZUJlZm9yZShwb3MpIHtcbiAgICBmb3IgKDs7KSB7XG4gICAgICBpZiAodGhpcy5wb3MgPT0gdGhpcy5zb3J0ZWQubGVuZ3RoKSByZXR1cm4gbnVsbFxuICAgICAgbGV0IG5leHQgPSB0aGlzLnNvcnRlZFt0aGlzLnBvc11cbiAgICAgIGlmICghbmV4dC5yYW5nZS5vcHRpb25zLmNsYXNzTmFtZSlcbiAgICAgICAgdGhpcy5wb3MrK1xuICAgICAgZWxzZSBpZiAobmV4dC5hdC5jbXAocG9zKSA+PSAwKVxuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gbmV4dC5hdC5vZmZzZXRcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7UG9zfSBmcm9tIFwiLi4vbW9kZWxcIlxuXG5pbXBvcnQge2NvbnRhaW5zLCBicm93c2VyfSBmcm9tIFwiLi4vZG9tXCJcblxuZXhwb3J0IGNsYXNzIFNlbGVjdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHBtKSB7XG4gICAgdGhpcy5wbSA9IHBtXG4gICAgdGhpcy5wb2xsaW5nID0gbnVsbFxuICAgIHRoaXMubGFzdEFuY2hvck5vZGUgPSB0aGlzLmxhc3RIZWFkTm9kZSA9IHRoaXMubGFzdEFuY2hvck9mZnNldCA9IHRoaXMubGFzdEhlYWRPZmZzZXQgPSBudWxsXG4gICAgbGV0IHN0YXJ0ID0gUG9zLnN0YXJ0KHBtLmRvYylcbiAgICB0aGlzLnJhbmdlID0gbmV3IFJhbmdlKHN0YXJ0LCBzdGFydClcbiAgICBwbS5jb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCAoKSA9PiB0aGlzLnJlY2VpdmVkRm9jdXMoKSlcbiAgfVxuXG4gIHNldEFuZFNpZ25hbChyYW5nZSwgY2xlYXJMYXN0KSB7XG4gICAgdGhpcy5zZXQocmFuZ2UsIGNsZWFyTGFzdClcbiAgICB0aGlzLnBtLnNpZ25hbChcInNlbGVjdGlvbkNoYW5nZVwiKVxuICB9XG5cbiAgc2V0KHJhbmdlLCBjbGVhckxhc3QpIHtcbiAgICB0aGlzLnJhbmdlID0gcmFuZ2VcbiAgICBpZiAoY2xlYXJMYXN0ICE9PSBmYWxzZSkgdGhpcy5sYXN0QW5jaG9yTm9kZSA9IG51bGxcbiAgfVxuXG4gIHBvbGwoZm9yY2UpIHtcbiAgICBpZiAodGhpcy5wbS5pbnB1dC5jb21wb3NpbmcgfHwgIWhhc0ZvY3VzKHRoaXMucG0pKSByZXR1cm5cbiAgICBsZXQgc2VsID0gZ2V0U2VsZWN0aW9uKClcbiAgICBpZiAoZm9yY2UgfHwgc2VsLmFuY2hvck5vZGUgIT0gdGhpcy5sYXN0QW5jaG9yTm9kZSB8fCBzZWwuYW5jaG9yT2Zmc2V0ICE9IHRoaXMubGFzdEFuY2hvck9mZnNldCB8fFxuICAgICAgICBzZWwuZm9jdXNOb2RlICE9IHRoaXMubGFzdEhlYWROb2RlIHx8IHNlbC5mb2N1c09mZnNldCAhPSB0aGlzLmxhc3RIZWFkT2Zmc2V0KSB7XG4gICAgICBsZXQge3BvczogYW5jaG9yLCBpbmxpbmU6IGFuY2hvcklubGluZX0gPVxuICAgICAgICAgIHBvc0Zyb21ET00odGhpcy5wbSwgc2VsLmFuY2hvck5vZGUsIHNlbC5hbmNob3JPZmZzZXQsIGZvcmNlKVxuICAgICAgbGV0IHtwb3M6IGhlYWQsIGlubGluZTogaGVhZElubGluZX0gPVxuICAgICAgICAgIHBvc0Zyb21ET00odGhpcy5wbSwgc2VsLmZvY3VzTm9kZSwgc2VsLmZvY3VzT2Zmc2V0LCBmb3JjZSlcbiAgICAgIHRoaXMubGFzdEFuY2hvck5vZGUgPSBzZWwuYW5jaG9yTm9kZTsgdGhpcy5sYXN0QW5jaG9yT2Zmc2V0ID0gc2VsLmFuY2hvck9mZnNldFxuICAgICAgdGhpcy5sYXN0SGVhZE5vZGUgPSBzZWwuZm9jdXNOb2RlOyB0aGlzLmxhc3RIZWFkT2Zmc2V0ID0gc2VsLmZvY3VzT2Zmc2V0XG4gICAgICB0aGlzLnBtLnNlbC5zZXRBbmRTaWduYWwobmV3IFJhbmdlKGFuY2hvcklubGluZSA/IGFuY2hvciA6IG1vdmVJbmxpbmUodGhpcy5wbS5kb2MsIGFuY2hvciwgdGhpcy5yYW5nZS5hbmNob3IpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkSW5saW5lID8gaGVhZDogbW92ZUlubGluZSh0aGlzLnBtLmRvYywgaGVhZCwgdGhpcy5yYW5nZS5oZWFkKSksIGZhbHNlKVxuICAgICAgaWYgKHRoaXMucmFuZ2UuYW5jaG9yLmNtcChhbmNob3IpIHx8IHRoaXMucmFuZ2UuaGVhZC5jbXAoaGVhZCkpXG4gICAgICAgIHRoaXMudG9ET00odHJ1ZSlcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG5cbiAgdG9ET00oZm9yY2UsIHRha2VGb2N1cykge1xuICAgIGxldCBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKClcbiAgICBpZiAoIWhhc0ZvY3VzKHRoaXMucG0pKSB7XG4gICAgICBpZiAoIXRha2VGb2N1cykgcmV0dXJuXG4gICAgICAvLyBTZWUgaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9OTIxNDQ0XG4gICAgICBlbHNlIGlmIChicm93c2VyLmdlY2tvKSB0aGlzLnBtLmNvbnRlbnQuZm9jdXMoKVxuICAgIH1cbiAgICBpZiAoIWZvcmNlICYmXG4gICAgICAgIHNlbC5hbmNob3JOb2RlID09IHRoaXMubGFzdEFuY2hvck5vZGUgJiYgc2VsLmFuY2hvck9mZnNldCA9PSB0aGlzLmxhc3RBbmNob3JPZmZzZXQgJiZcbiAgICAgICAgc2VsLmZvY3VzTm9kZSA9PSB0aGlzLmxhc3RIZWFkTm9kZSAmJiBzZWwuZm9jdXNPZmZzZXQgPT0gdGhpcy5sYXN0SGVhZE9mZnNldClcbiAgICAgIHJldHVyblxuXG4gICAgbGV0IHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKVxuICAgIGxldCBjb250ZW50ID0gdGhpcy5wbS5jb250ZW50XG4gICAgbGV0IGFuY2hvciA9IERPTUZyb21Qb3MoY29udGVudCwgdGhpcy5yYW5nZS5hbmNob3IpXG4gICAgbGV0IGhlYWQgPSBET01Gcm9tUG9zKGNvbnRlbnQsIHRoaXMucmFuZ2UuaGVhZClcblxuICAgIGlmIChzZWwuZXh0ZW5kKSB7XG4gICAgICByYW5nZS5zZXRFbmQoYW5jaG9yLm5vZGUsIGFuY2hvci5vZmZzZXQpXG4gICAgICByYW5nZS5jb2xsYXBzZSgpXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLnJhbmdlLmFuY2hvci5jbXAodGhpcy5yYW5nZS5oZWFkKSA+IDApIHsgbGV0IHRtcCA9IGFuY2hvcjsgYW5jaG9yID0gaGVhZDsgaGVhZCA9IHRtcCB9XG4gICAgICByYW5nZS5zZXRFbmQoaGVhZC5ub2RlLCBoZWFkLm9mZnNldClcbiAgICAgIHJhbmdlLnNldFN0YXJ0KGFuY2hvci5ub2RlLCBhbmNob3Iub2Zmc2V0KVxuICAgIH1cbiAgICBzZWwucmVtb3ZlQWxsUmFuZ2VzKClcbiAgICBzZWwuYWRkUmFuZ2UocmFuZ2UpXG4gICAgaWYgKHNlbC5leHRlbmQpXG4gICAgICBzZWwuZXh0ZW5kKGhlYWQubm9kZSwgaGVhZC5vZmZzZXQpXG5cbiAgICB0aGlzLmxhc3RBbmNob3JOb2RlID0gYW5jaG9yLm5vZGU7IHRoaXMubGFzdEFuY2hvck9mZnNldCA9IGFuY2hvci5vZmZzZXRcbiAgICB0aGlzLmxhc3RIZWFkTm9kZSA9IGhlYWQubm9kZTsgdGhpcy5sYXN0SGVhZE9mZnNldCA9IGhlYWQub2Zmc2V0XG4gIH1cblxuICByZWNlaXZlZEZvY3VzKCkge1xuICAgIGxldCBwb2xsID0gKCkgPT4ge1xuICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT0gdGhpcy5wbS5jb250ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy5wbS5vcGVyYXRpb24pIHRoaXMucG9sbCgpXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnBvbGxpbmcpXG4gICAgICAgIHRoaXMucG9sbGluZyA9IHNldFRpbWVvdXQocG9sbCwgNTApXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucG9sbGluZyA9IHNldFRpbWVvdXQocG9sbCwgMjApXG4gIH1cbn1cblxuZnVuY3Rpb24gd2luZG93UmVjdCgpIHtcbiAgcmV0dXJuIHtsZWZ0OiAwLCByaWdodDogd2luZG93LmlubmVyV2lkdGgsXG4gICAgICAgICAgdG9wOiAwLCBib3R0b206IHdpbmRvdy5pbm5lckhlaWdodH1cbn1cblxuZXhwb3J0IGNsYXNzIFJhbmdlIHtcbiAgY29uc3RydWN0b3IoYW5jaG9yLCBoZWFkKSB7XG4gICAgdGhpcy5hbmNob3IgPSBhbmNob3JcbiAgICB0aGlzLmhlYWQgPSBoZWFkXG4gIH1cblxuICBnZXQgaW52ZXJ0ZWQoKSB7IHJldHVybiB0aGlzLmFuY2hvci5jbXAodGhpcy5oZWFkKSA+IDAgfVxuICBnZXQgZnJvbSgpIHsgcmV0dXJuIHRoaXMuaW52ZXJ0ZWQgPyB0aGlzLmhlYWQgOiB0aGlzLmFuY2hvciB9XG4gIGdldCB0bygpIHsgcmV0dXJuIHRoaXMuaW52ZXJ0ZWQgPyB0aGlzLmFuY2hvciA6IHRoaXMuaGVhZCB9XG4gIGdldCBlbXB0eSgpIHsgcmV0dXJuIHRoaXMuYW5jaG9yLmNtcCh0aGlzLmhlYWQpID09IDAgfVxufVxuXG5mdW5jdGlvbiBhdHRyKG5vZGUsIG5hbWUpIHtcbiAgcmV0dXJuIG5vZGUubm9kZVR5cGUgPT0gMSAmJiBub2RlLmdldEF0dHJpYnV0ZShuYW1lKVxufVxuXG5mdW5jdGlvbiBzY2FuT2Zmc2V0KG5vZGUsIHBhcmVudCkge1xuICBmb3IgKHZhciBzY2FuID0gbm9kZSA/IG5vZGUucHJldmlvdXNTaWJsaW5nIDogcGFyZW50Lmxhc3RDaGlsZDsgc2Nhbjsgc2NhbiA9IHNjYW4ucHJldmlvdXNTaWJsaW5nKSB7XG4gICAgbGV0IHRhZywgcmFuZ2VcbiAgICBpZiAodGFnID0gYXR0cihzY2FuLCBcInBtLXBhdGhcIikpXG4gICAgICByZXR1cm4gK3RhZyArIDFcbiAgICBlbHNlIGlmIChyYW5nZSA9IGF0dHIoc2NhbiwgXCJwbS1zcGFuXCIpKVxuICAgICAgcmV0dXJuICsvLShcXGQrKS8uZXhlYyhyYW5nZSlbMV1cbiAgfVxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBwb3NGcm9tRE9NKHBtLCBub2RlLCBkb21PZmZzZXQsIGZvcmNlKSB7XG4gIGlmICghZm9yY2UgJiYgcG0ub3BlcmF0aW9uICYmIHBtLmRvYyAhPSBwbS5vcGVyYXRpb24uZG9jKVxuICAgIHRocm93IG5ldyBFcnJvcihcIkZldGNoaW5nIGEgcG9zaXRpb24gZnJvbSBhbiBvdXRkYXRlZCBET00gc3RydWN0dXJlXCIpXG5cbiAgbGV0IHBhdGggPSBbXSwgaW5UZXh0ID0gZmFsc2UsIG9mZnNldCA9IG51bGwsIGlubGluZSA9IGZhbHNlLCBwcmV2XG5cbiAgaWYgKG5vZGUubm9kZVR5cGUgPT0gMykge1xuICAgIGluVGV4dCA9IHRydWVcbiAgICBwcmV2ID0gbm9kZVxuICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGVcbiAgfSBlbHNlIHtcbiAgICBwcmV2ID0gbm9kZS5jaGlsZE5vZGVzW2RvbU9mZnNldF1cbiAgfVxuXG4gIGZvciAobGV0IGN1ciA9IG5vZGU7IGN1ciAhPSBwbS5jb250ZW50OyBwcmV2ID0gY3VyLCBjdXIgPSBjdXIucGFyZW50Tm9kZSkge1xuICAgIGxldCB0YWcsIHJhbmdlXG4gICAgaWYgKHRhZyA9IGN1ci5nZXRBdHRyaWJ1dGUoXCJwbS1wYXRoXCIpKSB7XG4gICAgICBwYXRoLnVuc2hpZnQoK3RhZylcbiAgICAgIGlmIChvZmZzZXQgPT0gbnVsbClcbiAgICAgICAgb2Zmc2V0ID0gc2Nhbk9mZnNldChwcmV2LCBjdXIpXG4gICAgfSBlbHNlIGlmIChyYW5nZSA9IGN1ci5nZXRBdHRyaWJ1dGUoXCJwbS1zcGFuXCIpKSB7XG4gICAgICBsZXQgW18sIGZyb20sIHRvXSA9IC8oXFxkKyktKFxcZCspLy5leGVjKHJhbmdlKVxuICAgICAgaWYgKGluVGV4dClcbiAgICAgICAgb2Zmc2V0ID0gK2Zyb20gKyBkb21PZmZzZXRcbiAgICAgIGVsc2VcbiAgICAgICAgb2Zmc2V0ID0gZG9tT2Zmc2V0ID8gK3RvIDogK2Zyb21cbiAgICAgIGlubGluZSA9IHRydWVcbiAgICB9IGVsc2UgaWYgKGluVGV4dCAmJiAodGFnID0gY3VyLmdldEF0dHJpYnV0ZShcInBtLXNwYW4tb2Zmc2V0XCIpKSkge1xuICAgICAgZG9tT2Zmc2V0ICs9ICt0YWdcbiAgICB9XG4gIH1cbiAgaWYgKG9mZnNldCA9PSBudWxsKSBvZmZzZXQgPSBzY2FuT2Zmc2V0KHByZXYsIG5vZGUpXG4gIHJldHVybiB7cG9zOiBuZXcgUG9zKHBhdGgsIG9mZnNldCksIGlubGluZX1cbn1cblxuZnVuY3Rpb24gbW92ZUlubGluZShkb2MsIHBvcywgZnJvbSkge1xuICBsZXQgZGlyID0gcG9zLmNtcChmcm9tKVxuICBsZXQgZm91bmQgPSBkaXIgPCAwID8gUG9zLmJlZm9yZShkb2MsIHBvcykgOiBQb3MuYWZ0ZXIoZG9jLCBwb3MpXG4gIGlmICghZm91bmQpXG4gICAgZm91bmQgPSBkaXIgPj0gMCA/IFBvcy5iZWZvcmUoZG9jLCBwb3MpIDogUG9zLmFmdGVyKGRvYywgcG9zKVxuICByZXR1cm4gZm91bmRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRCeVBhdGgobm9kZSwgbiwgZnJvbUVuZCkge1xuICBmb3IgKGxldCBjaCA9IGZyb21FbmQgPyBub2RlLmxhc3RDaGlsZCA6IG5vZGUuZmlyc3RDaGlsZDsgY2g7XG4gICAgICAgY2ggPSBmcm9tRW5kID8gY2gucHJldmlvdXNTaWJsaW5nIDogY2gubmV4dFNpYmxpbmcpIHtcbiAgICBpZiAoY2gubm9kZVR5cGUgIT0gMSkgY29udGludWVcbiAgICBsZXQgcGF0aCA9IGNoLmdldEF0dHJpYnV0ZShcInBtLXBhdGhcIilcbiAgICBpZiAoIXBhdGgpIHtcbiAgICAgIGxldCBmb3VuZCA9IGZpbmRCeVBhdGgoY2gsIG4pXG4gICAgICBpZiAoZm91bmQpIHJldHVybiBmb3VuZFxuICAgIH0gZWxzZSBpZiAoK3BhdGggPT0gbikge1xuICAgICAgcmV0dXJuIGNoXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlUGF0aChwYXJlbnQsIHBhdGgpIHtcbiAgbGV0IG5vZGUgPSBwYXJlbnRcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXRoLmxlbmd0aDsgaSsrKSB7XG4gICAgbm9kZSA9IGZpbmRCeVBhdGgobm9kZSwgcGF0aFtpXSlcbiAgICBpZiAoIW5vZGUpIHRocm93IG5ldyBFcnJvcihcIkZhaWxlZCB0byByZXNvbHZlIHBhdGggXCIgKyBwYXRoLmpvaW4oXCIvXCIpKVxuICB9XG4gIHJldHVybiBub2RlXG59XG5cbmZ1bmN0aW9uIGZpbmRCeU9mZnNldChub2RlLCBvZmZzZXQpIHtcbiAgZnVuY3Rpb24gc2VhcmNoKG5vZGUsIGRvbU9mZnNldCkge1xuICAgIGlmIChub2RlLm5vZGVUeXBlICE9IDEpIHJldHVyblxuICAgIGxldCByYW5nZSA9IG5vZGUuZ2V0QXR0cmlidXRlKFwicG0tc3BhblwiKVxuICAgIGlmIChyYW5nZSkge1xuICAgICAgbGV0IFtfLCBmcm9tLCB0b10gPSAvKFxcZCspLShcXGQrKS8uZXhlYyhyYW5nZSlcbiAgICAgIGlmICgrdG8gPj0gb2Zmc2V0KVxuICAgICAgICByZXR1cm4ge25vZGU6IG5vZGUsIHBhcmVudDogbm9kZS5wYXJlbnROb2RlLCBvZmZzZXQ6IGRvbU9mZnNldCxcbiAgICAgICAgICAgICAgICBpbm5lck9mZnNldDogb2Zmc2V0IC0gK2Zyb219XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGNoID0gbm9kZS5maXJzdENoaWxkLCBpID0gMDsgY2g7IGNoID0gY2gubmV4dFNpYmxpbmcsIGkrKykge1xuICAgICAgICBsZXQgcmVzdWx0ID0gc2VhcmNoKGNoLCBpKVxuICAgICAgICBpZiAocmVzdWx0KSByZXR1cm4gcmVzdWx0XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBzZWFyY2gobm9kZSlcbn1cblxuZnVuY3Rpb24gbGVhZkF0KG5vZGUsIG9mZnNldCkge1xuICBmb3IgKDs7KSB7XG4gICAgbGV0IGNoaWxkID0gbm9kZS5maXJzdENoaWxkXG4gICAgaWYgKCFjaGlsZCkgcmV0dXJuIHtub2RlLCBvZmZzZXR9XG4gICAgaWYgKGNoaWxkLm5vZGVUeXBlICE9IDEpIHJldHVybiB7bm9kZTogY2hpbGQsIG9mZnNldH1cbiAgICBpZiAoY2hpbGQuaGFzQXR0cmlidXRlKFwicG0tc3Bhbi1vZmZzZXRcIikpIHtcbiAgICAgIGxldCBub2RlT2Zmc2V0ID0gMFxuICAgICAgZm9yICg7Oykge1xuICAgICAgICBsZXQgbmV4dFNpYiA9IGNoaWxkLm5leHRTaWJsaW5nLCBuZXh0T2Zmc2V0XG4gICAgICAgIGlmICghbmV4dFNpYiB8fCAobmV4dE9mZnNldCA9ICtuZXh0U2liLmdldEF0dHJpYnV0ZShcInBtLXNwYW4tb2Zmc2V0XCIpKSA+PSBvZmZzZXQpIGJyZWFrXG4gICAgICAgIGNoaWxkID0gbmV4dFNpYlxuICAgICAgICBub2RlT2Zmc2V0ID0gbmV4dE9mZnNldFxuICAgICAgfVxuICAgICAgb2Zmc2V0IC09IG5vZGVPZmZzZXRcbiAgICB9XG4gICAgbm9kZSA9IGNoaWxkXG4gIH1cbn1cblxuZnVuY3Rpb24gRE9NRnJvbVBvcyhwYXJlbnQsIHBvcykge1xuICBsZXQgbm9kZSA9IHJlc29sdmVQYXRoKHBhcmVudCwgcG9zLnBhdGgpXG4gIGxldCBmb3VuZCA9IGZpbmRCeU9mZnNldChub2RlLCBwb3Mub2Zmc2V0KSwgaW5uZXJcbiAgaWYgKCFmb3VuZCkgcmV0dXJuIHtub2RlOiBub2RlLCBvZmZzZXQ6IDB9XG4gIGlmIChmb3VuZC5ub2RlLmhhc0F0dHJpYnV0ZShcInBtLXNwYW4tYXRvbVwiKSB8fCAhKGlubmVyID0gbGVhZkF0KGZvdW5kLm5vZGUsIGZvdW5kLmlubmVyT2Zmc2V0KSkpXG4gICAgcmV0dXJuIHtub2RlOiBmb3VuZC5wYXJlbnQsIG9mZnNldDogZm91bmQub2Zmc2V0ICsgKGZvdW5kLmlubmVyT2Zmc2V0ID8gMSA6IDApfVxuICBlbHNlXG4gICAgcmV0dXJuIGlubmVyXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNGb2N1cyhwbSkge1xuICBsZXQgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpXG4gIHJldHVybiBzZWwucmFuZ2VDb3VudCAmJiBjb250YWlucyhwbS5jb250ZW50LCBzZWwuYW5jaG9yTm9kZSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvc0F0Q29vcmRzKHBtLCBjb29yZHMpIHtcbiAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGNvb3Jkcy5sZWZ0LCBjb29yZHMudG9wICsgMSlcbiAgaWYgKCFjb250YWlucyhwbS5jb250ZW50LCBlbGVtZW50KSkgcmV0dXJuIFBvcy5zdGFydChwbS5kb2MpXG5cbiAgbGV0IG9mZnNldFxuICBpZiAoZWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aCA9PSAxICYmIGVsZW1lbnQuZmlyc3RDaGlsZC5ub2RlVHlwZSA9PSAzKSB7XG4gICAgZWxlbWVudCA9IGVsZW1lbnQuZmlyc3RDaGlsZFxuICAgIG9mZnNldCA9IG9mZnNldEluVGV4dE5vZGUoZWxlbWVudCwgY29vcmRzKVxuICB9IGVsc2Uge1xuICAgIG9mZnNldCA9IG9mZnNldEluRWxlbWVudChlbGVtZW50LCBjb29yZHMpXG4gIH1cblxuICBsZXQge3BvcywgaW5saW5lfSA9IHBvc0Zyb21ET00ocG0sIGVsZW1lbnQsIG9mZnNldClcbiAgcmV0dXJuIGlubGluZSA/IHBvcyA6IG1vdmVJbmxpbmUocG0uZG9jLCBwb3MsIHBvcylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvb3Jkc0F0UG9zKHBtLCBwb3MpIHtcbiAgbGV0IHtub2RlLCBvZmZzZXR9ID0gRE9NRnJvbVBvcyhwbS5jb250ZW50LCBwb3MpXG4gIGxldCByZWN0XG4gIGlmIChub2RlLm5vZGVUeXBlID09IDMgJiYgbm9kZS5ub2RlVmFsdWUpIHtcbiAgICBsZXQgcmFuZ2UgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpXG4gICAgcmFuZ2Uuc2V0RW5kKG5vZGUsIG9mZnNldCA/IG9mZnNldCA6IG9mZnNldCArIDEpXG4gICAgcmFuZ2Uuc2V0U3RhcnQobm9kZSwgb2Zmc2V0ID8gb2Zmc2V0IC0gMSA6IG9mZnNldClcbiAgICByZWN0ID0gcmFuZ2UuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgfSBlbHNlIGlmIChub2RlLm5vZGVUeXBlID09IDEgJiYgbm9kZS5maXJzdENoaWxkKSB7XG4gICAgcmVjdCA9IG5vZGUuY2hpbGROb2Rlc1tvZmZzZXQgPyBvZmZzZXQgLSAxIDogb2Zmc2V0XS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIC8vIEJSIG5vZGVzIGFyZSBsaWtlbHkgdG8gcmV0dXJuIGEgdXNlbGVzcyBlbXB0eSByZWN0YW5nbGUuIFRyeVxuICAgIC8vIHRoZSBub2RlIG9uIHRoZSBvdGhlciBzaWRlIGluIHRoYXQgY2FzZS5cbiAgICBpZiAocmVjdC5sZWZ0ID09IHJlY3QucmlnaHQgJiYgb2Zmc2V0ICYmIG9mZnNldCA8IG5vZGUuY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICAgIGxldCBvdGhlclJlY3QgPSBub2RlLmNoaWxkTm9kZXNbb2Zmc2V0XS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgaWYgKG90aGVyUmVjdC5sZWZ0ICE9IG90aGVyUmVjdC5yaWdodClcbiAgICAgICAgcmVjdCA9IHt0b3A6IG90aGVyUmVjdC50b3AsIGJvdHRvbTogb3RoZXJSZWN0LmJvdHRvbSwgcmlnaHQ6IG90aGVyUmVjdC5sZWZ0fVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZWN0ID0gbm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICB9XG4gIGxldCB4ID0gb2Zmc2V0ID8gcmVjdC5yaWdodCA6IHJlY3QubGVmdFxuICByZXR1cm4ge3RvcDogcmVjdC50b3AsIGJvdHRvbTogcmVjdC5ib3R0b20sIGxlZnQ6IHgsIHJpZ2h0OiB4fVxufVxuXG5jb25zdCBzY3JvbGxNYXJnaW4gPSA1XG5cbmV4cG9ydCBmdW5jdGlvbiBzY3JvbGxJbnRvVmlldyhwbSwgcG9zKSB7XG4gIGlmICghcG9zKSBwb3MgPSBwbS5zZWwucmFuZ2UuaGVhZFxuICBsZXQgY29vcmRzID0gY29vcmRzQXRQb3MocG0sIHBvcylcbiAgZm9yIChsZXQgcGFyZW50ID0gcG0uY29udGVudDs7IHBhcmVudCA9IHBhcmVudC5wYXJlbnROb2RlKSB7XG4gICAgbGV0IGF0Qm9keSA9IHBhcmVudCA9PSBkb2N1bWVudC5ib2R5XG4gICAgbGV0IHJlY3QgPSBhdEJvZHkgPyB3aW5kb3dSZWN0KCkgOiBwYXJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBpZiAoY29vcmRzLnRvcCA8IHJlY3QudG9wKVxuICAgICAgcGFyZW50LnNjcm9sbFRvcCAtPSByZWN0LnRvcCAtIGNvb3Jkcy50b3AgKyBzY3JvbGxNYXJnaW5cbiAgICBlbHNlIGlmIChjb29yZHMuYm90dG9tID4gcmVjdC5ib3R0b20pXG4gICAgICBwYXJlbnQuc2Nyb2xsVG9wICs9IGNvb3Jkcy5ib3R0b20gLSByZWN0LmJvdHRvbSArIHNjcm9sbE1hcmdpblxuICAgIGlmIChjb29yZHMubGVmdCA8IHJlY3QubGVmdClcbiAgICAgIHBhcmVudC5zY3JvbGxMZWZ0IC09IHJlY3QubGVmdCAtIGNvb3Jkcy5sZWZ0ICsgc2Nyb2xsTWFyZ2luXG4gICAgZWxzZSBpZiAoY29vcmRzLnJpZ2h0ID4gcmVjdC5yaWdodClcbiAgICAgIHBhcmVudC5zY3JvbGxMZWZ0ICs9IGNvb3Jkcy5yaWdodCAtIHJlY3QucmlnaHQgKyBzY3JvbGxNYXJnaW5cbiAgICBpZiAoYXRCb2R5KSBicmVha1xuICB9XG59XG5cbmZ1bmN0aW9uIG9mZnNldEluUmVjdHMoY29vcmRzLCByZWN0cykge1xuICBsZXQge3RvcDogeSwgbGVmdDogeH0gPSBjb29yZHNcbiAgbGV0IG1pblkgPSAxZTUsIG1pblggPSAxZTUsIG9mZnNldCA9IDBcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCByZWN0cy5sZW5ndGg7IGkrKykge1xuICAgIGxldCByZWN0ID0gcmVjdHNbaV1cbiAgICBpZiAoIXJlY3QgfHwgKHJlY3QudG9wID09IDAgJiYgcmVjdC5ib3R0b20gPT0gMCkpIGNvbnRpbnVlXG4gICAgbGV0IGRZID0geSA8IHJlY3QudG9wID8gcmVjdC50b3AgLSB5IDogeSA+IHJlY3QuYm90dG9tID8geSAtIHJlY3QuYm90dG9tIDogMFxuICAgIGlmIChkWSA+IG1pblkpIGNvbnRpbnVlXG4gICAgaWYgKGRZIDwgbWluWSkgeyBtaW5ZID0gZFk7IG1pblggPSAxZTUgfVxuICAgIGxldCBkWCA9IHggPCByZWN0LmxlZnQgPyByZWN0LmxlZnQgLSB4IDogeCA+IHJlY3QucmlnaHQgPyB4IC0gcmVjdC5yaWdodCA6IDBcbiAgICBpZiAoZFggPCBtaW5YKSB7XG4gICAgICBtaW5YID0gZFhcbiAgICAgIG9mZnNldCA9IE1hdGguYWJzKHggLSByZWN0LmxlZnQpIDwgTWF0aC5hYnMoeCAtIHJlY3QucmlnaHQpID8gaSA6IGkgKyAxXG4gICAgfVxuICB9XG4gIHJldHVybiBvZmZzZXRcbn1cblxuZnVuY3Rpb24gb2Zmc2V0SW5UZXh0Tm9kZSh0ZXh0LCBjb29yZHMpIHtcbiAgbGV0IGxlbiA9IHRleHQubm9kZVZhbHVlLmxlbmd0aFxuICBsZXQgcmFuZ2UgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpXG4gIGxldCByZWN0cyA9IFtdXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICByYW5nZS5zZXRFbmQodGV4dCwgaSArIDEpXG4gICAgcmFuZ2Uuc2V0U3RhcnQodGV4dCwgaSlcbiAgICByZWN0cy5wdXNoKHJhbmdlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKVxuICB9XG4gIHJldHVybiBvZmZzZXRJblJlY3RzKGNvb3JkcywgcmVjdHMpXG59XG5cbmZ1bmN0aW9uIG9mZnNldEluRWxlbWVudChlbGVtZW50LCBjb29yZHMpIHtcbiAgbGV0IHJlY3RzID0gW11cbiAgZm9yIChsZXQgY2hpbGQgPSBlbGVtZW50LmZpcnN0Q2hpbGQ7IGNoaWxkOyBjaGlsZCA9IGNoaWxkLm5leHRTaWJsaW5nKVxuICAgIHJlY3RzLnB1c2goY2hpbGQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpXG4gIHJldHVybiBvZmZzZXRJblJlY3RzKGNvb3JkcywgcmVjdHMpXG59XG4iLCJpbXBvcnQge1BvcywgTm9kZX0gZnJvbSBcIi4uL21vZGVsXCJcbmltcG9ydCB7ZGVmaW5lT3B0aW9ufSBmcm9tIFwiLi4vZWRpdFwiXG5pbXBvcnQge1J1bGUsIGFkZElucHV0UnVsZXMsIHJlbW92ZUlucHV0UnVsZXN9IGZyb20gXCIuL2lucHV0cnVsZXNcIlxuXG5kZWZpbmVPcHRpb24oXCJhdXRvSW5wdXRcIiwgZmFsc2UsIGZ1bmN0aW9uKHBtLCB2YWwsIG9sZCkge1xuICBpZiAodmFsICYmICFvbGQpIGFkZElucHV0UnVsZXMocG0sIHJ1bGVzKVxuICBlbHNlIGlmICghdmFsICYmIG9sZCkgcmVtb3ZlSW5wdXRSdWxlcyhwbSwgcnVsZXMpXG59KVxuXG5leHBvcnQgdmFyIHJ1bGVzID0gW1xuICBuZXcgUnVsZShcIi1cIiwgLy0tJC8sIFwi4oCUXCIpLFxuICBuZXcgUnVsZSgnXCInLCAvXFxzKFwiKSQvLCBcIuKAnFwiKSxcbiAgbmV3IFJ1bGUoJ1wiJywgL1wiJC8sIFwi4oCdXCIpLFxuICBuZXcgUnVsZShcIidcIiwgL1xccygnKSQvLCBcIuKAmFwiKSxcbiAgbmV3IFJ1bGUoXCInXCIsIC8nJC8sIFwi4oCZXCIpLFxuXG4gIG5ldyBSdWxlKFwiIFwiLCAvXlxccyo+ICQvLCBmdW5jdGlvbihwbSwgXywgcG9zKSB7XG4gICAgd3JhcEFuZEpvaW4ocG0sIHBvcywgXCJibG9ja3F1b3RlXCIpXG4gIH0pLFxuICBuZXcgUnVsZShcIiBcIiwgL14oXFxkKylcXC4gJC8sIGZ1bmN0aW9uKHBtLCBtYXRjaCwgcG9zKSB7XG4gICAgbGV0IG9yZGVyID0gK21hdGNoWzFdXG4gICAgd3JhcEFuZEpvaW4ocG0sIHBvcywgXCJvcmRlcmVkX2xpc3RcIiwge29yZGVyOiBvcmRlciB8fCBudWxsLCB0aWdodDogdHJ1ZX0sXG4gICAgICAgICAgICAgICAgbm9kZSA9PiBub2RlLmNvbnRlbnQubGVuZ3RoICsgKG5vZGUuYXR0cnMub3JkZXIgfHwgMSkgPT0gb3JkZXIpXG4gIH0pLFxuICBuZXcgUnVsZShcIiBcIiwgL15cXHMqKFstKypdKSAkLywgZnVuY3Rpb24ocG0sIG1hdGNoLCBwb3MpIHtcbiAgICBsZXQgYnVsbGV0ID0gbWF0Y2hbMV1cbiAgICB3cmFwQW5kSm9pbihwbSwgcG9zLCBcImJ1bGxldF9saXN0XCIsIHtidWxsZXQ6IGJ1bGxldCwgdGlnaHQ6IHRydWV9LFxuICAgICAgICAgICAgICAgIG5vZGUgPT4gbm9kZS5hdHRycy5idWxsZXQgPT0gYnVsbGV0KVxuICB9KSxcbiAgbmV3IFJ1bGUoXCJgXCIsIC9eYGBgJC8sIGZ1bmN0aW9uKHBtLCBfLCBwb3MpIHtcbiAgICBzZXRBcyhwbSwgcG9zLCBcImNvZGVfYmxvY2tcIiwge3BhcmFtczogXCJcIn0pXG4gIH0pLFxuICBuZXcgUnVsZShcIiBcIiwgL14oI3sxLDZ9KSAkLywgZnVuY3Rpb24ocG0sIG1hdGNoLCBwb3MpIHtcbiAgICBzZXRBcyhwbSwgcG9zLCBcImhlYWRpbmdcIiwge2xldmVsOiBtYXRjaFsxXS5sZW5ndGh9KVxuICB9KVxuXVxuXG5mdW5jdGlvbiB3cmFwQW5kSm9pbihwbSwgcG9zLCB0eXBlLCBhdHRycyA9IG51bGwsIHByZWRpY2F0ZSA9IG51bGwpIHtcbiAgbGV0IHBhcmVudE9mZnNldCA9IHBvcy5wYXRoW3Bvcy5wYXRoLmxlbmd0aCAtIDFdXG4gIGxldCBzaWJsaW5nID0gcGFyZW50T2Zmc2V0ID4gMCAmJiBwbS5kb2MucGF0aChwb3Muc2hvcnRlbigpKS5jb250ZW50W3BhcmVudE9mZnNldCAtIDFdXG4gIGxldCBqb2luID0gc2libGluZyAmJiBzaWJsaW5nLnR5cGUubmFtZSA9PSB0eXBlICYmICghcHJlZGljYXRlIHx8IHByZWRpY2F0ZShzaWJsaW5nKSlcbiAgbGV0IHRyID0gcG0udHIud3JhcChwb3MsIHBvcywgbmV3IE5vZGUodHlwZSwgYXR0cnMpKVxuICBsZXQgZGVsUG9zID0gdHIubWFwKHBvcykucG9zXG4gIHRyLmRlbGV0ZShuZXcgUG9zKGRlbFBvcy5wYXRoLCAwKSwgZGVsUG9zKVxuICBpZiAoam9pbikgdHIuam9pbih0ci5tYXAocG9zLCAtMSkucG9zKVxuICBwbS5hcHBseSh0cilcbn1cblxuZnVuY3Rpb24gc2V0QXMocG0sIHBvcywgdHlwZSwgYXR0cnMpIHtcbiAgcG0uYXBwbHkocG0udHIuc2V0QmxvY2tUeXBlKHBvcywgcG9zLCBuZXcgTm9kZSh0eXBlLCBhdHRycykpXG4gICAgICAgICAgICAgICAgLmRlbGV0ZShuZXcgUG9zKHBvcy5wYXRoLCAwKSwgcG9zKSlcbn1cbiIsImltcG9ydCB7UG9zLCBTcGFuLCBzdHlsZSwgc3BhblN0eWxlc0F0fSBmcm9tIFwiLi4vbW9kZWxcIlxuXG5leHBvcnQgZnVuY3Rpb24gYWRkSW5wdXRSdWxlcyhwbSwgcnVsZXMpIHtcbiAgaWYgKCFwbS5tb2QuaW50ZXJwcmV0SW5wdXQpXG4gICAgcG0ubW9kLmludGVycHJldElucHV0ID0gbmV3IElucHV0UnVsZXMocG0pXG4gIHBtLm1vZC5pbnRlcnByZXRJbnB1dC5hZGRSdWxlcyhydWxlcylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUlucHV0UnVsZShwbSwgcnVsZXMpIHtcbiAgbGV0IGlpID0gcG0ubW9kLmludGVycHJldElucHV0XG4gIGlmICghaWkpIHJldHVyblxuICBpaS5yZW1vdmVSdWxlcyhydWxlcylcbiAgaWYgKGlpLnJ1bGVzLmxlbmd0aCA9PSAwKSB7XG4gICAgaWkudW5yZWdpc3RlcigpXG4gICAgcG0ubW9kLmludGVycHJldElucHV0ID0gbnVsbFxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSdWxlIHtcbiAgY29uc3RydWN0b3IobGFzdENoYXIsIG1hdGNoLCBoYW5kbGVyKSB7XG4gICAgdGhpcy5sYXN0Q2hhciA9IGxhc3RDaGFyXG4gICAgdGhpcy5tYXRjaCA9IG1hdGNoXG4gICAgdGhpcy5oYW5kbGVyID0gaGFuZGxlclxuICB9XG59XG5cbmNsYXNzIElucHV0UnVsZXMge1xuICBjb25zdHJ1Y3RvcihwbSkge1xuICAgIHRoaXMucG0gPSBwbVxuICAgIHRoaXMucnVsZXMgPSBbXVxuICAgIHRoaXMuY2FuY2VsVmVyc2lvbiA9IG51bGxcblxuICAgIHBtLm9uKFwic2VsZWN0aW9uQ2hhbmdlXCIsIHRoaXMub25TZWxDaGFuZ2UgPSAoKSA9PiB0aGlzLmNhbmNlbFZlcnNpb24gPSBudWxsKVxuICAgIHBtLm9uKFwidGV4dElucHV0XCIsIHRoaXMub25UZXh0SW5wdXQgPSB0aGlzLm9uVGV4dElucHV0LmJpbmQodGhpcykpXG4gICAgcG0uZXh0ZW5kQ29tbWFuZChcImRlbEJhY2t3YXJkXCIsIFwiaGlnaFwiLCB0aGlzLmRlbEJhY2t3YXJkID0gdGhpcy5kZWxCYWNrd2FyZC5iaW5kKHRoaXMpKVxuICB9XG5cbiAgdW5yZWdpc3RlcigpIHtcbiAgICB0aGlzLnBtLm9mZihcInNlbGVjdGlvbkNoYW5nZVwiLCB0aGlzLm9uU2VsQ2hhbmdlKVxuICAgIHRoaXMucG0ub2ZmKFwidGV4dElucHV0XCIsIHRoaXMub25UZXh0SW5wdXQpXG4gICAgdGhpcy5wbS51bmV4dGVuZENvbW1hbmQoXCJkZWxCYWNrd2FyZFwiLCBcImhpZ2hcIiwgdGhpcy5kZWxCYWNrd2FyZClcbiAgfVxuXG4gIGFkZFJ1bGVzKHJ1bGVzKSB7XG4gICAgdGhpcy5ydWxlcyA9IHRoaXMucnVsZXMuY29uY2F0KHJ1bGVzKVxuICB9XG5cbiAgcmVtb3ZlUnVsZXMocnVsZXMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJ1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZm91bmQgPSB0aGlzLnJ1bGVzLmluZGV4T2YocnVsZXNbaV0pXG4gICAgICBpZiAoZm91bmQgPiAtMSkgdGhpcy5ydWxlcy5zcGxpY2UoZm91bmQsIDEpXG4gICAgfVxuICB9XG5cbiAgb25UZXh0SW5wdXQodGV4dCkge1xuICAgIGxldCBwb3MgPSB0aGlzLnBtLnNlbGVjdGlvbi5oZWFkXG5cbiAgICBsZXQgdGV4dEJlZm9yZSwgaXNDb2RlXG4gICAgbGV0IGxhc3RDaCA9IHRleHRbdGV4dC5sZW5ndGggLSAxXVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJ1bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgcnVsZSA9IHRoaXMucnVsZXNbaV0sIG1hdGNoXG4gICAgICBpZiAocnVsZS5sYXN0Q2hhciAmJiBydWxlLmxhc3RDaGFyICE9IGxhc3RDaCkgY29udGludWVcbiAgICAgIGlmICh0ZXh0QmVmb3JlID09IG51bGwpIHtcbiAgICAgICAgOyh7dGV4dEJlZm9yZSwgaXNDb2RlfSA9IGdldENvbnRleHQodGhpcy5wbS5kb2MsIHBvcykpXG4gICAgICAgIGlmIChpc0NvZGUpIHJldHVyblxuICAgICAgfVxuICAgICAgaWYgKG1hdGNoID0gcnVsZS5tYXRjaC5leGVjKHRleHRCZWZvcmUpKSB7XG4gICAgICAgIGxldCBzdGFydFZlcnNpb24gPSB0aGlzLnBtLmhpc3RvcnkuZ2V0VmVyc2lvbigpXG4gICAgICAgIGlmICh0eXBlb2YgcnVsZS5oYW5kbGVyID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICBsZXQgb2Zmc2V0ID0gcG9zLm9mZnNldCAtIChtYXRjaFsxXSB8fCBtYXRjaFswXSkubGVuZ3RoXG4gICAgICAgICAgbGV0IHN0YXJ0ID0gbmV3IFBvcyhwb3MucGF0aCwgb2Zmc2V0KVxuICAgICAgICAgIGxldCBzdHlsZXMgPSBzcGFuU3R5bGVzQXQodGhpcy5wbS5kb2MsIHBvcylcbiAgICAgICAgICB0aGlzLnBtLmFwcGx5KHRoaXMucG0udHIuZGVsZXRlKHN0YXJ0LCBwb3MpLmluc2VydChzdGFydCwgU3Bhbi50ZXh0KHJ1bGUuaGFuZGxlciwgc3R5bGVzKSkpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcnVsZS5oYW5kbGVyKHRoaXMucG0sIG1hdGNoLCBwb3MpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jYW5jZWxWZXJzaW9uID0gc3RhcnRWZXJzaW9uXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRlbEJhY2t3YXJkKCkge1xuICAgIGlmICh0aGlzLmNhbmNlbFZlcnNpb24pIHtcbiAgICAgIHRoaXMucG0uaGlzdG9yeS5iYWNrVG9WZXJzaW9uKHRoaXMuY2FuY2VsVmVyc2lvbilcbiAgICAgIHRoaXMuY2FuY2VsVmVyc2lvbiA9IG51bGxcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldENvbnRleHQoZG9jLCBwb3MpIHtcbiAgbGV0IHBhcmVudCA9IGRvYy5wYXRoKHBvcy5wYXRoKVxuICBsZXQgaXNQbGFpbiA9IHBhcmVudC50eXBlLnBsYWluVGV4dFxuICBsZXQgdGV4dEJlZm9yZSA9IFwiXCJcbiAgZm9yIChsZXQgb2Zmc2V0ID0gMCwgaSA9IDA7IG9mZnNldCA8IHBvcy5vZmZzZXQ7KSB7XG4gICAgbGV0IGNoaWxkID0gcGFyZW50LmNvbnRlbnRbaSsrXSwgc2l6ZSA9IGNoaWxkLnNpemVcbiAgICB0ZXh0QmVmb3JlICs9IG9mZnNldCArIHNpemUgPiBwb3Mub2Zmc2V0ID8gY2hpbGQudGV4dC5zbGljZSgwLCBwb3Mub2Zmc2V0IC0gb2Zmc2V0KSA6IGNoaWxkLnRleHRcbiAgICBpZiAob2Zmc2V0ICsgc2l6ZSA+PSBwb3Mub2Zmc2V0KSB7XG4gICAgICBpZiAoc3R5bGUuY29udGFpbnMoY2hpbGQuc3R5bGVzLCBzdHlsZS5jb2RlKSlcbiAgICAgICAgaXNQbGFpbiA9IHRydWVcbiAgICAgIGJyZWFrXG4gICAgfVxuICAgIG9mZnNldCArPSBzaXplXG4gIH1cbiAgcmV0dXJuIHt0ZXh0QmVmb3JlLCBpc1BsYWlufVxufVxuIiwiaW1wb3J0IHtkZWZpbmVPcHRpb259IGZyb20gXCIuLi9lZGl0XCJcbmltcG9ydCB7ZWx0fSBmcm9tIFwiLi4vZG9tXCJcbmltcG9ydCB7cmVzb2x2ZVBhdGh9IGZyb20gXCIuLi9lZGl0L3NlbGVjdGlvblwiXG5pbXBvcnQge0RlYm91bmNlZH0gZnJvbSBcIi4uL3V0aWwvZGVib3VuY2VcIlxuXG5pbXBvcnQge1Rvb2x0aXB9IGZyb20gXCIuL3Rvb2x0aXBcIlxuaW1wb3J0IHtNZW51LCBUb29sdGlwRGlzcGxheX0gZnJvbSBcIi4vbWVudVwiXG5pbXBvcnQge2dldEl0ZW1zLCBzZXBhcmF0b3JJdGVtLCBmb3JjZUZvbnRMb2FkfSBmcm9tIFwiLi9pdGVtc1wiXG5cbmltcG9ydCBpbnNlcnRDU1MgZnJvbSBcImluc2VydC1jc3NcIlxuaW1wb3J0IFwiLi9pY29uc1wiXG5cbmNvbnN0IGNsYXNzUHJlZml4ID0gXCJQcm9zZU1pcnJvci1idXR0b25tZW51XCJcblxuZGVmaW5lT3B0aW9uKFwiYnV0dG9uTWVudVwiLCBmYWxzZSwgZnVuY3Rpb24ocG0sIHZhbHVlKSB7XG4gIGlmIChwbS5tb2QubWVudSkgcG0ubW9kLm1lbnUuZGV0YWNoKClcbiAgcG0ubW9kLm1lbnUgPSB2YWx1ZSA/IG5ldyBCdXR0b25NZW51KHBtLCB2YWx1ZSkgOiBudWxsXG59KVxuXG5jbGFzcyBCdXR0b25NZW51IHtcbiAgY29uc3RydWN0b3IocG0sIF9jb25maWcpIHtcbiAgICB0aGlzLnBtID0gcG1cblxuICAgIHRoaXMudG9vbHRpcCA9IG5ldyBUb29sdGlwKHBtLCBcImxlZnRcIilcbiAgICB0aGlzLm1lbnUgPSBuZXcgTWVudShwbSwgbmV3IFRvb2x0aXBEaXNwbGF5KHRoaXMudG9vbHRpcCkpXG4gICAgdGhpcy5oYW1idXJnZXIgPSBwbS53cmFwcGVyLmFwcGVuZENoaWxkKGVsdChcImRpdlwiLCB7Y2xhc3M6IGNsYXNzUHJlZml4ICsgXCItYnV0dG9uXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWx0KFwiZGl2XCIpLCBlbHQoXCJkaXZcIiksIGVsdChcImRpdlwiKSkpXG4gICAgdGhpcy5oYW1idXJnZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBlID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTsgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgaWYgKHRoaXMudG9vbHRpcC5pc09wZW4pIHRoaXMudG9vbHRpcC5jbG9zZSgpXG4gICAgICBlbHNlIHRoaXMub3Blbk1lbnUoKVxuICAgIH0pXG5cbiAgICB0aGlzLmRlYm91bmNlZCA9IG5ldyBEZWJvdW5jZWQocG0sIDEwMCwgKCkgPT4gdGhpcy5hbGlnbkJ1dHRvbigpKVxuICAgIHBtLm9uKFwic2VsZWN0aW9uQ2hhbmdlXCIsIHRoaXMudXBkYXRlRnVuYyA9ICgpID0+IHRoaXMudXBkYXRlZCgpKVxuICAgIHBtLm9uKFwiY2hhbmdlXCIsIHRoaXMudXBkYXRlRnVuYylcbiAgICBwbS5vbihcImJsdXJcIiwgdGhpcy51cGRhdGVGdW5jKVxuXG4gICAgdGhpcy5ibG9ja0l0ZW1zID0gZ2V0SXRlbXMoXCJibG9ja1wiKVxuICAgIHRoaXMuYWxsSXRlbXMgPSBbLi4uZ2V0SXRlbXMoXCJpbmxpbmVcIiksIHNlcGFyYXRvckl0ZW0sIC4uLnRoaXMuYmxvY2tJdGVtc11cblxuICAgIHRoaXMucG0uY29udGVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCB0aGlzLmNsb3NlRnVuYyA9ICgpID0+IHRoaXMudG9vbHRpcC5jbG9zZSgpKVxuICAgIHRoaXMucG0uY29udGVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIHRoaXMuY2xvc2VGdW5jKVxuXG4gICAgZm9yY2VGb250TG9hZChwbSlcbiAgfVxuXG4gIGRldGFjaCgpIHtcbiAgICB0aGlzLmRlYm91bmNlZC5jbGVhcigpXG4gICAgdGhpcy5oYW1idXJnZXIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmhhbWJ1cmdlcilcbiAgICB0aGlzLnRvb2x0aXAuZGV0YWNoKClcblxuICAgIHRoaXMucG0ub2ZmKFwic2VsZWN0aW9uQ2hhbmdlXCIsIHRoaXMudXBkYXRlRnVuYylcbiAgICB0aGlzLnBtLm9mZihcImNoYW5nZVwiLCB0aGlzLnVwZGF0ZUZ1bmMpXG4gICAgdGhpcy5wbS5vZmYoXCJibHVyXCIsIHRoaXMudXBkYXRlRnVuYylcbiAgICB0aGlzLnBtLmNvbnRlbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgdGhpcy5jbG9zZUZ1bmMpXG4gICAgdGhpcy5wbS5jb250ZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy5jbG9zZUZ1bmMpXG4gIH1cblxuICB1cGRhdGVkKCkge1xuICAgIGlmICghdGhpcy5tZW51LmFjdGl2ZSkge1xuICAgICAgdGhpcy50b29sdGlwLmNsb3NlKClcbiAgICAgIHRoaXMuZGVib3VuY2VkLnRyaWdnZXIoKVxuICAgIH1cbiAgfVxuXG4gIG9wZW5NZW51KCkge1xuICAgIGxldCByZWN0ID0gdGhpcy5oYW1idXJnZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBsZXQgcG9zID0ge2xlZnQ6IHJlY3QubGVmdCwgdG9wOiAocmVjdC50b3AgKyByZWN0LmJvdHRvbSkgLyAyfVxuICAgIGxldCBzaG93SW5saW5lID0gdGhpcy5wbS5zZWxlY3Rpb24uZW1wdHkgfHwgIXRoaXMucG0uZ2V0T3B0aW9uKFwiaW5saW5lTWVudVwiKVxuICAgIHRoaXMubWVudS5zaG93KHNob3dJbmxpbmUgPyB0aGlzLmFsbEl0ZW1zIDogdGhpcy5ibG9ja0l0ZW1zLCBwb3MpXG4gIH1cblxuICBhbGlnbkJ1dHRvbigpIHtcbiAgICBsZXQgYmxvY2tFbHQgPSByZXNvbHZlUGF0aCh0aGlzLnBtLmNvbnRlbnQsIHRoaXMucG0uc2VsZWN0aW9uLmZyb20ucGF0aClcbiAgICBsZXQge3RvcH0gPSBibG9ja0VsdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIGxldCBhcm91bmQgPSB0aGlzLnBtLndyYXBwZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICB0aGlzLmhhbWJ1cmdlci5zdHlsZS50b3AgPSBNYXRoLm1heCh0b3AgLSB0aGlzLmhhbWJ1cmdlci5vZmZzZXRIZWlnaHQgLSAyIC0gYXJvdW5kLnRvcCwgNykgKyBcInB4XCJcbiAgfVxufVxuXG5pbnNlcnRDU1MoYFxuXG4uUHJvc2VNaXJyb3ItYnV0dG9ubWVudS1idXR0b24ge1xuICBkaXNwbGF5OiBub25lO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogN3B4O1xuICByaWdodDogN3B4O1xuICB3aWR0aDogMTVweDtcbiAgaGVpZ2h0OiAxM3B4O1xuICBjdXJzb3I6IHBvaW50ZXI7XG5cbiAgLXdlYmtpdC10cmFuc2l0aW9uOiB0b3AgMC4zcyBlYXNlLW91dDtcbiAgLW1vei10cmFuc2l0aW9uOiB0b3AgMC4zcyBlYXNlLW91dDtcbiAgdHJhbnNpdGlvbjogdG9wIDAuM3MgZWFzZS1vdXQ7XG59XG5cbi5Qcm9zZU1pcnJvci1mb2N1c2VkIC5Qcm9zZU1pcnJvci1idXR0b25tZW51LWJ1dHRvbiB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuXG4uUHJvc2VNaXJyb3ItYnV0dG9ubWVudS1idXR0b24gZGl2IHtcbiAgaGVpZ2h0OiAzcHg7XG4gIG1hcmdpbi1ib3R0b206IDJweDtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBiYWNrZ3JvdW5kOiAjODg4O1xufVxuXG4uUHJvc2VNaXJyb3ItYnV0dG9ubWVudS1idXR0b246aG92ZXIgZGl2IHtcbiAgYmFja2dyb3VuZDogIzMzMztcbn1cblxuYClcbiIsImltcG9ydCBpbnNlcnRDU1MgZnJvbSBcImluc2VydC1jc3NcIlxuXG5pbnNlcnRDU1MoYFxuXG4uUHJvc2VNaXJyb3ItaWNvbi1saWZ0OmFmdGVyIHtcbiAgZm9udC1mYW1pbHk6IFByb3NlTWlycm9yLWljb25zO1xuICBjb250ZW50OiBcIlxcdWU2MGNcIjtcbn1cbi5Qcm9zZU1pcnJvci1pY29uLWpvaW46YWZ0ZXIge1xuICBmb250LWZhbWlseTogUHJvc2VNaXJyb3ItaWNvbnM7XG4gIGNvbnRlbnQ6IFwiXFx1ZWE0NlwiO1xufVxuLlByb3NlTWlycm9yLWljb24taW1hZ2U6YWZ0ZXIge1xuICBmb250LWZhbWlseTogUHJvc2VNaXJyb3ItaWNvbnM7XG4gIGNvbnRlbnQ6IFwiXFx1ZTYwNlwiO1xufVxuLlByb3NlTWlycm9yLWljb24tc3Ryb25nOmFmdGVyIHtcbiAgZm9udC1mYW1pbHk6IFByb3NlTWlycm9yLWljb25zO1xuICBjb250ZW50OiBcIlxcdWU2MDdcIjtcbn1cbi5Qcm9zZU1pcnJvci1pY29uLWVtOmFmdGVyIHtcbiAgZm9udC1mYW1pbHk6IFByb3NlTWlycm9yLWljb25zO1xuICBjb250ZW50OiBcIlxcdWU2MGFcIjtcbn1cbi5Qcm9zZU1pcnJvci1pY29uLWxpbms6YWZ0ZXIge1xuICBmb250LWZhbWlseTogUHJvc2VNaXJyb3ItaWNvbnM7XG4gIGNvbnRlbnQ6IFwiXFx1ZTYwOFwiO1xufVxuLlByb3NlTWlycm9yLWljb24tY29kZTphZnRlciB7XG4gIGZvbnQtZmFtaWx5OiBQcm9zZU1pcnJvci1pY29ucztcbiAgZm9udC1zaXplOiAxMTAlO1xuICBjb250ZW50OiBcIlxcdWU2MDFcIjtcbn1cbi5Qcm9zZU1pcnJvci1pY29uLWxpc3Qtb2w6YWZ0ZXIge1xuICBmb250LWZhbWlseTogUHJvc2VNaXJyb3ItaWNvbnM7XG4gIGZvbnQtc2l6ZTogMTEwJTtcbiAgY29udGVudDogXCJcXHVlNjA0XCI7XG59XG4uUHJvc2VNaXJyb3ItaWNvbi1saXN0LXVsOmFmdGVyIHtcbiAgZm9udC1mYW1pbHk6IFByb3NlTWlycm9yLWljb25zO1xuICBmb250LXNpemU6IDExMCU7XG4gIGNvbnRlbnQ6IFwiXFx1ZTYwM1wiO1xufVxuLlByb3NlTWlycm9yLWljb24tcXVvdGU6YWZ0ZXIge1xuICBmb250LWZhbWlseTogUHJvc2VNaXJyb3ItaWNvbnM7XG4gIGZvbnQtc2l6ZTogMTEwJTtcbiAgY29udGVudDogXCJcXHVlNjAyXCI7XG59XG4uUHJvc2VNaXJyb3ItaWNvbi1ocjphZnRlciB7XG4gIGZvbnQtZmFtaWx5OiBQcm9zZU1pcnJvci1pY29ucztcbiAgY29udGVudDogXCJcXHVlNjAwXCI7XG59XG4uUHJvc2VNaXJyb3ItaWNvbi11bmRvOmFmdGVyIHtcbiAgZm9udC1mYW1pbHk6IFByb3NlTWlycm9yLWljb25zO1xuICBjb250ZW50OiBcIlxcdWU5NjdcIjtcbn1cbi5Qcm9zZU1pcnJvci1pY29uLXJlZG86YWZ0ZXIge1xuICBmb250LWZhbWlseTogUHJvc2VNaXJyb3ItaWNvbnM7XG4gIGNvbnRlbnQ6IFwiXFx1ZTk2OFwiO1xufVxuXG5AZm9udC1mYWNlIHtcbiAgZm9udC1mYW1pbHk6IFByb3NlTWlycm9yLWljb25zO1xuICBzcmM6IHVybChkYXRhOmFwcGxpY2F0aW9uL3gtZm9udC13b2ZmO2Jhc2U2NCxkMDlHUmdBQkFBQUFBQTJRQUFzQUFBQUFEVVFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQlBVeTh5QUFBQkNBQUFBR0FBQUFCZ0R4SUcwMk50WVhBQUFBRm9BQUFBZkFBQUFIeTJ2TFp5WjJGemNBQUFBZVFBQUFBSUFBQUFDQUFBQUJCbmJIbG1BQUFCN0FBQUNSZ0FBQWtZT3NEU0RHaGxZV1FBQUFzRUFBQUFOZ0FBQURZSE03VXBhR2hsWVFBQUN6d0FBQUFrQUFBQUpBZ0xCQnRvYlhSNEFBQUxZQUFBQUVRQUFBQkVNMjRCNUd4dlkyRUFBQXVrQUFBQUpBQUFBQ1FOeUJBZWJXRjRjQUFBQzhnQUFBQWdBQUFBSUFBZEFKQnVZVzFsQUFBTDZBQUFBWVlBQUFHR21Vb0orM0J2YzNRQUFBMXdBQUFBSUFBQUFDQUFBd0FBQUFNRFl3R1FBQVVBQUFLWkFzd0FBQUNQQXBrQ3pBQUFBZXNBTXdFSkFBQUFBQUFBQUFBQUFBQUFBQUFBQVJBQUFBQUFBQUFBQUFBQUFBQUFBQUFBUUFBQTZrWUR3UC9BQUVBRHdBQkFBQUFBQVFBQUFBQUFBQUFBQUFBQUlBQUFBQUFBQXdBQUFBTUFBQUFjQUFFQUF3QUFBQndBQXdBQkFBQUFIQUFFQUdBQUFBQVVBQkFBQXdBRUFBRUFJT1lFNWdqbUN1WU02V2pxUnYvOS8vOEFBQUFBQUNEbUFPWUc1Z3JtRE9sbjZrYi8vZi8vQUFILzR4b0VHZ01hQWhvQkZxY1Z5Z0FEQUFFQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUJBQUgvL3dBUEFBRUFBQUFBQUFBQUFBQUNBQUEzT1FFQUFBQUFBUUFBQUFBQUFBQUFBQUlBQURjNUFRQUFBQUFCQUFBQUFBQUFBQUFBQWdBQU56a0JBQUFBQUFFQVZRR0FBNnNCMVFBU0FBQVRJVElYRmhVVUJ3WWpJU0luSmpVME56WXpnQU1BRWd3TkRRd1MvUUFTREEwTkRCSUIxUXdORVJJTkRBd05FaEVOREFBQ0FBQUFnQU9BQXdBQUJnQU5BQUFCQnhjSEZ3a0JJUWtCTnljM0p3SmdZT0RnWUFFZy91RCt3UDdnQVNCZzRPQmdBd0JnNE9CZ0FVQUJRUDdBL3NCZzRPQmdBQUlBQUFEQUFvQUN3QUFOQUJzQUFCTVJJUkVqTURZek5UQU9BaFVsTlRBT0FoVVJJUkVqTURZekFBRUFnQ0JnVUdCUUFvQlFZRkFCQUlBZ1lBSEEvd0FCQUlDQUNEQm9ZSUNBQ0RCb1lQOEFBUUNBQUFZQUFBQ0FBd0FEQUFBRUFBa0FEZ0FUQUJnQUhRQUFFek0xSXhVUk16VWpGUkV6TlNNVkFTRTFJUlVSSVRVaEZSRWhOU0VWQUlDQWdJQ0FnQUVBQWdEK0FBSUEvZ0FDQVA0QUFZQ0FnQUVBZ0lEK0FJQ0FBUUNBZ0FFQWdJRCtBSUNBQUFBRkFBQUFmd01BQXdBQUJBQUpBQTRBRmdBdkFBQUJJVFVoRlJFaE5TRVZFUlVoTlNFRE14RWpCeFUzRlJjMEppTWlCZ2NYUGdFek1oWVZGQVlIRlRNMUJ6NEJOVGNCUUFIQS9rQUJ3UDVBQWNEK1FQRk9KRlVyYmlFL0dTd09BUkFnRXhNTk1qekFXeVV5QVFHQWdJRC9BSUNBQW9DQWdQOEFBUUFYTWdLNXpoc3pDQWhDQndnUERSTTBLVEpEQWhZNEl3RUFCQUFBQUFBRVNRTnVBQkFBRndBc0FFRUFBQUVVQndZaklpY21OVFEzTmpNeUZ4WVZCUkVoTlRjWEFTVWhJZ2NHRlJFVUZ4WXpJVEkzTmpVUk5DY21JeGNSRkFjR0l5RWlKeVkxRVRRM05qTWhNaGNXRlFGdUlDQXVMaUFnSUNBdUxpQWdBa244MjdkY0FTUUJKZnh0QndVR0JnVUhBNU1IQmdVRkJnZGJHeHNsL0cwbEd4c2JHeVVEa3lVYkd3SnVMaUFnSUNBdUxTQWdJQ0F0M1A4QWJyZGNBU1dsQmdVSS9Va0hCUVlHQlFjQ3R3Z0ZCaFA5U1NVYkd4c2JKUUszSmhzYkd4c21BQUFEQUFBQUFBTWxBMjRBSGdBOUFJMEFBQ1VXTXpJMU5DY21KeVluSmljbUp5WWpJZ2NVRlJRVkZBY0dGeFFYRmhjREZqTXlOelkzTmpjMk5UUW5KaWNtSnlZaklnY1VGeFlWRkJVVUZSUVZBVGMyTnpZM05qYzJOelkzTmpVMFBRRVFKeVluSmljbUp5WW5KaU1uTmpjMk16SVhNak15RnhZWEZoY1dGeFlWRkFjR0J3WUhCZ2NHQnhZWEZoVVVCd1lIQmdjR0J3WWpJaWNtSXlJSEJnY0JQU29tMXhjUUZCTVRFeHNiRlJVaEtoQUJBUUVDQXdRSUdDWXZJeU1jSEE4T0VCRWRIQ0VoSmgwdEFnTCt5d0VKS0NnVUJBTUVBUUlCQWd3Q0N3b1BEdzBPRGc4REFqaUtpMHNOR2hvTUtDWW1KQ01hR3hBUUNna05EUmdZRWhFZldEczdGQlFpSVM0dE1EQTFHVEl5R2p4emN4RlNFOEJCSmhrUkVRb0pCUVVCQVFZZVBUd2VCQ0lpRmhVYUd3c0JxZ1FIQ0JJU0lTRXdLQjRlRVJFSUNBZ2NPam9kRHg0ZkR4b04vZ1EyQWdjSENBY0pDQXNLQ0FnT0RRWW1BakVZQlFRREF3TUJBUUlCTUFFRkJnRUhDQkFSR0Jna0l5c2VHUmtRRUJFUUNRb05GRGs0VmprdExoMGRGQk1JQ0FFQ0JnWUJBQU1BQ1FBSkE2NERyZ0FyQUZjQWdBQUFBVFF2QVNZaklnY1dGeFlYRmhjV0Z4WVZGQWNHSXlJbkppY21KeVluSmljR0ZSUWZBUll6TWo4Qk5qVUJOQzhCSmlNaUR3RUdGUlFmQVJZek1qY21KeVluSmljbUp5WTFORGMyTXpJWEZoY1dGeFlYRmhjMk5RRVVEd0VHSXlJdkFTWTFORGNuQmlNaUx3RW1OVFEvQVRZek1oOEJGaFVVQnhjMk16SWZBUllWQTBBUWR4QVhHQkVDQ1FrREF3WUZBZ0lRRUJjSUJ3Y0lCd1FEQ1FrQ0VoQjFFQmNYRUZRUS9tNFFkUkFYRnhCVUVCQjNEeGdZRVFJSkNRTUVCUVVDQWhBUUZna0hCd2dIQkFNSkNRRVRBZ0F4VkM5RlJTOTJNRE16TVVWRk1IY3dNVlF2UlVVdmRpOHlNakpGUlRCM01BRUFGeEIzRUJNQkNRa0RCQWNJQndjSkZoQVFBZ0lGQlFRRENRa0NFaGdYRUhZUUQxUVFGZ0dURnhCMkVBOVVFQllYRUhjUEVRSUpDUU1FQndnSEJ3Z1hFQkFDQWdVR0F3TUpDUUlTR1A1dFJTOVRNREYyTDBWR01UTXpNSGN3UlVRd1V6QXhkakJFUmpJeU1qQjJNRVVBQUFFQUFBQUFBa2tEYmdCT0FBQS9BVFkzTmpjMk56WTNOamMyUFFFbUp5WW5KaWMzRmhjV0Z4WXpNamMyTnpZM0JnY0dCd1lIQmdjR0J3WUhCZ2NHQndZSEJnY0dCd1lIQmhVWEZoY0dCeUlIQmlNaUp5WWpKaU1pQndZSEFBb0RLeXNWRUFjQkl5TWVIZzRSRWhZV0N3c1NNaklrSXlFY0hSMG9LQkFEQ0JFcEtSVUVCQU1DQWdJREFROGpJZ29CQndZRkJRUUVBUXBnQWdjSERBd0hFQ0VoRUU4bkhUVTBFUUV4QVFzTENoUW1CS0dobHBVVUR3Y0RBd0lCQWpzQkF3TUJBUUVCQXdNQkZ4d0dDZ3NKQ2c0TkNna1JFQWhVbTV3d0JSd2NGeGdZR0FrS0FoQVpId0VCQmdVQ0JnVUJBQVVBQUFCSkJBQURiZ0FUQUNnQVBRQlNBR2NBQUJNUkZBY0dJeUl2QVNZMU5EOEJOak15RnhZVkFSVVVCd1lqSVNJbkpqMEJORGMyTXlFeUZ4WVZOUlVVQndZaklTSW5KajBCTkRjMk15RXlGeFlWTlJVVUJ3WWpJU0luSmowQk5EYzJNeUV5RnhZVk5SVVVCd1lqSVNJbkpqMEJORGMyTXlFeUZ4WVYyd1VGQ0FnRnBRVUZwUVVJQ0FVRkF5VUZCZ2Y4SkFjR0JRVUdCd1BjQndZRkJRWUgvWklIQmdVRkJnY0NiZ2NHQlFVR0IvMlNCd1lGQlFZSEFtNEhCZ1VGQmdmOEpBY0dCUVVHQndQY0J3WUZBb0QrdHdnRkJRV2tCUWdJQnFRRkJRWUgva2x1QndVR0JnVUhiZ2dGQlFVRkNOeHVDQVVGQlFVSWJnY0ZCZ1lGQjl0dUJ3WUZCUVlIYmdjR0JRVUdCOXR0Q0FVR0JnVUliUWdGQmdZRkNBQUFBQUVBUVAvQUF2b0R3QUFPQUFBRlBnRXVBUWNWQ1FFVk5oNEJBZ2NDK2lzbU9LdW8vb0FCZ01ualJrOXBRRTIybW1VRS9nR0FBWUQ0Qlp6cy91MXlBQUFCQVFiL3dBUEFBOEFBRGdBQUFUVUpBVFVtRGdFV0Z5WUNQZ0VYQWtBQmdQNkFxS3M0Sml0cFQwYmp5UUxJK1A2QS9vRCtCR1dhdGsxeUFSUHNuQVVBQ3dCQUFBQURvQU1BQUFZQUN3QVFBQlVBR2dBZkFDUUFLUUF1QURNQU9BQUFBUkV6RVRNbkJ3RXpGU00xT3dFVkl6VTdBUlVqTlFVekZTTTFGek1WSXpVN0FSVWpOU2N6RlNNMUJUTVZJelVSRlNNMU16Y2hFU0VSQXNCQW9NREEvaUJnWUlCZ1lJQkFRUDhBUUVCZ1lHQ0FZR0RnUUVBQkFFQkF3TUJBL3NBQlFBSEEvb0FCZ01EQUFVQkFRRUJBWUdEZ1lHQWdRRUJBUUtCZ1lDQmdZUDZBd01CQS9zQUJRQUFBQUFFQUFBQUFBQUJwV1Exalh3ODg5UUFMQkFBQUFBQUEwZVk0VmdBQUFBRFI1amhXQUFEL3dBUkpBOEFBQUFBSUFBSUFBQUFBQUFBQUFRQUFBOEQvd0FBQUJFa0FBQUFBQkVrQUFRQUFBQUFBQUFBQUFBQUFBQUFBQUJFRUFBQUFBQUFBQUFBQUFBQUNBQUFBQkFBQVZRT0FBQUFDZ0FBQUF3QUFBQU1BQUFBRVNRQUFBeVVBQUFPM0FBa0NTUUFBQkFBQUFBUUFBRUFFQUFFR0JBQUFRQUFBQUFBQUNnQVVBQjRBUGdCZ0FJb0F2QUVHQVdvQ05BTHVBMllEOWdRV0JEWUVqQUFCQUFBQUVRQ09BQXNBQUFBQUFBSUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFEZ0N1QUFFQUFBQUFBQUVBQndBQUFBRUFBQUFBQUFJQUJ3QmdBQUVBQUFBQUFBTUFCd0EyQUFFQUFBQUFBQVFBQndCMUFBRUFBQUFBQUFVQUN3QVZBQUVBQUFBQUFBWUFCd0JMQUFFQUFBQUFBQW9BR2dDS0FBTUFBUVFKQUFFQURnQUhBQU1BQVFRSkFBSUFEZ0JuQUFNQUFRUUpBQU1BRGdBOUFBTUFBUVFKQUFRQURnQjhBQU1BQVFRSkFBVUFGZ0FnQUFNQUFRUUpBQVlBRGdCU0FBTUFBUVFKQUFvQU5BQ2thV052Ylc5dmJnQnBBR01BYndCdEFHOEFid0J1Vm1WeWMybHZiaUF4TGpBQVZnQmxBSElBY3dCcEFHOEFiZ0FnQURFQUxnQXdhV052Ylc5dmJnQnBBR01BYndCdEFHOEFid0J1YVdOdmJXOXZiZ0JwQUdNQWJ3QnRBRzhBYndCdVVtVm5kV3hoY2dCU0FHVUFad0IxQUd3QVlRQnlhV052Ylc5dmJnQnBBR01BYndCdEFHOEFid0J1Um05dWRDQm5aVzVsY21GMFpXUWdZbmtnU1dOdlRXOXZiaTRBUmdCdkFHNEFkQUFnQUdjQVpRQnVBR1VBY2dCaEFIUUFaUUJrQUNBQVlnQjVBQ0FBU1FCakFHOEFUUUJ2QUc4QWJnQXVBQUFBQXdBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBPT0pIGZvcm1hdCgnd29mZicpO1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG59XG5cbmApXG4iLCJpbXBvcnQge2RlZmluZU9wdGlvbn0gZnJvbSBcIi4uL2VkaXRcIlxuaW1wb3J0IHtzcGFuU3R5bGVzQXR9IGZyb20gXCIuLi9tb2RlbFwiXG5pbXBvcnQge2VsdH0gZnJvbSBcIi4uL2RvbVwiXG5pbXBvcnQge0RlYm91bmNlZH0gZnJvbSBcIi4uL3V0aWwvZGVib3VuY2VcIlxuXG5pbXBvcnQge1Rvb2x0aXB9IGZyb20gXCIuL3Rvb2x0aXBcIlxuaW1wb3J0IHtnZXRJdGVtcywgZm9yY2VGb250TG9hZH0gZnJvbSBcIi4vaXRlbXNcIlxuaW1wb3J0IHtNZW51LCBUb29sdGlwRGlzcGxheX0gZnJvbSBcIi4vbWVudVwiXG5cbmltcG9ydCBpbnNlcnRDU1MgZnJvbSBcImluc2VydC1jc3NcIlxuXG5jb25zdCBjbGFzc1ByZWZpeCA9IFwiUHJvc2VNaXJyb3ItaW5saW5lbWVudVwiXG5cbmRlZmluZU9wdGlvbihcImlubGluZU1lbnVcIiwgZmFsc2UsIGZ1bmN0aW9uKHBtLCB2YWx1ZSkge1xuICBpZiAocG0ubW9kLmlubGluZU1lbnUpIHBtLm1vZC5pbmxpbmVNZW51LmRldGFjaCgpXG4gIHBtLm1vZC5pbmxpbmVNZW51ID0gdmFsdWUgPyBuZXcgSW5saW5lTWVudShwbSwgdmFsdWUpIDogbnVsbFxufSlcblxuY2xhc3MgSW5saW5lTWVudSB7XG4gIGNvbnN0cnVjdG9yKHBtLCBjb25maWcpIHtcbiAgICB0aGlzLnBtID0gcG1cbiAgICB0aGlzLml0ZW1zID0gKGNvbmZpZyAmJiBjb25maWcuaXRlbXMpIHx8IGdldEl0ZW1zKFwiaW5saW5lXCIpXG4gICAgdGhpcy5zaG93TGlua3MgPSBjb25maWcgPyBjb25maWcuc2hvd0xpbmtzICE9PSBmYWxzZSA6IHRydWVcbiAgICB0aGlzLmRlYm91bmNlZCA9IG5ldyBEZWJvdW5jZWQocG0sIDEwMCwgKCkgPT4gdGhpcy51cGRhdGUoKSlcblxuICAgIHBtLm9uKFwic2VsZWN0aW9uQ2hhbmdlXCIsIHRoaXMudXBkYXRlRnVuYyA9ICgpID0+IHRoaXMuZGVib3VuY2VkLnRyaWdnZXIoKSlcbiAgICBwbS5vbihcImNoYW5nZVwiLCB0aGlzLnVwZGF0ZUZ1bmMpXG4gICAgcG0ub24oXCJibHVyXCIsIHRoaXMudXBkYXRlRnVuYylcblxuICAgIHRoaXMudG9vbHRpcCA9IG5ldyBUb29sdGlwKHBtLCBcImFib3ZlXCIpXG4gICAgdGhpcy5tZW51ID0gbmV3IE1lbnUocG0sIG5ldyBUb29sdGlwRGlzcGxheSh0aGlzLnRvb2x0aXAsIHRoaXMudXBkYXRlRnVuYykpXG5cbiAgICBmb3JjZUZvbnRMb2FkKHBtKVxuICB9XG5cbiAgZGV0YWNoKCkge1xuICAgIHRoaXMuZGVib3VuY2VkLmNsZWFyKClcbiAgICB0aGlzLnRvb2x0aXAuZGV0YWNoKClcblxuICAgIHRoaXMucG0ub2ZmKFwic2VsZWN0aW9uQ2hhbmdlXCIsIHRoaXMudXBkYXRlRnVuYylcbiAgICB0aGlzLnBtLm9mZihcImNoYW5nZVwiLCB0aGlzLnVwZGF0ZUZ1bmMpXG4gICAgdGhpcy5wbS5vZmYoXCJibHVyXCIsIHRoaXMudXBkYXRlRnVuYylcbiAgfVxuXG4gIGluUGxhaW5UZXh0KHNlbCkge1xuICAgIGxldCBzdGFydCA9IHRoaXMucG0uZG9jLnBhdGgoc2VsLmZyb20ucGF0aClcbiAgICBsZXQgZW5kID0gdGhpcy5wbS5kb2MucGF0aChzZWwudG8ucGF0aClcbiAgICByZXR1cm4gc3RhcnQudHlwZS5wbGFpblRleHQgJiYgZW5kLnR5cGUucGxhaW5UZXh0XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgaWYgKHRoaXMubWVudS5hY3RpdmUpIHJldHVyblxuXG4gICAgbGV0IHNlbCA9IHRoaXMucG0uc2VsZWN0aW9uLCBsaW5rXG4gICAgaWYgKCF0aGlzLnBtLmhhc0ZvY3VzKCkpXG4gICAgICB0aGlzLnRvb2x0aXAuY2xvc2UoKVxuICAgIGVsc2UgaWYgKCFzZWwuZW1wdHkgJiYgIXRoaXMuaW5QbGFpblRleHQoc2VsKSlcbiAgICAgIHRoaXMubWVudS5zaG93KHRoaXMuaXRlbXMsIHRvcENlbnRlck9mU2VsZWN0aW9uKCkpXG4gICAgZWxzZSBpZiAodGhpcy5zaG93TGlua3MgJiYgKGxpbmsgPSB0aGlzLmxpbmtVbmRlckN1cnNvcigpKSlcbiAgICAgIHRoaXMuc2hvd0xpbmsobGluaywgdGhpcy5wbS5jb29yZHNBdFBvcyhzZWwuaGVhZCkpXG4gICAgZWxzZVxuICAgICAgdGhpcy50b29sdGlwLmNsb3NlKClcbiAgfVxuXG4gIGxpbmtVbmRlckN1cnNvcigpIHtcbiAgICBsZXQgc3R5bGVzID0gc3BhblN0eWxlc0F0KHRoaXMucG0uZG9jLCB0aGlzLnBtLnNlbGVjdGlvbi5oZWFkKVxuICAgIHJldHVybiBzdHlsZXMucmVkdWNlKChmb3VuZCwgc3QpID0+IGZvdW5kIHx8IChzdC50eXBlID09IFwibGlua1wiICYmIHN0KSwgbnVsbClcbiAgfVxuXG4gIHNob3dMaW5rKGxpbmssIHBvcykge1xuICAgIGxldCBub2RlID0gZWx0KFwiZGl2XCIsIHtjbGFzczogY2xhc3NQcmVmaXggKyBcIi1saW5rdGV4dFwifSwgZWx0KFwiYVwiLCB7aHJlZjogbGluay5ocmVmLCB0aXRsZTogbGluay50aXRsZX0sIGxpbmsuaHJlZikpXG4gICAgdGhpcy50b29sdGlwLm9wZW4obm9kZSwgcG9zKVxuICB9XG59XG5cbmZ1bmN0aW9uIHRvcENlbnRlck9mU2VsZWN0aW9uKCkge1xuICBsZXQgcmVjdHMgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkuZ2V0UmFuZ2VBdCgwKS5nZXRDbGllbnRSZWN0cygpXG4gIGxldCB7bGVmdCwgcmlnaHQsIHRvcH0gPSByZWN0c1swXVxuICBmb3IgKGxldCBpID0gMTsgaSA8IHJlY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHJlY3RzW2ldLnRvcCA8IHJlY3RzWzBdLmJvdHRvbSAtIDEgJiZcbiAgICAgICAgLy8gQ2hyb21lIGJ1ZyB3aGVyZSBib2d1cyByZWN0YW5nbGVzIGFyZSBpbnNlcnRlZCBhdCBzcGFuIGJvdW5kYXJpZXNcbiAgICAgICAgKGkgPT0gcmVjdHMubGVuZ3RoIC0gMSB8fCBNYXRoLmFicyhyZWN0c1tpICsgMV0ubGVmdCAtIHJlY3RzW2ldLmxlZnQpID4gMSkpIHtcbiAgICAgIGxlZnQgPSBNYXRoLm1pbihsZWZ0LCByZWN0c1tpXS5sZWZ0KVxuICAgICAgcmlnaHQgPSBNYXRoLm1heChyaWdodCwgcmVjdHNbaV0ucmlnaHQpXG4gICAgICB0b3AgPSBNYXRoLm1pbih0b3AsIHJlY3RzW2ldLnRvcClcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHt0b3AsIGxlZnQ6IChsZWZ0ICsgcmlnaHQpIC8gMn1cbn1cblxuaW5zZXJ0Q1NTKGBcblxuLlByb3NlTWlycm9yLWlubGluZW1lbnUtbGlua3RleHQgYSB7XG4gIGNvbG9yOiB3aGl0ZTtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICBwYWRkaW5nOiAwIDVweDtcbn1cblxuLlByb3NlTWlycm9yLWlubGluZW1lbnUtbGlua3RleHQgYTpob3ZlciB7XG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xufVxuXG5gKVxuIiwiaW1wb3J0IHtzdHlsZSwgcmFuZ2VIYXNTdHlsZSwgU3BhbiwgTm9kZSwgbm9kZVR5cGVzLCBQb3N9IGZyb20gXCIuLi9tb2RlbFwiXG5pbXBvcnQge2NhbkxpZnQsIGNhbldyYXAsIGpvaW5Qb2ludH0gZnJvbSBcIi4uL3RyYW5zZm9ybVwiXG5pbXBvcnQge2VsdH0gZnJvbSBcIi4uL2RvbVwiXG5pbXBvcnQge01lbnVJdGVtfSBmcm9tIFwiLi9tZW51XCJcbmV4cG9ydCB7TWVudUl0ZW19XG5pbXBvcnQgaW5zZXJ0Q1NTIGZyb20gXCJpbnNlcnQtY3NzXCJcbmltcG9ydCBcIi4vaWNvbnNcIlxuXG5jb25zdCB0YWdzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJJdGVtKHRhZywgaXRlbSkge1xuICA7KHRhZ3NbdGFnXSB8fCAodGFnc1t0YWddID0gW10pKS5wdXNoKGl0ZW0pXG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0SXRlbXModGFnKSB7XG4gIHJldHVybiB0YWdzW3RhZ10gfHwgW11cbn1cblxuZXhwb3J0IGNsYXNzIEljb25JdGVtIGV4dGVuZHMgTWVudUl0ZW0ge1xuICBjb25zdHJ1Y3RvcihpY29uLCB0aXRsZSkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLmljb24gPSBpY29uXG4gICAgdGhpcy50aXRsZSA9IHRpdGxlXG4gIH1cblxuICBhY3RpdmUoKSB7IHJldHVybiBmYWxzZSB9XG5cbiAgcmVuZGVyKG1lbnUpIHtcbiAgICBsZXQgaWNvbkNsYXNzID0gXCJQcm9zZU1pcnJvci1tZW51aWNvblwiXG4gICAgaWYgKHRoaXMuYWN0aXZlKG1lbnUucG0pKSBpY29uQ2xhc3MgKz0gXCIgUHJvc2VNaXJyb3ItbWVudWljb24tYWN0aXZlXCJcbiAgICBsZXQgZG9tID0gZWx0KFwiZGl2XCIsIHtjbGFzczogaWNvbkNsYXNzLCB0aXRsZTogdGhpcy50aXRsZX0sXG4gICAgICAgICAgICAgICAgICBlbHQoXCJzcGFuXCIsIHtjbGFzczogXCJQcm9zZU1pcnJvci1tZW51aWNvbiBQcm9zZU1pcnJvci1pY29uLVwiICsgdGhpcy5pY29ufSkpXG4gICAgZG9tLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7IGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgIG1lbnUucnVuKHRoaXMuYXBwbHkobWVudS5wbSkpXG4gICAgfSlcbiAgICByZXR1cm4gZG9tXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIExpZnRJdGVtIGV4dGVuZHMgSWNvbkl0ZW0ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihcImxpZnRcIiwgXCJNb3ZlIG91dCBvZiBibG9ja1wiKVxuICB9XG4gIHNlbGVjdChwbSkge1xuICAgIGxldCBzZWwgPSBwbS5zZWxlY3Rpb25cbiAgICByZXR1cm4gY2FuTGlmdChwbS5kb2MsIHNlbC5mcm9tLCBzZWwudG8pXG4gIH1cbiAgYXBwbHkocG0pIHtcbiAgICBsZXQgc2VsID0gcG0uc2VsZWN0aW9uXG4gICAgcG0uYXBwbHkocG0udHIubGlmdChzZWwuZnJvbSwgc2VsLnRvKSlcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSm9pbkl0ZW0gZXh0ZW5kcyBJY29uSXRlbSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFwiam9pblwiLCBcIkpvaW4gd2l0aCBibG9jayBhYm92ZVwiKVxuICB9XG4gIHNlbGVjdChwbSkge1xuICAgIHJldHVybiBqb2luUG9pbnQocG0uZG9jLCBwbS5zZWxlY3Rpb24uaGVhZClcbiAgfVxuICBhcHBseShwbSkge1xuICAgIHBtLmFwcGx5KHBtLnRyLmpvaW4oam9pblBvaW50KHBtLmRvYywgcG0uc2VsZWN0aW9uLmhlYWQpKSlcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW5zZXJ0QmxvY2tJdGVtIGV4dGVuZHMgSWNvbkl0ZW0ge1xuICBjb25zdHJ1Y3RvcihpY29uLCB0aXRsZSwgdHlwZSwgYXR0cnMpIHtcbiAgICBzdXBlcihpY29uLCB0aXRsZSlcbiAgICB0aGlzLnR5cGUgPSB0eXBlXG4gICAgdGhpcy5hdHRycyA9IGF0dHJzXG4gIH1cbiAgc2VsZWN0KHBtKSB7XG4gICAgbGV0IHNlbCA9IHBtLnNlbGVjdGlvblxuICAgIHJldHVybiBQb3Muc2FtZVBhdGgoc2VsLmhlYWQucGF0aCwgc2VsLmFuY2hvci5wYXRoKSAmJlxuICAgICAgcG0uZG9jLnBhdGgoc2VsLmhlYWQucGF0aCkudHlwZS50eXBlID09IG5vZGVUeXBlc1t0aGlzLnR5cGVdLnR5cGVcbiAgfVxuICBhcHBseShwbSkge1xuICAgIGxldCBzZWwgPSBwbS5zZWxlY3Rpb24sIHRyID0gcG0udHIsIG9mZiA9IDBcbiAgICBpZiAoc2VsLmhlYWQub2Zmc2V0KSB7XG4gICAgICB0ci5zcGxpdChzZWwuaGVhZClcbiAgICAgIG9mZiA9IDFcbiAgICB9XG4gICAgcG0uYXBwbHkodHIuaW5zZXJ0KHNlbC5oZWFkLnNob3J0ZW4obnVsbCwgb2ZmKSwgbmV3IE5vZGUodGhpcy50eXBlLCB0aGlzLmF0dHJzKSkpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFdyYXBJdGVtIGV4dGVuZHMgSWNvbkl0ZW0ge1xuICBjb25zdHJ1Y3RvcihpY29uLCB0aXRsZSwgdHlwZSkge1xuICAgIHN1cGVyKGljb24sIHRpdGxlKVxuICAgIHRoaXMudHlwZSA9IHR5cGVcbiAgfVxuICBzZWxlY3QocG0pIHtcbiAgICByZXR1cm4gY2FuV3JhcChwbS5kb2MsIHBtLnNlbGVjdGlvbi5mcm9tLCBwbS5zZWxlY3Rpb24udG8sIG5ldyBOb2RlKHRoaXMudHlwZSkpXG4gIH1cbiAgYXBwbHkocG0pIHtcbiAgICBsZXQgc2VsID0gcG0uc2VsZWN0aW9uXG4gICAgcG0uYXBwbHkocG0udHIud3JhcChzZWwuZnJvbSwgc2VsLnRvLCBuZXcgTm9kZSh0aGlzLnR5cGUpKSlcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW5saW5lU3R5bGVJdGVtIGV4dGVuZHMgSWNvbkl0ZW0ge1xuICBjb25zdHJ1Y3RvcihpY29uLCB0aXRsZSwgc3R5bGUsIGRpYWxvZykge1xuICAgIHN1cGVyKGljb24sIHRpdGxlKVxuICAgIHRoaXMuc3R5bGUgPSB0eXBlb2Ygc3R5bGUgPT0gXCJzdHJpbmdcIiA/IHt0eXBlOiBzdHlsZX0gOiBzdHlsZVxuICAgIHRoaXMuZGlhbG9nID0gZGlhbG9nXG4gIH1cbiAgYWN0aXZlKHBtKSB7XG4gICAgbGV0IHNlbCA9IHBtLnNlbGVjdGlvblxuICAgIGlmIChzZWwuZW1wdHkpXG4gICAgICByZXR1cm4gc3R5bGUuY29udGFpbnNUeXBlKHBtLmFjdGl2ZVN0eWxlcygpLCB0aGlzLnN0eWxlLnR5cGUpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHJhbmdlSGFzU3R5bGUocG0uZG9jLCBzZWwuZnJvbSwgc2VsLnRvLCB0aGlzLnN0eWxlLnR5cGUpXG4gIH1cbiAgYXBwbHkocG0pIHtcbiAgICBsZXQgc2VsID0gcG0uc2VsZWN0aW9uXG4gICAgaWYgKHRoaXMuYWN0aXZlKHBtKSkge1xuICAgICAgaWYgKHNlbC5lbXB0eSlcbiAgICAgICAgcG0uc2V0SW5saW5lU3R5bGUodGhpcy5zdHlsZSwgZmFsc2UpXG4gICAgICBlbHNlXG4gICAgICAgIHBtLmFwcGx5KHBtLnRyLnJlbW92ZVN0eWxlKHNlbC5mcm9tLCBzZWwudG8sIHRoaXMuc3R5bGUudHlwZSkpXG4gICAgfSBlbHNlIGlmICh0aGlzLmRpYWxvZykge1xuICAgICAgcmV0dXJuIFt0aGlzLmRpYWxvZ11cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHNlbC5lbXB0eSlcbiAgICAgICAgcG0uc2V0SW5saW5lU3R5bGUodGhpcy5zdHlsZSwgdHJ1ZSlcbiAgICAgIGVsc2VcbiAgICAgICAgcG0uYXBwbHkocG0udHIuYWRkU3R5bGUoc2VsLmZyb20sIHNlbC50bywgdGhpcy5zdHlsZSkpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJbWFnZUl0ZW0gZXh0ZW5kcyBJY29uSXRlbSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFwiaW1hZ2VcIiwgXCJJbnNlcnQgaW1hZ2VcIilcbiAgfVxuICBhcHBseSgpIHsgcmV0dXJuIFtpbWFnZURpYWxvZ10gfVxufVxuXG5leHBvcnQgY2xhc3MgRGlhbG9nSXRlbSBleHRlbmRzIE1lbnVJdGVtIHtcbiAgZm9jdXMoZm9ybSkge1xuICAgIGxldCBpbnB1dCA9IGZvcm0ucXVlcnlTZWxlY3RvcihcImlucHV0LCB0ZXh0YXJlYVwiKVxuICAgIGlmIChpbnB1dCkgaW5wdXQuZm9jdXMoKVxuICB9XG5cbiAgcmVuZGVyKG1lbnUpIHtcbiAgICBsZXQgZm9ybSA9IHRoaXMuZm9ybShtZW51LnBtKSwgZG9uZSA9IGZhbHNlXG5cbiAgICBsZXQgZmluaXNoID0gKCkgPT4ge1xuICAgICAgaWYgKCFkb25lKSB7XG4gICAgICAgIGRvbmUgPSB0cnVlXG4gICAgICAgIG1lbnUucG0uZm9jdXMoKVxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBzdWJtaXQgPSAoKSA9PiB7XG4gICAgICBsZXQgcmVzdWx0ID0gdGhpcy5hcHBseShmb3JtLCBtZW51LnBtKVxuICAgICAgZmluaXNoKClcbiAgICAgIG1lbnUucnVuKHJlc3VsdClcbiAgICB9XG4gICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIGUgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBzdWJtaXQoKVxuICAgIH0pXG4gICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBlID0+IHtcbiAgICAgIGlmIChlLmtleUNvZGUgPT0gMjcpIHtcbiAgICAgICAgZmluaXNoKClcbiAgICAgICAgbWVudS5sZWF2ZSgpXG4gICAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PSAxMyAmJiAhKGUuY3RybEtleSB8fCBlLm1ldGFLZXkgfHwgZS5zaGlmdEtleSkpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIHN1Ym1pdCgpXG4gICAgICB9XG4gICAgfSlcbiAgICAvLyBGSVhNRSB0b28gaGFja3k/XG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmZvY3VzKGZvcm0pLCAyMClcbiAgICByZXR1cm4gZm9ybVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMaW5rRGlhbG9nIGV4dGVuZHMgRGlhbG9nSXRlbSB7XG4gIGZvcm0oKSB7XG4gICAgcmV0dXJuIGVsdChcImZvcm1cIiwgbnVsbCxcbiAgICAgICAgICAgICAgIGVsdChcImRpdlwiLCBudWxsLCBlbHQoXCJpbnB1dFwiLCB7bmFtZTogXCJocmVmXCIsIHR5cGU6IFwidGV4dFwiLCBwbGFjZWhvbGRlcjogXCJUYXJnZXQgVVJMXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZTogNDAsIGF1dG9jb21wbGV0ZTogXCJvZmZcIn0pKSxcbiAgICAgICAgICAgICAgIGVsdChcImRpdlwiLCBudWxsLCBlbHQoXCJpbnB1dFwiLCB7bmFtZTogXCJ0aXRsZVwiLCB0eXBlOiBcInRleHRcIiwgcGxhY2Vob2xkZXI6IFwiVGl0bGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplOiA0MCwgYXV0b2NvbXBsZXRlOiBcIm9mZlwifSkpKVxuICB9XG5cbiAgYXBwbHkoZm9ybSwgcG0pIHtcbiAgICBsZXQgZWx0cyA9IGZvcm0uZWxlbWVudHNcbiAgICBpZiAoIWVsdHMuaHJlZi52YWx1ZSkgcmV0dXJuXG4gICAgbGV0IHNlbCA9IHBtLnNlbGVjdGlvblxuICAgIHBtLmFwcGx5KHBtLnRyLmFkZFN0eWxlKHNlbC5mcm9tLCBzZWwudG8sIHN0eWxlLmxpbmsoZWx0cy5ocmVmLnZhbHVlLCBlbHRzLnRpdGxlLnZhbHVlKSkpXG4gIH1cbn1cbmNvbnN0IGxpbmtEaWFsb2cgPSBuZXcgTGlua0RpYWxvZ1xuXG5leHBvcnQgY2xhc3MgSW1hZ2VEaWFsb2cgZXh0ZW5kcyBEaWFsb2dJdGVtIHtcbiAgZm9ybShwbSkge1xuICAgIGxldCBhbHQgPSBwbS5zZWxlY3RlZFRleHRcbiAgICByZXR1cm4gZWx0KFwiZm9ybVwiLCBudWxsLFxuICAgICAgICAgICAgICAgZWx0KFwiZGl2XCIsIG51bGwsIGVsdChcImlucHV0XCIsIHtuYW1lOiBcInNyY1wiLCB0eXBlOiBcInRleHRcIiwgcGxhY2Vob2xkZXI6IFwiSW1hZ2UgVVJMXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZTogNDAsIGF1dG9jb21wbGV0ZTogXCJvZmZcIn0pKSxcbiAgICAgICAgICAgICAgIGVsdChcImRpdlwiLCBudWxsLCBlbHQoXCJpbnB1dFwiLCB7bmFtZTogXCJhbHRcIiwgdHlwZTogXCJ0ZXh0XCIsIHZhbHVlOiBhbHQsIGF1dG9jb21wbGV0ZTogXCJvZmZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogXCJEZXNjcmlwdGlvbiAvIGFsdGVybmF0aXZlIHRleHRcIiwgc2l6ZTogNDB9KSksXG4gICAgICAgICAgICAgICBlbHQoXCJkaXZcIiwgbnVsbCwgZWx0KFwiaW5wdXRcIiwge25hbWU6IFwidGl0bGVcIiwgdHlwZTogXCJ0ZXh0XCIsIHBsYWNlaG9sZGVyOiBcIlRpdGxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZTogNDAsIGF1dGNvbXBsZXRlOiBcIm9mZlwifSkpKVxuICB9XG5cbiAgYXBwbHkoZm9ybSwgcG0pIHtcbiAgICBsZXQgZWx0cyA9IGZvcm0uZWxlbWVudHNcbiAgICBpZiAoIWVsdHMuc3JjLnZhbHVlKSByZXR1cm5cbiAgICBsZXQgc2VsID0gcG0uc2VsZWN0aW9uLCB0ciA9IHBtLnRyXG4gICAgdHIuZGVsZXRlKHNlbC5mcm9tLCBzZWwudG8pXG4gICAgbGV0IGF0dHJzID0ge3NyYzogZWx0cy5zcmMudmFsdWUsIGFsdDogZWx0cy5hbHQudmFsdWUsIHRpdGxlOiBlbHRzLnRpdGxlLnZhbHVlfVxuICAgIHBtLmFwcGx5KHRyLmluc2VydElubGluZShzZWwuZnJvbSwgbmV3IFNwYW4oXCJpbWFnZVwiLCBhdHRycywgbnVsbCwgbnVsbCkpKVxuICB9XG59XG5jb25zdCBpbWFnZURpYWxvZyA9IG5ldyBJbWFnZURpYWxvZ1xuXG5jbGFzcyBTZXBhcmF0b3JJdGVtIGV4dGVuZHMgTWVudUl0ZW0ge1xuICByZW5kZXIoKSB7IHJldHVybiBlbHQoXCJkaXZcIiwge2NsYXNzOiBcIlByb3NlTWlycm9yLW1lbnVzZXBhcmF0b3JcIn0pIH1cbn1cbmV4cG9ydCBjb25zdCBzZXBhcmF0b3JJdGVtID0gbmV3IFNlcGFyYXRvckl0ZW1cblxuY2xhc3MgVW5kb0l0ZW0gZXh0ZW5kcyBJY29uSXRlbSB7XG4gIGNvbnN0cnVjdG9yKCkgeyBzdXBlcihcInVuZG9cIiwgXCJVbmRvXCIpIH1cbiAgc2VsZWN0KHBtKSB7IHJldHVybiBwbS5oaXN0b3J5LmNhblVuZG8oKSB9XG4gIGFwcGx5KHBtKSB7IHBtLmhpc3RvcnkudW5kbygpIH1cbn1cbmNsYXNzIFJlZG9JdGVtIGV4dGVuZHMgSWNvbkl0ZW0ge1xuICBjb25zdHJ1Y3RvcigpIHsgc3VwZXIoXCJyZWRvXCIsIFwiUmVkb1wiKSB9XG4gIHNlbGVjdChwbSkgeyByZXR1cm4gcG0uaGlzdG9yeS5jYW5SZWRvKCkgfVxuICBhcHBseShwbSkgeyBwbS5oaXN0b3J5LnJlZG8oKSB9XG59XG5jbGFzcyBIaXN0b3J5U2VwYXJhdG9yIGV4dGVuZHMgU2VwYXJhdG9ySXRlbSB7XG4gIHNlbGVjdChwbSkgeyByZXR1cm4gcG0uaGlzdG9yeS5jYW5VbmRvKCkgfHwgcG0uaGlzdG9yeS5jYW5SZWRvKCkgfVxufVxuXG5jb25zdCBibG9ja1R5cGVzID0gW1xuICB7bmFtZTogXCJOb3JtYWxcIiwgbm9kZTogbmV3IE5vZGUoXCJwYXJhZ3JhcGhcIil9LFxuICB7bmFtZTogXCJDb2RlXCIsIG5vZGU6IG5ldyBOb2RlKFwiY29kZV9ibG9ja1wiKX1cbl1cbmZvciAobGV0IGkgPSAxOyBpIDw9IDY7IGkrKylcbiAgYmxvY2tUeXBlcy5wdXNoKHtuYW1lOiBcIkhlYWQgXCIgKyBpLCBub2RlOiBuZXcgTm9kZShcImhlYWRpbmdcIiwge2xldmVsOiBpfSl9KVxuZnVuY3Rpb24gZ2V0QmxvY2tUeXBlKGJsb2NrKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYmxvY2tUeXBlcy5sZW5ndGg7IGkrKylcbiAgICBpZiAoYmxvY2tUeXBlc1tpXS5ub2RlLnNhbWVNYXJrdXAoYmxvY2spKSByZXR1cm4gYmxvY2tUeXBlc1tpXVxufVxuXG5jbGFzcyBCbG9ja1R5cGVJdGVtIGV4dGVuZHMgTWVudUl0ZW0ge1xuICByZW5kZXIobWVudSkge1xuICAgIGxldCBzZWwgPSBtZW51LnBtLnNlbGVjdGlvbiwgdHlwZVxuICAgIGlmIChQb3Muc2FtZVBhdGgoc2VsLmhlYWQucGF0aCwgc2VsLmFuY2hvci5wYXRoKSkgdHlwZSA9IGdldEJsb2NrVHlwZShtZW51LnBtLmRvYy5wYXRoKHNlbC5oZWFkLnBhdGgpKVxuICAgIGxldCBkb20gPSBlbHQoXCJkaXZcIiwge2NsYXNzOiBcIlByb3NlTWlycm9yLWJsb2NrdHlwZVwiLCB0aXRsZTogXCJQYXJhZ3JhcGggdHlwZVwifSxcbiAgICAgICAgICAgICAgICAgIHR5cGUgPyB0eXBlLm5hbWUgOiBcIlR5cGUuLi5cIilcbiAgICBkb20uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBlID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTsgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgc2hvd0Jsb2NrVHlwZU1lbnUobWVudS5wbSwgZG9tKVxuICAgIH0pXG4gICAgcmV0dXJuIGRvbVxuICB9XG59XG5cbmZ1bmN0aW9uIHNob3dCbG9ja1R5cGVNZW51KHBtLCBkb20pIHtcbiAgbGV0IG1lbnUgPSBlbHQoXCJkaXZcIiwge2NsYXNzOiBcIlByb3NlTWlycm9yLWJsb2NrdHlwZS1tZW51XCJ9LFxuICAgICAgICAgICAgICAgICBibG9ja1R5cGVzLm1hcCh0ID0+IHtcbiAgICAgICAgICAgICAgICAgICBsZXQgZG9tID0gZWx0KFwiZGl2XCIsIG51bGwsIHQubmFtZSlcbiAgICAgICAgICAgICAgICAgICBkb20uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgICAgICAgbGV0IHNlbCA9IHBtLnNlbGVjdGlvblxuICAgICAgICAgICAgICAgICAgICAgcG0uYXBwbHkocG0udHIuc2V0QmxvY2tUeXBlKHNlbC5mcm9tLCBzZWwudG8sIHQubm9kZSkpXG4gICAgICAgICAgICAgICAgICAgICBmaW5pc2goKVxuICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvbVxuICAgICAgICAgICAgICAgICB9KSlcbiAgbGV0IHBvcyA9IGRvbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgYm94ID0gcG0ud3JhcHBlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICBtZW51LnN0eWxlLmxlZnQgPSAocG9zLmxlZnQgLSBib3gubGVmdCAtIDIpICsgXCJweFwiXG4gIG1lbnUuc3R5bGUudG9wID0gKHBvcy50b3AgLSBib3gudG9wIC0gMikgKyBcInB4XCJcblxuICBsZXQgZG9uZSA9IGZhbHNlXG4gIGZ1bmN0aW9uIGZpbmlzaCgpIHtcbiAgICBpZiAoZG9uZSkgcmV0dXJuXG4gICAgZG9uZSA9IHRydWVcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZmluaXNoKVxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZmluaXNoKVxuICAgIHBtLndyYXBwZXIucmVtb3ZlQ2hpbGQobWVudSlcbiAgfVxuICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZmluaXNoKVxuICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZpbmlzaClcbiAgcG0ud3JhcHBlci5hcHBlbmRDaGlsZChtZW51KVxufVxuXG5yZWdpc3Rlckl0ZW0oXCJpbmxpbmVcIiwgbmV3IElubGluZVN0eWxlSXRlbShcInN0cm9uZ1wiLCBcIlN0cm9uZyB0ZXh0XCIsIHN0eWxlLnN0cm9uZykpXG5yZWdpc3Rlckl0ZW0oXCJpbmxpbmVcIiwgbmV3IElubGluZVN0eWxlSXRlbShcImVtXCIsIFwiRW1waGFzaXplZCB0ZXh0XCIsIHN0eWxlLmVtKSlcbnJlZ2lzdGVySXRlbShcImlubGluZVwiLCBuZXcgSW5saW5lU3R5bGVJdGVtKFwibGlua1wiLCBcIkh5cGVybGlua1wiLCBcImxpbmtcIiwgbGlua0RpYWxvZykpXG5yZWdpc3Rlckl0ZW0oXCJpbmxpbmVcIiwgbmV3IElubGluZVN0eWxlSXRlbShcImNvZGVcIiwgXCJDb2RlIGZvbnRcIiwgc3R5bGUuY29kZSkpXG5yZWdpc3Rlckl0ZW0oXCJpbmxpbmVcIiwgbmV3IEltYWdlSXRlbShcImltYWdlXCIpKVxuXG5yZWdpc3Rlckl0ZW0oXCJibG9ja1wiLCBuZXcgQmxvY2tUeXBlSXRlbSlcbnJlZ2lzdGVySXRlbShcImJsb2NrXCIsIG5ldyBMaWZ0SXRlbSlcbnJlZ2lzdGVySXRlbShcImJsb2NrXCIsIG5ldyBXcmFwSXRlbShcImxpc3Qtb2xcIiwgXCJXcmFwIGluIG9yZGVyZWQgbGlzdFwiLCBcIm9yZGVyZWRfbGlzdFwiKSlcbnJlZ2lzdGVySXRlbShcImJsb2NrXCIsIG5ldyBXcmFwSXRlbShcImxpc3QtdWxcIiwgXCJXcmFwIGluIGJ1bGxldCBsaXN0XCIsIFwiYnVsbGV0X2xpc3RcIikpXG5yZWdpc3Rlckl0ZW0oXCJibG9ja1wiLCBuZXcgV3JhcEl0ZW0oXCJxdW90ZVwiLCBcIldyYXAgaW4gYmxvY2txdW90ZVwiLCBcImJsb2NrcXVvdGVcIikpXG5yZWdpc3Rlckl0ZW0oXCJibG9ja1wiLCBuZXcgSW5zZXJ0QmxvY2tJdGVtKFwiaHJcIiwgXCJJbnNlcnQgaG9yaXpvbnRhbCBydWxlXCIsIFwiaG9yaXpvbnRhbF9ydWxlXCIpKVxucmVnaXN0ZXJJdGVtKFwiYmxvY2tcIiwgbmV3IEpvaW5JdGVtKVxuXG5yZWdpc3Rlckl0ZW0oXCJoaXN0b3J5XCIsIG5ldyBIaXN0b3J5U2VwYXJhdG9yKVxucmVnaXN0ZXJJdGVtKFwiaGlzdG9yeVwiLCBuZXcgVW5kb0l0ZW0pXG5yZWdpc3Rlckl0ZW0oXCJoaXN0b3J5XCIsIG5ldyBSZWRvSXRlbSlcblxuLy8gQXdrd2FyZCBoYWNrIHRvIGZvcmNlIENocm9tZSB0byBpbml0aWFsaXplIHRoZSBmb250IGFuZCBub3QgcmV0dXJuXG4vLyBpbmNvcnJlY3Qgc2l6ZSBpbmZvcm1hdGlvbiB0aGUgZmlyc3QgdGltZSBpdCBpcyB1c2VkLlxuXG5sZXQgZm9yY2VkID0gZmFsc2VcbmV4cG9ydCBmdW5jdGlvbiBmb3JjZUZvbnRMb2FkKHBtKSB7XG4gIGlmIChmb3JjZWQpIHJldHVyblxuICBmb3JjZWQgPSB0cnVlXG5cbiAgbGV0IG5vZGUgPSBwbS53cmFwcGVyLmFwcGVuZENoaWxkKGVsdChcImRpdlwiLCB7Y2xhc3M6IFwiUHJvc2VNaXJyb3ItbWVudWljb24gUHJvc2VNaXJyb3ItaWNvbi1zdHJvbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiBcInZpc2liaWxpdHk6IGhpZGRlbjsgcG9zaXRpb246IGFic29sdXRlXCJ9KSlcbiAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4gcG0ud3JhcHBlci5yZW1vdmVDaGlsZChub2RlKSwgMjApXG59XG5cbmluc2VydENTUyhgXG5cbi5Qcm9zZU1pcnJvci1tZW51aWNvbiB7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgcGFkZGluZzogMXB4IDRweDtcbiAgbWFyZ2luOiAwIDJweDtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICB0ZXh0LXJlbmRlcmluZzogYXV0bztcbiAgLXdlYmtpdC1mb250LXNtb290aGluZzogYW50aWFsaWFzZWQ7XG4gIC1tb3otb3N4LWZvbnQtc21vb3RoaW5nOiBncmF5c2NhbGU7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbn1cblxuLlByb3NlTWlycm9yLW1lbnVpY29uLWFjdGl2ZSB7XG4gIGJhY2tncm91bmQ6ICM2NjY7XG4gIGJvcmRlci1yYWRpdXM6IDRweDtcbn1cblxuLlByb3NlTWlycm9yLW1lbnVzZXBhcmF0b3Ige1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG59XG4uUHJvc2VNaXJyb3ItbWVudXNlcGFyYXRvcjphZnRlciB7XG4gIGNvbnRlbnQ6IFwi77iZXCI7XG4gIG9wYWNpdHk6IDAuNTtcbiAgcGFkZGluZzogMCA0cHg7XG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG59XG5cbi5Qcm9zZU1pcnJvci1ibG9ja3R5cGUsIC5Qcm9zZU1pcnJvci1ibG9ja3R5cGUtbWVudSB7XG4gIGJvcmRlcjogMXB4IHNvbGlkICM3Nzc7XG4gIGJvcmRlci1yYWRpdXM6IDNweDtcbiAgZm9udC1zaXplOiA5MCU7XG59XG5cbi5Qcm9zZU1pcnJvci1ibG9ja3R5cGUge1xuICBwYWRkaW5nOiAxcHggMnB4IDFweCA0cHg7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBtYXJnaW46IDAgNHB4O1xufVxuXG4uUHJvc2VNaXJyb3ItYmxvY2t0eXBlOmFmdGVyIHtcbiAgY29udGVudDogXCIg4pa/XCI7XG4gIGNvbG9yOiAjNzc3O1xuICB2ZXJ0aWNhbC1hbGlnbjogdG9wO1xufVxuXG4uUHJvc2VNaXJyb3ItYmxvY2t0eXBlLW1lbnUge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGJhY2tncm91bmQ6ICM0NDQ7XG4gIGNvbG9yOiB3aGl0ZTtcbiAgcGFkZGluZzogMnB4IDJweDtcbiAgei1pbmRleDogNTtcbn1cbi5Qcm9zZU1pcnJvci1ibG9ja3R5cGUtbWVudSBkaXYge1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHBhZGRpbmc6IDAgMWVtIDAgMnB4O1xufVxuLlByb3NlTWlycm9yLWJsb2NrdHlwZS1tZW51IGRpdjpob3ZlciB7XG4gIGJhY2tncm91bmQ6ICM3Nzc7XG59XG5cbmApXG4iLCJpbXBvcnQge2VsdH0gZnJvbSBcIi4uL2RvbVwiXG5pbXBvcnQgaW5zZXJ0Q1NTIGZyb20gXCJpbnNlcnQtY3NzXCJcblxuZXhwb3J0IGNsYXNzIE1lbnUge1xuICBjb25zdHJ1Y3RvcihwbSwgZGlzcGxheSkge1xuICAgIHRoaXMuZGlzcGxheSA9IGRpc3BsYXlcbiAgICB0aGlzLnN0YWNrID0gW11cbiAgICB0aGlzLnBtID0gcG1cbiAgfVxuXG4gIHNob3coY29udGVudCwgZGlzcGxheUluZm8pIHtcbiAgICB0aGlzLnN0YWNrLmxlbmd0aCA9IDBcbiAgICB0aGlzLmVudGVyKGNvbnRlbnQsIGRpc3BsYXlJbmZvKVxuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5zdGFjay5sZW5ndGggPSAwXG4gICAgdGhpcy5kaXNwbGF5LnJlc2V0KClcbiAgfVxuXG4gIGVudGVyKGNvbnRlbnQsIGRpc3BsYXlJbmZvKSB7XG4gICAgbGV0IHNlbGVjdGVkID0gY29udGVudC5maWx0ZXIoaSA9PiBpLnNlbGVjdCh0aGlzLnBtKSlcbiAgICBpZiAoIXNlbGVjdGVkLmxlbmd0aCkgcmV0dXJuIHRoaXMuZGlzcGxheS5jbGVhcigpXG5cbiAgICB0aGlzLnN0YWNrLnB1c2goc2VsZWN0ZWQpXG4gICAgdGhpcy5kcmF3KGRpc3BsYXlJbmZvKVxuICB9XG5cbiAgZ2V0IGFjdGl2ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGFjay5sZW5ndGggPiAxXG4gIH1cblxuICBkcmF3KGRpc3BsYXlJbmZvKSB7XG4gICAgbGV0IGN1ciA9IHRoaXMuc3RhY2tbdGhpcy5zdGFjay5sZW5ndGggLSAxXVxuICAgIGxldCByZW5kZXJlZCA9IGVsdChcImRpdlwiLCB7Y2xhc3M6IFwiUHJvc2VNaXJyb3ItbWVudVwifSwgY3VyLm1hcChpdGVtID0+IGl0ZW0ucmVuZGVyKHRoaXMpKSlcbiAgICBpZiAodGhpcy5zdGFjay5sZW5ndGggPiAxKVxuICAgICAgdGhpcy5kaXNwbGF5LmVudGVyKHJlbmRlcmVkLCAoKSA9PiB0aGlzLmxlYXZlKCksIGRpc3BsYXlJbmZvKVxuICAgIGVsc2VcbiAgICAgIHRoaXMuZGlzcGxheS5zaG93KHJlbmRlcmVkLCBkaXNwbGF5SW5mbylcbiAgfVxuXG4gIHJ1bihjb250ZW50KSB7XG4gICAgaWYgKCFjb250ZW50KSByZXR1cm4gdGhpcy5yZXNldCgpXG4gICAgZWxzZSB0aGlzLmVudGVyKGNvbnRlbnQpXG4gIH1cblxuICBsZWF2ZSgpIHtcbiAgICB0aGlzLnN0YWNrLnBvcCgpXG4gICAgaWYgKHRoaXMuc3RhY2subGVuZ3RoKVxuICAgICAgdGhpcy5kcmF3KClcbiAgICBlbHNlXG4gICAgICB0aGlzLmRpc3BsYXkucmVzZXQoKVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUb29sdGlwRGlzcGxheSB7XG4gIGNvbnN0cnVjdG9yKHRvb2x0aXAsIHJlc2V0RnVuYykge1xuICAgIHRoaXMudG9vbHRpcCA9IHRvb2x0aXBcbiAgICB0aGlzLnJlc2V0RnVuYyA9IHJlc2V0RnVuY1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy50b29sdGlwLmNsb3NlKClcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIGlmICh0aGlzLnJlc2V0RnVuYykgdGhpcy5yZXNldEZ1bmMoKVxuICAgIGVsc2UgdGhpcy5jbGVhcigpXG4gIH1cblxuICBzaG93KGRvbSwgaW5mbykge1xuICAgIHRoaXMudG9vbHRpcC5vcGVuKGRvbSwgaW5mbylcbiAgfVxuXG4gIGVudGVyKGRvbSwgYmFjaywgaW5mbykge1xuICAgIGxldCBidXR0b24gPSBlbHQoXCJkaXZcIiwge2NsYXNzOiBcIlByb3NlTWlycm9yLXRvb2x0aXAtYmFja1wiLCB0aXRsZTogXCJCYWNrXCJ9KVxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGUgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpOyBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICBiYWNrKClcbiAgICB9KVxuICAgIHRoaXMuc2hvdyhlbHQoXCJkaXZcIiwge2NsYXNzOiBcIlByb3NlTWlycm9yLXRvb2x0aXAtYmFjay13cmFwcGVyXCJ9LCBkb20sIGJ1dHRvbiksIGluZm8pXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE1lbnVJdGVtIHtcbiAgc2VsZWN0KCkgeyByZXR1cm4gdHJ1ZSB9XG4gIHJlbmRlcigpIHsgdGhyb3cgbmV3IEVycm9yKFwiWW91IGhhdmUgdG8gaW1wbGVtZW50IHRoaXNcIikgfVxufVxuXG5pbnNlcnRDU1MoYFxuXG4uUHJvc2VNaXJyb3ItbWVudSB7XG4gIG1hcmdpbjogMCAtNHB4O1xuICBsaW5lLWhlaWdodDogMTtcbiAgd2hpdGUtc3BhY2U6IHByZTtcbiAgd2lkdGg6IC13ZWJraXQtZml0LWNvbnRlbnQ7XG4gIHdpZHRoOiBmaXQtY29udGVudDtcbn1cblxuLlByb3NlTWlycm9yLXRvb2x0aXAtYmFjay13cmFwcGVyIHtcbiAgcGFkZGluZy1sZWZ0OiAxMnB4O1xufVxuLlByb3NlTWlycm9yLXRvb2x0aXAtYmFjayB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiA1cHg7IGxlZnQ6IDVweDtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuLlByb3NlTWlycm9yLXRvb2x0aXAtYmFjazphZnRlciB7XG4gIGNvbnRlbnQ6IFwiwqtcIjtcbn1cblxuYClcbiIsImltcG9ydCB7ZGVmaW5lT3B0aW9ufSBmcm9tIFwiLi4vZWRpdFwiXG5pbXBvcnQge2VsdH0gZnJvbSBcIi4uL2RvbVwiXG5pbXBvcnQge0RlYm91bmNlZH0gZnJvbSBcIi4uL3V0aWwvZGVib3VuY2VcIlxuXG5pbXBvcnQge01lbnV9IGZyb20gXCIuL21lbnVcIlxuaW1wb3J0IHtnZXRJdGVtcywgc2VwYXJhdG9ySXRlbX0gZnJvbSBcIi4vaXRlbXNcIlxuXG5pbXBvcnQgaW5zZXJ0Q1NTIGZyb20gXCJpbnNlcnQtY3NzXCJcbmltcG9ydCBcIi4vaWNvbnNcIlxuXG5kZWZpbmVPcHRpb24oXCJtZW51QmFyXCIsIGZhbHNlLCBmdW5jdGlvbihwbSwgdmFsdWUpIHtcbiAgaWYgKHBtLm1vZC5tZW51QmFyKSBwbS5tb2QubWVudUJhci5kZXRhY2goKVxuICBwbS5tb2QubWVudUJhciA9IHZhbHVlID8gbmV3IE1lbnVCYXIocG0sIHZhbHVlKSA6IG51bGxcbn0pXG5cbmNsYXNzIEJhckRpc3BsYXkge1xuICBjb25zdHJ1Y3Rvcihjb250YWluZXIsIHJlc2V0RnVuYykge1xuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyXG4gICAgdGhpcy5yZXNldEZ1bmMgPSByZXNldEZ1bmNcbiAgfVxuICBjbGVhcigpIHsgdGhpcy5jb250YWluZXIudGV4dENvbnRlbnQgPSBcIlwiIH1cbiAgcmVzZXQoKSB7IHRoaXMucmVzZXRGdW5jKCkgfVxuICBzaG93KGRvbSkge1xuICAgIHRoaXMuY2xlYXIoKVxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGRvbSlcbiAgfVxuICBlbnRlcihkb20sIGJhY2spIHtcbiAgICBsZXQgY3VycmVudCA9IHRoaXMuY29udGFpbmVyLmZpcnN0Q2hpbGRcbiAgICBpZiAoY3VycmVudCkge1xuICAgICAgY3VycmVudC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIlxuICAgICAgY3VycmVudC5zdHlsZS5vcGFjaXR5ID0gXCIwLjVcIlxuICAgIH1cbiAgICBsZXQgYmFja0J1dHRvbiA9IGVsdChcImRpdlwiLCB7Y2xhc3M6IFwiUHJvc2VNaXJyb3ItbWVudWJhci1iYWNrXCJ9KVxuICAgIGJhY2tCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBlID0+IHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTsgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgYmFjaygpXG4gICAgfSlcbiAgICBsZXQgYWRkZWQgPSBlbHQoXCJkaXZcIiwge2NsYXNzOiBcIlByb3NlTWlycm9yLW1lbnViYXItc2xpZGluZ1wifSwgYmFja0J1dHRvbiwgZG9tKVxuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKGFkZGVkKVxuICAgIGFkZGVkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIC8vIEZvcmNlIGxheW91dCBmb3IgdHJhbnNpdGlvblxuICAgIGFkZGVkLnN0eWxlLmxlZnQgPSBcIjBcIlxuICAgIGFkZGVkLmFkZEV2ZW50TGlzdGVuZXIoXCJ0cmFuc2l0aW9uZW5kXCIsICgpID0+IHtcbiAgICAgIGlmIChjdXJyZW50ICYmIGN1cnJlbnQucGFyZW50Tm9kZSkgY3VycmVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGN1cnJlbnQpXG4gICAgfSlcbiAgfVxufVxuXG5jbGFzcyBNZW51QmFyIHtcbiAgY29uc3RydWN0b3IocG0sIGNvbmZpZykge1xuICAgIHRoaXMucG0gPSBwbVxuXG4gICAgdGhpcy5tZW51RWx0ID0gZWx0KFwiZGl2XCIsIHtjbGFzczogXCJQcm9zZU1pcnJvci1tZW51YmFyLWlubmVyXCJ9KVxuICAgIHRoaXMud3JhcHBlciA9IGVsdChcImRpdlwiLCB7Y2xhc3M6IFwiUHJvc2VNaXJyb3ItbWVudWJhclwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgLy8gSGVpZ2h0LWZvcmNpbmcgcGxhY2Vob2xkZXJcbiAgICAgICAgICAgICAgICAgICAgICAgZWx0KFwiZGl2XCIsIHtjbGFzczogXCJQcm9zZU1pcnJvci1tZW51XCIsIHN0eWxlOiBcInZpc2liaWxpdHk6IGhpZGRlblwifSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsdChcImRpdlwiLCB7Y2xhc3M6IFwiUHJvc2VNaXJyb3ItbWVudWljb25cIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWx0KFwic3BhblwiLCB7Y2xhc3M6IFwiUHJvc2VNaXJyb3ItbWVudWljb24gUHJvc2VNaXJyb3ItaWNvbi1zdHJvbmdcIn0pKSksXG4gICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWVudUVsdClcbiAgICBwbS53cmFwcGVyLmluc2VydEJlZm9yZSh0aGlzLndyYXBwZXIsIHBtLndyYXBwZXIuZmlyc3RDaGlsZClcblxuICAgIHRoaXMubWVudSA9IG5ldyBNZW51KHBtLCBuZXcgQmFyRGlzcGxheSh0aGlzLm1lbnVFbHQsICgpID0+IHRoaXMucmVzZXRNZW51KCkpKVxuICAgIHRoaXMuZGVib3VuY2VkID0gbmV3IERlYm91bmNlZChwbSwgMTAwLCAoKSA9PiB0aGlzLnVwZGF0ZSgpKVxuICAgIHBtLm9uKFwic2VsZWN0aW9uQ2hhbmdlXCIsIHRoaXMudXBkYXRlRnVuYyA9ICgpID0+IHRoaXMuZGVib3VuY2VkLnRyaWdnZXIoKSlcbiAgICBwbS5vbihcImNoYW5nZVwiLCB0aGlzLnVwZGF0ZUZ1bmMpXG4gICAgcG0ub24oXCJhY3RpdmVTdHlsZUNoYW5nZVwiLCB0aGlzLnVwZGF0ZUZ1bmMpXG5cbiAgICB0aGlzLm1lbnVJdGVtcyA9IGNvbmZpZyAmJiBjb25maWcuaXRlbXMgfHxcbiAgICAgIFsuLi5nZXRJdGVtcyhcImlubGluZVwiKSwgc2VwYXJhdG9ySXRlbSwgLi4uZ2V0SXRlbXMoXCJibG9ja1wiKSwgLi4uZ2V0SXRlbXMoXCJoaXN0b3J5XCIpXVxuICAgIHRoaXMudXBkYXRlKClcblxuICAgIHRoaXMuZmxvYXRpbmcgPSBmYWxzZVxuICAgIGlmIChjb25maWcgJiYgY29uZmlnLmZsb2F0KSB7XG4gICAgICB0aGlzLnVwZGF0ZUZsb2F0KClcbiAgICAgIHRoaXMuc2Nyb2xsRnVuYyA9ICgpID0+IHtcbiAgICAgICAgaWYgKCFkb2N1bWVudC5ib2R5LmNvbnRhaW5zKHRoaXMucG0ud3JhcHBlcikpXG4gICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgdGhpcy5zY3JvbGxGdW5jKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgdGhpcy51cGRhdGVGbG9hdCgpXG4gICAgICB9XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aGlzLnNjcm9sbEZ1bmMpXG4gICAgfVxuICB9XG5cbiAgZGV0YWNoKCkge1xuICAgIHRoaXMuZGVib3VuY2VkLmNsZWFyKClcbiAgICB0aGlzLndyYXBwZXIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLndyYXBwZXIpXG5cbiAgICB0aGlzLnBtLm9mZihcInNlbGVjdGlvbkNoYW5nZVwiLCB0aGlzLnVwZGF0ZUZ1bmMpXG4gICAgdGhpcy5wbS5vZmYoXCJjaGFuZ2VcIiwgdGhpcy51cGRhdGVGdW5jKVxuICAgIHRoaXMucG0ub2ZmKFwiYWN0aXZlU3R5bGVDaGFuZ2VcIiwgdGhpcy51cGRhdGVGdW5jKVxuICAgIGlmICh0aGlzLnNjcm9sbEZ1bmMpXG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aGlzLnNjcm9sbEZ1bmMpXG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgaWYgKCF0aGlzLm1lbnUuYWN0aXZlKSB0aGlzLnJlc2V0TWVudSgpXG4gICAgaWYgKHRoaXMuZmxvYXRpbmcpIHRoaXMuc2Nyb2xsQ3Vyc29ySWZOZWVkZWQoKVxuICB9XG4gIHJlc2V0TWVudSgpIHtcbiAgICB0aGlzLm1lbnUuc2hvdyh0aGlzLm1lbnVJdGVtcylcbiAgfVxuXG4gIHVwZGF0ZUZsb2F0KCkge1xuICAgIGxldCBlZGl0b3JSZWN0ID0gdGhpcy5wbS53cmFwcGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgaWYgKHRoaXMuZmxvYXRpbmcpIHtcbiAgICAgIGlmIChlZGl0b3JSZWN0LnRvcCA+PSAwIHx8IGVkaXRvclJlY3QuYm90dG9tIDwgdGhpcy5tZW51RWx0Lm9mZnNldEhlaWdodCArIDEwKSB7XG4gICAgICAgIHRoaXMuZmxvYXRpbmcgPSBmYWxzZVxuICAgICAgICB0aGlzLm1lbnVFbHQuc3R5bGUucG9zaXRpb24gPSB0aGlzLm1lbnVFbHQuc3R5bGUubGVmdCA9IHRoaXMubWVudUVsdC5zdHlsZS53aWR0aCA9IFwiXCJcbiAgICAgICAgdGhpcy5tZW51RWx0LnN0eWxlLmRpc3BsYXkgPSBcIlwiXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgYm9yZGVyID0gKHRoaXMucG0ud3JhcHBlci5vZmZzZXRXaWR0aCAtIHRoaXMucG0ud3JhcHBlci5jbGllbnRXaWR0aCkgLyAyXG4gICAgICAgIHRoaXMubWVudUVsdC5zdHlsZS5sZWZ0ID0gKGVkaXRvclJlY3QubGVmdCArIGJvcmRlcikgKyBcInB4XCJcbiAgICAgICAgdGhpcy5tZW51RWx0LnN0eWxlLmRpc3BsYXkgPSAoZWRpdG9yUmVjdC50b3AgPiB3aW5kb3cuaW5uZXJIZWlnaHQgPyBcIm5vbmVcIiA6IFwiXCIpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChlZGl0b3JSZWN0LnRvcCA8IDAgJiYgZWRpdG9yUmVjdC5ib3R0b20gPj0gdGhpcy5tZW51RWx0Lm9mZnNldEhlaWdodCArIDEwKSB7XG4gICAgICAgIHRoaXMuZmxvYXRpbmcgPSB0cnVlXG4gICAgICAgIGxldCBtZW51UmVjdCA9IHRoaXMubWVudUVsdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgICB0aGlzLm1lbnVFbHQuc3R5bGUubGVmdCA9IG1lbnVSZWN0LmxlZnQgKyBcInB4XCJcbiAgICAgICAgdGhpcy5tZW51RWx0LnN0eWxlLndpZHRoID0gbWVudVJlY3Qud2lkdGggKyBcInB4XCJcbiAgICAgICAgdGhpcy5tZW51RWx0LnN0eWxlLnBvc2l0aW9uID0gXCJmaXhlZFwiXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2Nyb2xsQ3Vyc29ySWZOZWVkZWQoKSB7XG4gICAgbGV0IGN1cnNvclBvcyA9IHRoaXMucG0uY29vcmRzQXRQb3ModGhpcy5wbS5zZWxlY3Rpb24uaGVhZClcbiAgICBsZXQgbWVudVJlY3QgPSB0aGlzLm1lbnVFbHQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBpZiAoY3Vyc29yUG9zLnRvcCA8IG1lbnVSZWN0LmJvdHRvbSAmJiBjdXJzb3JQb3MuYm90dG9tID4gbWVudVJlY3QudG9wKSB7XG4gICAgICBsZXQgc2Nyb2xsYWJsZSA9IGZpbmRXcmFwcGluZ1Njcm9sbGFibGUodGhpcy5wbS53cmFwcGVyKVxuICAgICAgaWYgKHNjcm9sbGFibGUpIHNjcm9sbGFibGUuc2Nyb2xsVG9wIC09IChtZW51UmVjdC5ib3R0b20gLSBjdXJzb3JQb3MudG9wKVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBmaW5kV3JhcHBpbmdTY3JvbGxhYmxlKG5vZGUpIHtcbiAgZm9yIChsZXQgY3VyID0gbm9kZS5wYXJlbnROb2RlOyBjdXI7IGN1ciA9IGN1ci5wYXJlbnROb2RlKVxuICAgIGlmIChjdXIuc2Nyb2xsSGVpZ2h0ID4gY3VyLmNsaWVudEhlaWdodCkgcmV0dXJuIGN1clxufVxuXG5pbnNlcnRDU1MoYFxuLlByb3NlTWlycm9yLW1lbnViYXIge1xuICBwYWRkaW5nOiAxcHggNHB4O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIG1hcmdpbi1ib3R0b206IDNweDtcbiAgYm9yZGVyLXRvcC1sZWZ0LXJhZGl1czogaW5oZXJpdDtcbiAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IGluaGVyaXQ7XG59XG5cbi5Qcm9zZU1pcnJvci1tZW51YmFyLWlubmVyIHtcbiAgY29sb3I6ICM2NjY7XG4gIHBhZGRpbmc6IDFweCA0cHg7XG4gIHRvcDogMDsgbGVmdDogMDsgcmlnaHQ6IDA7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHNpbHZlcjtcbiAgYmFja2dyb3VuZDogd2hpdGU7XG4gIC1tb3otYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgYm9yZGVyLXRvcC1sZWZ0LXJhZGl1czogaW5oZXJpdDtcbiAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IGluaGVyaXQ7XG59XG5cbi5Qcm9zZU1pcnJvci1tZW51YmFyIC5Qcm9zZU1pcnJvci1tZW51aWNvbi1hY3RpdmUge1xuICBiYWNrZ3JvdW5kOiAjZWVlO1xufVxuXG4uUHJvc2VNaXJyb3ItbWVudWJhciBpbnB1dFt0eXBlPVwidGV4dFwiXSxcbi5Qcm9zZU1pcnJvci1tZW51YmFyIHRleHRhcmVhIHtcbiAgYmFja2dyb3VuZDogI2VlZTtcbiAgY29sb3I6IGJsYWNrO1xuICBib3JkZXI6IG5vbmU7XG4gIG91dGxpbmU6IG5vbmU7XG4gIG1hcmdpbjogMnB4O1xufVxuXG4uUHJvc2VNaXJyb3ItbWVudWJhciBpbnB1dFt0eXBlPVwidGV4dFwiXSB7XG4gIHBhZGRpbmc6IDAgNHB4O1xufVxuXG4uUHJvc2VNaXJyb3ItbWVudWJhciAuUHJvc2VNaXJyb3ItYmxvY2t0eXBlIHtcbiAgYm9yZGVyOiAxcHggc29saWQgI2NjYztcbiAgbWluLXdpZHRoOiA0ZW07XG59XG4uUHJvc2VNaXJyb3ItbWVudWJhciAuUHJvc2VNaXJyb3ItYmxvY2t0eXBlOmFmdGVyIHtcbiAgY29sb3I6ICNjY2M7XG59XG5cbi5Qcm9zZU1pcnJvci1tZW51YmFyLXNsaWRpbmcge1xuICAtd2Via2l0LXRyYW5zaXRpb246IGxlZnQgMC4ycyBlYXNlLW91dDtcbiAgLW1vei10cmFuc2l0aW9uOiBsZWZ0IDAuMnMgZWFzZS1vdXQ7XG4gIHRyYW5zaXRpb246IGxlZnQgMC4ycyBlYXNlLW91dDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBsZWZ0OiAxMDAlO1xuICB3aWR0aDogMTAwJTtcbiAgcGFkZGluZy1sZWZ0OiAxNnB4O1xuICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbn1cblxuLlByb3NlTWlycm9yLW1lbnViYXItYmFjayB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgaGVpZ2h0OiAxMDAlO1xuICBtYXJnaW4tdG9wOiAtMXB4O1xuICBwYWRkaW5nLWJvdHRvbTogMnB4O1xuICB3aWR0aDogMTBweDtcbiAgbGVmdDogMDtcbiAgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQgc2lsdmVyO1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG4uUHJvc2VNaXJyb3ItbWVudWJhci1iYWNrOmFmdGVyIHtcbiAgY29udGVudDogXCLCq1wiO1xufVxuXG5gKVxuIiwiaW1wb3J0IHtlbHR9IGZyb20gXCIuLi9kb21cIlxuaW1wb3J0IGluc2VydENTUyBmcm9tIFwiaW5zZXJ0LWNzc1wiXG5cbmNvbnN0IHByZWZpeCA9IFwiUHJvc2VNaXJyb3ItdG9vbHRpcFwiXG5cbmV4cG9ydCBjbGFzcyBUb29sdGlwIHtcbiAgY29uc3RydWN0b3IocG0sIGRpcikge1xuICAgIHRoaXMucG0gPSBwbVxuICAgIHRoaXMuZGlyID0gZGlyIHx8IFwiYWJvdmVcIlxuICAgIHRoaXMucG9pbnRlciA9IHBtLndyYXBwZXIuYXBwZW5kQ2hpbGQoZWx0KFwiZGl2XCIsIHtjbGFzczogcHJlZml4ICsgXCItcG9pbnRlci1cIiArIHRoaXMuZGlyICsgXCIgXCIgKyBwcmVmaXggKyBcIi1wb2ludGVyXCJ9KSlcbiAgICB0aGlzLnBvaW50ZXJXaWR0aCA9IHRoaXMucG9pbnRlckhlaWdodCA9IG51bGxcbiAgICB0aGlzLmRvbSA9IHBtLndyYXBwZXIuYXBwZW5kQ2hpbGQoZWx0KFwiZGl2XCIsIHtjbGFzczogcHJlZml4fSkpXG4gICAgdGhpcy5kb20uYWRkRXZlbnRMaXN0ZW5lcihcInRyYW5zaXRpb25lbmRcIiwgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuZG9tLnN0eWxlLm9wYWNpdHkgPT0gXCIwXCIpXG4gICAgICAgIHRoaXMuZG9tLnN0eWxlLmRpc3BsYXkgPSB0aGlzLnBvaW50ZXIuc3R5bGUuZGlzcGxheSA9IFwiXCJcbiAgICB9KVxuXG4gICAgdGhpcy5pc09wZW4gPSBmYWxzZVxuICAgIHRoaXMubGFzdExlZnQgPSB0aGlzLmxhc3RSaWdodCA9IG51bGxcbiAgfVxuXG4gIGRldGFjaCgpIHtcbiAgICB0aGlzLmRvbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuZG9tKVxuICAgIHRoaXMucG9pbnRlci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMucG9pbnRlcilcbiAgfVxuXG4gIGdldFNpemUobm9kZSkge1xuICAgIGxldCB3cmFwID0gdGhpcy5wbS53cmFwcGVyLmFwcGVuZENoaWxkKGVsdChcImRpdlwiLCB7XG4gICAgICBjbGFzczogcHJlZml4LFxuICAgICAgc3R5bGU6IFwiZGlzcGxheTogYmxvY2s7IHBvc2l0aW9uOiBhYnNvbHV0ZVwiXG4gICAgfSwgbm9kZSkpXG4gICAgbGV0IHNpemUgPSB7d2lkdGg6IHdyYXAub2Zmc2V0V2lkdGgsIGhlaWdodDogd3JhcC5vZmZzZXRIZWlnaHR9XG4gICAgd3JhcC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHdyYXApXG4gICAgcmV0dXJuIHNpemVcbiAgfVxuXG4gIG9wZW4obm9kZSwgcG9zKSB7XG4gICAgbGV0IGxlZnQgPSB0aGlzLmxhc3RMZWZ0ID0gcG9zID8gcG9zLmxlZnQgOiB0aGlzLmxhc3RMZWZ0XG4gICAgbGV0IHRvcCA9IHRoaXMubGFzdFRvcCA9IHBvcyA/IHBvcy50b3AgOiB0aGlzLmxhc3RUb3BcblxuICAgIGxldCBzaXplID0gdGhpcy5nZXRTaXplKG5vZGUpXG5cbiAgICBsZXQgYXJvdW5kID0gdGhpcy5wbS53cmFwcGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICBmb3IgKGxldCBjaGlsZCA9IHRoaXMuZG9tLmZpcnN0Q2hpbGQsIG5leHQ7IGNoaWxkOyBjaGlsZCA9IG5leHQpIHtcbiAgICAgIG5leHQgPSBjaGlsZC5uZXh0U2libGluZ1xuICAgICAgaWYgKGNoaWxkICE9IHRoaXMucG9pbnRlcikgdGhpcy5kb20ucmVtb3ZlQ2hpbGQoY2hpbGQpXG4gICAgfVxuICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKG5vZGUpXG5cbiAgICB0aGlzLmRvbS5zdHlsZS5kaXNwbGF5ID0gdGhpcy5wb2ludGVyLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCJcblxuICAgIGlmICh0aGlzLnBvaW50ZXJXaWR0aCA9PSBudWxsKSB7XG4gICAgICB0aGlzLnBvaW50ZXJXaWR0aCA9IHRoaXMucG9pbnRlci5vZmZzZXRXaWR0aCAtIDFcbiAgICAgIHRoaXMucG9pbnRlckhlaWdodCA9IHRoaXMucG9pbnRlci5vZmZzZXRIZWlnaHQgLSAxXG4gICAgfVxuXG4gICAgdGhpcy5kb20uc3R5bGUud2lkdGggPSBzaXplLndpZHRoICsgXCJweFwiXG4gICAgdGhpcy5kb20uc3R5bGUuaGVpZ2h0ID0gc2l6ZS5oZWlnaHQgKyBcInB4XCJcblxuICAgIGNvbnN0IG1hcmdpbiA9IDVcbiAgICBpZiAodGhpcy5kaXIgPT0gXCJhYm92ZVwiIHx8IHRoaXMuZGlyID09IFwiYmVsb3dcIikge1xuICAgICAgbGV0IHRpcExlZnQgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihsZWZ0IC0gc2l6ZS53aWR0aCAvIDIsIHdpbmRvdy5pbm5lcldpZHRoIC0gc2l6ZS53aWR0aCkpXG4gICAgICB0aGlzLmRvbS5zdHlsZS5sZWZ0ID0gKHRpcExlZnQgLSBhcm91bmQubGVmdCkgKyBcInB4XCJcbiAgICAgIHRoaXMucG9pbnRlci5zdHlsZS5sZWZ0ID0gKGxlZnQgLSBhcm91bmQubGVmdCAtIHRoaXMucG9pbnRlcldpZHRoIC8gMikgKyBcInB4XCJcbiAgICAgIGlmICh0aGlzLmRpciA9PSBcImFib3ZlXCIpIHtcbiAgICAgICAgbGV0IHRpcFRvcCA9IHRvcCAtIGFyb3VuZC50b3AgLSBtYXJnaW4gLSB0aGlzLnBvaW50ZXJIZWlnaHQgLSBzaXplLmhlaWdodFxuICAgICAgICB0aGlzLmRvbS5zdHlsZS50b3AgPSB0aXBUb3AgKyBcInB4XCJcbiAgICAgICAgdGhpcy5wb2ludGVyLnN0eWxlLnRvcCA9ICh0aXBUb3AgKyBzaXplLmhlaWdodCkgKyBcInB4XCJcbiAgICAgIH0gZWxzZSB7IC8vIGJlbG93XG4gICAgICAgIGxldCB0aXBUb3AgPSB0b3AgLSBhcm91bmQudG9wICsgbWFyZ2luXG4gICAgICAgIHRoaXMucG9pbnRlci5zdHlsZS50b3AgPSB0aXBUb3AgKyBcInB4XCJcbiAgICAgICAgdGhpcy5kb20uc3R5bGUudG9wID0gKHRpcFRvcCArIHRoaXMucG9pbnRlckhlaWdodCkgKyBcInB4XCJcbiAgICAgIH1cbiAgICB9IGVsc2UgeyAvLyBsZWZ0L3JpZ2h0XG4gICAgICB0aGlzLmRvbS5zdHlsZS50b3AgPSAodG9wIC0gYXJvdW5kLnRvcCAtIHNpemUuaGVpZ2h0IC8gMikgKyBcInB4XCJcbiAgICAgIHRoaXMucG9pbnRlci5zdHlsZS50b3AgPSAodG9wIC0gdGhpcy5wb2ludGVySGVpZ2h0IC8gMiAtIGFyb3VuZC50b3ApICsgXCJweFwiXG4gICAgICBpZiAodGhpcy5kaXIgPT0gXCJsZWZ0XCIpIHtcbiAgICAgICAgbGV0IHBvaW50ZXJMZWZ0ID0gbGVmdCAtIGFyb3VuZC5sZWZ0IC0gbWFyZ2luIC0gdGhpcy5wb2ludGVyV2lkdGhcbiAgICAgICAgdGhpcy5kb20uc3R5bGUubGVmdCA9IChwb2ludGVyTGVmdCAtIHNpemUud2lkdGgpICsgXCJweFwiXG4gICAgICAgIHRoaXMucG9pbnRlci5zdHlsZS5sZWZ0ID0gcG9pbnRlckxlZnQgKyBcInB4XCJcbiAgICAgIH0gZWxzZSB7IC8vIHJpZ2h0XG4gICAgICAgIGxldCBwb2ludGVyTGVmdCA9IGxlZnQgLSBhcm91bmQubGVmdCArIG1hcmdpblxuICAgICAgICB0aGlzLmRvbS5zdHlsZS5sZWZ0ID0gKHBvaW50ZXJMZWZ0ICsgdGhpcy5wb2ludGVyV2lkdGgpICsgXCJweFwiXG4gICAgICAgIHRoaXMucG9pbnRlci5zdHlsZS5sZWZ0ID0gcG9pbnRlckxlZnQgKyBcInB4XCJcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRDb21wdXRlZFN0eWxlKHRoaXMuZG9tKS5vcGFjaXR5XG4gICAgZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLnBvaW50ZXIpLm9wYWNpdHlcbiAgICB0aGlzLmRvbS5zdHlsZS5vcGFjaXR5ID0gdGhpcy5wb2ludGVyLnN0eWxlLm9wYWNpdHkgPSAxXG4gICAgdGhpcy5pc09wZW4gPSB0cnVlXG4gIH1cblxuICBjbG9zZSgpIHtcbiAgICBpZiAodGhpcy5pc09wZW4pIHtcbiAgICAgIHRoaXMuaXNPcGVuID0gZmFsc2VcbiAgICAgIHRoaXMuZG9tLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnBvaW50ZXIuc3R5bGUub3BhY2l0eSA9IDBcbiAgICB9XG4gIH1cbn1cblxuaW5zZXJ0Q1NTKGBcblxuLlByb3NlTWlycm9yLXRvb2x0aXAge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGRpc3BsYXk6IG5vbmU7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIC1tb3otYm94LXNpemluZzogYm9yZGVyLSBib3g7XG4gIG92ZXJmbG93OiBoaWRkZW47XG5cbiAgLXdlYmtpdC10cmFuc2l0aW9uOiB3aWR0aCAwLjRzIGVhc2Utb3V0LCBoZWlnaHQgMC40cyBlYXNlLW91dCwgbGVmdCAwLjRzIGVhc2Utb3V0LCB0b3AgMC40cyBlYXNlLW91dCwgb3BhY2l0eSAwLjJzO1xuICAtbW96LXRyYW5zaXRpb246IHdpZHRoIDAuNHMgZWFzZS1vdXQsIGhlaWdodCAwLjRzIGVhc2Utb3V0LCBsZWZ0IDAuNHMgZWFzZS1vdXQsIHRvcCAwLjRzIGVhc2Utb3V0LCBvcGFjaXR5IDAuMnM7XG4gIHRyYW5zaXRpb246IHdpZHRoIDAuNHMgZWFzZS1vdXQsIGhlaWdodCAwLjRzIGVhc2Utb3V0LCBsZWZ0IDAuNHMgZWFzZS1vdXQsIHRvcCAwLjRzIGVhc2Utb3V0LCBvcGFjaXR5IDAuMnM7XG4gIG9wYWNpdHk6IDA7XG5cbiAgYm9yZGVyLXJhZGl1czogNXB4O1xuICBwYWRkaW5nOiAzcHggN3B4O1xuICBtYXJnaW46IDA7XG4gIGJhY2tncm91bmQ6ICM0NDQ7XG4gIGJvcmRlci1jb2xvcjogIzc3NztcbiAgY29sb3I6IHdoaXRlO1xuXG4gIHotaW5kZXg6IDU7XG59XG5cbi5Qcm9zZU1pcnJvci10b29sdGlwLXBvaW50ZXIge1xuICBjb250ZW50OiBcIlwiO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGRpc3BsYXk6IG5vbmU7XG4gIHdpZHRoOiAwOyBoZWlnaHQ6IDA7XG5cbiAgLXdlYmtpdC10cmFuc2l0aW9uOiBsZWZ0IDAuNHMgZWFzZS1vdXQsIHRvcCAwLjRzIGVhc2Utb3V0LCBvcGFjaXR5IDAuMnM7XG4gIC1tb3otdHJhbnNpdGlvbjogbGVmdCAwLjRzIGVhc2Utb3V0LCB0b3AgMC40cyBlYXNlLW91dCwgb3BhY2l0eSAwLjJzO1xuICB0cmFuc2l0aW9uOiBsZWZ0IDAuNHMgZWFzZS1vdXQsIHRvcCAwLjRzIGVhc2Utb3V0LCBvcGFjaXR5IDAuMnM7XG4gIG9wYWNpdHk6IDA7XG5cbiAgei1pbmRleDogNTtcbn1cblxuLlByb3NlTWlycm9yLXRvb2x0aXAtcG9pbnRlci1hYm92ZSB7XG4gIGJvcmRlci1sZWZ0OiA2cHggc29saWQgdHJhbnNwYXJlbnQ7XG4gIGJvcmRlci1yaWdodDogNnB4IHNvbGlkIHRyYW5zcGFyZW50O1xuICBib3JkZXItdG9wOiA2cHggc29saWQgIzQ0NDtcbn1cblxuLlByb3NlTWlycm9yLXRvb2x0aXAtcG9pbnRlci1iZWxvdyB7XG4gIGJvcmRlci1sZWZ0OiA2cHggc29saWQgdHJhbnNwYXJlbnQ7XG4gIGJvcmRlci1yaWdodDogNnB4IHNvbGlkIHRyYW5zcGFyZW50O1xuICBib3JkZXItYm90dG9tOiA2cHggc29saWQgIzQ0NDtcbn1cblxuLlByb3NlTWlycm9yLXRvb2x0aXAtcG9pbnRlci1yaWdodCB7XG4gIGJvcmRlci10b3A6IDZweCBzb2xpZCB0cmFuc3BhcmVudDtcbiAgYm9yZGVyLWJvdHRvbTogNnB4IHNvbGlkIHRyYW5zcGFyZW50O1xuICBib3JkZXItcmlnaHQ6IDZweCBzb2xpZCAjNDQ0O1xufVxuXG4uUHJvc2VNaXJyb3ItdG9vbHRpcC1wb2ludGVyLWxlZnQge1xuICBib3JkZXItdG9wOiA2cHggc29saWQgdHJhbnNwYXJlbnQ7XG4gIGJvcmRlci1ib3R0b206IDZweCBzb2xpZCB0cmFuc3BhcmVudDtcbiAgYm9yZGVyLWxlZnQ6IDZweCBzb2xpZCAjNDQ0O1xufVxuXG4uUHJvc2VNaXJyb3ItdG9vbHRpcCBpbnB1dFt0eXBlPVwidGV4dFwiXSxcbi5Qcm9zZU1pcnJvci10b29sdGlwIHRleHRhcmVhIHtcbiAgYmFja2dyb3VuZDogIzY2NjtcbiAgY29sb3I6IHdoaXRlO1xuICBib3JkZXI6IG5vbmU7XG4gIG91dGxpbmU6IG5vbmU7XG59XG5cbi5Qcm9zZU1pcnJvci10b29sdGlwIGlucHV0W3R5cGU9XCJ0ZXh0XCJdIHtcbiAgcGFkZGluZzogMCA0cHg7XG59XG5cbmApXG4iLCJpbXBvcnQge1Bvc30gZnJvbSBcIi4vcG9zXCJcbmltcG9ydCB7c2FtZVNldH0gZnJvbSBcIi4vc3R5bGVcIlxuXG5leHBvcnQgZnVuY3Rpb24gZmluZERpZmZTdGFydChhLCBiLCBwYXRoQSA9IFtdLCBwYXRoQiA9IFtdKSB7XG4gIGxldCBvZmZzZXQgPSAwXG4gIGZvciAobGV0IGkgPSAwOzsgaSsrKSB7XG4gICAgaWYgKGkgPT0gYS5jb250ZW50Lmxlbmd0aCB8fCBpID09IGIuY29udGVudC5sZW5ndGgpIHtcbiAgICAgIGlmIChhLmNvbnRlbnQubGVuZ3RoID09IGIuY29udGVudC5sZW5ndGgpIHJldHVybiBudWxsXG4gICAgICBicmVha1xuICAgIH1cbiAgICBsZXQgY2hpbGRBID0gYS5jb250ZW50W2ldLCBjaGlsZEIgPSBiLmNvbnRlbnRbaV1cbiAgICBpZiAoY2hpbGRBID09IGNoaWxkQikge1xuICAgICAgb2Zmc2V0ICs9IGEudHlwZS5ibG9jayA/IGNoaWxkQS50ZXh0Lmxlbmd0aCA6IDFcbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuXG4gICAgaWYgKCFjaGlsZEEuc2FtZU1hcmt1cChjaGlsZEIpKSBicmVha1xuXG4gICAgaWYgKGEudHlwZS5ibG9jaykge1xuICAgICAgaWYgKCFzYW1lU2V0KGNoaWxkQS5zdHlsZXMsIGNoaWxkQi5zdHlsZXMpKSBicmVha1xuICAgICAgaWYgKGNoaWxkQS50ZXh0ICE9IGNoaWxkQi50ZXh0KSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBjaGlsZEEudGV4dFtqXSA9PSBjaGlsZEIudGV4dFtqXTsgaisrKVxuICAgICAgICAgIG9mZnNldCsrXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBvZmZzZXQgKz0gY2hpbGRBLnRleHQubGVuZ3RoXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBpbm5lciA9IGZpbmREaWZmU3RhcnQoY2hpbGRBLCBjaGlsZEIsIHBhdGhBLmNvbmNhdChpKSwgcGF0aEIuY29uY2F0KGkpKVxuICAgICAgaWYgKGlubmVyKSByZXR1cm4gaW5uZXJcbiAgICAgIG9mZnNldCsrXG4gICAgfVxuICB9XG4gIHJldHVybiB7YTogbmV3IFBvcyhwYXRoQSwgb2Zmc2V0KSwgYjogbmV3IFBvcyhwYXRoQiwgb2Zmc2V0KX1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmREaWZmRW5kKGEsIGIsIHBhdGhBID0gW10sIHBhdGhCID0gW10pIHtcbiAgbGV0IGlBID0gYS5jb250ZW50Lmxlbmd0aCwgaUIgPSBiLmNvbnRlbnQubGVuZ3RoXG4gIGxldCBvZmZzZXQgPSAwXG5cbiAgZm9yICg7OyBpQS0tLCBpQi0tKSB7XG4gICAgaWYgKGlBID09IDAgfHwgaUIgPT0gMCkge1xuICAgICAgaWYgKGlBID09IGlCKSByZXR1cm4gbnVsbFxuICAgICAgYnJlYWtcbiAgICB9XG4gICAgbGV0IGNoaWxkQSA9IGEuY29udGVudFtpQSAtIDFdLCBjaGlsZEIgPSBiLmNvbnRlbnRbaUIgLSAxXVxuICAgIGlmIChjaGlsZEEgPT0gY2hpbGRCKSB7XG4gICAgICBvZmZzZXQgKz0gYS50eXBlLmJsb2NrID8gY2hpbGRBLnRleHQubGVuZ3RoIDogMVxuICAgICAgY29udGludWVcbiAgICB9XG5cbiAgICBpZiAoIWNoaWxkQS5zYW1lTWFya3VwKGNoaWxkQikpIGJyZWFrXG5cbiAgICBpZiAoYS50eXBlLmJsb2NrKSB7XG4gICAgICBpZiAoIXNhbWVTZXQoY2hpbGRBLnN0eWxlcywgY2hpbGRCLnN0eWxlcykpIGJyZWFrXG5cbiAgICAgIGlmIChjaGlsZEEudGV4dCAhPSBjaGlsZEIudGV4dCkge1xuICAgICAgICBsZXQgc2FtZSA9IDAsIG1pblNpemUgPSBNYXRoLm1pbihjaGlsZEEudGV4dC5sZW5ndGgsIGNoaWxkQi50ZXh0Lmxlbmd0aClcbiAgICAgICAgd2hpbGUgKHNhbWUgPCBtaW5TaXplICYmIGNoaWxkQS50ZXh0W2NoaWxkQS50ZXh0Lmxlbmd0aCAtIHNhbWUgLSAxXSA9PSBjaGlsZEIudGV4dFtjaGlsZEIudGV4dC5sZW5ndGggLSBzYW1lIC0gMV0pIHtcbiAgICAgICAgICBzYW1lKytcbiAgICAgICAgICBvZmZzZXQrK1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBvZmZzZXQgKz0gY2hpbGRBLnRleHQubGVuZ3RoXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBpbm5lciA9IGZpbmREaWZmRW5kKGNoaWxkQSwgY2hpbGRCLCBwYXRoQS5jb25jYXQoaUEgLSAxKSwgcGF0aEIuY29uY2F0KGlCIC0gMSkpXG4gICAgICBpZiAoaW5uZXIpIHJldHVybiBpbm5lclxuICAgICAgb2Zmc2V0KytcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHthOiBuZXcgUG9zKHBhdGhBLCBhLm1heE9mZnNldCAtIG9mZnNldCksXG4gICAgICAgICAgYjogbmV3IFBvcyhwYXRoQiwgYi5tYXhPZmZzZXQgLSBvZmZzZXQpfVxufVxuIiwiZXhwb3J0IHtOb2RlLCBTcGFuLCBub2RlVHlwZXMsIE5vZGVUeXBlLCBmaW5kQ29ubmVjdGlvbn0gZnJvbSBcIi4vbm9kZVwiXG5leHBvcnQge1Bvc30gZnJvbSBcIi4vcG9zXCJcblxuaW1wb3J0ICogYXMgc3R5bGUgZnJvbSBcIi4vc3R5bGVcIlxuZXhwb3J0IHtzdHlsZX1cblxuZXhwb3J0IHtzbGljZUJlZm9yZSwgc2xpY2VBZnRlciwgc2xpY2VCZXR3ZWVufSBmcm9tIFwiLi9zbGljZVwiXG5leHBvcnQge3N0aXRjaFRleHROb2RlcywgY2xlYXJNYXJrdXAsIHNwYW5BdE9yQmVmb3JlLCBnZXRTcGFuLCBzcGFuU3R5bGVzQXQsIHJhbmdlSGFzU3R5bGUsXG4gICAgICAgIHNwbGl0U3BhbnNBdH0gZnJvbSBcIi4vaW5saW5lXCJcblxuZXhwb3J0IHtmaW5kRGlmZlN0YXJ0LCBmaW5kRGlmZkVuZH0gZnJvbSBcIi4vZGlmZlwiXG4iLCIvLyBQcmltaXRpdmUgb3BlcmF0aW9ucyBvbiBpbmxpbmUgY29udGVudFxuXG5pbXBvcnQge05vZGUsIFNwYW4sIG5vZGVUeXBlc30gZnJvbSBcIi4vbm9kZVwiXG5pbXBvcnQgKiBhcyBzdHlsZSBmcm9tIFwiLi9zdHlsZVwiXG5cbmV4cG9ydCBmdW5jdGlvbiBzdGl0Y2hUZXh0Tm9kZXMobm9kZSwgYXQpIHtcbiAgbGV0IGJlZm9yZSwgYWZ0ZXJcbiAgaWYgKGF0ICYmIG5vZGUuY29udGVudC5sZW5ndGggPiBhdCAmJlxuICAgICAgKGJlZm9yZSA9IG5vZGUuY29udGVudFthdCAtIDFdKS50eXBlID09IG5vZGVUeXBlcy50ZXh0ICYmXG4gICAgICAoYWZ0ZXIgPSBub2RlLmNvbnRlbnRbYXRdKS50eXBlID09IG5vZGVUeXBlcy50ZXh0ICYmXG4gICAgICBzdHlsZS5zYW1lU2V0KGJlZm9yZS5zdHlsZXMsIGFmdGVyLnN0eWxlcykpIHtcbiAgICBsZXQgam9pbmVkID0gU3Bhbi50ZXh0KGJlZm9yZS50ZXh0ICsgYWZ0ZXIudGV4dCwgYmVmb3JlLnN0eWxlcylcbiAgICBub2RlLmNvbnRlbnQuc3BsaWNlKGF0IC0gMSwgMiwgam9pbmVkKVxuICAgIHJldHVybiB0cnVlXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyTWFya3VwKG5vZGUpIHtcbiAgaWYgKG5vZGUuY29udGVudC5sZW5ndGggPiAxIHx8IG5vZGUuY29udGVudFswXS50eXBlICE9IG5vZGVUeXBlcy50ZXh0IHx8IG5vZGUuY29udGVudFswXS5zdHlsZXMubGVuZ3RoKSB7XG4gICAgbGV0IHRleHQgPSBcIlwiXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLmNvbnRlbnQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBjaGlsZCA9IG5vZGUuY29udGVudFtpXVxuICAgICAgaWYgKGNoaWxkLnR5cGUgPT0gbm9kZVR5cGVzLnRleHQpIHRleHQgKz0gY2hpbGQudGV4dFxuICAgIH1cbiAgICBub2RlLmNvbnRlbnQgPSBbU3Bhbi50ZXh0KHRleHQpXVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTcGFuKGRvYywgcG9zKSB7XG4gIHJldHVybiBzcGFuQXRPckJlZm9yZShkb2MucGF0aChwb3MucGF0aCksIHBvcy5vZmZzZXQpLm5vZGVcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNwYW5BdE9yQmVmb3JlKHBhcmVudCwgb2Zmc2V0KSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcGFyZW50LmNvbnRlbnQubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgY2hpbGQgPSBwYXJlbnQuY29udGVudFtpXVxuICAgIG9mZnNldCAtPSBjaGlsZC5zaXplXG4gICAgaWYgKG9mZnNldCA8PSAwKVxuICAgICAgcmV0dXJuIHtub2RlOiBjaGlsZCwgb2Zmc2V0OiBpLCBpbm5lck9mZnNldDogb2Zmc2V0ICsgY2hpbGQuc2l6ZX1cbiAgfVxuICByZXR1cm4ge25vZGU6IG51bGwsIG9mZnNldDogMCwgaW5uZXJPZmZzZXQ6IDB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzcGFuU3R5bGVzQXQoZG9jLCBwb3MpIHtcbiAgbGV0IHtub2RlfSA9IHNwYW5BdE9yQmVmb3JlKGRvYy5wYXRoKHBvcy5wYXRoKSwgcG9zLm9mZnNldClcbiAgcmV0dXJuIG5vZGUgPyBub2RlLnN0eWxlcyA6IE5vZGUuZW1wdHlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJhbmdlSGFzU3R5bGUoZG9jLCBmcm9tLCB0bywgdHlwZSkge1xuICBmdW5jdGlvbiBzY2FuKG5vZGUsIGZyb20sIHRvLCB0eXBlLCBkZXB0aCkge1xuICAgIGlmIChub2RlLnR5cGUuYmxvY2spIHtcbiAgICAgIGxldCBzdGFydCA9IGZyb20gPyBmcm9tLm9mZnNldCA6IDBcbiAgICAgIGxldCBlbmQgPSB0byA/IHRvLm9mZnNldCA6IDFlNVxuICAgICAgZm9yIChsZXQgaSA9IDAsIG9mZnNldCA9IDA7IGkgPCBub2RlLmNvbnRlbnQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGNoaWxkID0gbm9kZS5jb250ZW50W2ldLCBzaXplID0gY2hpbGQudGV4dC5sZW5ndGhcbiAgICAgICAgaWYgKG9mZnNldCA8IGVuZCAmJiBvZmZzZXQgKyBzaXplID4gc3RhcnQgJiYgc3R5bGUuY29udGFpbnNUeXBlKGNoaWxkLnN0eWxlcywgdHlwZSkpXG4gICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgb2Zmc2V0ICs9IHNpemVcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG5vZGUuY29udGVudC5sZW5ndGgpIHtcbiAgICAgIGxldCBzdGFydCA9IGZyb20gPyBmcm9tLnBhdGhbZGVwdGhdIDogMFxuICAgICAgbGV0IGVuZCA9IHRvID8gdG8ucGF0aFtkZXB0aF0gOiBub2RlLmNvbnRlbnQubGVuZ3RoIC0gMVxuICAgICAgaWYgKHN0YXJ0ID09IGVuZCkge1xuICAgICAgICByZXR1cm4gc2Nhbihub2RlLmNvbnRlbnRbc3RhcnRdLCBmcm9tLCB0bywgdHlwZSwgZGVwdGggKyAxKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGZvdW5kID0gc2Nhbihub2RlLmNvbnRlbnRbc3RhcnRdLCBmcm9tLCBudWxsLCB0eXBlLCBkZXB0aCArIDEpXG4gICAgICAgIGZvciAobGV0IGkgPSBzdGFydCArIDE7IGkgPCBlbmQgJiYgIWZvdW5kOyBpKyspXG4gICAgICAgICAgZm91bmQgPSBzY2FuKG5vZGUuY29udGVudFtpXSwgbnVsbCwgbnVsbCwgdHlwZSwgZGVwdGggKyAxKVxuICAgICAgICByZXR1cm4gZm91bmQgfHwgc2Nhbihub2RlLmNvbnRlbnRbZW5kXSwgbnVsbCwgdG8sIHR5cGUsIGRlcHRoICsgMSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHNjYW4oZG9jLCBmcm9tLCB0bywgdHlwZSwgMClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNwbGl0U3BhbnNBdChwYXJlbnQsIG9mZnNldF8pIHtcbiAgbGV0IHtub2RlLCBvZmZzZXQsIGlubmVyT2Zmc2V0fSA9IHNwYW5BdE9yQmVmb3JlKHBhcmVudCwgb2Zmc2V0XylcbiAgaWYgKGlubmVyT2Zmc2V0ICYmIGlubmVyT2Zmc2V0ICE9IG5vZGUuc2l6ZSkge1xuICAgIHBhcmVudC5jb250ZW50LnNwbGljZShvZmZzZXQsIDEsIG5vZGUuc2xpY2UoMCwgaW5uZXJPZmZzZXQpLCBub2RlLnNsaWNlKGlubmVyT2Zmc2V0KSlcbiAgICBvZmZzZXQgKz0gMVxuICB9IGVsc2UgaWYgKGlubmVyT2Zmc2V0KSB7XG4gICAgb2Zmc2V0ICs9IDFcbiAgfVxuICByZXR1cm4ge29mZnNldDogb2Zmc2V0LCBzdHlsZXM6IG5vZGUgPyBub2RlLnN0eWxlcyA6IE5vZGUuZW1wdHl9XG59XG4iLCJleHBvcnQgY2xhc3MgTm9kZSB7XG4gIGNvbnN0cnVjdG9yKHR5cGUsIGF0dHJzID0gbnVsbCwgY29udGVudCkge1xuICAgIGlmICh0eXBlb2YgdHlwZSA9PSBcInN0cmluZ1wiKSB7XG4gICAgICBsZXQgZm91bmQgPSBub2RlVHlwZXNbdHlwZV1cbiAgICAgIGlmICghZm91bmQpIHRocm93IG5ldyBFcnJvcihcIlVua25vd24gbm9kZSB0eXBlOiBcIiArIHR5cGUpXG4gICAgICB0eXBlID0gZm91bmRcbiAgICB9XG4gICAgaWYgKCEodHlwZSBpbnN0YW5jZW9mIE5vZGVUeXBlKSkgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBub2RlIHR5cGU6IFwiICsgdHlwZSlcbiAgICB0aGlzLnR5cGUgPSB0eXBlXG4gICAgdGhpcy5jb250ZW50ID0gY29udGVudCB8fCAodHlwZS5jb250YWlucyA/IFtdIDogTm9kZS5lbXB0eSlcbiAgICBpZiAoIWF0dHJzICYmICEoYXR0cnMgPSB0eXBlLmRlZmF1bHRBdHRycykpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBkZWZhdWx0IGF0dHJpYnV0ZXMgZm9yIG5vZGUgdHlwZSBcIiArIHR5cGUubmFtZSlcbiAgICB0aGlzLmF0dHJzID0gYXR0cnMgfHwgdHlwZS5kZWZhdWx0QXR0cnNcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIGlmICh0aGlzLnR5cGUuY29udGFpbnMpXG4gICAgICByZXR1cm4gdGhpcy50eXBlLm5hbWUgKyBcIihcIiArIHRoaXMuY29udGVudC5qb2luKFwiLCBcIikgKyBcIilcIlxuICAgIGVsc2VcbiAgICAgIHJldHVybiB0aGlzLnR5cGUubmFtZVxuICB9XG5cbiAgY29weShjb250ZW50ID0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgTm9kZSh0aGlzLnR5cGUsIHRoaXMuYXR0cnMsIGNvbnRlbnQpXG4gIH1cblxuICBwdXNoKGNoaWxkKSB7XG4gICAgaWYgKHRoaXMudHlwZS5jb250YWlucyAhPSBjaGlsZC50eXBlLnR5cGUpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBpbnNlcnQgXCIgKyBjaGlsZC50eXBlLm5hbWUgKyBcIiBpbnRvIFwiICsgdGhpcy50eXBlLm5hbWUpXG4gICAgdGhpcy5jb250ZW50LnB1c2goY2hpbGQpXG4gIH1cblxuICBwdXNoRnJvbShvdGhlciwgc3RhcnQgPSAwLCBlbmQgPSBvdGhlci5jb250ZW50Lmxlbmd0aCkge1xuICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKVxuICAgICAgdGhpcy5wdXNoKG90aGVyLmNvbnRlbnRbaV0pXG4gIH1cblxuICBwdXNoTm9kZXMoYXJyYXkpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB0aGlzLnB1c2goYXJyYXlbaV0pXG4gIH1cblxuICBzbGljZShmcm9tLCB0byA9IHRoaXMubWF4T2Zmc2V0KSB7XG4gICAgaWYgKGZyb20gPT0gdG8pIHJldHVybiBbXVxuICAgIGlmICghdGhpcy50eXBlLmJsb2NrKSByZXR1cm4gdGhpcy5jb250ZW50LnNsaWNlKGZyb20sIHRvKVxuICAgIGxldCByZXN1bHQgPSBbXVxuICAgIGZvciAobGV0IGkgPSAwLCBvZmZzZXQgPSAwOzsgaSsrKSB7XG4gICAgICBsZXQgY2hpbGQgPSB0aGlzLmNvbnRlbnRbaV0sIHNpemUgPSBjaGlsZC5zaXplLCBlbmQgPSBvZmZzZXQgKyBzaXplXG4gICAgICBpZiAob2Zmc2V0ICsgc2l6ZSA+IGZyb20pXG4gICAgICAgIHJlc3VsdC5wdXNoKG9mZnNldCA+PSBmcm9tICYmIGVuZCA8PSB0byA/IGNoaWxkIDogY2hpbGQuc2xpY2UoTWF0aC5tYXgoMCwgZnJvbSAtIG9mZnNldCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5taW4oc2l6ZSwgdG8gLSBvZmZzZXQpKSlcbiAgICAgIGlmIChlbmQgPj0gdG8pIHJldHVybiByZXN1bHRcbiAgICAgIG9mZnNldCA9IGVuZFxuICAgIH1cbiAgfVxuXG4gIHJlbW92ZShjaGlsZCkge1xuICAgIGxldCBmb3VuZCA9IHRoaXMuY29udGVudC5pbmRleE9mKGNoaWxkKVxuICAgIGlmIChmb3VuZCA9PSAtMSkgdGhyb3cgbmV3IEVycm9yKFwiQ2hpbGQgbm90IGZvdW5kXCIpXG4gICAgdGhpcy5jb250ZW50LnNwbGljZShmb3VuZCwgMSlcbiAgfVxuXG4gIGdldCBzaXplKCkge1xuICAgIGxldCBzdW0gPSAwXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNvbnRlbnQubGVuZ3RoOyBpKyspXG4gICAgICBzdW0gKz0gdGhpcy5jb250ZW50W2ldLnNpemVcbiAgICByZXR1cm4gc3VtXG4gIH1cblxuICBnZXQgbWF4T2Zmc2V0KCkge1xuICAgIHJldHVybiB0aGlzLnR5cGUuYmxvY2sgPyB0aGlzLnNpemUgOiB0aGlzLmNvbnRlbnQubGVuZ3RoXG4gIH1cblxuICBnZXQgdGV4dENvbnRlbnQoKSB7XG4gICAgbGV0IHRleHQgPSBcIlwiXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNvbnRlbnQubGVuZ3RoOyBpKyspXG4gICAgICB0ZXh0ICs9IHRoaXMuY29udGVudFtpXS50ZXh0Q29udGVudFxuICAgIHJldHVybiB0ZXh0XG4gIH1cblxuICBwYXRoKHBhdGgpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbm9kZSA9IHRoaXM7IGkgPCBwYXRoLmxlbmd0aDsgbm9kZSA9IG5vZGUuY29udGVudFtwYXRoW2ldXSwgaSsrKSB7fVxuICAgIHJldHVybiBub2RlXG4gIH1cblxuICBpc1ZhbGlkUG9zKHBvcywgcmVxdWlyZUluQmxvY2spIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbm9kZSA9IHRoaXM7OyBpKyspIHtcbiAgICAgIGlmIChpID09IHBvcy5wYXRoLmxlbmd0aCkge1xuICAgICAgICBpZiAocmVxdWlyZUluQmxvY2sgJiYgIW5vZGUudHlwZS5ibG9jaykgcmV0dXJuIGZhbHNlXG4gICAgICAgIHJldHVybiBwb3Mub2Zmc2V0IDw9IG5vZGUubWF4T2Zmc2V0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgbiA9IHBvcy5wYXRoW2ldXG4gICAgICAgIGlmIChuID49IG5vZGUuY29udGVudC5sZW5ndGggfHwgbm9kZS50eXBlLmJsb2NrKSByZXR1cm4gZmFsc2VcbiAgICAgICAgbm9kZSA9IG5vZGUuY29udGVudFtuXVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHBhdGhOb2RlcyhwYXRoKSB7XG4gICAgbGV0IG5vZGVzID0gW11cbiAgICBmb3IgKHZhciBpID0gMCwgbm9kZSA9IHRoaXM7OyBpKyspIHtcbiAgICAgIG5vZGVzLnB1c2gobm9kZSlcbiAgICAgIGlmIChpID09IHBhdGgubGVuZ3RoKSBicmVha1xuICAgICAgbm9kZSA9IG5vZGUuY29udGVudFtwYXRoW2ldXVxuICAgIH1cbiAgICByZXR1cm4gbm9kZXNcbiAgfVxuXG4gIHN0YXRpYyBjb21wYXJlTWFya3VwKHR5cGVBLCB0eXBlQiwgYXR0cnNBLCBhdHRyc0IpIHtcbiAgICBpZiAodHlwZUEgIT0gdHlwZUIpIHJldHVybiBmYWxzZVxuICAgIGZvciAodmFyIHByb3AgaW4gYXR0cnNBKVxuICAgICAgaWYgKGF0dHJzQltwcm9wXSAhPT0gYXR0cnNBW3Byb3BdKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgc2FtZU1hcmt1cChvdGhlcikge1xuICAgIHJldHVybiBOb2RlLmNvbXBhcmVNYXJrdXAodGhpcy50eXBlLCBvdGhlci50eXBlLCB0aGlzLmF0dHJzLCBvdGhlci5hdHRycylcbiAgfVxuXG4gIHRvSlNPTigpIHtcbiAgICBsZXQgb2JqID0ge3R5cGU6IHRoaXMudHlwZS5uYW1lfVxuICAgIGlmICh0aGlzLmNvbnRlbnQubGVuZ3RoKSBvYmouY29udGVudCA9IHRoaXMuY29udGVudC5tYXAobiA9PiBuLnRvSlNPTigpKVxuICAgIGlmICh0aGlzLmF0dHJzICE9IG51bGxBdHRycykgb2JqLmF0dHJzID0gdGhpcy5hdHRyc1xuICAgIHJldHVybiBvYmpcbiAgfVxuXG4gIHN0YXRpYyBmcm9tSlNPTihqc29uKSB7XG4gICAgbGV0IHR5cGUgPSBub2RlVHlwZXNbanNvbi50eXBlXVxuICAgIGlmICh0eXBlLnR5cGUgPT0gXCJzcGFuXCIpXG4gICAgICByZXR1cm4gU3Bhbi5mcm9tSlNPTih0eXBlLCBqc29uKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBuZXcgTm9kZSh0eXBlLCBtYXliZU51bGwoanNvbi5hdHRycyksXG4gICAgICAgICAgICAgICAgICAgICAganNvbi5jb250ZW50ID8ganNvbi5jb250ZW50Lm1hcChuID0+IE5vZGUuZnJvbUpTT04obikpIDogTm9kZS5lbXB0eSlcbiAgfVxufVxuXG5Ob2RlLmVtcHR5ID0gW10gLy8gUmV1c2VkIGVtcHR5IGFycmF5IGZvciBjb2xsZWN0aW9ucyB0aGF0IGFyZSBndWFyYW50ZWVkIHRvIHJlbWFpbiBlbXB0eVxuXG5mdW5jdGlvbiBtYXliZU51bGwob2JqKSB7XG4gIGlmICghb2JqKSByZXR1cm4gbnVsbEF0dHJzXG4gIGZvciAobGV0IF9wcm9wIGluIG9iaikgcmV0dXJuIG9ialxuICByZXR1cm4gbnVsbEF0dHJzXG59XG5cbmV4cG9ydCBjbGFzcyBTcGFuIGV4dGVuZHMgTm9kZSB7XG4gIGNvbnN0cnVjdG9yKHR5cGUsIGF0dHJzLCBzdHlsZXMsIHRleHQpIHtcbiAgICBzdXBlcih0eXBlLCBhdHRycylcbiAgICB0aGlzLnRleHQgPSB0ZXh0ID09IG51bGwgPyBcIsOXXCIgOiB0ZXh0XG4gICAgdGhpcy5zdHlsZXMgPSBzdHlsZXMgfHwgTm9kZS5lbXB0eVxuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgaWYgKHRoaXMudHlwZSA9PSBub2RlVHlwZXMudGV4dCkge1xuICAgICAgbGV0IHRleHQgPSBKU09OLnN0cmluZ2lmeSh0aGlzLnRleHQpXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3R5bGVzLmxlbmd0aDsgaSsrKVxuICAgICAgICB0ZXh0ID0gdGhpcy5zdHlsZXNbaV0udHlwZSArIFwiKFwiICsgdGV4dCArIFwiKVwiXG4gICAgICByZXR1cm4gdGV4dFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc3VwZXIudG9TdHJpbmcoKVxuICAgIH1cbiAgfVxuXG4gIHNsaWNlKGZyb20sIHRvID0gdGhpcy50ZXh0Lmxlbmd0aCkge1xuICAgIHJldHVybiBuZXcgU3Bhbih0aGlzLnR5cGUsIHRoaXMuYXR0cnMsIHRoaXMuc3R5bGVzLCB0aGlzLnRleHQuc2xpY2UoZnJvbSwgdG8pKVxuICB9XG5cbiAgY29weSgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBjb3B5IHNwYW4gbm9kZXMgbGlrZSB0aGlzIVwiKVxuICB9XG5cbiAgZ2V0IHNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dC5sZW5ndGhcbiAgfVxuXG4gIGdldCB0ZXh0Q29udGVudCgpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0XG4gIH1cblxuICB0b0pTT04oKSB7XG4gICAgbGV0IG9iaiA9IHt0eXBlOiB0aGlzLnR5cGUubmFtZX1cbiAgICBpZiAodGhpcy5hdHRycyAhPSBudWxsQXR0cnMpIG9iai5hdHRycyA9IHRoaXMuYXR0cnNcbiAgICBpZiAodGhpcy50ZXh0ICE9IFwiw5dcIikgb2JqLnRleHQgPSB0aGlzLnRleHRcbiAgICBpZiAodGhpcy5zdHlsZXMubGVuZ3RoKSBvYmouc3R5bGVzID0gdGhpcy5zdHlsZXNcbiAgICByZXR1cm4gb2JqXG4gIH1cblxuICBzdGF0aWMgZnJvbUpTT04odHlwZSwganNvbikge1xuICAgIHJldHVybiBuZXcgU3Bhbih0eXBlLCBtYXliZU51bGwoanNvbi5hdHRycyksIGpzb24uc3R5bGVzIHx8IE5vZGUuZW1wdHksIGpzb24udGV4dCB8fCBcIsOXXCIpXG4gIH1cblxuICBzdGF0aWMgdGV4dCh0ZXh0LCBzdHlsZXMpIHtcbiAgICByZXR1cm4gbmV3IFNwYW4obm9kZVR5cGVzLnRleHQsIG51bGwsIHN0eWxlcywgdGV4dClcbiAgfVxufVxuXG5jb25zdCBudWxsQXR0cnMgPSBOb2RlLm51bGxBdHRycyA9IHt9XG5cbmV4cG9ydCBjbGFzcyBOb2RlVHlwZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB0aGlzLm5hbWUgPSBvcHRpb25zLm5hbWVcbiAgICB0aGlzLnR5cGUgPSBvcHRpb25zLnR5cGVcbiAgICB0aGlzLmNvbnRhaW5zID0gb3B0aW9ucy5jb250YWluc1xuICAgIHRoaXMuYmxvY2sgPSB0aGlzLmNvbnRhaW5zID09IFwic3BhblwiXG4gICAgdGhpcy5kZWZhdWx0QXR0cnMgPSBvcHRpb25zLmRlZmF1bHRBdHRyc1xuICAgIGlmICh0aGlzLmRlZmF1bHRBdHRycyA9PSBudWxsKSB0aGlzLmRlZmF1bHRBdHRycyA9IG51bGxBdHRyc1xuICAgIHRoaXMucGxhaW5UZXh0ID0gISFvcHRpb25zLnBsYWluVGV4dFxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBub2RlVHlwZXMgPSB7XG4gIGRvYzogbmV3IE5vZGVUeXBlKHt0eXBlOiBcImRvY1wiLCBjb250YWluczogXCJlbGVtZW50XCJ9KSxcbiAgcGFyYWdyYXBoOiBuZXcgTm9kZVR5cGUoe3R5cGU6IFwiZWxlbWVudFwiLCBjb250YWluczogXCJzcGFuXCJ9KSxcbiAgYmxvY2txdW90ZTogbmV3IE5vZGVUeXBlKHt0eXBlOiBcImVsZW1lbnRcIiwgY29udGFpbnM6IFwiZWxlbWVudFwifSksXG4gIGhlYWRpbmc6IG5ldyBOb2RlVHlwZSh7dHlwZTogXCJlbGVtZW50XCIsIGNvbnRhaW5zOiBcInNwYW5cIiwgZGVmYXVsdEF0dHJzOiBmYWxzZX0pLFxuICBidWxsZXRfbGlzdDogbmV3IE5vZGVUeXBlKHt0eXBlOiBcImVsZW1lbnRcIiwgY29udGFpbnM6IFwibGlzdF9pdGVtXCIsIGRlZmF1bHRBdHRyczoge2J1bGxldDogXCIqXCIsIHRpZ2h0OiB0cnVlfX0pLFxuICBvcmRlcmVkX2xpc3Q6IG5ldyBOb2RlVHlwZSh7dHlwZTogXCJlbGVtZW50XCIsIGNvbnRhaW5zOiBcImxpc3RfaXRlbVwiLCBkZWZhdWx0QXR0cnM6IHtvcmRlcjogMSwgdGlnaHQ6IHRydWV9fSksXG4gIGxpc3RfaXRlbTogbmV3IE5vZGVUeXBlKHt0eXBlOiBcImxpc3RfaXRlbVwiLCBjb250YWluczogXCJlbGVtZW50XCJ9KSxcbiAgaHRtbF9ibG9jazogbmV3IE5vZGVUeXBlKHt0eXBlOiBcImVsZW1lbnRcIiwgZGVmYXVsdEF0dHJzOiBmYWxzZX0pLFxuICBjb2RlX2Jsb2NrOiBuZXcgTm9kZVR5cGUoe3R5cGU6IFwiZWxlbWVudFwiLCBjb250YWluczogXCJzcGFuXCIsIGRlZmF1bHRBdHRyczoge3BhcmFtczogbnVsbH0sIHBsYWluVGV4dDogdHJ1ZX0pLFxuICBob3Jpem9udGFsX3J1bGU6IG5ldyBOb2RlVHlwZSh7dHlwZTogXCJlbGVtZW50XCJ9KSxcbiAgdGV4dDogbmV3IE5vZGVUeXBlKHt0eXBlOiBcInNwYW5cIn0pLFxuICBpbWFnZTogbmV3IE5vZGVUeXBlKHt0eXBlOiBcInNwYW5cIiwgZGVmYXVsdEF0dHJzOiBmYWxzZX0pLFxuICBoYXJkX2JyZWFrOiBuZXcgTm9kZVR5cGUoe3R5cGU6IFwic3BhblwifSksXG4gIGh0bWxfdGFnOiBuZXcgTm9kZVR5cGUoe3R5cGU6IFwic3BhblwiLCBkZWZhdWx0QXR0cnM6IGZhbHNlfSlcbn1cblxuZm9yIChsZXQgbmFtZSBpbiBub2RlVHlwZXMpIG5vZGVUeXBlc1tuYW1lXS5uYW1lID0gbmFtZVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZENvbm5lY3Rpb24oZnJvbSwgdG8pIHtcbiAgaWYgKGZyb20uY29udGFpbnMgPT0gdG8udHlwZSkgcmV0dXJuIFtdXG5cbiAgbGV0IHNlZW4gPSBPYmplY3QuY3JlYXRlKG51bGwpXG4gIGxldCBhY3RpdmUgPSBbe2Zyb206IGZyb20sIHZpYTogW119XVxuICB3aGlsZSAoYWN0aXZlLmxlbmd0aCkge1xuICAgIGxldCBjdXJyZW50ID0gYWN0aXZlLnNoaWZ0KClcbiAgICBmb3IgKGxldCBuYW1lIGluIG5vZGVUeXBlcykge1xuICAgICAgbGV0IHR5cGUgPSBub2RlVHlwZXNbbmFtZV1cbiAgICAgIGlmIChjdXJyZW50LmZyb20uY29udGFpbnMgPT0gdHlwZS50eXBlICYmICEodHlwZS5jb250YWlucyBpbiBzZWVuKSkge1xuICAgICAgICBsZXQgdmlhID0gY3VycmVudC52aWEuY29uY2F0KHR5cGUpXG4gICAgICAgIGlmICh0eXBlLmNvbnRhaW5zID09IHRvLnR5cGUpIHJldHVybiB2aWFcbiAgICAgICAgYWN0aXZlLnB1c2goe2Zyb206IHR5cGUsIHZpYTogdmlhfSlcbiAgICAgICAgc2Vlblt0eXBlLmNvbnRhaW5zXSA9IHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBQb3Mge1xuICBjb25zdHJ1Y3RvcihwYXRoLCBvZmZzZXQpIHtcbiAgICB0aGlzLnBhdGggPSBwYXRoXG4gICAgdGhpcy5vZmZzZXQgPSBvZmZzZXRcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLnBhdGguam9pbihcIi9cIikgKyBcIjpcIiArIHRoaXMub2Zmc2V0XG4gIH1cblxuICBnZXQgZGVwdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMucGF0aC5sZW5ndGhcbiAgfVxuXG4gIHN0YXRpYyBjbXAocGF0aEEsIG9mZnNldEEsIHBhdGhCLCBvZmZzZXRCKSB7XG4gICAgbGV0IGxlbkEgPSBwYXRoQS5sZW5ndGgsIGxlbkIgPSBwYXRoQi5sZW5ndGhcbiAgICBmb3IgKHZhciBpID0gMCwgZW5kID0gTWF0aC5taW4obGVuQSwgbGVuQik7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgdmFyIGRpZmYgPSBwYXRoQVtpXSAtIHBhdGhCW2ldXG4gICAgICBpZiAoZGlmZiAhPSAwKSByZXR1cm4gZGlmZlxuICAgIH1cbiAgICBpZiAobGVuQSA+IGxlbkIpXG4gICAgICByZXR1cm4gb2Zmc2V0QiA8PSBwYXRoQVtpXSA/IDEgOiAtMVxuICAgIGVsc2UgaWYgKGxlbkIgPiBsZW5BKVxuICAgICAgcmV0dXJuIG9mZnNldEEgPD0gcGF0aEJbaV0gPyAtMSA6IDFcbiAgICBlbHNlXG4gICAgICByZXR1cm4gb2Zmc2V0QSAtIG9mZnNldEJcbiAgfVxuXG4gIHN0YXRpYyBzYW1lUGF0aChwYXRoQSwgcGF0aEIpIHtcbiAgICBpZiAocGF0aEEubGVuZ3RoICE9IHBhdGhCLmxlbmd0aCkgcmV0dXJuIGZhbHNlXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXRoQS5sZW5ndGg7IGkrKykgaWYgKHBhdGhBW2ldICE9PSBwYXRoQltpXSkgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGNtcChvdGhlcikgeyByZXR1cm4gUG9zLmNtcCh0aGlzLnBhdGgsIHRoaXMub2Zmc2V0LCBvdGhlci5wYXRoLCBvdGhlci5vZmZzZXQpIH1cblxuICBzdGF0aWMgc2hvcnRlbihwYXRoLCB0byA9IG51bGwsIG9mZnNldCA9IDApIHtcbiAgICBpZiAodG8gPT0gbnVsbCkgdG8gPSBwYXRoLmxlbmd0aCAtIDFcbiAgICByZXR1cm4gbmV3IFBvcyhwYXRoLnNsaWNlKDAsIHRvKSwgcGF0aFt0b10gKyBvZmZzZXQpXG4gIH1cblxuICBzaG9ydGVuKHRvID0gbnVsbCwgb2Zmc2V0ID0gMCkge1xuICAgIGlmICh0byA9PSB0aGlzLmRlcHRoKSByZXR1cm4gdGhpc1xuICAgIHJldHVybiBQb3Muc2hvcnRlbih0aGlzLnBhdGgsIHRvLCBvZmZzZXQpXG4gIH1cblxuICBzaGlmdChieSkge1xuICAgIHJldHVybiBuZXcgUG9zKHRoaXMucGF0aCwgdGhpcy5vZmZzZXQgKyBieSlcbiAgfVxuXG4gIG9mZnNldEF0KHBvcywgb2Zmc2V0KSB7XG4gICAgbGV0IHBhdGggPSB0aGlzLnBhdGguc2xpY2UoKVxuICAgIHBhdGhbcG9zXSArPSBvZmZzZXRcbiAgICByZXR1cm4gbmV3IFBvcyhwYXRoLCB0aGlzLm9mZnNldClcbiAgfVxuXG4gIGV4dGVuZChwb3MpIHtcbiAgICBsZXQgcGF0aCA9IHRoaXMucGF0aC5zbGljZSgpLCBhZGQgPSB0aGlzLm9mZnNldFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9zLnBhdGgubGVuZ3RoOyBpKyspIHtcbiAgICAgIHBhdGgucHVzaChwb3MucGF0aFtpXSArIGFkZClcbiAgICAgIGFkZCA9IDBcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQb3MocGF0aCwgcG9zLm9mZnNldCArIGFkZClcbiAgfVxuXG4gIHN0YXRpYyBmcm9tSlNPTihqc29uKSB7IHJldHVybiBuZXcgUG9zKGpzb24ucGF0aCwganNvbi5vZmZzZXQpIH1cbn1cblxuZnVuY3Rpb24gZmluZExlZnQobm9kZSwgcGF0aCkge1xuICBpZiAobm9kZS50eXBlLmJsb2NrKVxuICAgIHJldHVybiBuZXcgUG9zKHBhdGgsIDApXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5jb250ZW50Lmxlbmd0aDsgaSsrKSB7XG4gICAgcGF0aC5wdXNoKGkpXG4gICAgbGV0IGZvdW5kID0gZmluZExlZnQobm9kZS5jb250ZW50W2ldLCBwYXRoKVxuICAgIGlmIChmb3VuZCkgcmV0dXJuIGZvdW5kXG4gICAgcGF0aC5wb3AoKVxuICB9XG59XG5cbmZ1bmN0aW9uIGZpbmRBZnRlcihub2RlLCBwb3MsIHBhdGgpIHtcbiAgaWYgKG5vZGUudHlwZS5ibG9jaylcbiAgICByZXR1cm4gcG9zXG4gIGxldCBhdEVuZCA9IHBhdGgubGVuZ3RoID09IHBvcy5wYXRoLmxlbmd0aFxuICBsZXQgc3RhcnQgPSBhdEVuZCA/IHBvcy5vZmZzZXQgOiBwb3MucGF0aFtwYXRoLmxlbmd0aF1cbiAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgbm9kZS5jb250ZW50Lmxlbmd0aDsgaSsrKSB7XG4gICAgcGF0aC5wdXNoKGkpXG4gICAgbGV0IGNoaWxkID0gbm9kZS5jb250ZW50W2ldXG4gICAgbGV0IGZvdW5kID0gaSA9PSBzdGFydCAmJiAhYXRFbmQgPyBmaW5kQWZ0ZXIoY2hpbGQsIHBvcywgcGF0aCkgOiBmaW5kTGVmdChjaGlsZCwgcGF0aClcbiAgICBpZiAoZm91bmQpIHJldHVybiBmb3VuZFxuICAgIHBhdGgucG9wKClcbiAgfVxufVxuXG5Qb3MuYWZ0ZXIgPSBmdW5jdGlvbihub2RlLCBwb3MpIHsgcmV0dXJuIGZpbmRBZnRlcihub2RlLCBwb3MsIFtdKSB9XG5Qb3Muc3RhcnQgPSBmdW5jdGlvbihub2RlKSB7IHJldHVybiBmaW5kTGVmdChub2RlLCBbXSkgfVxuXG5mdW5jdGlvbiBmaW5kUmlnaHQobm9kZSwgcGF0aCkge1xuICBpZiAobm9kZS50eXBlLmJsb2NrKVxuICAgIHJldHVybiBuZXcgUG9zKHBhdGgsIG5vZGUuc2l6ZSlcbiAgZm9yIChsZXQgaSA9IG5vZGUuY29udGVudC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIHBhdGgucHVzaChpKVxuICAgIGxldCBmb3VuZCA9IGZpbmRSaWdodChub2RlLmNvbnRlbnRbaV0sIHBhdGgpXG4gICAgaWYgKGZvdW5kKSByZXR1cm4gZm91bmRcbiAgICBwYXRoLnBvcCgpXG4gIH1cbn1cblxuZnVuY3Rpb24gZmluZEJlZm9yZShub2RlLCBwb3MsIHBhdGgpIHtcbiAgaWYgKG5vZGUudHlwZS5ibG9jaykgcmV0dXJuIHBvc1xuICBsZXQgYXRFbmQgPSBwb3MucGF0aC5sZW5ndGggPT0gcGF0aC5sZW5ndGhcbiAgbGV0IGVuZCA9IGF0RW5kID8gcG9zLm9mZnNldCAtIDEgOiBwb3MucGF0aFtwYXRoLmxlbmd0aF1cbiAgZm9yIChsZXQgaSA9IGVuZDsgaSA+PSAwOyBpLS0pIHtcbiAgICBwYXRoLnB1c2goaSlcbiAgICBsZXQgY2hpbGQgPSBub2RlLmNvbnRlbnRbaV1cbiAgICBsZXQgZm91bmQgPSBpID09IGVuZCAmJiAhYXRFbmQgPyBmaW5kQmVmb3JlKGNoaWxkLCBwb3MsIHBhdGgpIDogZmluZFJpZ2h0KGNoaWxkLCBwYXRoKVxuICAgIGlmIChmb3VuZCkgcmV0dXJuIGZvdW5kXG4gICAgcGF0aC5wb3AoKVxuICB9XG59XG5cblBvcy5iZWZvcmUgPSBmdW5jdGlvbihub2RlLCBwb3MpIHsgcmV0dXJuIGZpbmRCZWZvcmUobm9kZSwgcG9zLCBbXSkgfVxuUG9zLmVuZCA9IGZ1bmN0aW9uKG5vZGUpIHsgcmV0dXJuIGZpbmRSaWdodChub2RlLCBbXSkgfVxuXG5Qb3MubmVhciA9IGZ1bmN0aW9uKG5vZGUsIHBvcykgeyByZXR1cm4gUG9zLmFmdGVyKG5vZGUsIHBvcykgfHwgUG9zLmJlZm9yZShub2RlLCBwb3MpIH1cbiIsImltcG9ydCB7Tm9kZSwgZmluZENvbm5lY3Rpb259IGZyb20gXCIuL25vZGVcIlxuXG5mdW5jdGlvbiBjb3B5SW5saW5lVG8obm9kZSwgb2Zmc2V0LCBjb3B5KSB7XG4gIGZvciAobGV0IGxlZnQgPSBvZmZzZXQsIGkgPSAwOyBsZWZ0ID4gMDsgaSsrKSB7XG4gICAgbGV0IGNodW5rID0gbm9kZS5jb250ZW50W2ldXG4gICAgaWYgKGNodW5rLnRleHQubGVuZ3RoIDw9IGxlZnQpIHtcbiAgICAgIGxlZnQgLT0gY2h1bmsudGV4dC5sZW5ndGhcbiAgICAgIGNvcHkucHVzaChjaHVuaylcbiAgICB9IGVsc2Uge1xuICAgICAgY29weS5wdXNoKGNodW5rLnNsaWNlKDAsIGxlZnQpKVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gY29weUlubGluZUZyb20obm9kZSwgb2Zmc2V0LCBjb3B5KSB7XG4gIGZvciAobGV0IGJlZm9yZSA9IG9mZnNldCwgaSA9IDA7IGkgPCBub2RlLmNvbnRlbnQubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgY2h1bmsgPSBub2RlLmNvbnRlbnRbaV1cbiAgICBpZiAoYmVmb3JlID09IDApIHtcbiAgICAgIGNvcHkucHVzaChjaHVuaylcbiAgICB9IGVsc2UgaWYgKGNodW5rLnRleHQubGVuZ3RoIDw9IGJlZm9yZSkge1xuICAgICAgYmVmb3JlIC09IGNodW5rLnRleHQubGVuZ3RoXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvcHkucHVzaChjaHVuay5zbGljZShiZWZvcmUpKVxuICAgICAgYmVmb3JlID0gMFxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjb3B5SW5saW5lQmV0d2Vlbihub2RlLCBmcm9tLCB0bywgY29weSkge1xuICBpZiAoZnJvbSA9PSB0bykgcmV0dXJuXG5cbiAgZm9yIChsZXQgcG9zID0gMCwgaSA9IDA7IHBvcyA8IHRvOyBpKyspIHtcbiAgICB2YXIgY2h1bmsgPSBub2RlLmNvbnRlbnRbaV0sIHNpemUgPSBjaHVuay50ZXh0Lmxlbmd0aFxuICAgIGlmIChwb3MgPCBmcm9tKSB7XG4gICAgICBpZiAocG9zICsgc2l6ZSA+IGZyb20pXG4gICAgICAgIGNvcHkucHVzaChjaHVuay5zbGljZShmcm9tIC0gcG9zLCBNYXRoLm1pbih0byAtIHBvcywgc2l6ZSkpKVxuICAgIH0gZWxzZSBpZiAocG9zICsgc2l6ZSA8PSB0bykge1xuICAgICAgY29weS5wdXNoKGNodW5rKVxuICAgIH0gZWxzZSBpZiAocG9zIDwgdG8pIHtcbiAgICAgIGNvcHkucHVzaChjaHVuay5zbGljZSgwLCB0byAtIHBvcykpXG4gICAgfVxuICAgIHBvcyArPSBzaXplXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNsaWNlQmVmb3JlKG5vZGUsIHBvcywgZGVwdGggPSAwKSB7XG4gIGxldCBjb3B5ID0gbm9kZS5jb3B5KClcbiAgaWYgKGRlcHRoIDwgcG9zLmRlcHRoKSB7XG4gICAgbGV0IG4gPSBwb3MucGF0aFtkZXB0aF1cbiAgICBjb3B5LnB1c2hGcm9tKG5vZGUsIDAsIG4pXG4gICAgY29weS5wdXNoKHNsaWNlQmVmb3JlKG5vZGUuY29udGVudFtuXSwgcG9zLCBkZXB0aCArIDEpKVxuICB9IGVsc2UgaWYgKG5vZGUudHlwZS5jb250YWlucyAhPSBcInNwYW5cIikge1xuICAgIGNvcHkucHVzaEZyb20obm9kZSwgMCwgcG9zLm9mZnNldClcbiAgfSBlbHNlIHtcbiAgICBjb3B5SW5saW5lVG8obm9kZSwgcG9zLm9mZnNldCwgY29weSlcbiAgfVxuICByZXR1cm4gY29weVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2xpY2VBZnRlcihub2RlLCBwb3MsIGRlcHRoID0gMCkge1xuICBsZXQgY29weSA9IG5vZGUuY29weSgpXG4gIGlmIChkZXB0aCA8IHBvcy5kZXB0aCkge1xuICAgIGxldCBuID0gcG9zLnBhdGhbZGVwdGhdXG4gICAgY29weS5wdXNoKHNsaWNlQWZ0ZXIobm9kZS5jb250ZW50W25dLCBwb3MsIGRlcHRoICsgMSkpXG4gICAgY29weS5wdXNoRnJvbShub2RlLCBuICsgMSlcbiAgfSBlbHNlIGlmIChub2RlLnR5cGUuY29udGFpbnMgIT0gXCJzcGFuXCIpIHtcbiAgICBjb3B5LnB1c2hGcm9tKG5vZGUsIHBvcy5vZmZzZXQpXG4gIH0gZWxzZSB7XG4gICAgY29weUlubGluZUZyb20obm9kZSwgcG9zLm9mZnNldCwgY29weSlcbiAgfVxuICByZXR1cm4gY29weVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2xpY2VCZXR3ZWVuKG5vZGUsIGZyb20sIHRvLCBjb2xsYXBzZSA9IHRydWUsIGRlcHRoID0gMCkge1xuICBpZiAoZGVwdGggPCBmcm9tLmRlcHRoICYmIGRlcHRoIDwgdG8uZGVwdGggJiZcbiAgICAgIGZyb20ucGF0aFtkZXB0aF0gPT0gdG8ucGF0aFtkZXB0aF0pIHtcbiAgICB2YXIgaW5uZXIgPSBzbGljZUJldHdlZW4obm9kZS5jb250ZW50W2Zyb20ucGF0aFtkZXB0aF1dLCBmcm9tLCB0bywgY29sbGFwc2UsIGRlcHRoICsgMSlcbiAgICBpZiAoIWNvbGxhcHNlKSByZXR1cm4gbm9kZS5jb3B5KFtpbm5lcl0pXG4gICAgaWYgKG5vZGUudHlwZS5uYW1lICE9IFwiZG9jXCIpIHJldHVybiBpbm5lclxuICAgIHZhciBjb25uID0gZmluZENvbm5lY3Rpb24obm9kZS50eXBlLCBpbm5lci50eXBlKVxuICAgIGZvciAobGV0IGkgPSBjb25uLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpbm5lciA9IG5ldyBOb2RlKGNvbm5baV0sIG51bGwsIFtpbm5lcl0pXG4gICAgcmV0dXJuIG5vZGUuY29weShbaW5uZXJdKVxuICB9IGVsc2Uge1xuICAgIHZhciBjb3B5ID0gbm9kZS5jb3B5KClcbiAgICBpZiAoZGVwdGggPT0gZnJvbS5kZXB0aCAmJiBkZXB0aCA9PSB0by5kZXB0aCAmJiBub2RlLnR5cGUuYmxvY2spIHtcbiAgICAgIGNvcHlJbmxpbmVCZXR3ZWVuKG5vZGUsIGZyb20ub2Zmc2V0LCB0by5vZmZzZXQsIGNvcHkpXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBzdGFydFxuICAgICAgaWYgKGRlcHRoIDwgZnJvbS5kZXB0aCkge1xuICAgICAgICBzdGFydCA9IGZyb20ucGF0aFtkZXB0aF0gKyAxXG4gICAgICAgIGNvcHkucHVzaChzbGljZUFmdGVyKG5vZGUuY29udGVudFtzdGFydCAtIDFdLCBmcm9tLCBkZXB0aCArIDEpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhcnQgPSBmcm9tLm9mZnNldFxuICAgICAgfVxuICAgICAgbGV0IGVuZCA9IGRlcHRoIDwgdG8uZGVwdGggPyB0by5wYXRoW2RlcHRoXSA6IHRvLm9mZnNldFxuICAgICAgY29weS5wdXNoRnJvbShub2RlLCBzdGFydCwgZW5kKVxuICAgICAgaWYgKGRlcHRoIDwgdG8uZGVwdGgpXG4gICAgICAgIGNvcHkucHVzaChzbGljZUJlZm9yZShub2RlLmNvbnRlbnRbZW5kXSwgdG8sIGRlcHRoICsgMSkpXG4gICAgfVxuICAgIHJldHVybiBjb3B5XG4gIH1cbn1cbiIsImV4cG9ydCBjb25zdCBjb2RlID0ge3R5cGU6IFwiY29kZVwifVxuZXhwb3J0IGNvbnN0IGVtID0ge3R5cGU6IFwiZW1cIn1cbmV4cG9ydCBjb25zdCBzdHJvbmcgPSB7dHlwZTogXCJzdHJvbmdcIn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpbmsoaHJlZiwgdGl0bGUpIHtcbiAgcmV0dXJuIHt0eXBlOiBcImxpbmtcIiwgaHJlZjogaHJlZiwgdGl0bGU6IHRpdGxlIHx8IG51bGx9XG59XG5cbmV4cG9ydCBjb25zdCBvcmRlcmluZyA9IFtcImVtXCIsIFwic3Ryb25nXCIsIFwibGlua1wiLCBcImNvZGVcIl1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZChzdHlsZXMsIHN0eWxlKSB7XG4gIHZhciBvcmRlciA9IG9yZGVyaW5nLmluZGV4T2Yoc3R5bGUudHlwZSlcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgb3RoZXIgPSBzdHlsZXNbaV1cbiAgICBpZiAob3RoZXIudHlwZSA9PSBzdHlsZS50eXBlKSB7XG4gICAgICBpZiAoc2FtZShvdGhlciwgc3R5bGUpKSByZXR1cm4gc3R5bGVzXG4gICAgICBlbHNlIHJldHVybiBzdHlsZXMuc2xpY2UoMCwgaSkuY29uY2F0KHN0eWxlKS5jb25jYXQoc3R5bGVzLnNsaWNlKGkgKyAxKSlcbiAgICB9XG4gICAgaWYgKG9yZGVyaW5nLmluZGV4T2Yob3RoZXIudHlwZSkgPiBvcmRlcilcbiAgICAgIHJldHVybiBzdHlsZXMuc2xpY2UoMCwgaSkuY29uY2F0KHN0eWxlKS5jb25jYXQoc3R5bGVzLnNsaWNlKGkpKVxuICB9XG4gIHJldHVybiBzdHlsZXMuY29uY2F0KHN0eWxlKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlKHN0eWxlcywgc3R5bGUpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspXG4gICAgaWYgKHNhbWUoc3R5bGUsIHN0eWxlc1tpXSkpXG4gICAgICByZXR1cm4gc3R5bGVzLnNsaWNlKDAsIGkpLmNvbmNhdChzdHlsZXMuc2xpY2UoaSArIDEpKVxuICByZXR1cm4gc3R5bGVzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVUeXBlKHN0eWxlcywgdHlwZSkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKylcbiAgICBpZiAoc3R5bGVzW2ldLnR5cGUgPT0gdHlwZSlcbiAgICAgIHJldHVybiBzdHlsZXMuc2xpY2UoMCwgaSkuY29uY2F0KHN0eWxlcy5zbGljZShpICsgMSkpXG4gIHJldHVybiBzdHlsZXNcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhbWVTZXQoYSwgYikge1xuICBpZiAoYS5sZW5ndGggIT0gYi5sZW5ndGgpIHJldHVybiBmYWxzZVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspXG4gICAgaWYgKCFzYW1lKGFbaV0sIGJbaV0pKSByZXR1cm4gZmFsc2VcbiAgcmV0dXJuIHRydWVcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhbWUoYSwgYikge1xuICBpZiAoYSA9PSBiKSByZXR1cm4gdHJ1ZVxuICBmb3IgKGxldCBwcm9wIGluIGEpXG4gICAgaWYgKGFbcHJvcF0gIT0gYltwcm9wXSkgcmV0dXJuIGZhbHNlXG4gIGZvciAobGV0IHByb3AgaW4gYilcbiAgICBpZiAoYVtwcm9wXSAhPSBiW3Byb3BdKSByZXR1cm4gZmFsc2VcbiAgcmV0dXJuIHRydWVcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnRhaW5zKHNldCwgc3R5bGUpIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZXQubGVuZ3RoOyBpKyspXG4gICAgaWYgKHNhbWUoc2V0W2ldLCBzdHlsZSkpIHJldHVybiB0cnVlXG4gIHJldHVybiBmYWxzZVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29udGFpbnNUeXBlKHNldCwgdHlwZSkge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNldC5sZW5ndGg7IGkrKylcbiAgICBpZiAoc2V0W2ldLnR5cGUgPT0gdHlwZSkgcmV0dXJuIHNldFtpXVxuICByZXR1cm4gZmFsc2Vcbn1cbiIsImltcG9ydCB7UG9zLCBOb2RlLCBmaW5kQ29ubmVjdGlvbn0gZnJvbSBcIi4uL21vZGVsXCJcblxuaW1wb3J0IHtUcmFuc2Zvcm1SZXN1bHQsIFRyYW5zZm9ybX0gZnJvbSBcIi4vdHJhbnNmb3JtXCJcbmltcG9ydCB7ZGVmaW5lU3RlcCwgU3RlcH0gZnJvbSBcIi4vc3RlcFwiXG5pbXBvcnQge2lzRmxhdFJhbmdlLCBjb3B5VG8sIHNlbGVjdGVkU2libGluZ3MsIGJsb2Nrc0JldHdlZW4sIGlzUGxhaW5UZXh0fSBmcm9tIFwiLi90cmVlXCJcbmltcG9ydCB7UG9zTWFwLCBNb3ZlZFJhbmdlLCBSZXBsYWNlZFJhbmdlfSBmcm9tIFwiLi9tYXBcIlxuXG5kZWZpbmVTdGVwKFwiYW5jZXN0b3JcIiwge1xuICBhcHBseShkb2MsIHN0ZXApIHtcbiAgICBsZXQgZnJvbSA9IHN0ZXAuZnJvbSwgdG8gPSBzdGVwLnRvXG4gICAgaWYgKCFpc0ZsYXRSYW5nZShmcm9tLCB0bykpIHJldHVybiBudWxsXG4gICAgbGV0IHRvUGFyZW50ID0gZnJvbS5wYXRoLCBzdGFydCA9IGZyb20ub2Zmc2V0LCBlbmQgPSB0by5vZmZzZXRcbiAgICBsZXQgZGVwdGggPSBzdGVwLnBhcmFtLmRlcHRoIHx8IDAsIHdyYXBwZXJzID0gc3RlcC5wYXJhbS53cmFwcGVycyB8fCBOb2RlLmVtcHR5XG4gICAgaWYgKCFkZXB0aCAmJiB3cmFwcGVycy5sZW5ndGggPT0gMCkgcmV0dXJuIG51bGxcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRlcHRoOyBpKyspIHtcbiAgICAgIGlmIChzdGFydCA+IDAgfHwgZW5kIDwgZG9jLnBhdGgodG9QYXJlbnQpLm1heE9mZnNldCB8fCB0b1BhcmVudC5sZW5ndGggPT0gMCkgcmV0dXJuIG51bGxcbiAgICAgIHN0YXJ0ID0gdG9QYXJlbnRbdG9QYXJlbnQubGVuZ3RoIC0gMV1cbiAgICAgIGVuZCA9IHN0YXJ0ICsgMVxuICAgICAgdG9QYXJlbnQgPSB0b1BhcmVudC5zbGljZSgwLCB0b1BhcmVudC5sZW5ndGggLSAxKVxuICAgIH1cbiAgICBsZXQgY29weSA9IGNvcHlUbyhkb2MsIHRvUGFyZW50KVxuICAgIGxldCBwYXJlbnQgPSBjb3B5LnBhdGgodG9QYXJlbnQpLCBpbm5lciA9IGNvcHkucGF0aChmcm9tLnBhdGgpXG4gICAgbGV0IHBhcmVudFNpemUgPSBwYXJlbnQuY29udGVudC5sZW5ndGhcbiAgICBpZiAod3JhcHBlcnMubGVuZ3RoKSB7XG4gICAgICBsZXQgbGFzdFdyYXBwZXIgPSB3cmFwcGVyc1t3cmFwcGVycy5sZW5ndGggLSAxXVxuICAgICAgaWYgKHBhcmVudC50eXBlLmNvbnRhaW5zICE9IHdyYXBwZXJzWzBdLnR5cGUudHlwZSB8fFxuICAgICAgICAgIGxhc3RXcmFwcGVyLnR5cGUuY29udGFpbnMgIT0gaW5uZXIudHlwZS5jb250YWlucyB8fFxuICAgICAgICAgIGxhc3RXcmFwcGVyLnR5cGUucGxhaW5UZXh0ICYmICFpc1BsYWluVGV4dChpbm5lcikpXG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICBsZXQgbm9kZSA9IG51bGxcbiAgICAgIGZvciAobGV0IGkgPSB3cmFwcGVycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSlcbiAgICAgICAgbm9kZSA9IHdyYXBwZXJzW2ldLmNvcHkobm9kZSA/IFtub2RlXSA6IGlubmVyLmNvbnRlbnQuc2xpY2UoZnJvbS5vZmZzZXQsIHRvLm9mZnNldCkpXG4gICAgICBwYXJlbnQuY29udGVudC5zcGxpY2Uoc3RhcnQsIGVuZCAtIHN0YXJ0LCBub2RlKVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocGFyZW50LnR5cGUuY29udGFpbnMgIT0gaW5uZXIudHlwZS5jb250YWlucykgcmV0dXJuIG51bGxcbiAgICAgIHBhcmVudC5jb250ZW50ID0gcGFyZW50LmNvbnRlbnQuc2xpY2UoMCwgc3RhcnQpLmNvbmNhdChpbm5lci5jb250ZW50KS5jb25jYXQocGFyZW50LmNvbnRlbnQuc2xpY2UoZW5kKSlcbiAgICB9XG5cbiAgICBsZXQgdG9Jbm5lciA9IHRvUGFyZW50LnNsaWNlKClcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdyYXBwZXJzLmxlbmd0aDsgaSsrKSB0b0lubmVyLnB1c2goaSA/IDAgOiBzdGFydClcbiAgICBsZXQgc3RhcnRPZklubmVyID0gbmV3IFBvcyh0b0lubmVyLCB3cmFwcGVycy5sZW5ndGggPyAwIDogc3RhcnQpXG4gICAgbGV0IHJlcGxhY2VkID0gbnVsbFxuICAgIGxldCBpbnNlcnRlZFNpemUgPSB3cmFwcGVycy5sZW5ndGggPyAxIDogdG8ub2Zmc2V0IC0gZnJvbS5vZmZzZXRcbiAgICBpZiAoZGVwdGggIT0gd3JhcHBlcnMubGVuZ3RoIHx8IGRlcHRoID4gMSB8fCB3cmFwcGVycy5sZW5ndGggPiAxKSB7XG4gICAgICBsZXQgcG9zQmVmb3JlID0gbmV3IFBvcyh0b1BhcmVudCwgc3RhcnQpXG4gICAgICBsZXQgcG9zQWZ0ZXIxID0gbmV3IFBvcyh0b1BhcmVudCwgZW5kKSwgcG9zQWZ0ZXIyID0gbmV3IFBvcyh0b1BhcmVudCwgc3RhcnQgKyBpbnNlcnRlZFNpemUpXG4gICAgICBsZXQgZW5kT2ZJbm5lciA9IG5ldyBQb3ModG9Jbm5lciwgc3RhcnRPZklubmVyLm9mZnNldCArICh0by5vZmZzZXQgLSBmcm9tLm9mZnNldCkpXG4gICAgICByZXBsYWNlZCA9IFtuZXcgUmVwbGFjZWRSYW5nZShwb3NCZWZvcmUsIGZyb20sIHBvc0JlZm9yZSwgc3RhcnRPZklubmVyKSxcbiAgICAgICAgICAgICAgICAgIG5ldyBSZXBsYWNlZFJhbmdlKHRvLCBwb3NBZnRlcjEsIGVuZE9mSW5uZXIsIHBvc0FmdGVyMiwgcG9zQWZ0ZXIxLCBwb3NBZnRlcjIpXVxuICAgIH1cbiAgICBsZXQgbW92ZWQgPSBbbmV3IE1vdmVkUmFuZ2UoZnJvbSwgdG8ub2Zmc2V0IC0gZnJvbS5vZmZzZXQsIHN0YXJ0T2ZJbm5lcildXG4gICAgaWYgKGVuZCAtIHN0YXJ0ICE9IGluc2VydGVkU2l6ZSlcbiAgICAgIG1vdmVkLnB1c2gobmV3IE1vdmVkUmFuZ2UobmV3IFBvcyh0b1BhcmVudCwgZW5kKSwgcGFyZW50U2l6ZSAtIGVuZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFBvcyh0b1BhcmVudCwgc3RhcnQgKyBpbnNlcnRlZFNpemUpKSlcbiAgICByZXR1cm4gbmV3IFRyYW5zZm9ybVJlc3VsdChjb3B5LCBuZXcgUG9zTWFwKG1vdmVkLCByZXBsYWNlZCkpXG4gIH0sXG4gIGludmVydChzdGVwLCBvbGREb2MsIG1hcCkge1xuICAgIGxldCB3cmFwcGVycyA9IFtdXG4gICAgaWYgKHN0ZXAucGFyYW0uZGVwdGgpIGZvciAobGV0IGkgPSAwOyBpIDwgc3RlcC5wYXJhbS5kZXB0aDsgaSsrKSB7XG4gICAgICBsZXQgcGFyZW50ID0gb2xkRG9jLnBhdGgoc3RlcC5mcm9tLnBhdGguc2xpY2UoMCwgc3RlcC5mcm9tLnBhdGgubGVuZ3RoIC0gaSkpXG4gICAgICB3cmFwcGVycy51bnNoaWZ0KHBhcmVudC5jb3B5KCkpXG4gICAgfVxuICAgIGxldCBuZXdGcm9tID0gbWFwLm1hcChzdGVwLmZyb20pLnBvc1xuICAgIGxldCBuZXdUbyA9IHN0ZXAuZnJvbS5jbXAoc3RlcC50bykgPyBtYXAubWFwKHN0ZXAudG8sIC0xKS5wb3MgOiBuZXdGcm9tXG4gICAgcmV0dXJuIG5ldyBTdGVwKFwiYW5jZXN0b3JcIiwgbmV3RnJvbSwgbmV3VG8sIG51bGwsXG4gICAgICAgICAgICAgICAgICAgIHtkZXB0aDogc3RlcC5wYXJhbS53cmFwcGVycyA/IHN0ZXAucGFyYW0ud3JhcHBlcnMubGVuZ3RoIDogMCxcbiAgICAgICAgICAgICAgICAgICAgIHdyYXBwZXJzOiB3cmFwcGVyc30pXG4gIH0sXG4gIHBhcmFtVG9KU09OKHBhcmFtKSB7XG4gICAgcmV0dXJuIHtkZXB0aDogcGFyYW0uZGVwdGgsXG4gICAgICAgICAgICB3cmFwcGVyczogcGFyYW0ud3JhcHBlcnMgJiYgcGFyYW0ud3JhcHBlcnMubWFwKG4gPT4gbi50b0pTT04oKSl9XG4gIH0sXG4gIHBhcmFtRnJvbUpTT04oanNvbikge1xuICAgIHJldHVybiB7ZGVwdGg6IGpzb24uZGVwdGgsXG4gICAgICAgICAgICB3cmFwcGVyczoganNvbi53cmFwcGVycyAmJiBqc29uLndyYXBwZXJzLm1hcChOb2RlLmZyb21KU09OKX1cbiAgfVxufSlcblxuZnVuY3Rpb24gY2FuVW53cmFwKGNvbnRhaW5lciwgZnJvbSwgdG8pIHtcbiAgbGV0IHR5cGUgPSBjb250YWluZXIuY29udGVudFtmcm9tXS50eXBlLmNvbnRhaW5zXG4gIGZvciAobGV0IGkgPSBmcm9tICsgMTsgaSA8IHRvOyBpKyspXG4gICAgaWYgKGNvbnRhaW5lci5jb250ZW50W2ldLnR5cGUuY29udGFpbnMgIT0gdHlwZSlcbiAgICAgIHJldHVybiBmYWxzZVxuICByZXR1cm4gdHlwZVxufVxuXG5mdW5jdGlvbiBjYW5CZUxpZnRlZChkb2MsIHJhbmdlKSB7XG4gIGxldCBjb250YWluZXIgPSBkb2MucGF0aChyYW5nZS5wYXRoKVxuICBsZXQgcGFyZW50RGVwdGgsIHVud3JhcCA9IGZhbHNlLCBpbm5lclR5cGUgPSBjb250YWluZXIudHlwZS5jb250YWluc1xuICBmb3IgKDs7KSB7XG4gICAgcGFyZW50RGVwdGggPSAtMVxuICAgIGZvciAobGV0IG5vZGUgPSBkb2MsIGkgPSAwOyBpIDwgcmFuZ2UucGF0aC5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKG5vZGUudHlwZS5jb250YWlucyA9PSBpbm5lclR5cGUpIHBhcmVudERlcHRoID0gaVxuICAgICAgbm9kZSA9IG5vZGUuY29udGVudFtyYW5nZS5wYXRoW2ldXVxuICAgIH1cbiAgICBpZiAocGFyZW50RGVwdGggPiAtMSkgcmV0dXJuIHtwYXRoOiByYW5nZS5wYXRoLnNsaWNlKDAsIHBhcmVudERlcHRoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bndyYXA6IHVud3JhcH1cbiAgICBpZiAodW53cmFwIHx8ICEoaW5uZXJUeXBlID0gY2FuVW53cmFwKGNvbnRhaW5lciwgcmFuZ2UuZnJvbSwgcmFuZ2UudG8pKSkgcmV0dXJuIG51bGxcbiAgICB1bndyYXAgPSB0cnVlXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhbkxpZnQoZG9jLCBmcm9tLCB0bykge1xuICBsZXQgcmFuZ2UgPSBzZWxlY3RlZFNpYmxpbmdzKGRvYywgZnJvbSwgdG8gfHwgZnJvbSlcbiAgbGV0IGZvdW5kID0gY2FuQmVMaWZ0ZWQoZG9jLCByYW5nZSlcbiAgaWYgKGZvdW5kKSByZXR1cm4ge2ZvdW5kLCByYW5nZX1cbn1cblxuVHJhbnNmb3JtLnByb3RvdHlwZS5saWZ0ID0gZnVuY3Rpb24oZnJvbSwgdG8gPSBmcm9tKSB7XG4gIGxldCBjYW4gPSBjYW5MaWZ0KHRoaXMuZG9jLCBmcm9tLCB0bylcbiAgaWYgKCFjYW4pIHJldHVybiB0aGlzXG4gIGxldCB7Zm91bmQsIHJhbmdlfSA9IGNhblxuICBsZXQgZGVwdGggPSByYW5nZS5wYXRoLmxlbmd0aCAtIGZvdW5kLnBhdGgubGVuZ3RoXG4gIGxldCByYW5nZU5vZGUgPSBmb3VuZC51bndyYXAgJiYgdGhpcy5kb2MucGF0aChyYW5nZS5wYXRoKVxuXG4gIGZvciAobGV0IGQgPSAwLCBwb3MgPSBuZXcgUG9zKHJhbmdlLnBhdGgsIHJhbmdlLnRvKTs7IGQrKykge1xuICAgIGlmIChwb3Mub2Zmc2V0IDwgdGhpcy5kb2MucGF0aChwb3MucGF0aCkuY29udGVudC5sZW5ndGgpIHtcbiAgICAgIHRoaXMuc3BsaXQocG9zLCBkZXB0aClcbiAgICAgIGJyZWFrXG4gICAgfVxuICAgIGlmIChkID09IGRlcHRoIC0gMSkgYnJlYWtcbiAgICBwb3MgPSBwb3Muc2hvcnRlbihudWxsLCAxKVxuICB9XG4gIGZvciAobGV0IGQgPSAwLCBwb3MgPSBuZXcgUG9zKHJhbmdlLnBhdGgsIHJhbmdlLmZyb20pOzsgZCsrKSB7XG4gICAgaWYgKHBvcy5vZmZzZXQgPiAwKSB7XG4gICAgICB0aGlzLnNwbGl0KHBvcywgZGVwdGggLSBkKVxuICAgICAgbGV0IGN1dCA9IHJhbmdlLnBhdGgubGVuZ3RoIC0gZGVwdGgsIHBhdGggPSBwb3MucGF0aC5zbGljZSgwLCBjdXQpLmNvbmNhdChwb3MucGF0aFtjdXRdICsgMSlcbiAgICAgIHdoaWxlIChwYXRoLmxlbmd0aCA8IHJhbmdlLnBhdGgubGVuZ3RoKSBwYXRoLnB1c2goMClcbiAgICAgIHJhbmdlID0ge3BhdGg6IHBhdGgsIGZyb206IDAsIHRvOiByYW5nZS50byAtIHJhbmdlLmZyb219XG4gICAgICBicmVha1xuICAgIH1cbiAgICBpZiAoZCA9PSBkZXB0aCAtIDEpIGJyZWFrXG4gICAgcG9zID0gcG9zLnNob3J0ZW4oKVxuICB9XG4gIGlmIChmb3VuZC51bndyYXApIHtcbiAgICBmb3IgKGxldCBpID0gcmFuZ2UudG8gLSAxOyBpID4gcmFuZ2UuZnJvbTsgaS0tKVxuICAgICAgdGhpcy5qb2luKG5ldyBQb3MocmFuZ2UucGF0aCwgaSkpXG4gICAgbGV0IHNpemUgPSAwXG4gICAgZm9yIChsZXQgaSA9IHJhbmdlLmZyb207IGkgPCByYW5nZS50bzsgaSsrKVxuICAgICAgc2l6ZSArPSByYW5nZU5vZGUuY29udGVudFtpXS5jb250ZW50Lmxlbmd0aFxuICAgIHJhbmdlID0ge3BhdGg6IHJhbmdlLnBhdGguY29uY2F0KHJhbmdlLmZyb20pLCBmcm9tOiAwLCB0bzogc2l6ZX1cbiAgICArK2RlcHRoXG4gIH1cbiAgdGhpcy5zdGVwKFwiYW5jZXN0b3JcIiwgbmV3IFBvcyhyYW5nZS5wYXRoLCByYW5nZS5mcm9tKSxcbiAgICAgICAgICAgIG5ldyBQb3MocmFuZ2UucGF0aCwgcmFuZ2UudG8pLCBudWxsLCB7ZGVwdGg6IGRlcHRofSlcbiAgcmV0dXJuIHRoaXNcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhbldyYXAoZG9jLCBmcm9tLCB0bywgbm9kZSkge1xuICBsZXQgcmFuZ2UgPSBzZWxlY3RlZFNpYmxpbmdzKGRvYywgZnJvbSwgdG8gfHwgZnJvbSlcbiAgaWYgKHJhbmdlLmZyb20gPT0gcmFuZ2UudG8pIHJldHVybiBudWxsXG4gIGxldCBwYXJlbnQgPSBkb2MucGF0aChyYW5nZS5wYXRoKVxuICBsZXQgYXJvdW5kID0gZmluZENvbm5lY3Rpb24ocGFyZW50LnR5cGUsIG5vZGUudHlwZSlcbiAgbGV0IGluc2lkZSA9IGZpbmRDb25uZWN0aW9uKG5vZGUudHlwZSwgcGFyZW50LmNvbnRlbnRbcmFuZ2UuZnJvbV0udHlwZSlcbiAgaWYgKGFyb3VuZCAmJiBpbnNpZGUpIHJldHVybiB7cmFuZ2UsIGFyb3VuZCwgaW5zaWRlfVxufVxuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLndyYXAgPSBmdW5jdGlvbihmcm9tLCB0bywgbm9kZSkge1xuICBsZXQgY2FuID0gY2FuV3JhcCh0aGlzLmRvYywgZnJvbSwgdG8sIG5vZGUpXG4gIGlmICghY2FuKSByZXR1cm4gdGhpc1xuICBsZXQge3JhbmdlLCBhcm91bmQsIGluc2lkZX0gPSBjYW5cbiAgbGV0IHdyYXBwZXJzID0gYXJvdW5kLm1hcCh0ID0+IG5ldyBOb2RlKHQpKS5jb25jYXQobm9kZSkuY29uY2F0KGluc2lkZS5tYXAodCA9PiBuZXcgTm9kZSh0KSkpXG4gIHRoaXMuc3RlcChcImFuY2VzdG9yXCIsIG5ldyBQb3MocmFuZ2UucGF0aCwgcmFuZ2UuZnJvbSksIG5ldyBQb3MocmFuZ2UucGF0aCwgcmFuZ2UudG8pLFxuICAgICAgICAgICAgbnVsbCwge3dyYXBwZXJzOiB3cmFwcGVyc30pXG4gIGlmIChpbnNpZGUubGVuZ3RoKSB7XG4gICAgbGV0IHRvSW5uZXIgPSByYW5nZS5wYXRoLnNsaWNlKClcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyb3VuZC5sZW5ndGggKyBpbnNpZGUubGVuZ3RoICsgMTsgaSsrKVxuICAgICAgdG9Jbm5lci5wdXNoKGkgPyAwIDogcmFuZ2UuZnJvbSlcbiAgICBmb3IgKGxldCBpID0gcmFuZ2UudG8gLSAxIC0gcmFuZ2UuZnJvbTsgaSA+IDA7IGktLSlcbiAgICAgIHRoaXMuc3BsaXQobmV3IFBvcyh0b0lubmVyLCBpKSwgaW5zaWRlLmxlbmd0aClcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLnNldEJsb2NrVHlwZSA9IGZ1bmN0aW9uKGZyb20sIHRvLCB3cmFwTm9kZSkge1xuICBibG9ja3NCZXR3ZWVuKHRoaXMuZG9jLCBmcm9tLCB0byB8fCBmcm9tLCAobm9kZSwgcGF0aCkgPT4ge1xuICAgIHBhdGggPSBwYXRoLnNsaWNlKClcbiAgICBpZiAod3JhcE5vZGUudHlwZS5wbGFpblRleHQgJiYgIWlzUGxhaW5UZXh0KG5vZGUpKVxuICAgICAgdGhpcy5jbGVhck1hcmt1cChuZXcgUG9zKHBhdGgsIDApLCBuZXcgUG9zKHBhdGgsIG5vZGUuc2l6ZSkpXG4gICAgdGhpcy5zdGVwKFwiYW5jZXN0b3JcIiwgbmV3IFBvcyhwYXRoLCAwKSwgbmV3IFBvcyhwYXRoLCBub2RlLnNpemUpLFxuICAgICAgICAgICAgICBudWxsLCB7ZGVwdGg6IDEsIHdyYXBwZXJzOiBbd3JhcE5vZGVdfSlcbiAgfSlcbiAgcmV0dXJuIHRoaXNcbn1cbiIsImV4cG9ydCB7UmVzdWx0LCBUcmFuc2Zvcm19IGZyb20gXCIuL3RyYW5zZm9ybVwiXG5leHBvcnQge1N0ZXAsIGFwcGx5U3RlcCwgaW52ZXJ0U3RlcH0gZnJvbSBcIi4vc3RlcFwiXG5leHBvcnQge2NhbkxpZnQsIGNhbldyYXB9IGZyb20gXCIuL2FuY2VzdG9yXCJcbmV4cG9ydCB7am9pblBvaW50fSBmcm9tIFwiLi9qb2luXCJcbmV4cG9ydCB7TWFwUmVzdWx0LCBtYXBTdGVwLCBSZW1hcHBpbmd9IGZyb20gXCIuL21hcFwiXG5pbXBvcnQgXCIuL3N0eWxlXCJcbmltcG9ydCBcIi4vc3BsaXRcIlxuaW1wb3J0IFwiLi9yZXBsYWNlXCJcbiIsImltcG9ydCB7UG9zLCBOb2RlLCBzdGl0Y2hUZXh0Tm9kZXN9IGZyb20gXCIuLi9tb2RlbFwiXG5cbmltcG9ydCB7VHJhbnNmb3JtUmVzdWx0LCBUcmFuc2Zvcm19IGZyb20gXCIuL3RyYW5zZm9ybVwiXG5pbXBvcnQge2RlZmluZVN0ZXAsIFN0ZXB9IGZyb20gXCIuL3N0ZXBcIlxuaW1wb3J0IHtjb3B5VG99IGZyb20gXCIuL3RyZWVcIlxuaW1wb3J0IHtQb3NNYXAsIE1vdmVkUmFuZ2UsIFJlcGxhY2VkUmFuZ2V9IGZyb20gXCIuL21hcFwiXG5cbmRlZmluZVN0ZXAoXCJqb2luXCIsIHtcbiAgYXBwbHkoZG9jLCBzdGVwKSB7XG4gICAgbGV0IGJlZm9yZSA9IGRvYy5wYXRoKHN0ZXAuZnJvbS5wYXRoKVxuICAgIGxldCBhZnRlciA9IGRvYy5wYXRoKHN0ZXAudG8ucGF0aClcbiAgICBpZiAoc3RlcC5mcm9tLm9mZnNldCA8IGJlZm9yZS5tYXhPZmZzZXQgfHwgc3RlcC50by5vZmZzZXQgPiAwIHx8XG4gICAgICAgIGJlZm9yZS50eXBlLmNvbnRhaW5zICE9IGFmdGVyLnR5cGUuY29udGFpbnMpIHJldHVybiBudWxsXG4gICAgbGV0IHBGcm9tID0gc3RlcC5mcm9tLnBhdGgsIHBUbyA9IHN0ZXAudG8ucGF0aFxuICAgIGxldCBsYXN0ID0gcEZyb20ubGVuZ3RoIC0gMSwgb2Zmc2V0ID0gcEZyb21bbGFzdF0gKyAxXG4gICAgaWYgKHBGcm9tLmxlbmd0aCAhPSBwVG8ubGVuZ3RoIHx8IHBGcm9tLmxlbmd0aCA9PSAwIHx8IG9mZnNldCAhPSBwVG9bbGFzdF0pIHJldHVybiBudWxsXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsYXN0OyBpKyspIGlmIChwRnJvbVtpXSAhPSBwVG9baV0pIHJldHVybiBudWxsXG5cbiAgICBsZXQgdGFyZ2V0UGF0aCA9IHBGcm9tLnNsaWNlKDAsIGxhc3QpXG4gICAgbGV0IGNvcHkgPSBjb3B5VG8oZG9jLCB0YXJnZXRQYXRoKVxuICAgIGxldCB0YXJnZXQgPSBjb3B5LnBhdGgodGFyZ2V0UGF0aCksIG9sZFNpemUgPSB0YXJnZXQuY29udGVudC5sZW5ndGhcbiAgICBsZXQgam9pbmVkID0gbmV3IE5vZGUoYmVmb3JlLnR5cGUsIGJlZm9yZS5hdHRycywgYmVmb3JlLmNvbnRlbnQuY29uY2F0KGFmdGVyLmNvbnRlbnQpKVxuICAgIGlmIChqb2luZWQudHlwZS5ibG9jaylcbiAgICAgIHN0aXRjaFRleHROb2Rlcyhqb2luZWQsIGJlZm9yZS5jb250ZW50Lmxlbmd0aClcbiAgICB0YXJnZXQuY29udGVudC5zcGxpY2Uob2Zmc2V0IC0gMSwgMiwgam9pbmVkKVxuXG4gICAgbGV0IG1hcCA9IG5ldyBQb3NNYXAoW25ldyBNb3ZlZFJhbmdlKHN0ZXAudG8sIGFmdGVyLm1heE9mZnNldCwgc3RlcC5mcm9tKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE1vdmVkUmFuZ2UobmV3IFBvcyh0YXJnZXRQYXRoLCBvZmZzZXQgKyAxKSwgb2xkU2l6ZSAtIG9mZnNldCAtIDEsIG5ldyBQb3ModGFyZ2V0UGF0aCwgb2Zmc2V0KSldLFxuICAgICAgICAgICAgICAgICAgICAgICAgIFtuZXcgUmVwbGFjZWRSYW5nZShzdGVwLmZyb20sIHN0ZXAudG8sIHN0ZXAuZnJvbSwgc3RlcC5mcm9tLCBzdGVwLnRvLnNob3J0ZW4oKSldKVxuICAgIHJldHVybiBuZXcgVHJhbnNmb3JtUmVzdWx0KGNvcHksIG1hcClcbiAgfSxcbiAgaW52ZXJ0KHN0ZXAsIG9sZERvYykge1xuICAgIHJldHVybiBuZXcgU3RlcChcInNwbGl0XCIsIG51bGwsIG51bGwsIHN0ZXAuZnJvbSwgb2xkRG9jLnBhdGgoc3RlcC50by5wYXRoKS5jb3B5KCkpXG4gIH1cbn0pXG5cbmV4cG9ydCBmdW5jdGlvbiBqb2luUG9pbnQoZG9jLCBwb3MsIGRpciA9IC0xKSB7XG4gIGxldCBqb2luRGVwdGggPSAtMVxuICBmb3IgKGxldCBpID0gMCwgcGFyZW50ID0gZG9jOyBpIDwgcG9zLnBhdGgubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgaW5kZXggPSBwb3MucGF0aFtpXVxuICAgIGxldCB0eXBlID0gcGFyZW50LmNvbnRlbnRbaW5kZXhdLnR5cGVcbiAgICBpZiAoIXR5cGUuYmxvY2sgJiZcbiAgICAgICAgKGRpciA9PSAtMSA/IChpbmRleCA+IDAgJiYgcGFyZW50LmNvbnRlbnRbaW5kZXggLSAxXS50eXBlID09IHR5cGUpXG4gICAgICAgICAgICAgICAgICAgOiAoaW5kZXggPCBwYXJlbnQuY29udGVudC5sZW5ndGggLSAxICYmIHBhcmVudC5jb250ZW50W2luZGV4ICsgMV0udHlwZSA9PSB0eXBlKSkpXG4gICAgICBqb2luRGVwdGggPSBpXG4gICAgcGFyZW50ID0gcGFyZW50LmNvbnRlbnRbaW5kZXhdXG4gIH1cbiAgaWYgKGpvaW5EZXB0aCA+IC0xKSByZXR1cm4gcG9zLnNob3J0ZW4oam9pbkRlcHRoLCBkaXIgPT0gLTEgPyAwIDogMSlcbn1cblxuVHJhbnNmb3JtLnByb3RvdHlwZS5qb2luID0gZnVuY3Rpb24oYXQpIHtcbiAgbGV0IHBhcmVudCA9IHRoaXMuZG9jLnBhdGgoYXQucGF0aClcbiAgaWYgKGF0Lm9mZnNldCA9PSAwIHx8IGF0Lm9mZnNldCA9PSBwYXJlbnQuY29udGVudC5sZW5ndGggfHwgcGFyZW50LnR5cGUuYmxvY2spIHJldHVybiB0aGlzXG4gIHRoaXMuc3RlcChcImpvaW5cIiwgbmV3IFBvcyhhdC5wYXRoLmNvbmNhdChhdC5vZmZzZXQgLSAxKSwgcGFyZW50LmNvbnRlbnRbYXQub2Zmc2V0IC0gMV0ubWF4T2Zmc2V0KSxcbiAgICAgICAgICAgIG5ldyBQb3MoYXQucGF0aC5jb25jYXQoYXQub2Zmc2V0KSwgMCkpXG4gIHJldHVybiB0aGlzXG59XG4iLCJpbXBvcnQge1Bvc30gZnJvbSBcIi4uL21vZGVsXCJcblxuaW1wb3J0IHtTdGVwfSBmcm9tIFwiLi9zdGVwXCJcblxuZXhwb3J0IGNsYXNzIE1vdmVkUmFuZ2Uge1xuICBjb25zdHJ1Y3RvcihzdGFydCwgc2l6ZSwgZGVzdCA9IG51bGwpIHtcbiAgICB0aGlzLnN0YXJ0ID0gc3RhcnRcbiAgICB0aGlzLnNpemUgPSBzaXplXG4gICAgdGhpcy5kZXN0ID0gZGVzdFxuICB9XG5cbiAgZ2V0IGVuZCgpIHtcbiAgICByZXR1cm4gbmV3IFBvcyh0aGlzLnN0YXJ0LnBhdGgsIHRoaXMuc3RhcnQub2Zmc2V0ICsgdGhpcy5zaXplKVxuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIFwiW21vdmVkIFwiICsgdGhpcy5zdGFydCArIFwiK1wiICsgdGhpcy5zaXplICsgXCIgdG8gXCIgKyB0aGlzLmRlc3QgKyBcIl1cIlxuICB9XG59XG5cbmNsYXNzIFNpZGUge1xuICBjb25zdHJ1Y3Rvcihmcm9tLCB0bywgcmVmKSB7XG4gICAgdGhpcy5mcm9tID0gZnJvbVxuICAgIHRoaXMudG8gPSB0b1xuICAgIHRoaXMucmVmID0gcmVmXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJlcGxhY2VkUmFuZ2Uge1xuICBjb25zdHJ1Y3Rvcihmcm9tLCB0bywgbmV3RnJvbSwgbmV3VG8sIHJlZiA9IGZyb20sIG5ld1JlZiA9IG5ld0Zyb20pIHtcbiAgICB0aGlzLmJlZm9yZSA9IG5ldyBTaWRlKGZyb20sIHRvLCByZWYpXG4gICAgdGhpcy5hZnRlciA9IG5ldyBTaWRlKG5ld0Zyb20sIG5ld1RvLCBuZXdSZWYpXG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gXCJbcmVwbGFjZWQgXCIgKyB0aGlzLmJlZm9yZS5mcm9tICsgXCItXCIgKyB0aGlzLmJlZm9yZS50byArIFwiIHdpdGggXCIgKyB0aGlzLmFmdGVyLmZyb20gKyBcIi1cIiArIHRoaXMuYWZ0ZXIudG8gKyBcIl1cIlxuICB9XG59XG5cbmNvbnN0IGVtcHR5ID0gW11cblxuZXhwb3J0IGNsYXNzIE1hcFJlc3VsdCB7XG4gIGNvbnN0cnVjdG9yKHBvcywgZGVsZXRlZCA9IGZhbHNlLCByZWNvdmVyID0gbnVsbCkge1xuICAgIHRoaXMucG9zID0gcG9zXG4gICAgdGhpcy5kZWxldGVkID0gZGVsZXRlZFxuICAgIHRoaXMucmVjb3ZlciA9IHJlY292ZXJcbiAgfVxufVxuXG5mdW5jdGlvbiBvZmZzZXRGcm9tKGJhc2UsIHBvcykge1xuICBpZiAocG9zLnBhdGgubGVuZ3RoID4gYmFzZS5wYXRoLmxlbmd0aCkge1xuICAgIGxldCBwYXRoID0gW3Bvcy5wYXRoW2Jhc2UucGF0aC5sZW5ndGhdIC0gYmFzZS5vZmZzZXRdXG4gICAgZm9yIChsZXQgaSA9IGJhc2UucGF0aC5sZW5ndGggKyAxOyBpIDwgcG9zLnBhdGgubGVuZ3RoOyBpKyspXG4gICAgICBwYXRoLnB1c2gocG9zLnBhdGhbaV0pXG4gICAgcmV0dXJuIG5ldyBQb3MocGF0aCwgcG9zLm9mZnNldClcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IFBvcyhbXSwgcG9zLm9mZnNldCAtIGJhc2Uub2Zmc2V0KVxuICB9XG59XG5cbmZ1bmN0aW9uIG1hcFRocm91Z2gobWFwLCBwb3MsIGJpYXMgPSAxLCBiYWNrKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWFwLnJlcGxhY2VkLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IHJhbmdlID0gbWFwLnJlcGxhY2VkW2ldLCBzaWRlID0gYmFjayA/IHJhbmdlLmFmdGVyIDogcmFuZ2UuYmVmb3JlXG4gICAgbGV0IGxlZnQsIHJpZ2h0XG4gICAgaWYgKChsZWZ0ID0gcG9zLmNtcChzaWRlLmZyb20pKSA+PSAwICYmXG4gICAgICAgIChyaWdodCA9IHBvcy5jbXAoc2lkZS50bykpIDw9IDApIHtcbiAgICAgIGxldCBvdGhlciA9IGJhY2sgPyByYW5nZS5iZWZvcmUgOiByYW5nZS5hZnRlclxuICAgICAgcmV0dXJuIG5ldyBNYXBSZXN1bHQoYmlhcyA8IDAgPyBvdGhlci5mcm9tIDogb3RoZXIudG8sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAhIShsZWZ0ICYmIHJpZ2h0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHtyYW5nZUlEOiBpLCBvZmZzZXQ6IG9mZnNldEZyb20oc2lkZS5yZWYsIHBvcyl9KVxuICAgIH1cbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWFwLm1vdmVkLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IHJhbmdlID0gbWFwLm1vdmVkW2ldXG4gICAgbGV0IHN0YXJ0ID0gYmFjayA/IHJhbmdlLmRlc3QgOiByYW5nZS5zdGFydFxuICAgIGlmIChwb3MuY21wKHN0YXJ0KSA+PSAwICYmXG4gICAgICAgIFBvcy5jbXAocG9zLnBhdGgsIHBvcy5vZmZzZXQsIHN0YXJ0LnBhdGgsIHN0YXJ0Lm9mZnNldCArIHJhbmdlLnNpemUpIDw9IDApIHtcbiAgICAgIGxldCBkZXN0ID0gYmFjayA/IHJhbmdlLnN0YXJ0IDogcmFuZ2UuZGVzdFxuICAgICAgbGV0IGRlcHRoID0gc3RhcnQuZGVwdGhcbiAgICAgIGlmIChwb3MuZGVwdGggPiBkZXB0aCkge1xuICAgICAgICBsZXQgb2Zmc2V0ID0gZGVzdC5vZmZzZXQgKyAocG9zLnBhdGhbZGVwdGhdIC0gc3RhcnQub2Zmc2V0KVxuICAgICAgICByZXR1cm4gbmV3IE1hcFJlc3VsdChuZXcgUG9zKGRlc3QucGF0aC5jb25jYXQob2Zmc2V0KS5jb25jYXQocG9zLnBhdGguc2xpY2UoZGVwdGggKyAxKSksIHBvcy5vZmZzZXQpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNYXBSZXN1bHQobmV3IFBvcyhkZXN0LnBhdGgsIGRlc3Qub2Zmc2V0ICsgKHBvcy5vZmZzZXQgLSBzdGFydC5vZmZzZXQpKSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmV3IE1hcFJlc3VsdChwb3MpXG59XG5cbmV4cG9ydCBjbGFzcyBQb3NNYXAge1xuICBjb25zdHJ1Y3Rvcihtb3ZlZCwgcmVwbGFjZWQpIHtcbiAgICB0aGlzLm1vdmVkID0gbW92ZWQgfHwgZW1wdHlcbiAgICB0aGlzLnJlcGxhY2VkID0gcmVwbGFjZWQgfHwgZW1wdHlcbiAgfVxuXG4gIHJlY292ZXIob2Zmc2V0KSB7XG4gICAgcmV0dXJuIHRoaXMucmVwbGFjZWRbb2Zmc2V0LnJhbmdlSURdLmFmdGVyLnJlZi5leHRlbmQob2Zmc2V0Lm9mZnNldClcbiAgfVxuXG4gIG1hcChwb3MsIGJpYXMpIHtcbiAgICByZXR1cm4gbWFwVGhyb3VnaCh0aGlzLCBwb3MsIGJpYXMsIGZhbHNlKVxuICB9XG5cbiAgaW52ZXJ0KCkgeyByZXR1cm4gbmV3IEludmVydGVkUG9zTWFwKHRoaXMpIH1cblxuICB0b1N0cmluZygpIHsgcmV0dXJuIHRoaXMubW92ZWQuY29uY2F0KHRoaXMucmVwbGFjZWQpLmpvaW4oXCIgXCIpIH1cbn1cblxuY2xhc3MgSW52ZXJ0ZWRQb3NNYXAge1xuICBjb25zdHJ1Y3RvcihtYXApIHsgdGhpcy5pbm5lciA9IG1hcCB9XG5cbiAgcmVjb3ZlcihvZmZzZXQpIHtcbiAgICByZXR1cm4gdGhpcy5pbm5lci5yZXBsYWNlZFtvZmZzZXQucmFuZ2VJRF0uYmVmb3JlLnJlZi5leHRlbmQob2Zmc2V0Lm9mZnNldClcbiAgfVxuXG4gIG1hcChwb3MsIGJpYXMpIHtcbiAgICByZXR1cm4gbWFwVGhyb3VnaCh0aGlzLmlubmVyLCBwb3MsIGJpYXMsIHRydWUpXG4gIH1cblxuICBpbnZlcnQoKSB7IHJldHVybiB0aGlzLmlubmVyIH1cblxuICB0b1N0cmluZygpIHsgcmV0dXJuIFwiLVwiICsgdGhpcy5pbm5lciB9XG59XG5cbmV4cG9ydCBjb25zdCBudWxsTWFwID0gbmV3IFBvc01hcFxuXG5leHBvcnQgY2xhc3MgUmVtYXBwaW5nIHtcbiAgY29uc3RydWN0b3IoaGVhZCA9IFtdLCB0YWlsID0gW10sIG1pcnJvciA9IE9iamVjdC5jcmVhdGUobnVsbCkpIHtcbiAgICB0aGlzLmhlYWQgPSBoZWFkXG4gICAgdGhpcy50YWlsID0gdGFpbFxuICAgIHRoaXMubWlycm9yID0gbWlycm9yXG4gIH1cblxuICBhZGRUb0Zyb250KG1hcCwgY29ycikge1xuICAgIHRoaXMuaGVhZC5wdXNoKG1hcClcbiAgICBsZXQgaWQgPSAtdGhpcy5oZWFkLmxlbmd0aFxuICAgIGlmIChjb3JyICE9IG51bGwpIHRoaXMubWlycm9yW2lkXSA9IGNvcnJcbiAgICByZXR1cm4gaWRcbiAgfVxuXG4gIGFkZFRvQmFjayhtYXAsIGNvcnIpIHtcbiAgICB0aGlzLnRhaWwucHVzaChtYXApXG4gICAgbGV0IGlkID0gdGhpcy50YWlsLmxlbmd0aCAtIDFcbiAgICBpZiAoY29yciAhPSBudWxsKSB0aGlzLm1pcnJvcltjb3JyXSA9IGlkXG4gICAgcmV0dXJuIGlkXG4gIH1cblxuICBnZXQoaWQpIHtcbiAgICByZXR1cm4gaWQgPCAwID8gdGhpcy5oZWFkWy1pZCAtIDFdIDogdGhpcy50YWlsW2lkXVxuICB9XG5cbiAgbWFwKHBvcywgYmlhcykge1xuICAgIGxldCBkZWxldGVkID0gZmFsc2VcblxuICAgIGZvciAobGV0IGkgPSAtdGhpcy5oZWFkLmxlbmd0aDsgaSA8IHRoaXMudGFpbC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IG1hcCA9IHRoaXMuZ2V0KGkpXG4gICAgICBsZXQgcmVzdWx0ID0gbWFwLm1hcChwb3MsIGJpYXMpXG4gICAgICBpZiAocmVzdWx0LnJlY292ZXIpIHtcbiAgICAgICAgbGV0IGNvcnIgPSB0aGlzLm1pcnJvcltpXVxuICAgICAgICBpZiAoY29yciAhPSBudWxsKSB7XG4gICAgICAgICAgaSA9IGNvcnJcbiAgICAgICAgICBwb3MgPSB0aGlzLmdldChjb3JyKS5yZWNvdmVyKHJlc3VsdC5yZWNvdmVyKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChyZXN1bHQuZGVsZXRlZCkgZGVsZXRlZCA9IHRydWVcbiAgICAgIHBvcyA9IHJlc3VsdC5wb3NcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IE1hcFJlc3VsdChwb3MsIGRlbGV0ZWQpXG4gIH1cbn1cblxuZnVuY3Rpb24gbWF4UG9zKGEsIGIpIHtcbiAgcmV0dXJuIGEuY21wKGIpID4gMCA/IGEgOiBiXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBTdGVwKHN0ZXAsIHJlbWFwcGluZykge1xuICBsZXQgYWxsRGVsZXRlZCA9IHRydWVcbiAgbGV0IGZyb20gPSBudWxsLCB0byA9IG51bGwsIHBvcyA9IG51bGxcblxuICBpZiAoc3RlcC5mcm9tKSB7XG4gICAgbGV0IHJlc3VsdCA9IHJlbWFwcGluZy5tYXAoc3RlcC5mcm9tLCAxKVxuICAgIGZyb20gPSByZXN1bHQucG9zXG4gICAgaWYgKCFyZXN1bHQuZGVsZXRlZCkgYWxsRGVsZXRlZCA9IGZhbHNlXG4gIH1cbiAgaWYgKHN0ZXAudG8pIHtcbiAgICBpZiAoc3RlcC50by5jbXAoc3RlcC5mcm9tKSA9PSAwKSB7XG4gICAgICB0byA9IGZyb21cbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHJlc3VsdCA9IHJlbWFwcGluZy5tYXAoc3RlcC50bywgLTEpXG4gICAgICB0byA9IG1heFBvcyhyZXN1bHQucG9zLCBmcm9tKVxuICAgICAgaWYgKCFyZXN1bHQuZGVsZXRlZCkgYWxsRGVsZXRlZCA9IGZhbHNlXG4gICAgfVxuICB9XG4gIGlmIChzdGVwLnBvcykge1xuICAgIGlmIChmcm9tICYmIHN0ZXAucG9zLmNtcChzdGVwLmZyb20pID09IDApIHtcbiAgICAgIHBvcyA9IGZyb21cbiAgICB9IGVsc2UgaWYgKHRvICYmIHN0ZXAucG9zLmNtcChzdGVwLnRvKSA9PSAwKSB7XG4gICAgICBwb3MgPSB0b1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgcmVzdWx0ID0gcmVtYXBwaW5nLm1hcChzdGVwLnBvcywgMSlcbiAgICAgIHBvcyA9IHJlc3VsdC5wb3NcbiAgICAgIGlmICghcmVzdWx0LmRlbGV0ZWQpIGFsbERlbGV0ZWQgPSBmYWxzZVxuICAgIH1cbiAgfVxuICBpZiAoIWFsbERlbGV0ZWQpIHJldHVybiBuZXcgU3RlcChzdGVwLm5hbWUsIGZyb20sIHRvLCBwb3MsIHN0ZXAucGFyYW0pXG59XG4iLCJpbXBvcnQge1BvcywgTm9kZSwgU3Bhbiwgc3RpdGNoVGV4dE5vZGVzLCBzcGFuU3R5bGVzQXQsIHNsaWNlQmVmb3JlLFxuICAgICAgICBzbGljZUFmdGVyLCBzbGljZUJldHdlZW59IGZyb20gXCIuLi9tb2RlbFwiXG5cbmltcG9ydCB7VHJhbnNmb3JtUmVzdWx0LCBUcmFuc2Zvcm19IGZyb20gXCIuL3RyYW5zZm9ybVwiXG5pbXBvcnQge2RlZmluZVN0ZXAsIFN0ZXB9IGZyb20gXCIuL3N0ZXBcIlxuaW1wb3J0IHtQb3NNYXAsIE1vdmVkUmFuZ2UsIFJlcGxhY2VkUmFuZ2V9IGZyb20gXCIuL21hcFwiXG5pbXBvcnQge2NvcHlUbywgcmVwbGFjZUhhc0VmZmVjdCwgc2FtZVBhdGhEZXB0aH0gZnJvbSBcIi4vdHJlZVwiXG5cbmZ1bmN0aW9uIHNpemVCZWZvcmUobm9kZSwgYXQpIHtcbiAgaWYgKG5vZGUudHlwZS5ibG9jaykge1xuICAgIGxldCBzaXplID0gMFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXQ7IGkrKykgc2l6ZSArPSBub2RlLmNvbnRlbnRbaV0uc2l6ZVxuICAgIHJldHVybiBzaXplXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGF0XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlcGxhY2UoZG9jLCBmcm9tLCB0bywgcm9vdCwgcmVwbCkge1xuICBsZXQgb3JpZ1BhcmVudCA9IGRvYy5wYXRoKHJvb3QpXG4gIGlmIChyZXBsLm5vZGVzLmxlbmd0aCAmJiByZXBsLm5vZGVzWzBdLnR5cGUudHlwZSAhPSBvcmlnUGFyZW50LnR5cGUuY29udGFpbnMpXG4gICAgcmV0dXJuIG51bGxcblxuICBsZXQgY29weSA9IGNvcHlUbyhkb2MsIHJvb3QpXG4gIGxldCBwYXJlbnQgPSBjb3B5LnBhdGgocm9vdClcbiAgcGFyZW50LmNvbnRlbnQubGVuZ3RoID0gMFxuICBsZXQgZGVwdGggPSByb290Lmxlbmd0aFxuXG4gIGxldCBmcm9tRW5kID0gZGVwdGggPT0gZnJvbS5kZXB0aFxuICBsZXQgc3RhcnQgPSBmcm9tRW5kID8gZnJvbS5vZmZzZXQgOiBmcm9tLnBhdGhbZGVwdGhdXG4gIHBhcmVudC5wdXNoTm9kZXMob3JpZ1BhcmVudC5zbGljZSgwLCBzdGFydCkpXG4gIGlmICghZnJvbUVuZCkge1xuICAgIHBhcmVudC5wdXNoKHNsaWNlQmVmb3JlKG9yaWdQYXJlbnQuY29udGVudFtzdGFydF0sIGZyb20sIGRlcHRoICsgMSkpXG4gICAgKytzdGFydFxuICB9IGVsc2Uge1xuICAgIHN0YXJ0ID0gcGFyZW50LmNvbnRlbnQubGVuZ3RoXG4gIH1cbiAgcGFyZW50LnB1c2hOb2RlcyhyZXBsLm5vZGVzKVxuICBsZXQgZW5kXG4gIGlmIChkZXB0aCA9PSB0by5kZXB0aCkge1xuICAgIGVuZCA9IHRvLm9mZnNldFxuICB9IGVsc2Uge1xuICAgIGxldCBuID0gdG8ucGF0aFtkZXB0aF1cbiAgICBwYXJlbnQucHVzaChzbGljZUFmdGVyKG9yaWdQYXJlbnQuY29udGVudFtuXSwgdG8sIGRlcHRoICsgMSkpXG4gICAgZW5kID0gbiArIDFcbiAgfVxuICBwYXJlbnQucHVzaE5vZGVzKG9yaWdQYXJlbnQuc2xpY2UoZW5kKSlcblxuICB2YXIgbW92ZWQgPSBbXVxuXG4gIGxldCByaWdodEVkZ2UgPSBzdGFydCArIHJlcGwubm9kZXMubGVuZ3RoLCBzdGFydExlbiA9IHBhcmVudC5jb250ZW50Lmxlbmd0aFxuICBpZiAocmVwbC5ub2Rlcy5sZW5ndGgpXG4gICAgbWVuZExlZnQocGFyZW50LCBzdGFydCwgZGVwdGgsIHJlcGwub3BlbkxlZnQpXG4gIG1lbmRSaWdodChwYXJlbnQsIHJpZ2h0RWRnZSArIChwYXJlbnQuY29udGVudC5sZW5ndGggLSBzdGFydExlbiksIHJvb3QsXG4gICAgICAgICAgICByZXBsLm5vZGVzLmxlbmd0aCA/IHJlcGwub3BlblJpZ2h0IDogZnJvbS5kZXB0aCAtIGRlcHRoKVxuXG4gIGZ1bmN0aW9uIG1lbmRMZWZ0KG5vZGUsIGF0LCBkZXB0aCwgb3Blbikge1xuICAgIGlmIChub2RlLnR5cGUuYmxvY2spXG4gICAgICByZXR1cm4gc3RpdGNoVGV4dE5vZGVzKG5vZGUsIGF0KVxuXG4gICAgaWYgKG9wZW4gPT0gMCB8fCBkZXB0aCA9PSBmcm9tLmRlcHRoIHx8IGF0ID09IDAgfHwgYXQgPT0gbm9kZS5jb250ZW50Lmxlbmd0aCkgcmV0dXJuXG5cbiAgICBsZXQgYmVmb3JlID0gbm9kZS5jb250ZW50W2F0IC0gMV0sIGFmdGVyID0gbm9kZS5jb250ZW50W2F0XVxuICAgIGlmIChiZWZvcmUuc2FtZU1hcmt1cChhZnRlcikpIHtcbiAgICAgIGxldCBvbGRTaXplID0gYmVmb3JlLmNvbnRlbnQubGVuZ3RoXG4gICAgICBiZWZvcmUucHVzaEZyb20oYWZ0ZXIpXG4gICAgICBub2RlLmNvbnRlbnQuc3BsaWNlKGF0LCAxKVxuICAgICAgbWVuZExlZnQoYmVmb3JlLCBvbGRTaXplLCBkZXB0aCArIDEsIG9wZW4gLSAxKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZE1vdmVkKHN0YXJ0LCBzaXplLCBkZXN0KSB7XG4gICAgaWYgKHN0YXJ0LmNtcChkZXN0KSlcbiAgICAgIG1vdmVkLnB1c2gobmV3IE1vdmVkUmFuZ2Uoc3RhcnQsIHNpemUsIGRlc3QpKVxuICB9XG5cbiAgZnVuY3Rpb24gbWVuZFJpZ2h0KG5vZGUsIGF0LCBwYXRoLCBvcGVuKSB7XG4gICAgbGV0IHRvRW5kID0gcGF0aC5sZW5ndGggPT0gdG8uZGVwdGhcbiAgICBsZXQgYWZ0ZXIgPSBub2RlLmNvbnRlbnRbYXRdLCBiZWZvcmVcblxuICAgIGxldCBzQmVmb3JlID0gdG9FbmQgPyBzaXplQmVmb3JlKG5vZGUsIGF0KSA6IGF0ICsgMVxuICAgIGxldCBtb3ZlZFN0YXJ0ID0gdG9FbmQgPyB0byA6IHRvLnNob3J0ZW4ocGF0aC5sZW5ndGgsIDEpXG4gICAgbGV0IG1vdmVkU2l6ZSA9IG5vZGUubWF4T2Zmc2V0IC0gc0JlZm9yZVxuXG4gICAgaWYgKCF0b0VuZCAmJiBvcGVuID4gMCAmJiAoYmVmb3JlID0gbm9kZS5jb250ZW50W2F0IC0gMV0pLnNhbWVNYXJrdXAoYWZ0ZXIpKSB7XG4gICAgICBhZnRlci5jb250ZW50ID0gYmVmb3JlLmNvbnRlbnQuY29uY2F0KGFmdGVyLmNvbnRlbnQpXG4gICAgICBub2RlLmNvbnRlbnQuc3BsaWNlKGF0IC0gMSwgMSlcbiAgICAgIGFkZE1vdmVkKG1vdmVkU3RhcnQsIG1vdmVkU2l6ZSwgbmV3IFBvcyhwYXRoLCBzQmVmb3JlIC0gMSkpXG4gICAgICBtZW5kUmlnaHQoYWZ0ZXIsIGJlZm9yZS5jb250ZW50Lmxlbmd0aCwgcGF0aC5jb25jYXQoYXQgLSAxKSwgb3BlbiAtIDEpXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChub2RlLnR5cGUuYmxvY2spIHN0aXRjaFRleHROb2Rlcyhub2RlLCBhdClcbiAgICAgIGFkZE1vdmVkKG1vdmVkU3RhcnQsIG1vdmVkU2l6ZSwgbmV3IFBvcyhwYXRoLCBzQmVmb3JlKSlcbiAgICAgIGlmICghdG9FbmQpIG1lbmRSaWdodChhZnRlciwgMCwgcGF0aC5jb25jYXQoYXQpLCAwKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7ZG9jOiBjb3B5LCBtb3ZlZH1cbn1cblxuY29uc3QgbnVsbFJlcGwgPSB7bm9kZXM6IFtdLCBvcGVuTGVmdDogMCwgb3BlblJpZ2h0OiAwfVxuXG5kZWZpbmVTdGVwKFwicmVwbGFjZVwiLCB7XG4gIGFwcGx5KGRvYywgc3RlcCkge1xuICAgIGxldCByb290UG9zID0gc3RlcC5wb3MsIHJvb3QgPSByb290UG9zLnBhdGhcbiAgICBpZiAoc3RlcC5mcm9tLmRlcHRoIDwgcm9vdC5sZW5ndGggfHwgc3RlcC50by5kZXB0aCA8IHJvb3QubGVuZ3RoKVxuICAgICAgcmV0dXJuIG51bGxcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvb3QubGVuZ3RoOyBpKyspXG4gICAgICBpZiAoc3RlcC5mcm9tLnBhdGhbaV0gIT0gcm9vdFtpXSB8fCBzdGVwLnRvLnBhdGhbaV0gIT0gcm9vdFtpXSlcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgIGxldCByZXN1bHQgPSByZXBsYWNlKGRvYywgc3RlcC5mcm9tLCBzdGVwLnRvLCByb290UG9zLnBhdGgsIHN0ZXAucGFyYW0gfHwgbnVsbFJlcGwpXG4gICAgaWYgKCFyZXN1bHQpIHJldHVybiBudWxsXG4gICAgbGV0IHtkb2M6IG91dCwgbW92ZWR9ID0gcmVzdWx0XG4gICAgbGV0IGVuZCA9IG1vdmVkLmxlbmd0aCA/IG1vdmVkW21vdmVkLmxlbmd0aCAtIDFdLmRlc3QgOiBzdGVwLnRvXG4gICAgbGV0IHJlcGxhY2VkID0gbmV3IFJlcGxhY2VkUmFuZ2Uoc3RlcC5mcm9tLCBzdGVwLnRvLCBzdGVwLmZyb20sIGVuZCwgcm9vdFBvcywgcm9vdFBvcylcbiAgICByZXR1cm4gbmV3IFRyYW5zZm9ybVJlc3VsdChvdXQsIG5ldyBQb3NNYXAobW92ZWQsIFtyZXBsYWNlZF0pKVxuICB9LFxuICBpbnZlcnQoc3RlcCwgb2xkRG9jLCBtYXApIHtcbiAgICBsZXQgZGVwdGggPSBzdGVwLnBvcy5kZXB0aFxuICAgIGxldCBiZXR3ZWVuID0gc2xpY2VCZXR3ZWVuKG9sZERvYywgc3RlcC5mcm9tLCBzdGVwLnRvLCBmYWxzZSlcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRlcHRoOyBpKyspIGJldHdlZW4gPSBiZXR3ZWVuLmNvbnRlbnRbMF1cbiAgICByZXR1cm4gbmV3IFN0ZXAoXCJyZXBsYWNlXCIsIHN0ZXAuZnJvbSwgbWFwLm1hcChzdGVwLnRvKS5wb3MsIHN0ZXAuZnJvbS5zaG9ydGVuKGRlcHRoKSwge1xuICAgICAgbm9kZXM6IGJldHdlZW4uY29udGVudCxcbiAgICAgIG9wZW5MZWZ0OiBzdGVwLmZyb20uZGVwdGggLSBkZXB0aCxcbiAgICAgIG9wZW5SaWdodDogc3RlcC50by5kZXB0aCAtIGRlcHRoXG4gICAgfSlcbiAgfSxcbiAgcGFyYW1Ub0pTT04ocGFyYW0pIHtcbiAgICByZXR1cm4gcGFyYW0gJiYge25vZGVzOiBwYXJhbS5ub2RlcyAmJiBwYXJhbS5ub2Rlcy5tYXAobiA9PiBuLnRvSlNPTigpKSxcbiAgICAgICAgICAgICAgICAgICAgIG9wZW5MZWZ0OiBwYXJhbS5vcGVuTGVmdCwgb3BlblJpZ2h0OiBwYXJhbS5vcGVuUmlnaHR9XG4gIH0sXG4gIHBhcmFtRnJvbUpTT04oanNvbikge1xuICAgIHJldHVybiBqc29uICYmIHtub2RlczoganNvbi5ub2RlcyAmJiBqc29uLm5vZGVzLm1hcChOb2RlLmZyb21KU09OKSxcbiAgICAgICAgICAgICAgICAgICAgb3BlbkxlZnQ6IGpzb24ub3BlbkxlZnQsIG9wZW5SaWdodDoganNvbi5vcGVuUmlnaHR9XG4gIH1cbn0pXG5cbmZ1bmN0aW9uIGJ1aWxkSW5zZXJ0ZWQobm9kZXNMZWZ0LCBzb3VyY2UsIHN0YXJ0LCBlbmQpIHtcbiAgbGV0IHNsaWNlZCA9IHNsaWNlQmV0d2Vlbihzb3VyY2UsIHN0YXJ0LCBlbmQsIGZhbHNlKVxuICBsZXQgbm9kZXNSaWdodCA9IFtdXG4gIGZvciAobGV0IG5vZGUgPSBzbGljZWQsIGkgPSAwOyBpIDw9IHN0YXJ0LnBhdGgubGVuZ3RoOyBpKyssIG5vZGUgPSBub2RlLmNvbnRlbnRbMF0pXG4gICAgbm9kZXNSaWdodC5wdXNoKG5vZGUpXG4gIGxldCBzYW1lID0gc2FtZVBhdGhEZXB0aChzdGFydCwgZW5kKVxuICBsZXQgc2VhcmNoTGVmdCA9IG5vZGVzTGVmdC5sZW5ndGggLSAxLCBzZWFyY2hSaWdodCA9IG5vZGVzUmlnaHQubGVuZ3RoIC0gMVxuICBsZXQgcmVzdWx0ID0gbnVsbFxuXG4gIGxldCBpbm5lciA9IG5vZGVzUmlnaHRbc2VhcmNoUmlnaHRdXG4gIGlmIChpbm5lci50eXBlLmJsb2NrICYmIGlubmVyLnNpemUgJiYgbm9kZXNMZWZ0W3NlYXJjaExlZnRdLnR5cGUuYmxvY2spIHtcbiAgICByZXN1bHQgPSBub2Rlc0xlZnRbc2VhcmNoTGVmdC0tXS5jb3B5KGlubmVyLmNvbnRlbnQpXG4gICAgbm9kZXNSaWdodFstLXNlYXJjaFJpZ2h0XS5jb250ZW50LnNoaWZ0KClcbiAgfVxuXG4gIGZvciAoOzspIHtcbiAgICBsZXQgbm9kZSA9IG5vZGVzUmlnaHRbc2VhcmNoUmlnaHRdLCB0eXBlID0gbm9kZS50eXBlLCBtYXRjaGVkID0gbnVsbFxuICAgIGxldCBvdXRzaWRlID0gc2VhcmNoUmlnaHQgPD0gc2FtZVxuICAgIGZvciAobGV0IGkgPSBzZWFyY2hMZWZ0OyBpID49IDA7IGktLSkge1xuICAgICAgbGV0IGxlZnQgPSBub2Rlc0xlZnRbaV1cbiAgICAgIGlmIChvdXRzaWRlID8gbGVmdC50eXBlLmNvbnRhaW5zID09IHR5cGUuY29udGFpbnMgOiBsZWZ0LnR5cGUgPT0gdHlwZSkge1xuICAgICAgICBtYXRjaGVkID0gaVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobWF0Y2hlZCAhPSBudWxsKSB7XG4gICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICByZXN1bHQgPSBub2Rlc0xlZnRbbWF0Y2hlZF0uY29weShub2RlLmNvbnRlbnQpXG4gICAgICAgIHNlYXJjaExlZnQgPSBtYXRjaGVkIC0gMVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2hpbGUgKHNlYXJjaExlZnQgPj0gbWF0Y2hlZClcbiAgICAgICAgICByZXN1bHQgPSBub2Rlc0xlZnRbc2VhcmNoTGVmdC0tXS5jb3B5KFtyZXN1bHRdKVxuICAgICAgICByZXN1bHQucHVzaEZyb20obm9kZSlcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG1hdGNoZWQgIT0gbnVsbCB8fCBub2RlLmNvbnRlbnQubGVuZ3RoID09IDApIHtcbiAgICAgIGlmIChvdXRzaWRlKSBicmVha1xuICAgICAgaWYgKHNlYXJjaFJpZ2h0KSBub2Rlc1JpZ2h0W3NlYXJjaFJpZ2h0IC0gMV0uY29udGVudC5zaGlmdCgpXG4gICAgfVxuICAgIHNlYXJjaFJpZ2h0LS1cbiAgfVxuXG4gIGxldCByZXBsID0ge25vZGVzOiByZXN1bHQgPyByZXN1bHQuY29udGVudCA6IFtdLFxuICAgICAgICAgICAgICBvcGVuTGVmdDogc3RhcnQuZGVwdGggLSBzZWFyY2hSaWdodCxcbiAgICAgICAgICAgICAgb3BlblJpZ2h0OiBlbmQuZGVwdGggLSBzZWFyY2hSaWdodH1cbiAgcmV0dXJuIHtyZXBsLCBkZXB0aDogc2VhcmNoTGVmdCArIDF9XG59XG5cbmZ1bmN0aW9uIG1vdmVUZXh0KHRyLCBkb2MsIGJlZm9yZSwgYWZ0ZXIpIHtcbiAgbGV0IHJvb3QgPSBzYW1lUGF0aERlcHRoKGJlZm9yZSwgYWZ0ZXIpXG4gIGxldCBjdXRBdCA9IGFmdGVyLnNob3J0ZW4obnVsbCwgMSlcbiAgd2hpbGUgKGN1dEF0LnBhdGgubGVuZ3RoID4gcm9vdCAmJiBkb2MucGF0aChjdXRBdC5wYXRoKS5jb250ZW50Lmxlbmd0aCA9PSAxKVxuICAgIGN1dEF0ID0gY3V0QXQuc2hvcnRlbihudWxsLCAxKVxuICB0ci5zcGxpdChjdXRBdCwgY3V0QXQucGF0aC5sZW5ndGggLSByb290KVxuICBsZXQgc3RhcnQgPSBhZnRlciwgZW5kID0gbmV3IFBvcyhzdGFydC5wYXRoLCBkb2MucGF0aChzdGFydC5wYXRoKS5tYXhPZmZzZXQpXG4gIGxldCBwYXJlbnQgPSBkb2MucGF0aChzdGFydC5wYXRoLnNsaWNlKDAsIHJvb3QpKVxuICBsZXQgd2FudGVkID0gcGFyZW50LnBhdGhOb2RlcyhiZWZvcmUucGF0aC5zbGljZShyb290KSlcbiAgbGV0IGV4aXN0aW5nID0gcGFyZW50LnBhdGhOb2RlcyhzdGFydC5wYXRoLnNsaWNlKHJvb3QpKVxuICB3aGlsZSAod2FudGVkLmxlbmd0aCAmJiBleGlzdGluZy5sZW5ndGggJiYgd2FudGVkWzBdLnNhbWVNYXJrdXAoZXhpc3RpbmdbMF0pKSB7XG4gICAgd2FudGVkLnNoaWZ0KClcbiAgICBleGlzdGluZy5zaGlmdCgpXG4gIH1cbiAgaWYgKGV4aXN0aW5nLmxlbmd0aCB8fCB3YW50ZWQubGVuZ3RoKVxuICAgIHRyLnN0ZXAoXCJhbmNlc3RvclwiLCBzdGFydCwgZW5kLCBudWxsLCB7XG4gICAgICBkZXB0aDogZXhpc3RpbmcubGVuZ3RoLFxuICAgICAgd3JhcHBlcnM6IHdhbnRlZC5tYXAobiA9PiBuLmNvcHkoKSlcbiAgICB9KVxuICBmb3IgKGxldCBpID0gcm9vdDsgaSA8IGJlZm9yZS5wYXRoLmxlbmd0aDsgaSsrKVxuICAgIHRyLmpvaW4oYmVmb3JlLnNob3J0ZW4oaSwgMSkpXG59XG5cblRyYW5zZm9ybS5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24oZnJvbSwgdG8pIHtcbiAgcmV0dXJuIHRoaXMucmVwbGFjZShmcm9tLCB0bylcbn1cblxuVHJhbnNmb3JtLnByb3RvdHlwZS5yZXBsYWNlID0gZnVuY3Rpb24oZnJvbSwgdG8sIHNvdXJjZSwgc3RhcnQsIGVuZCkge1xuICBsZXQgcmVwbCwgZGVwdGgsIGRvYyA9IHRoaXMuZG9jLCBtYXhEZXB0aCA9IHNhbWVQYXRoRGVwdGgoZnJvbSwgdG8pXG4gIGlmIChzb3VyY2UpIHtcbiAgICA7KHtyZXBsLCBkZXB0aH0gPSBidWlsZEluc2VydGVkKGRvYy5wYXRoTm9kZXMoZnJvbS5wYXRoKSwgc291cmNlLCBzdGFydCwgZW5kKSlcbiAgICB3aGlsZSAoZGVwdGggPiBtYXhEZXB0aCkge1xuICAgICAgaWYgKHJlcGwubm9kZXMubGVuZ3RoKVxuICAgICAgICByZXBsID0ge25vZGVzOiBbZG9jLnBhdGgoZnJvbS5wYXRoLnNsaWNlKDAsIGRlcHRoKSkuY29weShyZXBsLm5vZGVzKV0sXG4gICAgICAgICAgICAgICAgb3BlbkxlZnQ6IHJlcGwub3BlbkxlZnQgKyAxLCBvcGVuUmlnaHQ6IHJlcGwub3BlblJpZ2h0ICsgMX1cbiAgICAgIGRlcHRoLS1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmVwbCA9IG51bGxSZXBsXG4gICAgZGVwdGggPSBtYXhEZXB0aFxuICB9XG4gIGxldCByb290ID0gZnJvbS5zaG9ydGVuKGRlcHRoKSwgZG9jQWZ0ZXIgPSBkb2MsIGFmdGVyID0gdG9cbiAgaWYgKHJlcGwubm9kZXMubGVuZ3RoIHx8IHJlcGxhY2VIYXNFZmZlY3QoZG9jLCBmcm9tLCB0bykpIHtcbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5zdGVwKFwicmVwbGFjZVwiLCBmcm9tLCB0bywgcm9vdCwgcmVwbClcbiAgICBkb2NBZnRlciA9IHJlc3VsdC5kb2NcbiAgICBhZnRlciA9IHJlc3VsdC5tYXAubWFwKHRvKS5wb3NcbiAgfVxuXG4gIC8vIElmIG5vIHRleHQgbm9kZXMgYmVmb3JlIG9yIGFmdGVyIGVuZCBvZiByZXBsYWNlbWVudCwgZG9uJ3QgZ2x1ZSB0ZXh0XG4gIGlmICghZG9jLnBhdGgodG8ucGF0aCkudHlwZS5ibG9jaykgcmV0dXJuIHRoaXNcbiAgaWYgKCEocmVwbC5ub2Rlcy5sZW5ndGggPyBzb3VyY2UucGF0aChlbmQucGF0aCkudHlwZS5ibG9jayA6IGRvYy5wYXRoKGZyb20ucGF0aCkudHlwZS5ibG9jaykpIHJldHVybiB0aGlzXG5cbiAgbGV0IG5vZGVzQWZ0ZXIgPSBkb2MucGF0aChyb290LnBhdGgpLnBhdGhOb2Rlcyh0by5wYXRoLnNsaWNlKGRlcHRoKSkuc2xpY2UoMSlcbiAgbGV0IG5vZGVzQmVmb3JlXG4gIGlmIChyZXBsLm5vZGVzLmxlbmd0aCkge1xuICAgIGxldCBpbnNlcnRlZCA9IHJlcGwubm9kZXNcbiAgICBub2Rlc0JlZm9yZSA9IFtdXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXBsLm9wZW5SaWdodDsgaSsrKSB7XG4gICAgICBsZXQgbGFzdCA9IGluc2VydGVkW2luc2VydGVkLmxlbmd0aCAtIDFdXG4gICAgICBub2Rlc0JlZm9yZS5wdXNoKGxhc3QpXG4gICAgICBpbnNlcnRlZCA9IGxhc3QuY29udGVudFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBub2Rlc0JlZm9yZSA9IGRvYy5wYXRoKHJvb3QucGF0aCkucGF0aE5vZGVzKGZyb20ucGF0aC5zbGljZShkZXB0aCkpLnNsaWNlKDEpXG4gIH1cbiAgaWYgKG5vZGVzQWZ0ZXIubGVuZ3RoICE9IG5vZGVzQmVmb3JlLmxlbmd0aCB8fFxuICAgICAgIW5vZGVzQWZ0ZXIuZXZlcnkoKG4sIGkpID0+IG4uc2FtZU1hcmt1cChub2Rlc0JlZm9yZVtpXSkpKSB7XG4gICAgbGV0IGJlZm9yZSA9IFBvcy5iZWZvcmUoZG9jQWZ0ZXIsIGFmdGVyLnNob3J0ZW4obnVsbCwgMCkpXG4gICAgbW92ZVRleHQodGhpcywgZG9jQWZ0ZXIsIGJlZm9yZSwgYWZ0ZXIpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuVHJhbnNmb3JtLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbihwb3MsIG5vZGVzKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShub2RlcykpIG5vZGVzID0gW25vZGVzXVxuICB0aGlzLnN0ZXAoXCJyZXBsYWNlXCIsIHBvcywgcG9zLCBwb3MsXG4gICAgICAgICAgICB7bm9kZXM6IG5vZGVzLCBvcGVuTGVmdDogMCwgb3BlblJpZ2h0OiAwfSlcbiAgcmV0dXJuIHRoaXNcbn1cblxuVHJhbnNmb3JtLnByb3RvdHlwZS5pbnNlcnRJbmxpbmUgPSBmdW5jdGlvbihwb3MsIG5vZGVzKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShub2RlcykpIG5vZGVzID0gW25vZGVzXVxuICBsZXQgc3R5bGVzID0gc3BhblN0eWxlc0F0KHRoaXMuZG9jLCBwb3MpXG4gIG5vZGVzID0gbm9kZXMubWFwKG4gPT4gbmV3IFNwYW4obi50eXBlLCBuLmF0dHJzLCBzdHlsZXMsIG4udGV4dCkpXG4gIHJldHVybiB0aGlzLmluc2VydChwb3MsIG5vZGVzKVxufVxuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLmluc2VydFRleHQgPSBmdW5jdGlvbihwb3MsIHRleHQpIHtcbiAgcmV0dXJuIHRoaXMuaW5zZXJ0SW5saW5lKHBvcywgU3Bhbi50ZXh0KHRleHQpKVxufVxuIiwiaW1wb3J0IHtQb3MsIE5vZGUsIHNwbGl0U3BhbnNBdH0gZnJvbSBcIi4uL21vZGVsXCJcblxuaW1wb3J0IHtUcmFuc2Zvcm1SZXN1bHQsIFRyYW5zZm9ybX0gZnJvbSBcIi4vdHJhbnNmb3JtXCJcbmltcG9ydCB7ZGVmaW5lU3RlcCwgU3RlcH0gZnJvbSBcIi4vc3RlcFwiXG5pbXBvcnQge2NvcHlUb30gZnJvbSBcIi4vdHJlZVwiXG5pbXBvcnQge1Bvc01hcCwgTW92ZWRSYW5nZSwgUmVwbGFjZWRSYW5nZX0gZnJvbSBcIi4vbWFwXCJcblxuZGVmaW5lU3RlcChcInNwbGl0XCIsIHtcbiAgYXBwbHkoZG9jLCBzdGVwKSB7XG4gICAgbGV0IHBvcyA9IHN0ZXAucG9zXG4gICAgaWYgKHBvcy5kZXB0aCA9PSAwKSByZXR1cm4gbnVsbFxuICAgIGxldCBjb3B5ID0gY29weVRvKGRvYywgcG9zLnBhdGgpXG4gICAgbGV0IGxhc3QgPSBwb3MuZGVwdGggLSAxLCBwYXJlbnRQYXRoID0gcG9zLnBhdGguc2xpY2UoMCwgbGFzdClcbiAgICBsZXQgb2Zmc2V0ID0gcG9zLnBhdGhbbGFzdF0sIHBhcmVudCA9IGNvcHkucGF0aChwYXJlbnRQYXRoKVxuICAgIGxldCB0YXJnZXQgPSBwYXJlbnQuY29udGVudFtvZmZzZXRdLCB0YXJnZXRTaXplID0gdGFyZ2V0Lm1heE9mZnNldFxuICAgIGxldCBzcGxpdEF0ID0gcG9zLm9mZnNldFxuICAgIGlmICh0YXJnZXQudHlwZS5ibG9jaylcbiAgICAgIHNwbGl0QXQgPSBzcGxpdFNwYW5zQXQodGFyZ2V0LCBwb3Mub2Zmc2V0KS5vZmZzZXRcbiAgICBsZXQgYWZ0ZXIgPSAoc3RlcC5wYXJhbSB8fCB0YXJnZXQpLmNvcHkodGFyZ2V0LmNvbnRlbnQuc2xpY2Uoc3BsaXRBdCkpXG4gICAgdGFyZ2V0LmNvbnRlbnQubGVuZ3RoID0gc3BsaXRBdFxuICAgIHBhcmVudC5jb250ZW50LnNwbGljZShvZmZzZXQgKyAxLCAwLCBhZnRlcilcblxuICAgIGxldCBkZXN0ID0gbmV3IFBvcyhwYXJlbnRQYXRoLmNvbmNhdChvZmZzZXQgKyAxKSwgMClcbiAgICBsZXQgbWFwID0gbmV3IFBvc01hcChbbmV3IE1vdmVkUmFuZ2UocG9zLCB0YXJnZXRTaXplIC0gcG9zLm9mZnNldCwgZGVzdCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBNb3ZlZFJhbmdlKG5ldyBQb3MocGFyZW50UGF0aCwgb2Zmc2V0ICsgMSksIHBhcmVudC5jb250ZW50Lmxlbmd0aCAtIDIgLSBvZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBQb3MocGFyZW50UGF0aCwgb2Zmc2V0ICsgMikpXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICBbbmV3IFJlcGxhY2VkUmFuZ2UocG9zLCBwb3MsIHBvcywgZGVzdCwgcG9zLCBwb3Muc2hvcnRlbihudWxsLCAxKSldKVxuICAgIHJldHVybiBuZXcgVHJhbnNmb3JtUmVzdWx0KGNvcHksIG1hcClcbiAgfSxcbiAgaW52ZXJ0KHN0ZXAsIF9vbGREb2MsIG1hcCkge1xuICAgIHJldHVybiBuZXcgU3RlcChcImpvaW5cIiwgc3RlcC5wb3MsIG1hcC5tYXAoc3RlcC5wb3MpLnBvcylcbiAgfSxcbiAgcGFyYW1Ub0pTT04ocGFyYW0pIHtcbiAgICByZXR1cm4gcGFyYW0gJiYgcGFyYW0udG9KU09OKClcbiAgfSxcbiAgcGFyYW1Gcm9tSlNPTihqc29uKSB7XG4gICAgcmV0dXJuIGpzb24gJiYgTm9kZS5mcm9tSlNPTihqc29uKVxuICB9XG59KVxuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLnNwbGl0ID0gZnVuY3Rpb24ocG9zLCBkZXB0aCA9IDEsIG5vZGVBZnRlciA9IG51bGwpIHtcbiAgaWYgKGRlcHRoID09IDApIHJldHVybiB0aGlzXG4gIGZvciAobGV0IGkgPSAwOzsgaSsrKSB7XG4gICAgdGhpcy5zdGVwKFwic3BsaXRcIiwgbnVsbCwgbnVsbCwgcG9zLCBub2RlQWZ0ZXIpXG4gICAgaWYgKGkgPT0gZGVwdGggLSAxKSByZXR1cm4gdGhpc1xuICAgIG5vZGVBZnRlciA9IG51bGxcbiAgICBwb3MgPSBwb3Muc2hvcnRlbihudWxsLCAxKVxuICB9XG59XG4iLCJpbXBvcnQge1Bvc30gZnJvbSBcIi4uL21vZGVsXCJcblxuZXhwb3J0IGNsYXNzIFN0ZXAge1xuICBjb25zdHJ1Y3RvcihuYW1lLCBmcm9tLCB0bywgcG9zLCBwYXJhbSA9IG51bGwpIHtcbiAgICBpZiAoIShuYW1lIGluIHN0ZXBzKSkgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBzdGVwIHR5cGU6IFwiICsgbmFtZSlcbiAgICB0aGlzLm5hbWUgPSBuYW1lXG4gICAgdGhpcy5mcm9tID0gZnJvbVxuICAgIHRoaXMudG8gPSB0b1xuICAgIHRoaXMucG9zID0gcG9zXG4gICAgdGhpcy5wYXJhbSA9IHBhcmFtXG4gIH1cblxuICB0b0pTT04oKSB7XG4gICAgbGV0IGltcGwgPSBzdGVwc1t0aGlzLm5hbWVdXG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgIGZyb206IHRoaXMuZnJvbSxcbiAgICAgIHRvOiB0aGlzLnRvLFxuICAgICAgcG9zOiB0aGlzLnBvcyxcbiAgICAgIHBhcmFtOiBpbXBsLnBhcmFtVG9KU09OID8gaW1wbC5wYXJhbVRvSlNPTih0aGlzLnBhcmFtKSA6IHRoaXMucGFyYW1cbiAgICB9XG4gIH1cblxuICBzdGF0aWMgZnJvbUpTT04oanNvbikge1xuICAgIGxldCBpbXBsID0gc3RlcHNbanNvbi5uYW1lXVxuICAgIHJldHVybiBuZXcgU3RlcChcbiAgICAgIGpzb24ubmFtZSxcbiAgICAgIGpzb24uZnJvbSAmJiBQb3MuZnJvbUpTT04oanNvbi5mcm9tKSxcbiAgICAgIGpzb24udG8gJiYgUG9zLmZyb21KU09OKGpzb24udG8pLFxuICAgICAganNvbi5wb3MgJiYgUG9zLmZyb21KU09OKGpzb24ucG9zKSxcbiAgICAgIGltcGwucGFyYW1Gcm9tSlNPTiA/IGltcGwucGFyYW1Gcm9tSlNPTihqc29uLnBhcmFtKSA6IGpzb24ucGFyYW0pXG4gIH1cbn1cblxuY29uc3Qgc3RlcHMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cbmV4cG9ydCBmdW5jdGlvbiBkZWZpbmVTdGVwKG5hbWUsIGltcGwpIHsgc3RlcHNbbmFtZV0gPSBpbXBsIH1cblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5U3RlcChkb2MsIHN0ZXApIHtcbiAgaWYgKCEoc3RlcC5uYW1lIGluIHN0ZXBzKSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmRlZmluZWQgdHJhbnNmb3JtIFwiICsgc3RlcC5uYW1lKVxuXG4gIHJldHVybiBzdGVwc1tzdGVwLm5hbWVdLmFwcGx5KGRvYywgc3RlcClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludmVydFN0ZXAoc3RlcCwgb2xkRG9jLCBtYXApIHtcbiAgcmV0dXJuIHN0ZXBzW3N0ZXAubmFtZV0uaW52ZXJ0KHN0ZXAsIG9sZERvYywgbWFwKVxufVxuXG4iLCJpbXBvcnQge3N0eWxlLCBTcGFuLCBub2RlVHlwZXMsIFBvc30gZnJvbSBcIi4uL21vZGVsXCJcblxuaW1wb3J0IHtUcmFuc2Zvcm1SZXN1bHQsIFRyYW5zZm9ybX0gZnJvbSBcIi4vdHJhbnNmb3JtXCJcbmltcG9ydCB7ZGVmaW5lU3RlcCwgU3RlcH0gZnJvbSBcIi4vc3RlcFwiXG5pbXBvcnQge2NvcHlJbmxpbmUsIGNvcHlTdHJ1Y3R1cmUsIGZvclNwYW5zQmV0d2Vlbn0gZnJvbSBcIi4vdHJlZVwiXG5cbmRlZmluZVN0ZXAoXCJhZGRTdHlsZVwiLCB7XG4gIGFwcGx5KGRvYywgc3RlcCkge1xuICAgIHJldHVybiBuZXcgVHJhbnNmb3JtUmVzdWx0KGNvcHlTdHJ1Y3R1cmUoZG9jLCBzdGVwLmZyb20sIHN0ZXAudG8sIChub2RlLCBmcm9tLCB0bykgPT4ge1xuICAgICAgaWYgKG5vZGUudHlwZS5wbGFpblRleHQpIHJldHVybiBub2RlXG4gICAgICByZXR1cm4gY29weUlubGluZShub2RlLCBmcm9tLCB0bywgbm9kZSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgU3Bhbihub2RlLnR5cGUsIG5vZGUuYXR0cnMsIHN0eWxlLmFkZChub2RlLnN0eWxlcywgc3RlcC5wYXJhbSksIG5vZGUudGV4dClcbiAgICAgIH0pXG4gICAgfSkpXG4gIH0sXG4gIGludmVydChzdGVwLCBfb2xkRG9jLCBtYXApIHtcbiAgICByZXR1cm4gbmV3IFN0ZXAoXCJyZW1vdmVTdHlsZVwiLCBzdGVwLmZyb20sIG1hcC5tYXAoc3RlcC50bykucG9zLCBudWxsLCBzdGVwLnBhcmFtKVxuICB9XG59KVxuXG5cblRyYW5zZm9ybS5wcm90b3R5cGUuYWRkU3R5bGUgPSBmdW5jdGlvbihmcm9tLCB0bywgc3QpIHtcbiAgbGV0IHJlbW92ZWQgPSBbXSwgYWRkZWQgPSBbXSwgcmVtb3ZpbmcgPSBudWxsLCBhZGRpbmcgPSBudWxsXG4gIGZvclNwYW5zQmV0d2Vlbih0aGlzLmRvYywgZnJvbSwgdG8sIChzcGFuLCBwYXRoLCBzdGFydCwgZW5kKSA9PiB7XG4gICAgaWYgKHN0eWxlLmNvbnRhaW5zKHNwYW4uc3R5bGVzLCBzdCkpIHtcbiAgICAgIGFkZGluZyA9IHJlbW92aW5nID0gbnVsbFxuICAgIH0gZWxzZSB7XG4gICAgICBwYXRoID0gcGF0aC5zbGljZSgpXG4gICAgICBsZXQgcm0gPSBzdHlsZS5jb250YWluc1R5cGUoc3Bhbi5zdHlsZXMsIHN0LnR5cGUpXG4gICAgICBpZiAocm0pIHtcbiAgICAgICAgaWYgKHJlbW92aW5nICYmIHN0eWxlLnNhbWUocmVtb3ZpbmcucGFyYW0sIHJtKSkge1xuICAgICAgICAgIHJlbW92aW5nLnRvID0gbmV3IFBvcyhwYXRoLCBlbmQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVtb3ZpbmcgPSBuZXcgU3RlcChcInJlbW92ZVN0eWxlXCIsIG5ldyBQb3MocGF0aCwgc3RhcnQpLCBuZXcgUG9zKHBhdGgsIGVuZCksIG51bGwsIHJtKVxuICAgICAgICAgIHJlbW92ZWQucHVzaChyZW1vdmluZylcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChyZW1vdmluZykge1xuICAgICAgICByZW1vdmluZyA9IG51bGxcbiAgICAgIH1cbiAgICAgIGlmIChhZGRpbmcpIHtcbiAgICAgICAgYWRkaW5nLnRvID0gbmV3IFBvcyhwYXRoLCBlbmQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhZGRpbmcgPSBuZXcgU3RlcChcImFkZFN0eWxlXCIsIG5ldyBQb3MocGF0aCwgc3RhcnQpLCBuZXcgUG9zKHBhdGgsIGVuZCksIG51bGwsIHN0KVxuICAgICAgICBhZGRlZC5wdXNoKGFkZGluZylcbiAgICAgIH1cbiAgICB9XG4gIH0pXG4gIHJlbW92ZWQuZm9yRWFjaChzID0+IHRoaXMuc3RlcChzKSlcbiAgYWRkZWQuZm9yRWFjaChzID0+IHRoaXMuc3RlcChzKSlcbiAgcmV0dXJuIHRoaXNcbn1cblxuZGVmaW5lU3RlcChcInJlbW92ZVN0eWxlXCIsIHtcbiAgYXBwbHkoZG9jLCBzdGVwKSB7XG4gICAgcmV0dXJuIG5ldyBUcmFuc2Zvcm1SZXN1bHQoY29weVN0cnVjdHVyZShkb2MsIHN0ZXAuZnJvbSwgc3RlcC50bywgKG5vZGUsIGZyb20sIHRvKSA9PiB7XG4gICAgICByZXR1cm4gY29weUlubGluZShub2RlLCBmcm9tLCB0bywgbm9kZSA9PiB7XG4gICAgICAgIGxldCBzdHlsZXMgPSBzdHlsZS5yZW1vdmUobm9kZS5zdHlsZXMsIHN0ZXAucGFyYW0pXG4gICAgICAgIHJldHVybiBuZXcgU3Bhbihub2RlLnR5cGUsIG5vZGUuYXR0cnMsIHN0eWxlcywgbm9kZS50ZXh0KVxuICAgICAgfSlcbiAgICB9KSlcbiAgfSxcbiAgaW52ZXJ0KHN0ZXAsIF9vbGREb2MsIG1hcCkge1xuICAgIHJldHVybiBuZXcgU3RlcChcImFkZFN0eWxlXCIsIHN0ZXAuZnJvbSwgbWFwLm1hcChzdGVwLnRvKS5wb3MsIG51bGwsIHN0ZXAucGFyYW0pXG4gIH1cbn0pXG5cblRyYW5zZm9ybS5wcm90b3R5cGUucmVtb3ZlU3R5bGUgPSBmdW5jdGlvbihmcm9tLCB0bywgc3QgPSBudWxsKSB7XG4gIGxldCBtYXRjaGVkID0gW10sIHN0ZXAgPSAwXG4gIGZvclNwYW5zQmV0d2Vlbih0aGlzLmRvYywgZnJvbSwgdG8sIChzcGFuLCBwYXRoLCBzdGFydCwgZW5kKSA9PiB7XG4gICAgc3RlcCsrXG4gICAgbGV0IHRvUmVtb3ZlID0gbnVsbFxuICAgIGlmICh0eXBlb2Ygc3QgPT0gXCJzdHJpbmdcIikge1xuICAgICAgbGV0IGZvdW5kID0gc3R5bGUuY29udGFpbnNUeXBlKHNwYW4uc3R5bGVzLCBzdClcbiAgICAgIGlmIChmb3VuZCkgdG9SZW1vdmUgPSBbZm91bmRdXG4gICAgfSBlbHNlIGlmIChzdCkge1xuICAgICAgaWYgKHN0eWxlLmNvbnRhaW5zKHNwYW4uc3R5bGVzLCBzdCkpIHRvUmVtb3ZlID0gW3N0XVxuICAgIH0gZWxzZSB7XG4gICAgICB0b1JlbW92ZSA9IHNwYW4uc3R5bGVzXG4gICAgfVxuICAgIGlmICh0b1JlbW92ZSAmJiB0b1JlbW92ZS5sZW5ndGgpIHtcbiAgICAgIHBhdGggPSBwYXRoLnNsaWNlKClcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9SZW1vdmUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IHJtID0gdG9SZW1vdmVbaV0sIGZvdW5kXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbWF0Y2hlZC5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGxldCBtID0gbWF0Y2hlZFtqXVxuICAgICAgICAgIGlmIChtLnN0ZXAgPT0gc3RlcCAtIDEgJiYgc3R5bGUuc2FtZShybSwgbWF0Y2hlZFtqXS5zdHlsZSkpIGZvdW5kID0gbVxuICAgICAgICB9XG4gICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgIGZvdW5kLnRvID0gbmV3IFBvcyhwYXRoLCBlbmQpXG4gICAgICAgICAgZm91bmQuc3RlcCA9IHN0ZXBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYXRjaGVkLnB1c2goe3N0eWxlOiBybSwgZnJvbTogbmV3IFBvcyhwYXRoLCBzdGFydCksIHRvOiBuZXcgUG9zKHBhdGgsIGVuZCksIHN0ZXA6IHN0ZXB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KVxuICBtYXRjaGVkLmZvckVhY2gobSA9PiB0aGlzLnN0ZXAoXCJyZW1vdmVTdHlsZVwiLCBtLmZyb20sIG0udG8sIG51bGwsIG0uc3R5bGUpKVxuICByZXR1cm4gdGhpc1xufVxuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLmNsZWFyTWFya3VwID0gZnVuY3Rpb24oZnJvbSwgdG8pIHtcbiAgbGV0IHN0ZXBzID0gW11cbiAgZm9yU3BhbnNCZXR3ZWVuKHRoaXMuZG9jLCBmcm9tLCB0bywgKHNwYW4sIHBhdGgsIHN0YXJ0LCBlbmQpID0+IHtcbiAgICBpZiAoc3Bhbi50eXBlICE9IG5vZGVUeXBlcy50ZXh0KSB7XG4gICAgICBwYXRoID0gcGF0aC5zbGljZSgpXG4gICAgICBsZXQgZnJvbSA9IG5ldyBQb3MocGF0aCwgc3RhcnQpXG4gICAgICBzdGVwcy51bnNoaWZ0KG5ldyBTdGVwKFwicmVwbGFjZVwiLCBmcm9tLCBuZXcgUG9zKHBhdGgsIGVuZCksIGZyb20pKVxuICAgIH1cbiAgfSlcbiAgdGhpcy5yZW1vdmVTdHlsZShmcm9tLnRvKVxuICBzdGVwcy5mb3JFYWNoKHMgPT4gdGhpcy5zdGVwKHMpKVxuICByZXR1cm4gdGhpc1xufVxuIiwiaW1wb3J0IHtTdGVwLCBhcHBseVN0ZXB9IGZyb20gXCIuL3N0ZXBcIlxuaW1wb3J0IHtudWxsTWFwLCBNYXBSZXN1bHR9IGZyb20gXCIuL21hcFwiXG5cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm1SZXN1bHQge1xuICBjb25zdHJ1Y3Rvcihkb2MsIG1hcCA9IG51bGxNYXApIHtcbiAgICB0aGlzLmRvYyA9IGRvY1xuICAgIHRoaXMubWFwID0gbWFwXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybSB7XG4gIGNvbnN0cnVjdG9yKGRvYykge1xuICAgIHRoaXMuZG9jcyA9IFtkb2NdXG4gICAgdGhpcy5zdGVwcyA9IFtdXG4gICAgdGhpcy5tYXBzID0gW11cbiAgfVxuXG4gIGdldCBkb2MoKSB7XG4gICAgcmV0dXJuIHRoaXMuZG9jc1t0aGlzLmRvY3MubGVuZ3RoIC0gMV1cbiAgfVxuXG4gIGdldCBiZWZvcmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZG9jc1swXVxuICB9XG5cbiAgc3RlcChzdGVwLCBmcm9tLCB0bywgcG9zLCBwYXJhbSkge1xuICAgIGlmICh0eXBlb2Ygc3RlcCA9PSBcInN0cmluZ1wiKVxuICAgICAgc3RlcCA9IG5ldyBTdGVwKHN0ZXAsIGZyb20sIHRvLCBwb3MsIHBhcmFtKVxuICAgIGxldCByZXN1bHQgPSBhcHBseVN0ZXAodGhpcy5kb2MsIHN0ZXApXG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgdGhpcy5zdGVwcy5wdXNoKHN0ZXApXG4gICAgICB0aGlzLm1hcHMucHVzaChyZXN1bHQubWFwKVxuICAgICAgdGhpcy5kb2NzLnB1c2gocmVzdWx0LmRvYylcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbiAgbWFwKHBvcywgYmlhcykge1xuICAgIGxldCBkZWxldGVkID0gZmFsc2VcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubWFwcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IHJlc3VsdCA9IHRoaXMubWFwc1tpXS5tYXAocG9zLCBiaWFzKVxuICAgICAgcG9zID0gcmVzdWx0LnBvc1xuICAgICAgaWYgKHJlc3VsdC5kZWxldGVkKSBkZWxldGVkID0gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gbmV3IE1hcFJlc3VsdChwb3MsIGRlbGV0ZWQpXG4gIH1cbn1cbiIsImltcG9ydCB7bm9kZVR5cGVzLCBzdGl0Y2hUZXh0Tm9kZXN9IGZyb20gXCIuLi9tb2RlbFwiXG5cbmV4cG9ydCBmdW5jdGlvbiBjb3B5U3RydWN0dXJlKG5vZGUsIGZyb20sIHRvLCBmLCBkZXB0aCA9IDApIHtcbiAgaWYgKG5vZGUudHlwZS5ibG9jaykge1xuICAgIHJldHVybiBmKG5vZGUsIGZyb20sIHRvKVxuICB9IGVsc2Uge1xuICAgIGxldCBjb3B5ID0gbm9kZS5jb3B5KClcbiAgICBpZiAobm9kZS5jb250ZW50Lmxlbmd0aCA9PSAwKSByZXR1cm4gY29weVxuICAgIGxldCBzdGFydCA9IGZyb20gPyBmcm9tLnBhdGhbZGVwdGhdIDogMFxuICAgIGxldCBlbmQgPSB0byA/IHRvLnBhdGhbZGVwdGhdIDogbm9kZS5jb250ZW50Lmxlbmd0aCAtIDFcbiAgICBjb3B5LnB1c2hGcm9tKG5vZGUsIDAsIHN0YXJ0KVxuICAgIGlmIChzdGFydCA9PSBlbmQpIHtcbiAgICAgIGNvcHkucHVzaChjb3B5U3RydWN0dXJlKG5vZGUuY29udGVudFtzdGFydF0sIGZyb20sIHRvLCBmLCBkZXB0aCArIDEpKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb3B5LnB1c2goY29weVN0cnVjdHVyZShub2RlLmNvbnRlbnRbc3RhcnRdLCBmcm9tLCBudWxsLCBmLCBkZXB0aCArIDEpKVxuICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0ICsgMTsgaSA8IGVuZDsgaSsrKVxuICAgICAgICBjb3B5LnB1c2goY29weVN0cnVjdHVyZShub2RlLmNvbnRlbnRbaV0sIG51bGwsIG51bGwsIGYsIGRlcHRoICsgMSkpXG4gICAgICBjb3B5LnB1c2goY29weVN0cnVjdHVyZShub2RlLmNvbnRlbnRbZW5kXSwgbnVsbCwgdG8sIGYsIGRlcHRoICsgMSkpXG4gICAgfVxuICAgIGNvcHkucHVzaEZyb20obm9kZSwgZW5kICsgMSlcbiAgICByZXR1cm4gY29weVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb3B5SW5saW5lKG5vZGUsIGZyb20sIHRvLCBmKSB7XG4gIGxldCBzdGFydCA9IGZyb20gPyBmcm9tLm9mZnNldCA6IDBcbiAgbGV0IGVuZCA9IHRvID8gdG8ub2Zmc2V0IDogbm9kZS5zaXplXG4gIGxldCBjb3B5ID0gbm9kZS5jb3B5KG5vZGUuc2xpY2UoMCwgc3RhcnQpLmNvbmNhdChub2RlLnNsaWNlKHN0YXJ0LCBlbmQpLm1hcChmKSkuY29uY2F0KG5vZGUuc2xpY2UoZW5kKSkpXG4gIGZvciAobGV0IGkgPSBjb3B5LmNvbnRlbnQubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSlcbiAgICBzdGl0Y2hUZXh0Tm9kZXMoY29weSwgaSlcbiAgcmV0dXJuIGNvcHlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvclNwYW5zQmV0d2Vlbihkb2MsIGZyb20sIHRvLCBmKSB7XG4gIGxldCBwYXRoID0gW11cbiAgZnVuY3Rpb24gc2Nhbihub2RlLCBmcm9tLCB0bykge1xuICAgIGlmIChub2RlLnR5cGUuYmxvY2spIHtcbiAgICAgIGxldCBzdGFydE9mZnNldCA9IGZyb20gPyBmcm9tLm9mZnNldCA6IDBcbiAgICAgIGxldCBlbmRPZmZzZXQgPSB0byA/IHRvLm9mZnNldCA6IG5vZGUuc2l6ZVxuICAgICAgZm9yIChsZXQgaSA9IDAsIG9mZnNldCA9IDA7IG9mZnNldCA8IGVuZE9mZnNldDsgaSsrKSB7XG4gICAgICAgIGxldCBjaGlsZCA9IG5vZGUuY29udGVudFtpXSwgc2l6ZSA9IGNoaWxkLnNpemVcbiAgICAgICAgb2Zmc2V0ICs9IHNpemVcbiAgICAgICAgaWYgKG9mZnNldCA+IHN0YXJ0T2Zmc2V0KVxuICAgICAgICAgIGYoY2hpbGQsIHBhdGgsIE1hdGgubWF4KG9mZnNldCAtIGNoaWxkLnNpemUsIHN0YXJ0T2Zmc2V0KSwgTWF0aC5taW4ob2Zmc2V0LCBlbmRPZmZzZXQpKVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobm9kZS5jb250ZW50Lmxlbmd0aCkge1xuICAgICAgbGV0IHN0YXJ0ID0gZnJvbSA/IGZyb20ucGF0aFtwYXRoLmxlbmd0aF0gOiAwXG4gICAgICBsZXQgZW5kID0gdG8gPyB0by5wYXRoW3BhdGgubGVuZ3RoXSArIDEgOiBub2RlLmNvbnRlbnQubGVuZ3RoXG4gICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgICBwYXRoLnB1c2goaSlcbiAgICAgICAgc2Nhbihub2RlLmNvbnRlbnRbaV0sIGkgPT0gc3RhcnQgJiYgZnJvbSwgaSA9PSBlbmQgLSAxICYmIHRvKVxuICAgICAgICBwYXRoLnBvcCgpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHNjYW4oZG9jLCBmcm9tLCB0bylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvcHlUbyhub2RlLCBwYXRoLCBkZXB0aCA9IDApIHtcbiAgaWYgKGRlcHRoID09IHBhdGgubGVuZ3RoKVxuICAgIHJldHVybiBub2RlLmNvcHkobm9kZS5jb250ZW50LnNsaWNlKCkpXG5cbiAgbGV0IGNvcHkgPSBub2RlLmNvcHkoKVxuICBsZXQgbiA9IHBhdGhbZGVwdGhdXG4gIGNvcHkucHVzaEZyb20obm9kZSwgMCwgbilcbiAgY29weS5wdXNoKGNvcHlUbyhub2RlLmNvbnRlbnRbbl0sIHBhdGgsIGRlcHRoICsgMSkpXG4gIGNvcHkucHVzaEZyb20obm9kZSwgbiArIDEpXG4gIHJldHVybiBjb3B5XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0ZsYXRSYW5nZShmcm9tLCB0bykge1xuICBpZiAoZnJvbS5wYXRoLmxlbmd0aCAhPSB0by5wYXRoLmxlbmd0aCkgcmV0dXJuIGZhbHNlXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZnJvbS5wYXRoLmxlbmd0aDsgaSsrKVxuICAgIGlmIChmcm9tLnBhdGhbaV0gIT0gdG8ucGF0aFtpXSkgcmV0dXJuIGZhbHNlXG4gIHJldHVybiBmcm9tLm9mZnNldCA8PSB0by5vZmZzZXRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdGVkU2libGluZ3MoZG9jLCBmcm9tLCB0bykge1xuICBmb3IgKGxldCBpID0gMCwgbm9kZSA9IGRvYzs7IGkrKykge1xuICAgIGlmIChub2RlLnR5cGUuYmxvY2spXG4gICAgICByZXR1cm4ge3BhdGg6IGZyb20ucGF0aC5zbGljZSgwLCBpIC0gMSksIGZyb206IGZyb20ucGF0aFtpIC0gMV0sIHRvOiBmcm9tLnBhdGhbaSAtIDFdICsgMX1cbiAgICBsZXQgZnJvbUVuZCA9IGkgPT0gZnJvbS5wYXRoLmxlbmd0aCwgdG9FbmQgPSBpID09IHRvLnBhdGgubGVuZ3RoXG4gICAgbGV0IGxlZnQgPSBmcm9tRW5kID8gZnJvbS5vZmZzZXQgOiBmcm9tLnBhdGhbaV1cbiAgICBsZXQgcmlnaHQgPSB0b0VuZCA/IHRvLm9mZnNldCA6IHRvLnBhdGhbaV1cbiAgICBpZiAoZnJvbUVuZCB8fCB0b0VuZCB8fCBsZWZ0ICE9IHJpZ2h0KVxuICAgICAgcmV0dXJuIHtwYXRoOiBmcm9tLnBhdGguc2xpY2UoMCwgaSksIGZyb206IGxlZnQsIHRvOiByaWdodCArICh0b0VuZCA/IDAgOiAxKX1cbiAgICBub2RlID0gbm9kZS5jb250ZW50W2xlZnRdXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJsb2Nrc0JldHdlZW4oZG9jLCBmcm9tLCB0bywgZikge1xuICBsZXQgcGF0aCA9IFtdXG4gIGZ1bmN0aW9uIHNjYW4obm9kZSwgZnJvbSwgdG8pIHtcbiAgICBpZiAobm9kZS50eXBlLmJsb2NrKSB7XG4gICAgICBmKG5vZGUsIHBhdGgpXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBmcm9tTW9yZSA9IGZyb20gJiYgZnJvbS5wYXRoLmxlbmd0aCA+IHBhdGgubGVuZ3RoXG4gICAgICBsZXQgdG9Nb3JlID0gdG8gJiYgdG8ucGF0aC5sZW5ndGggPiBwYXRoLmxlbmd0aFxuICAgICAgbGV0IHN0YXJ0ID0gIWZyb20gPyAwIDogZnJvbU1vcmUgPyBmcm9tLnBhdGhbcGF0aC5sZW5ndGhdIDogZnJvbS5vZmZzZXRcbiAgICAgIGxldCBlbmQgPSAhdG8gPyBub2RlLmNvbnRlbnQubGVuZ3RoIDogdG9Nb3JlID8gdG8ucGF0aFtwYXRoLmxlbmd0aF0gKyAxIDogdG8ub2Zmc2V0XG4gICAgICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgICBwYXRoLnB1c2goaSlcbiAgICAgICAgc2Nhbihub2RlLmNvbnRlbnRbaV0sIGZyb21Nb3JlICYmIGkgPT0gc3RhcnQgPyBmcm9tIDogbnVsbCwgdG9Nb3JlICYmIGkgPT0gZW5kIC0gMSA/IHRvIDogbnVsbClcbiAgICAgICAgcGF0aC5wb3AoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBzY2FuKGRvYywgZnJvbSwgdG8pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1BsYWluVGV4dChub2RlKSB7XG4gIGlmIChub2RlLmNvbnRlbnQubGVuZ3RoID09IDApIHJldHVybiB0cnVlXG4gIGxldCBjaGlsZCA9IG5vZGUuY29udGVudFswXVxuICByZXR1cm4gbm9kZS5jb250ZW50Lmxlbmd0aCA9PSAxICYmIGNoaWxkLnR5cGUgPT0gbm9kZVR5cGVzLnRleHQgJiYgY2hpbGQuc3R5bGVzLmxlbmd0aCA9PSAwXG59XG5cbmZ1bmN0aW9uIGNhbkJlSm9pbmVkKG5vZGUsIG9mZnNldCwgZGVwdGgpIHtcbiAgaWYgKCFkZXB0aCB8fCBvZmZzZXQgPT0gMCB8fCBvZmZzZXQgPT0gbm9kZS5jb250ZW50Lmxlbmd0aCkgcmV0dXJuIGZhbHNlXG4gIGxldCBsZWZ0ID0gbm9kZS5jb250ZW50W29mZnNldCAtIDFdLCByaWdodCA9IG5vZGUuY29udGVudFtvZmZzZXRdXG4gIHJldHVybiBsZWZ0LnNhbWVNYXJrdXAocmlnaHQpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXBsYWNlSGFzRWZmZWN0KGRvYywgZnJvbSwgdG8pIHtcbiAgZm9yIChsZXQgZGVwdGggPSAwLCBub2RlID0gZG9jOzsgZGVwdGgrKykge1xuICAgIGxldCBmcm9tRW5kID0gZGVwdGggPT0gZnJvbS5kZXB0aCwgdG9FbmQgPSBkZXB0aCA9PSB0by5kZXB0aFxuICAgIGlmIChmcm9tRW5kIHx8IHRvRW5kIHx8IGZyb20ucGF0aFtkZXB0aF0gIT0gdG8ucGF0aFtkZXB0aF0pIHtcbiAgICAgIGxldCBnYXBTdGFydCwgZ2FwRW5kXG4gICAgICBpZiAoZnJvbUVuZCkge1xuICAgICAgICBnYXBTdGFydCA9IGZyb20ub2Zmc2V0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnYXBTdGFydCA9IGZyb20ucGF0aFtkZXB0aF0gKyAxXG4gICAgICAgIGZvciAobGV0IGkgPSBkZXB0aCArIDEsIG4gPSBub2RlLmNvbnRlbnRbZ2FwU3RhcnQgLSAxXTsgaSA8PSBmcm9tLnBhdGgubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoaSA9PSBmcm9tLnBhdGgubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoZnJvbS5vZmZzZXQgPCBuLm1heE9mZnNldCkgcmV0dXJuIHRydWVcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGZyb20ucGF0aFtpXSArIDEgPCBuLm1heE9mZnNldCkgcmV0dXJuIHRydWVcbiAgICAgICAgICAgIG4gPSBuLmNvbnRlbnRbZnJvbS5wYXRoW2ldXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRvRW5kKSB7XG4gICAgICAgIGdhcEVuZCA9IHRvLm9mZnNldFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZ2FwRW5kID0gdG8ucGF0aFtkZXB0aF1cbiAgICAgICAgZm9yIChsZXQgaSA9IGRlcHRoICsgMTsgaSA8PSB0by5wYXRoLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKChpID09IHRvLnBhdGgubGVuZ3RoID8gdG8ub2Zmc2V0IDogdG8ucGF0aFtpXSkgPiAwKSByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZ2FwU3RhcnQgIT0gZ2FwRW5kKSByZXR1cm4gdHJ1ZVxuICAgICAgcmV0dXJuIGNhbkJlSm9pbmVkKG5vZGUsIGdhcFN0YXJ0LCBNYXRoLm1pbihmcm9tLmRlcHRoLCB0by5kZXB0aCkgLSBkZXB0aClcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZSA9IG5vZGUuY29udGVudFtmcm9tLnBhdGhbZGVwdGhdXVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2FtZVBhdGhEZXB0aChhLCBiKSB7XG4gIGZvciAobGV0IGkgPSAwOzsgaSsrKVxuICAgIGlmIChpID09IGEucGF0aC5sZW5ndGggfHwgaSA9PSBiLnBhdGgubGVuZ3RoIHx8IGEucGF0aFtpXSAhPSBiLnBhdGhbaV0pXG4gICAgICByZXR1cm4gaVxufVxuIiwiZXhwb3J0IGNsYXNzIERlYm91bmNlZCB7XG4gIGNvbnN0cnVjdG9yKHBtLCBkZWxheSwgZikge1xuICAgIHRoaXMucG0gPSBwbVxuICAgIHRoaXMuZGVsYXkgPSBkZWxheVxuICAgIHRoaXMuc2NoZWR1bGVkID0gbnVsbFxuICAgIHRoaXMuZiA9IGZcbiAgICB0aGlzLnBlbmRpbmcgPSBudWxsXG4gIH1cblxuICB0cmlnZ2VyKCkge1xuICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy5zY2hlZHVsZWQpXG4gICAgdGhpcy5zY2hlZHVsZWQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB0aGlzLmZpcmUoKSwgdGhpcy5kZWxheSlcbiAgfVxuXG4gIGZpcmUoKSB7XG4gICAgaWYgKCF0aGlzLnBlbmRpbmcpIHtcbiAgICAgIGlmICh0aGlzLnBtLm9wZXJhdGlvbilcbiAgICAgICAgdGhpcy5wbS5vbihcImZsdXNoXCIsIHRoaXMucGVuZGluZyA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLnBtLm9mZihcImZsdXNoXCIsIHRoaXMucGVuZGluZylcbiAgICAgICAgICB0aGlzLnBlbmRpbmcgPSBudWxsXG4gICAgICAgICAgdGhpcy5mKClcbiAgICAgICAgfSlcbiAgICAgIGVsc2VcbiAgICAgICAgdGhpcy5mKClcbiAgICB9XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuc2NoZWR1bGVkKVxuICB9XG59XG4iXX0=
