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

  var win = Game.windows.sell = Game.Window.create("sellWindow");

  win.html = "\n  <div class=\"window-box\">\n    <div id=\"sellWindowItemBar\">\n\n      <button id=\"sellWindowClose\" class=\"brownButton\">关闭</button>\n      <button id=\"sellWindowBuy\" class=\"brownButton\">买入</button>\n\n      <button id=\"sellWindowAll\" class=\"brownButton\">全部</button>\n      <button id=\"sellWindowWeapon\" class=\"brownButton\">武器</button>\n      <button id=\"sellWindowArmor\" class=\"brownButton\">护甲</button>\n      <button id=\"sellWindowPotion\" class=\"brownButton\">药水</button>\n      <button id=\"sellWindowMaterial\" class=\"brownButton\">材料</button>\n      <button id=\"sellWindowBook\" class=\"brownButton\">书籍</button>\n      <button id=\"sellWindowMisc\" class=\"brownButton\">其他</button>\n    </div>\n\n    <span id=\"sellWindowGold\"></span>\n\n    <div style=\"overflow: auto; height: 300px;\">\n      <table border=\"0\">\n        <thead>\n          <tr>\n            <td style=\"width: 40px;\"></td>\n            <td style=\"width: 120px;\"></td>\n            <td style=\"width: 30px;\"></td>\n            <td style=\"width: 30px;\"></td>\n            <td></td>\n            <td style=\"width: 60px;\"></td>\n          </tr>\n        </thead>\n        <tbody id=\"sellWindowTable\"></tbody>\n      </table>\n    </div>\n  </div>\n  ";

  win.css = "\n\n    #sellWindowTable tr:nth-child(odd) {\n      background-color: rgba(192, 192, 192, 0.6);\n    }\n\n    #sellWindowItemBar > button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n      margin-left: 5px;\n      margin-right: 5px;\n      margin-top: 0px;\n      margin-bottom: 5px;\n    }\n\n    #sellWindowClose {\n      float: right;\n    }\n\n    #sellWindowStatus {\n      float: right;\n    }\n\n    .sellWindow table {\n      width: 100%;\n    }\n\n    .sellWindow table button {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n    }\n\n    #sellWindowGold {\n      position: absolute;\n      right: 100px;\n      bottom: 30px;\n      font-size: 20px;\n      color: black;\n    }\n  ";

  var sellWindowClose = win.querySelector("button#sellWindowClose");
  var sellWindowBuy = win.querySelector("button#sellWindowBuy");

  var sellWindowAll = win.querySelector("button#sellWindowAll");
  var sellWindowWeapon = win.querySelector("button#sellWindowWeapon");
  var sellWindowArmor = win.querySelector("button#sellWindowArmor");
  var sellWindowPotion = win.querySelector("button#sellWindowPotion");
  var sellWindowMaterial = win.querySelector("button#sellWindowMaterial");
  var sellWindowBook = win.querySelector("button#sellWindowBook");
  var sellWindowMisc = win.querySelector("button#sellWindowMisc");

  var sellWindowGold = win.querySelector("span#sellWindowGold");
  var sellWindowTable = win.querySelector("#sellWindowTable");

  var lastItems = null;
  var lastFilter = null;
  var lastSelect = -1;

  sellWindowClose.addEventListener("click", function () {
    win.hide();
  });

  sellWindowBuy.addEventListener("click", function () {
    win.hide();
    Game.windows.buy.open(lastItems);
  });

  win.whenUp(["tab"], function () {
    setTimeout(function () {
      win.hide();
      Game.windows.buy.open(lastItems);
    }, 20);
  });

  sellWindowAll.addEventListener("click", function (event) {
    win.open(lastItems, null);
  });

  sellWindowWeapon.addEventListener("click", function (event) {
    win.open(lastItems, "sword|spear|bow");
  });

  sellWindowArmor.addEventListener("click", function (event) {
    win.open(lastItems, "head|body|feet");
  });

  sellWindowPotion.addEventListener("click", function (event) {
    win.open(lastItems, "potion");
  });

  sellWindowMaterial.addEventListener("click", function (event) {
    win.open(lastItems, "material");
  });

  sellWindowBook.addEventListener("click", function (event) {
    win.open(lastItems, "book|scroll|letter");
  });

  sellWindowMisc.addEventListener("click", function (event) {
    win.open(lastItems, "misc");
  });

  win.assign("open", function (items, filter, select) {

    if (typeof select == "undefined") {
      select = -1;
    }

    lastItems = items;
    lastFilter = filter;
    lastSelect = select;

    sellWindowGold.textContent = Game.hero.data.gold + "G";

    var defaultColor = "white";
    var activeColor = "yellow";

    sellWindowAll.style.color = defaultColor;
    sellWindowWeapon.style.color = defaultColor;
    sellWindowArmor.style.color = defaultColor;
    sellWindowPotion.style.color = defaultColor;
    sellWindowMaterial.style.color = defaultColor;
    sellWindowBook.style.color = defaultColor;
    sellWindowMisc.style.color = defaultColor;

    if (filter == null) {
      sellWindowAll.style.color = activeColor;
    } else if (filter.match(/sword/)) {
      sellWindowWeapon.style.color = activeColor;
    } else if (filter.match(/head/)) {
      sellWindowArmor.style.color = activeColor;
    } else if (filter.match(/potion/)) {
      sellWindowPotion.style.color = activeColor;
    } else if (filter.match(/material/)) {
      sellWindowMaterial.style.color = activeColor;
    } else if (filter.match(/book/)) {
      sellWindowBook.style.color = activeColor;
    } else if (filter.match(/misc/)) {
      sellWindowMisc.style.color = activeColor;
    }

    var index = 0;
    var table = "";
    Sprite.each(Game.hero.data.items, function (itemCount, itemId) {
      var item = Game.items[itemId];

      if (filter && filter.indexOf(item.data.type) == -1) return;

      var line = "";

      if (select == index) {
        line += "<tr style=\"background-color: green;\">\n";
      } else {
        line += "<tr>\n";
      }

      if (item.icon) {
        line += "  <td style=\"text-align: center;\"><img alt=\"\" src=\"" + item.icon.src + "\"></td>\n";
      } else {
        line += "  <td> </td>\n";
      }
      line += "  <td>" + item.data.name + "</td>\n";
      line += "  <td style=\"text-align: center;\">" + Math.ceil(item.data.value * 0.8) + "G</td>\n";
      line += "  <td style=\"text-align: center;\">" + itemCount + "</td>\n";
      line += "  <td>" + item.data.description + "</td>\n";
      line += "  <td><button data-id=\"" + itemId + "\" class=\"brownButton\">卖出</button></td>\n";

      line += "</tr>\n";
      table += line;
      index++;
    });

    sellWindowTable.innerHTML = table;
    win.show();
  });

  win.whenUp(["enter"], function () {
    var buttons = sellWindowTable.querySelectorAll("button");
    if (lastSelect >= 0 && lastSelect < buttons.length) {
      buttons[lastSelect].click();
    }
  });

  win.whenUp(["up", "down"], function (key) {
    var count = sellWindowTable.querySelectorAll("button").length;
    if (count <= 0) return;

    if (lastSelect == -1) {
      if (key == "down") {
        win.open(lastItems, lastFilter, 0);
      } else if (key == "up") {
        win.open(lastItems, lastFilter, count - 1);
      }
    } else {
      if (key == "down") {
        var select = lastSelect + 1;
        if (select >= count) {
          select = 0;
        }
        win.open(lastItems, lastFilter, select);
      } else if (key == "up") {
        var select = lastSelect - 1;
        if (select < 0) {
          select = count - 1;
        }
        win.open(lastItems, lastFilter, select);
      }
    }
  });

  win.whenUp(["esc"], function () {
    setTimeout(function () {
      win.hide();
    }, 20);
  });

  win.whenUp(["left", "right"], function (key) {
    if (key == "right") {
      var filter = lastFilter;
      if (filter == null) {
        filter = "sword";
      } else if (filter.match(/sword/)) {
        filter = "head";
      } else if (filter.match(/head/)) {
        filter = "potion";
      } else if (filter.match(/potion/)) {
        filter = "material";
      } else if (filter.match(/material/)) {
        filter = "book";
      } else if (filter.match(/book/)) {
        filter = "misc";
      } else if (filter.match(/misc/)) {
        filter = null;
      }
      win.open(lastItems, filter);
    } else if (key == "left") {
      var filter = lastFilter;
      if (filter == null) {
        filter = "misc";
      } else if (filter.match(/sword/)) {
        filter = null;
      } else if (filter.match(/head/)) {
        filter = "sword";
      } else if (filter.match(/potion/)) {
        filter = "head";
      } else if (filter.match(/material/)) {
        filter = "potion";
      } else if (filter.match(/book/)) {
        filter = "material";
      } else if (filter.match(/misc/)) {
        filter = "book";
      }
      win.open(lastItems, filter);
    }
  });

  sellWindowTable.addEventListener("click", function (event) {
    var itemId = event.target.getAttribute("data-id");
    if (itemId && Game.hero.data.items.hasOwnProperty(itemId)) {
      var item = Game.items[itemId];
      var itemCount = Game.hero.data.items[itemId];

      if (lastItems.hasOwnProperty(itemId)) {
        lastItems[itemId]++;
      } else {
        lastItems[itemId] = 1;
      }

      if (itemCount == 1) {
        Game.hero.data.bar.forEach(function (element, index, array) {
          if (element && element.id == itemId) {
            array[index] = null;
          }
        });
        Sprite.each(Game.hero.data.equipment, function (element, key) {
          if (element == itemId) {
            Game.hero.data.equipment[key] = null;
          }
        });
        delete Game.hero.data.items[itemId];
      } else {
        Game.hero.data.items[itemId]--;
      }

      Game.hero.data.gold += Math.ceil(item.data.value * 0.8);
      Game.windows["interface"].refresh();
      win.open(lastItems, lastFilter);
    }
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9HYW1lL0dhbWVXaW5kb3dTZWxsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUUvRCxLQUFHLENBQUMsSUFBSSx1dkNBa0NQLENBQUM7O0FBRUYsS0FBRyxDQUFDLEdBQUcsaXVCQXlDTixDQUFDOztBQUVGLE1BQUksZUFBZSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUNsRSxNQUFJLGFBQWEsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLHNCQUFzQixDQUFDLENBQUM7O0FBRTlELE1BQUksYUFBYSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUM5RCxNQUFJLGdCQUFnQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUNwRSxNQUFJLGVBQWUsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDbEUsTUFBSSxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDcEUsTUFBSSxrQkFBa0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFDeEUsTUFBSSxjQUFjLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ2hFLE1BQUksY0FBYyxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUMsQ0FBQzs7QUFFaEUsTUFBSSxjQUFjLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQzlELE1BQUksZUFBZSxH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O0FBQzVELGNBQUksT0FBTyxJQUFJLE1BQU0sRUFBRTtBQUNyQixnQkFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztXQUN0QztTQUNGLENBQUMsQ0FBQztBQUNILGVBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQ3JDLE1BQU07QUFDTCxZQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztPQUNoQzs7QUFFRCxVQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQztBQUN4RCxVQUFJLENBQUMsT0FBTyxhQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDakMsU0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7S0FDakM7R0FDRixDQUFDLENBQUM7Q0FHSixDQUFBLEVBQUcsQ0FBQyIsImZpbGUiOiJzcmMvR2FtZS9HYW1lV2luZG93U2VsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cbkEtUlBHIEdhbWUsIEJ1aWx0IHVzaW5nIEphdmFTY3JpcHQgRVM2XG5Db3B5cmlnaHQgKEMpIDIwMTUgcWhkdWFuKGh0dHA6Ly9xaGR1YW4uY29tKVxuXG5UaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5UaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG5HTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG5Zb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG5cbiovXG5cbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGxldCB3aW4gPSBHYW1lLndpbmRvd3Muc2VsbCA9IEdhbWUuV2luZG93LmNyZWF0ZShcInNlbGxXaW5kb3dcIik7XG5cbiAgd2luLmh0bWwgPSBgXG4gIDxkaXYgY2xhc3M9XCJ3aW5kb3ctYm94XCI+XG4gICAgPGRpdiBpZD1cInNlbGxXaW5kb3dJdGVtQmFyXCI+XG5cbiAgICAgIDxidXR0b24gaWQ9XCJzZWxsV2luZG93Q2xvc2VcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5YWz6ZetPC9idXR0b24+XG4gICAgICA8YnV0dG9uIGlkPVwic2VsbFdpbmRvd0J1eVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7kubDlhaU8L2J1dHRvbj5cblxuICAgICAgPGJ1dHRvbiBpZD1cInNlbGxXaW5kb3dBbGxcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5YWo6YOoPC9idXR0b24+XG4gICAgICA8YnV0dG9uIGlkPVwic2VsbFdpbmRvd1dlYXBvblwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7mrablmag8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gaWQ9XCJzZWxsV2luZG93QXJtb3JcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5oqk55SyPC9idXR0b24+XG4gICAgICA8YnV0dG9uIGlkPVwic2VsbFdpbmRvd1BvdGlvblwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7oja/msLQ8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gaWQ9XCJzZWxsV2luZG93TWF0ZXJpYWxcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5p2Q5paZPC9idXR0b24+XG4gICAgICA8YnV0dG9uIGlkPVwic2VsbFdpbmRvd0Jvb2tcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5Lmm57GNPC9idXR0b24+XG4gICAgICA8YnV0dG9uIGlkPVwic2VsbFdpbmRvd01pc2NcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5YW25LuWPC9idXR0b24+XG4gICAgPC9kaXY+XG5cbiAgICA8c3BhbiBpZD1cInNlbGxXaW5kb3dHb2xkXCI+PC9zcGFuPlxuXG4gICAgPGRpdiBzdHlsZT1cIm92ZXJmbG93OiBhdXRvOyBoZWlnaHQ6IDMwMHB4O1wiPlxuICAgICAgPHRhYmxlIGJvcmRlcj1cIjBcIj5cbiAgICAgICAgPHRoZWFkPlxuICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgIDx0ZCBzdHlsZT1cIndpZHRoOiA0MHB4O1wiPjwvdGQ+XG4gICAgICAgICAgICA8dGQgc3R5bGU9XCJ3aWR0aDogMTIwcHg7XCI+PC90ZD5cbiAgICAgICAgICAgIDx0ZCBzdHlsZT1cIndpZHRoOiAzMHB4O1wiPjwvdGQ+XG4gICAgICAgICAgICA8dGQgc3R5bGU9XCJ3aWR0aDogMzBweDtcIj48L3RkPlxuICAgICAgICAgICAgPHRkPjwvdGQ+XG4gICAgICAgICAgICA8dGQgc3R5bGU9XCJ3aWR0aDogNjBweDtcIj48L3RkPlxuICAgICAgICAgIDwvdHI+XG4gICAgICAgIDwvdGhlYWQ+XG4gICAgICAgIDx0Ym9keSBpZD1cInNlbGxXaW5kb3dUYWJsZVwiPjwvdGJvZHk+XG4gICAgICA8L3RhYmxlPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgYDtcblxuICB3aW4uY3NzID0gYFxuXG4gICAgI3NlbGxXaW5kb3dUYWJsZSB0cjpudGgtY2hpbGQob2RkKSB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDE5MiwgMTkyLCAxOTIsIDAuNik7XG4gICAgfVxuXG4gICAgI3NlbGxXaW5kb3dJdGVtQmFyID4gYnV0dG9uIHtcbiAgICAgIHdpZHRoOiA2MHB4O1xuICAgICAgaGVpZ2h0OiA0MHB4O1xuICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgICAgbWFyZ2luLWxlZnQ6IDVweDtcbiAgICAgIG1hcmdpbi1yaWdodDogNXB4O1xuICAgICAgbWFyZ2luLXRvcDogMHB4O1xuICAgICAgbWFyZ2luLWJvdHRvbTogNXB4O1xuICAgIH1cblxuICAgICNzZWxsV2luZG93Q2xvc2Uge1xuICAgICAgZmxvYXQ6IHJpZ2h0O1xuICAgIH1cblxuICAgICNzZWxsV2luZG93U3RhdHVzIHtcbiAgICAgIGZsb2F0OiByaWdodDtcbiAgICB9XG5cbiAgICAuc2VsbFdpbmRvdyB0YWJsZSB7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAuc2VsbFdpbmRvdyB0YWJsZSBidXR0b24ge1xuICAgICAgd2lkdGg6IDYwcHg7XG4gICAgICBoZWlnaHQ6IDQwcHg7XG4gICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgfVxuXG4gICAgI3NlbGxXaW5kb3dHb2xkIHtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIHJpZ2h0OiAxMDBweDtcbiAgICAgIGJvdHRvbTogMzBweDtcbiAgICAgIGZvbnQtc2l6ZTogMjBweDtcbiAgICAgIGNvbG9yOiBibGFjaztcbiAgICB9XG4gIGA7XG5cbiAgbGV0IHNlbGxXaW5kb3dDbG9zZSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI3NlbGxXaW5kb3dDbG9zZVwiKTtcbiAgbGV0IHNlbGxXaW5kb3dCdXkgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNzZWxsV2luZG93QnV5XCIpO1xuXG4gIGxldCBzZWxsV2luZG93QWxsID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jc2VsbFdpbmRvd0FsbFwiKTtcbiAgbGV0IHNlbGxXaW5kb3dXZWFwb24gPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNzZWxsV2luZG93V2VhcG9uXCIpO1xuICBsZXQgc2VsbFdpbmRvd0FybW9yID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCJidXR0b24jc2VsbFdpbmRvd0FybW9yXCIpO1xuICBsZXQgc2VsbFdpbmRvd1BvdGlvbiA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI3NlbGxXaW5kb3dQb3Rpb25cIik7XG4gIGxldCBzZWxsV2luZG93TWF0ZXJpYWwgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNzZWxsV2luZG93TWF0ZXJpYWxcIik7XG4gIGxldCBzZWxsV2luZG93Qm9vayA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uI3NlbGxXaW5kb3dCb29rXCIpO1xuICBsZXQgc2VsbFdpbmRvd01pc2MgPSB3aW4ucXVlcnlTZWxlY3RvcihcImJ1dHRvbiNzZWxsV2luZG93TWlzY1wiKTtcblxuICBsZXQgc2VsbFdpbmRvd0dvbGQgPSB3aW4ucXVlcnlTZWxlY3RvcihcInNwYW4jc2VsbFdpbmRvd0dvbGRcIik7XG4gIGxldCBzZWxsV2luZG93VGFibGUgPSB3aW4ucXVlcnlTZWxlY3RvcihcIiNzZWxsV2luZG93VGFibGVcIik7XG5cbiAgbGV0IGxhc3RJdGVtcyA9IG51bGw7XG4gIGxldCBsYXN0RmlsdGVyID0gbnVsbDtcbiAgbGV0IGxhc3RTZWxlY3QgPSAtMTtcblxuICBzZWxsV2luZG93Q2xvc2UuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICB3aW4uaGlkZSgpO1xuICB9KTtcblxuICBzZWxsV2luZG93QnV5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgd2luLmhpZGUoKTtcbiAgICBHYW1lLndpbmRvd3MuYnV5Lm9wZW4obGFzdEl0ZW1zKTtcbiAgfSk7XG5cbiAgd2luLndoZW5VcChbXCJ0YWJcIl0sIGZ1bmN0aW9uICgpIHtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbi5oaWRlKCk7XG4gICAgICBHYW1lLndpbmRvd3MuYnV5Lm9wZW4obGFzdEl0ZW1zKTtcbiAgICB9LCAyMCk7XG4gIH0pO1xuXG4gIHNlbGxXaW5kb3dBbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHdpbi5vcGVuKGxhc3RJdGVtcywgbnVsbCk7XG4gIH0pO1xuXG4gIHNlbGxXaW5kb3dXZWFwb24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHdpbi5vcGVuKGxhc3RJdGVtcywgXCJzd29yZHxzcGVhcnxib3dcIik7XG4gIH0pO1xuXG4gIHNlbGxXaW5kb3dBcm1vci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgd2luLm9wZW4obGFzdEl0ZW1zLCBcImhlYWR8Ym9keXxmZWV0XCIpO1xuICB9KTtcblxuICBzZWxsV2luZG93UG90aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4ub3BlbihsYXN0SXRlbXMsIFwicG90aW9uXCIpO1xuICB9KTtcblxuICBzZWxsV2luZG93TWF0ZXJpYWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHdpbi5vcGVuKGxhc3RJdGVtcywgXCJtYXRlcmlhbFwiKTtcbiAgfSk7XG5cbiAgc2VsbFdpbmRvd0Jvb2suYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHdpbi5vcGVuKGxhc3RJdGVtcywgXCJib29rfHNjcm9sbHxsZXR0ZXJcIik7XG4gIH0pO1xuXG4gIHNlbGxXaW5kb3dNaXNjLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB3aW4ub3BlbihsYXN0SXRlbXMsIFwibWlzY1wiKTtcbiAgfSk7XG5cbiAgd2luLmFzc2lnbihcIm9wZW5cIiwgZnVuY3Rpb24gKGl0ZW1zLCBmaWx0ZXIsIHNlbGVjdCkge1xuXG4gICAgaWYgKHR5cGVvZiBzZWxlY3QgPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgc2VsZWN0ID0gLTE7XG4gICAgfVxuXG4gICAgbGFzdEl0ZW1zID0gaXRlbXM7XG4gICAgbGFzdEZpbHRlciA9IGZpbHRlcjtcbiAgICBsYXN0U2VsZWN0ID0gc2VsZWN0O1xuXG4gICAgc2VsbFdpbmRvd0dvbGQudGV4dENvbnRlbnQgPSBHYW1lLmhlcm8uZGF0YS5nb2xkICsgXCJHXCI7XG5cbiAgICBsZXQgZGVmYXVsdENvbG9yID0gXCJ3aGl0ZVwiO1xuICAgIGxldCBhY3RpdmVDb2xvciA9IFwieWVsbG93XCI7XG5cbiAgICBzZWxsV2luZG93QWxsLnN0eWxlLmNvbG9yID0gZGVmYXVsdENvbG9yO1xuICAgIHNlbGxXaW5kb3dXZWFwb24uc3R5bGUuY29sb3IgPSBkZWZhdWx0Q29sb3I7XG4gICAgc2VsbFdpbmRvd0FybW9yLnN0eWxlLmNvbG9yID0gZGVmYXVsdENvbG9yO1xuICAgIHNlbGxXaW5kb3dQb3Rpb24uc3R5bGUuY29sb3IgPSBkZWZhdWx0Q29sb3I7XG4gICAgc2VsbFdpbmRvd01hdGVyaWFsLnN0eWxlLmNvbG9yID0gZGVmYXVsdENvbG9yO1xuICAgIHNlbGxXaW5kb3dCb29rLnN0eWxlLmNvbG9yID0gZGVmYXVsdENvbG9yO1xuICAgIHNlbGxXaW5kb3dNaXNjLnN0eWxlLmNvbG9yID0gZGVmYXVsdENvbG9yO1xuXG4gICAgaWYgKGZpbHRlciA9PSBudWxsKSB7XG4gICAgICBzZWxsV2luZG93QWxsLnN0eWxlLmNvbG9yID0gYWN0aXZlQ29sb3I7XG4gICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL3N3b3JkLykpIHtcbiAgICAgIHNlbGxXaW5kb3dXZWFwb24uc3R5bGUuY29sb3IgPSBhY3RpdmVDb2xvcjtcbiAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvaGVhZC8pKSB7XG4gICAgICBzZWxsV2luZG93QXJtb3Iuc3R5bGUuY29sb3IgPSBhY3RpdmVDb2xvcjtcbiAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvcG90aW9uLykpIHtcbiAgICAgIHNlbGxXaW5kb3dQb3Rpb24uc3R5bGUuY29sb3IgPSBhY3RpdmVDb2xvcjtcbiAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvbWF0ZXJpYWwvKSkge1xuICAgICAgc2VsbFdpbmRvd01hdGVyaWFsLnN0eWxlLmNvbG9yID0gYWN0aXZlQ29sb3I7XG4gICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL2Jvb2svKSkge1xuICAgICAgc2VsbFdpbmRvd0Jvb2suc3R5bGUuY29sb3IgPSBhY3RpdmVDb2xvcjtcbiAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvbWlzYy8pKSB7XG4gICAgICBzZWxsV2luZG93TWlzYy5zdHlsZS5jb2xvciA9IGFjdGl2ZUNvbG9yO1xuICAgIH1cblxuICAgIGxldCBpbmRleCA9IDA7XG4gICAgbGV0IHRhYmxlID0gXCJcIjtcbiAgICBTcHJpdGUuZWFjaChHYW1lLmhlcm8uZGF0YS5pdGVtcywgZnVuY3Rpb24gKGl0ZW1Db3VudCwgaXRlbUlkKSB7XG4gICAgICBsZXQgaXRlbSA9IEdhbWUuaXRlbXNbaXRlbUlkXTtcblxuICAgICAgaWYgKGZpbHRlciAmJiBmaWx0ZXIuaW5kZXhPZihpdGVtLmRhdGEudHlwZSkgPT0gLTEpXG4gICAgICAgIHJldHVybjtcblxuICAgICAgbGV0IGxpbmUgPSBcIlwiO1xuXG4gICAgICBpZiAoc2VsZWN0ID09IGluZGV4KSB7XG4gICAgICAgIGxpbmUgKz0gYDx0ciBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6IGdyZWVuO1wiPlxcbmA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaW5lICs9IGA8dHI+XFxuYDtcbiAgICAgIH1cblxuXG4gICAgICBpZiAoaXRlbS5pY29uKSB7XG4gICAgICAgIGxpbmUgKz0gYCAgPHRkIHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyO1wiPjxpbWcgYWx0PVwiXCIgc3JjPVwiJHtpdGVtLmljb24uc3JjfVwiPjwvdGQ+XFxuYDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxpbmUgKz0gYCAgPHRkPiA8L3RkPlxcbmA7XG4gICAgICB9XG4gICAgICBsaW5lICs9IGAgIDx0ZD4ke2l0ZW0uZGF0YS5uYW1lfTwvdGQ+XFxuYDtcbiAgICAgIGxpbmUgKz0gYCAgPHRkIHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyO1wiPiR7TWF0aC5jZWlsKGl0ZW0uZGF0YS52YWx1ZSAqIDAuOCl9RzwvdGQ+XFxuYDtcbiAgICAgIGxpbmUgKz0gYCAgPHRkIHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyO1wiPiR7aXRlbUNvdW50fTwvdGQ+XFxuYDtcbiAgICAgIGxpbmUgKz0gYCAgPHRkPiR7aXRlbS5kYXRhLmRlc2NyaXB0aW9ufTwvdGQ+XFxuYDtcbiAgICAgIGxpbmUgKz0gYCAgPHRkPjxidXR0b24gZGF0YS1pZD1cIiR7aXRlbUlkfVwiIGNsYXNzPVwiYnJvd25CdXR0b25cIj7ljZblh7o8L2J1dHRvbj48L3RkPlxcbmA7XG5cbiAgICAgIGxpbmUgKz0gXCI8L3RyPlxcblwiO1xuICAgICAgdGFibGUgKz0gbGluZTtcbiAgICAgIGluZGV4Kys7XG4gICAgfSk7XG5cbiAgICBzZWxsV2luZG93VGFibGUuaW5uZXJIVE1MID0gdGFibGU7XG4gICAgd2luLnNob3coKTtcbiAgfSk7XG5cbiAgd2luLndoZW5VcChbXCJlbnRlclwiXSwgZnVuY3Rpb24gKCkge1xuICAgIGxldCBidXR0b25zID0gc2VsbFdpbmRvd1RhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJidXR0b25cIik7XG4gICAgaWYgKGxhc3RTZWxlY3QgPj0gMCAmJiBsYXN0U2VsZWN0IDwgYnV0dG9ucy5sZW5ndGgpIHtcbiAgICAgIGJ1dHRvbnNbbGFzdFNlbGVjdF0uY2xpY2soKTtcbiAgICB9XG4gIH0pO1xuXG4gIHdpbi53aGVuVXAoW1widXBcIiwgXCJkb3duXCJdLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgbGV0IGNvdW50ID0gc2VsbFdpbmRvd1RhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJidXR0b25cIikubGVuZ3RoO1xuICAgIGlmIChjb3VudCA8PSAwKSByZXR1cm47XG5cbiAgICBpZiAobGFzdFNlbGVjdCA9PSAtMSkge1xuICAgICAgaWYgKGtleSA9PSBcImRvd25cIikge1xuICAgICAgICB3aW4ub3BlbihsYXN0SXRlbXMsIGxhc3RGaWx0ZXIsIDApO1xuICAgICAgfSBlbHNlIGlmIChrZXkgPT0gXCJ1cFwiKSB7XG4gICAgICAgIHdpbi5vcGVuKGxhc3RJdGVtcywgbGFzdEZpbHRlciwgY291bnQgLSAxKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGtleSA9PSBcImRvd25cIikge1xuICAgICAgICBsZXQgc2VsZWN0ID0gbGFzdFNlbGVjdCArIDE7XG4gICAgICAgIGlmIChzZWxlY3QgPj0gY291bnQpIHtcbiAgICAgICAgICBzZWxlY3QgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHdpbi5vcGVuKGxhc3RJdGVtcywgbGFzdEZpbHRlciwgc2VsZWN0KTtcbiAgICAgIH0gZWxzZSBpZiAoa2V5ID09IFwidXBcIikge1xuICAgICAgICBsZXQgc2VsZWN0ID0gbGFzdFNlbGVjdCAtIDE7XG4gICAgICAgIGlmIChzZWxlY3QgPCAwKSB7XG4gICAgICAgICAgc2VsZWN0ID0gY291bnQgLSAxO1xuICAgICAgICB9XG4gICAgICAgIHdpbi5vcGVuKGxhc3RJdGVtcywgbGFzdEZpbHRlciwgc2VsZWN0KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHdpbi53aGVuVXAoW1wiZXNjXCJdLCBmdW5jdGlvbiAoKSB7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICB3aW4uaGlkZSgpO1xuICAgIH0sIDIwKTtcbiAgfSk7XG5cbiAgd2luLndoZW5VcChbXCJsZWZ0XCIsIFwicmlnaHRcIl0sIGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAoa2V5ID09IFwicmlnaHRcIikge1xuICAgICAgbGV0IGZpbHRlciA9IGxhc3RGaWx0ZXI7XG4gICAgICBpZiAoZmlsdGVyID09IG51bGwpIHtcbiAgICAgICAgZmlsdGVyID0gXCJzd29yZFwiO1xuICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL3N3b3JkLykpIHtcbiAgICAgICAgZmlsdGVyID0gXCJoZWFkXCI7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvaGVhZC8pKSB7XG4gICAgICAgIGZpbHRlciA9IFwicG90aW9uXCI7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvcG90aW9uLykpIHtcbiAgICAgICAgZmlsdGVyID0gXCJtYXRlcmlhbFwiO1xuICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL21hdGVyaWFsLykpIHtcbiAgICAgICAgZmlsdGVyID0gXCJib29rXCI7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvYm9vay8pKSB7XG4gICAgICAgIGZpbHRlciA9IFwibWlzY1wiO1xuICAgICAgfSBlbHNlIGlmIChmaWx0ZXIubWF0Y2goL21pc2MvKSkge1xuICAgICAgICBmaWx0ZXIgPSBudWxsO1xuICAgICAgfVxuICAgICAgd2luLm9wZW4obGFzdEl0ZW1zLCBmaWx0ZXIpO1xuICAgIH0gZWxzZSBpZiAoa2V5ID09IFwibGVmdFwiKSB7XG4gICAgICBsZXQgZmlsdGVyID0gbGFzdEZpbHRlcjtcbiAgICAgIGlmIChmaWx0ZXIgPT0gbnVsbCkge1xuICAgICAgICBmaWx0ZXIgPSBcIm1pc2NcIjtcbiAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9zd29yZC8pKSB7XG4gICAgICAgIGZpbHRlciA9IG51bGw7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvaGVhZC8pKSB7XG4gICAgICAgIGZpbHRlciA9IFwic3dvcmRcIjtcbiAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9wb3Rpb24vKSkge1xuICAgICAgICBmaWx0ZXIgPSBcImhlYWRcIjtcbiAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9tYXRlcmlhbC8pKSB7XG4gICAgICAgIGZpbHRlciA9IFwicG90aW9uXCI7XG4gICAgICB9IGVsc2UgaWYgKGZpbHRlci5tYXRjaCgvYm9vay8pKSB7XG4gICAgICAgIGZpbHRlciA9IFwibWF0ZXJpYWxcIjtcbiAgICAgIH0gZWxzZSBpZiAoZmlsdGVyLm1hdGNoKC9taXNjLykpIHtcbiAgICAgICAgZmlsdGVyID0gXCJib29rXCI7XG4gICAgICB9XG4gICAgICB3aW4ub3BlbihsYXN0SXRlbXMsIGZpbHRlcik7XG4gICAgfVxuICB9KTtcblxuICBzZWxsV2luZG93VGFibGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGxldCBpdGVtSWQgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1pZFwiKTtcbiAgICBpZiAoaXRlbUlkICYmIEdhbWUuaGVyby5kYXRhLml0ZW1zLmhhc093blByb3BlcnR5KGl0ZW1JZCkpIHtcbiAgICAgIGxldCBpdGVtID0gR2FtZS5pdGVtc1tpdGVtSWRdO1xuICAgICAgbGV0IGl0ZW1Db3VudCA9IEdhbWUuaGVyby5kYXRhLml0ZW1zW2l0ZW1JZF07XG5cbiAgICAgIGlmIChsYXN0SXRlbXMuaGFzT3duUHJvcGVydHkoaXRlbUlkKSkge1xuICAgICAgICBsYXN0SXRlbXNbaXRlbUlkXSsrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGFzdEl0ZW1zW2l0ZW1JZF0gPSAxO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbUNvdW50ID09IDEpIHtcbiAgICAgICAgR2FtZS5oZXJvLmRhdGEuYmFyLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQsIGluZGV4LCBhcnJheSkge1xuICAgICAgICAgIGlmIChlbGVtZW50ICYmIGVsZW1lbnQuaWQgPT0gaXRlbUlkKSB7XG4gICAgICAgICAgICBhcnJheVtpbmRleF0gPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFNwcml0ZS5lYWNoKEdhbWUuaGVyby5kYXRhLmVxdWlwbWVudCwgZnVuY3Rpb24gKGVsZW1lbnQsIGtleSkge1xuICAgICAgICAgIGlmIChlbGVtZW50ID09IGl0ZW1JZCkge1xuICAgICAgICAgICAgR2FtZS5oZXJvLmRhdGEuZXF1aXBtZW50W2tleV0gPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGRlbGV0ZSBHYW1lLmhlcm8uZGF0YS5pdGVtc1tpdGVtSWRdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgR2FtZS5oZXJvLmRhdGEuaXRlbXNbaXRlbUlkXS0tO1xuICAgICAgfVxuXG4gICAgICBHYW1lLmhlcm8uZGF0YS5nb2xkICs9IE1hdGguY2VpbChpdGVtLmRhdGEudmFsdWUgKiAwLjgpO1xuICAgICAgR2FtZS53aW5kb3dzLmludGVyZmFjZS5yZWZyZXNoKCk7XG4gICAgICB3aW4ub3BlbihsYXN0SXRlbXMsIGxhc3RGaWx0ZXIpO1xuICAgIH1cbiAgfSk7XG5cblxufSkoKTtcbiJdfQ==