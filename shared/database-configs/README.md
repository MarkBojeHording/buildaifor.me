# Database Configurations

## Overview
This is a comprehensive database configuration system that provides standardized database setups, connection management, and migration tools for all BuildAIFor.Me services. It supports multiple database types and provides automated deployment and management capabilities.

## Features

### Core Functionality
- **Multi-Database Support**: PostgreSQL, MySQL, MongoDB, Redis configurations
- **Connection Management**: Connection pooling and failover handling
- **Migration Tools**: Automated database migrations and versioning
- **Backup and Recovery**: Automated backup strategies and recovery procedures
- **Performance Optimization**: Query optimization and indexing strategies

### Configuration Capabilities
- **Environment-Specific Configs**: Development, staging, and production setups
- **Scalable Architectures**: Master-slave, read replicas, and clustering
- **Security Configurations**: SSL, encryption, and access control
- **Monitoring Integration**: Performance monitoring and alerting
- **Automated Deployment**: Infrastructure as Code (IaC) templates

## Technology Stack

### Database Systems
- **PostgreSQL**: Primary relational database
- **MySQL**: Alternative relational database
- **MongoDB**: Document database
- **Redis**: In-memory cache and session store
- **Elasticsearch**: Search and analytics engine

### Infrastructure
- **Docker**: Containerized database deployments
- **Kubernetes**: Database orchestration
- **Terraform**: Infrastructure provisioning
- **Ansible**: Configuration management

### Monitoring
- **Prometheus**: Metrics collection
- **Grafana**: Database dashboards
- **pgAdmin**: PostgreSQL administration
- **MongoDB Compass**: MongoDB administration

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Kubernetes cluster (optional)
- Terraform (optional for cloud deployment)

### Installation
```bash
# Clone the database configurations
cd shared/database-configs

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start local development databases
docker-compose up -d

# Initialize databases
python scripts/init_databases.py

# Run migrations
python scripts/run_migrations.py
```

### Environment Variables
```env
# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=buildaiforme
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password

# MySQL
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=buildaiforme
MYSQL_USER=root
MYSQL_PASSWORD=your_password

# MongoDB
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DATABASE=buildaiforme
MONGO_USER=admin
MONGO_PASSWORD=your_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password
REDIS_DB=0
```

## Configuration Templates

### PostgreSQL Configuration
```yaml
# config/postgresql.yml
postgresql:
  version: "15"
  settings:
    max_connections: 200
    shared_buffers: "256MB"
    effective_cache_size: "1GB"
    maintenance_work_mem: "64MB"
    checkpoint_completion_target: 0.9
    wal_buffers: "16MB"
    default_statistics_target: 100
    random_page_cost: 1.1
    effective_io_concurrency: 200
    work_mem: "4MB"
    min_wal_size: "1GB"
    max_wal_size: "4GB"
    max_worker_processes: 8
    max_parallel_workers_per_gather: 4
    max_parallel_workers: 8
    max_parallel_maintenance_workers: 4

  replication:
    enabled: true
    master:
      host: "postgres-master"
      port: 5432
    slaves:
      - host: "postgres-slave-1"
        port: 5432
      - host: "postgres-slave-2"
        port: 5432

  backup:
    enabled: true
    schedule: "0 2 * * *"  # Daily at 2 AM
    retention_days: 30
    compression: true
    encryption: true
```

### MySQL Configuration
```yaml
# config/mysql.yml
mysql:
  version: "8.0"
  settings:
    innodb_buffer_pool_size: "1G"
    innodb_log_file_size: "256M"
    innodb_flush_log_at_trx_commit: 2
    innodb_flush_method: O_DIRECT
    max_connections: 200
    query_cache_size: "64M"
    query_cache_type: 1
    tmp_table_size: "64M"
    max_heap_table_size: "64M"
    table_open_cache: 2000
    thread_cache_size: 16
    key_buffer_size: "128M"

  replication:
    enabled: true
    master:
      host: "mysql-master"
      port: 3306
    slaves:
      - host: "mysql-slave-1"
        port: 3306
      - host: "mysql-slave-2"
        port: 3306

  backup:
    enabled: true
    schedule: "0 2 * * *"
    retention_days: 30
    compression: true
```

### MongoDB Configuration
```yaml
# config/mongodb.yml
mongodb:
  version: "6.0"
  settings:
    storage:
      dbPath: "/data/db"
      journal:
        enabled: true
    systemLog:
      destination: file
      path: "/var/log/mongodb/mongod.log"
      logAppend: true
    net:
      port: 27017
      bindIp: 0.0.0.0
    operationProfiling:
      slowOpThresholdMs: 100
      mode: slowOp

  replication:
    enabled: true
    replicaSetName: "rs0"
    members:
      - host: "mongo-1"
        port: 27017
        priority: 2
      - host: "mongo-2"
        port: 27017
        priority: 1
      - host: "mongo-3"
        port: 27017
        priority: 1

  backup:
    enabled: true
    schedule: "0 2 * * *"
    retention_days: 30
    compression: true
```

