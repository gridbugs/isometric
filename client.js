var drawer;
var world;
$(ImageLoader.load_async([
    "marine_sheet.gif",
    "back_face.png",
    "face_wall1.png",
    "face_wall2.png",
    "floor1.png",
    "floor2.png",
    "marine_sprite.png",
    "outside_floor.png",
    "room_wall1.png",
    "room_wall2.png",
    "wall1.png",
    "wall2.png",
    "wall3.png",
    "wall4.png",
    "wall5.png",
    "wall6.png",
    "all_walls.png",
    "all_floor.png",
    "transparency.png"
    ], function(images){
    drawer = new IsometricDrawer('screen', $V([5,0]), $V([0,2]), $V([100, 300]));
    var s = $SPR(images["marine_sheet.gif"]);
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

    var ch = $CH($V([10, 50]), 50 / drawer.horizontal_unit, s);




    var ht = 45;
    var size1 = 50;
    var size2 = 20;

    var centre_height = 80;
    world =
    $R(
    /* list of points around the convex polygon containing the world*/
    [
        [0, 0],
        [0, 200],
        [300, 200],
        [300, 0]
    ],

    /* base height for the world */
    0,

    /* list of walls in the world */
    [
        $W([[40, 0], [40, 50]], $PI(images["face_wall2.png"], [132, 110])),
        $W([[40, 50], [40, 100]], $PI(images["face_wall1.png"], [358, 235])),
        // walls on the left going down
        $W([[40, 40], [65, 40]], $PI(images["wall1.png"], [315, 272])),
        $W([[65, 40], [85, 50]], $PI(images["wall2.png"], [432, 275])),
        $W([[85, 50], [100, 48]], $PI(images["wall3.png"], [545, 263])),
        $W([[100, 48], [128, 30]], $PI(images["wall4.png"], [605, 228])),
        $W([[128, 30], [150, 28]], $PI(images["wall5.png"], [686, 180])),
        $W([[150, 28], [165, 10]], $PI(images["wall6.png"], [770, 166])),

        // walls on the right going down
        $W([[40, 55], [55, 55]], $PI()),
        $W([[55, 55.1], [80, 65.1]], $PI()),
        $W([[80, 65], [108, 65]], $PI()),
        $W([[108, 65], [134, 45]], $PI()),
        $W([[134, 45], [156, 43]], $PI()),
        $W([[156, 43], [180, 15]], $PI()),

        // room at the end
        $W([[148, 0], [167, -36]], $PI()),
        $W([[167, -36], [254, 10]], $PI(images["room_wall2.png"], [672, 68])),
        $W([[254, 10], [237, 45]], $PI(images["room_wall1.png"], [1177, 75])),
        $W([[237, 45], [180, 15]], $PI()),
        $W([[180, 15], [165, 10]], $PI()),
        $W([[165, 10], [148, 0]], $PI()),
    ],

/*
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
 */

    /* list of regions in the world */
    [
        /* outside regions */
        $R([
            [0, 0],
            [40, 0],
            [40, 100],
            [0, 100]
        ], 0, [], [], true, [], $PI()),
        $SR([
            [40, 40],
            [65, 40],
            [55, 55],
            [40, 55]
        ], [
            [40, 40, 0],
            [65, 40, -10],
            [55, 55, -10]
        ], true, $PI(images["all_floor.png"], [6, 26])),
        $SR([
            [65, 40],
            [85, 50],
            [80, 65],
            [55, 55]
        ], [
            [65, 40, -10],
            [85, 50, -20],
            [80, 65, -20]
        ], true, $PI()),
        $SR([
            [85, 50],
            [100, 48],
            [108, 65],
            [80, 65]
        ], [
            [85, 50, -20],
            [100, 48, -30],
            [108, 65, -30],
        ], true, $PI()),
        $SR([
            [100, 48],
            [128, 30],
            [134, 45],
            [108, 65]
        ], [
            [100, 40, -30],
            [128, 30, -40],
            [134, 45, -40]
        ], true, $PI()),
        $SR([
            [128, 30],
            [150, 28],
            [156, 43],
            [134, 45]
        ], [
            [128, 30, -40],
            [150, 28, -50],
            [156, 43, -50]
        ], true, $PI()),
        $SR([
            [150, 28],
            [165, 10],
            [180, 15],
            [156, 43]
        ], [
            [150, 28, -50],
            [165, 10, -60],
            [180, 15, -60]
        ], true, $PI()),
        $R([
            [148, 0],
            [167, -36],
            [254, 10],
            [237, 45],
            [180, 15],
            [165, 10]
        ], -60, [], [], true, [], $PI()),

    ],

    /* are the borders of the world visible? */
    false,

    /* list of characters */
    [
        ch
    ]);

    ch.potential_regions = world.regions;

    // borders between outer segments
    var e1 = $LS([[40, 40], [40, 55]]);
    var e2 = $LS([[65, 40], [55, 55]]);
    var e3 = $LS([[85, 50], [80, 65]]);
    var e4 = $LS([[100, 48], [108, 65]]);
    var e5 = $LS([[128, 30], [134, 45]]);
    var e6 = $LS([[150, 28], [156, 43]]);
    var e7 = $LS([[165, 10], [180, 15]]);

    Region.share_edge(world.regions[0], world.regions[1], e1);
    Region.share_edge(world.regions[1], world.regions[2], e2);
    Region.share_edge(world.regions[2], world.regions[3], e3);
    Region.share_edge(world.regions[3], world.regions[4], e4);
    Region.share_edge(world.regions[4], world.regions[5], e5);
    Region.share_edge(world.regions[5], world.regions[6], e6);
    Region.share_edge(world.regions[6], world.regions[7], e7);

    var control = new Control(ch, 0.5, 1, $V([-1, 0]), $V([1, 0]), $V([0, -1]), $V([0, 1]));
    control.bind_keys();

    var borders = [e1, e2, e3, e4, e5, e6, e7];

    var angle = -Math.PI/6;
    world.rotate(angle, $V([25, 25]));
    for (var i in borders) {
        borders[i].rotate(angle, $V([25, 25]));
    }


    var tick_angle = Math.PI/180;

    var order = world.generate_draw_order($V([0, -1]), $V([1, 0]));
    console.debug(order);
    var back_face = $PI(images["back_face.png"], [224, 36]);
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

        drawer.player_drawn = false;
        draw_arr(order);
        back_face.draw(drawer.fb.ctx);

        var player_mid = {
            x: drawer.player_top_left_x + drawer.player_width/2,
            y: drawer.player_top_left_y + drawer.player_height/2
        };
        var cover_width = 150;
        var cover_height = 150;

        drawer.fb.ctx.globalCompositeOperation = "destination-out";
/*
        drawer.fb.ctx.fillRect(
            player_mid.x - cover_width/2,
            player_mid.y - cover_height/2,
            cover_width,
            cover_height
        );
*/
        drawer.fb.ctx.drawImage(
            images["transparency.png"],
            player_mid.x - cover_width/2,
            player_mid.y - cover_height/2
        );
        drawer.fb.ctx.globalCompositeOperation = "source-over";

        drawer.ctx.drawImage(drawer.fb.canvas, 0, 0);
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
