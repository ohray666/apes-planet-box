import React from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
// import './leaflet.textpath';
import { Path } from 'react-leaflet';

(function() {
  // tslint:disable-next-line:variable-name
  let __onAdd = L.Polyline.prototype.onAdd;
  // tslint:disable-next-line:variable-name
  let __onRemove = L.Polyline.prototype.onRemove;
  // tslint:disable-next-line:variable-name
  let __updatePath = (L.Polyline.prototype)._updatePath;
  // tslint:disable-next-line:variable-name
  let __bringToFront = L.Polyline.prototype.bringToFront;

  let PolylineTextPath = {
    onAdd: function(map) {
      __onAdd.call(this, map);
      this._textRedraw();
    },

    onRemove: function(map) {
      map = map || this._map;
      if (
        map &&
        this._textNode &&
        map._renderer._container &&
        map._renderer._container.contains(this._textNode)
      ) {
        map._renderer._container.removeChild(this._textNode);
      }
      __onRemove.call(this, map);
    },

    bringToFront: function() {
      __bringToFront.call(this);
      this._textRedraw();
    },

    _updatePath: function() {
      __updatePath.call(this);
      this._textRedraw();
    },

    _textRedraw: function() {
      let text = this._text;
      let options = this._textOptions;
      if (text) {
        this.setText(null).setText(text, options);
      }
    },

    setText: function(text, options) {
      this._text = text;
      this._textOptions = options;

      /* If not in SVG mode or Polyline not added to map yet return */
      /* setText will be called by onAdd, using value stored in this._text */
      if (!L.Browser.svg || typeof this._map === 'undefined') {
        return this;
      }

      let defaults = {
        repeat: false,
        fillColor: 'black',
        attributes: {},
        below: false,
      };
      options = L.Util.extend(defaults, options);

      /* If empty text, hide */
      if (!text) {
        if (this._textNode && this._textNode.parentNode) {
          this._textNode.parentNode.removeChild(this._textNode);

          /* delete the node, so it will not be removed a 2nd time if the layer is later removed from the map */
          delete this._textNode;
        }
        return this;
      }

      text = text.replace(/ /g, '\u00A0'); // Non breakable spaces
      let id = 'pathdef-' + L.Util.stamp(this);
      let svg = this._map._renderer._container;
      this._path.setAttribute('id', id);

      if (options.repeat) {
        /* Compute single pattern length */
        let pattern = L.SVG.create('text');
        for (let key in options.attributes) {
          pattern.setAttribute(key, options.attributes[key]);
        }
        pattern.appendChild(document.createTextNode(text));
        svg.appendChild(pattern);
        let alength = pattern.getComputedTextLength();
        svg.removeChild(pattern);

        /* Create string as long as path */
        text = new Array(Math.ceil(this._path.getTotalLength() / alength)).join(text);
      }

      /* Put it along the path using textPath */
      let textNode = L.SVG.create('text');
      let textPath = L.SVG.create('textPath');

      let dy = options.offset || this._path.getAttribute('stroke-width');

      textPath.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + id);
      textNode.setAttribute('dy', dy);
      for (let key in options.attributes) {
        textNode.setAttribute(key, options.attributes[key]);
      }
      textPath.appendChild(document.createTextNode(text));
      textNode.appendChild(textPath);
      this._textNode = textNode;

      if (options.below) {
        svg.insertBefore(textNode, svg.firstChild);
      } else {
        svg.appendChild(textNode);
      }

      /* Center text according to the path's bounding box */
      if (options.center) {
        let textLength = textNode.getComputedTextLength();
        let pathLength = this._path.getTotalLength();
        /* Set the position for the left side of the textNode */
        textNode.setAttribute('dx', pathLength / 2 - textLength / 2);
      }

      /* Change label rotation (if required) */
      if (options.orientation) {
        let rotateAngle = 0;
        switch (options.orientation) {
          case 'flip':
            rotateAngle = 180;
            break;
          case 'perpendicular':
            rotateAngle = 90;
            break;
          default:
            rotateAngle = options.orientation;
        }

        let rotatecenterX = textNode.getBBox().x + textNode.getBBox().width / 2;
        let rotatecenterY = textNode.getBBox().y + textNode.getBBox().height / 2;
        textNode.setAttribute(
          'transform',
          'rotate(' + rotateAngle + ' ' + rotatecenterX + ' ' + rotatecenterY + ')',
        );
      }

      /* Initialize mouse events for the additional nodes */
      if (this.options.clickable) {
        if (L.Browser.svg || !L.Browser.vml) {
          textPath.setAttribute('class', 'leaflet-clickable');
        }

        L.DomEvent.on(textNode, 'click', this._onMouseClick, this);

        let events = ['dblclick', 'mousedown', 'mouseover', 'mouseout', 'mousemove', 'contextmenu'];
        for (let i = 0; i < events.length; i++) {
          L.DomEvent.on(textNode, events[i], this._fireMouseEvent, this);
        }
      }

      return this;
    },
  };

  L.Polyline.include(PolylineTextPath);

  L.LayerGroup.include({
    setText: function(text, options) {
      for (let layer in this._layers) {
        if (typeof this._layers[layer].setText === 'function') {
          this._layers[layer].setText(text, options);
        }
      }
      return this;
    },
  });
})();

class PolylineText extends Path {
  static propTypes = {
    positions: PropTypes.array.isRequired,
    textPathOptions: PropTypes.object,
  };
  createLeafletElement(props) {
    const { textPathOptions } = props;
    let line = L.polyline(props.positions, this.getOptions(props));
    if (textPathOptions) {
      line.setText(textPathOptions.text, textPathOptions);
    }
    return line;
  }
  updateLeafletElement(fromProps, toProps) {
    if (toProps.positions !== fromProps.positions) {
      this.leafletElement.setLatLngs(toProps.positions);
    }
    this.setStyleIfChanged(fromProps, toProps);
  }
}

export default PolylineText;
