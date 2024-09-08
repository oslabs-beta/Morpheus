import os
import requests
import psycopg2
import time
from datetime import datetime
import logging

# Set up logging
log_level = os.environ.get('LOG_LEVEL', 'INFO').upper()
logging.basicConfig(level=log_level, format='%(asctime)s - %(levelname)s - [%(name)s] - %(message)s')
logger = logging.getLogger('prometheus-to-postgres')

# Use environment variables for connection details
PROMETHEUS_URL = os.environ.get('PROMETHEUS_URL', 'http://prometheus:9090')
POSTGRES_HOST = os.environ.get('POSTGRES_HOST', 'postgres')
POSTGRES_PORT = os.environ.get('POSTGRES_PORT', '5432')
POSTGRES_DB = os.environ.get('POSTGRES_DB', 'morpheus')
POSTGRES_USER = os.environ.get('POSTGRES_USER', 'admin')
POSTGRES_PASSWORD = os.environ.get('POSTGRES_PASSWORD', 'admin')

POSTGRES_CONN = f"dbname={POSTGRES_DB} user={POSTGRES_USER} password={POSTGRES_PASSWORD} host={POSTGRES_HOST} port={POSTGRES_PORT}"

# SQL query to insert metrics
INSERT_METRIC_QUERY = """
INSERT INTO snapshots (metric_date, diskSpace, memory, swap, CPU_usage, available_memory)
VALUES (%s, %s, %s, %s, %s, %s)
"""

# Function to get metrics from Prometheus
def get_metrics():
    metrics = {}
    queries = [
        ('CPU_usage', 'sum(rate(container_cpu_usage_seconds_total{name=~".+"}[5m])) by (name) * 100'),
        ('memory', 'container_memory_usage_bytes{name=~".+"}'),
        ('diskSpace', 'container_fs_usage_bytes{name=~".+"}'),
        ('swap', 'container_memory_swap{name=~".+"}'),
        ('available_memory', 'node_memory_MemAvailable_bytes')
    ]

    for metric_name, query in queries:
        response = requests.get(f"{PROMETHEUS_URL}/api/v1/query", params={"query": query})
        data = response.json()
        if data['status'] == 'success' and data['data']['result']:
            if metric_name == 'available_memory':
                metrics[metric_name] = float(data['data']['result'][0]['value'][1])
            else:
                metrics[metric_name] = sum(float(result['value'][1]) for result in data['data']['result'])
        else:
            logging.warning(f"Failed to fetch {metric_name} metric")

    return metrics

# Function to insert metrics into PostgreSQL
def insert_metrics(metrics):
    try:
        with psycopg2.connect(POSTGRES_CONN) as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    INSERT_METRIC_QUERY,
                    (
                        datetime.now().isoformat(),
                        metrics.get('diskSpace', '0'),
                        metrics.get('memory', '0'),
                        metrics.get('swap', '0'),
                        metrics.get('CPU_usage', '0'),
                        metrics.get('available_memory', '0')
                    )
                )
        logging.info("Metrics inserted successfully")
    except Exception as e:
        logging.error(f"Failed to insert metrics: {str(e)}")

# Main loop to fetch and store metrics
def main():
    logger.info("Starting Prometheus to Postgres script")
    logger.info(f"Prometheus URL: {PROMETHEUS_URL}")
    logger.info(f"Postgres connection: {POSTGRES_CONN}")
    
    while True:
        try:
            logger.info("Attempting to fetch metrics...")
            metrics = get_metrics()
            logger.info(f"Fetched metrics: {metrics}")
            insert_metrics(metrics)
            logger.info("Metrics successfully inserted")
        except Exception as e:
            logger.exception(f"An error occurred: {str(e)}")
        logger.info("Waiting for 60 seconds before next iteration")
        time.sleep(60)

if __name__ == "__main__":
    main()