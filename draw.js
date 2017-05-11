function getNode(num, sourceInfo){
	var unit = 2*3.1415926/num;
	var data = [];
	var str = "节点";
	for (var key=0;key<num;key++){
		var name = str + String(key+1);
		var xPos = 600 + 300*Math.cos(unit * key);
		var yPos = 400 + 300*Math.sin(unit * key);
		var json = {name:name,x:xPos,y:yPos};
		data.push(json);
	}
	for(key in sourceInfo){
		if(sourceInfo[key][1] == 1){
			str = "发电机";
			color = "#8F4586";
		}else if (sourceInfo[key][1] == 2){
					str = "风电";
					color = "blue";
				}else{
					str = "气源";
					color = "green";
				}
		var index = sourceInfo[key][0];
		var name = str + String(index);
		var xPos = 600 + 400*Math.cos(unit * ((sourceInfo[key][0]-1)+0.2*(sourceInfo[key][1]-2)));
		var yPos = 400 + 400*Math.sin(unit * ((sourceInfo[key][0]-1)+0.2*(sourceInfo[key][1]-2)));
		var json = {name:name,x:xPos,y:yPos,symbolSize:50,itemStyle:{normal:{color:color}}};
		data.push(json);
	}
	//console.log(data);
	return data;
}
function getConnection(conInfo,sourceInfo){
	var str = "节点";
	var data = [];
	for (key in conInfo){
		var name1 = str + String(conInfo[key][0]);
		var name2 = str + String(conInfo[key][1]);
		var json = {source: name1, target: name2,
					lineStyle: {
						normal: { curveness: 0.1 ,color:'#95CACA'}
								}
					};
		data.push(json);
	}
	for (key in conInfo){
		var name1 = str + String(conInfo[key][1]);
		var name2 = str + String(conInfo[key][0]);
		var json = {source: name1, target: name2,
					lineStyle: {
						normal: { curveness: 0.1 ,color:'#79FF79'}
								}
					};
		data.push(json);
	}
	for (key in sourceInfo){
		var str = "节点";
		var color;
		var name1 = str + String(sourceInfo[key][0]);
		if(sourceInfo[key][1] == 1){
			str = "发电机";
			color = '#95CACA';
		}
		if (sourceInfo[key][1] == 2){
			str = "风电";
			color = '#95CACA';
		}
		if (sourceInfo[key][1] == 3){
			str = "气源";
			color = '#79FF79';
		}
		var name2 = str + String(sourceInfo[key][0]);
		var json = {source: name1, target: name2,
					lineStyle: {
						normal: { curveness: 0 ,color:color}
								}
					};
		data.push(json);
	}
	//console.log(data);
	return data;

}

// 指定图表的配置项和数据
function getOption(data,links){
option = {
	title: {
		text: '电力设施简图'
	},
	tooltip: {trigger:'none'},
	animationDurationUpdate: 1500,
	animationEasingUpdate: 'quinticInOut',
	series : [
		{
			type: 'graph',
			layout: 'none',
			symbolSize: 50,
			roam: true,
			label: {
				normal: {
					show: true
				}
			},
			edgeSymbol: ['circle'],
			edgeSymbolSize: [5, 5],
			edgeLabel: {
				normal: {
					textStyle: {
						fontSize: 20
					}
				}
			},
			data:data,
			// links: [],
			links: links,
			lineStyle: {
				normal: {
					opacity: 0.9,
					width: 3
				}
			}
		}
	]
};
	return option;
}

function openFileWin(){ 
	window.open("./fileUp.html","newwindow","height=200,width=500,toolbar=no,menubar=no,scrollbars=no,resizable=no, location=no,status=no") ;
} 

