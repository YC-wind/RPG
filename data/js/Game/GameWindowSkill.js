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

(function () {
  "use strict";

  var win = Game.windows.skill = Game.Window.create("skillWindow");

  win.html = "\n    <div class=\"window-box\">\n      <div id=\"skillWindowItemBar\">\n        <button id=\"skillWindowClose\" class=\"brownButton\">关闭</button>\n      </div>\n      <table border=\"0\">\n        <thead>\n          <tr>\n            <th style=\"width: 40px;\"></th>\n            <th style=\"width: 120px;\"></th>\n            <th></td>\n            <th style=\"width: 60px;\"></th>\n          </tr>\n        </thead>\n        <tbody id=\"skillWindowTable\"></tbody>\n      </table>\n    </div>\n  ";

  win.css = "\n    .skillWindow table {\n      width: 100%;\n    }\n\n    .skillWindow tr:nth-child(odd) {\n      background-color: rgba(192, 192, 192, 0.6);\n    }\n\n    .skillWindow table img {\n      width: 100%;\n      height: 100%;\n    }\n\n    .skillWindow button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n    }\n\n    #skillWindowItemBar button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n      margin-left: 5px;\n      margin-right: 5px;\n      margin-top: 0px;\n      margin-bottom: 5px;\n    }\n\n    #skillWindowClose {\n      float: right;\n    }\n  ";

  var skillWindowClose = win.querySelector("button#skillWindowClose");
  var skillWindowTable = win.querySelector("#skillWindowTable");

  var lastSelect = -1;

  skillWindowClose.addEventListener("click", function (event) {
    win.hide();
  });

  win.whenUp(["esc"], function (key) {
    setTimeout(function () {
      win.hide();
    }, 20);
  });

  win.assign("open", function (select) {

    if (typeof select == "undefined") {
      select = -1;
    }

    lastSelect = select;

    var index = 0;
    var table = "";
    Game.hero.data.skills.forEach(function (skillId) {
      var skill = Game.skills[skillId];

      var line = "";

      if (select == index) {
        line += "<tr style=\"background-color: green;\">\n";
      } else {
        line += "<tr>\n";
      }

      line += "  <td><img alt=\"\" src=\"" + skill.icon.src + "\"></td>\n";
      line += "  <td>" + skill.data.name + "</td>\n";
      line += "  <td>" + skill.data.description + "</td>\n";
      line += "  <td><button data-id=\"" + skillId + "\" class=\"brownButton skillWindowManage\">管理</button></td>\n";
      line += "</tr>\n";
      table += line;
      index++;
    });

    skillWindowTable.innerHTML = table;
    Game.windows.skill.show();
  });

  win.whenUp(["enter"], function () {
    var buttons = win.querySelectorAll(".skillWindowManage");
    if (lastSelect >= 0 && lastSelect < buttons.length) {
      buttons[lastSelect].click();
    }
  });

  win.whenUp(["up", "down"], function (key) {
    var count = win.querySelectorAll(".skillWindowManage").length;

    if (lastSelect == -1) {
      if (key == "down") {
        win.open(0);
      } else if (key == "up") {
        win.open(count - 1);
      }
    } else {
      if (key == "down") {
        var select = lastSelect + 1;
        if (select >= count) {
          select = 0;
        }
        win.open(select);
      } else if (key == "up") {
        var select = lastSelect - 1;
        if (select < 0) {
          select = count - 1;
        }
        win.open(select);
      }
    }
  });

  skillWindowTable.addEventListener("click", function (event) {
    var skillId = event.target.getAttribute("data-id");
    var index = Game.hero.data.skills.indexOf(skillId);
    if (skillId && Game.skills.hasOwnProperty(skillId) && index != -1) {
      (function () {

        var skill = Game.skills[skillId];

        var options = {};

        options["快捷栏"] = "shortcut";
        options["遗忘"] = "remove";
        if (skill.data.next) {
          options["升级"] = "levelup";
        }

        Game.choice(options).then(function (choice) {
          switch (choice) {
            case "shortcut":
              Game.choice({
                1: 0,
                2: 1,
                3: 2,
                4: 3,
                5: 4,
                6: 5,
                7: 6,
                8: 7
              }).then(function (choice) {
                if (Number.isFinite(choice) && choice >= 0) {
                  Game.hero.data.bar[choice] = {
                    id: skillId,
                    type: "skill"
                  };
                  Game.windows["interface"].refresh();
                }
              });
              break;
            case "levelup":
              if (skill.data.next) {
                var cannot = [];
                if (Game.hero.data.gold < skill.data.next.gold) {
                  cannot.push("金币不足，需要金币" + skill.data.next.gold + "，当前您有金币" + Game.hero.data.gold);
                }
                if (Game.hero.data.exp < skill.data.next.exp) {
                  cannot.push("经验不足，需要经验" + skill.data.next.exp + "，当前您有经验" + Game.hero.data.exp);
                }
                if (cannot.length) {
                  Game.dialogue(cannot);
                  return;
                }
                Game.confirm("确定要升级这个技能吗？共需要金币" + skill.data.next.gold + "，经验" + skill.data.next.exp).then(function () {
                  var nextId = skill.data.next.id;
                  Game.hero.data.skills.splice(index, 1);
                  Game.hero.data.skills.push(nextId);
                  Game.hero.data.gold -= skill.data.next.gold;
                  Game.hero.data.exp -= skill.data.next.exp;
                  Game.windows.loading.begin();
                  Game.Skill.load(nextId).then(function (skillObj) {
                    Game.windows.loading.end();
                    win.open();
                  });
                })["catch"](function () {
                  // no
                });
              }
              break;
            case "remove":
              Game.confirm("真的要遗忘 " + skill.data.name + " 技能吗？").then(function () {
                Game.hero.data.bar.forEach(function (element, index, array) {
                  if (element && element.id == skillId) {
                    array[index] = null;
                  }
                });
                Game.hero.data.skills.splice(index, 1);
                Game.windows["interface"].refresh();
                win.open();
              })["catch"](function () {
                // no
              });
              break;
          }
        });
      })();
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dTa2lsbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLENBQUMsWUFBWTtBQUNYLGNBQVksQ0FBQzs7QUFFYixNQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQzs7QUFFakUsS0FBRyxDQUFDLElBQUksd2ZBaUJQLENBQUM7O0FBRUYsS0FBRyxDQUFDLEdBQUcsOGxCQWlDTixDQUFDOztBQUVGLE1BQUksZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQ3BFLE1BQUksZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztBQUU5RCxNQUFJLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQzs7QUFFcEIsa0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVUsS0FBSyxFQUFFO0FBQzFELE9BQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUNaLENBQUMsQ0FBQzs7QUFFSCxLQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxHQUFHLEVBQUU7QUFDakMsY0FBVSxDQUFDLFlBQVk7QUFDckIsU0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ1osRUFBRSxFQUFFLENBQUMsQ0FBQztHQUNSLENBQUMsQ0FBQzs7QUFFSCxLQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFVLE1BQU0sRUFBRTs7QUFFbkMsUUFBSSxPQUFPLE1BQU0sSUFBSSxXQUFXLEVBQUU7QUFDaEMsWUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQ2I7O0FBRUQsY0FBVSxHQUFHLE1BQU0sQ0FBQzs7QUFFcEIsUUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsUUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2YsUUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLE9BQU8sRUFBRTtBQUMvQyxVQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVqQyxVQUFJLElBQUksR0FBRyxFQUFFLENBQUM7O0FBRWQsVUFBSSxNQUFNLElBQUksS0FBSyxFQUFFO0FBQ25CLFlBQUksK0NBQTZDLENBQUM7T0FDbkQsTUFBTTtBQUNMLFlBQUksWUFBWSxDQUFDO09BQ2xCOztBQUVELFVBQUksbUNBQThCLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxlQUFXLENBQUM7QUFDNUQsVUFBSSxlQUFhLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxZQUFTLENBQUM7QUFDMUMsVUFBSSxlQUFhLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxZQUFTLENBQUM7QUFDakQsVUFBSSxpQ0FBOEIsT0FBTyxrRUFBNEQsQ0FBQztBQUN0RyxVQUFJLElBQUksU0FBUyxDQUFDO0FBQ2xCLFdBQUssSUFBSSxJQUFJLENBQUM7QUFDZCxXQUFLLEVBQUUsQ0FBQztLQUNULENBQUMsQ0FBQzs7QUFFSCxvQkFBZ0IsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQ25DLFFBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0dBQzNCLENBQUMsQ0FBQzs7QUFFSCxLQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsWUFBWTtBQUNoQyxRQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUN6RCxRQUFJLFVBQVUsSUFBSSxDQUFDLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUU7QUFDbEQsYUFBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQzdCO0dBQ0YsQ0FBQyxDQUFDOztBQUVILEtBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEVBQUUsVUFBVSxHQUFHLEVBQUU7QUFDeEMsUUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDLENBQUMsTUFBTSxDQUFDOztBQUU5RCxRQUFJLFVBQVUsSUFBSSxDQUFDLENBQUMsRUFBRTtBQUNwQixVQUFJLEdBQUcsSUFBSSxNQUFNLEVBQUU7QUFDakIsV0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUNiLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFO0FBQ3RCLFdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO09BQ3JCO0tBQ0YsTUFBTTtBQUNMLFVBQUksR0FBRyxJQUFJLE1BQU0sRUFBRTtBQUNqQixZQUFJLE1BQU0sR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFDO0FBQzVCLFlBQUksTUFBTSxJQUFJLEtBQUssRUFBRTtBQUNuQixnQkFBTSxHQUFHLENBQUMsQ0FBQztTQUNaO0FBQ0QsV0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUNsQixNQUFNLElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtBQUN0QixZQUFJLE1BQU0sR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFDO0FBQzVCLFlBQUksTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNkLGdCQUFNLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztTQUNwQjtBQUNELFdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDbEI7S0FDRjtHQUNGLENBQUMsQ0FBQzs7QUFFSCxrQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBVSxLQUFLLEVBQUU7QUFDMUQsUUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbkQsUUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNuRCxRQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLEVBQUU7OztBQUVqRSxZQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVqQyxZQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7O0FBRWpCLGVBQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxVQUFVLENBQUM7QUFDNUIsZUFBTyxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQztBQUN6QixZQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ25CLGlCQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDO1NBQzNCOztBQUVELFlBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsTUFBTSxFQUFLO0FBQ3BDLGtCQUFPLE1BQU07QUFDWCxpQkFBSyxVQUFVO0FBQ2Isa0JBQUksQ0FBQyxNQUFNLENBQUM7QUFDVixpQkFBQyxFQUFDLENBQUM7QUFDSCxpQkFBQyxFQUFDLENBQUM7QUFDSCxpQkFBQyxFQUFDLENBQUM7QUFDSCxpQkFBQyxFQUFDLENBQUM7QUFDSCxpQkFBQyxFQUFDLENBQUM7QUFDSCxpQkFBQyxFQUFDLENBQUM7QUFDSCxpQkFBQyxFQUFDLENBQUM7QUFDSCxpQkFBQyxFQUFDLENBQUM7ZUFDSixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsTUFBTSxFQUFLO0FBQ2xCLG9CQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksTUFBTSxJQUFJLENBQUMsRUFBRTtBQUMxQyxzQkFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHO0FBQzNCLHNCQUFFLEVBQUUsT0FBTztBQUNYLHdCQUFJLEVBQUUsT0FBTzttQkFDZCxDQUFDO0FBQ0Ysc0JBQUksQ0FBQyxPQUFPLGFBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztpQkFDbEM7ZUFDRixDQUFDLENBQUM7QUFDSCxvQkFBTTtBQUFBLEFBQ1IsaUJBQUssU0FBUztBQUNaLGtCQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ25CLG9CQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDaEIsb0JBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtBQUM5Qyx3QkFBTSxDQUFDLElBQUksZUFBYSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLGVBQVUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFHLENBQUM7aUJBQzlFO0FBQ0Qsb0JBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUM1Qyx3QkFBTSxDQUFDLElBQUksZUFBYSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLGVBQVUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFHLENBQUM7aUJBQzVFO0FBQ0Qsb0JBQUksTUFBTSxDQUFDLE1BQU0sRUFBRTtBQUNqQixzQkFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN0Qix5QkFBTztpQkFDUjtBQUNELG9CQUFJLENBQUMsT0FBTyxzQkFBb0IsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxXQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRyxDQUFDLElBQUksQ0FBQyxZQUFNO0FBQzFGLHNCQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7QUFDaEMsc0JBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLHNCQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25DLHNCQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQzVDLHNCQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQzFDLHNCQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM3QixzQkFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsUUFBUSxFQUFFO0FBQy9DLHdCQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMzQix1QkFBRyxDQUFDLElBQUksRUFBRSxDQUFDO21CQUNaLENBQUMsQ0FBQztpQkFDSixDQUFDLFNBQU0sQ0FBQyxZQUFNOztpQkFFZCxDQUFDLENBQUM7ZUFDSjtBQUNELG9CQUFNO0FBQUEsQUFDUixpQkFBSyxRQUFRO0FBQ1gsa0JBQUksQ0FBQyxPQUFPLFlBQVUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLFdBQVEsQ0FBQyxJQUFJLENBQUMsWUFBTTtBQUN2RCxvQkFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQzFELHNCQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsRUFBRSxJQUFJLE9BQU8sRUFBRTtBQUNwQyx5QkFBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQzttQkFDckI7aUJBQ0YsQ0FBQyxDQUFDO0FBQ0gsb0JBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLG9CQUFJLENBQUMsT0FBTyxhQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDakMsbUJBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztlQUNaLENBQUMsU0FBTSxDQUFDLFlBQU07O2VBRWQsQ0FBQyxDQUFDO0FBQ0gsb0JBQU07QUFBQSxXQUNUO1NBQ0YsQ0FBQyxDQUFDOztLQUVKO0dBQ0YsQ0FBQyxDQUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiR2FtZVdpbmRvd1NraWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblxuQS1SUEcgR2FtZSwgQnVpbHQgdXNpbmcgSmF2YVNjcmlwdCBFUzZcbkNvcHlyaWdodCAoQykgMjAxNSBxaGR1YW4oaHR0cDovL3FoZHVhbi5jb20pXG5cblRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG5pdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxudGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbihhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cblRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2Zcbk1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuKi9cblxuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IHdpbiA9IEdhbWUud2luZG93cy5za2lsbCA9IEdhbWUuV2luZG93LmNyZWF0ZShcInNraWxsV2luZG93XCIpO1xuXG4gIHdpbi5odG1sID0gYFxuICAgIDxkaXYgY2xhc3M9XCJ3aW5kb3ctYm94XCI+XG4gICAgICA8ZGl2IGlkPVwic2tpbGxXaW5kb3dJdGVtQmFyXCI+XG4gICAgICAgIDxidXR0b24gaWQ9XCJza2lsbFdpbmRvd0Nsb3NlXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuWFs+mXrTwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICA8dGFibGUgYm9yZGVyPVwiMFwiPlxuICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgPHRyPlxuICAgICAgICAgICAgPHRoIHN0eWxlPVwid2lkdGg6IDQwcHg7XCI+PC90aD5cbiAgICAgICAgICAgIDx0aCBzdHlsZT1cIndpZHRoOiAxMjBweDtcIj48L3RoPlxuICAgICAgICAgICAgPHRoPjwvdGQ+XG4gICAgICAgICAgICA8dGggc3R5bGU9XCJ3aWR0aDogNjBweDtcIj48L3RoPlxuICAgICAgICAgIDwvdHI+XG4gICAgICAgIDwvdGhlYWQ+XG4gICAgICAgIDx0Ym9keSBpZD1cInNraWxsV2luZG93VGFibGVcIj48L3Rib2R5PlxuICAgICAgPC90YWJsZT5cbiAgICA8L2Rpdj5cbiAgYDtcblxuICB3aW4uY3NzID0gYFxuICAgIC5za2lsbFdpbmRvdyB0YWJsZSB7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAuc2tpbGxXaW5kb3cgdHI6bnRoLWNoaWxkKG9kZCkge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxOTIsIDE5MiwgMTkyLCAwLjYpO1xuICAgIH1cblxuICAgIC5za2lsbFdpbmRvdyB0YWJsZSBpbWcge1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgfVxuXG4gICAgLnNraWxsV2luZG93IGJ1dHRvbiB7XG4gICAgICB3aWR0aDogNjBweDtcbiAgICAgIGhlaWdodDogNDBweDtcbiAgICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICB9XG5cbiAgICAjc2tpbGxXaW5kb3dJdGVtQmFyIGJ1dHRvbiB7XG4gICAgICB3aWR0aDogNjBweDtcbiAgICAgIGhlaWdodDogNDBweDtcbiAgICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICAgIG1hcmdpbi1sZWZ0OiA1cHg7XG4gICAgICBtYXJnaW4tcmlnaHQ6IDVweDtcbiAgICAgIG1hcmdpbi10b3A6IDBweDtcbiAgICAgIG1hcmdpbi1ib3R0b206IDVweDtcbiAgICB9XG5cbiAgICAjc2tpbGxXaW5kb3dDbG9zZSB7XG4gICAgICBmbG9hdDogcmlnaHQ7XG4gICAgfVxuICBgO1xuXG4gIGxldCBza2lsbFdpbmRvd0Nsb3NlID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jc2tpbGxXaW5kb3dDbG9zZVwiKTtcbiAgbGV0IHNraWxsV2luZG93VGFibGUgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNza2lsbFdpbmRvd1RhYmxlXCIpO1xuXG4gIGxldCBsYXN0U2VsZWN0ID0gLTE7XG5cbiAgc2tpbGxXaW5kb3dDbG9zZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgd2luLmhpZGUoKTtcbiAgfSk7XG5cbiAgd2luLndoZW5VcChbXCJlc2NcIl0sIGZ1bmN0aW9uIChrZXkpIHtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbi5oaWRlKCk7XG4gICAgfSwgMjApO1xuICB9KTtcblxuICB3aW4uYXNzaWduKFwib3BlblwiLCBmdW5jdGlvbiAoc2VsZWN0KSB7XG5cbiAgICBpZiAodHlwZW9mIHNlbGVjdCA9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBzZWxlY3QgPSAtMTtcbiAgICB9XG5cbiAgICBsYXN0U2VsZWN0ID0gc2VsZWN0O1xuXG4gICAgbGV0IGluZGV4ID0gMDtcbiAgICBsZXQgdGFibGUgPSBcIlwiO1xuICAgIEdhbWUuaGVyby5kYXRhLnNraWxscy5mb3JFYWNoKGZ1bmN0aW9uIChza2lsbElkKSB7XG4gICAgICBsZXQgc2tpbGwgPSBHYW1lLnNraWxsc1tza2lsbElkXTtcblxuICAgICAgbGV0IGxpbmUgPSBcIlwiO1xuXG4gICAgICBpZiAoc2VsZWN0ID09IGluZGV4KSB7XG4gICAgICAgIGxpbmUgKz0gYDx0ciBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6IGdyZWVuO1wiPlxcbmA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaW5lICs9IGA8dHI+XFxuYDtcbiAgICAgIH1cblxuICAgICAgbGluZSArPSBgICA8dGQ+PGltZyBhbHQ9XCJcIiBzcmM9XCIke3NraWxsLmljb24uc3JjfVwiPjwvdGQ+XFxuYDtcbiAgICAgIGxpbmUgKz0gYCAgPHRkPiR7c2tpbGwuZGF0YS5uYW1lfTwvdGQ+XFxuYDtcbiAgICAgIGxpbmUgKz0gYCAgPHRkPiR7c2tpbGwuZGF0YS5kZXNjcmlwdGlvbn08L3RkPlxcbmA7XG4gICAgICBsaW5lICs9IGAgIDx0ZD48YnV0dG9uIGRhdGEtaWQ9XCIke3NraWxsSWR9XCIgY2xhc3M9XCJicm93bkJ1dHRvbiBza2lsbFdpbmRvd01hbmFnZVwiPueuoeeQhjwvYnV0dG9uPjwvdGQ+XFxuYDtcbiAgICAgIGxpbmUgKz0gXCI8L3RyPlxcblwiO1xuICAgICAgdGFibGUgKz0gbGluZTtcbiAgICAgIGluZGV4Kys7XG4gICAgfSk7XG5cbiAgICBza2lsbFdpbmRvd1RhYmxlLmlubmVySFRNTCA9IHRhYmxlO1xuICAgIEdhbWUud2luZG93cy5za2lsbC5zaG93KCk7XG4gIH0pO1xuXG4gIHdpbi53aGVuVXAoW1wiZW50ZXJcIl0sIGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgYnV0dG9ucyA9IHdpbi5xdWVyeVNlbGVjdG9yQWxsKFwiLnNraWxsV2luZG93TWFuYWdlXCIpO1xuICAgIGlmIChsYXN0U2VsZWN0ID49IDAgJiYgbGFzdFNlbGVjdCA8IGJ1dHRvbnMubGVuZ3RoKSB7XG4gICAgICBidXR0b25zW2xhc3RTZWxlY3RdLmNsaWNrKCk7XG4gICAgfVxuICB9KTtcblxuICB3aW4ud2hlblVwKFtcInVwXCIsIFwiZG93blwiXSwgZnVuY3Rpb24gKGtleSkge1xuICAgIGxldCBjb3VudCA9IHdpbi5xdWVyeVNlbGVjdG9yQWxsKFwiLnNraWxsV2luZG93TWFuYWdlXCIpLmxlbmd0aDtcblxuICAgIGlmIChsYXN0U2VsZWN0ID09IC0xKSB7XG4gICAgICBpZiAoa2V5ID09IFwiZG93blwiKSB7XG4gICAgICAgIHdpbi5vcGVuKDApO1xuICAgICAgfSBlbHNlIGlmIChrZXkgPT0gXCJ1cFwiKSB7XG4gICAgICAgIHdpbi5vcGVuKGNvdW50IC0gMSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChrZXkgPT0gXCJkb3duXCIpIHtcbiAgICAgICAgbGV0IHNlbGVjdCA9IGxhc3RTZWxlY3QgKyAxO1xuICAgICAgICBpZiAoc2VsZWN0ID49IGNvdW50KSB7XG4gICAgICAgICAgc2VsZWN0ID0gMDtcbiAgICAgICAgfVxuICAgICAgICB3aW4ub3BlbihzZWxlY3QpO1xuICAgICAgfSBlbHNlIGlmIChrZXkgPT0gXCJ1cFwiKSB7XG4gICAgICAgIGxldCBzZWxlY3QgPSBsYXN0U2VsZWN0IC0gMTtcbiAgICAgICAgaWYgKHNlbGVjdCA8IDApIHtcbiAgICAgICAgICBzZWxlY3QgPSBjb3VudCAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgd2luLm9wZW4oc2VsZWN0KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHNraWxsV2luZG93VGFibGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGxldCBza2lsbElkID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZShcImRhdGEtaWRcIik7XG4gICAgbGV0IGluZGV4ID0gR2FtZS5oZXJvLmRhdGEuc2tpbGxzLmluZGV4T2Yoc2tpbGxJZCk7XG4gICAgaWYgKHNraWxsSWQgJiYgR2FtZS5za2lsbHMuaGFzT3duUHJvcGVydHkoc2tpbGxJZCkgJiYgaW5kZXggIT0gLTEpIHtcblxuICAgICAgbGV0IHNraWxsID0gR2FtZS5za2lsbHNbc2tpbGxJZF07XG5cbiAgICAgIGxldCBvcHRpb25zID0ge307XG5cbiAgICAgIG9wdGlvbnNbXCLlv6vmjbfmoI9cIl0gPSBcInNob3J0Y3V0XCI7XG4gICAgICBvcHRpb25zW1wi6YGX5b+YXCJdID0gXCJyZW1vdmVcIjtcbiAgICAgIGlmIChza2lsbC5kYXRhLm5leHQpIHtcbiAgICAgICAgb3B0aW9uc1tcIuWNh+e6p1wiXSA9IFwibGV2ZWx1cFwiO1xuICAgICAgfVxuXG4gICAgICBHYW1lLmNob2ljZShvcHRpb25zKS50aGVuKChjaG9pY2UpID0+IHtcbiAgICAgICAgc3dpdGNoKGNob2ljZSkge1xuICAgICAgICAgIGNhc2UgXCJzaG9ydGN1dFwiOlxuICAgICAgICAgICAgR2FtZS5jaG9pY2Uoe1xuICAgICAgICAgICAgICAxOjAsXG4gICAgICAgICAgICAgIDI6MSxcbiAgICAgICAgICAgICAgMzoyLFxuICAgICAgICAgICAgICA0OjMsXG4gICAgICAgICAgICAgIDU6NCxcbiAgICAgICAgICAgICAgNjo1LFxuICAgICAgICAgICAgICA3OjYsXG4gICAgICAgICAgICAgIDg6N1xuICAgICAgICAgICAgfSkudGhlbigoY2hvaWNlKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUoY2hvaWNlKSAmJiBjaG9pY2UgPj0gMCkge1xuICAgICAgICAgICAgICAgIEdhbWUuaGVyby5kYXRhLmJhcltjaG9pY2VdID0ge1xuICAgICAgICAgICAgICAgICAgaWQ6IHNraWxsSWQsXG4gICAgICAgICAgICAgICAgICB0eXBlOiBcInNraWxsXCJcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2UucmVmcmVzaCgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJsZXZlbHVwXCI6XG4gICAgICAgICAgICBpZiAoc2tpbGwuZGF0YS5uZXh0KSB7XG4gICAgICAgICAgICAgIGxldCBjYW5ub3QgPSBbXTtcbiAgICAgICAgICAgICAgaWYgKEdhbWUuaGVyby5kYXRhLmdvbGQgPCBza2lsbC5kYXRhLm5leHQuZ29sZCkge1xuICAgICAgICAgICAgICAgIGNhbm5vdC5wdXNoKGDph5HluIHkuI3otrPvvIzpnIDopoHph5HluIEke3NraWxsLmRhdGEubmV4dC5nb2xkfe+8jOW9k+WJjeaCqOaciemHkeW4gSR7R2FtZS5oZXJvLmRhdGEuZ29sZH1gKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoR2FtZS5oZXJvLmRhdGEuZXhwIDwgc2tpbGwuZGF0YS5uZXh0LmV4cCkge1xuICAgICAgICAgICAgICAgIGNhbm5vdC5wdXNoKGDnu4/pqozkuI3otrPvvIzpnIDopoHnu4/pqowke3NraWxsLmRhdGEubmV4dC5leHB977yM5b2T5YmN5oKo5pyJ57uP6aqMJHtHYW1lLmhlcm8uZGF0YS5leHB9YCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGNhbm5vdC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBHYW1lLmRpYWxvZ3VlKGNhbm5vdCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIEdhbWUuY29uZmlybShg56Gu5a6a6KaB5Y2H57qn6L+Z5Liq5oqA6IO95ZCX77yf5YWx6ZyA6KaB6YeR5biBJHtza2lsbC5kYXRhLm5leHQuZ29sZH3vvIznu4/pqowke3NraWxsLmRhdGEubmV4dC5leHB9YCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IG5leHRJZCA9IHNraWxsLmRhdGEubmV4dC5pZDtcbiAgICAgICAgICAgICAgICBHYW1lLmhlcm8uZGF0YS5za2lsbHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICBHYW1lLmhlcm8uZGF0YS5za2lsbHMucHVzaChuZXh0SWQpO1xuICAgICAgICAgICAgICAgIEdhbWUuaGVyby5kYXRhLmdvbGQgLT0gc2tpbGwuZGF0YS5uZXh0LmdvbGQ7XG4gICAgICAgICAgICAgICAgR2FtZS5oZXJvLmRhdGEuZXhwIC09IHNraWxsLmRhdGEubmV4dC5leHA7XG4gICAgICAgICAgICAgICAgR2FtZS53aW5kb3dzLmxvYWRpbmcuYmVnaW4oKTtcbiAgICAgICAgICAgICAgICBHYW1lLlNraWxsLmxvYWQobmV4dElkKS50aGVuKGZ1bmN0aW9uIChza2lsbE9iaikge1xuICAgICAgICAgICAgICAgICAgR2FtZS53aW5kb3dzLmxvYWRpbmcuZW5kKCk7XG4gICAgICAgICAgICAgICAgICB3aW4ub3BlbigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gbm9cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwicmVtb3ZlXCI6XG4gICAgICAgICAgICBHYW1lLmNvbmZpcm0oYOecn+eahOimgemBl+W/mCAke3NraWxsLmRhdGEubmFtZX0g5oqA6IO95ZCX77yfYCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIEdhbWUuaGVyby5kYXRhLmJhci5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50LCBpbmRleCwgYXJyYXkpIHtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudCAmJiBlbGVtZW50LmlkID09IHNraWxsSWQpIHtcbiAgICAgICAgICAgICAgICAgIGFycmF5W2luZGV4XSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgR2FtZS5oZXJvLmRhdGEuc2tpbGxzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2UucmVmcmVzaCgpO1xuICAgICAgICAgICAgICB3aW4ub3BlbigpO1xuICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAvLyBub1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB9XG4gIH0pO1xuXG5cbn0pKCk7XG4iXX0=
