module.exports = {
	apps: [{
		name: 'partner-test-website',
		script: 'pnpm',
		args: 'start --port 3012',
		cwd: '/var/www/turbo/test/turbo-delivery-partner',
		env: {
			NODE_ENV: 'development',
			PORT: 3012 // Port sur lequel l'application va tourner
		}
	}]
}
