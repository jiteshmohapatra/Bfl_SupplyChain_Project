/**
  *
  *  Copyright 2005 Sabre Airline Solutions
  *
  *  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
  *  file except in compliance with the License. You may obtain a copy of the License at
  *
  *         http://www.apache.org/licenses/LICENSE-2.0
  *
  *  Unless required by applicable law or agreed to in writing, software distributed under the
  *  License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
  *  either express or implied. See the License for the specific language governing permissions
  *  and limitations under the License.
  * */

// -------------------- rico.js
const Rico = {
  Version: '1.1-beta2',
};

Rico.ArrayExtensions = new Array();

if (Object.prototype.extend) {
  // in prototype.js...
  Rico.ArrayExtensions[Rico.ArrayExtensions.length] = Object.prototype.extend;
}

if (Array.prototype.push) {
  // in prototype.js...
  Rico.ArrayExtensions[Rico.ArrayExtensions.length] = Array.prototype.push;
}

if (!Array.prototype.remove) {
  Array.prototype.remove = function (dx) {
    if (isNaN(dx) || dx > this.length) return false;
    for (let i = 0, n = 0; i < this.length; i++) if (i != dx) this[n++] = this[i];
    this.length -= 1;
  };
  Rico.ArrayExtensions[Rico.ArrayExtensions.length] = Array.prototype.remove;
}

if (!Array.prototype.removeItem) {
  Array.prototype.removeItem = function (item) {
    for (let i = 0; i < this.length; i++) {
      if (this[i] == item) {
        this.remove(i);
        break;
      }
    }
  };
  Rico.ArrayExtensions[Rico.ArrayExtensions.length] = Array.prototype.removeItem;
}

if (!Array.prototype.indices) {
  Array.prototype.indices = function () {
    const indexArray = new Array();
    for (index in this) {
      let ignoreThis = false;
      for (let i = 0; i < Rico.ArrayExtensions.length; i++) {
        if (this[index] == Rico.ArrayExtensions[i]) {
          ignoreThis = true;
          break;
        }
      }
      if (!ignoreThis) indexArray[indexArray.length] = index;
    }
    return indexArray;
  };
  Rico.ArrayExtensions[Rico.ArrayExtensions.length] = Array.prototype.indices;
}

// Create the loadXML method and xml getter for Mozilla
if (window.DOMParser
	  && window.XMLSerializer
	  && window.Node && Node.prototype && Node.prototype.__defineGetter__) {
  if (!Document.prototype.loadXML) {
    Document.prototype.loadXML = function (s) {
      const doc2 = (new DOMParser()).parseFromString(s, 'text/xml');
      while (this.hasChildNodes()) this.removeChild(this.lastChild);

      for (let i = 0; i < doc2.childNodes.length; i++) {
        this.appendChild(this.importNode(doc2.childNodes[i], true));
      }
    };
  }

  Document.prototype.__defineGetter__('xml',
	   function () {
		   return (new XMLSerializer()).serializeToString(this);
	   });
}

document.getElementsByTagAndClassName = function (tagName, className) {
  if (tagName == null) tagName = '*';

  const children = document.getElementsByTagName(tagName) || document.all;
  const elements = new Array();

  if (className == null) return children;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const classNames = child.className.split(' ');
    for (let j = 0; j < classNames.length; j++) {
      if (classNames[j] == className) {
        elements.push(child);
        break;
      }
    }
  }

  return elements;
};

// -------------------- ricoAccordion.js

Rico.Accordion = Class.create();

Rico.Accordion.prototype = {

  initialize(container, options) {
    this.container = $(container);
    this.lastExpandedTab = null;
    this.accordionTabs = new Array();
    this.setOptions(options);
    this._attachBehaviors();

    this.container.style.borderBottom = `1px solid ${this.options.borderColor}`;

    // set the initial visual state...
    for (let i = 1; i < this.accordionTabs.length; i++) {
      this.accordionTabs[i].collapse();
      this.accordionTabs[i].content.style.display = 'none';
    }
    this.lastExpandedTab = this.accordionTabs[0];
    this.lastExpandedTab.content.style.height = `${this.options.panelHeight}px`;
    this.lastExpandedTab.showExpanded();
    this.lastExpandedTab.titleBar.style.fontWeight = this.options.expandedFontWeight;
  },

  setOptions(options) {
    this.options = {
      expandedBg: '#63699c',
      hoverBg: '#63699c',
      collapsedBg: '#6b79a5',
      expandedTextColor: '#ffffff',
      expandedFontWeight: 'bold',
      hoverTextColor: '#ffffff',
      collapsedTextColor: '#ced7ef',
      collapsedFontWeight: 'normal',
      hoverTextColor: '#ffffff',
      borderColor: '#1f669b',
      panelHeight: 200,
      onHideTab: null,
      onShowTab: null,
    }.extend(options || {});
  },

  showTabByIndex(anIndex, animate) {
    const doAnimate = arguments.length == 1 ? true : animate;
    this.showTab(this.accordionTabs[anIndex], doAnimate);
  },

  showTab(accordionTab, animate) {
    const doAnimate = arguments.length == 1 ? true : animate;

    if (this.options.onHideTab) this.options.onHideTab(this.lastExpandedTab);

    this.lastExpandedTab.showCollapsed();
    const accordion = this;
    const { lastExpandedTab } = this;

    this.lastExpandedTab.content.style.height = `${this.options.panelHeight - 1}px`;
    accordionTab.content.style.display = '';

    accordionTab.titleBar.style.fontWeight = this.options.expandedFontWeight;

    if (doAnimate) {
      new Effect.AccordionSize(this.lastExpandedTab.content,
        accordionTab.content,
        1,
        this.options.panelHeight,
        100, 10,
        { complete() { accordion.showTabDone(lastExpandedTab); } });
      this.lastExpandedTab = accordionTab;
    } else {
      this.lastExpandedTab.content.style.height = '1px';
      accordionTab.content.style.height = `${this.options.panelHeight}px`;
      this.lastExpandedTab = accordionTab;
      this.showTabDone(lastExpandedTab);
    }
  },

  showTabDone(collapsedTab) {
    collapsedTab.content.style.display = 'none';
    this.lastExpandedTab.showExpanded();
    if (this.options.onShowTab) this.options.onShowTab(this.lastExpandedTab);
  },

  _attachBehaviors() {
    const panels = this._getDirectChildrenByTag(this.container, 'DIV');
    for (let i = 0; i < panels.length; i++) {
      const tabChildren = this._getDirectChildrenByTag(panels[i], 'DIV');
      if (tabChildren.length != 2) continue; // unexpected

      const tabTitleBar = tabChildren[0];
      const tabContentBox = tabChildren[1];
      this.accordionTabs.push(new Rico.Accordion.Tab(this, tabTitleBar, tabContentBox));
    }
  },

  _getDirectChildrenByTag(e, tagName) {
    const kids = new Array();
    const allKids = e.childNodes;
    for (let i = 0; i < allKids.length; i++) if (allKids[i] && allKids[i].tagName && allKids[i].tagName == tagName) kids.push(allKids[i]);
    return kids;
  },

};

Rico.Accordion.Tab = Class.create();

Rico.Accordion.Tab.prototype = {

  initialize(accordion, titleBar, content) {
    this.accordion = accordion;
    this.titleBar = titleBar;
    this.content = content;
    this._attachBehaviors();
  },

  collapse() {
    this.showCollapsed();
    this.content.style.height = '1px';
  },

  showCollapsed() {
    this.expanded = false;
    this.titleBar.style.backgroundColor = this.accordion.options.collapsedBg;
    this.titleBar.style.color = this.accordion.options.collapsedTextColor;
    this.titleBar.style.fontWeight = this.accordion.options.collapsedFontWeight;
    this.content.style.overflow = 'hidden';
  },

  showExpanded() {
    this.expanded = true;
    this.titleBar.style.backgroundColor = this.accordion.options.expandedBg;
    this.titleBar.style.color = this.accordion.options.expandedTextColor;
    this.content.style.overflow = 'visible';
  },

  titleBarClicked(e) {
    if (this.accordion.lastExpandedTab == this) return;
    this.accordion.showTab(this);
  },

  hover(e) {
    this.titleBar.style.backgroundColor = this.accordion.options.hoverBg;
    this.titleBar.style.color = this.accordion.options.hoverTextColor;
  },

  unhover(e) {
    if (this.expanded) {
      this.titleBar.style.backgroundColor = this.accordion.options.expandedBg;
      this.titleBar.style.color = this.accordion.options.expandedTextColor;
    } else {
      this.titleBar.style.backgroundColor = this.accordion.options.collapsedBg;
      this.titleBar.style.color = this.accordion.options.collapsedTextColor;
    }
  },

  _attachBehaviors() {
    this.content.style.border = `1px solid ${this.accordion.options.borderColor}`;
    this.content.style.borderTopWidth = '0px';
    this.content.style.borderBottomWidth = '0px';
    this.content.style.margin = '0px';

    this.titleBar.onclick = this.titleBarClicked.bindAsEventListener(this);
    this.titleBar.onmouseover = this.hover.bindAsEventListener(this);
    this.titleBar.onmouseout = this.unhover.bindAsEventListener(this);
  },

};

// -------------------- ricoAjaxEngine.js

Rico.AjaxEngine = Class.create();

