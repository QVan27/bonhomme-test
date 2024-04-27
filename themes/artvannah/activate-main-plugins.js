const { exec } = require('child_process');

const pluginList = 'all-in-one-wp-migration webp-converter-for-media gravityforms really-simple-ssl simple-history';

const activate = async () => {
  await exec(`wp plugin activate ${pluginList}`, (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);

          return;
      }

      console.log(`stdout: ${stdout}`);
  });
}

activate()
