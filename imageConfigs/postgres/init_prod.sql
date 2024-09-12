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
  id SERIAL PRIMARY KEY,
    metric_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    cpu_usage DOUBLE PRECISION,
    memory_usage DOUBLE PRECISION,
    available_memory DOUBLE PRECISION,
    network_receive_bytes DOUBLE PRECISION,
    network_transmit_bytes DOUBLE PRECISION,
    load_average DOUBLE PRECISION
);

CREATE TABLE usersettings(
    firstname varchar NOT NULL,
    lastname varchar NOT NULL,
    email varchar PRIMARY KEY NOT NULL
);
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    fetch_interval INTEGER DEFAULT 60,
    run_immediately BOOLEAN DEFAULT FALSE
);


CREATE TABLE conversation_history (
  id serial PRIMARY KEY NOT NULL,
  conversation JSONB NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE dashboards OWNER TO admin;
ALTER TABLE services OWNER TO admin;
ALTER TABLE snapshots OWNER TO admin;
ALTER TABLE usersettings OWNER to admin;
ALTER TABLE conversation_history OWNER TO admin;

INSERT INTO settings (id, fetch_interval, run_immediately)
VALUES (1, 60, FALSE)
ON CONFLICT (id) DO NOTHING;