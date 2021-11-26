kaboom({
  global: true,
  fullscreen: true,
  scale: 1,
  debug: true,
  clearColor: [0, 0, 0, 1],
});

loadRoot("./sprites/");
loadSprite("coin", "coin.png");
loadSprite("evilShroomLeftLeg", "evilShroomLeftLeg.png");
loadSprite("evilShroomRightLeg", "evilShroomRightLeg.png");
loadSprite("brick", "brick.png");
loadSprite("block", "block.png");
loadSprite("mario", "mario.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("surprise", "surprise.png");
loadSprite("unboxed", "block.png");
loadSprite("pipeTopLeft", "pipeTopLeft.png");
loadSprite("pipeTopRight", "pipeTopRight.png");
loadSprite("pipeBottomLeft", "pipeBottomLeft.png");
loadSprite("pipeBottomRight", "pipeBottomRight.png");

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");

  const map = [
    "                                   ",
    "                                   ",
    "                                   ",
    "                                   ",
    "                                   ",
    "                                   ",
    "                                   ",
    "                                   ",
    "=============================  ====",
  ];

  const levelCfg = {
    width: 20,
    height: 20,
    "=": [sprite("block", solid())],
  };

  const gameLevel = addLevel(map, levelCfg);
});

start("game");
