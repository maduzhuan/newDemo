// 等待页面加载完成
window.onload = function() {
    //整个大的盒子
    var map = document.querySelector('.map'),
        // 难度选择按钮
        btns = document.querySelectorAll('.start>button'),
        //  开始界面
        start = document.querySelector('.start'),
        //  游戏界面
        planeMap = document.querySelector('.plane-map'),
        fireAll = document.querySelector('.biuall'),
        //  游戏结束界面
        end = document.querySelector('.end'),
        //  游戏积分器
        score = document.querySelector('.score'),
        //  最终得分
        endScore = document.querySelector('.end-score'),
        //  称号
        endTitle = document.querySelector('.end-title'),
        //  称号列表
        gameTitles = ['菜的抠脚！！！', '新手', '飞机小能手', '飞机歼灭者', '无敌的寂寞'],
        //  重新开始按钮
        restBtn = document.querySelector('.end>button'),
        mapLeft = map.offsetLeft,
        mapTop = map.offsetTop,
        //  内部积分器
        scoreNumber = 0,
        startMsg = true;
    fireAll.biu = fireAll.children;
    //  为难度选择按钮绑定点击事件
    for (let i = 0; i < btns.length; i++) {
        btns[i].onclick = function(ev) {
            // 游戏开始方法 并且传入游戏难度 i
            console.log(ev);
            StartGame(i + 1, {
                x: ev.clientX - mapLeft,
                y: ev.clientY - mapTop
            })
        }
    }
    //重新开始事件
    restBtn.onclick = function() {
            // 重新开始方法
            RestGame();
        }
        /** StartGame 开始游戏方法 传入游戏难度 level
         * 隐藏开始页面
         * 显示地图页
         * 调用背景动画方法 
         * 开启正在游戏状态 startMsg
         * **/
    function StartGame(level, pos) {
        startMsg = true;
        start.style.display = 'none';
        planeMap.style.display = 'block';
        score.innerText = 0;
        scoreNumber = 0;
        // 背景动画 传入游戏难度（不同的背景）
        MapBg(level)
            // score.innerText = 30000;
            // setTimeout(function(){
            //     EndGame();
            // },3000)
        newPlane(level, pos);
    }
    // 开启全屏
    function launchFullscreen(element) {

        if (element.requestFullscreen) {

            element.requestFullscreen();

        } else if (element.mozRequestFullScreen) {

            element.mozRequestFullScreen();

        } else if (element.webkitRequestFullscreen) {

            element.webkitRequestFullscreen();

        } else if (element.msRequestFullscreen) {

            element.msRequestFullscreen();

        }

    }
    /** 
     * 创建我方飞机 newPlane
     * 生成飞机
     * 做边界限定
     * 
     */
    function newPlane(level, pos) {
        // 创建飞机
        var oPlane = new Image();
        oPlane.width = 70;
        oPlane.height = 70;
        oPlane.src = 'imgs/plane_' + (level > 2 ? '1' : '0') + '.png';
        oPlane.className = 'plane';
        oPlane.style.left = pos.x - oPlane.width / 2 + "px";
        oPlane.style.top = pos.y - oPlane.height / 2 + "px";
        planeMap.appendChild(oPlane);
        // 边界值
        var leftMin = -oPlane.width / 2,
            leftMax = map.clientWidth - oPlane.width / 2,
            topMin = 0,
            topMax = map.clientHeight - oPlane.height / 2;
        // 飞机移动事件
        document.ontouchmove = function(ev) {
                var left = ev.changedTouches[0].clientX - mapLeft - oPlane.width / 2;
                var top = ev.changedTouches[0].clientY - mapTop - oPlane.height / 2;
                left = Math.max(left, leftMin);
                left = Math.min(left, leftMax);
                top = Math.max(top, topMin);
                top = Math.min(top, topMax);
                oPlane.style.left = left + 'px';
                oPlane.style.top = top + 'px';
            }
            // 生成子弹
        newFire(oPlane, level);
        console.log(score.innerText);
        newEnemy(level, oPlane);
    }
    /**
     * 生成子弹 newFire 参数 飞机对象（子弹是要跟随飞机的）
     *  */
    function newFire(objplane, level) {
        //    循环生成子弹
        planeMap.fireTime = setInterval(function() {
            // console.log(score.innerText);
            if (scoreNumber > 1500) {
                // 当分数到达1500的时候生成3颗子弹
                createBiu(true, 1);
                createBiu();
                createBiu(true, -1);
            } else if (scoreNumber > 500) {
                // 当分数到达500的时候生成2颗子弹
                createBiu(true, 1);
                createBiu(true, -1);
            } else {
                // 默认1颗子弹
                createBiu();
            }
            //    生成子弹速度 根据难度进行自动选择
        }, [150, 180, 200, 50][level - 1]);

        function createBiu(log, w) {
            var oBiu = new Image();
            oBiu.width = 30;
            oBiu.height = 30;
            oBiu.src = 'imgs/fire.png';
            oBiu.className = 'fire';
            var left = objplane.offsetLeft - oBiu.width / 2 + objplane.width / 2
            var top = objplane.offsetTop - oBiu.height + 5;
            if (log) {
                left += oBiu.width * w
            }
            oBiu.style.left = left + 'px';
            oBiu.style.top = top + 'px';

            fireAll.appendChild(oBiu);

            function FireMove() {
                // 判断子弹是否还存在
                if (oBiu.parentNode) {
                    // 每次子弹移动的步长
                    var top = oBiu.offsetTop - 10;
                    // 如果子弹超出范围，干掉他
                    if (top < -oBiu.height) {
                        // fireAll.replaceChild(oBiu);
                        oBiu.remove();
                    } else {
                        // 一直移动
                        oBiu.style.top = top + 'px';
                        requestAnimationFrame(FireMove);
                    }
                }
            }
            // 生成子弹之后进行移动
            setTimeout(function() {
                requestAnimationFrame(FireMove)
            }, 50);
        }

    }
    /**生成敌机 难度 我方飞机（碰撞测试）
     * 生成敌机根据几率生成大小飞机
     * 设置大小飞机的血量
     * 做子弹与敌机碰撞测试
     * 做飞机与敌机碰撞测试
     */
    function newEnemy(level, plane) {
        var W = map.clientWidth,
            H = map.clientHeight,
            speed = [5, 6, 7, 8][level - 1];
        var num = 1;
        planeMap.enemyTime = setInterval(function() {
            createEnemy();
        }, [300, 200, 100, 50][level - 1]);
        createEnemy();

        function createEnemy() {
            //    大小飞机的几率
            var index = num % 30 ? 1 : 0;
            // 敌军
            var enemy = new Image();
            enemy.width = [104, 54][index];
            enemy.height = [80, 40][index];
            enemy.HP = [10, 1][index];
            enemy.index = index;
            enemy.src = 'imgs/enemy_' + ['big', 'small'][index] + '.png';
            enemy.className = 'enemy_' + ['big', 'small'][index];
            enemy.style.top = -enemy.height + 'px';
            enemy.style.left = Math.floor(Math.random() * W - enemy.width / 2) + 'px';
            num++;
            planeMap.appendChild(enemy);

            function EnemyMove() {
                if (enemy.parentNode) {
                    var top = enemy.offsetTop + speed;
                    if (top > H) {

                        enemy.remove();
                        // 跑掉了
                        if (startMsg) {
                            scoreNumber--;
                            score.innerText = scoreNumber;
                        }
                    } else {
                        enemy.style.top = top + 'px';
                        // 便利所有的子弹与敌机是否碰撞
                        for (var i = 0; i < fireAll.biu.length - 1; i++) {
                            var objFire = fireAll.biu[i];
                            // 判断是否碰撞是返回true 
                            if (coll(objFire, enemy)) {
                                // 清除子弹
                                objFire.remove();
                                // 飞机血量下降1
                                enemy.HP--;
                                // 判断飞机血量是否为0
                                if (!enemy.HP) {
                                    // 执行爆炸函数
                                    boom(enemy.width, enemy.height, enemy.offsetLeft, enemy.offsetTop, enemy.index);
                                    // 删除敌机
                                    enemy.remove();
                                    // 判断游戏是否结束
                                    if (startMsg) {
                                        scoreNumber += enemy.index ? 3 : 15;
                                        score.innerText = scoreNumber;
                                    }
                                    return;
                                }
                            }
                        }
                        // 我方飞机与敌机碰撞试验
                        if (coll(enemy, plane)) {
                            enemy.remove();
                            plane.remove();
                            EndGame();
                            return;
                        }
                        // 执行动画
                        requestAnimationFrame(EnemyMove);
                    }
                }
            }
            requestAnimationFrame(EnemyMove);
        }
    }
    /**碰撞检测  coll 检测对象 obj1 obj2
     * 
     */
    function coll(obj1, obj2) {
        var t1 = obj1.offsetTop,
            b1 = t1 + obj1.clientHeight,
            l1 = obj1.offsetLeft,
            r1 = l1 + obj1.clientWidth;
        t2 = obj2.offsetTop,
            b2 = t2 + obj2.clientHeight,
            l2 = obj2.offsetLeft,
            r2 = l2 + obj2.clientWidth;

        return !(l2 > r1 || l1 > r2 || t2 > b1 || t1 > b2);
    }
    /**爆炸函数 boom 宽度 高度 左边距离 上边距离 大小飞机
     * 负责显示爆炸效果
     */
    function boom(w, h, l, t, i) {
        var oBoom = new Image();
        oBoom.src = 'imgs/boom_' + ['big', 'small'][i] + '.png';
        oBoom.className = 'boom';
        oBoom.width = w;
        oBoom.height = h;
        oBoom.style.top = t + 'px';
        oBoom.style.left = l + 'px';
        planeMap.appendChild(oBoom);
        //    显示完之后自动删除效果
        setTimeout(function() {
            oBoom.remove();
        }, 800);

    }
    /**MapBg 游戏背景动画 接收游戏难度
     *  设置对应背景
     * 进行背景动画开启
     * 
     */
    function MapBg(level) {
        map.style.backgroundImage = 'url(imgs/bg_' + level + '.jpg)';

        (function bgMove() {
            map.bgPosY = map.bgPosY || 0;
            map.bgPosY++;
            map.style.backgroundPositionY = map.bgPosY + "px";
            map.bgM = requestAnimationFrame(bgMove);
        })();
    }
    /**EndGame 游戏结束
     * 隐藏游戏界面
     * 显示游戏结束界面
     * 记录最终分数
     * 评判称号
     * 分数清零
     * 关闭正在游戏状态
     */
    function EndGame() {
        startMsg = false;
        end.style.display = 'block';
        planeMap.style.display = 'none';
        endScore.innerText = scoreNumber;
        document.onmousemove = '';
        clearInterval(planeMap.fireTime);
        clearInterval(planeMap.enemyTime)
        score.innerText = 0;
        if (scoreNumber > 10000) {
            endTitle.innerText = gameTitles[4]
        } else if (scoreNumber > 5000) {
            endTitle.innerText = gameTitles[3]
        } else if (scoreNumber > 2800) {
            endTitle.innerText = gameTitles[2]
        } else if (scoreNumber > 500) {
            endTitle.innerText = gameTitles[1]
        } else if (scoreNumber > 300) {
            endTitle.innerText = gameTitles[0]
        }
    }

    /**RestGame 重新开始
     * 关闭背景移动
     * 隐藏游戏结束界面
     * 显示游戏开始界面
     */
    function RestGame() {
        cancelAnimationFrame(map.bgM);
        end.style.display = 'none';
        start.style.display = 'block';
    }
}