function setTable(tableData,data){
	$('#myTable').dataTable( {
		"dom": '<"top">t<"bottom"><"clear"iflp>',
        "data": tableData,
		"autoWidth": false,
		"scrollX": false,
		 "info": false,
		 "paging": false,
		 "jQueryUI": true,
		 "scrollY": 200,
         "scrollCollapse": true,
		 "hover":true,
		 "destroy": true,
		 "searching": false,
        "columns": [
            { "title": "情形","width":"50px" },
            { "title": "投资成本" ,"width":"80px"},
            { "title": "运行成本" ,"width":"50px"},
			{ "title": "能源短缺成本" ,"width":"50px"},
			{ "title": "总成本" ,"width":"90px"},
        ]
    } );
	$("#myTable tr").hover(function(){
    $(this).css("background-color","#81C0C0");
    },function(){
    $(this).css("background-color","white");
	});
	$("#myTable tr").click(function(){
		var index = $(this).children(1)[0].innerHTML-1;
		var params = {type:'0'};
		$.ajax({
			url:'./graph.php',
			type:'post',
			dataType:'json',
			data: params,
			success:function(data){
				drawSand(data,index);
			},
			error: function(){
				alert("系统繁忙请稍候");
			}
		});	
    });
}

function showTable(data){
	console.log(data);	
	for (key in data){
		keys = Number(key)+1;
		data[key].unshift(keys);
		console.log(data[key]);
	}	
	setTable(data);
}	

function drawSand(data,rank){
	var picData = new Array();
	for(key in data[4][rank]){
		var dataset = data[4][rank][key];
		var datatemp = [dataset[1],dataset[2],dataset[3],dataset[0]];
		picData.push(datatemp);
	}
	console.log(picData);
	option = {
		backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
			offset: 0,
			color: '#ffffff'
		}, {
			offset: 1,
			color: '#ffffff'
		}]),
		title: {
			text: '情形'+(rank+1)+'详细规划结果'
		},
		xAxis: {
			name: '支路',
			splitLine: {
				lineStyle: {
					type: 'dashed'
				}
			}
		},
		yAxis: {
			name: '规划年',
			splitLine: {
				lineStyle: {
					type: 'dashed'
				}
			},
			scale: true
		},
		series: [{
			data: picData,
			type: 'scatter',
			symbolSize: function (data) {
				return Math.sqrt(data[2])*15;
			},
			label: {
				emphasis: {
					show: true,
					formatter: function (param) {
						return param.data[3] + '  '+ param.data[2];
					},
					position: 'top'
				},
				normal:{
					textStyle:{
						color:'#000000'
					}
				}
			},
			itemStyle: {
				normal: {
					shadowBlur: 10,
					shadowColor: '#81C0C0',
					shadowOffsetY: 5,
					color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
						offset: 0,
						color: '#81C0C0'
					}, {
						offset: 1,
						color: '#81C0C0'
					}])
				}
			}
		}]
	};
	chart2.setOption(option);
}
var myChart = echarts.init(document.getElementById('main'));
var chart2 = echarts.init(document.getElementById('ext'));	
var initData = [[0,0,0,0]];
var dataGol = [];
$(function(){
	$( "#up,#send,#fox").button();
	showTable(initData);
	$("#send").click(function(){
		var params = {type:'1'};
		$.ajax({
			url:'./graph.php',
			type:'post',
			dataType:'json',
			data: params,
			success:function(data){
				console.log(data);
				num = data[0]
				conInfo = data[1];
				sourceInfo = data[2];
				//tableData = data[3];
				//showTable(tableData);
				data = getNode(num,sourceInfo);
				links = getConnection(conInfo,sourceInfo);
				option = getOption(data,links);
				myChart.setOption(option);
				
			},
			error: function(){
				alert("系统繁忙请稍候");
			}
		});
	});
	$("#fox").click(function(){
		var params = {type:'1'};
		$.ajax({
			url:'./graph.php',
			type:'post',
			dataType:'json',
			data: params,
			success:function(data){
				tableData = data[3];
				dataGol = data
				showTable(tableData ,dataGol);
			},
			error: function(){
				alert("系统繁忙请稍候");
			}
		});
	});
	$("#up").click(function(){
		openFileWin();
	});
});