CREATE TABLE doctors (
    doctor_id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    full_name VARCHAR(100),
    specialization VARCHAR(100),
    license_number VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(100)
);
