-- Create a function to delete all analytics data related to a service
CREATE OR REPLACE FUNCTION delete_service_analytics(service_id TEXT)
RETURNS void
SECURITY DEFINER -- This means the function runs with the privileges of the creator
SET search_path = public -- This prevents search_path issues
LANGUAGE plpgsql
AS $$
BEGIN
    -- Delete from user_interaction_analytics
    DELETE FROM user_interaction_analytics
    WHERE target_id = service_id
    AND target_type = 'service';

    -- Delete from search_analytics where service_type matches
    -- (if you store service IDs in search analytics)
    DELETE FROM search_analytics
    WHERE service_type = service_id;

    -- Delete from page_view_analytics where the URL contains the service ID
    -- (if you store service-specific page views)
    DELETE FROM page_view_analytics
    WHERE page_url LIKE '%' || service_id || '%';
END;
$$; 