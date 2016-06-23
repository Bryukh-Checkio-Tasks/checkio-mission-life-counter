//Dont change it
requirejs(['ext_editor_io', 'jquery_190', 'raphael_210', 'snap.svg_030'],
    function (extIO, $, Raphael, Snap) {

        function LifeSVG(dom) {

            var colorOrange4 = "#F0801A";
            var colorOrange3 = "#FA8F00";
            var colorOrange2 = "#FAA600";
            var colorOrange1 = "#FABA00";

            var colorBlue4 = "#294270";
            var colorBlue3 = "#006CA9";
            var colorBlue2 = "#65A1CF";
            var colorBlue1 = "#8FC7ED";

            var colorGrey4 = "#737370";
            var colorGrey3 = "#9D9E9E";
            var colorGrey2 = "#C5C6C6";
            var colorGrey1 = "#EBEDED";

            var colorWhite = "#FFFFFF";

            var cell = 10;


            var size = 23;
            var sizePx = cell * (size * 2 + 2);
            var paper = Raphael(dom, sizePx, sizePx);
            var center = sizePx / 2;

            var circles = paper.set();
            var grid = [];

            var attrRect = {"stroke": colorBlue2, "stroke-width": 1};
            var attrCircle = {"stroke": colorBlue4, "stroke-width": 1, "fill": colorBlue2};

            this.prepare = function (data) {
                for (var i = -size; i < size; i++) {
                    grid[i] = [];
                    circles[i] = paper.set();
                    for (var j = -size; j < size; j++) {
                        paper.rect(center + j * cell, center + i * cell, cell, cell).attr(
                            attrRect);
                        if (data[i] && data[i][j] === 1) {
                            grid[i][j] = 1;
                            var c = paper.circle(center + (j + 0.5) * cell, center + (i + 0.5) * cell, cell * 0.3).attr(
                                attrCircle);
                            c.row = i;
                            c.col = j;
                            circles[i][j] = c;
                        }
                        else {
                            grid[i][j] = 0;
                        }
                    }
                }
            };

            this.live = function (N) {
                var count = 0;

                var NEIGHBOURS = [
                    [-1, -1],
                    [-1, 0],
                    [-1, 1],
                    [0, 1],
                    [0, -1],
                    [1, -1],
                    [1, 0],
                    [1, 1]
                ];

                var step = 300;

                (function process() {
                    if (count > N - 1) {
                        return false;
                    }
                    var newGrid = [];
                    for (var i = -size; i < size; i++) {
                        newGrid[i] = [];
                        for (var j = -size; j < size; j++) {
                            var neighs = 0;
                            for (var n = 0; n < NEIGHBOURS.length; n++) {
                                var ni = i + NEIGHBOURS[n][0];
                                var nj = j + NEIGHBOURS[n][1];
                                if (grid[ni] && grid[ni][nj]) {
                                    neighs++;
                                }
                            }
                            if (grid[i][j]) {
                                if (neighs === 2 || neighs === 3) {
                                    newGrid[i][j] = grid[i][j];
                                }
                                else {
                                    newGrid[i][j] = 0;
                                    circles[i][j].animate({"r": 1}, step,
                                        callback = function () {
                                            this.remove();
                                        })
                                }
                            }
                            else {
                                if (neighs === 3) {
                                    newGrid[i][j] = 1;
                                    var c = paper.circle(center + (j + 0.5) * cell, center + (i + 0.5) * cell, 1).attr(
                                        attrCircle);
                                    circles[i][j] = c;
                                    c.animate({"r": cell * 0.3}, step);
                                }
                            }
                        }
                    }

                    setTimeout(function () {
                        count++;
                        grid = newGrid;
                        process()
                    }, step * 1.5);
                })();
            }

        }

        var io = new extIO({
            functions: {
                js: 'lifeCounter',
                python: 'life_counter'
            },
            animation: function($expl, data){
                var checkioInput = data.in;
                if (!checkioInput){
                    return;
                }
                var svg = new LifeSVG($expl[0]);
                svg.prepare(checkioInput[0]);
            }
        });
        io.start();

    }
);
