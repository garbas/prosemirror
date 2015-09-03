import {MenuItem} from "../src/menu/menu"
import {ProseMirror} from "../src/edit/main"
import {elt} from "../src/dom"
import {fromDOM} from "../src/convert/from_dom"
import {getItems, separatorItem, ImageItem, IconItem} from "../src/menu/items"
import {style, Pos, Node, Span} from "../src/model"

import "../src/inputrules/autoinput"
import "../src/menu/inlinemenu"
import "../src/menu/menubar"
import "../src/menu/buttonmenu"
import "../src/collab"

let te = document.querySelector("#content")
te.style.display = "none"

let dummy = document.createElement("div")
dummy.innerHTML = te.value
let doc = fromDOM(dummy)

class DummyServer {
  constructor() {
    this.version = 0
    this.pms = []
  }

  attach(pm) {
    pm.mod.collab.on("mustSend", () => this.mustSend(pm))
    this.pms.push(pm)
  }

  mustSend(pm) {
    let toSend = pm.mod.collab.sendableSteps()
    this.send(pm, toSend.version, toSend.steps)
    pm.mod.collab.confirmSteps(toSend)
  }

  send(pm, version, steps) {
    this.version += steps.length
    for (let i = 0; i < this.pms.length; i++)
      if (this.pms[i] != pm) this.pms[i].mod.collab.receive(steps)
  }
}


class CustomImageItem extends IconItem {
  constructor() {
    super("image", "Insert image")
  }
  apply(pm) {

    let modal = $(
      '<div class="pat-modal">' +
      '  <h3>Upload Image<h3>' +
      '  <div class="pat-upload" data-pat-upload="url: https://example.org/upload; label: Drop files here to upload or click to browse.; trigger: button" />' +
      '  <button>Insert animal</button>' +
      '</div>'
    ).appendTo('body');

    $('button', modal).on('click', function() {
        let image_src = 'http://lorempixel.com/g/200/200/animals/'
        let sel = pm.selection, tr = pm.tr
        tr.delete(sel.from, sel.to)
        let attrs = {src: image_src, alt: 'Kitty', title: 'WooW!'}
        pm.apply(tr.insertInline(sel.from, new Span("image", attrs, null, null)))
        $(this).parents('.pat-modal').data('pattern-modal').destroy()
    })

    window.patterns.scan(modal);
  }
}

function makeEditor(where, collab) {
  return new ProseMirror({
    place: document.querySelector(where),
    autoInput: true,
    menuBar: {
      float: true, 
      items: [
        ...getItems("inline").filter(function(item) {
          if (!(item instanceof ImageItem)) {
            return true;
          }
        }), separatorItem,
        (new CustomImageItem), separatorItem, 
        ...getItems("block"), ...getItems("history")
      ]
    },
    inlineMenu: false,
    buttonMenu: false,
    doc: doc,
    collab: collab
  })
}

window.pm = window.pm2 = null
function createCollab() {
  let server = new DummyServer
  pm = makeEditor(".left", {version: server.version})
  server.attach(pm)
  pm2 = makeEditor(".right", {version: server.version})
  server.attach(pm2)
}

let collab = document.location.hash != "#single"
let button = document.querySelector("#switch")
function choose(collab) {
  if (pm) { pm.wrapper.parentNode.removeChild(pm.wrapper); pm = null }
  if (pm2) { pm2.wrapper.parentNode.removeChild(pm2.wrapper); pm2 = null }

  if (collab) {
    createCollab()
    button.textContent = "try single editor"
    document.location.hash = "#collab"
  } else {    
    pm = makeEditor(".full", false)
    button.textContent = "try collaborative editor"
    document.location.hash = "#single"
  }
}
button.addEventListener("click", () => choose(collab = !collab))

choose(collab)

addEventListener("hashchange", () => {
  let newVal = document.location.hash != "#single"
  if (newVal != collab) choose(collab = newVal)
})

document.querySelector("#mark").addEventListener("mousedown", e => {
  pm.markRange(pm.selection.from, pm.selection.to, {className: "marked"})
  e.preventDefault()
})
