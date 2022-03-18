# use test_db;
insert into test_db.user (name)
values ('test'),
       ('test2'),
       ('test3')
on duplicate key update name = values(name);

insert into test_db.submission (title, description, duration, tags)
values ('first vid', 'Test desc', 1000, 't1,t2');

insert into user_to_submission (user_id, submission_id)
values (1, 1);
