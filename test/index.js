import chai, {expect} from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import {getEventFromObject, run} from "./mocks";
import {handler} from "index";
import getDb from "services/db";
// import query from "../script/meter-creation-query";

describe("On pilot sensor insert", () => {

    const METER_CODE = "IT0000000001";
    const db = getDb();

    sinon.useFakeTimers();

    // before(async () => {
    //     await db.query(query);
    // });

    beforeEach(async () => {
        await db.query({
            text: "DELETE FROM meter"
        });
    });

    it("INSERT on postgres", async () => {
        const event = getEventFromObject({
            id: "eventId",
            data: {
                element: {
                    id: "unique-id",
                    name: METER_CODE,
                    isPilot: true
                },
                id: "unique-id"
            },
            type: "element inserted in collection sensors"
        });

        await run(handler, event);

        const meterOnDb = await db.row(
            `SELECT * FROM meter WHERE meter_code = '${METER_CODE}'`);

        console.log(meterOnDb);
        expect(meterOnDb).to.not.be.null;
        expect(meterOnDb.uuid).equals("unique-id");
    });

    it("UPDATE on postgres", async () => {
        db.query(`INSERT INTO meter (meter_code, uuid)
            VALUES('${METER_CODE}', 'first-id')`);
        const event = getEventFromObject({
            id: "eventId",
            data: {
                element: {
                    id: "unique-id",
                    name: METER_CODE,
                    isPilot: true
                },
                id: "unique-id"
            },
            type: "element inserted in collection sensors"
        });

        await run(handler, event);

        const meterOnDb = await db.row(
            `SELECT * FROM meter WHERE meter_code = '${METER_CODE}'`);

        console.log(meterOnDb);
        expect(meterOnDb).to.not.be.null;
        expect(meterOnDb.uuid).equals("unique-id");
    });

    it("SKIP if not pilot sensor", async () => {
        const event = getEventFromObject({
            id: "eventId",
            data: {
                element: {
                    id: "unique-id",
                    name: METER_CODE,
                    isPilot: false
                },
                id: "unique-id"
            },
            type: "element inserted in collection sensors"
        });

        await run(handler, event);

        const meterOnDb = await db.rows(
            `SELECT * FROM meter WHERE meter_code = '${METER_CODE}'`);

        console.log(meterOnDb);
        expect(meterOnDb).to.deep.equal([]);
    });

});
