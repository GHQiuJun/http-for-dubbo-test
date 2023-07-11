# http-for-dubbo-test
- use http api invoke dubbo api

# 环境
- NodeJs

# Use

## Param Explain
```
host: dubbo host
port: dubbo port
service: dubbo service name
method: dubbo service method
param: dubbo service method param
```

## Example
- One param
```
curl --location --request POST 'http://localhost:3000/dubbo-test' \
--header 'Content-Type: application/json' \
--data-raw '{
    "host": "192.168.26.243",
    "port": "20882",
    "service": "CbsQuickenCardService",
    "method": "listValidQuickenTimes",
    "param": "168880613011"
}'
```
- Multi param
```
curl --location --request GET 'http://localhost:3000/dubbo-test' \
--header 'Content-Type: application/json' \
--data-raw '{
    "host": "192.168.26.243",
    "port": "20882",
    "service": "CbsQuickenCardService",
    "method": "queryRightModuleGoodsUseInfo",
    "param": "AIQIYI,C832206290000160001"
}'
```
- Multi param
```
curl --location --request GET 'http://localhost:3000/dubbo-test' \
--header 'Content-Type: application/json' \
--data-raw '{
    "host": "192.168.26.243",
    "port": "20882",
    "service": "CbsQuickenCardService",
    "method": "queryQuickenCardGoodsConfig",
    "param": {
        "class": "com.smy.cbs.dto.quickenCard.QueryQuickenCardGoodsConfigReq",
        "cardType": "ZBANK_SY061"
    }
}'
Keywords
```

## Docker Use
```
// build image 
docker build -t http-for-dubbo-test .

// run 
docker run --name http-for-dubbo-test -p 8080:3000 -d http-for-dubbo-test    
```

## Reference
- https://www.npmjs.com/package/dubbotest?activeTab=readme