Rico.AjaxEngine.prototype = {

  initialize() {
    this.ajaxElements = new Array();
    this.ajaxObjects = new Array();
    this.requestURLS = new Array();
  },

  registerAjaxElement(anId, anElement) {
    if (arguments.length == 1) anElement = $(anId);
    this.ajaxElements[anId] = anElement;
  },

  registerAjaxObject(anId, anObject) {
    this.ajaxObjects[anId] = anObject;
  },

  registerRequest(requestLogicalName, requestURL) {
    this.requestURLS[requestLogicalName] = requestURL;
  },

  sendRequest(requestName) {
    const requestURL = this.requestURLS[requestName];
    if (requestURL == null) return;

    let queryString = '';

    if (arguments.length > 1) {
      	 if (typeof (arguments[1]) === 'object' && arguments[1].length != undefined) {
	      	 queryString = this._createQueryString(arguments[1], 0);
      	 } else {
	         queryString = this._createQueryString(arguments, 1);
	     }
    }

    new Ajax.Request(requestURL, this._requestOptions(queryString));
  },

  sendRequestWithData(requestName, xmlDocument) {
    const requestURL = this.requestURLS[requestName];
    if (requestURL == null) return;

    let queryString = '';
    if (arguments.length > 2) {
      	 if (typeof (arguments[2]) === 'object' && arguments[2].length != undefined) {
	      	 queryString = this._createQueryString(arguments[2], 0);
      	 } else {
	         queryString = this._createQueryString(arguments, 2);
	     }
    }

    new Ajax.Request(`${requestURL}?${queryString}`, this._requestOptions(null, xmlDocument));
  },

  sendRequestAndUpdate(requestName, container, options) {
    const requestURL = this.requestURLS[requestName];
    if (requestURL == null) return;

    let queryString = '';
    if (arguments.length > 3) {
      	 if (typeof (arguments[3]) === 'object' && arguments[3].length != undefined) {
	      	 queryString = this._createQueryString(arguments[3], 0);
      	 } else {
	         queryString = this._createQueryString(arguments, 3);
	     }
    }

    const updaterOptions = this._requestOptions(queryString);
    updaterOptions.onComplete = null;
    updaterOptions.extend(options);

    new Ajax.Updater(container, requestURL, updaterOptions);
  },

  sendRequestWithDataAndUpdate(requestName, xmlDocument, container, options) {
    const requestURL = this.requestURLS[requestName];
    if (requestURL == null) return;

    let queryString = '';
    if (arguments.length > 4) {
      	 if (typeof (arguments[4]) === 'object' && arguments[4].length != undefined) {
	      	 queryString = this._createQueryString(arguments[4], 0);
      	 } else {
	         queryString = this._createQueryString(arguments, 4);
	     }
    }

    const updaterOptions = this._requestOptions(queryString, xmlDocument);
    updaterOptions.onComplete = null;
    updaterOptions.extend(options);

    new Ajax.Updater(container, `${requestURL}?${queryString}`, updaterOptions);
  },

  // Private -- not part of intended engine API --------------------------------------------------------------------

  _requestOptions(queryString, xmlDoc) {
    const self = this;

    const requestHeaders = ['X-Rico-Version', Rico.Version];
    let sendMethod = 'post';
    if (arguments[1]) requestHeaders.push('Content-type', 'text/xml');
    else sendMethod = 'get';

    return {
      requestHeaders,
      parameters: queryString,
      postBody: arguments[1] ? xmlDoc : null,
      method: sendMethod,
      onComplete: self._onRequestComplete.bind(self),
    };
  },

  _createQueryString(theArgs, offset) {
   	  const self = this;
    let queryString = '';
    for (let i = offset; i < theArgs.length; i++) {
      if (i != offset) queryString += '&';

      const anArg = theArgs[i];

      if (anArg.name != undefined && anArg.value != undefined) {
        queryString += `${anArg.name}=${escape(anArg.value)}`;
      } else {
        const ePos = anArg.indexOf('=');
        const argName = anArg.substring(0, ePos);
        const argValue = anArg.substring(ePos + 1);
        queryString += `${argName}=${escape(argValue)}`;
      }
    }

    return queryString;
  },
  _onRequestComplete(request) {
    //! !TODO: error handling infrastructure??
    if (request.status != 200) return;

    const response = request.responseXML.getElementsByTagName('ajax-response');
    if (response == null || response.length != 1) return;
    this._processAjaxResponse(response[0].childNodes);
  },

  _processAjaxResponse(xmlResponseElements) {
    for (let i = 0; i < xmlResponseElements.length; i++) {
      const responseElement = xmlResponseElements[i];

      // only process nodes of type element.....
      if (responseElement.nodeType != 1) continue;

      const responseType = responseElement.getAttribute('type');
      const responseId = responseElement.getAttribute('id');

      if (responseType == 'object') this._processAjaxObjectUpdate(this.ajaxObjects[responseId], responseElement);
      else if (responseType == 'element') this._processAjaxElementUpdate(this.ajaxElements[responseId], responseElement);
      else alert(`unrecognized AjaxResponse type : ${responseType}`);
    }
  },

  _processAjaxObjectUpdate(ajaxObject, responseElement) {
    ajaxObject.ajaxUpdate(responseElement);
  },

  _processAjaxElementUpdate(ajaxElement, responseElement) {
    ajaxElement.innerHTML = RicoUtil.getContentAsString(responseElement);
  },

};

const ajaxEngine = new Rico.AjaxEngine();

// -------------------- ricoColor.js
Rico.Color = Class.create();

Rico.Color.prototype = {

  initialize(red, green, blue) {
    this.rgb = { r: red, g: green, b: blue };
  },

  setRed(r) {
    this.rgb.r = r;
  },

  setGreen(g) {
    this.rgb.g = g;
  },

  setBlue(b) {
    this.rgb.b = b;
  },

  setHue(h) {
    // get an HSB model, and set the new hue...
    const hsb = this.asHSB();
    hsb.h = h;

    // convert back to RGB...
    this.rgb = Rico.Color.HSBtoRGB(hsb.h, hsb.s, hsb.b);
  },

  setSaturation(s) {
    // get an HSB model, and set the new hue...
    const hsb = this.asHSB();
    hsb.s = s;

    // convert back to RGB and set values...
    this.rgb = Rico.Color.HSBtoRGB(hsb.h, hsb.s, hsb.b);
  },

  setBrightness(b) {
    // get an HSB model, and set the new hue...
    const hsb = this.asHSB();
    hsb.b = b;

    // convert back to RGB and set values...
    this.rgb = Rico.Color.HSBtoRGB(hsb.h, hsb.s, hsb.b);
  },

  darken(percent) {
    const hsb = this.asHSB();
    this.rgb = Rico.Color.HSBtoRGB(hsb.h, hsb.s, Math.max(hsb.b - percent, 0));
  },

  brighten(percent) {
    const hsb = this.asHSB();
    this.rgb = Rico.Color.HSBtoRGB(hsb.h, hsb.s, Math.min(hsb.b + percent, 1));
  },

  blend(other) {
    this.rgb.r = Math.floor((this.rgb.r + other.rgb.r) / 2);
    this.rgb.g = Math.floor((this.rgb.g + other.rgb.g) / 2);
    this.rgb.b = Math.floor((this.rgb.b + other.rgb.b) / 2);
  },

  isBright() {
    const hsb = this.asHSB();
    return this.asHSB().b > 0.5;
  },

  isDark() {
    return !this.isBright();
  },

  asRGB() {
    return `rgb(${this.rgb.r},${this.rgb.g},${this.rgb.b})`;
  },

  asHex() {
    return `#${this.rgb.r.toColorPart()}${this.rgb.g.toColorPart()}${this.rgb.b.toColorPart()}`;
  },

  asHSB() {
    return Rico.Color.RGBtoHSB(this.rgb.r, this.rgb.g, this.rgb.b);
  },

  toString() {
    return this.asHex();
  },

};

Rico.Color.createFromHex = function (hexCode) {
  if (hexCode.indexOf('#') == 0) hexCode = hexCode.substring(1);
  const red = hexCode.substring(0, 2);
  const green = hexCode.substring(2, 4);
  const blue = hexCode.substring(4, 6);
  return new Rico.Color(parseInt(red, 16), parseInt(green, 16), parseInt(blue, 16));
};

/**
 * Factory method for creating a color from the background of
 * an HTML element.
 */
Rico.Color.createColorFromBackground = function (elem) {
  const actualColor = RicoUtil.getElementsComputedStyle($(elem), 'backgroundColor', 'background-color');

  if (actualColor == 'transparent' && elem.parent) return Rico.Color.createColorFromBackground(elem.parent);

  if (actualColor == null) return new Rico.Color(255, 255, 255);

  if (actualColor.indexOf('rgb(') == 0) {
    const colors = actualColor.substring(4, actualColor.length - 1);
    const colorArray = colors.split(',');
    return new Rico.Color(parseInt(colorArray[0]),
      parseInt(colorArray[1]),
      parseInt(colorArray[2]));
  }
  if (actualColor.indexOf('#') == 0) {
    const redPart = parseInt(actualColor.substring(1, 3), 16);
    const greenPart = parseInt(actualColor.substring(3, 5), 16);
    const bluePart = parseInt(actualColor.substring(5), 16);
    return new Rico.Color(redPart, greenPart, bluePart);
  }
  return new Rico.Color(255, 255, 255);
};

Rico.Color.HSBtoRGB = function (hue, saturation, brightness) {
  let red = 0;
  let green = 0;
  let blue = 0;

  if (saturation == 0) {
    red = parseInt(brightness * 255.0 + 0.5);
	   green = red;
	   blue = red;
  } else {
    const h = (hue - Math.floor(hue)) * 6.0;
    const f = h - Math.floor(h);
    const p = brightness * (1.0 - saturation);
    const q = brightness * (1.0 - saturation * f);
    const t = brightness * (1.0 - (saturation * (1.0 - f)));

    switch (parseInt(h)) {
      case 0:
        red = (brightness * 255.0 + 0.5);
        green = (t * 255.0 + 0.5);
        blue = (p * 255.0 + 0.5);
        break;
      case 1:
        red = (q * 255.0 + 0.5);
        green = (brightness * 255.0 + 0.5);
        blue = (p * 255.0 + 0.5);
        break;
      case 2:
        red = (p * 255.0 + 0.5);
        green = (brightness * 255.0 + 0.5);
        blue = (t * 255.0 + 0.5);
        break;
      case 3:
        red = (p * 255.0 + 0.5);
        green = (q * 255.0 + 0.5);
        blue = (brightness * 255.0 + 0.5);
        break;
      case 4:
        red = (t * 255.0 + 0.5);
        green = (p * 255.0 + 0.5);
        blue = (brightness * 255.0 + 0.5);
        break;
      case 5:
        red = (brightness * 255.0 + 0.5);
        green = (p * 255.0 + 0.5);
        blue = (q * 255.0 + 0.5);
        break;
	    }
  }

  return { r: parseInt(red), g: parseInt(green), b: parseInt(blue) };
};

