$(function(){

    var drawer = new IsometricDrawer('screen', $V([15,0]), $V([0,5]), $V([100,150]));

    var ht = 45;
    var size1 = 50;
    var size2 = 20;
    var world = $R([$V([0, 0]), $V([0, 200]), $V([200, 200]), $V([200, 0])], 0,
    [
        $W([$V([0, 0]), $V([0, size1])], ht),
        $W([$V([0, size1]), $V([size1, size1])], ht),
        $W([$V([size1, size1]), $V([size1, 0])], ht),
        $W([$V([size1, 0]), $V([0, 0])], ht)
    ], [
        $R([$V([0,0]), $V([0,size1]), $V([size1, size1]), $V([size1, 0])], ht,
        [
            $W([$V([0, 0]), $V([0, size2])], ht),
            $W([$V([0, size2]), $V([size2, size2])], ht),
            $W([$V([size2, size2]), $V([size2, 0])], ht),
            $W([$V([size2, 0]), $V([0, 0])], ht)
        ],[]
        )
    ]);



    function draw() {
        drawer.clear();

        world.rotate(Math.PI/128, $V([25, 25]));

        var order = world.generate_draw_order($V([0, -1]), $V([1, 0]));
        for (var i in order) {
            order[i].draw();
        }
        
        setTimeout(draw, 40);
    }

    window.onresize = window.onload = function() {
        drawer.canvas.width = window.innerWidth;
        drawer.canvas.height = window.innerHeight;

    }
    draw();

})
