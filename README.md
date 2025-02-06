# TG Bot Scraper

## Build

```
docker build -t scraper -f ./backend/Dockerfile ./backend
```

## Deploy

配置docker-compose.yaml
``` yaml
NOSTR_PRIV_KEY: nsec1ufnus6pju578ste3v90xd5m2decpuzpql2295m3sknqcjzyys9ls0qlc85 #nostr私钥
NOSTR_RELAY_URIS: wss://relay.damus.io,wss://relay.atoms.io #nostr relay uri，逗号分隔
```
配置bot/packages/telegram/dockerfile中的**TELEGRAM_BOT_TOKEN**
``` 
ENV TELEGRAM_BOT_TOKEN=7926431835:AAEjbScqFyl9W6Qu907xOfoGkZ8EKFpvJgM
```
启动
```
docker compose up -d
```

## API
### Add Message

插入消息

**POST**

/api/add_message

``` JSON
{
    "group_id":"", 
    "user_id":"",
    "username":"",
    "message":""
}
```

### GetMessageCnt
查询群组消息数
#### 请求

**POST**

/api/get_message_cnt

``` JSON
{
    "group_id":""
}
```
#### 返回
```JSON
{
    "user_msg_cnt": [
        {
            "user_id": "bob001",
            "cnt": 2 //用户在群组内消息总数
        },
        {
            "user_id": "alice001",
            "cnt": 3
        }
    ],
    "group_cnt": 5 //群组消息总数
}
```
### GetMessageByUser
分页查询指定成员在指定群组的发言记录
#### 请求

**POST**

/api/get_message_by_user

``` JSON
{
    "group_id":"1001",
    "user_id":"bob001",
    "page_num":1,
    "page_size":100
}
```
#### 返回
``` JSON
{
    "user_id": "bob001",
    "messages": [
        {
            "group_id": "1001",
            "user_id": "bob001",
            "username": "bob",
            "message": "this this 99ckolo 222",
            "timestamp": "Sun, 26 Jan 2025 05:35:47 -0000"
        },
        {
            "id": 1,
            "group_id": "1001",
            "user_id": "bob001",
            "username": "bob",
            "message": "this this 99ckolo 111",
            "timestamp": "Sun, 26 Jan 2025 05:35:43 -0000"
        }
    ],
    "cnt": 2 //用户在群组内消息总数
}
```
### GetMessageCntByUser
POST /api/get_message_cnt_by_user
#### 请求
``` JSON
{
    "group_id":"1001",
    "user_id":"bob001"
}
```
#### 返回
``` JSON
{
    "user_id": "bob001",
    "cnt": 2 //用户在群组内消息总数
}
```