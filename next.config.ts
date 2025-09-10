/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('next').NextConfig} */
const { version } = require("./package.json");

const nextConfig = {
	env: {
		APP_VERSION: version,
	},
};

module.exports = nextConfig;
