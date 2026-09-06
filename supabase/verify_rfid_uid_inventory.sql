-- P03 READ ONLY. Works before/after its migration. No cards are changed.
-- collision: stop rollout and review the listed IDs/owners/history.
-- legacy_invalid: preserve the record; obtain a reader UID before new activation.
-- No rows means neither issue was found. This does not prove physical card identity.
with parsed as (
  select id, student_id, rfid_number,
    case when length(rfid_number) <= 64
      and upper(btrim(rfid_number, E' \t\r\n')) ~ '^([0-9A-F]+|[0-9A-F]{2}(:[0-9A-F]{2})+|[0-9A-F]{2}(-[0-9A-F]{2})+|[0-9A-F]{2}( [0-9A-F]{2})+)$'
      and length(translate(btrim(rfid_number, E' \t\r\n'), ': -', '')) in (8,14,20)
    then upper(translate(btrim(rfid_number, E' \t\r\n'), ': -', '')) end as uid
  from public.rfid_cards
), inventory as (
  select *, count(*) over (partition by uid) as equivalent_count from parsed
)
select case when uid is null then 'legacy_invalid' else 'collision' end as issue,
  id as card_id, student_id, rfid_number as stored_number, uid as normalized_uid,
  (select count(*) from public.attendance_records a where a.rfid_card_id = inventory.id) as attendance_count
from inventory where uid is null or equivalent_count > 1
order by issue, normalized_uid, card_id;
