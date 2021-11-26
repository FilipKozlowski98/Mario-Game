kaboom({
  global: true,
  fullscreen: true,
  scale: 1.5,
  debug: true,
  clearColor: [0, 0, 0, 1],
});

loadRoot("./sprites/");
loadSprite("coin", "coin.png");
loadSprite("evilShroom", "evilShroom.png");
loadSprite("brick", "brick.png");
loadSprite("block", "block.png");
loadSprite("mario", "mario.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("surprise", "surprise.png");
loadSprite("unboxed", "unboxed.png");
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
    "                      @            ",
    "                    ====           ",
    "                 @                 ",
    "               ====                ",
    "           @                       ",
    "=*=       ==%=                     ",
    "                                () ",
    "                    <           {} ",
    "==========================     ====",
  ];

  const levelCfg = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid()],
    "@": [sprite("coin")],
    "%": [sprite("surprise"), solid(), "coin-surprise"],
    "*": [sprite("surprise"), solid(), "mushroom-surprise"],
    "^": [sprite("unboxed"), solid()],
    "(": [sprite("pipeTopLeft"), solid(), scale(0.5)],
    ")": [sprite("pipeTopRight"), solid(), scale(0.5)],
    "{": [sprite("pipeBottomLeft"), solid(), scale(0.5)],
    "}": [sprite("pipeBottomRight"), solid(), scale(0.5)],
    "<": [sprite("evilShroom"), solid()],
    "#": [sprite("mushroom"), solid()],
  };

  const gameLevel = addLevel(map, levelCfg);

  const scoreLabel = add([
    text(score),
    pos(30, 6),
    layer("ui"),
    { value: score },
  ]);

  const player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
  ]);
});

start("game");
