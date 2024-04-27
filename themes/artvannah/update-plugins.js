const { exec } = require('child_process');

const gitAdd = () => {
    exec('git add ../../plugins', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);

            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);

            return;
        }

        console.log(`stdout: ${stdout}`);
        console.log('Plugins have been updated and added to the next commit, you can use the following message');
        console.log('🆙 [PLUGINS] Update all plugins');
    });
}

const update = async () => {
  await exec('wp plugin update --all', (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);

          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);

          return;
      }

      gitAdd()
      console.log(`stdout: ${stdout}`);

  });
}

update()