### Redis Configuration
```yaml
# config/redis.yml
redis:
  version: "7.0"
  settings:
    maxmemory: "2gb"
    maxmemory-policy: "allkeys-lru"
    save: "900 1 300 10 60 10000"
    appendonly: "yes"
    appendfsync: "everysec"
    tcp-keepalive: 300
    timeout: 0
    tcp-backlog: 511

  clustering:
    enabled: true
    nodes:
      - host: "redis-1"
        port: 6379
        role: "master"
      - host: "redis-2"
        port: 6379
        role: "slave"
      - host: "redis-3"
        port: 6379
        role: "slave"

  persistence:
    enabled: true
    rdb: true
    aof: true
    save_interval: 900
```

## Connection Management

### Connection Pooling
```python
# config/connection_pools.py
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

# PostgreSQL connection pool
postgres_pool = QueuePool(
    creator=lambda: create_engine(
        "postgresql://user:pass@localhost/db",
        poolclass=QueuePool,
        pool_size=20,
        max_overflow=30,
        pool_timeout=30,
        pool_recycle=3600
    )
)

# MySQL connection pool
mysql_pool = QueuePool(
    creator=lambda: create_engine(
        "mysql://user:pass@localhost/db",
        poolclass=QueuePool,
        pool_size=15,
        max_overflow=25,
        pool_timeout=30,
        pool_recycle=3600
    )
)

# Redis connection pool
redis_pool = redis.ConnectionPool(
    host='localhost',
    port=6379,
    db=0,
    max_connections=20,
    retry_on_timeout=True
)
```

### Failover Configuration
```python
# config/failover.py
FAILOVER_CONFIG = {
    "postgresql": {
        "primary": {
            "host": "postgres-primary",
            "port": 5432,
            "weight": 1
        },
        "replicas": [
            {
                "host": "postgres-replica-1",
                "port": 5432,
                "weight": 0.8
            },
            {
                "host": "postgres-replica-2",
                "port": 5432,
                "weight": 0.6
            }
        ],
        "health_check_interval": 30,
        "failover_timeout": 60
    }
}
```

## Migration Tools

### Migration Scripts
```python
# scripts/migrations.py
from alembic import command
from alembic.config import Config

def run_migrations(database_url, migration_path):
    """Run database migrations"""
    alembic_cfg = Config()
    alembic_cfg.set_main_option("script_location", migration_path)
    alembic_cfg.set_main_option("sqlalchemy.url", database_url)

    # Run migrations
    command.upgrade(alembic_cfg, "head")

def create_migration(message):
    """Create a new migration"""
    alembic_cfg = Config()
    alembic_cfg.set_main_option("script_location", "migrations")

    # Create migration
    command.revision(alembic_cfg, message=message, autogenerate=True)
```

### Migration Configuration
```ini
# alembic.ini
[alembic]
script_location = migrations
sqlalchemy.url = postgresql://user:pass@localhost/db

[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S
```

## Backup and Recovery

### Backup Strategies
```python
# scripts/backup.py
import subprocess
import datetime
import os

def backup_postgresql(host, port, database, user, password, backup_dir):
    """Backup PostgreSQL database"""
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = f"{backup_dir}/{database}_{timestamp}.sql"

    # Create backup
    cmd = [
        "pg_dump",
        f"--host={host}",
        f"--port={port}",
        f"--username={user}",
        f"--dbname={database}",
        f"--file={backup_file}",
        "--verbose",
        "--format=custom",
        "--compress=9"
    ]

    env = os.environ.copy()
    env["PGPASSWORD"] = password

    subprocess.run(cmd, env=env, check=True)
    return backup_file

def backup_mysql(host, port, database, user, password, backup_dir):
    """Backup MySQL database"""
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = f"{backup_dir}/{database}_{timestamp}.sql"

    # Create backup
    cmd = [
        "mysqldump",
        f"--host={host}",
        f"--port={port}",
        f"--user={user}",
        f"--password={password}",
        "--single-transaction",
        "--routines",
        "--triggers",
        database
    ]

    with open(backup_file, 'w') as f:
        subprocess.run(cmd, stdout=f, check=True)

    return backup_file
```

