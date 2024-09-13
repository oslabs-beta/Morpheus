import os
import requests
import psycopg2.pool
import time
from datetime import datetime
import logging

# Set up logging
log_level = os.environ.get('LOG_LEVEL', 'INFO').upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(levelname)s - [%(name)s] - %(message)s')
logger = logging.getLogger('prometheus-to-postgres')

# Environment variables for connection details
PROMETHEUS_URL = os.environ.get('PROMETHEUS_URL', 'http://prometheus:9090')
POSTGRES_HOST = os.environ.get('POSTGRES_HOST', 'postgres')
POSTGRES_PORT = os.environ.get('POSTGRES_PORT', '5432')
POSTGRES_DB = os.environ.get('POSTGRES_DB', 'morpheus')
POSTGRES_USER = os.environ.get('POSTGRES_USER', 'admin')
POSTGRES_PASSWORD = os.environ.get('POSTGRES_PASSWORD', 'admin')

POSTGRES_CONN = (
    f"dbname={POSTGRES_DB} "
    f"user={POSTGRES_USER} "
    f"password={POSTGRES_PASSWORD} "
    f"host={POSTGRES_HOST} "
    f"port={POSTGRES_PORT}"
)

# SQL queries
INSERT_METRIC_QUERY = """
INSERT INTO snapshots (
    metric_date,
    cpu_usage,
    memory_usage,
    available_memory,
    total_memory,
    network_receive_bytes,
    network_transmit_bytes,
    load_average
)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
"""
GET_SETTINGS_QUERY = """
SELECT fetch_interval, run_immediately FROM settings WHERE id = 1
"""
UPDATE_RUN_IMMEDIATELY_QUERY = """
UPDATE settings SET run_immediately = FALSE WHERE id = 1
"""

# Database connection pool with retry logic
max_retries = 5
retry_delay = 5

for attempt in range(max_retries):
    try:
        connection_pool = psycopg2.pool.SimpleConnectionPool(1, 20, dsn=POSTGRES_CONN)
        logger.info("Successfully connected to the database")
        break
    except psycopg2.OperationalError as e:
        if attempt < max_retries - 1:
            logger.warning(f"Failed to connect to the database. Retrying in {retry_delay} seconds...")
            time.sleep(retry_delay)
        else:
            logger.error("Failed to connect to the database after multiple attempts")
            raise

# Function to get metrics from Prometheus
def get_metrics():
    metrics = {}
    queries = {
        'cpu_usage': '100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)',
        'memory_usage': 'sum(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes)',
        'available_memory': 'sum(node_memory_MemAvailable_bytes)',
        'total_memory': 'sum(node_memory_MemTotal_bytes)',
        'network_receive_bytes': 'sum(rate(node_network_receive_bytes_total[5m]))',
        'network_transmit_bytes': 'sum(rate(node_network_transmit_bytes_total[5m]))',
        'load_average': 'avg(node_load1)',
    }

    try:
        for metric_name, query in queries.items():
            response = requests.get(f"{PROMETHEUS_URL}/api/v1/query", params={"query": query})
            data = response.json()
            if data['status'] == 'success' and data['data']['result']:
                # Extract the single value
                value = float(data['data']['result'][0]['value'][1])
                metrics[metric_name] = value
            else:
                logging.warning(f"Failed to fetch {metric_name} metric")
                metrics[metric_name] = None
    except Exception as e:
        logging.error(f"Error fetching metrics from Prometheus: {e}")
        raise

    return metrics


# Function to insert metrics into PostgreSQL
def insert_metrics(metrics):
    conn = None
    try:
        conn = connection_pool.getconn()
        with conn.cursor() as cursor:
            cursor.execute(
                INSERT_METRIC_QUERY,
                (
                    datetime.now(),
                    metrics.get('cpu_usage') or 0,
                    metrics.get('memory_usage') or 0,
                    metrics.get('available_memory') or 0,
                    metrics.get('total_memory') or 0,
                    metrics.get('network_receive_bytes') or 0,
                    metrics.get('network_transmit_bytes') or 0,
                    metrics.get('load_average') or 0,
                )
            )
        conn.commit()
        logging.info("Metrics inserted successfully")
    except Exception as e:
        logging.error(f"Failed to insert metrics: {str(e)}")
    finally:
        if conn:
            connection_pool.putconn(conn)

# Function to get settings from PostgreSQL
def get_settings():
    conn = None
    try:
        conn = connection_pool.getconn()
        with conn.cursor() as cursor:
            cursor.execute(GET_SETTINGS_QUERY)
            result = cursor.fetchone()
            if result:
                fetch_interval, run_immediately = result
                return fetch_interval, run_immediately
            else:
                return 60, False  # Default values
    except Exception as e:
        logger.error(f"Failed to fetch settings: {e}")
        return 60, False
    finally:
        if conn:
            connection_pool.putconn(conn)

# Function to reset the run_immediately flag
def reset_run_immediately():
    conn = None
    try:
        conn = connection_pool.getconn()
        with conn.cursor() as cursor:
            cursor.execute(UPDATE_RUN_IMMEDIATELY_QUERY)
        conn.commit()
    except Exception as e:
        logger.error(f"Failed to reset run_immediately flag: {e}")
    finally:
        if conn:
            connection_pool.putconn(conn)

# Main loop to fetch and store metrics
def main():
    logger.info("Starting Prometheus to Postgres script")
    logger.info(f"Prometheus URL: {PROMETHEUS_URL}")
    logger.info(f"Postgres connection: {POSTGRES_CONN}")
    
    last_run_time = time.time()
    
    while True:
        try:
            fetch_interval, run_immediately = get_settings()
            current_time = time.time()
            
            if run_immediately or current_time - last_run_time >= fetch_interval:
                logger.info("Fetching metrics from Prometheus...")
                metrics = get_metrics()
                logger.info(f"Fetched metrics: {metrics}")
                insert_metrics(metrics)
                logger.info("Metrics inserted into PostgreSQL")
                last_run_time = current_time

                if run_immediately:
                    reset_run_immediately()
            else:
                time.sleep(1)
        except Exception as e:
            logger.exception(f"An error occurred: {str(e)}")
            time.sleep(5)

if __name__ == "__main__":
    main()
