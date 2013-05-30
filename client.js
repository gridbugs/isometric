$(function(){

    var drawer = new IsometricDrawer('screen', $V([15,0]), $V([0,5]), $V([100,150]));

    var ht = 45;
    var base_walls = [
        $W([$V([0, 0]), $V([0, 20])], ht),
        $W([$V([0, 20]), $V([20, 20])], ht),
        $W([$V([20, 20]), $V([20, 0])], ht),
        $W([$V([20, 0]), $V([0, 0])], ht)
    ];


    var regions = [
        $R([$V([0, 0]), $V([0, 20]), $V([20, 20]), $V([20, 0])], ht, [], [])
    ];

    var walls = base_walls;
    function draw() {
        drawer.clear();


        var order = DrawOrder.arrange(walls, $V([0, -1]));
        for (var i in order) {

            order[i].draw();
        }

    }
    var x;
    function repeat_draw() {
        for (var i in walls) {
            for (var j in walls[i].elements) {
                walls[i].elements[j] = walls[i].elements[j].rotate(Math.PI/64, $V([10,10]));
            }
        }
        for (var i in regions) {
            for (var j in regions[i].elements) {
                regions[i].elements[j] = regions[i].elements[j].rotate(Math.PI/64, $V([10,10]));
            }
        }        
        x = regions[0].generate_cross_wall($V([1, 0]));
        draw();
        regions[0].draw();
        x.draw();
        setTimeout(repeat_draw, 40);
    }

    window.onresize = window.onload = function() {
        drawer.canvas.width = window.innerWidth;
        drawer.canvas.height = window.innerHeight;

        draw();
//    regions[0].draw();
    }

    var rot = Math.PI/24;
    for (var i in walls) {
        for (var j in walls[i].elements) {
            walls[i].elements[j] = walls[i].elements[j].rotate(rot, $V([20,20]));
        }
    }
    for (var i in regions) {
        for (var j in regions[i].elements) {
            regions[i].elements[j] = regions[i].elements[j].rotate(rot, $V([20,20]));
        }
    }

    repeat_draw();
})
