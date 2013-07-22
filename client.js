$(ImageLoader.load_async(["marine_sprite.png"], function(images){

    var drawer = new IsometricDrawer('screen', $V([15,0]), $V([0,5]), $V([100, 80]));

    var ht = 45;
    var size1 = 50;
    var size2 = 20;
    var world = 
    $R([ 
        [0, 0], 
        [0, 40], 
        [40, 40], 
        [40, 0] 
    ], 0,
    [], 
    [
        $R([
            [0, 0],
            [20, 0],
            [20, 20],
            [0, 20]
        ], 0, [], [], true),

        $R([
            [20, 0],
            [40, 0],
            [40, 20],
            [20, 20]
        ], 0, [], [], true)

    ],
    false,
    [
        $CH($V([20, 10]), 32)
    ]);

    world.rotate(Math.PI/6, $V([25, 25]));
    var order = world.generate_draw_order($V([0, -1]), $V([1, 0]));
    
    console.debug(order);

    function draw() {
        drawer.clear();

        draw_arr(order);
        draw_arr(world.characters);
      //  drawer.ctx.drawImage(images[0], 10, 10);
      //  setTimeout(draw, 40);
    }

    window.onresize = window.onload = function() {
        drawer.canvas.width = window.innerWidth;
        drawer.canvas.height = window.innerHeight;

    }
    drawer.canvas.width = window.innerWidth;
    drawer.canvas.height = window.innerHeight;
    draw();

}))
