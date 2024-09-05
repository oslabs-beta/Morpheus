import requests
import psycopg2
import time
from datetime import datetime

# Prometheus and PostgreSQL connection details
PROMETHEUS_URL = "http://localhost:50002"  # Based on the PROMETHEUS_URL in the codebase
POSTGRES_CONN = "dbname=morpheus user=admin password=admin host=localhost port=50005"  # Based on the postgres configuration in docker-compose-morpheus.yaml

# SQL query to insert metrics
INSERT_METRIC_QUERY = """
INSERT INTO snapshots (metric_date, diskSpace, memory, swap, CPU_usage, available_memory)
VALUES (%s, %s, %s, %s, %s, %s)
"""

# Function to get metrics from Prometheus
def get_metrics():
    metrics = {}
    queries = [
        ('CPU_usage', 'sum(rate(container_cpu_usage_seconds_total{name=~".+"}[5m])) by (name)'),
        ('memory', 'sum(container_memory_usage_bytes{name=~".+"}) by (name)'),
        ('diskSpace', 'sum(container_fs_usage_bytes{name=~".+"}) by (name)'),
        ('swap', 'sum(container_memory_swap{name=~".+"}) by (name)'),
        ('available_memory', 'node_memory_MemAvailable_bytes')
    ]
    
    for metric_name, query in queries:
        response = requests.get(f"{PROMETHEUS_URL}/api/v1/query", params={"query": query})
        data = response.json()
        if data['status'] == 'success' and data['data']['result']:
            metrics[metric_name] = data['data']['result'][0]['value'][1]
    
    return metrics

# Function to insert metrics into PostgreSQL
def insert_metrics(metrics):
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

# Main loop to fetch and store metrics
def main():
    while True:
        try:
            metrics = get_metrics()
            insert_metrics(metrics)
            print(f"Metrics inserted at {datetime.now()}")
        except Exception as e:
            print(f"Error occurred: {e}")
        
        time.sleep(300)  # Run every 5 minutes

if __name__ == "__main__":
    main()