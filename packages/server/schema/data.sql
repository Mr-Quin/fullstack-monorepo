insert into Users (username) values ('creator1'), ('creator2'), ('creator3'), ('creator4'), ('creator5');

insert into Videos (title, description, duration, view_count) values
                                                                  ('sql tutorial 1', 'how to write a query', 123, 10000),
                                                                  ('sql tutorial 2', 'how to create a table', 234, 15000),
                                                                  ('sql tutorial 3', 'relational algebra', 345, 20000),
                                                                  ('the only sql tutorial you need', 'how to write an even better query', 456, 250000),
                                                                  ('sql tutorial - learn from my mistakes', 'what happens next is shocking', 567, 300000);

insert into Banks (user_id, nickname, bank_name, account_number, routing_number, type) values
                                                                                           (1, 'alpha', 'Bank of America', 856667, 072403004, 'checking'),
                                                                                           (1, 'beta', 'Bank of America', 856668, 072403004, 'savings'),
                                                                                           (2, 'delta', 'Chase', 856980, 555578925, 'checking'),
                                                                                           (3, 'foxtrot', 'Wells Fargo', 58743651, 1235487120, 'checking'),
                                                                                           (3, 'echo', 'Chase', 856667, 234908203, 'savings');

insert into User_Video (user_id, video_id) values
                                               (3, 1),
                                               (3, 2),
                                               (3, 3),
                                               (1, 4),
                                               (2, 5);

insert into Invoices (username, video_title, user_video_id, bank_id, tier, paid_at) values
                                                                                        ('creator3', 'sql tutorial 1', 1, 4, 1, '2020-02-25 16:00:00'),
                                                                                        ('creator3', 'sql tutorial 2', 2, 4, 1, '2020-02-26 16:00:03'),
                                                                                        ('creator3', 'sql tutorial 3', 3, 4, 2, '2020-02-27 16:00:01'),
                                                                                        ('creator1', 'the only sql tutorial you need', 4, 1, 2, '2020-03-25 16:00:01'),
                                                                                        ('creator2', 'sql tutorial - learn from my mistakes', 5, 3, 3, '2020-03-30 16:00:01');