var ctx, canvas;
$(ImageLoader.load_async(["marine_sheet.gif"], function(images){

    canvas = $("#screen")[0];
    ctx = canvas.getContext("2d");

    var s = $SPR(images[0]);
    s.a("walk_side0", [102, 0], [144, 52]);
    s.a("walk_side1", [378, 0], [414, 55]);
    s.a("walk_side2", [160, 90], [198, 143]);
    s.a("walk_side3", [432, 90], [466, 144]);

    s.a("walk_front0", [0, 0], [41, 56]);
    s.a("walk_front1", [270, 0], [307, 56]);
    s.a("walk_front2", [54, 88], [92, 144]);
    s.a("walk_front3", [320, 91], [360, 145]);

    s.add_sequence("walk_side", ["walk_side0", "walk_side1", "walk_side2", "walk_side3"], true, 10);
    s.add_sequence("walk_front", ["walk_front0", "walk_front1", "walk_front2", "walk_front3"], true, 10);
    s.current_sequence = "walk_front";

    function draw_loop() {
        ctx.clearRect(0, 0, 200, 200);
        s.draw_next(ctx);
        setTimeout(draw_loop, 200);
    }
    draw_loop();
}))
