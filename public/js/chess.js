// 刷新
var reload = document.getElementById('reload');
reload.onclick = function(){
	location.href = location.href;
}

// 全局变量，棋盘
var qiPan = [[0,0,0,],[0,0,0,],[0,0,0]];
// 全局变量标记
var biaoJiI = 0;
var biaoJiJ = 0;
// 记录极大极小值
var max = -999;
var min = 999;
// 画出棋盘
function huaQiPan(){
	for(var i=1;i<4;i++){
		for(var j=1;j<4;j++){
			var qiZi = document.getElementById(i+'-'+j);
			switch (qiPan[i-1][j-1])
			{
				case 1:
					qiZi.innerHTML = 'You';
					qiZi.style.color = 'lightblue';
					break;
				case -1:
					qiZi.innerHTML = "Com";
					qiZi.style.color = 'red';
					break;
				default:
					break;
			}
		}
	}
}

// 判断哪方获胜
function shuiSheng(){
	// 获取一下玩家连在一起的线的数目
	if(huoQuXian(qiPan,1)){
		return 1;
	}
	if(huoQuXian(qiPan,-1)){
		return -1;
	}
	// 如果是平局
	var pingJu = 1;
	for(var i=0;i<3;i++){
		for(var j=0;j<3;j++){
			if(qiPan[i][j] === 0){
				pingJu = 0;
			}
		}
	}
	if(pingJu){
		return 2;
	}
	return 0;
}

// 获取线
function huoQuXian(qiPan,jueSe){
	var xianShu = 0;
	var sum = 0;
	// 行
	for(var i=0;i<3;i++){
		sum = 0;
		for(var j=0;j<3;j++){
			sum += qiPan[i][j];
		}
		if(sum === jueSe*3){
			xianShu++;
		}
	}
	// 列
	for(var j=0;j<3;j++){
		sum=0;
		for(var i=0;i<3;i++){
			sum += qiPan[i][j];
		}
		if(sum === jueSe*3){
			xianShu++;
		}
	}
	// 对角线
	if(qiPan[0][0]+qiPan[1][1]+qiPan[2][2] === jueSe*3){
		xianShu++;
	}
	if(qiPan[0][2]+qiPan[1][1]+qiPan[2][0] === jueSe*3){
		xianShu++;
	}
	return xianShu;
}



// 极大极小算法
function jiDaJiXiao(shenDu){
	// value只是作为一个寻找最值的中介，关键还是min max
	var value;
	// 记录极大极小值
	if(shenDu === 2){

	}
	// 记录最大的坐标
	var maxx = 0;
	var maxy = 0;
	for(var i=0;i<3;i++){
		for(var j=0;j<3;j++){

			if(qiPan[i][j] != 0){
				// 模拟完了，返回
				if(i == 2 && j == 2){
					return [maxx,maxy];
				}
				continue;
			}


			// 模拟电脑
			if(shenDu === 2){
				qiPan[i][j] = -1;
				// 如果下到这里直接结束，那么没必要再算了，就下这
				if(huoQuXian(qiPan,-1)){
					maxx = i;
					maxy = j;
					max = 999;
					return [i,j];
				}
				// 接下来几段代码的意义是找到所有对人最有利的值，对人越有利，那个值就会越小，在这些值中选取最大的一个
				min = 999;
				jiDaJiXiao(1);
				value = min;
				if(value > max){
					max = value;
					maxx = i;
					maxy = j;
				}
				qiPan[i][j] = 0;
			}



			// 模拟人
			if(shenDu === 1){
				// 模拟人走一步棋
				qiPan[i][j] = 1;
				// 如果此时人获胜了，那么计算结果为负无穷
				if(huoQuXian(qiPan,1)){
					min = -999;
					qiPan[i][j] = 0;
					return;
				}
				// 计算数量
				value = jiSuanCha();
				if(value < min){
					min = value;
				}
				qiPan[i][j] = 0;
			}
			// 模拟完了，返回
			if(i == 2 && j == 2){
				return [maxx,maxy];
			}
		}
	}
}




// 计算电脑和人的插值
function jiSuanCha(){
	var ren = [[0,0,0],[0,0,0],[0,0,0]];
	var dianNao = [[0,0,0],[0,0,0],[0,0,0]];
	// 把所有空闲位置都填上1
	for(var i=0;i<3;i++){
		for(var j=0;j<3;j++){
			if(qiPan[i][j] === 0){
				ren[i][j] = 1;
			}else{
				ren[i][j] = qiPan[i][j];
			}
		}
	}
	// 把所有空闲位置都填上1
	for(var i=0;i<3;i++){
		for(var j=0;j<3;j++){
			if(qiPan[i][j] === 0){
				dianNao[i][j] = -1;
			}else{
				dianNao[i][j] = qiPan[i][j];
			}
		}
	}
	var dianNaoXian = huoQuXian(dianNao,-1);
	var renXian = huoQuXian(ren,1);
	return dianNaoXian - renXian;
}



// 添加点击事件
for(var i=1;i<4;i++){
	for(var j=1;j<4;j++){
		var qiZi = document.getElementById(i+'-'+j);
		qiZi.addEventListener('click',function(event){
			// 从被点击的元素的id来判断他是谁
			var i = event.target.id.split('-')[0]-1;
			var j = event.target.id.split('-')[1]-1;
			if(qiPan[i][j] != 0){
				alert('此处不能下棋');
			}else{
				qiPan[i][j] = 1;
				huaQiPan();
				// 人下了一步，看看有没有结果
				if(shuiSheng() === 1){
					alert('你赢了');
				}else if(shuiSheng() === -1){
					alert('你输了');
				}else if(shuiSheng() === 2){
					alert('平局');
				}
				// 电脑下棋
				max = -999;
				var dianNaoZou = jiDaJiXiao(2);
				// 如果电脑死棋
				if(max === -999){
					huaQiPan();
					alert('你赢了，电脑死棋');
					return;
				}
				var x = dianNaoZou[0];
				var y = dianNaoZou[1];
				qiPan[x][y] = -1;
				huaQiPan();
				// 电脑下了一步，看看有没有结果
				if(shuiSheng() === 1){
					alert('你赢了');
				}else if(shuiSheng() === -1){
					alert('你输了');
				}else if(shuiSheng() === 2){
					alert('平局');
				}
			}
		})
	}
}