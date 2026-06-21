-- Update the event location in the database to match the new address
UPDATE cfo_events 
SET location = '21st Floor, CMA Building, 64 Connaught Road Central, Central, Hong Kong'
WHERE location = 'Hong Kong Convention & Exhibition Centre';