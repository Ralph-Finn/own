<?php
# $commandBt="C:/Users/Ralph/desktop/test/for_testing/test.exe";
#　exec($commandBt);
set_time_limit(0);
date_default_timezone_set('Asia/ShangHai');
require_once './PHPExcel/Classes/PHPExcel/IOFactory.php';  #此处为引用的头文件
$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
$con=socket_connect($socket,'127.0.0.1',4003);
if(!$con){socket_close($socket);exit;}	
$a = 0;
while($con){
        $words=$_POST['type'];
        socket_write($socket,$words);
		$a = $a + 1;
        if($a==1000){break;}
}
$hear=socket_read($socket,1024);
socket_shutdown($socket);
$hear = $hear - 0;
getData($hear);

function readCSV($name){
	$file = fopen($name,'r');
	$dataset = array();		
	while ($row = fgetcsv($file)) {
		$dataset[] = $row;
	}
	return $dataset;
}

function readExcle($name,$rank){
$reader = PHPExcel_IOFactory::createReader('Excel5'); //设置以Excel5格式(Excel97-2003工作簿)
$PHPExcel = $reader->load($name); // 载入excel文件
$data = array();
$sheet = $PHPExcel->getSheet($rank); // 读取第n個工作表
$highestRow = $sheet->getHighestRow(); // 取得总行数
$highestColumm = $sheet->getHighestColumn(); // 取得总列数
/** 循环读取每个单元格的数据 */
for ($row = 1; $row <= $highestRow; $row++){//行数是以第1行开始
	for ($column = 'A'; $column <= $highestColumm; $column++) {//列数是以A列开始
		$dataset[$row][] = $sheet->getCell($column.$row)->getValue();
		#echo $column.$row.":".$sheet->getCell($column.$row)->getValue()."<br />";
	}
}
return $dataset;
}

function readExcleLoop($name,$num){
	$dataset = array();
	for($i=0;$i<$num;$i++){
		$dataset[] = readExcle($name, $i);
	}
	return $dataset;
}
function getData($hear){
	$data = array();
	$data[] = $hear;
	$data[] = readCSV('./Core/conInfo.csv');
	$data[] = readCSV('./Core/sourceInfo.csv');
	$data[] = readCSV('./Core/pro.csv');
	$data[] = readExcleLoop('./Core/data_picture.xls',4);
	echo json_encode($data);
}
?>