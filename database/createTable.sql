CREATE TYPE orderstatus AS ENUM (
    'pending',
    'confirmed',
    'preparing',
    'out_for_delivery',
    'delivered',
    'cancelled'
);

CREATE TYPE transactionstatus AS ENUM (
    'pending',
    'completed',
    'failed',
    'refunded'
);

create type paymentmethod as enum (
'cash_on_delivery',
'online'
)

CREATE TYPE category AS ENUM (
    'appetizer',
    'main_course',
    'dessert',
    'beverage',
    'side_dish'
);

create table users (
user_id serial primary key,
name varchar(50) not null,
phone varchar(15) not null
constraint verify_phone check (phone ilike '+91%'),
email varchar(255) not null
constraint verify_email check (email ilike '%@%.%'),
password varchar(255),
created_at timestamp default now()
);

create table transactions (
id serial primary key,
razorpay_transaction_id uuid default null,
payment_method paymentmethod default 'cash_on_delivery'::paymentmethod,
status transactionstatus default 'pending'::transactionstatus,
created_at timestamp default now(),
amount_paid decimal(10, 2),
constraint ensure_payment_method check
(payment_method != 'online'::paymentmethod or razorpay_transaction_id is not null)
);

create table location (
    id serial primary key,
    latitude float default null,
    longitude float default null,
    address text,
    zip_code varchar(6) constraint check_zip_code check (LENGTH(zip_code) = 6),
    constraint check_location check((latitude is null and longitude is null) or (address is not null))
);

create table orders (
    id serial primary key,
    user_id integer not null references users(user_id) on update cascade on delete cascade,
    transaction_id integer not null references transactions(id) on update cascade on delete cascade,
    created_at timestamp default now(),
    special_instructions text default null,
    total_price decimal(10, 2),
    status orderstatus default 'pending'::orderstatus,
    location_id integer not null references location(id) on update cascade on delete cascade
);

create table items (
    item_id serial primary key,
    name varchar(100) not null,
    category category not null,
    description text,
    price decimal(10, 2),
    image_url text,
    active boolean default true 
);

create table order_items (
    id serial primary key,
    order_id integer not null references orders(id) on update cascade on delete cascade,
    quantity integer default 1,
    item_id integer not null references items(item_id) on update cascade on delete cascade
)
