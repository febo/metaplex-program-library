// @ts-check
'use strict';
const path = require('path');

const localDeployDir = path.join(__dirname, 'target', 'deploy');
const {LOCALHOST, tmpLedgerDir} = require('@metaplex-foundation/amman');

function localDeployPath(programName) {
    return path.join(localDeployDir, `${programName}.so`);
}

const programs = {
    metadata: {
        label: "Metadata",
        programId: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
        deployPath: localDeployPath('mpl_token_metadata')
    },
    token_sale: {
        label: "Fixed Price Token Sale",
        programId: 'SaLeTjyUa5wXHnGuewUSyJ5JWZaHwz3TxqUntCE9czo',
        deployPath: localDeployPath('mpl_fixed_price_sale'),
    },
    candy_machine: {
        label: "Candy Machine",
        programId: 'cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ',
        deployPath: localDeployPath('mpl_candy_machine'),
    },
    candy_machine_core: {
        label: "Candy Machine Core",
        programId: 'cndy3CZK71ZHMp9ddpq5NVvQDx33o6cCYDf4JBAWCk7',
        deployPath: localDeployPath('mpl_candy_machine_core'),
    },
    candy_guard: {
        label: "Candy Guard",
        programId: 'grd1hVewsa8dR1T1JfSFGzQUqgWmc1xXZ3uRRFJJ8XJ',
        deployPath: localDeployPath('mpl_candy_guard'),
    },
    hydra: {
        label: 'Hydra',
        programId: 'hyDQ4Nz1eYyegS6JfenyKwKzYxRsCWCriYSAjtzP4Vg',
        deployPath: localDeployPath('mpl_hydra'),
    },
};

const validator = {
    killRunningValidators: true,
    programs,
    commitment: 'singleGossip',
    resetLedger: true,
    verifyFees: false,
    jsonRpcUrl: LOCALHOST,
    limitLedgerSize: 999999,
    websocketUrl: '',
    ledgerDir: tmpLedgerDir(),
};

module.exports = {
    programs,
    validator,
    relay: {
        enabled: true,
        killRunningRelay: true,
    },
};
