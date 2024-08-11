const { setupBefore, setupChai, removeTestDB, runSQLQuery } = require('./utils/test-utils');
const chai = setupChai();
const expect = chai.expect;

describe('Colors Spec', async () => {
    let DB_TEST_FILE, models, server;
    before(async () => ({ server, models, DB_TEST_FILE } = await setupBefore(__filename)));
    after(async () => await removeTestDB(DB_TEST_FILE));

    describe('Colors models has the correct constraints', async () => {

        it('The name of the Colors cannot be null', async () => {
            await expect(models.Colors.build({}).validate()).to.be.rejected
        });

        it('The Colors cannot be a non-string value', async () => {
            await expect(models.Colors.build({name: []}).validate()).to.be.rejected
        });

        it('The Colors has a valid name', async () => {
            await expect(models.Colors.build({name: 'Purple'}).validate()).to.be.fulfilled
        });

        it('The Colors are unique', async () => {
            await expect(models.Colors.create({name: 'Red'})).to.be.fulfilled
            await expect(models.Colors.create({name: 'Red'})).to.be.rejected
            const colors = await runSQLQuery("SELECT * FROM 'Colors';", DB_TEST_FILE);
            expect(colors).to.have.lengthOf(1);
        });
    });
});
