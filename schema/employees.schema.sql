CREATE TABLE whizlabs.employees (
    account_uuid UUID REFERENCES whizlabs.account(account_uuid),
    id VARCHAR not null,
    uuid VARCHAR unique NOT NULL,
    first_name VARCHAR(50) NOT null,
    last_name VARCHAR(50),
    avatar VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(50),
    company VARCHAR(50),
    job_title VARCHAR(50),
    is_profile BOOLEAN,
    created_at VARCHAR NOT null,
    updated_at VARCHAR NOT null
);