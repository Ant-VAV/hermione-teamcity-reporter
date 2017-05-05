'use strict';

const tsm = require('teamcity-service-messages');

const formatTestName = (test) => {
    const fullTitle = test.fullTitle().trim();

    return `${fullTitle} [${test.browserId}]`;
};

module.exports = {
    onTestPending: (test) => tsm.testIgnored({name: formatTestName(test)}),

    onTestPass: (test) => {
        const testName = formatTestName(test);

        tsm
            .testStarted({name: testName})
            .testFinished({
                name: testName,
                duration: test.duration || 0
            });
    },

    onTestFail: (test) => {
        const testName = formatTestName(test);

        tsm
            .testStarted({name: testName})
            .testFailed({
                name: testName,
                message: '_______________testFailedMessage_______________',
                details: '_____________-_testFailedDetails_-_____________'
            })
            .testFinished({
                name: testName,
                duration: test.duration || test.hook && test.hook.duration || 0
            });
    }
};
