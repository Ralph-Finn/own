clear;
clc;
while(1)
tong=tcpip('localhost', 4003, 'NetworkRole', 'server');% ����tcp����,��������4002�˿�
fopen(tong);  % ��tcpͨ������û����ҳ���󣬸�ģ�齫��������
mess = 'start connection'
cmd = '0';
try
    data = fread(tong,512);%����buff�е���Ϣ��
    %data = fscanf(tong,'%f',[1,512])
    cmd = data(1);
catch
    cmd = '0';
end
cmd
%data =fread(t,50);
if cmd == '1'
    %�ڴ�ע�ʹ�д��Ҫ�ļ������ĺ���%
    num = huatu();
    mess = 'Graph success' 
     fprintf(tong,int2str(num)); 
end
if cmd == '0'
    fprintf(tong,cmd); %��ʾ�������н��������ظ�client������
end
cmd = '0';
pause(1);
end