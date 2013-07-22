$(ImageLoader.load_async(["marine_sprite.png"], function(images){
    var drawer = new IsometricDrawer('screen', $V([15,0]), $V([0,5]), $V([100, 80]));
    var ch = $CH($V([18, 10]), images[0].width / drawer.horizontal_unit, images[0]);
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
            [18, 0],
            [18, 20],
            [0, 20]
        ], 0, [], [], true),

        $R([
            [18, 0],
            [20, 0],
            [20, 20],
            [18, 20]
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
        ch
    ]);

    var e1 = $LS([[20, 0], [20, 20]]);
    var e2 = $LS([[18, 0], [18, 20]]);
    Region.share_edge(world.regions[1], world.regions[2], e1);
    Region.share_edge(world.regions[0], world.regions[1], e2);

    function draw() {
    world.rotate(Math.PI/6, $V([25, 25]));
    e1.rotate(Math.PI/6, $V([25, 25]));
    e2.rotate(Math.PI/6, $V([25, 25]));
    ch.locate_self();



        drawer.clear();
        var order = world.generate_draw_order($V([0, -1]), $V([1, 0]));

        draw_arr(order);
        draw_arr(world.characters);
//        setTimeout(draw, 100);
    }

    window.onresize = window.onload = function() {
        drawer.canvas.width = window.innerWidth;
        drawer.canvas.height = window.innerHeight;

    }
    drawer.canvas.width = window.innerWidth;
    drawer.canvas.height = window.innerHeight;
    draw();

}))
