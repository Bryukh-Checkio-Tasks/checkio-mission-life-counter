//Dont change it
requirejs(['ext_editor_1', 'jquery_190', 'raphael_210', 'snap.svg_030'],
    function (ext, $, Raphael, Snap) {

        var cur_slide = {};

        ext.set_start_game(function (this_e) {
        });

        ext.set_process_in(function (this_e, data) {
            cur_slide = {};
            cur_slide["in"] = data[0];
            this_e.addAnimationSlide(cur_slide);
        });

        ext.set_process_out(function (this_e, data) {
            cur_slide["out"] = data[0];
        });

        ext.set_process_ext(function (this_e, data) {
            cur_slide.ext = data;
        });

        ext.set_process_err(function (this_e, data) {
            cur_slide['error'] = data[0];
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_animate_success_slide(function (this_e, options) {
            var $h = $(this_e.setHtmlSlide('<div class="animation-success"><div></div></div>'));
            this_e.setAnimationHeight(115);
        });

        ext.set_animate_slide(function (this_e, data, options) {
            var $content = $(this_e.setHtmlSlide(ext.get_template('animation'))).find('.animation-content');
            if (!data) {
                console.log("data is undefined");
                return false;
            }

            //YOUR FUNCTION NAME
            var fname = 'life_counter';

            var checkioInput = data.in || [
                [
                    [0, 1, 0],
                    [0, 0, 1],
                    [1, 1, 1]
                ],
                50
            ];
            var checkioInputStr = fname + '((';
            for (var i = 0; i < checkioInput[0].length; i++) {
                checkioInputStr += "<br>    " + JSON.stringify(checkioInput[0][i]).replace("[", "(").replace("]", ")") + ",";
            }
            checkioInputStr += "), " + String(checkioInput[1]) + ")";

            var failError = function (dError) {
                $content.find('.call div').html(checkioInputStr);
                $content.find('.output').html(dError.replace(/\n/g, ","));

                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
                $content.find('.answer').remove();
                $content.find('.explanation').remove();
                this_e.setAnimationHeight($content.height() + 60);
            };

            if (data.error) {
                failError(data.error);
                return false;
            }

            if (data.ext && data.ext.inspector_fail) {
                failError(data.ext.inspector_result_addon);
                return false;
            }

            $content.find('.call div').html(checkioInputStr);
            $content.find('.output').html('Working...');

            var svg = new LifeSVG($content.find(".explanation")[0]);
            svg.prepare(checkioInput[0]);

            if (data.ext) {
                var rightResult = data.ext["answer"];
                var userResult = data.out;
                var result = data.ext["result"];
                var result_addon = data.ext["result_addon"];

                if (explanation) {
                    svg.live(checkioInput[1]);
                }

                var explanation = data.ext["explanation"];
                $content.find('.output').html('&nbsp;Your result:&nbsp;' + JSON.stringify(userResult));
                if (!result) {
                    $content.find('.answer').html('Right result:&nbsp;' + JSON.stringify(rightResult));
                    $content.find('.answer').addClass('error');
                    $content.find('.output').addClass('error');
                    $content.find('.call').addClass('error');
                }
                else {
                    $content.find('.answer').remove();
                }
            }
            else {
                $content.find('.answer').remove();
            }


            //Your code here about test explanation animation
            //$content.find(".explanation").html("Something text for example");
            //
            //
            //
            //
            //


            this_e.setAnimationHeight($content.height() + 60);

        });

        //This is for Tryit (but not necessary)
//        var $tryit;
//        ext.set_console_process_ret(function (this_e, ret) {
//            $tryit.find(".checkio-result").html("Result<br>" + ret);
//        });
//
//        ext.set_generate_animation_panel(function (this_e) {
//            $tryit = $(this_e.setHtmlTryIt(ext.get_template('tryit'))).find('.tryit-content');
//            $tryit.find('.bn-check').click(function (e) {
//                e.preventDefault();
//                this_e.sendToConsoleCheckiO("something");
//            });
//        });

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

    }
);
