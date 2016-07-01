export default const query = `CREATE TABLE meter(
    id SERIAL NOT NULL,
    user_app_id INT,
    meter_type VARCHAR(256),
    street VARCHAR(256),
    street_number VARCHAR(256),
    zip_code VARCHAR(5),
    city VARCHAR(256),
    status VARCHAR(256),
    peer_id INT,
    contracted_power INT,
    province_id INT,
    meter_code VARCHAR(256) UNIQUE,
    uuid VARCHAR(36),
    PRIMARY KEY (id)
)
ON CONFLICT DO IGNORE`;
