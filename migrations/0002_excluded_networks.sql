-- Networks whose visits are never recorded (the site owner's home Wi-Fi).
-- Managed from /stats; an entry is an IPv4 /32 or an IPv6 /64 in CIDR form.

CREATE TABLE IF NOT EXISTS excluded_networks (
  cidr       TEXT    PRIMARY KEY,
  label      TEXT,
  created_at INTEGER NOT NULL  -- unix epoch milliseconds
);
