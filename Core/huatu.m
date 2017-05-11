function n = huatu()
SJ_n=xlsread('data.xlsx','TS和NS节点');
SJ_l=xlsread('data.xlsx','TS线路和NS管道');
pro = xlsread('pro.xlsx');
n=size(SJ_n,1);
l=size(SJ_l,1);
A=zeros(n,l);
for i=1:n
    for j=1:l
        if SJ_l(j,2)==i 
            A(i,j)=1;
        end
        if SJ_l(j,3)==i 
            A(i,j)=-1;
        end
    end
end

conInfo=SJ_l(:,2:3);
Lo=0;
for i=1:n
    if isnan(SJ_n(i,5))-1
        Lo=Lo+1;
        sourceInfo(Lo,1:2)=[i,1];
    end
    if isnan(SJ_n(i,4))-1
        Lo=Lo+1;
        sourceInfo(Lo,1:2)=[i,2];
    end
    if isnan(SJ_n(i,8))-1
        Lo=Lo+1;
        sourceInfo(Lo,1:2)=[i,3];
    end
end

csvwrite('conInfo.csv',conInfo);
csvwrite('sourceInfo.csv',sourceInfo); 
csvwrite('pro.csv',pro); 

end
