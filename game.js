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

const MOVE_SPEED = 170;
const JUMP_FORCE = 370;
const BIG_JUMP_FORCE = 420;
let ENEMY_SPEED = 30;
let CURRENT_JUMP_FORCE = JUMP_FORCE;
let isJumping = false;
const FALL_DEATH = 600;
const ENEMY_LOOP = 500;
let CURRENT_ENEMY_LOOP = ENEMY_LOOP;
let ENEMY_DIRECTION = "left";

scene("game", ({ level, score }) => {
  layers(["bg", "obj", "ui"], "obj");

  const maps = [
    [
      "                                                                                                                  ",
      "                                                                                                                  ",
      "                                                                                                                  ",
      "                                                                                                                  ",
      "                                                                                                                  ",
      "                                                                                                                  ",
      "                                                                                                                  ",
      "                                      @@                                                                          ",
      "                                     ----                                                                =        ",
      "            -%-%%%-   -*-                                                                              = =        ",
      "                                                                                                     = = =    ()  ",
      "                      <               <                     @      @                <              = = = =    {}  ",
      "======================================================      =      =      ================================    ====",
    ],
    [
      "                                                                                                                  ",
      "                                                                                                                  ",
      "       @          @                                                      @                 @@@@@                  ",
      "       -      =   =                                  -------------*---------        -------------                 ",
      "              =   =                                  -                                                            ",
      "              =   =                                  -              <                                             ",
      "      %       =   =                                  -   -------------------                                      ",
      "              =   =                                  -                     -                                      ",
      "              =   =                                  -        <            -                                 ()   ",
      "       -      =   =                                  -------------------   -                                 {}   ",
      "              =   =                                  -                     -                                 {}   ",
      "              =   =       @     <                              <           -            <          <        ={}   ",
      "===============   ==========================   ===================================================================",
      "                                                                                                                  ",
      "          @             <     <      <                                                                            ",
      "          ==  ==============================                                                                      ",
    ],
    [
      "                                                                                                                  ",
      "                                                                                                                  ",
      "                                                                                                                  ",
      "                                                                                                                  ",
      "                                                    @                                                             ",
      "                                                    =                                                             ",
      "                                              @                                                                   ",
      "                                              =                                                        %      ()  ",
      "                                         @                                                     @      @       {}  ",
      "                                         =                              @                  @   =      =      ={}= ",
      "                               @     @                                  =                  =                 ={}= ",
      "           @      @      @     =     =                      @      @           @      @                      ={}= ",
      "=====      =      =      =                                  =      =           =      =                      ==== ",
    ],
  ];

  const levelCfg = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid()],
    "-": [sprite("brick"), solid()],
    "@": [sprite("coin"), "coin"],
    "%": [sprite("surprise"), solid(), "coinSurprise"],
    "*": [sprite("surprise"), solid(), "mushroomSurprise"],
    "^": [sprite("unboxed"), solid()],
    "(": [sprite("pipeTopLeft"), solid(), scale(0.5), "pipe"],
    ")": [sprite("pipeTopRight"), solid(), scale(0.5), "pipe"],
    "{": [sprite("pipeBottomLeft"), solid(), scale(0.5)],
    "}": [sprite("pipeBottomRight"), solid(), scale(0.5)],
    "<": [sprite("evilShroom"), solid(), "dangerous"],
    "#": [sprite("mushroom"), solid(), "mushroom", body()],
  };

  const gameLevel = addLevel(maps[level], levelCfg);

  const scoreLabel = add([
    text("points " + score),
    pos(80, 0),
    layer("ui"),
    { value: score },
  ]);

  const levelLabel = add([
    text("level " + parseInt(level + 1)),
    pos(0, 0),
    layer("ui"),
  ]);

  function big() {
    let timer = 0;
    let isBig = false;
    return {
      update() {
        if (isBig) {
          timer -= dt();
        }
        if (timer <= 0) {
          this.smallify();
        }
      },
      isBig() {
        return isBig;
      },
      smallify() {
        this.scale = vec2(1);
        CURRENT_JUMP_FORCE = JUMP_FORCE;
        timer = 0;
        isBig = false;
      },
      biggify(time) {
        this.scale = vec2(2);
        CURRENT_JUMP_FORCE = BIG_JUMP_FORCE;
        timer = time;
        isBig = true;
      },
    };
  }

  const player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(),
    big(),
    origin("bot"),
  ]);

  action("mushroom", (m) => {
    m.move(30, 0);
  });

  action("dangerous", (d) => {
    if (CURRENT_ENEMY_LOOP <= 0) {
      CURRENT_ENEMY_LOOP = ENEMY_LOOP;
      if (ENEMY_DIRECTION === "left") {
        ENEMY_DIRECTION = "right";
      } else {
        ENEMY_DIRECTION = "left";
      }
    }
    if (level === 0) {
      ENEMY_SPEED = 30;
    }
    if (level === 1) {
      ENEMY_SPEED = 90;
    }
    if (ENEMY_DIRECTION === "left") {
      d.move(-ENEMY_SPEED, 0);
      CURRENT_ENEMY_LOOP -= 1;
    }
    if (ENEMY_DIRECTION === "right") {
      d.move(ENEMY_SPEED, 0);
      CURRENT_ENEMY_LOOP -= 1;
    }
  });

  player.on("headbump", (obj) => {
    if (obj.is("coinSurprise")) {
      gameLevel.spawn("@", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("^", obj.gridPos.sub(0, 0));
    }
    if (obj.is("mushroomSurprise")) {
      gameLevel.spawn("#", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("^", obj.gridPos.sub(0, 0));
    }
  });

  player.collides("mushroom", (m) => {
    destroy(m);
    player.biggify(30);
  });

  player.collides("coin", (c) => {
    destroy(c);
    scoreLabel.value++;
    scoreLabel.text = "points " + scoreLabel.value;
  });

  player.collides("dangerous", (d) => {
    if (isJumping) {
      destroy(d);
      scoreLabel.value++;
      scoreLabel.text = "points " + scoreLabel.value;
    } else {
      go("lose", { score: scoreLabel.value });
    }
  });

  player.action(() => {
    camPos(player.pos);
    if (player.pos.y >= FALL_DEATH) {
      go("lose", { score: scoreLabel.value });
    }
  });

  player.collides("pipe", () => {
    keyPress("down", () => {
      go("game", { level: (level + 1) % maps.length, score: scoreLabel.value });
    });
  });

  keyDown("left", () => {
    player.move(-MOVE_SPEED, 0);
    levelLabel.move(-MOVE_SPEED, 0);
    scoreLabel.move(-MOVE_SPEED, 0);
  });

  keyDown("right", () => {
    player.move(MOVE_SPEED, 0);
    levelLabel.move(MOVE_SPEED, 0);
    scoreLabel.move(MOVE_SPEED, 0);
  });

  player.action(() => {
    if (player.grounded()) {
      isJumping = false;
    } else {
      isJumping = true;
    }
  });

  keyPress("space", () => {
    if (player.grounded()) {
      isJumping = true;
      player.jump(CURRENT_JUMP_FORCE);
    }
  });
});

scene("lose", ({ score }) => {
  add([text(score, 32), origin("center"), pos(width() / 2, height() / 2)]);

  keyPress("space", () => {
    location.reload();
  });
});

start("game", { level: 0, score: 0 });