Rico.Color.RGBtoHSB = function (r, g, b) {
  let hue;
  let saturaton;
  let brightness;

  let cmax = (r > g) ? r : g;
  if (b > cmax) cmax = b;

  let cmin = (r < g) ? r : g;
  if (b < cmin) cmin = b;

  brightness = cmax / 255.0;
  if (cmax != 0) saturation = (cmax - cmin) / cmax;
  else saturation = 0;

  if (saturation == 0) hue = 0;
  else {
    const redc = (cmax - r) / (cmax - cmin);
    	const greenc = (cmax - g) / (cmax - cmin);
    	const bluec = (cmax - b) / (cmax - cmin);

    	if (r == cmax) hue = bluec - greenc;
    	else if (g == cmax) hue = 2.0 + redc - bluec;
    else hue = 4.0 + greenc - redc;

    	hue /= 6.0;
    	if (hue < 0) hue += 1.0;
  }

  return { h: hue, s: saturation, b: brightness };
};

// -------------------- ricoCorner.js

Rico.Corner = {

  round(e, options) {
    var e = $(e);
    this._setOptions(options);

    let { color } = this.options;
    if (this.options.color == 'fromElement') color = this._background(e);

    let { bgColor } = this.options;
    if (this.options.bgColor == 'fromParent') bgColor = this._background(e.offsetParent);

    this._roundCornersImpl(e, color, bgColor);
  },

  _roundCornersImpl(e, color, bgColor) {
    if (this.options.border) this._renderBorder(e, bgColor);
    if (this._isTopRounded()) this._roundTopCorners(e, color, bgColor);
    if (this._isBottomRounded()) this._roundBottomCorners(e, color, bgColor);
  },

  _renderBorder(el, bgColor) {
    const borderValue = `1px solid ${this._borderColor(bgColor)}`;
    const borderL = `border-left: ${borderValue}`;
    const borderR = `border-right: ${borderValue}`;
    const style = `style='${borderL};${borderR}'`;
    el.innerHTML = `<div ${style}>${el.innerHTML}</div>`;
  },

  _roundTopCorners(el, color, bgColor) {
    const corner = this._createCorner(bgColor);
    for (let i = 0; i < this.options.numSlices; i++) corner.appendChild(this._createCornerSlice(color, bgColor, i, 'top'));
    el.style.paddingTop = 0;
    el.insertBefore(corner, el.firstChild);
  },

  _roundBottomCorners(el, color, bgColor) {
    const corner = this._createCorner(bgColor);
    for (let i = (this.options.numSlices - 1); i >= 0; i--) corner.appendChild(this._createCornerSlice(color, bgColor, i, 'bottom'));
    el.style.paddingBottom = 0;
    el.appendChild(corner);
  },

  _createCorner(bgColor) {
    const corner = document.createElement('div');
    corner.style.backgroundColor = (this._isTransparent() ? 'transparent' : bgColor);
    return corner;
  },

  _createCornerSlice(color, bgColor, n, position) {
    const slice = document.createElement('span');

    const inStyle = slice.style;
    inStyle.backgroundColor = color;
    inStyle.display = 'block';
    inStyle.height = '1px';
    inStyle.overflow = 'hidden';
    inStyle.fontSize = '1px';

    const borderColor = this._borderColor(color, bgColor);
    if (this.options.border && n == 0) {
      inStyle.borderTopStyle = 'solid';
      inStyle.borderTopWidth = '1px';
      inStyle.borderLeftWidth = '0px';
      inStyle.borderRightWidth = '0px';
      inStyle.borderBottomWidth = '0px';
      inStyle.height = '0px'; // assumes css compliant box model
      inStyle.borderColor = borderColor;
    } else if (borderColor) {
      inStyle.borderColor = borderColor;
      inStyle.borderStyle = 'solid';
      inStyle.borderWidth = '0px 1px';
    }

    if (!this.options.compact && (n == (this.options.numSlices - 1))) inStyle.height = '2px';

    this._setMargin(slice, n, position);
    this._setBorder(slice, n, position);

    return slice;
  },

  _setOptions(options) {
    this.options = {
      corners: 'all',
      color: 'fromElement',
      bgColor: 'fromParent',
      blend: true,
      border: false,
      compact: false,
    }.extend(options || {});

    this.options.numSlices = this.options.compact ? 2 : 4;
    if (this._isTransparent()) this.options.blend = false;
  },

  _whichSideTop() {
    if (this._hasString(this.options.corners, 'all', 'top')) return '';

    if (this.options.corners.indexOf('tl') >= 0 && this.options.corners.indexOf('tr') >= 0) return '';

    if (this.options.corners.indexOf('tl') >= 0) return 'left';
    if (this.options.corners.indexOf('tr') >= 0) return 'right';
    return '';
  },

  _whichSideBottom() {
    if (this._hasString(this.options.corners, 'all', 'bottom')) return '';

    if (this.options.corners.indexOf('bl') >= 0 && this.options.corners.indexOf('br') >= 0) return '';

    if (this.options.corners.indexOf('bl') >= 0) return 'left';
    if (this.options.corners.indexOf('br') >= 0) return 'right';
    return '';
  },

  _borderColor(color, bgColor) {
    if (color == 'transparent') return bgColor;
    if (this.options.border) return this.options.border;
    if (this.options.blend) return this._blend(bgColor, color);
    return '';
  },

  _setMargin(el, n, corners) {
    const marginSize = this._marginSize(n);
    const whichSide = corners == 'top' ? this._whichSideTop() : this._whichSideBottom();

    if (whichSide == 'left') {
      el.style.marginLeft = `${marginSize}px`; el.style.marginRight = '0px';
    } else if (whichSide == 'right') {
      el.style.marginRight = `${marginSize}px`; el.style.marginLeft = '0px';
    } else {
      el.style.marginLeft = `${marginSize}px`; el.style.marginRight = `${marginSize}px`;
    }
  },

  _setBorder(el, n, corners) {
    const borderSize = this._borderSize(n);
    const whichSide = corners == 'top' ? this._whichSideTop() : this._whichSideBottom();

    if (whichSide == 'left') {
      el.style.borderLeftWidth = `${borderSize}px`; el.style.borderRightWidth = '0px';
    } else if (whichSide == 'right') {
      el.style.borderRightWidth = `${borderSize}px`; el.style.borderLeftWidth = '0px';
    } else {
      el.style.borderLeftWidth = `${borderSize}px`; el.style.borderRightWidth = `${borderSize}px`;
    }
  },

  _marginSize(n) {
    if (this._isTransparent()) return 0;

    const marginSizes = [5, 3, 2, 1];
    const blendedMarginSizes = [3, 2, 1, 0];
    const compactMarginSizes = [2, 1];
    const smBlendedMarginSizes = [1, 0];

    if (this.options.compact && this.options.blend) return smBlendedMarginSizes[n];
    if (this.options.compact) return compactMarginSizes[n];
    if (this.options.blend) return blendedMarginSizes[n];
    return marginSizes[n];
  },

  _borderSize(n) {
    const transparentBorderSizes = [5, 3, 2, 1];
    const blendedBorderSizes = [2, 1, 1, 1];
    const compactBorderSizes = [1, 0];
    const actualBorderSizes = [0, 2, 0, 0];

    if (this.options.compact && (this.options.blend || this._isTransparent())) return 1;
    if (this.options.compact) return compactBorderSizes[n];
    if (this.options.blend) return blendedBorderSizes[n];
    if (this.options.border) return actualBorderSizes[n];
    if (this._isTransparent()) return transparentBorderSizes[n];
    return 0;
  },

  _hasString(str) { for (let i = 1; i < arguments.length; i++) if (str.indexOf(arguments[i]) >= 0) return true; return false; },
  _blend(c1, c2) { const cc1 = Rico.Color.createFromHex(c1); cc1.blend(Rico.Color.createFromHex(c2)); return cc1; },
  _background(el) { try { return Rico.Color.createColorFromBackground(el).asHex(); } catch (err) { return '#ffffff'; } },
  _isTransparent() { return this.options.color == 'transparent'; },
  _isTopRounded() { return this._hasString(this.options.corners, 'all', 'top', 'tl', 'tr'); },
  _isBottomRounded() { return this._hasString(this.options.corners, 'all', 'bottom', 'bl', 'br'); },
  _hasSingleTextChild(el) { return el.childNodes.length == 1 && el.childNodes[0].nodeType == 3; },
};

// -------------------- ricoDragAndDrop.js
Rico.DragAndDrop = Class.create();

