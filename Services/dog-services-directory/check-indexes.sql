-- Check existing indexes on the services table
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'services';

-- Check index usage statistics
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE tablename = 'services'
ORDER BY idx_scan DESC;

-- Check table statistics
SELECT 
    schemaname,
    tablename,
    n_tup_ins,
    n_tup_upd,
    n_tup_del,
    n_live_tup,
    n_dead_tup,
    last_vacuum,
    last_autovacuum
FROM pg_stat_user_tables 
WHERE tablename = 'services';

-- Analyze the services table to update statistics
ANALYZE services;

-- Check query plan for a sample search
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM services 
WHERE state = 'IN' AND service_type = 'groomer' 
ORDER BY name 
LIMIT 15; 