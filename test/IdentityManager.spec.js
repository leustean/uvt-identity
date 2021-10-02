const IdentityManager = artifacts.require("IdentityManager");

contract("IdentityManager", accounts => {
    it("owner should be able to create student", async () => {
        const identityManagerInstance = await IdentityManager.deployed();

        await identityManagerInstance.createStudent({
            student: accounts[1],
            encryptedFirstName: [0],
            encryptedLastName: [1],
            encryptedData: [2],
            studentEncryptedSymmetricKey: [3],
            institutionEncryptedSymmetricKey: [4],
            institutionManaged: true
        }, {from: accounts[0]});


        const student = await identityManagerInstance.getStudent.call(accounts[1]);

        assert.equal(student.student, accounts[1]);
        assert.equal(student.encryptedFirstName, '0x00');
        assert.equal(student.encryptedLastName, '0x01');
        assert.equal(student.encryptedData, '0x02');
        assert.equal(student.studentEncryptedSymmetricKey, '0x03');
        assert.equal(student.institutionEncryptedSymmetricKey, '0x04');
        assert.equal(student.institutionManaged, true);
    });

    it("not owner should NOT be able to create student", async () => {
        const identityManagerInstance = await IdentityManager.deployed();

        try {
            await identityManagerInstance.createStudent({
                student: accounts[2],
                encryptedFirstName: [0],
                encryptedLastName: [1],
                encryptedData: [2],
                studentEncryptedSymmetricKey: [3],
                institutionEncryptedSymmetricKey: [4],
                institutionManaged: true
            }, {from: accounts[1]});
        } catch (error) {
            assert.equal(error.data.name, 'RuntimeError')
        }
    });

    it("owner should be able to update student name", async () => {
        const identityManagerInstance = await IdentityManager.deployed();

        await identityManagerInstance.createStudent({
            student: accounts[3],
            encryptedFirstName: [0],
            encryptedLastName: [1],
            encryptedData: [2],
            studentEncryptedSymmetricKey: [3],
            institutionEncryptedSymmetricKey: [4],
            institutionManaged: true
        }, {from: accounts[0]});

        await identityManagerInstance.setStudentName(accounts[3], "0x09", "0x10", {from: accounts[0]});

        const student = await identityManagerInstance.getStudent.call(accounts[3]);

        assert.equal(student.encryptedFirstName, '0x09');
        assert.equal(student.encryptedLastName, '0x10');
    });

    it("not owner should NOT be able to update student name", async () => {
        const identityManagerInstance = await IdentityManager.deployed();

        await identityManagerInstance.createStudent({
            student: accounts[4],
            encryptedFirstName: [0],
            encryptedLastName: [1],
            encryptedData: [2],
            studentEncryptedSymmetricKey: [3],
            institutionEncryptedSymmetricKey: [4],
            institutionManaged: true
        }, {from: accounts[0]});

        try {
            await identityManagerInstance.setStudentName(accounts[4], "0x09", "0x10", {from: accounts[1]});
        } catch (error) {
            assert.equal(error.data.name, 'RuntimeError')
        }
    });

    it("owner should be able to update student data", async () => {
        const identityManagerInstance = await IdentityManager.deployed();

        await identityManagerInstance.createStudent({
            student: accounts[5],
            encryptedFirstName: [0],
            encryptedLastName: [1],
            encryptedData: [2],
            studentEncryptedSymmetricKey: [3],
            institutionEncryptedSymmetricKey: [4],
            institutionManaged: true
        }, {from: accounts[0]});

        await identityManagerInstance.setStudentData(accounts[5], "0x20", {from: accounts[0]});

        const student = await identityManagerInstance.getStudent.call(accounts[5]);

        assert.equal(student.student, accounts[5]);
        assert.equal(student.encryptedData, '0x20');
    });

    it("not owner should NOT be able to update student data", async () => {
        const identityManagerInstance = await IdentityManager.deployed();

        await identityManagerInstance.createStudent({
            student: accounts[6],
            encryptedFirstName: [0],
            encryptedLastName: [1],
            encryptedData: [2],
            studentEncryptedSymmetricKey: [3],
            institutionEncryptedSymmetricKey: [4],
            institutionManaged: true
        }, {from: accounts[0]});

        try {
            await identityManagerInstance.setStudentData(accounts[6], "0x20", {from: accounts[1]});
        } catch (error) {
            assert.equal(error.data.name, 'RuntimeError')
        }
    });
});
