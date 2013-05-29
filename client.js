$(function(){

    var drawer = new IsometricDrawer('screen', $V([5,0]), $V([0,2]), $V([100,100]));
    
    window.onresize = window.onload = function() {
        drawer.canvas.width = window.innerWidth;
        drawer.canvas.height = window.innerHeight;
    }

//    var drawer = new Drawer('screen')
    var ht = 45;
    var walls = [
        $W([$V([80, 35]), $V([80, 75])], ht), 
        $W([$V([40, 5]), $V([40, 45])], ht),
        $W([$V([60, 65]), $V([60, 105])], ht),
        $W([$V([30, 55]), $V([70, 55])], ht),
        $W([$V([50, 25]), $V([90, 25])], ht),
        $W([$V([90, 70]), $V([130, 70])], ht)
    ];
    
    function draw() {
        drawer.clear();

        for (i in walls) {
            for (j in walls[i].elements) {
                walls[i].elements[j] = walls[i].elements[j].rotate(Math.PI/64, $V([80,50]));
            }
        }

        var order = DrawOrder.arrange(walls, $V([0, -1]));
        for (i in order) {
            order[i].draw();
        }

        setTimeout(draw, 40);
    }

    draw();
})
