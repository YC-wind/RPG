/*

2D Game Sprite Library, Built using JavaScript ES6
Copyright (C) 2015 qhduan(http://qhduan.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

/// @file SpriteCanvas.js
/// @namespace Sprite
/// class Sprite.Canvas

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  "use strict";

  Sprite.Canvas = (function () {
    _createClass(Canvas, null, [{
      key: "support",
      value: function support() {
        var canvas = document.createElement("canvas");
        var gl = canvas.getContext("2d");
        if (gl) {
          return true;
        }
        return false;
      }
    }]);

    function Canvas(width, height) {
      _classCallCheck(this, Canvas);

      var canvas = document.createElement("canvas");
      canvas.width = width || 640;
      canvas.height = height || 480;

      var context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Sprite.Canvas canvas is not supported");
      }

      console.log("canvas inited");

      this._canvas = canvas;
      this._context = context;
    }

    _createClass(Canvas, [{
      key: "drawImage",
      value: function drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh) {
        if (!image.width || !image.height || image.width <= 0 || image.height <= 0) {
          console.error(image);
          throw new Error("drawImage invalid image");
        }

        this._context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
      }
    }, {
      key: "clear",
      value: function clear() {
        this._context.fillStyle = "black";
        this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
      }
    }, {
      key: "width",
      get: function get() {
        return this._canvas.width;
      },
      set: function set(value) {
        if (value != this._canvas.width) {
          this._canvas.width = value;
        }
      }
    }, {
      key: "height",
      get: function get() {
        return this._canvas.height;
      },
      set: function set(value) {
        if (value != this._canvas.height) {
          this._canvas.height = value;
        }
      }
    }, {
      key: "canvas",
      get: function get() {
        return this._canvas;
      },
      set: function set(value) {
        throw new Error("Sprite.Canvas.canvas cannot write");
      }
    }]);

    return Canvas;
  })();
})();
//# sourceMappingURL=SpriteCanvas.js.map
