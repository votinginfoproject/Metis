alter table early_vote_sites add constraint early_vote_site_election_id_fk foreign key (election_id) references elections (id) on delete cascade;
alter table schedules add constraint schedule_election_id_fk foreign key (election_id) references elections (id) on delete cascade;
alter table assignments add constraint assignment_early_vote_site_id_fk foreign key (early_vote_site_id) references early_vote_sites (id) on delete cascade;
alter table assignments add constraint assignment_schedule_id_fk foreign key (schedule_id) references schedules (id) on delete cascade;
