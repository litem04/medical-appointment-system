CREATE TABLE patients (
    patient_id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    full_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(100),
    medical_history TEXT
);
