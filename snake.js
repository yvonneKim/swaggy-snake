var config = {
    type: Phaser.WEBGL,
    width: 640,
    height: 480,
    backgroundColor: '#bfcc00',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade'
    }
};

var game = new Phaser.Game(config);
var snake;
var cursors;
var score = 0;
var head;
var heading = 'right'
var moveTime = 0
var stepLength = 5
var stepRate = 10
var texts = []
var lastTime = 0
var boomScale = 1.8

// var Food = new Phaser.Class({
//     Extends: Phaser.GameObjects.Image,
//     initialize: function Food(scene, x, y) {
//         Phaser.GameObjects.Image.call(this, scene)
        
//         this.setTexture('food');
//         this.setPosition(x * 16, y * 16);
//         this.setOrigin(0);
//         this.total = 0;
//         scene.children.add(this);
//     }
// })

function spawn_food(scene) {
    food = scene.physics.add.image(300, 300, 'food')
    scene.physics.add.overlap(head, food, eat)
}

function eat(head, food) {
    var random_Y = Phaser.Math.RND.between(0, 480)
    var random_X = Phaser.Math.RND.between(0, 640)
    food.setPosition(random_X, random_Y)
    score += 1
}

function preload ()
{
    this.load.image('food', 'assets/food.png');
    this.load.image('body', 'assets/body.png');
    this.load.spritesheet('explosion', 'assets/explosion.png', {
        'frameWidth': 16, 'frameHeight': 16
    });
}

function create ()
{
    this.physics.world.setBoundsCollision(true, true, true, true);
    head = this.physics.add.sprite(160, 10, 'body');
    head.setOrigin(0);
    head.setCollideWorldBounds(true)
    head.body.onWorldBounds = true
    debug_text = this.add.text(100, 130, '')
    this.physics.world.on('worldbounds', onWorldBounds)

    

    cursors = this.input.keyboard.createCursorKeys();

    explosion_animation = this.anims.create({
        key: 'boom',
        frames: this.anims.generateFrameNumbers('explosion'),
        frameRate: 20,
        repeat: 0,
        hideOnComplete: true
    });

    // food = new Food(this, 3, 4);
    spawn_food(this)
}

function die() {
    stepLength = 0
    head.setTexture('explosion').setScale(boomScale).play('boom')
}

function onWorldBounds(body) {
    stepLength = 0
    die() 
}

function face_left() {
    heading = 'left'
}

function face_right() {
    heading = 'right'
}

function face_down() {
    heading = 'down'
}

function face_up() {
    heading = 'up'
}

function update (time, delta)
{
    texts = []
    print('direction: '+heading)
    print('time: '+time)
    print('lastTime: '+lastTime)
    print('stepLength: '+stepLength)
    print('score: '+score)
    if(time - lastTime >= stepRate) {
        if(heading == 'left') {
            head.x -= stepLength
        }

        if(heading == 'right') {
            head.x += stepLength
        }

        if(heading == 'up') {
            head.y -= stepLength
        }

        if(heading == 'down') {
            head.y += stepLength
        }
        lastTime = time
    }

    if (cursors.left.isDown) {
        face_left()
    }

    if (cursors.right.isDown) {
        face_right()
    }

    if (cursors.up.isDown) {
        face_up()
    }

    if (cursors.down.isDown) {
        face_down()
    }

    debug_text.setText(texts)
}

function print(str) {
    texts.push(str)
}