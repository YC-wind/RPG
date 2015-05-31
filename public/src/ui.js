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

  class BoxClass {
    constructor (x, y, width, height) {
      var box = new createjs.Shape();
      this.box = box;
      this.defaultColor = "gray";

      if (typeof width == "undefined")
        width = 50;
      if (typeof height == "undefined")
        height = 50;

      this.width = width;
      this.height = height;

      box.graphics
      .beginFill(this.defaultColor)
      .drawRect(0, 0, width, height);
      box.regX = Math.floor(width / 2);
      box.regY = Math.floor(height / 2);
      box.x = x;
      box.y = y;
    }

    drawOn (container) {
      container.addChild(this.box);
      Game.update();
    }

    get x () {
      return this.box.x;
    }

    set x (v) {
      this.box.x = v;
      Game.update();
    }

    get y () {
      return this.box.y;
    }

    set y (v) {
      this.box.y = v;
      Game.update();
    }

    get color () {
      return this.defaultColor;
    }

    set color (v) {
      this.defaultColor = v;
      this.box.graphics
      .clear()
      .beginFill(v)
      .drawRect(0, 0, 50, 50);
      Game.update();
    }

    distance (x, y) {
      var d = 0;
      d += Math.pow(this.box.x - x, 2);
      d += Math.pow(this.box.y - y, 2);
      return Math.sqrt(d);
    }

    on () {
      this.box.on.apply(this.box, arguments);
    }

    off () {
      this.box.off.apply(this.box, arguments);
    }
  }

  class BoxBitmapClass extends BoxClass {
    constructor (bitmap, x, y) {
      super(x, y);

      if (bitmap instanceof createjs.Bitmap) {
        this.bitmap = bitmap.clone();
      } else if (bitmap instanceof Image) {
        this.bitmap = new createjs.Bitmap(bitmap);
        this.bitmap.regX = Math.floor(this.bitmap.image.width/2);
        this.bitmap.regY = Math.floor(this.bitmap.image.height/2);
      } else if (typeof bitmap == "string" && Game.resources.hasOwnProperty(bitmap)) {
        this.bitmap = new createjs.Bitmap(Game.resources[bitmap]);
        this.bitmap.regX = Math.floor(this.bitmap.image.width/2);
        this.bitmap.regY = Math.floor(this.bitmap.image.height/2);
      } else {
        throw new TypeError("BoxBitmapClass Invalid Arguments");
      }

      this.bitmap.x = x;
      this.bitmap.y = y;
    }

    drawOn (container) {
      container.addChild(this.box);
      container.addChild(this.bitmap);
      Game.update();
    }

    get x () {
      return this.box.x;
    }

    set x (v) {
      this.box.x = v;
      this.bitmap.x = v;
      Game.update();
    }

    get y () {
      return this.box.y;
    }

    set y (v) {
      this.box.y = v;
      this.bitmap.y = v;
      Game.update();
    }
  }

  class BoxBitmapButtonClass extends BoxBitmapClass {
    constructor (bitmap, x, y) {
      super(bitmap, x, y);
      this.box.shadow = new createjs.Shadow("black", 1, 1, 1);
    }
  }

  class BoxButtonClass extends BoxClass {
    constructor (x, y) {
      super(x, y);
      this.box.shadow = new createjs.Shadow("black", 1, 1, 1);
    }
  }

  class BoxTextButtonClass extends BoxClass {
    constructor (text, x, y, width, height) {
      super(x, y, width, height);
      this.box.shadow = new createjs.Shadow("black", 1, 1, 1);
      var text = new createjs.Text(text, "25px Arial", "white");
      text.regX = Math.floor(text.getMeasuredWidth() / 2);
      text.regY = Math.floor(text.getMeasuredHeight() / 2);
      text.x = x;
      text.y = y;
      this.text = text;
    }

    drawOn (container) {
      container.addChild(this.box);
      container.addChild(this.text);
      Game.update;
    }

    get x () {
      return this.box.x;
    }

    set x (v) {
      this.text.x = v;
      this.box.x = v;
      Game.update();
    }

    get y () {
      return this.box.y;
    }

    set y (v) {
      this.text.y = v;
      this.box.y = v;
      Game.update();
    }
  }

  // 调整窗口跟随玩家
  Game.oninit(function () {
    Game.stage.on("drawstart", function () {
      if (Game.uiLayer.numChildren) {
        Game.uiLayer.children.forEach(function (element) {
          element.x = parseInt(Game.hero.x);
          element.y = parseInt(Game.hero.y);
        });

        if (Game.ui.redPoint) {
          var heroX = parseInt(Game.hero.sprite.x / Game.area.map.width * Game.area.map.minimap.image.width);
          var heroY = parseInt(Game.hero.sprite.y / Game.area.map.height * Game.area.map.minimap.image.height);
          Game.ui.redPoint.x = heroX + 187;
          Game.ui.redPoint.y = heroY + 12;
        }

      }
    });
  });


  Game.ui = {};

  Game.ui.clickSpell = function (num) {
    if (Game.hero && Game.hero.fire) {
      var cooldown = Game.hero.fire(num);
      if (cooldown > 0) {

        var spellIcon = Game.ui.spellIcon[num];
        spellIcon.color = "green";

        cooldown -= 100;

        createjs.Tween.get(spellIcon.box).to({alpha: 0}, cooldown).call(function () {
          spellIcon.color = "gray";
          spellIcon.box.alpha = 1;
          Game.update();
        }).on("change", function () {
          Game.update();
        });

      }
    }
  };

  var indexToEquipment = {
    "0": "head",
    "1": "neck",
    "2": "body",
    "3": "feet",
    "4": "righthand",
    "5": "lefthand",
    "6": "leftring",
    "7": "rightring"
  }

  function ItemChanged () {
    var items = [];
    items.length = Game.hero.data.items.length;
    for (var i = 0; i < items.length; i++) {
      if (Game.hero.data.items[i])
        items[i] = {
          id: Game.hero.data.items[i].id,
          count: Game.hero.data.items[i].count
        };
    }

    var equipment = {};

    for (var key in Game.hero.data.equipment) {
      if (Game.hero.data.equipment[key])
        equipment[key] = Game.hero.data.equipment[key].id;
      else
        equipment[key] = null;
    }

    Game.io.updateHero({
      items: items,
      equipment: equipment
    });
  }

  // 物品选择，弹出物品信息
  function ItemSelect (type, index) {
    var itemObj = null;

    if (type == "equipment") {
      itemObj = Game.hero.data.equipment[indexToEquipment[index]];
      if (!itemObj) return;
    }

    if (type == "item") {
      itemObj = Game.hero.data.items[index].item;
      if (!itemObj) return;
    }

    // 分割，每行最多22个字符宽度
    var text = Game.dialogue.textSplit(itemObj.data.description, 150);

    if (Game.ui.itemText) {
      Game.ui.itemWindow.removeChild(Game.ui.itemText);
      Game.ui.itemText = null;
    }

    //.drawRect(0, 0, 170, 110);
    //itemText.x = 755;
    //itemText.y = 25;

    var itemText = new createjs.Text(text);
    itemText.x = 760;
    itemText.y = 30;
    Game.ui.itemWindow.addChild(itemText);
    Game.ui.itemText = itemText;

    Game.update();
  }

  // 物品改变，装备，卸下装备，物品调整顺序等
  function ItemExchange (lastType, lastIndex, type, index) {

    if (lastType == "equipment" && type == "equipment") {

      Game.ui.armorBox[lastIndex].color = "gray";

      if (lastIndex != index) {
        lastIndex = -1;
        lastType = null;

        return ItemSelect(type, index);
      }
    }

    if (lastType == "item" && type == "item") {
      if (lastIndex == index) {
        Game.ui.itemBox[index].color = "gray";
      } else {
        var t = Game.hero.data.items[lastIndex];
        Game.hero.data.items[lastIndex] = Game.hero.data.items[index];
        Game.hero.data.items[index] = t;

        ItemChanged();

        Game.uiLayer.removeChild(Game.ui.itemWindow);
        Game.ui.itemWindow = null;
        Game.ui.openItem();
      }
    }

    if (lastType == "equipment" && type == "item") {
      if (Game.hero.data.items[index]) {
        Game.ui.armorBox[lastIndex].color = "gray";
      } else {
        if (!Game.hero.data.items[index])
          Game.hero.data.items[index] = {};
        Game.hero.data.items[index].id = Game.hero.data.equipment[indexToEquipment[lastIndex]].id;
        Game.hero.data.items[index].item = Game.hero.data.equipment[indexToEquipment[lastIndex]];
        Game.hero.data.items[index].count = 1;
        Game.hero.data.equipment[indexToEquipment[lastIndex]] = null;

        ItemChanged();

        Game.uiLayer.removeChild(Game.ui.itemWindow);
        Game.ui.itemWindow = null;
        Game.ui.openItem();
      }
    }

    if (lastType == "item" && type == "equipment") {
      var CheckFit = function (itemIndex, equipmentIndex) {
        var itemType = Game.hero.data.items[itemIndex].item.data.equip;
        var equipmentType = indexToEquipment[equipmentIndex];
        if (itemType == equipmentType)
          return true;
        if (itemType == "onehand" && (equipmentType == "righthand" || equipmentType == "lefthand"))
          return true;
        if (itemType == "twohand" && equipmentType == "righthand")
          return true;
        return false;
      }

      if (CheckFit(lastIndex, index)) {
        var t = Game.hero.data.equipment[indexToEquipment[index]];
        Game.hero.data.equipment[indexToEquipment[index]] = Game.hero.data.items[lastIndex].item;
        if (t) {
          Game.hero.data.items[lastIndex] = {
            id: t.id,
            item: t,
            count: 1
          };
        } else {
          Game.hero.data.items[lastIndex] = null;
        }

        ItemChanged();

        Game.uiLayer.removeChild(Game.ui.itemWindow);
        Game.ui.itemWindow = null;
        Game.ui.openItem();
      } else {
        Game.ui.itemBox[lastIndex].color = "gray";
      }
    }

  }

  // 打开物品栏（玩家口袋）
  Game.ui.openItem = function () {
    var heroObj = Game.hero;
    if (!heroObj) return;

    if (Game.ui.itemWindow) { // 如果开着，就要关
      Game.uiLayer.removeChild(Game.ui.itemWindow);
      Game.ui.itemWindow = null;
      Game.ui.initBottomBar();
      return;
    }

    var background = new createjs.Shape();
    background.graphics
    .beginStroke("black")
    .beginFill("grey")
    .drawRoundRect(0, 0, 475, 450, 5);
    background.x = 480;
    background.y = 5;
     background.alpha = 0.6;

    var armorBox = [];
    var armorBoxWidth = 4;
    var armorBoxHeight = 2;
    armorBox.length = armorBoxWidth * armorBoxHeight;

    var armorImageList = [
      "/image/head.png",
      "/image/neck.png",
      "/image/body.png",
      "/image/feet.png",
      "/image/righthand.png",
      "/image/lefthand.png",
      "/image/ring.png",
      "/image/ring.png"
    ];

    for (var i = 0; i < armorBoxHeight; i++) {
      for (var j = 0; j < armorBoxWidth; j++) {
        (function (i, j) {
          var index = i * armorBoxWidth + j;
          armorBox[index] = new BoxBitmapClass(armorImageList[index], 540 + j * 60, 50 + i * 60);
        })(i, j);
      }
    }

    Game.ui.armorBox = armorBox;

    var itemBox = [];
    var itemBoxWidth = 6;
    var itemBoxHeight = 4;
    itemBox.length = itemBoxWidth * itemBoxHeight;

    for (var i = 0; i < itemBoxHeight; i++) {
      for (var j = 0; j < itemBoxWidth; j++) {
        (function (i, j) {
          var index = i * itemBoxWidth + j;
          itemBox[index] = new BoxClass(540 + j * 60, 170 + i * 60);
        })(i, j);
      }
    }

    Game.ui.itemBox = itemBox;

    var itemUseButton = new BoxBitmapButtonClass("/image/use.png", 900, 170);
    var itemDropButton = new BoxBitmapButtonClass("/image/drop.png", 900, 230);
    var itemPrevButton = new BoxBitmapButtonClass("/image/up.png", 900, 290);
    var itemNextButton = new BoxBitmapButtonClass("/image/down.png", 900, 350);

    var itemGoldBox = new createjs.Text("10000000G");
    itemGoldBox.color = "gold";
    itemGoldBox.x = 510;
    itemGoldBox.y = 410;

    var itemText = new createjs.Shape();
    itemText.graphics
    .beginFill("gray")
    .drawRect(0, 0, 170, 110);
    itemText.x = 755;
    itemText.y = 25;

    // 装备栏的8个空

    var headIcon = new BoxBitmapClass("/image/head.png", armorBox[0].x, armorBox[0].y);
    var neckIcon = new BoxBitmapClass("/image/neck.png", armorBox[1].x, armorBox[1].y);
    var bodyIcon = new BoxBitmapClass("/image/body.png", armorBox[2].x, armorBox[2].y);
    var feetIcon = new BoxBitmapClass("/image/feet.png", armorBox[3].x, armorBox[3].y);
    var righthandIcon = new BoxBitmapClass("/image/righthand.png", armorBox[4].x, armorBox[4].y);
    var lefthandIcon = new BoxBitmapClass("/image/lefthand.png", armorBox[5].x, armorBox[5].y);
    var leftringIcon = new BoxBitmapClass("/image/ring.png", armorBox[6].x, armorBox[6].y);
    var rightringIcon = new BoxBitmapClass("/image/ring.png", armorBox[7].x, armorBox[7].y);

    var itemWindow = new createjs.Container();
    itemWindow.regX = 480;
    itemWindow.regY = 270;

    itemWindow.addChild(background);
    itemWindow.addChild(itemGoldBox);
    itemWindow.addChild(itemText);

    itemUseButton.drawOn(itemWindow);
    itemDropButton.drawOn(itemWindow);
    itemPrevButton.drawOn(itemWindow);
    itemNextButton.drawOn(itemWindow);

    armorBox.forEach(function (element) {
      element.drawOn(itemWindow);
      itemWindow.addChild(element.box.clone());
    });

    itemBox.forEach(function (element) {
      element.drawOn(itemWindow);
      itemWindow.addChild(element.box.clone());
    });

    headIcon.drawOn(itemWindow);
    neckIcon.drawOn(itemWindow);
    bodyIcon.drawOn(itemWindow);
    feetIcon.drawOn(itemWindow);
    righthandIcon.drawOn(itemWindow);
    lefthandIcon.drawOn(itemWindow);
    leftringIcon.drawOn(itemWindow);
    rightringIcon.drawOn(itemWindow);

    function CopyIcon (item, box, type, index) {
      var t = new BoxBitmapClass(item.bitmap, box.x, box.y);
      t.drawOn(itemWindow);

      var X = t.x;
      var Y = t.y;

      t.on("click", function () {
        ItemSelect(type, index);
      });

      t.on("mousedown", function (event) {
        t.offset = {
          x: t.x - event.stageX / Game.stage.scaleX,
          y: t.y - event.stageY / Game.stage.scaleY
        };
      });

      t.on("pressmove", function (event) {
        t.x = event.stageX / Game.stage.scaleX + t.offset.x;
        t.y = event.stageY / Game.stage.scaleY + t.offset.y;
      });

      t.on("pressup", function (event) {
        var x = event.stageX / Game.stage.scaleX + t.offset.x;
        var y = event.stageY / Game.stage.scaleY + t.offset.y;

        var lastType = null;
        var lastIndex = -1;

        var minDistance = 9999;
        var minType = null;
        var minIndex = -1;

        itemBox.forEach(function (element, index) {
          if (element == box) {
            lastType = "item";
            lastIndex = index;
            return;
          } else if (t.distance(element.x, element.y) < minDistance) {
            minDistance = t.distance(element.x, element.y);
            minType = "item";
            minIndex = index;
          }
        });

        armorBox.forEach(function (element, index) {
          if (element == box) {
            lastType = "equipment";
            lastIndex = index;
            return;
          } else if (t.distance(element.x, element.y) < minDistance) {
            minDistance = t.distance(element.x, element.y);
            minType = "equipment";
            minIndex = index;
          }
        });

        t.x = X;
        t.y = Y;

        if (lastType && minType && minDistance < 30) {
          ItemExchange(lastType, lastIndex, minType, minIndex);
        }

      });

    }

    if (heroObj.data.equipment.head)
      CopyIcon(heroObj.data.equipment.head, armorBox[0], "equipment", 0);
    if (heroObj.data.equipment.neck)
      CopyIcon(heroObj.data.equipment.neck, armorBox[1], "equipment", 1);
    if (heroObj.data.equipment.body)
      CopyIcon(heroObj.data.equipment.body, armorBox[2], "equipment", 2);
    if (heroObj.data.equipment.feet)
      CopyIcon(heroObj.data.equipment.feet, armorBox[3], "equipment", 3);
    if (heroObj.data.equipment.righthand)
      CopyIcon(heroObj.data.equipment.righthand, armorBox[4], "equipment", 4);
    if (heroObj.data.equipment.lefthand)
      CopyIcon(heroObj.data.equipment.lefthand, armorBox[5], "equipment", 5);
    if (heroObj.data.equipment.leftring)
      CopyIcon(heroObj.data.equipment.leftring, armorBox[6], "equipment", 6);
    if (heroObj.data.equipment.rightring)
      CopyIcon(heroObj.data.equipment.rightring, armorBox[7], "equipment", 7);

    heroObj.data.items.forEach(function (element, index) {
      if (element)
        CopyIcon(element.item, itemBox[index], "item", index);
    });

    Game.uiLayer.addChild(itemWindow);
    Game.ui.itemWindow = itemWindow;

    Game.ui.initBottomBar();
  };


  // 打开技能栏
  Game.ui.openSkill = function () {
    var heroObj = Game.hero;
    if (!heroObj) return;

    if (Game.ui.skillWindow) { // 如果开着，就要关
      Game.uiLayer.removeChild(Game.ui.skillWindow);
      Game.ui.skillWindow = null;
      Game.ui.initBottomBar();
      return;
    }

    var background = new createjs.Shape();
    background.graphics
    .beginStroke("black")
    .beginFill("grey")
    .drawRoundRect(0, 0, 470, 450, 5);
    background.x = 5;
    background.y = 5;
    background.alpha = 0.6;

    var skillWindow = new createjs.Container();
    skillWindow.regX = 480;
    skillWindow.regY = 270;

    skillWindow.addChild(background);

    Game.uiLayer.addChild(skillWindow);
    Game.ui.skillWindow = skillWindow;

    // 再次open，即关闭
    Game.ui.openInformation();
  };

  // 在招式窗口打开时，点击一个技能，则弹出技能介绍
  function SpellSelect (type, index) {
    var spellId = "";

    if (type == "book") {
      spellId = Object.keys(Game.hero.data.spells)[index];
      if (!spellId) return;
    }

    if (type == "bar") {
      spellId = Game.hero.data.spellbar[index];
      if (!spellId) return;
    }

    // 分割，每行最多40个字符宽度
    var text = Game.dialogue.textSplit(Game.hero.data.spells[spellId].data.description, 330);

    if (Game.ui.spellText) {
      Game.ui.spellWindow.removeChild(Game.ui.spellText);
      Game.ui.spellText = null;
    }

    var spellText = new createjs.Text(text);
    spellText.x = 40;
    spellText.y = 330;
    Game.ui.spellWindow.addChild(spellText);
    Game.ui.spellText = spellText;

    //.drawRect(0, 0, 350, 110);
    //spellText.x = 35;
    //spellText.y = 325;

    Game.update();
  }

  // 在招式栏和招式书之间交换技能快捷方式
  function SpellExchange (lastType, lastIndex, type, index) {
    if (lastType == "book" && type == "bar") {
      var spellBookSelect = Object.keys(Game.hero.data.spells)[lastIndex];
      var spellBarSelect = Game.hero.data.spellbar[index];
      if (spellBookSelect != spellBarSelect) {
        Game.hero.data.spellbar[index] = spellBookSelect;
        Game.io.updateHero({spellbar: Game.hero.data.spellbar});
        Game.ui.initBottomBar();
      }
    }

    if (lastType == "bar" && type == "bar") {

      if (lastIndex == index) {
        Game.hero.data.spellbar[index] = undefined;
        Game.ui.initBottomBar();
      } else {
        var spellBarSelect1 = Game.hero.data.spellbar[lastIndex];
        var spellBarSelect2 = Game.hero.data.spellbar[index];
        var t = spellBarSelect1;
        Game.hero.data.spellbar[lastIndex] = spellBarSelect2;
        Game.hero.data.spellbar[index] = t;
        Game.io.updateHero({spellbar: Game.hero.data.spellbar});
        Game.ui.initBottomBar();
      }

    }
  }

  Game.ui.openSpell = function () {
    var heroObj = Game.hero;
    if (!heroObj) return;

    var background = new createjs.Shape();
    background.graphics
    .beginStroke("black")
    .beginFill("grey")
    .drawRoundRect(0, 0, 470, 450, 5);
    background.x = 5;
    background.y = 5;
    background.alpha = 0.6;


    var spellBook = [];
    spellBook.length = heroObj.data.spellcount;

    var spellBookWidth = 7;
    var spellBookHeight = 7;
    var spellCount = 0;

    for (var i = 0; i < spellBookHeight; i++) {
      for (var j = 0; j < spellBookWidth; j++) {
        (function (i, j) {
          if (spellCount >= spellBook.length)
            return;
          var index = i * spellBookWidth + j;
          spellBook[index] = new BoxClass(60 + j * 60, 50 + i * 60);
          spellCount++;
        })(i, j);
      }
    }

    Game.ui.spellBook = spellBook;

    var releaseButton = new BoxButtonClass(420, 350);
    var releaseIcon = new BoxBitmapClass("/image/release.png", releaseButton.x, releaseButton.y);

    var spellText = new createjs.Shape();
    spellText.graphics
    .beginFill("gray")
    .drawRect(0, 0, 350, 110);
    spellText.x = 35;
    spellText.y = 325;

    var spellWindow = new createjs.Container();
    spellWindow.regX = 480;
    spellWindow.regY = 270;

    spellWindow.addChild(background);

    releaseButton.drawOn(spellWindow);
    releaseIcon.drawOn(spellWindow);
    spellWindow.addChild(spellText);

    spellBook.forEach(function (element) {
      spellWindow.addChild(element.box);
      spellWindow.addChild(element.box.clone());
    });

    (function AddHeroSpellIcon () {
      var index = 0;
      for (var key in Game.hero.data.spells) {
        (function (element, index) {

          var box = Game.ui.spellBook[index];
          var t = new BoxBitmapClass(element.icon, box.x, box.y);
          t.drawOn(spellWindow);

          var X = t.x;
          var Y = t.y;

          t.on("click", function () {
            SpellSelect("book", index);
          });

          t.on("mousedown", function (event) {
            t.offset = {
              x: t.x - event.stageX / Game.stage.scaleX,
              y: t.y - event.stageY / Game.stage.scaleY
            };
          });

          t.on("pressmove", function (event) {
            t.x = event.stageX / Game.stage.scaleX + t.offset.x;
            t.y = event.stageY / Game.stage.scaleY + t.offset.y;
          });

          t.on("pressup", function (event) {
            var x = event.stageX / Game.stage.scaleX + t.offset.x;
            var y = event.stageY / Game.stage.scaleY + t.offset.y;

            var lastType = null;
            var lastIndex = -1;

            var minDistance = 9999;
            var minType = null;
            var minIndex = -1;

            Game.ui.spellBar.forEach(function (element, index) {
              if (element == box) {
                lastType = "bar";
                lastIndex = index;
                return;
              } else if (t.distance(element.x, element.y) < minDistance) {
                minDistance = t.distance(element.x, element.y);
                minType = "bar";
                minIndex = index;
              }
            });

            Game.ui.spellBook.forEach(function (element, index) {
              if (element == box) {
                lastType = "book";
                lastIndex = index;
                return;
              } else if (t.distance(element.x, element.y) < minDistance) {
                minDistance = t.distance(element.x, element.y);
                minType = "book";
                minIndex = index;
              }
            });

            if (lastType && minType && minDistance < 30) {
              SpellExchange(lastType, lastIndex, minType, minIndex);
            }

            t.x = X;
            t.y = Y;
          });

        })(Game.hero.data.spells[key], index);
        index++;
      }
    })();

    Game.uiLayer.addChild(spellWindow);
    Game.ui.spellWindow = spellWindow;

    // 再次open信息窗口，即关闭信息窗口
    Game.ui.openInformation();
  };

  Game.ui.openMap = function () {
    var heroObj = Game.hero;
    if (!heroObj) return;

    if (Game.ui.mapWindow) { // 如果开着，就要关
      Game.uiLayer.removeChild(Game.ui.mapWindow);
      Game.ui.mapWindow = null;
      Game.ui.initBottomBar();
      return;
    }

     var background = new createjs.Shape();
     background.graphics
     .beginStroke("black")
     .beginFill("grey")
     .drawRoundRect(0, 0, 950, 450, 5);
     background.x = 5;
     background.y = 5;
     background.alpha = 0.6;

     var mapWindow = new createjs.Container();
     mapWindow.regX = 480;
     mapWindow.regY = 270;

     mapWindow.addChild(background);

     // 转换玩家位置为小地图位置，修正小地图位置
     var heroX = parseInt(Game.hero.sprite.x / Game.area.map.width * Game.area.map.minimap.image.width);
     var heroY = parseInt(Game.hero.sprite.y / Game.area.map.height * Game.area.map.minimap.image.height);
     Game.area.map.minimap.x = 480;
     Game.area.map.minimap.y = 230;

     var redPoint = new createjs.Shape();
     redPoint.graphics
     .beginFill("red")
     .drawRoundRect(0, 0, 4, 4, 3);
     redPoint.regX = 2;
     redPoint.regY = 2;
     redPoint.x = heroX + 185;
     redPoint.y = heroY + 30;

     mapWindow.addChild(Game.area.map.minimap);
     mapWindow.addChild(redPoint);

     Game.ui.redPoint = redPoint;

     Game.uiLayer.addChild(mapWindow);
     Game.ui.mapWindow = mapWindow;

     Game.ui.initBottomBar();
  };

  Game.ui.openSetting = function () {
    var heroObj = Game.hero;
    if (!heroObj) return;

    if (Game.ui.settingWindow) { // 如果开着，就要关
      Game.uiLayer.removeChild(Game.ui.settingWindow);
      Game.ui.settingWindow = null;
      Game.ui.initBottomBar();
      return;
    }

    var background = new createjs.Shape();
    background.graphics
    .beginStroke("black")
    .beginFill("grey")
    .drawRoundRect(0, 0, 470, 450, 5);
    background.x = 5;
    background.y = 5;
    background.alpha = 0.6;

    var enterTalk = new BoxTextButtonClass("聊天", 240, 60, 400, 50);
    enterTalk.on("click", Game.dialogue.talk);

    var settingWindow = new createjs.Container();
    settingWindow.regX = 235;
    settingWindow.regY = 270;

    settingWindow.addChild(background);
    enterTalk.drawOn(settingWindow);

    Game.uiLayer.addChild(settingWindow);
    Game.ui.settingWindow = settingWindow;

    Game.ui.initBottomBar();
  };

  Game.ui.openInformation = function () {
    var heroObj = Game.hero;
    if (!heroObj) return;

    if (Game.ui.informationWindow) { // 如果开着，就要关
      Game.uiLayer.removeChild(Game.ui.informationWindow);
      Game.ui.informationWindow = null;
      Game.ui.initBottomBar();
      return;
    }

    if (Game.ui.skillWindow) { // 如果开着，就要关
      Game.uiLayer.removeChild(Game.ui.skillWindow);
      Game.ui.skillWindow = null;
      Game.ui.initBottomBar();
      return;
    }

    if (Game.ui.spellWindow) { // 如果开着，就要关
      Game.uiLayer.removeChild(Game.ui.spellWindow);
      Game.ui.spellWindow = null;
      Game.ui.initBottomBar();
      return;
    }

    var background = new createjs.Shape();
    background.graphics
    .beginStroke("black")
    .beginFill("grey")
    .drawRoundRect(0, 0, 470, 450, 5);
    background.x = 5;
    background.y = 5;
    background.alpha = 0.6;

    var hitpoint = new createjs.Text("生命: " + heroObj.data.hitpoint);
    hitpoint.x = 40;
    hitpoint.y = 40;
    var manapoint = new createjs.Text("精神力: " + heroObj.data.manapoint);
    manapoint.x = 40;
    manapoint.y = 60;

    var strength = new createjs.Text("力量: " + heroObj.data.strength);
    strength.x = 40;
    strength.y = 80;
    var dexterity = new createjs.Text("敏捷: " + heroObj.data.dexterity);
    dexterity.x = 40;
    dexterity.y = 100;
    var intelligence = new createjs.Text("体质: " + heroObj.data.intelligence);
    intelligence.x = 40;
    intelligence.y = 120;
    var constitution = new createjs.Text("智力: " + heroObj.data.constitution);
    constitution.x = 40;
    constitution.y = 140;

    var attack = new createjs.Text("攻击力: " + heroObj.data.attack);
    attack.x = 40;
    attack.y = 160;
    var defense = new createjs.Text("防御力: " + heroObj.data.defense);
    defense.x = 40;
    defense.y = 180;
    var magicAttack = new createjs.Text("魔法攻击: " + heroObj.data.magicAttack);
    magicAttack.x = 40;
    magicAttack.y = 200;
    var magicDefense = new createjs.Text("魔法防御: " + heroObj.data.magicDefense);
    magicDefense.x = 40;
    magicDefense.y = 220;

    var skillButton = new BoxBitmapButtonClass("/image/skill.png", 60, 400);
    skillButton.on("click", Game.ui.openSkill);

    var spellButton = new BoxBitmapButtonClass("/image/spell.png", 120, 400);
    spellButton.on("click", Game.ui.openSpell);

    var informationWindow = new createjs.Container();
    informationWindow.regX = 480;
    informationWindow.regY = 270;

    informationWindow.addChild(background);

    informationWindow.addChild(hitpoint);
    informationWindow.addChild(manapoint);
    informationWindow.addChild(strength);
    informationWindow.addChild(dexterity);
    informationWindow.addChild(intelligence);
    informationWindow.addChild(constitution);
    informationWindow.addChild(attack);
    informationWindow.addChild(defense);
    informationWindow.addChild(magicAttack);
    informationWindow.addChild(magicDefense);

    skillButton.drawOn(informationWindow);
    spellButton.drawOn(informationWindow);

    Game.uiLayer.addChild(informationWindow);

    Game.ui.informationWindow = informationWindow;

    Game.ui.initBottomBar();
  }

  Game.ui.initBottomBar = function () {

    if (Game.ui.toolbar) {
      Game.uiLayer.removeChild(Game.ui.toolbar);
      Game.ui.toolbar = null;
    }

    var background = new createjs.Shape();
    background.graphics
    .beginStroke("black")
    .beginFill("grey")
    .drawRoundRect(0, 0, 950, 70, 5);
    background.x = 5;
    background.y = 465;
    background.alpha = 0.6;

    var barMax = 110;

    var hpbarBox = new createjs.Shape();
    hpbarBox.graphics
    .beginStroke("black")
    .drawRoundRect(0, 0, barMax, 20, 3);
    hpbarBox.x = 15;
    hpbarBox.y = 475;

    var hpbar = new createjs.Shape();
    hpbar.graphics
    .beginFill("green")
    .drawRoundRect(0, 0, parseInt(Game.hero.currentHitpoint / Game.hero.data.hitpoint * barMax), 20, 3);
    hpbar.x = 15;
    hpbar.y = 475;

    var mpbarBox = new createjs.Shape();
    mpbarBox.graphics
    .beginStroke("black")
    .drawRoundRect(0, 0, barMax, 20, 3);
    mpbarBox.x = 15;
    mpbarBox.y = 505;

    var mpbar = new createjs.Shape();
    mpbar.graphics
    .beginFill("blue")
    .drawRoundRect(0, 0, parseInt(Game.hero.currentManapoint / Game.hero.data.manapoint * barMax), 20, 3);
    mpbar.x = 15;
    mpbar.y = 505;

    var spellBar = [];
    spellBar.length = 9;

    for (var i = 0; i < spellBar.length; i++) {
      (function (element, index, array) {
        spellBar[index] = new BoxClass(180 + index * 60, 500);
      })(spellBar[i], i, spellBar);
    }

    Game.ui.spellBar = spellBar;

    // 四个按钮：

    var informationButton = new BoxBitmapButtonClass("/image/information.png", 740, 500);
    informationButton.on("click", Game.ui.openInformation);
    Game.ui.informationButton = informationButton;

    var itemButton = new BoxBitmapButtonClass("/image/item.png", 800, 500);
    itemButton.on("click", Game.ui.openItem);
    Game.ui.itemButton = itemButton;

    var mapButton = new BoxBitmapButtonClass("/image/map.png", 860, 500);
    mapButton.on("click", Game.ui.openMap);
    Game.ui.mapButton = mapButton;

    var settingButton = new BoxBitmapButtonClass("/image/setting.png", 920, 500);
    settingButton.on("click", Game.ui.openSetting);
    Game.ui.settingButton = settingButton;

    var toolbar = new createjs.Container();
    toolbar.regX = 480;
    toolbar.regY = 270;

    toolbar.addChild(background);
    toolbar.addChild(hpbarBox);
    toolbar.addChild(mpbarBox);
    toolbar.addChild(hpbar);
    toolbar.addChild(mpbar);

    informationButton.drawOn(toolbar);
    itemButton.drawOn(toolbar);
    mapButton.drawOn(toolbar);
    settingButton.drawOn(toolbar);

    for (var i = 0; i < spellBar.length; i++) {
      toolbar.addChild(spellBar[i].box);
    }

    // 让底部栏总在最下面
    Game.uiLayer.addChildAt(toolbar, 0);
    Game.ui.toolbar = toolbar;

    Game.ui.spellIcon = [];

    (function AddHeroSpellBarIcon () {
      Game.hero.data.spellbar.forEach(function (element, index) {
        if (!Game.hero.data.spells[element])
          return;

        var box = Game.ui.spellBar[index];
        var t = new BoxBitmapClass(Game.hero.data.spells[element].icon, box.x, box.y);
        t.drawOn(Game.ui.toolbar);

        Game.ui.spellIcon[index] = t;

        var X = t.x;
        var Y = t.y;

        t.on("click", function (event) {
          event.stopImmediatePropagation();
          if (Game.ui.spellWindow) {
            SpellSelect("bar", index);
          } else {
            Game.ui.clickSpell(index);
          }
        });

        t.on("mousedown", function (event) {
          if (!Game.ui.spellBook) return;

          t.offset = {
            x: t.x - event.stageX / Game.stage.scaleX,
            y: t.y - event.stageY / Game.stage.scaleY
          };
        });

        t.on("pressmove", function (event) {
          if (!Game.ui.spellBook) return;

          t.x = event.stageX / Game.stage.scaleX + t.offset.x;
          t.y = event.stageY / Game.stage.scaleY + t.offset.y;
        });

        t.on("pressup", function (event) {
          if (!Game.ui.spellBook) return;

          var x = event.stageX / Game.stage.scaleX + t.offset.x;
          var y = event.stageY / Game.stage.scaleY + t.offset.y;

          var lastType = null;
          var lastIndex = -1;

          var minDistance = 9999;
          var minType = null;
          var minIndex = -1;

          Game.ui.spellBar.forEach(function (element, index) {
            if (element == box) {
              lastType = "bar";
              lastIndex = index;
              return;
            } else if (t.distance(element.x, element.y) < minDistance) {
              minDistance = t.distance(element.x, element.y);
              minType = "bar";
              minIndex = index;
            }
          });

          Game.ui.spellBook.forEach(function (element, index) {
            if (element == box) {
              lastType = "book";
              lastIndex = index;
              return;
            } else if (t.distance(element.x, element.y) < minDistance) {
              minDistance = t.distance(element.x, element.y);
              minType = "book";
              minIndex = index;
            }
          });

          if (lastType && minType) {
            if (minDistance < 30) {
              SpellExchange(lastType, lastIndex, minType, minIndex);
            } else if (t.distance(X, Y) >= 30) {
              Game.hero.data.spellbar[lastIndex] = null;
              Game.io.updateHero({spellbar: Game.hero.data.spellbar});
              Game.ui.initBottomBar();
            }
          }

          t.x = X;
          t.y = Y;
        });

      });
    })();

    if (Game.ui.settingWindow) { // 如果开着，就要关
      Game.ui.settingButton.color = "green";
    }

    if (Game.ui.informationWindow || Game.ui.skillWindow || Game.ui.spellWindow) { // 如果开着，就要关
      Game.ui.informationButton.color = "green";
    }

    if (Game.ui.mapWindow) { // 如果开着，就要关
      Game.ui.mapButton.color = "green";
    }

    if (Game.ui.itemWindow) { // 如果开着，就要关
      Game.ui.itemButton.color = "green";
    }

    Game.update();

  } // Game.ui.InitBottomBar


}());