Rico.DragAndDrop.prototype = {

  initialize() {
    this.dropZones = new Array();
    this.draggables = new Array();
    this.currentDragObjects = new Array();
    this.dragElement = null;
    this.lastSelectedDraggable = null;
    this.currentDragObjectVisible = false;
    this.interestedInMotionEvents = false;
  },

  registerDropZone(aDropZone) {
    this.dropZones[this.dropZones.length] = aDropZone;
  },

  deregisterDropZone(aDropZone) {
    const newDropZones = new Array();
    let j = 0;
    for (let i = 0; i < this.dropZones.length; i++) {
      if (this.dropZones[i] != aDropZone) newDropZones[j++] = this.dropZones[i];
    }

    this.dropZones = newDropZones;
  },

  clearDropZones() {
    this.dropZones = new Array();
  },

  registerDraggable(aDraggable) {
    this.draggables[this.draggables.length] = aDraggable;
    this._addMouseDownHandler(aDraggable);
  },

  clearSelection() {
    for (let i = 0; i < this.currentDragObjects.length; i++) this.currentDragObjects[i].deselect();
    this.currentDragObjects = new Array();
    this.lastSelectedDraggable = null;
  },

  hasSelection() {
    return this.currentDragObjects.length > 0;
  },

  setStartDragFromElement(e, mouseDownElement) {
    this.origPos = RicoUtil.toDocumentPosition(mouseDownElement);
    this.startx = e.screenX - this.origPos.x;
    this.starty = e.screenY - this.origPos.y;
    // this.startComponentX = e.layerX ? e.layerX : e.offsetX;
    // this.startComponentY = e.layerY ? e.layerY : e.offsetY;
    // this.adjustedForDraggableSize = false;

    this.interestedInMotionEvents = this.hasSelection();
    this._terminateEvent(e);
  },

  updateSelection(draggable, extendSelection) {
    if (!extendSelection) this.clearSelection();

    if (draggable.isSelected()) {
      this.currentDragObjects.removeItem(draggable);
      draggable.deselect();
      if (draggable == this.lastSelectedDraggable) this.lastSelectedDraggable = null;
    } else {
      this.currentDragObjects[this.currentDragObjects.length] = draggable;
      draggable.select();
      this.lastSelectedDraggable = draggable;
    }
  },

  _mouseDownHandler(e) {
    if (arguments.length == 0) e = event;

    // if not button 1 ignore it...
    const nsEvent = e.which != undefined;
    if ((nsEvent && e.which != 1) || (!nsEvent && e.button != 1)) return;

    const eventTarget = e.target ? e.target : e.srcElement;
    let draggableObject = eventTarget.draggable;

    let candidate = eventTarget;
    while (draggableObject == null && candidate.parentNode) {
      candidate = candidate.parentNode;
      draggableObject = candidate.draggable;
    }

    if (draggableObject == null) return;

    this.updateSelection(draggableObject, e.ctrlKey);

    // clear the drop zones postion cache...
    if (this.hasSelection()) for (let i = 0; i < this.dropZones.length; i++) this.dropZones[i].clearPositionCache();

    this.setStartDragFromElement(e, draggableObject.getMouseDownHTMLElement());
  },

  _mouseMoveHandler(e) {
    const nsEvent = e.which != undefined;
    if (!this.interestedInMotionEvents) {
      this._terminateEvent(e);
      return;
    }

    if (!this.hasSelection()) return;

    if (!this.currentDragObjectVisible) this._startDrag(e);

    if (!this.activatedDropZones) this._activateRegisteredDropZones();

    // if ( !this.adjustedForDraggableSize )
    //   this._adjustForDraggableSize(e);

    this._updateDraggableLocation(e);
    this._updateDropZonesHover(e);

    this._terminateEvent(e);
  },

  _makeDraggableObjectVisible(e) {
    if (!this.hasSelection()) return;

    let dragElement;
    if (this.currentDragObjects.length > 1) dragElement = this.currentDragObjects[0].getMultiObjectDragGUI(this.currentDragObjects);
    else dragElement = this.currentDragObjects[0].getSingleObjectDragGUI();

    // go ahead and absolute position it...
    if (RicoUtil.getElementsComputedStyle(dragElement, 'position') != 'absolute') dragElement.style.position = 'absolute';

    // need to parent him into the document...
    if (dragElement.parentNode == null || dragElement.parentNode.nodeType == 11) document.body.appendChild(dragElement);

    this.dragElement = dragElement;
    this._updateDraggableLocation(e);

    this.currentDragObjectVisible = true;
  },

  /**
   _adjustForDraggableSize: function(e) {
      var dragElementWidth  = this.dragElement.offsetWidth;
      var dragElementHeight = this.dragElement.offsetHeight;
      if ( this.startComponentX > dragElementWidth )
         this.startx -= this.startComponentX - dragElementWidth + 2;
      if ( e.offsetY ) {
         if ( this.startComponentY > dragElementHeight )
            this.starty -= this.startComponentY - dragElementHeight + 2;
      }
      this.adjustedForDraggableSize = true;
   },
   * */

  _updateDraggableLocation(e) {
    const dragObjectStyle = this.dragElement.style;
    dragObjectStyle.left = `${e.screenX - this.startx}px`;
    dragObjectStyle.top = `${e.screenY - this.starty}px`;
  },

  _updateDropZonesHover(e) {
    const n = this.dropZones.length;
    for (var i = 0; i < n; i++) {
      if (!this._mousePointInDropZone(e, this.dropZones[i])) this.dropZones[i].hideHover();
    }

    for (var i = 0; i < n; i++) {
      if (this._mousePointInDropZone(e, this.dropZones[i])) {
        if (this.dropZones[i].canAccept(this.currentDragObjects)) this.dropZones[i].showHover();
      }
    }
  },

  _startDrag(e) {
    for (let i = 0; i < this.currentDragObjects.length; i++) this.currentDragObjects[i].startDrag();

    this._makeDraggableObjectVisible(e);
  },

  _mouseUpHandler(e) {
    if (!this.hasSelection()) return;

    const nsEvent = e.which != undefined;
    if ((nsEvent && e.which != 1) || (!nsEvent && e.button != 1)) return;

    this.interestedInMotionEvents = false;

    if (this.dragElement == null) {
      this._terminateEvent(e);
      return;
    }

    if (this._placeDraggableInDropZone(e)) this._completeDropOperation(e);
    else {
      this._terminateEvent(e);
      new Effect.Position(this.dragElement,
        this.origPos.x,
        this.origPos.y,
        200,
        20,
        { complete: this._doCancelDragProcessing.bind(this) });
    }
  },

  _completeDropOperation(e) {
    if (this.dragElement != this.currentDragObjects[0].getMouseDownHTMLElement()) {
      if (this.dragElement.parentNode != null) this.dragElement.parentNode.removeChild(this.dragElement);
    }

    this._deactivateRegisteredDropZones();
    this._endDrag();
    this.clearSelection();
    this.dragElement = null;
    this.currentDragObjectVisible = false;
    this._terminateEvent(e);
  },

  _doCancelDragProcessing() {
    this._cancelDrag();

    if (this.dragElement != this.currentDragObjects[0].getMouseDownHTMLElement()) {
      if (this.dragElement.parentNode != null) {
        this.dragElement.parentNode.removeChild(this.dragElement);
      }
    }

    this._deactivateRegisteredDropZones();
    this.dragElement = null;
    this.currentDragObjectVisible = false;
  },

  _placeDraggableInDropZone(e) {
    let foundDropZone = false;
    const n = this.dropZones.length;
    for (let i = 0; i < n; i++) {
      if (this._mousePointInDropZone(e, this.dropZones[i])) {
        if (this.dropZones[i].canAccept(this.currentDragObjects)) {
          this.dropZones[i].hideHover();
          this.dropZones[i].accept(this.currentDragObjects);
          foundDropZone = true;
          break;
        }
      }
    }

    return foundDropZone;
  },

  _cancelDrag() {
    for (let i = 0; i < this.currentDragObjects.length; i++) this.currentDragObjects[i].cancelDrag();
  },

  _endDrag() {
    for (let i = 0; i < this.currentDragObjects.length; i++) this.currentDragObjects[i].endDrag();
  },

  _mousePointInDropZone(e, dropZone) {
    const absoluteRect = dropZone.getAbsoluteRect();

    return e.clientX > absoluteRect.left
             && e.clientX < absoluteRect.right
             && e.clientY > absoluteRect.top
             && e.clientY < absoluteRect.bottom;
  },

  _addMouseDownHandler(aDraggable) {
    const htmlElement = aDraggable.getMouseDownHTMLElement();
    if (htmlElement != null) {
      htmlElement.draggable = aDraggable;
      this._addMouseDownEvent(htmlElement);
    }
  },

  _activateRegisteredDropZones() {
    const n = this.dropZones.length;
    for (let i = 0; i < n; i++) {
      const dropZone = this.dropZones[i];
      if (dropZone.canAccept(this.currentDragObjects)) dropZone.activate();
    }

    this.activatedDropZones = true;
  },

  _deactivateRegisteredDropZones() {
    const n = this.dropZones.length;
    for (let i = 0; i < n; i++) this.dropZones[i].deactivate();
    this.activatedDropZones = false;
  },

  _addMouseDownEvent(htmlElement) {
    if (typeof document.implementation !== 'undefined'
         && document.implementation.hasFeature('HTML', '1.0')
         && document.implementation.hasFeature('Events', '2.0')
         && document.implementation.hasFeature('CSS', '2.0')) {
      htmlElement.addEventListener('mousedown', this._mouseDownHandler.bindAsEventListener(this), false);
    } else {
      htmlElement.attachEvent('onmousedown', this._mouseDownHandler.bindAsEventListener(this));
    }
  },

  _terminateEvent(e) {
    if (e.stopPropagation != undefined) e.stopPropagation();
    else if (e.cancelBubble != undefined) e.cancelBubble = true;

    if (e.preventDefault != undefined) e.preventDefault();
    else e.returnValue = false;
  },

  initializeEventHandlers() {
    if (typeof document.implementation !== 'undefined'
         && document.implementation.hasFeature('HTML', '1.0')
         && document.implementation.hasFeature('Events', '2.0')
         && document.implementation.hasFeature('CSS', '2.0')) {
      document.addEventListener('mouseup', this._mouseUpHandler.bindAsEventListener(this), false);
      document.addEventListener('mousemove', this._mouseMoveHandler.bindAsEventListener(this), false);
    } else {
      document.attachEvent('onmouseup', this._mouseUpHandler.bindAsEventListener(this));
      document.attachEvent('onmousemove', this._mouseMoveHandler.bindAsEventListener(this));
    }
  },
};

// var dndMgr = new Rico.DragAndDrop();
// dndMgr.initializeEventHandlers();

// -------------------- ricoDraggable.js
Rico.Draggable = Class.create();

