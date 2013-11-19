var drawer;
var world;
$(ImageLoader.load_async(["marine_sheet.gif"], function(images){
    drawer = new IsometricDrawer('screen', $V([15,0]), $V([0,5]), $V([100, 120]));
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

    var ch = $CH($V([10, 5]), 100 / drawer.horizontal_unit, s);




    var ht = 45;
    var size1 = 50;
    var size2 = 20;

    var centre_height = 80;
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
        /* outside regions */
        $R([
            [0, 0],
            [10, 10],
            [30, 10],
            [40, 0]
        ], 0, [], [], true),
        $R([
            [0, 0],
            [10, 10],
            [10, 30],
            [0, 40]
        ], 0, [], [], true),
        $R([
            [40, 40],
            [30, 30],
            [10, 30],
            [0, 40]
        ], 0, [], [], true),
        $R([
            [40, 40],
            [30, 30],
            [30, 10],
            [40, 0]
        ], 0, [], [], true),
        // inside sloped regions
        $SR([
            [10, 10],
            [30, 10],
            [25, 15],
            [15, 15]
        ], [
            [10, 10, 0],
            [30, 10, 0],
            [15, 15, centre_height]
        ], true),
        $SR([
            [10, 10],
            [10, 30],
            [15, 25],
            [15, 15]
        ], [
            [10, 10, 0],
            [10, 30, 0],
            [15, 15, centre_height]
        ], true),
        $SR([
            [10, 30],
            [30, 30],
            [25, 25],
            [15, 25]
        ], [
            [10, 30, 0],
            [30, 30, 0],
            [25, 25, centre_height]
        ], true),
        $SR([
            [30, 30],
            [30, 10],
            [25, 15],
            [25, 25]
        ], [
            [30, 30, 0],
            [30, 10, 0],
            [25, 25, centre_height]
        ], true),
        // centre
        $R([
            [15, 15],
            [15, 25],
            [25, 25],
            [25, 15]
        ], centre_height, [], [], true)

    ],

    /* are the borders of the world visible? */
    false,

    /* list of characters */
    [
        ch
    ]);

    ch.potential_regions = world.regions;

    // borders between outer segments
    var e1 = $LS([[0, 0], [10, 10]]);
    var e2 = $LS([[40, 40], [30, 30]]);
    var e3 = $LS([[0, 40], [10, 30]]);
    var e4 = $LS([[40, 0], [30, 10]]);

    Region.share_edge(world.regions[0], world.regions[1], e1);
    Region.share_edge(world.regions[2], world.regions[3], e2);
    Region.share_edge(world.regions[1], world.regions[2], e3);
    Region.share_edge(world.regions[0], world.regions[3], e4);

    // borders between outer and inner segments
    var e5 = $LS([[10, 10], [30, 10]]);
    var e6 = $LS([[10, 10], [10, 30]]);
    var e7 = $LS([[10, 30], [30, 30]]);
    var e8 = $LS([[30, 30], [30, 10]]);

    Region.share_edge(world.regions[0], world.regions[4], e5);
    Region.share_edge(world.regions[1], world.regions[5], e6);
    Region.share_edge(world.regions[2], world.regions[6], e7);
    Region.share_edge(world.regions[3], world.regions[7], e8);

    // borders between inner segments
    var e9 =  $LS([[10, 10], [15, 15]]);
    var e10 = $LS([[10, 30], [15, 25]]);
    var e11 = $LS([[30, 30], [25, 25]]);
    var e12 = $LS([[30, 10], [25, 15]]);

    Region.share_edge(world.regions[4], world.regions[5], e9);
    Region.share_edge(world.regions[5], world.regions[6], e10);
    Region.share_edge(world.regions[6], world.regions[7], e11);
    Region.share_edge(world.regions[4], world.regions[7], e12);

    // borders between inner segments and centre
    var e13 = $LS([[15, 15], [25, 15]]);
    var e14 = $LS([[15, 15], [15, 25]]);
    var e15 = $LS([[15, 25], [25, 25]]);
    var e16 = $LS([[25, 25], [25, 15]]);

    Region.share_edge(world.regions[4], world.regions[8], e13);
    Region.share_edge(world.regions[5], world.regions[8], e14);
    Region.share_edge(world.regions[6], world.regions[8], e15);
    Region.share_edge(world.regions[7], world.regions[8], e16);


    var control = new Control(ch, 0.5, 1, $V([-1, 0]), $V([1, 0]), $V([0, -1]), $V([0, 1]));
    control.bind_keys();



    var angle = Math.PI/6;
    world.rotate(angle, $V([25, 25]));
    var borders = [e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11, e12, e13, e14, e15, e16];
    for (var i in borders) {
        borders[i].rotate(angle, $V([25, 25]));
    }

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
        
        /*
        for (var i in borders) {
            borders[i].draw();
        }
        */

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
