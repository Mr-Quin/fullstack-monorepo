create table if not exists Users
(
    user_id    serial primary key,
    username   varchar(255) not null unique,
    created_at timestamp(0) default current_timestamp
);

create table if not exists Videos
(
    video_id    serial primary key,
    title       varchar(255)                  not null,
    description text,
    duration    int check (duration > 0)      not null,
    view_count  bigint check (view_count > 0) not null default 0,
    created_at  timestamp(0)                           default current_timestamp
);

create table if not exists Banks
(
    bank_id        serial primary key,
    user_id        int check (user_id > 0)                               references Users (user_id) on delete set null,
    nickname       varchar(255)                                          not null, -- nickname of the payment method
    bank_name      varchar(255)                                          not null,
    account_number varchar(255)                                          not null,
    routing_number varchar(255)                                          not null,
    type           varchar(255) check (type in ('checking', 'savings') ) not null,
    created_at     timestamp(0) default current_timestamp
);

create index if not exists idx_Banks_user_id on Banks (user_id);

create table if not exists User_Video
(
    user_video_id serial primary key,
    user_id       int check (user_id > 0)  references Users (user_id) on delete set null,
    video_id      int check (video_id > 0) not null references Videos (video_id) on delete cascade
);

create index if not exists idx_User_Video_user_id on User_Video (user_id);
create index if not exists idx_User_Video_video_id on User_Video (video_id);

create table if not exists Invoices
(
    invoice_id    serial primary key,
    username      varchar(255)                  not null,
    video_title   varchar(255)                  not null,
    user_video_id int check (user_video_id > 0) references User_Video (user_video_id) on delete set null,
    bank_id       int check (bank_id > 0)       references Banks (bank_id) on delete set null,
    tier          int check (tier > 0)          not null default 0,
    paid_at       timestamp(0)                           default null,
    created_at    timestamp(0)                           default current_timestamp,
    unique (user_video_id)
);