Rico.Draggable.prototype = {

  initialize(type, htmlElement) {
    this.type = type;
    this.htmlElement = $(htmlElement);
    this.selected = false;
  },

  /**
    *   Returns the HTML element that should have a mouse down event
    *   added to it in order to initiate a drag operation
    *
    * */
  getMouseDownHTMLElement() {
    return this.htmlElement;
  },

  select() {
    this.selected = true;

    if (this.showingSelected) return;

    const htmlElement = this.getMouseDownHTMLElement();

    const color = Rico.Color.createColorFromBackground(htmlElement);
    color.isBright() ? color.darken(0.033) : color.brighten(0.033);

    this.saveBackground = RicoUtil.getElementsComputedStyle(htmlElement, 'backgroundColor', 'background-color');
    htmlElement.style.backgroundColor = color.asHex();
    this.showingSelected = true;
  },

  deselect() {
    this.selected = false;
    if (!this.showingSelected) return;

    const htmlElement = this.getMouseDownHTMLElement();

    htmlElement.style.backgroundColor = this.saveBackground;
    this.showingSelected = false;
  },

  isSelected() {
    return this.selected;
  },

  startDrag() {
  },

  cancelDrag() {
  },

  endDrag() {
  },

  getSingleObjectDragGUI() {
    return this.htmlElement;
  },

  getMultiObjectDragGUI(draggables) {
    return this.htmlElement;
  },

  getDroppedGUI() {
    return this.htmlElement;
  },

  toString() {
    return `${this.type}:${this.htmlElement}:`;
  },

};

// -------------------- ricoDropzone.js
Rico.Dropzone = Class.create();

Rico.Dropzone.prototype = {

  initialize(htmlElement) {
    this.htmlElement = $(htmlElement);
    this.absoluteRect = null;
  },

  getHTMLElement() {
    return this.htmlElement;
  },

  clearPositionCache() {
    this.absoluteRect = null;
  },

  getAbsoluteRect() {
    if (this.absoluteRect == null) {
      const htmlElement = this.getHTMLElement();
      const pos = RicoUtil.toViewportPosition(htmlElement);

      this.absoluteRect = {
        top: pos.y,
        left: pos.x,
        bottom: pos.y + htmlElement.offsetHeight,
        right: pos.x + htmlElement.offsetWidth,
      };
    }
    return this.absoluteRect;
  },

  activate() {
    const htmlElement = this.getHTMLElement();
    if (htmlElement == null || this.showingActive) return;

    this.showingActive = true;
    this.saveBackgroundColor = htmlElement.style.backgroundColor;

    const fallbackColor = '#ffea84';
    const currentColor = Rico.Color.createColorFromBackground(htmlElement);
    if (currentColor == null) htmlElement.style.backgroundColor = fallbackColor;
    else {
      currentColor.isBright() ? currentColor.darken(0.2) : currentColor.brighten(0.2);
      htmlElement.style.backgroundColor = currentColor.asHex();
    }
  },

  deactivate() {
    const htmlElement = this.getHTMLElement();
    if (htmlElement == null || !this.showingActive) return;

    htmlElement.style.backgroundColor = this.saveBackgroundColor;
    this.showingActive = false;
    this.saveBackgroundColor = null;
  },

  showHover() {
    const htmlElement = this.getHTMLElement();
    if (htmlElement == null || this.showingHover) return;

    this.saveBorderWidth = htmlElement.style.borderWidth;
    this.saveBorderStyle = htmlElement.style.borderStyle;
    this.saveBorderColor = htmlElement.style.borderColor;

    this.showingHover = true;
    htmlElement.style.borderWidth = '1px';
    htmlElement.style.borderStyle = 'solid';
    // htmlElement.style.borderColor = "#ff9900";
    htmlElement.style.borderColor = '#ffff00';
  },

  hideHover() {
    const htmlElement = this.getHTMLElement();
    if (htmlElement == null || !this.showingHover) return;

    htmlElement.style.borderWidth = this.saveBorderWidth;
    htmlElement.style.borderStyle = this.saveBorderStyle;
    htmlElement.style.borderColor = this.saveBorderColor;
    this.showingHover = false;
  },

  canAccept(draggableObjects) {
    return true;
  },

  accept(draggableObjects) {
    const htmlElement = this.getHTMLElement();
    if (htmlElement == null) return;

    n = draggableObjects.length;
    for (let i = 0; i < n; i++) {
      const theGUI = draggableObjects[i].getDroppedGUI();
      if (RicoUtil.getElementsComputedStyle(theGUI, 'position') == 'absolute') {
        theGUI.style.position = 'static';
        theGUI.style.top = '';
        theGUI.style.top = '';
      }
      htmlElement.appendChild(theGUI);
    }
  },
};

// -------------------- ricoEffects.js

/**
  *  Use the Effect namespace for effects.  If using scriptaculous effects
  *  this will already be defined, otherwise we'll just create an empty
  *  object for it...
 * */
if (window.Effect == undefined) Effect = {};

Effect.SizeAndPosition = Class.create();
Effect.SizeAndPosition.prototype = {

  initialize(element, x, y, w, h, duration, steps, options) {
    this.element = $(element);
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.duration = duration;
    this.steps = steps;
    this.options = arguments[7] || {};

    this.sizeAndPosition();
  },

  sizeAndPosition() {
    if (this.isFinished()) {
      if (this.options.complete) this.options.complete(this);
      return;
    }

    if (this.timer) clearTimeout(this.timer);

    const stepDuration = Math.round(this.duration / this.steps);

    // Get original values: x,y = top left corner;  w,h = width height
    const currentX = this.element.offsetLeft;
    const currentY = this.element.offsetTop;
    const currentW = this.element.offsetWidth;
    const currentH = this.element.offsetHeight;

    // If values not set, or zero, we do not modify them, and take original as final as well
    this.x = (this.x) ? this.x : currentX;
    this.y = (this.y) ? this.y : currentY;
    this.w = (this.w) ? this.w : currentW;
    this.h = (this.h) ? this.h : currentH;

    // how much do we need to modify our values for each step?
    const difX = this.steps > 0 ? (this.x - currentX) / this.steps : 0;
    const difY = this.steps > 0 ? (this.y - currentY) / this.steps : 0;
    const difW = this.steps > 0 ? (this.w - currentW) / this.steps : 0;
    const difH = this.steps > 0 ? (this.h - currentH) / this.steps : 0;

    this.moveBy(difX, difY);
    this.resizeBy(difW, difH);

    this.duration -= stepDuration;
    this.steps--;

    this.timer = setTimeout(this.sizeAndPosition.bind(this), stepDuration);
  },

  isFinished() {
    return this.steps <= 0;
  },

  moveBy(difX, difY) {
    const currentLeft = this.element.offsetLeft;
    const currentTop = this.element.offsetTop;
    const intDifX = parseInt(difX);
    const intDifY = parseInt(difY);

    const { style } = this.element;
    if (intDifX != 0) style.left = `${currentLeft + intDifX}px`;
    if (intDifY != 0) style.top = `${currentTop + intDifY}px`;
  },

  resizeBy(difW, difH) {
    const currentWidth = this.element.offsetWidth;
    const currentHeight = this.element.offsetHeight;
    const intDifW = parseInt(difW);
    const intDifH = parseInt(difH);

    const { style } = this.element;
    if (intDifW != 0) style.width = `${currentWidth + intDifW}px`;
    if (intDifH != 0) style.height = `${currentHeight + intDifH}px`;
  },
};

Effect.Size = Class.create();
Effect.Size.prototype = {

  initialize(element, w, h, duration, steps, options) {
    new Effect.SizeAndPosition(element, null, null, w, h, duration, steps, options);
  },
};

Effect.Position = Class.create();
Effect.Position.prototype = {

  initialize(element, x, y, duration, steps, options) {
    new Effect.SizeAndPosition(element, x, y, null, null, duration, steps, options);
  },
};

Effect.Round = Class.create();
Effect.Round.prototype = {

  initialize(tagName, className, options) {
    const elements = document.getElementsByTagAndClassName(tagName, className);
    for (let i = 0; i < elements.length; i++) Rico.Corner.round(elements[i], options);
  },
};

Effect.FadeTo = Class.create();
Effect.FadeTo.prototype = {

  initialize(element, opacity, duration, steps, options) {
    this.element = $(element);
    this.opacity = opacity;
    this.duration = duration;
    this.steps = steps;
    this.options = arguments[4] || {};
    this.fadeTo();
  },

  fadeTo() {
    if (this.isFinished()) {
      if (this.options.complete) this.options.complete(this);
      return;
    }

    if (this.timer) clearTimeout(this.timer);

    const stepDuration = Math.round(this.duration / this.steps);
    const currentOpacity = this.getElementOpacity();
    const delta = this.steps > 0 ? (this.opacity - currentOpacity) / this.steps : 0;

    this.changeOpacityBy(delta);
    this.duration -= stepDuration;
    this.steps--;

    this.timer = setTimeout(this.fadeTo.bind(this), stepDuration);
  },

  changeOpacityBy(v) {
    const currentOpacity = this.getElementOpacity();
    const newOpacity = Math.max(0, Math.min(currentOpacity + v, 1));
    this.element.ricoOpacity = newOpacity;

    this.element.style.filter = `alpha(opacity:${Math.round(newOpacity * 100)})`;
    this.element.style.opacity = newOpacity; /* // */
  },

  isFinished() {
    return this.steps <= 0;
  },

  getElementOpacity() {
    if (this.element.ricoOpacity == undefined) {
      let opacity;
      if (this.element.currentStyle) {
        opacity = this.element.currentStyle.opacity;
      } else if (document.defaultView.getComputedStyle != undefined) {
        const computedStyle = document.defaultView.getComputedStyle;
        opacity = computedStyle(this.element, null).getPropertyValue('opacity');
      }

      this.element.ricoOpacity = opacity != undefined ? opacity : 1.0;
    }

    return parseFloat(this.element.ricoOpacity);
  },
};

Effect.AccordionSize = Class.create();

