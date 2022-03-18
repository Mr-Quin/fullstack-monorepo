use test_db;
create table if not exists Users
(
    user_id    int unsigned primary key auto_increment,
    username   varchar(255) not null unique,
    created_at timestamp default current_timestamp
);

create table if not exists Videos
(
    video_id    int unsigned primary key auto_increment,
    title       varchar(255)    not null,
    description text,
    duration    int unsigned    not null,
    view_count  bigint unsigned not null default 0,
    created_at  timestamp                default current_timestamp
);

create table if not exists Banks
(
    bank_id        int unsigned primary key auto_increment,
    user_id        int unsigned,
    nickname       varchar(255)                 not null, # nickname of the payment method
    bank_name      varchar(255)                 not null,
    account_number varchar(255)                 not null,
    routing_number varchar(255)                 not null,
    type           enum ('checking', 'savings') not null,
    created_at     timestamp default current_timestamp,
    index (user_id),
    constraint foreign key (user_id) references Users (user_id) on delete set null
);

create table if not exists User_Video
(
    user_video_id int unsigned primary key auto_increment,
    user_id       int unsigned,
    video_id      int unsigned not null,
    index (user_id),
    index (video_id),
    constraint foreign key (user_id) references Users (user_id) on delete set null,
    constraint foreign key (video_id) references Videos (video_id) on delete cascade
);

create table if not exists Invoices
(
    invoice_id    int unsigned primary key auto_increment,
    username      varchar(255) not null,
    video_title   varchar(255) not null,
    user_video_id int unsigned,
    bank_id       int unsigned,
    tier          int unsigned not null default 0,
    paid_at       timestamp             default null,
    created_at    timestamp             default current_timestamp,
    unique (user_video_id),
    constraint foreign key (user_video_id) references User_Video (user_video_id) on delete set null,
    constraint foreign key (bank_id) references Banks (bank_id) on delete set null
);
