/*

A-RPG Game, Built using Node.js + JavaScript + ES6
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
(function () {
  "use strict";

  Game.ItemClass = class ItemClass extends Sprite.Event {
    constructor (itemData) {
      super();

      this.data = itemData;
      this.id = this.data.id;

      var loader = new Sprite.Loader();
      loader.add(`/item/${this.data.image}`);
      loader.start();
      loader.on("complete", (event) => {
        var image = event.data[0];

        this.bitmap = new Sprite.Bitmap(image);
        this.bitmap.center.x = image.width / 2;
        this.bitmap.center.y = image.height / 2;
        this.bitmap.name = this.id;

        // 发送完成事件，第二个参数代表一次性事件
        this.emit("complete", true);
      });
    }

    clone (callback) {
      var self = this;

      var itemObj = new ItemClass(this.data);
      itemObj.on("complete", callback);
    }

    draw (layer, x, y) {
      var self = this;

      this.bitmap.x = x;
      this.bitmap.y = y;

      layer.appendChild(this.bitmap);
    }

  };

})();