Effect.AccordionSize.prototype = {

  initialize(e1, e2, start, end, duration, steps, options) {
    this.e1 = $(e1);
    this.e2 = $(e2);
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.steps = steps;
    this.options = arguments[6] || {};

    this.accordionSize();
  },

  accordionSize() {
    if (this.isFinished()) {
      // just in case there are round errors or such...
      this.e1.style.height = `${this.start}px`;
      this.e2.style.height = `${this.end}px`;

      if (this.options.complete) this.options.complete(this);
      return;
    }

    if (this.timer) clearTimeout(this.timer);

    const stepDuration = Math.round(this.duration / this.steps);

    const diff = this.steps > 0 ? (parseInt(this.e1.offsetHeight) - this.start) / this.steps : 0;
    this.resizeBy(diff);

    this.duration -= stepDuration;
    this.steps--;

    this.timer = setTimeout(this.accordionSize.bind(this), stepDuration);
  },

  isFinished() {
    return this.steps <= 0;
  },

  resizeBy(diff) {
    const h1Height = this.e1.offsetHeight;
    const h2Height = this.e2.offsetHeight;
    const intDiff = parseInt(diff);
    if (diff != 0) {
      this.e1.style.height = `${h1Height - intDiff}px`;
      this.e2.style.height = `${h2Height + intDiff}px`;
    }
  },

};

// -------------------- ricoLiveGrid.js

// Rico.LiveGridMetaData -----------------------------------------------------

Rico.LiveGridMetaData = Class.create();

Rico.LiveGridMetaData.prototype = {

  initialize(pageSize, totalRows, columnCount, options) {
    this.pageSize = pageSize;
    this.totalRows = totalRows;
    this.setOptions(options);
    this.scrollArrowHeight = 16;
    this.columnCount = columnCount;
  },

  setOptions(options) {
    this.options = {
      largeBufferSize: 7.0, // 7 pages
      nearLimitFactor: 0.2, // 20% of buffer
    }.extend(options || {});
  },

  getPageSize() {
    return this.pageSize;
  },

  getTotalRows() {
    return this.totalRows;
  },

  setTotalRows(n) {
    this.totalRows = n;
  },

  getLargeBufferSize() {
    return parseInt(this.options.largeBufferSize * this.pageSize);
  },

  getLimitTolerance() {
    return parseInt(this.getLargeBufferSize() * this.options.nearLimitFactor);
  },
};

// Rico.LiveGridScroller -----------------------------------------------------

Rico.LiveGridScroller = Class.create();

Rico.LiveGridScroller.prototype = {

  initialize(liveGrid, viewPort) {
    this.isIE = navigator.userAgent.toLowerCase().indexOf('msie') >= 0;
    this.liveGrid = liveGrid;
    this.metaData = liveGrid.metaData;
    this.createScrollBar();
    this.scrollTimeout = null;
    this.lastScrollPos = 0;
    this.viewPort = viewPort;
    this.rows = new Array();
  },

  isUnPlugged() {
    return this.scrollerDiv.onscroll == null;
  },

  plugin() {
    this.scrollerDiv.onscroll = this.handleScroll.bindAsEventListener(this);
  },

  unplug() {
    this.scrollerDiv.onscroll = null;
  },

  sizeIEHeaderHack() {
    if (!this.isIE) return;
    const headerTable = $(`${this.liveGrid.tableId}_header`);
    if (headerTable) headerTable.rows[0].cells[0].style.width = `${headerTable.rows[0].cells[0].offsetWidth + 1}px`;
  },

  createScrollBar() {
    const visibleHeight = this.liveGrid.viewPort.visibleHeight();
    // create the outer div...
    this.scrollerDiv = document.createElement('div');
    const scrollerStyle = this.scrollerDiv.style;
    scrollerStyle.borderRight = '1px solid #ababab'; // hard coded color!!!
    scrollerStyle.position = 'relative';
    scrollerStyle.left = this.isIE ? '-6px' : '-3px';
    scrollerStyle.width = '19px';
    scrollerStyle.height = `${visibleHeight}px`;
    scrollerStyle.overflow = 'auto';

    // create the inner div...
    this.heightDiv = document.createElement('div');
    this.heightDiv.style.width = '1px';

    this.heightDiv.style.height = `${parseInt(visibleHeight
                        * this.metaData.getTotalRows() / this.metaData.getPageSize())}px`;
    this.scrollerDiv.appendChild(this.heightDiv);
    this.scrollerDiv.onscroll = this.handleScroll.bindAsEventListener(this);

    const { table } = this.liveGrid;
    table.parentNode.parentNode.insertBefore(this.scrollerDiv, table.parentNode.nextSibling);
  },

  updateSize() {
    const { table } = this.liveGrid;
    const visibleHeight = this.viewPort.visibleHeight();
    this.heightDiv.style.height = `${parseInt(visibleHeight
                                  * this.metaData.getTotalRows() / this.metaData.getPageSize())}px`;
  },

  rowToPixel(rowOffset) {
    return (rowOffset / this.metaData.getTotalRows()) * this.heightDiv.offsetHeight;
  },

  moveScroll(rowOffset) {
    this.scrollerDiv.scrollTop = this.rowToPixel(rowOffset);
    if (this.metaData.options.onscroll) this.metaData.options.onscroll(this.liveGrid, rowOffset);
  },

  handleScroll() {
    if (this.scrollTimeout) clearTimeout(this.scrollTimeout);

    const contentOffset = parseInt(this.scrollerDiv.scrollTop / this.viewPort.rowHeight);
    this.liveGrid.requestContentRefresh(contentOffset);
    this.viewPort.scrollTo(this.scrollerDiv.scrollTop);

    if (this.metaData.options.onscroll) this.metaData.options.onscroll(this.liveGrid, contentOffset);

    this.scrollTimeout = setTimeout(this.scrollIdle.bind(this), 1200);
  },

  scrollIdle() {
    if (this.metaData.options.onscrollidle) this.metaData.options.onscrollidle();
  },
};

// Rico.LiveGridBuffer -----------------------------------------------------

Rico.LiveGridBuffer = Class.create();

Rico.LiveGridBuffer.prototype = {

  initialize(metaData, viewPort) {
    this.startPos = 0;
    this.size = 0;
    this.metaData = metaData;
    this.rows = new Array();
    this.updateInProgress = false;
    this.viewPort = viewPort;
    this.maxBufferSize = metaData.getLargeBufferSize() * 2;
    this.maxFetchSize = metaData.getLargeBufferSize();
    this.lastOffset = 0;
  },

  getBlankRow() {
    if (!this.blankRow) {
      this.blankRow = new Array();
      for (let i = 0; i < this.metaData.columnCount; i++) this.blankRow[i] = '&nbsp;';
    }
    return this.blankRow;
  },

  loadRows(ajaxResponse) {
    const rowsElement = ajaxResponse.getElementsByTagName('rows')[0];
    this.updateUI = rowsElement.getAttribute('update_ui') == 'true';
    const newRows = new Array();
    const trs = rowsElement.getElementsByTagName('tr');
    for (let i = 0; i < trs.length; i++) {
      const row = newRows[i] = new Array();
      const cells = trs[i].getElementsByTagName('td');
      for (let j = 0; j < cells.length; j++) {
        const cell = cells[j];
        const convertSpaces = cell.getAttribute('convert_spaces') == 'true';
        const cellContent = RicoUtil.getContentAsString(cell);
        row[j] = convertSpaces ? this.convertSpaces(cellContent) : cellContent;
        if (!row[j]) row[j] = '&nbsp;';
      }
    }
    return newRows;
  },

  update(ajaxResponse, start) {
    const newRows = this.loadRows(ajaxResponse);
    if (this.rows.length == 0) { // initial load
      this.rows = newRows;
      this.size = this.rows.length;
      this.startPos = start;
      return;
    }
    if (start > this.startPos) { // appending
      if (this.startPos + this.rows.length < start) {
        this.rows = newRows;
        this.startPos = start;//
      } else {
        this.rows = this.rows.concat(newRows.slice(0, newRows.length));
        if (this.rows.length > this.maxBufferSize) {
          const fullSize = this.rows.length;
          this.rows = this.rows.slice(this.rows.length - this.maxBufferSize, this.rows.length);
          this.startPos += (fullSize - this.rows.length);
        }
      }
    } else { // prepending
      if (start + newRows.length < this.startPos) {
        this.rows = newRows;
      } else {
        this.rows = newRows.slice(0, this.startPos).concat(this.rows);
        if (this.rows.length > this.maxBufferSize) this.rows = this.rows.slice(0, this.maxBufferSize);
      }
      this.startPos = start;
    }
    this.size = this.rows.length;
  },

  clear() {
    this.rows = new Array();
    this.startPos = 0;
    this.size = 0;
  },

  isOverlapping(start, size) {
    return ((start < this.endPos()) && (this.startPos < start + size)) || (this.endPos() == 0);
  },

  isInRange(position) {
    return (position >= this.startPos) && (position + this.metaData.getPageSize() <= this.endPos());
    // && this.size()  != 0;
  },

  isNearingTopLimit(position) {
    return position - this.startPos < this.metaData.getLimitTolerance();
  },

  endPos() {
    return this.startPos + this.rows.length;
  },

  isNearingBottomLimit(position) {
    return this.endPos() - (position + this.metaData.getPageSize()) < this.metaData.getLimitTolerance();
  },

  isAtTop() {
    return this.startPos == 0;
  },

  isAtBottom() {
    return this.endPos() == this.metaData.getTotalRows();
  },

  isNearingLimit(position) {
    return (!this.isAtTop() && this.isNearingTopLimit(position))
             || (!this.isAtBottom() && this.isNearingBottomLimit(position));
  },

  getFetchSize(offset) {
    const adjustedOffset = this.getFetchOffset(offset);
    var adjustedSize = 0;
    if (adjustedOffset >= this.startPos) { // apending
      let endFetchOffset = this.maxFetchSize + adjustedOffset;
      if (endFetchOffset > this.metaData.totalRows) endFetchOffset = this.metaData.totalRows;
      adjustedSize = endFetchOffset - adjustedOffset;
    } else { // prepending
      var adjustedSize = this.startPos - adjustedOffset;
      if (adjustedSize > this.maxFetchSize) adjustedSize = this.maxFetchSize;
    }
    return adjustedSize;
  },

  getFetchOffset(offset) {
    var adjustedOffset = offset;
    if (offset > this.startPos) // apending
    { adjustedOffset = (offset > this.endPos()) ? offset : this.endPos(); } else { // prepending
      if (offset + this.maxFetchSize >= this.startPos) {
        var adjustedOffset = this.startPos - this.maxFetchSize;
        if (adjustedOffset < 0) adjustedOffset = 0;
      }
    }
    this.lastOffset = adjustedOffset;
    return adjustedOffset;
  },

  getRows(start, count) {
    const begPos = start - this.startPos;
    let endPos = begPos + count;

    // er? need more data...
    if (endPos > this.size) endPos = this.size;

    const results = new Array();
    let index = 0;
    for (let i = begPos; i < endPos; i++) {
      results[index++] = this.rows[i];
    }
    return results;
  },

  convertSpaces(s) {
    return s.split(' ').join('&nbsp;');
  },

};

