# set -x
tables=(pay_item)

# iterate the tables in reverse order
for (( idx=${#tables[@]}-1 ; idx >=0; idx-- )) ;
do
    var=${tables[idx]}
    echo $var
    psql -U mo_tse -h 139.199.112.199 \
        -p 5432 -d old -c "DROP TABLE $var cascade"
done


for var in "${tables[@]}" ;
do
    echo $var
    pg_dump -U chaomeng -h chaomeng-bussiness.cdl8ar96w1hm.rds.cn-north-1.amazonaws.com.cn \
        -p 4444 -d chaomeng_bussiness -Ft -t $var | \
        pg_restore -U mo_tse -h 139.199.112.199 \
        -p 5432 -d old
done
