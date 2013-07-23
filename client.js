var drawer;
var world;
$(ImageLoader.load_async(["marine_sprite.png"], function(images){
    drawer = new IsometricDrawer('screen', $V([15,0]), $V([0,5]), $V([100, 80]));
    var ch = $CH($V([10, 10]), images[0].width / drawer.horizontal_unit, images[0]);
    var ht = 45;
    var size1 = 50;
    var size2 = 20;
    world =
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
            [19, 0],
            [19, 20],
            [0, 20]
        ], 0, [], [], true),

        $R([
            [19, 0],
            [20, 0],
            [20, 20],
            [19, 20]
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

    ch.potential_regions = world.regions;

    var e1 = $LS([[20, 0], [20, 20]]);
    var e2 = $LS([[19, 0], [19, 20]]);
    Region.share_edge(world.regions[1], world.regions[2], e1);
    Region.share_edge(world.regions[0], world.regions[1], e2);

    Region.shared_edges[0].id="a";
    Region.shared_edges[1].id="b";

    world.regions[0].id = "a";
    world.regions[1].id = "b";
    world.regions[2].id = "c";

    var control = new Control(ch, 0.5, 10, $V([-1, 0]), $V([1, 0]), $V([0, -1]), $V([0, 1]));
    control.bind_keys();

    var angle = 2*Math.PI/3;
    world.rotate(angle, $V([25, 25]));
    e1.rotate(angle, $V([25, 25]));
    e2.rotate(angle, $V([25, 25]));

    var tick_angle = Math.PI/180;

    function draw() {/*
        world.rotate(tick_angle, $V([25, 25]));
        e1.rotate(tick_angle, $V([25, 25]));
        e2.rotate(tick_angle, $V([25, 25]));
*/
        control.tick();
        world.flush_sprites();

        ch.locate_self();
        drawer.clear();
        var order = world.generate_draw_order($V([0, -1]), $V([1, 0]));
        draw_arr(order);
        draw_arr(world.characters);
        setTimeout(draw, 33);
    }

    window.onresize = window.onload = function() {
        drawer.canvas.width = window.innerWidth;
        drawer.canvas.height = window.innerHeight;

    }
    drawer.canvas.width = window.innerWidth;
    drawer.canvas.height = window.innerHeight;
    draw();

}))
