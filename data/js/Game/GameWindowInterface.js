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

  var win = Game.windows["interface"] = Game.Window.create("interfaceWindow");

  win.html = "\n    <div id=\"interfaceWindowBar\"></div>\n\n    <div style=\"position: absolute; bottom: 10px; left: 20px; width: 100px; height: 60px;\">\n      <div style=\"width: 100px; height: 20px; margin: 5px 0; border: 1px solid gray; background-color: white;\">\n        <div id=\"interfaceWindowHP\" style=\"width: 100%; height: 100%; background-color: green;\"></div>\n      </div>\n      <div style=\"width: 100px; height: 20px; margin: 5px 0; border: 1px solid gray; background-color: white;\">\n        <div id=\"interfaceWindowSP\" style=\"width: 100%; height: 100%; background-color: blue;\"></div>\n      </div>\n    </div>\n\n    <span id=\"interfaceWindowDatetime\"></span>\n    <span id=\"interfaceWindowMap\"></span>\n\n    <button id=\"interfaceWindowUse\" class=\"interfaceWindowButton\"></button>\n    <button id=\"interfaceWindowMenu\" class=\"interfaceWindowButton\"></button>\n  ";

  win.css = "\n\n    #interfaceWindowBar {\n      text-align: center;\n      position: absolute;\n      bottom: 10px;\n      width: 100%;\n      height: 60px;\n    }\n\n    .interfaceWindow {\n      /** 让interface窗口的主要窗口，不接受事件 */\n      pointer-events: none;\n    }\n\n    button.interfaceWindowButton {\n      margin-left: 3px;\n      margin-right: 3px;\n      width: 60px;\n      height: 60px;\n      border: 4px solid gray;\n      border-radius: 10px;\n      background-color: rgba(100, 100, 100, 0.5);\n      display: inline-block;\n      /** 让interface窗口的按钮，接受事件 */\n      pointer-events: auto;\n      background-repeat: no-repeat;\n      background-size: cover;\n    }\n\n    button.interfaceWindowButton:hover {\n      opacity: 0.5;\n    }\n\n    button.interfaceWindowButton > img {\n      width: 100%;\n      height: 100%;\n    }\n\n    #interfaceWindowMap {\n      position: absolute;\n      top: 35px;\n      left: 5px;\n      background-color: rgba(100, 100, 100, 0.7);\n      padding: 2px;\n    }\n\n    #interfaceWindowDatetime {\n      position: absolute;\n      top: 10px;\n      left: 5px;\n      background-color: rgba(100, 100, 100, 0.7);\n      padding: 2px;\n    }\n\n    button#interfaceWindowUse {\n      position: absolute;\n      top: 5px;\n      right: 85px;\n      visibility: hidden;\n      background-image: url(\"image/hint.png\");\n    }\n\n    button#interfaceWindowMenu {\n      position: absolute;\n      top: 5px;\n      right: 5px;\n      background-image: url(\"image/setting.png\");\n    }\n\n    interfaceWindowButton:disabled {\n      cursor: default;\n      pointer-events: none;\n      background-color: gray;\n      opacity: 0.5;\n    }\n\n    .interfaceWindowButtonText {\n      position: absolute;\n      background-color: white;\n      margin-left: -26px;\n      margin-top: 12px;\n    }\n  ";

  // 使用按钮
  var interfaceWindowUse = win.querySelector("button#interfaceWindowUse");
  // 技能栏按钮组
  var interfaceWindowBar = win.querySelector("div#interfaceWindowBar");
  // 地图信息
  var interfaceWindowMap = win.querySelector("#interfaceWindowMap");
  // 选项菜单
  var interfaceWindowMenu = win.querySelector("button#interfaceWindowMenu");
  // 玩家的hp
  var interfaceWindowHP = win.querySelector("#interfaceWindowHP");
  // 玩家的sp
  var interfaceWindowSP = win.querySelector("#interfaceWindowSP");

  win.assign("hideUse", function () {
    interfaceWindowUse.style.visibility = "hidden";
  });

  win.assign("showUse", function () {
    interfaceWindowUse.style.visibility = "visible";
  });

  win.on("active", function () {
    Game.start();
  });

  win.on("deactive", function () {
    Game.pause();
  });

  win.whenUp(["esc"], function (key) {
    if (Game.windows["interface"].atop) {
      setTimeout(function () {
        interfaceWindowMenu.click();
      }, 20);
    }
  });

  function InitInterfaceBar() {
    var buttonCount = 8;
    var buttonHTML = "";
    for (var i = 0; i < buttonCount; i++) {
      var line = "";
      line += "<button data-index=\"" + i + "\" class=\"interfaceWindowButton\">";
      line += "<label data-index=\"" + i + "\" class=\"interfaceWindowButtonText\"></label>";
      line += "</button>\n";
      buttonHTML += line;
    }
    interfaceWindowBar.innerHTML = buttonHTML;
  }

  setInterval(function () {
    if (Game.hero && Game.paused == false) {
      Game.hero.data.time++;
      Game.windows["interface"].datetime();
    }
  }, 1000);

  InitInterfaceBar();
  var buttons = win.querySelectorAll(".interfaceWindowButton");
  var buttonTexts = win.querySelectorAll(".interfaceWindowButtonText");

  interfaceWindowBar.addEventListener("click", function (event) {
    var index = event.target.getAttribute("data-index");
    if (index) {
      var element = Game.hero.data.bar[index];
      if (element) {
        if (element.type == "skill") {
          var cooldown = Game.hero.fire(element.id);
          if (cooldown) {
            event.target.disabled = true;
            setTimeout(function () {
              event.target.disabled = false;
            }, cooldown);
          }
        } else if (element.type == "item") {
          var itemId = element.id;
          var item = Game.items[itemId];
          item.heroUse();
          Game.windows["interface"].refresh();
        }
      }
    }
  });

  win.whenUp(["1", "2", "3", "4", "5", "6", "7", "8"], function (key) {
    var num = parseInt(key);
    if (Number.isInteger(num) && num >= 0 && num < buttons.length) {
      buttons[num - 1].click();
    }
  });

  win.whenUp(["e", "E", "space", "enter"], function (key) {
    if (Game.windows["interface"].showing) {
      if (Game.hintObject && Game.hintObject.heroUse) {
        Game.hintObject.heroUse();
      }
    }
  });

  interfaceWindowUse.addEventListener("click", function (event) {
    if (Game.hintObject && Game.hintObject.heroUse) {
      Game.hintObject.heroUse();
    }
  });

  win.assign("status", function () {
    if (Game.hero) {
      var hp = Game.hero.data.hp / Game.hero.data.$hp;
      var sp = Game.hero.data.sp / Game.hero.data.$sp;
      interfaceWindowHP.style.width = hp * 100 + "%";
      interfaceWindowSP.style.width = sp * 100 + "%";
      if (hp >= 0.5) {
        interfaceWindowHP.style.backgroundColor = "green";
      } else if (hp >= 0.25) {
        interfaceWindowHP.style.backgroundColor = "yellow";
      } else {
        interfaceWindowHP.style.backgroundColor = "red";
      }
    }
  });

  win.assign("datetime", function () {
    if (Game.hero && Game.hero.data && Number.isInteger(Game.hero.data.time)) {
      var YEARMIN = 60 * 24 * 30 * 12;
      var MONTHMIN = 60 * 24 * 30;
      var DAYMIN = 60 * 24;
      var HOURMIN = 60;
      var datetime = win.querySelector("#interfaceWindowDatetime");
      var time = Game.hero.data.time;
      var year = Math.floor(time / YEARMIN);
      time = time % YEARMIN;
      var month = Math.floor(time / MONTHMIN);
      time = time % MONTHMIN;
      var day = Math.floor(time / DAYMIN);
      time = time % DAYMIN;
      var hour = Math.floor(time / HOURMIN);
      time = time % HOURMIN;
      var minute = time;
      year++;
      month++;
      day++;
      hour = hour.toString();
      while (hour.length < 2) hour = "0" + hour;
      minute = minute.toString();
      while (minute.length < 2) minute = "0" + minute;
      datetime.textContent = month + "月" + day + "日 " + hour + ":" + minute;

      var type = Game.area.map.data.type;

      if (type == "indoor") {
        // do nothing
        Game.stage.filter("brightness", 0.0);
      } else if (type == "outdoor") {
        // 室外
        if (hour >= 20 || hour < 4) {
          // 20:00 to 4:00
          Game.stage.filter("brightness", -0.15);
        } else if (hour >= 4 && hour < 6) {
          Game.stage.filter("brightness", -0.1);
        } else if (hour >= 6 && hour < 8) {
          Game.stage.filter("brightness", -0.05);
        } else if (hour >= 8 && hour < 10) {
          Game.stage.filter("brightness", 0.0);
        } else if (hour >= 10 && hour < 12) {
          Game.stage.filter("brightness", 0.05);
        } else if (hour >= 12 && hour < 14) {
          Game.stage.filter("brightness", 0.0);
        } else if (hour >= 14 && hour < 16) {
          Game.stage.filter("brightness", 0.0);
        } else if (hour >= 16 && hour < 18) {
          Game.stage.filter("brightness", -0.05);
        } else if (hour >= 18 && hour < 20) {
          Game.stage.filter("brightness", -0.1);
        }
      } else if (type == "cave") {
        // caves are dark
        Game.stage.filter("brightness", -0.15);
      }
    }
  });

  win.assign("refresh", function () {
    for (var i = 0; i < 8; i++) {
      var element = Game.hero.data.bar[i];
      var button = buttons[i];
      var text = buttonTexts[i];
      button.disabled = false;
      text.disabled = false;

      if (element) {
        var id = element.id;
        var type = element.type;
        if (type == "skill") {
          var skill = Game.skills[id];
          button.style.backgroundImage = "url(\"" + skill.icon.src + "\")";
          text.textContent = skill.data.cost;
        } else if (type == "item") {
          var item = Game.items[id];
          button.style.backgroundImage = "url(\"" + item.icon.src + "\")";
          if (Game.hero.data.items[id]) {
            text.textContent = Game.hero.data.items[id];
          } else {
            text.textContent = "0";
            button.disabled = true;
            text.disabled = true;
          }
        }
      } else {
        // empty bar element
        text.textContent = "";
        button.style.backgroundImage = "";
      }
    }

    interfaceWindowMap.textContent = Game.area.map.data.name;
  });

  interfaceWindowMenu.addEventListener("click", function (event) {
    Game.windows.sysmenu.show();
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dJbnRlcmZhY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxDQUFDLFlBQVk7QUFDWCxjQUFZLENBQUM7O0FBRWIsTUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sYUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7O0FBRXpFLEtBQUcsQ0FBQyxJQUFJLGc0QkFpQlAsQ0FBQzs7QUFFRixLQUFHLENBQUMsR0FBRyxxeURBbUZOLENBQUM7OztBQUdGLE1BQUksa0JBQWtCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDOztBQUV4RSxNQUFJLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsQ0FBQzs7QUFFckUsTUFBSSxrQkFBa0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUM7O0FBRWxFLE1BQUksbUJBQW1CLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDOztBQUUxRSxNQUFJLGlCQUFpQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsQ0FBQzs7QUFFaEUsTUFBSSxpQkFBaUIsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLENBQUM7O0FBRWhFLEtBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFlBQVk7QUFDaEMsc0JBQWtCLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUM7R0FDaEQsQ0FBQyxDQUFDOztBQUVILEtBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFlBQVk7QUFDaEMsc0JBQWtCLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7R0FDakQsQ0FBQyxDQUFDOztBQUVILEtBQUcsQ0FBQyxF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RyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0dBQzFELENBQUMsQ0FBQzs7QUFFSCxxQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBVSxLQUFLLEVBQUU7QUFDN0QsUUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDN0IsQ0FBQyxDQUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiR2FtZVdpbmRvd0ludGVyZmFjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbkEtUlBHIEdhbWUsIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCB3aW4gPSBHYW1lLndpbmRvd3MuaW50ZXJmYWNlID0gR2FtZS5XaW5kb3cuY3JlYXRlKFwiaW50ZXJmYWNlV2luZG93XCIpO1xuXG4gIHdpbi5odG1sID0gYFxuICAgIDxkaXYgaWQ9XCJpbnRlcmZhY2VXaW5kb3dCYXJcIj48L2Rpdj5cblxuICAgIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IGJvdHRvbTogMTBweDsgbGVmdDogMjBweDsgd2lkdGg6IDEwMHB4OyBoZWlnaHQ6IDYwcHg7XCI+XG4gICAgICA8ZGl2IHN0eWxlPVwid2lkdGg6IDEwMHB4OyBoZWlnaHQ6IDIwcHg7IG1hcmdpbjogNXB4IDA7IGJvcmRlcjogMXB4IHNvbGlkIGdyYXk7IGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1wiPlxuICAgICAgICA8ZGl2IGlkPVwiaW50ZXJmYWNlV2luZG93SFBcIiBzdHlsZT1cIndpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7IGJhY2tncm91bmQtY29sb3I6IGdyZWVuO1wiPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IHN0eWxlPVwid2lkdGg6IDEwMHB4OyBoZWlnaHQ6IDIwcHg7IG1hcmdpbjogNXB4IDA7IGJvcmRlcjogMXB4IHNvbGlkIGdyYXk7IGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1wiPlxuICAgICAgICA8ZGl2IGlkPVwiaW50ZXJmYWNlV2luZG93U1BcIiBzdHlsZT1cIndpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7IGJhY2tncm91bmQtY29sb3I6IGJsdWU7XCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cblxuICAgIDxzcGFuIGlkPVwiaW50ZXJmYWNlV2luZG93RGF0ZXRpbWVcIj48L3NwYW4+XG4gICAgPHNwYW4gaWQ9XCJpbnRlcmZhY2VXaW5kb3dNYXBcIj48L3NwYW4+XG5cbiAgICA8YnV0dG9uIGlkPVwiaW50ZXJmYWNlV2luZG93VXNlXCIgY2xhc3M9XCJpbnRlcmZhY2VXaW5kb3dCdXR0b25cIj48L2J1dHRvbj5cbiAgICA8YnV0dG9uIGlkPVwiaW50ZXJmYWNlV2luZG93TWVudVwiIGNsYXNzPVwiaW50ZXJmYWNlV2luZG93QnV0dG9uXCI+PC9idXR0b24+XG4gIGA7XG5cbiAgd2luLmNzcyA9IGBcblxuICAgICNpbnRlcmZhY2VXaW5kb3dCYXIge1xuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgYm90dG9tOiAxMHB4O1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBoZWlnaHQ6IDYwcHg7XG4gICAgfVxuXG4gICAgLmludGVyZmFjZVdpbmRvdyB7XG4gICAgICAvKiog6K6paW50ZXJmYWNl56qX5Y+j55qE5Li76KaB56qX5Y+j77yM5LiN5o6l5Y+X5LqL5Lu2ICovXG4gICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICB9XG5cbiAgICBidXR0b24uaW50ZXJmYWNlV2luZG93QnV0dG9uIHtcbiAgICAgIG1hcmdpbi1sZWZ0OiAzcHg7XG4gICAgICBtYXJnaW4tcmlnaHQ6IDNweDtcbiAgICAgIHdpZHRoOiA2MHB4O1xuICAgICAgaGVpZ2h0OiA2MHB4O1xuICAgICAgYm9yZGVyOiA0cHggc29saWQgZ3JheTtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDEwMCwgMTAwLCAxMDAsIDAuNSk7XG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAvKiog6K6paW50ZXJmYWNl56qX5Y+j55qE5oyJ6ZKu77yM5o6l5Y+X5LqL5Lu2ICovXG4gICAgICBwb2ludGVyLWV2ZW50czogYXV0bztcbiAgICAgIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XG4gICAgICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xuICAgIH1cblxuICAgIGJ1dHRvbi5pbnRlcmZhY2VXaW5kb3dCdXR0b246aG92ZXIge1xuICAgICAgb3BhY2l0eTogMC41O1xuICAgIH1cblxuICAgIGJ1dHRvbi5pbnRlcmZhY2VXaW5kb3dCdXR0b24gPiBpbWcge1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgfVxuXG4gICAgI2ludGVyZmFjZVdpbmRvd01hcCB7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICB0b3A6IDM1cHg7XG4gICAgICBsZWZ0OiA1cHg7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDEwMCwgMTAwLCAxMDAsIDAuNyk7XG4gICAgICBwYWRkaW5nOiAycHg7XG4gICAgfVxuXG4gICAgI2ludGVyZmFjZVdpbmRvd0RhdGV0aW1lIHtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIHRvcDogMTBweDtcbiAgICAgIGxlZnQ6IDVweDtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMTAwLCAxMDAsIDEwMCwgMC43KTtcbiAgICAgIHBhZGRpbmc6IDJweDtcbiAgICB9XG5cbiAgICBidXR0b24jaW50ZXJmYWNlV2luZG93VXNlIHtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIHRvcDogNXB4O1xuICAgICAgcmlnaHQ6IDg1cHg7XG4gICAgICB2aXNpYmlsaXR5OiBoaWRkZW47XG4gICAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJpbWFnZS9oaW50LnBuZ1wiKTtcbiAgICB9XG5cbiAgICBidXR0b24jaW50ZXJmYWNlV2luZG93TWVudSB7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICB0b3A6IDVweDtcbiAgICAgIHJpZ2h0OiA1cHg7XG4gICAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJpbWFnZS9zZXR0aW5nLnBuZ1wiKTtcbiAgICB9XG5cbiAgICBpbnRlcmZhY2VXaW5kb3dCdXR0b246ZGlzYWJsZWQge1xuICAgICAgY3Vyc29yOiBkZWZhdWx0O1xuICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBncmF5O1xuICAgICAgb3BhY2l0eTogMC41O1xuICAgIH1cblxuICAgIC5pbnRlcmZhY2VXaW5kb3dCdXR0b25UZXh0IHtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xuICAgICAgbWFyZ2luLWxlZnQ6IC0yNnB4O1xuICAgICAgbWFyZ2luLXRvcDogMTJweDtcbiAgICB9XG4gIGA7XG5cbiAgLy8g5L2/55So5oyJ6ZKuXG4gIGxldCBpbnRlcmZhY2VXaW5kb3dVc2UgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNpbnRlcmZhY2VXaW5kb3dVc2VcIik7XG4gIC8vIOaKgOiDveagj+aMiemSrue7hFxuICBsZXQgaW50ZXJmYWNlV2luZG93QmFyID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJkaXYjaW50ZXJmYWNlV2luZG93QmFyXCIpO1xuICAvLyDlnLDlm77kv6Hmga9cbiAgbGV0IGludGVyZmFjZVdpbmRvd01hcCA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2ludGVyZmFjZVdpbmRvd01hcFwiKTtcbiAgLy8g6YCJ6aG56I+c5Y2VXG4gIGxldCBpbnRlcmZhY2VXaW5kb3dNZW51ID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jaW50ZXJmYWNlV2luZG93TWVudVwiKTtcbiAgLy8g546p5a6255qEaHBcbiAgbGV0IGludGVyZmFjZVdpbmRvd0hQID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjaW50ZXJmYWNlV2luZG93SFBcIik7XG4gIC8vIOeOqeWutueahHNwXG4gIGxldCBpbnRlcmZhY2VXaW5kb3dTUCA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI2ludGVyZmFjZVdpbmRvd1NQXCIpO1xuXG4gIHdpbi5hc3NpZ24oXCJoaWRlVXNlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBpbnRlcmZhY2VXaW5kb3dVc2Uuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gIH0pO1xuXG4gIHdpbi5hc3NpZ24oXCJzaG93VXNlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBpbnRlcmZhY2VXaW5kb3dVc2Uuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICB9KTtcblxuICB3aW4ub24oXCJhY3RpdmVcIiwgZnVuY3Rpb24gKCkge1xuICAgIEdhbWUuc3RhcnQoKTtcbiAgfSk7XG5cbiAgd2luLm9uKFwiZGVhY3RpdmVcIiwgZnVuY3Rpb24gKCkge1xuICAgIEdhbWUucGF1c2UoKTtcbiAgfSlcblxuICB3aW4ud2hlblVwKFtcImVzY1wiXSwgZnVuY3Rpb24gKGtleSkge1xuICAgIGlmIChHYW1lLndpbmRvd3MuaW50ZXJmYWNlLmF0b3ApIHtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBpbnRlcmZhY2VXaW5kb3dNZW51LmNsaWNrKCk7XG4gICAgICB9LCAyMCk7XG4gICAgfVxuICB9KTtcblxuICBmdW5jdGlvbiBJbml0SW50ZXJmYWNlQmFyICgpIHtcbiAgICBsZXQgYnV0dG9uQ291bnQgPSA4O1xuICAgIGxldCBidXR0b25IVE1MID0gXCJcIjtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1dHRvbkNvdW50OyBpKyspIHtcbiAgICAgIGxldCBsaW5lID0gXCJcIjtcbiAgICAgIGxpbmUgKz0gYDxidXR0b24gZGF0YS1pbmRleD1cIiR7aX1cIiBjbGFzcz1cImludGVyZmFjZVdpbmRvd0J1dHRvblwiPmA7XG4gICAgICBsaW5lICs9IGA8bGFiZWwgZGF0YS1pbmRleD1cIiR7aX1cIiBjbGFzcz1cImludGVyZmFjZVdpbmRvd0J1dHRvblRleHRcIj48L2xhYmVsPmBcbiAgICAgIGxpbmUgKz0gYDwvYnV0dG9uPlxcbmA7XG4gICAgICBidXR0b25IVE1MICs9IGxpbmU7XG4gICAgfVxuICAgIGludGVyZmFjZVdpbmRvd0Jhci5pbm5lckhUTUwgPSBidXR0b25IVE1MO1xuICB9XG5cbiAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgIGlmIChHYW1lLmhlcm8gJiYgR2FtZS5wYXVzZWQgPT0gZmFsc2UpIHtcbiAgICAgIEdhbWUuaGVyby5kYXRhLnRpbWUrKztcbiAgICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2UuZGF0ZXRpbWUoKTtcbiAgICB9XG4gIH0sIDEwMDApO1xuXG4gIEluaXRJbnRlcmZhY2VCYXIoKTtcbiAgbGV0IGJ1dHRvbnMgPSB3aW4ucXVlcnlTZWxlY3RvckFsbChcIi5pbnRlcmZhY2VXaW5kb3dCdXR0b25cIik7XG4gIGxldCBidXR0b25UZXh0cyA9IHdpbi5xdWVyeVNlbGVjdG9yQWxsKFwiLmludGVyZmFjZVdpbmRvd0J1dHRvblRleHRcIik7XG5cbiAgaW50ZXJmYWNlV2luZG93QmFyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBsZXQgaW5kZXggPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1pbmRleFwiKTtcbiAgICBpZiAoaW5kZXgpIHtcbiAgICAgIGxldCBlbGVtZW50ID0gR2FtZS5oZXJvLmRhdGEuYmFyW2luZGV4XTtcbiAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgIGlmIChlbGVtZW50LnR5cGUgPT0gXCJza2lsbFwiKSB7XG4gICAgICAgICAgbGV0IGNvb2xkb3duID0gR2FtZS5oZXJvLmZpcmUoZWxlbWVudC5pZCk7XG4gICAgICAgICAgaWYgKGNvb2xkb3duKSB7XG4gICAgICAgICAgICBldmVudC50YXJnZXQuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIGV2ZW50LnRhcmdldC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfSwgY29vbGRvd24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50LnR5cGUgPT0gXCJpdGVtXCIpIHtcbiAgICAgICAgICBsZXQgaXRlbUlkID0gZWxlbWVudC5pZDtcbiAgICAgICAgICBsZXQgaXRlbSA9IEdhbWUuaXRlbXNbaXRlbUlkXTtcbiAgICAgICAgICBpdGVtLmhlcm9Vc2UoKTtcbiAgICAgICAgICBHYW1lLndpbmRvd3MuaW50ZXJmYWNlLnJlZnJlc2goKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgd2luLndoZW5VcChbXCIxXCIsIFwiMlwiLCBcIjNcIiwgXCI0XCIsIFwiNVwiLCBcIjZcIiwgXCI3XCIsIFwiOFwiXSwgZnVuY3Rpb24gKGtleSkge1xuICAgIGxldCBudW0gPSBwYXJzZUludChrZXkpO1xuICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKG51bSkgJiYgbnVtID49IDAgJiYgbnVtIDwgYnV0dG9ucy5sZW5ndGgpIHtcbiAgICAgIGJ1dHRvbnNbbnVtIC0gMV0uY2xpY2soKTtcbiAgICB9XG4gIH0pO1xuXG4gIHdpbi53aGVuVXAoW1wiZVwiLCBcIkVcIiwgXCJzcGFjZVwiLCBcImVudGVyXCJdLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKEdhbWUud2luZG93cy5pbnRlcmZhY2Uuc2hvd2luZykge1xuICAgICAgaWYgKEdhbWUuaGludE9iamVjdCAmJiBHYW1lLmhpbnRPYmplY3QuaGVyb1VzZSkge1xuICAgICAgICBHYW1lLmhpbnRPYmplY3QuaGVyb1VzZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgaW50ZXJmYWNlV2luZG93VXNlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBpZiAoR2FtZS5oaW50T2JqZWN0ICYmIEdhbWUuaGludE9iamVjdC5oZXJvVXNlKSB7XG4gICAgICBHYW1lLmhpbnRPYmplY3QuaGVyb1VzZSgpO1xuICAgIH1cbiAgfSk7XG5cbiAgd2luLmFzc2lnbihcInN0YXR1c1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKEdhbWUuaGVybykge1xuICAgICAgbGV0IGhwID0gR2FtZS5oZXJvLmRhdGEuaHAgLyBHYW1lLmhlcm8uZGF0YS4kaHA7XG4gICAgICBsZXQgc3AgPSBHYW1lLmhlcm8uZGF0YS5zcCAvIEdhbWUuaGVyby5kYXRhLiRzcDtcbiAgICAgIGludGVyZmFjZVdpbmRvd0hQLnN0eWxlLndpZHRoID0gYCR7aHAqMTAwfSVgO1xuICAgICAgaW50ZXJmYWNlV2luZG93U1Auc3R5bGUud2lkdGggPSBgJHtzcCoxMDB9JWA7XG4gICAgICBpZiAoaHAgPj0gMC41KSB7XG4gICAgICAgIGludGVyZmFjZVdpbmRvd0hQLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiZ3JlZW5cIjtcbiAgICAgIH0gZWxzZSBpZiAoaHAgPj0gMC4yNSkge1xuICAgICAgICBpbnRlcmZhY2VXaW5kb3dIUC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInllbGxvd1wiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW50ZXJmYWNlV2luZG93SFAuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZWRcIjtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHdpbi5hc3NpZ24oXCJkYXRldGltZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKEdhbWUuaGVybyAmJiBHYW1lLmhlcm8uZGF0YSAmJiBOdW1iZXIuaXNJbnRlZ2VyKEdhbWUuaGVyby5kYXRhLnRpbWUpKSB7XG4gICAgICBsZXQgWUVBUk1JTiA9IDYwKjI0KjMwKjEyO1xuICAgICAgbGV0IE1PTlRITUlOID0gNjAqMjQqMzA7XG4gICAgICBsZXQgREFZTUlOID0gNjAqMjQ7XG4gICAgICBsZXQgSE9VUk1JTiA9IDYwO1xuICAgICAgbGV0IGRhdGV0aW1lID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjaW50ZXJmYWNlV2luZG93RGF0ZXRpbWVcIik7XG4gICAgICBsZXQgdGltZSA9IEdhbWUuaGVyby5kYXRhLnRpbWU7XG4gICAgICBsZXQgeWVhciA9IE1hdGguZmxvb3IodGltZS9ZRUFSTUlOKTtcbiAgICAgIHRpbWUgPSB0aW1lICUgWUVBUk1JTjtcbiAgICAgIGxldCBtb250aCA9IE1hdGguZmxvb3IodGltZS9NT05USE1JTik7XG4gICAgICB0aW1lID0gdGltZSAlIE1PTlRITUlOO1xuICAgICAgbGV0IGRheSA9IE1hdGguZmxvb3IodGltZS9EQVlNSU4pO1xuICAgICAgdGltZSA9IHRpbWUgJSBEQVlNSU47XG4gICAgICBsZXQgaG91ciA9IE1hdGguZmxvb3IodGltZS9IT1VSTUlOKTtcbiAgICAgIHRpbWUgPSB0aW1lICUgSE9VUk1JTjtcbiAgICAgIGxldCBtaW51dGUgPSB0aW1lO1xuICAgICAgeWVhcisrO1xuICAgICAgbW9udGgrKztcbiAgICAgIGRheSsrO1xuICAgICAgaG91ciA9IGhvdXIudG9TdHJpbmcoKTtcbiAgICAgIHdoaWxlIChob3VyLmxlbmd0aCA8IDIpIGhvdXIgPSBcIjBcIitob3VyO1xuICAgICAgbWludXRlID0gbWludXRlLnRvU3RyaW5nKCk7XG4gICAgICB3aGlsZSAobWludXRlLmxlbmd0aCA8IDIpIG1pbnV0ZSA9IFwiMFwiK21pbnV0ZTtcbiAgICAgIGRhdGV0aW1lLnRleHRDb250ZW50ID0gYCR7bW9udGh95pyIJHtkYXl95pelICR7aG91cn06JHttaW51dGV9YDtcblxuICAgICAgdmFyIHR5cGUgPSBHYW1lLmFyZWEubWFwLmRhdGEudHlwZTtcblxuICAgICAgaWYgKHR5cGUgPT0gXCJpbmRvb3JcIikge1xuICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgICAgIEdhbWUuc3RhZ2UuZmlsdGVyKFwiYnJpZ2h0bmVzc1wiLCAwLjApO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwib3V0ZG9vclwiKSB7XG4gICAgICAgIC8vIOWupOWkllxuICAgICAgICBpZiAoaG91ciA+PSAyMCB8fCBob3VyIDwgNCkgeyAvLyAyMDowMCB0byA0OjAwXG4gICAgICAgICAgR2FtZS5zdGFnZS5maWx0ZXIoXCJicmlnaHRuZXNzXCIsIC0wLjE1KTtcbiAgICAgICAgfSBlbHNlIGlmIChob3VyID49IDQgJiYgaG91ciA8IDYpIHtcbiAgICAgICAgICBHYW1lLnN0YWdlLmZpbHRlcihcImJyaWdodG5lc3NcIiwgLTAuMSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaG91ciA+PSA2ICYmIGhvdXIgPCA4KSB7XG4gICAgICAgICAgR2FtZS5zdGFnZS5maWx0ZXIoXCJicmlnaHRuZXNzXCIsIC0wLjA1KTtcbiAgICAgICAgfSBlbHNlIGlmIChob3VyID49IDggJiYgaG91ciA8IDEwKSB7XG4gICAgICAgICAgR2FtZS5zdGFnZS5maWx0ZXIoXCJicmlnaHRuZXNzXCIsIDAuMCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaG91ciA+PSAxMCAmJiBob3VyIDwgMTIpIHtcbiAgICAgICAgICBHYW1lLnN0YWdlLmZpbHRlcihcImJyaWdodG5lc3NcIiwgMC4wNSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaG91ciA+PSAxMiAmJiBob3VyIDwgMTQpIHtcbiAgICAgICAgICBHYW1lLnN0YWdlLmZpbHRlcihcImJyaWdodG5lc3NcIiwgMC4wKTtcbiAgICAgICAgfSBlbHNlIGlmIChob3VyID49IDE0ICYmIGhvdXIgPCAxNikge1xuICAgICAgICAgIEdhbWUuc3RhZ2UuZmlsdGVyKFwiYnJpZ2h0bmVzc1wiLCAwLjApO1xuICAgICAgICB9IGVsc2UgaWYgKGhvdXIgPj0gMTYgJiYgaG91ciA8IDE4KSB7XG4gICAgICAgICAgR2FtZS5zdGFnZS5maWx0ZXIoXCJicmlnaHRuZXNzXCIsIC0wLjA1KTtcbiAgICAgICAgfSBlbHNlIGlmIChob3VyID49IDE4ICYmIGhvdXIgPCAyMCkge1xuICAgICAgICAgIEdhbWUuc3RhZ2UuZmlsdGVyKFwiYnJpZ2h0bmVzc1wiLCAtMC4xKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiY2F2ZVwiKSB7XG4gICAgICAgIC8vIGNhdmVzIGFyZSBkYXJrXG4gICAgICAgIEdhbWUuc3RhZ2UuZmlsdGVyKFwiYnJpZ2h0bmVzc1wiLCAtMC4xNSk7XG4gICAgICB9XG5cbiAgICB9XG4gIH0pO1xuXG4gIHdpbi5hc3NpZ24oXCJyZWZyZXNoXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDg7IGkrKykge1xuICAgICAgbGV0IGVsZW1lbnQgPSBHYW1lLmhlcm8uZGF0YS5iYXJbaV07XG4gICAgICBsZXQgYnV0dG9uID0gYnV0dG9uc1tpXTtcbiAgICAgIGxldCB0ZXh0ID0gYnV0dG9uVGV4dHNbaV07XG4gICAgICBidXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIHRleHQuZGlzYWJsZWQgPSBmYWxzZTtcblxuICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgbGV0IGlkID0gZWxlbWVudC5pZDtcbiAgICAgICAgbGV0IHR5cGUgPSBlbGVtZW50LnR5cGU7XG4gICAgICAgIGlmICh0eXBlID09IFwic2tpbGxcIikge1xuICAgICAgICAgIGxldCBza2lsbCA9IEdhbWUuc2tpbGxzW2lkXTtcbiAgICAgICAgICBidXR0b24uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybChcIiR7c2tpbGwuaWNvbi5zcmN9XCIpYDtcbiAgICAgICAgICB0ZXh0LnRleHRDb250ZW50ID0gc2tpbGwuZGF0YS5jb3N0O1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJpdGVtXCIpIHtcbiAgICAgICAgICBsZXQgaXRlbSA9IEdhbWUuaXRlbXNbaWRdO1xuICAgICAgICAgIGJ1dHRvbi5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKFwiJHtpdGVtLmljb24uc3JjfVwiKWA7XG4gICAgICAgICAgaWYgKEdhbWUuaGVyby5kYXRhLml0ZW1zW2lkXSkge1xuICAgICAgICAgICAgdGV4dC50ZXh0Q29udGVudCA9IEdhbWUuaGVyby5kYXRhLml0ZW1zW2lkXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGV4dC50ZXh0Q29udGVudCA9IFwiMFwiO1xuICAgICAgICAgICAgYnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRleHQuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZW1wdHkgYmFyIGVsZW1lbnRcbiAgICAgICAgdGV4dC50ZXh0Q29udGVudCA9IFwiXCI7XG4gICAgICAgIGJ1dHRvbi5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcIlwiO1xuICAgICAgfVxuICAgIH1cblxuICAgIGludGVyZmFjZVdpbmRvd01hcC50ZXh0Q29udGVudCA9IEdhbWUuYXJlYS5tYXAuZGF0YS5uYW1lO1xuICB9KTtcblxuICBpbnRlcmZhY2VXaW5kb3dNZW51LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBHYW1lLndpbmRvd3Muc3lzbWVudS5zaG93KCk7XG4gIH0pO1xuXG5cbn0pKCk7XG4iXX0=
