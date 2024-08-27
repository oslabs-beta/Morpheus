\connect morpheus

CREATE TABLE dashboards(
  id serial PRIMARY KEY NOT NULL,
  name varchar NOT NULL,
  type_of integer NOT NULL,
  path varchar
);

CREATE TABLE services(
  id serial PRIMARY KEY NOT NULL,
  docker_instance_name varchar NOT NULL,
  docker_id varchar NOT NULL
);

CREATE TABLE snapshots(
  id serial PRIMARY KEY NOT NULL,
  metric_date varchar NOT NULL,
  diskSpace varchar NOT NULL,
  memory varchar NOT NULL,
  swap varchar NOT NULL,
  CPU_usage varchar NOT NULL,
  available_memory varchar NOT NULL
);

ALTER TABLE dashboards OWNER TO admin;
ALTER TABLE services OWNER TO admin;