import getDb from "services/db";

export default async function pipeline (event) {

    var sensor = event.data.element || {};

    // skip if not a pilot sensor
    if (!sensor.isPilot) {
        return null;
    }

    // get sensorId and podId
    const podId = sensor.name;
    const sensorId = sensor.id;

    // upsert
    const db = getDb();
    await db.query(`
        INSERT INTO meter (meter_code, uuid)
            VALUES('${podId}', '${sensorId}')

        ON CONFLICT (meter_code) DO UPDATE
            SET uuid = EXCLUDED.uuid`
    );

    return null;
}
