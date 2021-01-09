(function() {
    alert("Nasıl Oynanır?\nOyuncu 1 yönlendirme için W-S tuşlarını kullanır.\nOyuncu 2 yönlendirme için yön tuşlarını kullanır.");

    var CSS = {
        arena: {
            width: 900,
            height: 600,
            background: '#62247B',
            position: 'fixed',
            top: '50%',
            left: '50%',
            zIndex: '999',
            transform: 'translate(-50%, -50%)'
        },
        ball: {
            width: 15,
            height: 15,
            position: 'absolute',
            top: 0,
            left: 350,
            borderRadius: 50,
            background: '#C6A62F'
        },
        line: {
            width: 0,
            height: 600,
            borderLeft: '2px dashed #C6A62F',
            position: 'absolute',
            top: 0,
            left: '50%'
        },
        stick: {
            width: 12,
            height: 85,
            position: 'absolute',
            background: '#C6A62F'
        },
        stick1: {
            left: 50,
            top: (600 - 85) / 2,
        },
        stick2: {
            left: 850,
            top: (600 - 85) / 2,
        },
        score1: {
            left: 350,
            top: 100,
            position: 'absolute',
            cursor: 'default',
            userSelect: 'none',
            fontSize: '48px',
        },
        score2: {
            left: 525,
            top: 100,
            position: 'absolute',
            cursor: 'default',
            userSelect: 'none',
            fontSize: '48px',
        },
    };

    var CONSTS = {
        gameSpeed: 20,
        score1: 0,
        score2: 0,
        stick1Speed: 0,
        stick2Speed: 0,
        ballTopSpeed: 0,
        ballLeftSpeed: 0
    };

    function start() {
        draw();
        setEventsP1();
        setEventsP2();
        roll();
        loop();
    }

    function draw() {
        $('<div/>', { id: 'pong-game' }).css(CSS.arena).appendTo('body');
        $('<div/>', { id: 'pong-line' }).css(CSS.line).appendTo('#pong-game');
        $('<div/>', { id: 'pong-ball' }).css(CSS.ball).appendTo('#pong-game');
        $('<div/>', { id: 'stick-1' }).css($.extend(CSS.stick1, CSS.stick))
            .appendTo('#pong-game');
        $('<div/>', { id: 'stick-2' }).css($.extend(CSS.stick2, CSS.stick))
            .appendTo('#pong-game');
        $('<span/>', { id: 'player-score-1', text: CONSTS.score1 }).css(CSS.score1)
            .appendTo('#pong-game');
        $('<span/>', { id: 'player-score-2', text: CONSTS.score2 }).css(CSS.score2)
            .appendTo('#pong-game');
    }

    function setEventsP1() {
        $(document).on("keydown", function(e) {
            if (e.keyCode == 87) {
                if (CSS.stick1.top < 0) {
                    CONSTS.stick1Speed = 0;
                    CSS.stick1.top = 0;
                } else {
                    if (CSS.stick1.top > 0)
                        CONSTS.stick1Speed = -5;
                    else
                        CONSTS.stick1Speed = 0;
                }
            }

            if (e.keyCode == 83) {
                if (CSS.stick1.top < CSS.arena.height - CSS.stick.height)
                    CONSTS.stick1Speed = 5;
                else {
                    CONSTS.stick1Speed = 0;
                    CSS.stick1.top = CSS.arena.height - CSS.stick.height;
                }
            }


        });

        $(document).on('keyup', function(e) {
            CONSTS.stick1Speed = 0;
            if (CSS.stick1.top < 0)
                CSS.stick1.top = 0;
            if (CSS.stick1.top > CSS.arena.height - CSS.stick.height)
                CSS.stick1.top = CSS.arena.height - CSS.stick.height;
        });
    }

    function setEventsP2() {
        $(document).on("keydown", function(e) {
            if (e.keyCode == 38) {
                if (CSS.stick2.top < 0) {
                    CONSTS.stick2Speed = 0;
                    CSS.stick2.top = 0;
                } else {
                    if (CSS.stick2.top > 0)
                        CONSTS.stick2Speed = -5;
                    else
                        CONSTS.stick2Speed = 0;
                }
            }
            if (e.keyCode == 40) {
                if (CSS.stick2.top < CSS.arena.height - CSS.stick.height)
                    CONSTS.stick2Speed = 5;
                else {
                    CONSTS.stick2Speed = 0;
                    CSS.stick2.top = CSS.arena.height - CSS.stick.height;
                }
            }
        });

        $(document).on("keyup", function(e) {
            CONSTS.stick2Speed = 0;
            if (CSS.stick2.top < 0)
                CSS.stick2.top = 0;
            if (CSS.stick2.top > CSS.arena.height - CSS.stick.height)
                CSS.stick2.top = CSS.arena.height - CSS.stick.height;
        });
    }

    function loop() {
        window.pongLoop = setInterval(function() {
            CSS.stick1.top += CONSTS.stick1Speed;
            $('#stick-1').css('top', CSS.stick1.top);

            CSS.stick2.top += CONSTS.stick2Speed;
            $('#stick-2').css('top', CSS.stick2.top);

            CSS.ball.top += CONSTS.ballTopSpeed;
            CSS.ball.left += CONSTS.ballLeftSpeed;

            if (CSS.ball.top <= 0 ||
                CSS.ball.top >= CSS.arena.height - CSS.ball.height) {
                CONSTS.ballTopSpeed = CONSTS.ballTopSpeed * -1.01;
            }

            $('#pong-ball').css({ top: CSS.ball.top, left: CSS.ball.left });

            if (CSS.ball.left <= CSS.stick.width) {
                CSS.ball.top > CSS.stick1.top && CSS.ball.top < CSS.stick1.top + CSS.stick.height && (CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1) || roll();
            }

            if (CSS.ball.left <= CSS.stick1.left + 7 &&
                CSS.ball.top >= CSS.stick1.top &&
                CSS.ball.top <= CSS.stick1.top + 85
            ) {
                CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1;
            }

            if (CSS.ball.left >= CSS.stick2.left - 10 &&
                CSS.ball.top >= CSS.stick2.top &&
                CSS.ball.top <= CSS.stick2.top + 85) {
                CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1;
            }

            if (CSS.ball.left >= CSS.arena.width - CSS.ball.width - CSS.stick.width) {
                roll();
            }
        }, CONSTS.gameSpeed);
    }

    function roll() {
        if (CSS.ball.left <= CSS.stick.width) {
            CONSTS.score2 += 1;
            $("#player-score-2").text(CONSTS.score2);
            if (CONSTS.score2 == 5) {
                alert("Oyuncu 2 kazandı, oyun yeniden başlayacak.");
                location.reload();
            }
        }
        if (CSS.ball.left >= CSS.arena.width - CSS.ball.width - CSS.stick.width) {
            CONSTS.score1 += 1;
            $("#player-score-1").text(CONSTS.score1);
            if (CONSTS.score1 == 5) {
                alert("Oyuncu 1 kazandı, oyun yeniden başlayacak.");
                location.reload();
            }
        }

        CSS.ball.top = 250;
        CSS.ball.left = 350;

        var side = -1;

        if (Math.random() < 0.5) {
            side = 1;
        }

        CONSTS.ballTopSpeed = Math.random() * -2 - 3;
        CONSTS.ballLeftSpeed = side * (Math.random() * 2 + 3);
    }

    start();
})();