alter table game_config add column selfOpenEnable tinyint not null default 1 comment '1 自营 2 平台';
alter table game_config add column isShow tinyint not null default 1 comment '1 上架 -1 下架';

alter table money_out add column checkStatus tinyint default 0 comment '0 待处理 1 拒绝 2 确认';
alter table money_out add column checkUser varchar(100) default '' comment '风控审核人';
alter table money_out add column checkTime datetime comment '风控审核操作时间';

