var drawer;
var world;
$(ImageLoader.load_async(["marine_sheet.gif"], function(images){
    drawer = new IsometricDrawer('screen', $V([15,0]), $V([0,5]), $V([100, 120]));
    console.debug("hi");
    var s = $SPR(images[0]);
    s.a("walk_side0", [102, 0], [144, 52]);
    s.a("walk_side1", [378, 0], [414, 55]);
    s.a("walk_side2", [160, 90], [198, 143]);
    s.a("walk_side3", [432, 90], [466, 144]);

    s.a("walk_front0", [0, 0], [41, 56]);
    s.a("walk_front1", [270, 0], [307, 56]);
    s.a("walk_front2", [54, 88], [92, 144]);
    s.a("walk_front3", [320, 91], [360, 145]);

    s.a("walk_back0", [216, 0], [252, 50]);
    s.a("walk_back1", [0, 90], [34, 144]);
    s.a("walk_back2", [272, 90], [306, 144]);
    s.a("walk_back3", [72, 162], [107, 216]);

    s.a("stand", [126, 160], [152, 216]);

    s.add_sequence("walk_side", ["walk_side0", "walk_side1", "walk_side2", "walk_side3"], true);
    s.add_sequence("walk_front", ["walk_front0", "walk_front1", "walk_front2", "walk_front3"], true);
    s.add_sequence("walk_back", ["walk_back0", "walk_back1", "walk_back2", "walk_back3"], true);
    s.add_sequence("stand", ["stand"], false);
    s.current_sequence = "walk_front";

    var ch = $CH($V([10, 10]), 100 / drawer.horizontal_unit, s);




    var ht = 45;
    var size1 = 50;
    var size2 = 20;
    world =
    $R(
    /* list of points around the convex polygon containing the world*/
    [
        [0, 0],
        [0, 40],
        [40, 40],
        [40, 0]
    ],

    /* base height for the world */
    0,

    /* list of walls in the world */
    [
        /*
        $W([[0,0],[0,40]]),
        $W([[0,40],[40,40]]),
        $W([[40,40],[40,0]]),
        $W([[40,0],[0,0]]),
        $W([[0,20],[15,20]]),
        $W([[20,20],[20,10]]),
        $W([[20,5],[20,0]]),
        $W([[20,25],[20,40]]),
        $W([[20,20],[40,20]]), */
    ],

    /* list of regions in the world */
    [
        $SR([
            [0, 0],
            [20, 0],
            [20, 20],
            [0, 20]
        ],
        [
            [0, 0, 20],
            [20, 0, 0],
            [20, 20, 0],
        ],
        true),

        $R([
            [20, 0],
            [40, 0],
            [40, 20],
            [20, 20]
        ], 0, [], [], true),

        $R([
            [0, 20],
            [20, 20],
            [20, 40],
            [0, 40]
        ], 20, [], [], true),
        /*
        $R([
            [20, 20],
            [40, 20],
            [40, 40],
            [20, 40]
        ], 0, [], [], true)
        */


    ],

    /* are the borders of the world visible? */
    false,

    /* list of characters */
    [
        ch
    ]);

    ch.potential_regions = world.regions;

    var e1 = $LS([[20, 0], [20, 20]]);
    var e2 = $LS([[20, 20], [40, 20]]);
    var e3 = $LS([[0, 20], [20, 20]]);
    var e4 = $LS([[20, 20], [20, 40]]);

    Region.share_edge(world.regions[0], world.regions[1], e1);
    Region.share_edge(world.regions[1], world.regions[3], e2);
    Region.share_edge(world.regions[0], world.regions[2], e3);
    Region.share_edge(world.regions[2], world.regions[3], e4);

    var control = new Control(ch, 0.5, 1, $V([-1, 0]), $V([1, 0]), $V([0, -1]), $V([0, 1]));
    control.bind_keys();

    var angle = Math.PI/6;
    world.rotate(angle, $V([25, 25]));
    e1.rotate(angle, $V([25, 25]));
    e2.rotate(angle, $V([25, 25]));
    e3.rotate(angle, $V([25, 25]));
    e4.rotate(angle, $V([25, 25]));

    var tick_angle = Math.PI/180;

    var order = world.generate_draw_order($V([0, -1]), $V([1, 0]));

    function draw() {/*
        world.rotate(tick_angle, $V([25, 25]));
        e1.rotate(tick_angle, $V([25, 25]));
        e2.rotate(tick_angle, $V([25, 25]));
*/
        control.tick();

        s.set_fps(control.movement.velocity.modulus()*15);
        if (control.movement.velocity.modulus() == 0) {
            s.current_sequence = "stand";
        } else if (control.movement.velocity.elements[1] > 0) {
            s.current_sequence = "walk_front";
        } else if (control.movement.velocity.elements[1] < 0) {
            s.current_sequence = "walk_back";
        } else {
            s.current_sequence = "walk_side";
        }

        world.flush_sprites();

        ch.locate_self();
        drawer.clear();

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