// Rico.GridViewPort --------------------------------------------------
Rico.GridViewPort = Class.create();

Rico.GridViewPort.prototype = {

  initialize(table, rowHeight, visibleRows, buffer, liveGrid) {
    this.lastDisplayedStartPos = 0;
    this.div = table.parentNode;
    this.table = table;
    this.rowHeight = rowHeight;
    this.div.style.height = this.rowHeight * visibleRows;
    this.div.style.overflow = 'hidden';
    this.buffer = buffer;
    this.liveGrid = liveGrid;
    this.visibleRows = visibleRows + 1;
    this.lastPixelOffset = 0;
    this.startPos = 0;
  },

  populateRow(htmlRow, row) {
    for (let j = 0; j < row.length; j++) {
      htmlRow.cells[j].innerHTML = row[j];
    }
  },

  bufferChanged() {
    this.refreshContents(parseInt(this.lastPixelOffset / this.rowHeight));
  },

  clearRows() {
    if (!this.isBlank) {
      for (let i = 0; i < this.visibleRows; i++) this.populateRow(this.table.rows[i], this.buffer.getBlankRow());
      this.isBlank = true;
    }
  },

  clearContents() {
    this.clearRows();
    this.scrollTo(0);
    this.startPos = 0;
    this.lastStartPos = -1;
  },

  refreshContents(startPos) {
    if (startPos == this.lastRowPos && !this.isPartialBlank && !this.isBlank) {
      return;
    }
    if ((startPos + this.visibleRows < this.buffer.startPos)
          || (this.buffer.startPos + this.buffer.size < startPos)
          || (this.buffer.size == 0)) {
      this.clearRows();
      return;
    }
    this.isBlank = false;
    const viewPrecedesBuffer = this.buffer.startPos > startPos;
    const contentStartPos = viewPrecedesBuffer ? this.buffer.startPos : startPos;

    const contentEndPos = (this.buffer.startPos + this.buffer.size < startPos + this.visibleRows)
      ? this.buffer.startPos + this.buffer.size
      : startPos + this.visibleRows;
    const rowSize = contentEndPos - contentStartPos;
    const rows = this.buffer.getRows(contentStartPos, rowSize);
    const blankSize = this.visibleRows - rowSize;
    const blankOffset = viewPrecedesBuffer ? 0 : rowSize;
    const contentOffset = viewPrecedesBuffer ? blankSize : 0;

    for (var i = 0; i < rows.length; i++) { // initialize what we have
      this.populateRow(this.table.rows[i + contentOffset], rows[i]);
    }
    for (var i = 0; i < blankSize; i++) { // blank out the rest
      this.populateRow(this.table.rows[i + blankOffset], this.buffer.getBlankRow());
    }
    this.isPartialBlank = blankSize > 0;
    this.lastRowPos = startPos;
  },

  scrollTo(pixelOffset) {
    if (this.lastPixelOffset == pixelOffset) return;

    this.refreshContents(parseInt(pixelOffset / this.rowHeight));
    this.div.scrollTop = pixelOffset % this.rowHeight;

    this.lastPixelOffset = pixelOffset;
  },

  visibleHeight() {
    return parseInt(this.div.style.height);
  },

};

Rico.LiveGridRequest = Class.create();
Rico.LiveGridRequest.prototype = {
  initialize(requestOffset, options) {
    this.requestOffset = requestOffset;
  },
};

// Rico.LiveGrid -----------------------------------------------------

Rico.LiveGrid = Class.create();

Rico.LiveGrid.prototype = {

  initialize(tableId, visibleRows, totalRows, url, options) {
    if (options == null) options = {};

    this.tableId = tableId;
    this.table = $(tableId);
    const columnCount = this.table.rows[0].cells.length;
    this.metaData = new Rico.LiveGridMetaData(visibleRows, totalRows, columnCount, options);
    this.buffer = new Rico.LiveGridBuffer(this.metaData);

    const rowCount = this.table.rows.length;
    this.viewPort = new Rico.GridViewPort(this.table,
      this.table.offsetHeight / rowCount,
      visibleRows,
      this.buffer, this);
    this.scroller = new Rico.LiveGridScroller(this, this.viewPort);

    this.additionalParms = options.requestParameters || [];

    options.sortHandler = this.sortHandler.bind(this);

    if ($(`${tableId}_header`)) this.sort = new Rico.LiveGridSort(`${tableId}_header`, options);

    this.processingRequest = null;
    this.unprocessedRequest = null;

    this.initAjax(url);
    if (options.prefetchBuffer || options.prefetchOffset > 0) {
      let offset = 0;
      if (options.offset) {
        offset = options.offset;
        this.scroller.moveScroll(offset);
        this.viewPort.scrollTo(this.scroller.rowToPixel(offset));
      }
      if (options.sortCol) {
        this.sortCol = options.sortCol;
        this.sortDir = options.sortDir;
      }
      this.requestContentRefresh(offset);
    }
  },

  resetContents() {
    this.scroller.moveScroll(0);
    this.buffer.clear();
    this.viewPort.clearContents();
  },

  sortHandler(column) {
    this.sortCol = column.name;
    this.sortDir = column.currentSort;

    this.resetContents();
    this.requestContentRefresh(0);
  },

  setRequestParams() {
    this.additionalParms = [];
    for (let i = 0; i < arguments.length; i++) this.additionalParms[i] = arguments[i];
  },

  setTotalRows(newTotalRows) {
    this.resetContents();
    this.metaData.setTotalRows(newTotalRows);
    this.scroller.updateSize();
  },

  initAjax(url) {
    ajaxEngine.registerRequest(`${this.tableId}_request`, url);
    ajaxEngine.registerAjaxObject(`${this.tableId}_updater`, this);
  },

  invokeAjax() {
  },

  handleTimedOut() {
    // server did not respond in 4 seconds... assume that there could have been
    // an error or something, and allow requests to be processed again...
    this.processingRequest = null;
    this.processQueuedRequest();
  },

  fetchBuffer(offset) {
    if (this.buffer.isInRange(offset)
         && !this.buffer.isNearingLimit(offset)) {
      return;
    }
    if (this.processingRequest) {
      this.unprocessedRequest = new Rico.LiveGridRequest(offset);
      return;
    }
    const bufferStartPos = this.buffer.getFetchOffset(offset);
    this.processingRequest = new Rico.LiveGridRequest(offset);
    this.processingRequest.bufferOffset = bufferStartPos;
    const fetchSize = this.buffer.getFetchSize(offset);
    const partialLoaded = false;
    const callParms = [];
    callParms.push(`${this.tableId}_request`);
    callParms.push(`id=${this.tableId}`);
    callParms.push(`page_size=${fetchSize}`);
    callParms.push(`offset=${bufferStartPos}`);
    if (this.sortCol) {
      callParms.push(`sort_col=${this.sortCol}`);
      callParms.push(`sort_dir=${this.sortDir}`);
    }

    for (let i = 0; i < this.additionalParms.length; i++) callParms.push(this.additionalParms[i]);
    ajaxEngine.sendRequest.apply(ajaxEngine, callParms);

    this.timeoutHandler = setTimeout(this.handleTimedOut.bind(this), 20000); // todo: make as option
  },

  requestContentRefresh(contentOffset) {
    this.fetchBuffer(contentOffset);
  },

  ajaxUpdate(ajaxResponse) {
    try {
      clearTimeout(this.timeoutHandler);
      this.buffer.update(ajaxResponse, this.processingRequest.bufferOffset);
      this.viewPort.bufferChanged();
    } catch (err) {} finally { this.processingRequest = null; }
    this.processQueuedRequest();
  },

  processQueuedRequest() {
    if (this.unprocessedRequest != null) {
      this.requestContentRefresh(this.unprocessedRequest.requestOffset);
      this.unprocessedRequest = null;
    }
  },

};

// -------------------- ricoLiveGridSort.js
Rico.LiveGridSort = Class.create();

