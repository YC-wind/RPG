/*

A-RPG Game, Built using JavaScript ES6
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

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  "use strict";

  Game.Archive = (function () {
    function GameArchive() {
      _classCallCheck(this, GameArchive);
    }

    _createClass(GameArchive, null, [{
      key: "remove",
      value: function remove(id) {
        if (window.localStorage.getItem(id)) {
          window.localStorage.removeItem(id);
        }
      }

      // 返回所有存档，Object格式
    }, {
      key: "list",
      value: function list() {
        var keys = [];
        for (var key in window.localStorage) {
          if (key.match(/^SAVE_(\d+)$/)) {
            keys.push(parseInt(key.match(/^SAVE_(\d+)$/)[1]));
          }
        }
        keys.sort();
        keys.reverse();
        return keys;
      }

      // 返回最新存档，Object格式
    }, {
      key: "last",
      value: function last() {
        var list = Game.Archive.list();
        if (list.length > 0) {
          var last = list[0];
          return JSON.parse(window.localStorage.getItem("SAVE_" + last));
        } else {
          return null;
        }
      }
    }, {
      key: "clear",
      value: function clear() {
        for (var key in window.localStorage) {
          if (key.match(/^SAVE_(\d+)$/)) {
            window.localStorage.removeItem(key);
          }
        }
      }
    }, {
      key: "save",
      value: function save(data) {
        var now = new Date();
        var id = now.getTime();

        data.id = id;
        data.name = data.hero.name;
        data.date = now.toLocaleString();

        window.localStorage.setItem("SAVE_" + id, JSON.stringify(data));
      }
    }, {
      key: "get",
      value: function get(id) {
        if (id && window.localStorage.getItem(id)) {
          return JSON.parse(window.localStorage.getItem(id));
        }
        return null;
      }
    }, {
      key: "load",
      value: function load(id) {
        var data = Game.Archive.get(id);
        if (!data) {
          data = Game.Archive.last();
        }

        if (data) {
          (function () {

            Game.windows.loading.begin();

            var heroData = data.hero;

            console.time("hero");

            Game.drawHero(heroData.custom, function (heroImage) {
              heroData.image = heroImage;
              Game.hero = new Game.Actor(heroData);

              Game.hero.on("complete", function () {

                console.timeEnd("hero");
                console.time("area");

                Game.loadArea(heroData.area, function (area) {

                  console.timeEnd("area");
                  console.time("other1");

                  Game.area = area;
                  area.map.draw(Game.layers.mapLayer);

                  console.timeEnd("other1");
                  console.time("other1.5");

                  if (!Number.isInteger(Game.hero.data.x) || !Number.isInteger(Game.hero.data.y)) {
                    if (area.map.data.entry && Number.isInteger(area.map.data.entry.x) && Number.isInteger(area.map.data.entry.y)) {
                      Game.hero.data.x = area.map.data.entry.x;
                      Game.hero.data.y = area.map.data.entry.y;
                    } else {
                      console.error(Game.hero.data.x, Game.hero.data.y, area.map.data.entry, Game.hero, area.map.data);
                      throw new Error("Invalid hero position");
                    }
                  }

                  area.actors.add(Game.hero);

                  console.timeEnd("other1.5");
                  console.time("other2");
                  Game.hero.draw(Game.layers.actorLayer);
                  Game.hero.focus();
                  console.timeEnd("other2");
                  console.time("other3");
                  Game.windows.main.hide();
                  Game.windows["interface"].show();
                  console.timeEnd("other3");
                  console.time("other4");
                  Game.AI.attach(Game.hero);
                  Game.start();
                  console.timeEnd("other4");

                  Game.windows.loading.end();
                });
              });
            });
          })();
        } else {
          console.error("id:", id);
          throw "Invalid id, Game.Archive.load";
        }
      }
    }]);

    return GameArchive;
  })();
})();