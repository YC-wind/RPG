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

  var win = Game.windows.setting = Game.Window.create("settingWindow");

  win.html = "\n    <div class=\"window-box\">\n      <button id=\"settingWindowClose\" class=\"brownButton\">关闭</button>\n\n      <div id=\"settingWindowRendererType\"></div>\n\n      <div id=\"settingWindowBox\">\n        <button id=\"settingWindowFullscreen\" class=\"brownButton\">全屏</button>\n        <button id=\"settingWindowScale\" class=\"brownButton\">缩放</button>\n        <button id=\"settingWindowShortcut\" class=\"brownButton\">清除快捷栏</button>\n        <button id=\"settingWindowShortcutAll\" class=\"brownButton\">清除全部快捷栏</button>\n      </div>\n    </div>\n  ";

  win.css = "\n    #settingWindowBox {\n      width: 100%;\n      height: 360px;\n    }\n\n    #settingWindowBox button {\n      width: 120px;\n      height: 60px;\n      font-size: 16px;\n      display: block;\n    }\n\n    #settingWindowClose {\n      width: 60px;\n      height: 40px;\n      font-size: 16px;\n      float: right;\n    }\n  ";

  var settingWindowShortcut = win.querySelector("#settingWindowShortcut");
  var settingWindowShortcutAll = win.querySelector("#settingWindowShortcutAll");

  var settingWindowClose = win.querySelector("#settingWindowClose");
  var settingWindowScale = win.querySelector("#settingWindowScale");

  var settingWindowFullscreen = win.querySelector("#settingWindowFullscreen");
  var settingWindowRendererType = win.querySelector("#settingWindowRendererType");

  settingWindowShortcut.addEventListener("click", function (event) {
    Game.choice({ 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7 }).then(function (choice) {
      if (Number.isFinite(choice)) {
        Game.hero.data.bar[choice] = null;
        Game.windows["interface"].refresh();
      }
    });
  });

  settingWindowShortcutAll.addEventListener("click", function (event) {
    Game.confirm("确定要删除所有快捷栏图表吗？").then(function () {
      for (var i = 0; i < 8; i++) {
        Game.hero.data.bar[i] = null;
      }
      Game.windows["interface"].refresh();
    })["catch"](function () {
      // no
    });
  });

  win.on("beforeShow", function () {
    settingWindowRendererType.textContent = Game.stage.rendererType;
  });

  settingWindowClose.addEventListener("click", function (event) {
    win.hide();
  });

  settingWindowScale.addEventListener("click", function (event) {
    Game.config.scale = !Game.config.scale;
    win.show();
  });

  win.whenUp(["esc"], function (key) {
    settingWindowClose.click();
  });

  function toggleFullScreen() {
    if (!document.fullscreenElement && // alternative standard method
    !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  settingWindowFullscreen.addEventListener("click", function (event) {
    toggleFullScreen();
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9HYW1lL0dhbWVXaW5kb3dTZXR0aW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsQ0FBQyxZQUFZO0FBQ1gsY0FBWSxDQUFDOztBQUViLE1BQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDOztBQUVyRSxLQUFHLENBQUMsSUFBSSxxakJBYVAsQ0FBQzs7QUFFRixLQUFHLENBQUMsR0FBRywrVUFtQk4sQ0FBQzs7QUFFRixNQUFJLHFCQUFxQixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUN4RSxNQUFJLHdCQUF3QixHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsMkJBQTJCLENBQUMsQ0FBQzs7QUFFOUUsTUFBSSxrQkFBa0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDbEUsTUFBSSxrQkFBa0IsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLHFCQUFxQixDQUFDLENBQUM7O0FBRWxFLE1BQUksdUJBQXVCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQzVFLE1BQUkseUJBQXlCLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDOztBQUVoRix1QkFBcUIsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDekQsUUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxF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LElBQUksUUFBUSxDQUFDLG1CQUFtQixFQUFFO0FBQ3ZDLGdCQUFRLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztPQUNoQyxNQUFNLElBQUksUUFBUSxDQUFDLG9CQUFvQixFQUFFO0FBQ3hDLGdCQUFRLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztPQUNqQztLQUNGO0dBQ0Y7O0FBRUQseUJBQXVCLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQzNELG9CQUFnQixFQUFFLENBQUM7R0FDcEIsQ0FBQyxDQUFDO0NBR0osQ0FBQSxFQUFHLENBQUMiLCJmaWxlIjoiR2FtZVdpbmRvd1NldHRpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXG5BLVJQRyBHYW1lLCBCdWlsdCB1c2luZyBKYXZhU2NyaXB0IEVTNlxuQ29weXJpZ2h0IChDKSAyMDE1IHFoZHVhbihodHRwOi8vcWhkdWFuLmNvbSlcblxuVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbml0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG50aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG5idXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbmFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgd2luID0gR2FtZS53aW5kb3dzLnNldHRpbmcgPSBHYW1lLldpbmRvdy5jcmVhdGUoXCJzZXR0aW5nV2luZG93XCIpO1xuXG4gIHdpbi5odG1sID0gYFxuICAgIDxkaXYgY2xhc3M9XCJ3aW5kb3ctYm94XCI+XG4gICAgICA8YnV0dG9uIGlkPVwic2V0dGluZ1dpbmRvd0Nsb3NlXCIgY2xhc3M9XCJicm93bkJ1dHRvblwiPuWFs+mXrTwvYnV0dG9uPlxuXG4gICAgICA8ZGl2IGlkPVwic2V0dGluZ1dpbmRvd1JlbmRlcmVyVHlwZVwiPjwvZGl2PlxuXG4gICAgICA8ZGl2IGlkPVwic2V0dGluZ1dpbmRvd0JveFwiPlxuICAgICAgICA8YnV0dG9uIGlkPVwic2V0dGluZ1dpbmRvd0Z1bGxzY3JlZW5cIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5YWo5bGPPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gaWQ9XCJzZXR0aW5nV2luZG93U2NhbGVcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+57yp5pS+PC9idXR0b24+XG4gICAgICAgIDxidXR0b24gaWQ9XCJzZXR0aW5nV2luZG93U2hvcnRjdXRcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5riF6Zmk5b+r5o235qCPPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gaWQ9XCJzZXR0aW5nV2luZG93U2hvcnRjdXRBbGxcIiBjbGFzcz1cImJyb3duQnV0dG9uXCI+5riF6Zmk5YWo6YOo5b+r5o235qCPPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYDtcblxuICB3aW4uY3NzID0gYFxuICAgICNzZXR0aW5nV2luZG93Qm94IHtcbiAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgaGVpZ2h0OiAzNjBweDtcbiAgICB9XG5cbiAgICAjc2V0dGluZ1dpbmRvd0JveCBidXR0b24ge1xuICAgICAgd2lkdGg6IDEyMHB4O1xuICAgICAgaGVpZ2h0OiA2MHB4O1xuICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgfVxuXG4gICAgI3NldHRpbmdXaW5kb3dDbG9zZSB7XG4gICAgICB3aWR0aDogNjBweDtcbiAgICAgIGhlaWdodDogNDBweDtcbiAgICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICAgIGZsb2F0OiByaWdodDtcbiAgICB9XG4gIGA7XG5cbiAgbGV0IHNldHRpbmdXaW5kb3dTaG9ydGN1dCA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI3NldHRpbmdXaW5kb3dTaG9ydGN1dFwiKTtcbiAgbGV0IHNldHRpbmdXaW5kb3dTaG9ydGN1dEFsbCA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI3NldHRpbmdXaW5kb3dTaG9ydGN1dEFsbFwiKTtcblxuICBsZXQgc2V0dGluZ1dpbmRvd0Nsb3NlID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjc2V0dGluZ1dpbmRvd0Nsb3NlXCIpO1xuICBsZXQgc2V0dGluZ1dpbmRvd1NjYWxlID0gd2luLnF1ZXJ5U2VsZWN0b3IoXCIjc2V0dGluZ1dpbmRvd1NjYWxlXCIpO1xuXG4gIGxldCBzZXR0aW5nV2luZG93RnVsbHNjcmVlbiA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI3NldHRpbmdXaW5kb3dGdWxsc2NyZWVuXCIpO1xuICBsZXQgc2V0dGluZ1dpbmRvd1JlbmRlcmVyVHlwZSA9IHdpbi5xdWVyeVNlbGVjdG9yKFwiI3NldHRpbmdXaW5kb3dSZW5kZXJlclR5cGVcIik7XG5cbiAgc2V0dGluZ1dpbmRvd1Nob3J0Y3V0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgICBHYW1lLmNob2ljZSh7MTowLCAyOjEsIDM6MiwgNDozLCA1OjQsIDY6NSwgNzo2LCA4Ojd9KS50aGVuKChjaG9pY2UpID0+IHtcbiAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUoY2hvaWNlKSkge1xuICAgICAgICBHYW1lLmhlcm8uZGF0YS5iYXJbY2hvaWNlXSA9IG51bGw7XG4gICAgICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2UucmVmcmVzaCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuXG4gIHNldHRpbmdXaW5kb3dTaG9ydGN1dEFsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiB7XG4gICAgR2FtZS5jb25maXJtKFwi56Gu5a6a6KaB5Yig6Zmk5omA5pyJ5b+r5o235qCP5Zu+6KGo5ZCX77yfXCIpLnRoZW4oKCkgPT4ge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA4OyBpKyspIHtcbiAgICAgICAgR2FtZS5oZXJvLmRhdGEuYmFyW2ldID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIEdhbWUud2luZG93cy5pbnRlcmZhY2UucmVmcmVzaCgpO1xuICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgIC8vIG5vXG4gICAgfSk7XG4gIH0pO1xuXG4gIHdpbi5vbihcImJlZm9yZVNob3dcIiwgZnVuY3Rpb24gKCkge1xuICAgIHNldHRpbmdXaW5kb3dSZW5kZXJlclR5cGUudGV4dENvbnRlbnQgPSBHYW1lLnN0YWdlLnJlbmRlcmVyVHlwZTtcbiAgfSk7XG5cbiAgc2V0dGluZ1dpbmRvd0Nsb3NlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgICB3aW4uaGlkZSgpO1xuICB9KTtcblxuICBzZXR0aW5nV2luZG93U2NhbGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldmVudCkgPT4ge1xuICAgIEdhbWUuY29uZmlnLnNjYWxlID0gIUdhbWUuY29uZmlnLnNjYWxlO1xuICAgIHdpbi5zaG93KCk7XG4gIH0pO1xuXG5cbiAgd2luLndoZW5VcChbXCJlc2NcIl0sIGZ1bmN0aW9uIChrZXkpIHtcbiAgICBzZXR0aW5nV2luZG93Q2xvc2UuY2xpY2soKTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gdG9nZ2xlRnVsbFNjcmVlbiAoKSB7XG4gICAgaWYgKCFkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCAmJiAgICAvLyBhbHRlcm5hdGl2ZSBzdGFuZGFyZCBtZXRob2RcbiAgICAgICAgIWRvY3VtZW50Lm1vekZ1bGxTY3JlZW5FbGVtZW50ICYmXG4gICAgICAgICFkb2N1bWVudC53ZWJraXRGdWxsc2NyZWVuRWxlbWVudCAmJlxuICAgICAgICAhZG9jdW1lbnQubXNGdWxsc2NyZWVuRWxlbWVudFxuICAgICkgeyAgLy8gY3VycmVudCB3b3JraW5nIG1ldGhvZHNcbiAgICAgIGlmIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQucmVxdWVzdEZ1bGxzY3JlZW4pIHtcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnJlcXVlc3RGdWxsc2NyZWVuKCk7XG4gICAgICB9IGVsc2UgaWYgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5tc1JlcXVlc3RGdWxsc2NyZWVuKSB7XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5tc1JlcXVlc3RGdWxsc2NyZWVuKCk7XG4gICAgICB9IGVsc2UgaWYgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbikge1xuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQubW96UmVxdWVzdEZ1bGxTY3JlZW4oKTtcbiAgICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuKSB7XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbihFbGVtZW50LkFMTE9XX0tFWUJPQVJEX0lOUFVUKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuKSB7XG4gICAgICAgIGRvY3VtZW50LmV4aXRGdWxsc2NyZWVuKCk7XG4gICAgICB9IGVsc2UgaWYgKGRvY3VtZW50Lm1zRXhpdEZ1bGxzY3JlZW4pIHtcbiAgICAgICAgZG9jdW1lbnQubXNFeGl0RnVsbHNjcmVlbigpO1xuICAgICAgfSBlbHNlIGlmIChkb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuKSB7XG4gICAgICAgIGRvY3VtZW50Lm1vekNhbmNlbEZ1bGxTY3JlZW4oKTtcbiAgICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQud2Via2l0RXhpdEZ1bGxzY3JlZW4pIHtcbiAgICAgICAgZG9jdW1lbnQud2Via2l0RXhpdEZ1bGxzY3JlZW4oKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXR0aW5nV2luZG93RnVsbHNjcmVlbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiB7XG4gICAgdG9nZ2xlRnVsbFNjcmVlbigpO1xuICB9KTtcblxuXG59KSgpO1xuIl19