Rico.LiveGridSort.prototype = {

  initialize(headerTableId, options) {
    this.headerTableId = headerTableId;
    this.headerTable = $(headerTableId);
    this.setOptions(options);
    this.applySortBehavior();

    if (this.options.sortCol) {
      this.setSortUI(this.options.sortCol, this.options.sortDir);
    }
  },

  setSortUI(columnName, sortDirection) {
    const cols = this.options.columns;
    for (let i = 0; i < cols.length; i++) {
      if (cols[i].name == columnName) {
        this.setColumnSort(i, sortDirection);
        break;
      }
    }
  },

  setOptions(options) {
    this.options = {
      sortAscendImg: 'images/sort_asc.gif',
      sortDescendImg: 'images/sort_desc.gif',
      imageWidth: 9,
      imageHeight: 5,
      ajaxSortURLParms: [],
    }.extend(options);

    // preload the images...
    new Image().src = this.options.sortAscendImg;
    new Image().src = this.options.sortDescendImg;

    this.sort = options.sortHandler;
    if (!this.options.columns) this.options.columns = this.introspectForColumnInfo();
    else {
      // allow client to pass { columns: [ ["a", true], ["b", false] ] }
      // and convert to an array of Rico.TableColumn objs...
      this.options.columns = this.convertToTableColumns(this.options.columns);
    }
  },

  applySortBehavior() {
    const headerRow = this.headerTable.rows[0];
    const headerCells = headerRow.cells;
    for (let i = 0; i < headerCells.length; i++) {
      this.addSortBehaviorToColumn(i, headerCells[i]);
    }
  },

  addSortBehaviorToColumn(n, cell) {
    if (this.options.columns[n].isSortable()) {
      cell.id = `${this.headerTableId}_${n}`;
      cell.style.cursor = 'pointer';
      cell.onclick = this.headerCellClicked.bindAsEventListener(this);
      cell.innerHTML = `${cell.innerHTML}<span id="${this.headerTableId}_img_${n}">`
                           + '&nbsp;&nbsp;&nbsp;</span>';
    }
  },

  // event handler....
  headerCellClicked(evt) {
    const eventTarget = evt.target ? evt.target : evt.srcElement;
    const cellId = eventTarget.id;
    const columnNumber = parseInt(cellId.substring(cellId.lastIndexOf('_') + 1));
    const sortedColumnIndex = this.getSortedColumnIndex();
    if (sortedColumnIndex != -1) {
      if (sortedColumnIndex != columnNumber) {
        this.removeColumnSort(sortedColumnIndex);
        this.setColumnSort(columnNumber, Rico.TableColumn.SORT_ASC);
      } else this.toggleColumnSort(sortedColumnIndex);
    } else this.setColumnSort(columnNumber, Rico.TableColumn.SORT_ASC);

    if (this.options.sortHandler) {
      this.options.sortHandler(this.options.columns[columnNumber]);
    }
  },

  removeColumnSort(n) {
    this.options.columns[n].setUnsorted();
    this.setSortImage(n);
  },

  setColumnSort(n, direction) {
    this.options.columns[n].setSorted(direction);
    this.setSortImage(n);
  },

  toggleColumnSort(n) {
    this.options.columns[n].toggleSort();
    this.setSortImage(n);
  },

  setSortImage(n) {
    const sortDirection = this.options.columns[n].getSortDirection();

    const sortImageSpan = $(`${this.headerTableId}_img_${n}`);
    if (sortDirection == Rico.TableColumn.UNSORTED) sortImageSpan.innerHTML = '&nbsp;&nbsp;';
    else if (sortDirection == Rico.TableColumn.SORT_ASC) {
      sortImageSpan.innerHTML = `&nbsp;&nbsp;<img width="${this.options.imageWidth}" `
                                                     + `height="${this.options.imageHeight}" `
                                                     + `src="${this.options.sortAscendImg}"/>`;
    } else if (sortDirection == Rico.TableColumn.SORT_DESC) {
      sortImageSpan.innerHTML = `&nbsp;&nbsp;<img width="${this.options.imageWidth}" `
                                                     + `height="${this.options.imageHeight}" `
                                                     + `src="${this.options.sortDescendImg}"/>`;
    }
  },

  getSortedColumnIndex() {
    const cols = this.options.columns;
    for (let i = 0; i < cols.length; i++) {
      if (cols[i].isSorted()) return i;
    }

    return -1;
  },

  introspectForColumnInfo() {
    const columns = new Array();
    const headerRow = this.headerTable.rows[0];
    const headerCells = headerRow.cells;
    for (let i = 0; i < headerCells.length; i++) columns.push(new Rico.TableColumn(this.deriveColumnNameFromCell(headerCells[i], i), true));
    return columns;
  },

  convertToTableColumns(cols) {
    const columns = new Array();
    for (let i = 0; i < cols.length; i++) columns.push(new Rico.TableColumn(cols[i][0], cols[i][1]));
  },

  deriveColumnNameFromCell(cell, columnNumber) {
    const cellContent = cell.innerText != undefined ? cell.innerText : cell.textContent;
    return cellContent ? cellContent.toLowerCase().split(' ').join('_') : `col_${columnNumber}`;
  },
};

Rico.TableColumn = Class.create();

Rico.TableColumn.UNSORTED = 0;
Rico.TableColumn.SORT_ASC = 'ASC';
Rico.TableColumn.SORT_DESC = 'DESC';

Rico.TableColumn.prototype = {
  initialize(name, sortable) {
    this.name = name;
    this.sortable = sortable;
    this.currentSort = Rico.TableColumn.UNSORTED;
  },

  isSortable() {
    return this.sortable;
  },

  isSorted() {
    return this.currentSort != Rico.TableColumn.UNSORTED;
  },

  getSortDirection() {
    return this.currentSort;
  },

  toggleSort() {
    if (this.currentSort == Rico.TableColumn.UNSORTED || this.currentSort == Rico.TableColumn.SORT_DESC) this.currentSort = Rico.TableColumn.SORT_ASC;
    else if (this.currentSort == Rico.TableColumn.SORT_ASC) this.currentSort = Rico.TableColumn.SORT_DESC;
  },

  setUnsorted(direction) {
    this.setSorted(Rico.TableColumn.UNSORTED);
  },

  setSorted(direction) {
    // direction must by one of Rico.TableColumn.UNSORTED, .SORT_ASC, or .SET_DESC...
    this.currentSort = direction;
  },

};

// -------------------- ricoUtil.js

var RicoUtil = {

  getElementsComputedStyle(htmlElement, cssProperty, mozillaEquivalentCSS) {
    if (arguments.length == 2) mozillaEquivalentCSS = cssProperty;

    const el = $(htmlElement);
    if (el.currentStyle) return el.currentStyle[cssProperty];
    return document.defaultView.getComputedStyle(el, null).getPropertyValue(mozillaEquivalentCSS);
  },

  createXmlDocument() {
    if (document.implementation && document.implementation.createDocument) {
      const doc = document.implementation.createDocument('', '', null);

      if (doc.readyState == null) {
        doc.readyState = 1;
        doc.addEventListener('load', () => {
          doc.readyState = 4;
          if (typeof doc.onreadystatechange === 'function') doc.onreadystatechange();
        }, false);
      }

      return doc;
    }

    if (window.ActiveXObject) {
      return Try.these(
        () => new ActiveXObject('MSXML2.DomDocument'),
        () => new ActiveXObject('Microsoft.DomDocument'),
        () => new ActiveXObject('MSXML.DomDocument'),
        () => new ActiveXObject('MSXML3.DomDocument'),
      ) || false;
    }

    return null;
  },

  getContentAsString(parentNode) {
    return parentNode.xml != undefined
      ? this._getContentAsStringIE(parentNode)
      : this._getContentAsStringMozilla(parentNode);
  },

  _getContentAsStringIE(parentNode) {
    let contentStr = '';
    for (let i = 0; i < parentNode.childNodes.length; i++) contentStr += parentNode.childNodes[i].xml;
    return contentStr;
  },

  _getContentAsStringMozilla(parentNode) {
    const xmlSerializer = new XMLSerializer();
    let contentStr = '';
    for (let i = 0; i < parentNode.childNodes.length; i++) contentStr += xmlSerializer.serializeToString(parentNode.childNodes[i]);
    return contentStr;
  },

  toViewportPosition(element) {
    return this._toAbsolute(element, true);
  },

  toDocumentPosition(element) {
    return this._toAbsolute(element, false);
  },

  /**
    *  Compute the elements position in terms of the window viewport
    *  so that it can be compared to the position of the mouse (dnd)
    *  This is additions of all the offsetTop,offsetLeft values up the
    *  offsetParent hierarchy, ...taking into account any scrollTop,
    *  scrollLeft values along the way...
    *
    * IE has a bug reporting a correct offsetLeft of elements within a
    * a relatively positioned parent!!!
    * */
  _toAbsolute(element, accountForDocScroll) {
    if (navigator.userAgent.toLowerCase().indexOf('msie') == -1) return this._toAbsoluteMozilla(element, accountForDocScroll);

    let x = 0;
    let y = 0;
    let parent = element;
    while (parent) {
      var borderXOffset = 0;
      var borderYOffset = 0;
      if (parent != element) {
        var borderXOffset = parseInt(this.getElementsComputedStyle(parent, 'borderLeftWidth'));
        var borderYOffset = parseInt(this.getElementsComputedStyle(parent, 'borderTopWidth'));
        borderXOffset = isNaN(borderXOffset) ? 0 : borderXOffset;
        borderYOffset = isNaN(borderYOffset) ? 0 : borderYOffset;
      }

      x += parent.offsetLeft - parent.scrollLeft + borderXOffset;
      y += parent.offsetTop - parent.scrollTop + borderYOffset;
      parent = parent.offsetParent;
    }

    if (accountForDocScroll) {
      x -= this.docScrollLeft();
      y -= this.docScrollTop();
    }

    return { x, y };
  },

  /**
    *  Mozilla did not report all of the parents up the hierarchy via the
    *  offsetParent property that IE did.  So for the calculation of the
    *  offsets we use the offsetParent property, but for the calculation of
    *  the scrollTop/scrollLeft adjustments we navigate up via the parentNode
    *  property instead so as to get the scroll offsets...
    *
    * */
  _toAbsoluteMozilla(element, accountForDocScroll) {
    let x = 0;
    let y = 0;
    let parent = element;
    while (parent) {
      x += parent.offsetLeft;
      y += parent.offsetTop;
      parent = parent.offsetParent;
    }

    parent = element;
    while (parent
              && parent != document.body
              && parent != document.documentElement) {
      if (parent.scrollLeft) x -= parent.scrollLeft;
      if (parent.scrollTop) y -= parent.scrollTop;
      parent = parent.parentNode;
    }

    if (accountForDocScroll) {
      x -= this.docScrollLeft();
      y -= this.docScrollTop();
    }

    return { x, y };
  },

  docScrollLeft() {
    if (window.pageXOffset) return window.pageXOffset;
    if (document.documentElement && document.documentElement.scrollLeft) return document.documentElement.scrollLeft;
    if (document.body) return document.body.scrollLeft;
    return 0;
  },

  docScrollTop() {
    if (window.pageYOffset) return window.pageYOffset;
    if (document.documentElement && document.documentElement.scrollTop) return document.documentElement.scrollTop;
    if (document.body) return document.body.scrollTop;
    return 0;
  },

};
