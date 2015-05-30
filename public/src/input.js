/*

Online A-RPG Game, Built using Node.js + createjs
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

  var keyTable = {
    "left": 37,
    "up": 38,
    "right": 39,
    "down": 40,
    "shift": 16,
    "a": 65,
    "b": 66,
    "c": 67,
    "d": 68,
    "e": 69,
    "f": 70,
    "g": 71,
    "h": 72,
    "i": 73,
    "j": 74,
    "k": 75,
    "l": 76,
    "m": 77,
    "n": 78,
    "o": 79,
    "p": 80,
    "q": 81,
    "r": 82,
    "s": 83,
    "t": 84,
    "u": 85,
    "v": 86,
    "w": 87,
    "x": 88,
    "y": 89,
    "z": 90,
    "0": 48,
    "1": 49,
    "2": 50,
    "3": 51,
    "4": 52,
    "5": 53,
    "6": 54,
    "7": 55,
    "8": 56,
    "9": 57
  };

  var pressed = {};

  // 封装Game.key.isPressed方法，用来检测某个案件是否按下
  // usage: if (Game.key.isPressed("left")) { /* true */ } else { /* false */ }
  Game.key = {
    isPressed: function (keyStr) {
      if (pressed.hasOwnProperty(keyStr))
        return pressed[keyStr];
      return pressed[keyTable[keyStr]];
    }
  };

  function HotKey (keyCode) {
    if (keyCode == keyTable["m"]) { // map
      Game.ui.openMap();
    }
    if (keyCode == keyTable["i"]) { // map
      Game.ui.openInformation();
    }
    if (keyCode == keyTable["b"]) { // map
      Game.ui.openItem();
    }
    if (keyCode == keyTable["e"]) { // map
      if (Game.hintObject && Game.hintObject.use) {
        Game.hintObject.use();
      }
    }
  };

  Game.oninit(function () {

    Game.stage.on("stagemousedown", function (event) {
      pressed["mouse"] = true;
      //Game.hero.gotoXY(x, y);
      //console.log(event.stageX / Game.stage.scaleX, event.stageY / Game.stage.scaleY);
    });

    Game.stage.on("stagemouseup", function (event) {
      if (pressed["mouse"]) delete pressed["mouse"];
    });

    Game.stage.on("mouseleave", function (event) { // mouse leave canvas
      if (pressed["mouse"]) delete pressed["mouse"];
    });

    window.addEventListener("keydown", function (event) {
      event = event || window.event;
      var keyCode = event.keyCode;

      pressed[keyCode] = true;
      HotKey(keyCode);
    });

    window.addEventListener("keyup", function (event) {
      event = event || window.event;
      var keyCode = event.keyCode;

      if (pressed.hasOwnProperty(keyCode)) {
        delete pressed[keyCode];
      }
    });

    createjs.Ticker.on("tick", function () {

      if (!Game.hero) return;
      if (!Game.area) return;
      if (!Game.area.map) return;

      var speed = Game.config.walk;
      var skew = Game.config.walk / 1.4;

      if (Game.key.isPressed("shift")) { // run key
        speed = Game.config.run;
        skew = Game.config.run / 1.4;
      }

      var state;
      if (Game.key.isPressed("shift"))
        state = "run";
      else
        state = "walk";

      var moved = false;
      // 计算八个方向角色的动画和面向
      if (Game.key.isPressed("up") && Game.key.isPressed("right")) {
        moved = Game.hero.go(state, "upright", skew);
        //moved = Game.hero.go(state + "right", skew);
      } else if (Game.key.isPressed("down") && Game.key.isPressed("right")) {
        moved = Game.hero.go(state, "downright", skew);
        //moved = Game.hero.go(state + "right", skew);
      } else if (Game.key.isPressed("down") && Game.key.isPressed("left")) {
        moved = Game.hero.go(state, "downleft", skew);
        //moved = Game.hero.go(state + "left", skew);
      } else if (Game.key.isPressed("up") && Game.key.isPressed("left")) {
        moved = Game.hero.go(state, "upleft", skew);
        //moved = Game.hero.go(state + "left", skew);
      } else if (Game.key.isPressed("left")) {
        moved = Game.hero.go(state, "left", speed);
      } else if (Game.key.isPressed("up")) {
        moved = Game.hero.go(state, "up", speed);
      } else if (Game.key.isPressed("right")) {
        moved = Game.hero.go(state, "right", speed);
      } else if (Game.key.isPressed("down")) {
        moved = Game.hero.go(state, "down", speed);
      } else {
        Game.hero.stop();
      }

      function FindHint () {

        var minDistance = 9999;
        var minObject = null;

        for (var key in Game.area.actors) {
          (function (id, actor) {
            if (!actor.data.use) return;
            var d = Game.hero.distance(actor.x, actor.y);
            if (d < minDistance) {
              minDistance = d;
              minObject = actor;
            }
          })(key, Game.area.actors[key]);
        }

        if (Game.hintObject) {
          if (Game.hero.distance(Game.hintObject.x, Game.hintObject.y) >= 30) {
            Game.dialogueLayer.removeChild(Game.hintFlag);
            Game.hintFlag = null;
            Game.hintObject = null;
          }
        }

        if (minObject) {
          if (minObject != Game.hintObject && minDistance < 30) {
            Game.hintObject = minObject;
            if (Game.hintFlag) {
              Game.dialogueLayer.removeChild(Game.hintFlag);
              Game.hintFlag = null;
            }
            Game.hintFlag = new createjs.Bitmap(Game.resources["/image/hint.png"]);
            Game.hintFlag.x = minObject.x;
            Game.hintFlag.y = minObject.y;
            Game.hintFlag.regX = 0;
            Game.hintFlag.regY = Game.hintFlag.image.height;
            Game.dialogueLayer.addChild(Game.hintFlag);
          }
        }

      }

      FindHint();

      if (Game.key.isPressed("1")) {
        Game.ui.clickSpell(0)
      }

      if (Game.key.isPressed("2")) {
        Game.ui.clickSpell(1)
      }

      if (Game.key.isPressed("3")) {
        Game.ui.clickSpell(2)
      }

      if (Game.key.isPressed("4")) {
        Game.ui.clickSpell(3)
      }

      if (Game.key.isPressed("5")) {
        Game.ui.clickSpell(4)
      }

      if (Game.key.isPressed("6")) {
        Game.ui.clickSpell(5)
      }

      if (Game.key.isPressed("7")) {
        Game.ui.clickSpell(6)
      }

      if (Game.key.isPressed("8")) {
        Game.ui.clickSpell(7)
      }

      if (Game.key.isPressed("9")) {
        Game.ui.clickSpell(8)
      }

      Game.hero.focus();
    });
  }); // Game.oninit

})();