### Recovery Procedures
```python
# scripts/recovery.py
def restore_postgresql(host, port, database, user, password, backup_file):
    """Restore PostgreSQL database"""
    cmd = [
        "pg_restore",
        f"--host={host}",
        f"--port={port}",
        f"--username={user}",
        f"--dbname={database}",
        "--verbose",
        "--clean",
        "--if-exists",
        backup_file
    ]

    env = os.environ.copy()
    env["PGPASSWORD"] = password

    subprocess.run(cmd, env=env, check=True)

def restore_mysql(host, port, database, user, password, backup_file):
    """Restore MySQL database"""
    cmd = [
        "mysql",
        f"--host={host}",
        f"--port={port}",
        f"--user={user}",
        f"--password={password}",
        database
    ]

    with open(backup_file, 'r') as f:
        subprocess.run(cmd, stdin=f, check=True)
```

## Performance Optimization

### Indexing Strategies
```sql
-- PostgreSQL indexing
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders(user_id);
CREATE INDEX CONCURRENTLY idx_orders_created_at ON orders(created_at);

-- Composite indexes
CREATE INDEX CONCURRENTLY idx_orders_user_created ON orders(user_id, created_at);
CREATE INDEX CONCURRENTLY idx_products_category_price ON products(category, price);

-- Partial indexes
CREATE INDEX CONCURRENTLY idx_active_users ON users(email) WHERE is_active = true;
CREATE INDEX CONCURRENTLY idx_recent_orders ON orders(created_at) WHERE created_at > NOW() - INTERVAL '30 days';
```

### Query Optimization
```python
# config/query_optimization.py
QUERY_OPTIMIZATION = {
    "postgresql": {
        "enable_seqscan": False,
        "enable_indexscan": True,
        "enable_bitmapscan": True,
        "enable_hashjoin": True,
        "enable_mergejoin": True,
        "enable_nestloop": True,
        "random_page_cost": 1.1,
        "effective_cache_size": "1GB",
        "work_mem": "4MB"
    },
    "mysql": {
        "innodb_buffer_pool_size": "1G",
        "innodb_log_file_size": "256M",
        "query_cache_size": "64M",
        "tmp_table_size": "64M",
        "max_heap_table_size": "64M"
    }
}
```

## Security Configuration

### SSL/TLS Configuration
```yaml
# config/security.yml
security:
  ssl:
    enabled: true
    certificate_file: "/etc/ssl/certs/db.crt"
    private_key_file: "/etc/ssl/private/db.key"
    ca_certificate_file: "/etc/ssl/certs/ca.crt"
    require_client_cert: true

  encryption:
    enabled: true
    algorithm: "AES-256-GCM"
    key_rotation_days: 90

  access_control:
    enabled: true
    allowed_networks:
      - "10.0.0.0/8"
      - "172.16.0.0/12"
      - "192.168.0.0/16"
    max_connections_per_ip: 10
```

### User Management
```sql
-- PostgreSQL user management
CREATE USER app_user WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE buildaiforme TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- MySQL user management
CREATE USER 'app_user'@'%' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON buildaiforme.* TO 'app_user'@'%';
FLUSH PRIVILEGES;
```

## Monitoring and Alerting

### Performance Monitoring
```python
# config/monitoring.py
MONITORING_CONFIG = {
    "metrics": {
        "connection_count": True,
        "query_performance": True,
        "slow_queries": True,
        "lock_wait_time": True,
        "cache_hit_ratio": True,
        "disk_usage": True
    },
    "alerts": {
        "high_connection_count": {
            "threshold": 80,
            "notification": "email"
        },
        "slow_queries": {
            "threshold": 1000,  # ms
            "notification": "slack"
        },
        "disk_usage": {
            "threshold": 85,  # %
            "notification": "email"
        }
    }
}
```

### Health Checks
```python
# scripts/health_check.py
def check_database_health(database_url):
    """Check database health"""
    try:
        engine = create_engine(database_url)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            return result.scalar() == 1
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return False

def check_replication_lag(primary_url, replica_url):
    """Check replication lag"""
    try:
        # Check primary
        primary_engine = create_engine(primary_url)
        with primary_engine.connect() as conn:
            primary_time = conn.execute(text("SELECT NOW()")).scalar()

        # Check replica
        replica_engine = create_engine(replica_url)
        with replica_engine.connect() as conn:
            replica_time = conn.execute(text("SELECT NOW()")).scalar()

        lag = (primary_time - replica_time).total_seconds()
        return lag < 60  # Less than 1 minute lag
    except Exception as e:
        logger.error(f"Replication lag check failed: {e}")
        return False
```

## Support and Documentation

### Documentation
- [Installation Guide](./docs/installation-guide.md)
- [Configuration Guide](./docs/configuration-guide.md)
- [Migration Guide](./docs/migration-guide.md)
- [Troubleshooting Guide](./docs/troubleshooting-guide.md)

### Support Channels
- **Email Support**: support@buildaiforme.com
- **Documentation**: docs.buildaiforme.com
- **Community Forum**: community.buildaiforme.com

---

*This database configuration system provides standardized, secure, and optimized database setups for all BuildAIFor.Me services.*
