-- Flush all data from public tables (order matters for foreign keys)
DELETE FROM public.document_rows;
DELETE FROM public.document_metadata;
DELETE FROM public.documents;
DELETE FROM public.parking_vehicles;
DELETE FROM public.units;
DELETE FROM public.user_roles;
DELETE FROM public.profiles;